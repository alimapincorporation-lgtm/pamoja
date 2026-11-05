/* AI assistant UI. TEST BUILD: replies come from a small rule-based responder over SAMPLE data (no AI model is connected).
   It only reports what is in the data, shows when it was last updated, and never confirms a booking. In production the replies
   come from the backend AI orchestration service, which uses the same permission-checked APIs as the rest of the site. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var ui = P.ui, esc = ui.esc;
  var CITIES = { kampala: "Kampala", entebbe: "Entebbe", nairobi: "Nairobi", "dar es salaam": "Dar es Salaam", dar: "Dar es Salaam", zanzibar: "Zanzibar", jinja: "Jinja" };
  var CCOUNTRY = { Kampala: "UG", Entebbe: "UG", Jinja: "UG", Nairobi: "KE", "Dar es Salaam": "TZ", Zanzibar: "TZ" };

  function parseBudget(t) {
    var m = t.match(/([\d][\d,\.]*)\s*(k|m)?(?![a-z])/i); if (!m) return null;
    var n = parseFloat(m[1].replace(/,/g, "")); if (!n) return null; if (/k/i.test(m[2] || "")) n *= 1000; if (/m/i.test(m[2] || "")) n *= 1e6;
    return n >= 1000 ? n : null;
  }
  function parse(t) {
    var s = t.toLowerCase(), o = { city: null, budget: parseBudget(s), nights: (s.match(/(\d+)\s*night/) || [])[1] };
    Object.keys(CITIES).forEach(function (k) { if (s.indexOf(k) > -1 && !o.city) o.city = CITIES[k]; });
    o.intent = /hotel|room|stay|accommodation|sleep|lodg|guest ?house/.test(s) ? "hotels" : /tour|safari|day trip|excursion/.test(s) ? "tours" : /restaurant|eat|food|dinner|lunch|cafe|café/.test(s) ? "restaurants" : /transport|airport|taxi|transfer|shuttle|car hire|ride/.test(s) ? "transport" : /stadium|match|game|fixture|parking|gate/.test(s) ? "stadiums" : /event|festival|things to do|activities/.test(s) ? "events" : /visit|attraction|destination|see|plan|itinerary/.test(s) ? "destinations" : null;
    o.nearStadium = /stadium|near the match|close to the (?:stadium|ground)/.test(s);
    return o;
  }
  function mini(res, it, note) {
    return '<div class="mini"><span class="icon-tile">' + P.icon(ui.ICON[res]) + '</span><div style="min-width:0"><h3><a href="' + (ui.DETAIL[res] ? ui.detailUrl(res, it.id) : ui.url(ui.LIST[res])) + '" style="text-decoration:underline">' + esc(it.name || it.title) + "</a></h3><p>" + note + '</p><div class="row"><a class="btn btn-outline btn-sm" href="' + ui.mapsUrl(it) + '" target="_blank" rel="noopener">' + P.icon("map-pin") + "Get directions</a></div></div></div>";
  }
  function respond(text) {
    var o = parse(text), q = { pageSize: 20 }; if (o.city) q.country = CCOUNTRY[o.city];
    if (!o.intent) return Promise.resolve({ html: "<p>I can help you find hotels, tours, restaurants, transport, stadium information and events. Try “Find a hotel in Kampala under UGX 200,000 near the stadium”.</p>" });
    if (o.intent === "hotels") {
      return P.api.list("hotels", q).then(function (r) {
        var list = r.items; if (o.city) list = list.filter(function (h) { return h.city === o.city; });
        var withBudget = o.budget ? list.filter(function (h) { return h.priceFrom <= o.budget; }) : list;
        var open = withBudget.filter(function (h) { return h.rooms.some(function (x) { return x.availability === "available" || x.availability === "limited"; }); });
        if (o.nearStadium) open.sort(function (a, b) { return a.distanceKm - b.distanceKm; });
        if (!open.length) {
          var why = withBudget.length ? "None of the matching hotels show available rooms in the sample data." : (o.budget ? "No hotels in the sample data are listed at or below " + o.budget.toLocaleString("en-US") + "." : "No hotels match.");
          return { html: "<p>" + why + " Try a higher budget or another city, or <a href=\"" + ui.url("hotels") + '" style="text-decoration:underline">browse all hotels</a>. I can’t see availability that hasn’t been entered by a hotel.</p>' };
        }
        var top = open.slice(0, 3);
        return { html: "<p>I found " + open.length + " option" + (open.length > 1 ? "s" : "") + (o.city ? " in " + esc(o.city) : "") + (o.budget ? " from " + o.budget.toLocaleString("en-US") + " or less per night" : "") + ". Showing the best " + top.length + ". These are recommendations, not bookings.</p>" +
          top.map(function (h) { var old = Math.max.apply(null, h.rooms.map(function (x) { return x.updatedDaysAgo; })), f = ui.freshness(old); return mini("hotels", h, ui.money(h.priceFrom, h.currency) + " / night" + (h.distanceKm ? " · about " + h.distanceKm + " km from " + h.stadium : "") + " · " + f.label.toLowerCase() + (f.stale ? " — confirm before booking" : "")); }).join("") +
          "<p style=\"margin-top:8px\">Availability is checked again before any booking.</p>" };
      });
    }
    if (o.intent === "stadiums") return P.api.list("stadiums", q).then(function (r) { return { html: "<p>Here are the stadiums in the sample data. Entrances, parking and accessibility are not confirmed yet, so I can’t tell you which gate to use.</p>" + r.items.map(function (s) { return mini("stadiums", s, esc(s.city) + ", " + esc(s.countryName) + " · details to be confirmed by the venue"); }).join("") }; });
    var map = { tours: "tours", restaurants: "restaurants", transport: "transport", events: "events", destinations: "destinations" }, res = map[o.intent];
    return P.api.list(res, q).then(function (r) {
      var l = r.items; if (o.city) l = l.filter(function (i) { return i.city === o.city; }); if (o.budget && res === "tours") l = l.filter(function (i) { return i.priceFrom <= o.budget; });
      if (!l.length) return { html: "<p>I couldn’t find a match in the sample data" + (o.city ? " for " + esc(o.city) : "") + ". You can <a href=\"" + ui.url(ui.LIST[res]) + '" style="text-decoration:underline">browse all ' + ui.LABEL[res].toLowerCase() + "</a>.</p>" };
      return { html: "<p>Here " + (l.length > 1 ? "are some options" : "is an option") + " from the sample data. Check details with the provider before you plan around them.</p>" + l.slice(0, 3).map(function (i) { return mini(res, i, esc([i.city, i.countryName].filter(Boolean).join(", ")) + (i.priceFrom ? " · from " + ui.money(i.priceFrom, i.currency) : "") + (i.priceNote ? " · " + esc(i.priceNote) : "") + (i.date ? " · " + ui.date(i.date) : "")); }).join("") };
    });
  }

  P.assistant = {
    mount: function (el) {
      el.innerHTML = '<div class="chat"><div class="chat-log" role="log" aria-live="polite" aria-label="Conversation"></div><div><div class="chat-suggest"></div><form class="chat-form" novalidate><label class="visually-hidden" for="chat-in">Ask a question</label><input id="chat-in" class="input" autocomplete="off" placeholder="Ask about hotels, tours, transport or stadiums" maxlength="300"><button class="btn btn-primary" type="submit">' + P.icon("send") + "Send</button></form></div></div>";
      var log = el.querySelector(".chat-log"), form = el.querySelector("form"), input = el.querySelector("input"), sug = el.querySelector(".chat-suggest");
      function add(cls, html) { var d = document.createElement("div"); d.className = "msg " + cls; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
      add("msg-ai", "<p>Hello! I’m the AFCON PAMOJA assistant preview. I can search the sample listings for hotels, tours, restaurants, transport and stadiums.</p><p style=\"margin-top:6px\"><b>This is a test build:</b> answers come from sample data, not a live AI model, and I never confirm bookings. <a href=\"" + ui.url("contact") + '" style="text-decoration:underline">Contact a person</a> any time.</p>');
      ["Find a hotel in Kampala under UGX 200,000 near the stadium", "Hotels in Nairobi under 12,000 KES", "Tours in Kenya", "Transport from the airport in Entebbe", "Where is the stadium in Dar es Salaam?"].forEach(function (s) { var b = document.createElement("button"); b.type = "button"; b.textContent = s; b.addEventListener("click", function () { ask(s); }); sug.appendChild(b); });
      function ask(text) {
        text = text.trim(); if (!text) return; add("msg-user", esc(text)); input.value = "";
        var t = add("msg-ai", '<span class="typing" aria-label="Assistant is typing"><i></i><i></i><i></i></span>');
        respond(text).then(function (r) { t.innerHTML = r.html; log.scrollTop = log.scrollHeight; }).catch(function () { t.innerHTML = "<p>Sorry, I couldn’t get that information right now. Please try again, or <a href=\"" + ui.url("contact") + '" style="text-decoration:underline">contact support</a>.</p>'; });
      }
      form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
      var q = ui.params().q; if (q) ask(q);
    }
  };
})(window.PAMOJA);
