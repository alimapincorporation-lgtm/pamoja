/* Generic detail page renderer. Mount: <div data-mount="detail" data-resource="hotels"></div>; the record id comes from ?id= */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var ui = P.ui, esc = ui.esc;
  function panel(title, inner) { return '<section class="panel"><h2>' + title + "</h2>" + inner + "</section>"; }
  function gallery(it) {
    var t = ui.tone(it.id), t2 = ui.tone(it.id + "b"), t3 = ui.tone(it.id + "c"), ic = P.icon(ui.ICON[ui._res]);
    return '<div><div class="gallery" role="img" aria-label="Photo placeholders"><div class="res-media ' + t + '">' + ic + '</div><div class="res-media ' + t2 + '">' + ic + '</div><div class="res-media ' + t3 + '">' + ic + '</div></div><p class="gallery-note">Photo placeholders. Approved photos appear here once the provider supplies them.</p></div>';
  }
  function chips(arr) { return '<div class="chip-list">' + arr.map(ui.tag).join("") + "</div>"; }
  function facts(list) { return '<div class="facts">' + list.filter(Boolean).map(function (f) { return '<div class="fact"><span>' + esc(f[0]) + "</span>" + esc(f[1]) + "</div>"; }).join("") + "</div>"; }
  function location(it, extra) {
    return panel("Location", '<div class="location-meta"><span>' + esc([it.city, it.countryName].filter(Boolean).join(", ")) + "</span>" + (extra || "") + '<span class="res-meta">Sample location, not yet verified by Alimap.</span></div>' + P.mapView.live(it) +
      '<p style="margin-top:12px"><button class="aside-link" style="text-align:left" type="button" data-action="enquire" data-type="report" data-resource="' + ui._res + '" data-id="' + it.id + '">Report an incorrect location or detail</button></p>');
  }
  function list(items, cls, ic) { return '<ul class="' + cls + '">' + items.map(function (x) { return "<li>" + P.icon(ic) + "<span>" + esc(x) + "</span></li>"; }).join("") + "</ul>"; }
  function ask(res, it, type, label, primary, room) { return '<button class="btn ' + (primary ? "btn-primary" : "btn-outline") + '" type="button" data-action="enquire" data-type="' + type + '" data-resource="' + res + '" data-id="' + it.id + '"' + (room ? ' data-room="' + esc(room) + '"' : "") + ">" + label + "</button>"; }
  function related(res, items, title) { return items.length ? '<section id="alternatives"><div class="row-head"><h2>' + title + '</h2></div><div class="res-grid">' + items.map(function (i) { return P.cards.render(res, i); }).join("") + "</div></section>" : ""; }

  var R = {
    hotels: function (h, rel) {
      var oldest = Math.max.apply(null, h.rooms.map(function (r) { return r.updatedDaysAgo; })), full = h.rooms.every(function (r) { return r.availability === "full"; });
      var rooms = h.rooms.map(function (r) {
        var f = ui.freshness(r.updatedDaysAgo), can = r.availability !== "full";
        return '<div class="room-item"><div class="room-top"><div><h3>' + esc(r.name) + '</h3><div class="sub">Sleeps ' + r.sleeps + " · " + ui.money(r.price, h.currency) + ' per night</div></div>' + ui.availBadge(r.availability) + '</div><div class="room-top"><span class="sub">' + esc(f.label) + (f.stale ? " — confirm before booking" : "") + "</span>" + (can ? ask("hotels", h, "booking", "Request this room", true, r.name) : '<span class="sub">Not available for the dates shown</span>') + "</div></div>";
      }).join("");
      var alt = full ? '<div class="alert alert-warn">' + P.icon("shield-check") + "<span><b>This hotel is fully booked.</b> Here are other participating hotels that may fit. Check availability before you book.</span></div>" : "";
      return { sub: h.stars + "-star · " + (h.distanceKm ? "about " + h.distanceKm + " km from " + h.stadium : h.city), badges: ui.badge("Verification pending (sample)", "neutral"),
        main: alt + gallery(h) + panel("About", "<p>" + esc(h.description) + "</p>") + facts([["Category", h.stars + " stars"], ["From", ui.money(h.priceFrom, h.currency) + " / night"], ["City", h.city], ["Booking", "Request to book"]]) + panel("Rooms and availability", '<div class="room-list">' + rooms + '</div><p class="form-note" style="margin-top:12px">Availability is entered by the hotel and re-checked at booking. Oldest room update: ' + ui.freshness(oldest).label.replace(/^Updated /, "").toLowerCase() + ".</p>") + panel("Facilities", chips(h.facilities)) + panel("Policies", "<p>" + esc(h.policies) + "</p>") + location(h) + related("hotels", rel.hotels, full ? "Alternatives that may fit" : "Other places to stay"),
        aside: '<div class="price"><small>From</small> ' + ui.money(h.priceFrom, h.currency) + " <small>/ night</small></div>" + (full ? '<a class="btn btn-primary" href="#alternatives">See available alternatives</a>' : ask("hotels", h, "booking", "Request to book", true)) + ask("hotels", h, "enquiry", "Send an enquiry") + ui.contactButtons(h, "your rooms") + '<a class="btn btn-outline" href="' + ui.mapsUrl(h) + '" target="_blank" rel="noopener">' + P.icon("map-pin") + "Get directions</a>", asideNote: "A request is not a confirmed booking. The hotel confirms availability and price first." };
    },
    destinations: function (d, rel) {
      return { sub: d.category + " · " + d.city, badges: "",
        main: gallery(d) + panel("About", "<p>" + esc(d.description) + "</p>") + facts([["Type", d.category], ["Country", d.countryName], ["Nearest town", d.city]]) + panel("Best for", chips(d.bestFor)) + panel("Travel tips", list(d.tips, "two-lists", "check").replace('<ul class="two-lists">', '<ul class="two-lists" style="display:grid;gap:6px;list-style:none">')) + location(d) + related("tours", rel.tours, "Tours in this area") + related("hotels", rel.hotels, "Places to stay nearby"),
        aside: "<strong>Plan your visit</strong>" + '<a class="btn btn-primary" href="' + ui.url("tours", { country: d.country }) + '">Browse tours</a><a class="btn btn-outline" href="' + ui.url("hotels", { country: d.country }) + '">Find a hotel</a><a class="btn btn-outline" href="' + ui.mapsUrl(d) + '" target="_blank" rel="noopener">' + P.icon("map-pin") + "Get directions</a>", asideNote: "Entry fees, permits and seasons change. Confirm with the park authority or a licensed operator." };
    },
    tours: function (t, rel) {
      return { sub: t.provider + " · " + t.days + (t.days > 1 ? " days" : " day"), badges: ui.badge("Verification pending (sample)", "neutral"),
        main: gallery(t) + panel("Overview", "<p>" + esc(t.summary) + "</p>") + facts([["Duration", t.days + (t.days > 1 ? " days" : " day")], ["From", ui.money(t.priceFrom, t.currency) + " pp"], ["Group size", "Up to " + t.capacity], ["Operator", t.provider]]) +
          panel("Itinerary", '<ol class="timeline">' + t.itinerary.map(function (s) { return "<li><h3>" + esc(s.day + " — " + s.title) + "</h3><p>" + esc(s.text) + "</p></li>"; }).join("") + "</ol>") +
          panel("What’s included", '<div class="two-lists"><div><h3>Included</h3>' + list(t.includes, "", "check") + '</div><div class="no"><h3>Not included</h3>' + list(t.excludes, "", "x") + "</div></div>") +
          panel("Upcoming dates", chips(t.dates.map(function (d) { return ui.date(d); })) + '<p class="form-note" style="margin-top:8px">Sample dates. The operator confirms availability when you request.</p>') + location(t) + related("tours", rel.tours, "More tours"),
        aside: '<div class="price"><small>From</small> ' + ui.money(t.priceFrom, t.currency) + " <small>per person</small></div>" + ask("tours", t, "tour", "Request a booking", true) + ask("tours", t, "enquiry", "Send an enquiry") + ui.contactButtons(t, "this tour"), asideNote: "A request is not a confirmed booking. The operator confirms dates and price first." };
    },
    transport: function (t) {
      return { sub: t.type + " · " + t.city, badges: ui.badge("Verification pending (sample)", "neutral"),
        main: panel("About", "<p>" + esc(t.summary) + "</p>") + facts([["Type", t.type], ["Hours", t.hours], ["Pricing", t.priceNote], ["City", t.city]]) +
          panel("Vehicles", '<div class="room-list">' + t.vehicles.map(function (v) { return '<div class="room-item"><div class="room-top"><h3>' + esc(v.type) + '</h3><span class="sub">' + v.seats + " seats · " + v.luggage + " bags</span></div></div>"; }).join("") + "</div>") +
          panel("Service areas", chips(t.areas)) + panel("Good to know", chips(t.features)) + panel("Licensing and insurance", "<p>Licence and insurance evidence has not been verified for this sample provider. The platform only shows “verified” once Alimap has checked the evidence.</p>") + location(t),
        aside: '<div class="price" style="font-size:var(--fs-lg)">' + esc(t.priceNote) + "</div>" + ask("transport", t, "quote", "Request a quote", true) + ask("transport", t, "enquiry", "Send an enquiry") + ui.contactButtons(t, "a transfer"), asideNote: "Prices are indicative. The provider sends a quote; nothing is booked until you accept it." };
    },
    businesses: function (b) {
      return { sub: b.category + " · " + b.city, badges: ui.badge("Verification pending (sample)", "neutral"),
        main: gallery(b) + panel("About", "<p>" + esc(b.summary) + "</p>") + facts([["Category", b.category], ["Hours", b.hours], ["City", b.city], ["Country", b.countryName]]) + panel("Services", chips(b.services)) + location(b),
        aside: ask("businesses", b, "enquiry", "Send an enquiry", true) + ui.contactButtons(b, "your services") + '<a class="btn btn-outline" href="' + ui.mapsUrl(b) + '" target="_blank" rel="noopener">' + P.icon("map-pin") + "Get directions</a>", asideNote: "Opening hours and services are provided by the business and may change. Call to confirm." };
    }
  };

  P.detail = {
    mount: function (el) {
      var res = el.getAttribute("data-resource"), id = ui.params().id; ui._res = res;
      var crumbs = document.querySelector("[data-crumbs]");
      function fail(title, msg) { el.innerHTML = '<div class="container page-body">' + ui.state("missing", title, msg, '<a class="btn btn-primary" href="' + ui.url(ui.LIST[res]) + '">Browse ' + ui.LABEL[res].toLowerCase() + "</a>") + "</div>"; }
      if (!id) { fail("No listing selected", "Choose a listing from the directory to see its details."); return; }
      el.innerHTML = '<div class="container page-body">' + ui.skeletons(1) + "</div>";
      P.api.get(res, id).then(function (it) {
        var relQ = res === "hotels" ? P.api.list("hotels", { country: it.country, pageSize: 4 }) : res === "tours" ? P.api.list("tours", { country: it.country, pageSize: 4 }) : res === "destinations" ? Promise.all([P.api.list("tours", { country: it.country, pageSize: 3 }), P.api.list("hotels", { country: it.country, pageSize: 3 })]) : Promise.resolve(null);
        return relQ.then(function (r) {
          var rel = { hotels: [], tours: [] };
          if (res === "hotels") rel.hotels = r.items.filter(function (x) { return x.id !== it.id; }).sort(function (a, b) { return (a.rooms.every(function (q) { return q.availability === "full"; }) ? 1 : 0) - (b.rooms.every(function (q) { return q.availability === "full"; }) ? 1 : 0); }).slice(0, 3);
          if (res === "tours") rel.tours = r.items.filter(function (x) { return x.id !== it.id; }).slice(0, 3);
          if (res === "destinations") { rel.tours = r[0].items; rel.hotels = r[1].items; }
          var v = R[res](it, rel);
          document.title = it.name + " — AFCON PAMOJA";
          if (crumbs) crumbs.innerHTML = '<li><a href="' + ui.url("home") + '">Home</a></li><li><a href="' + ui.url(ui.LIST[res]) + '">' + ui.LABEL[res] + "</a></li><li aria-current=\"page\">" + esc(it.name) + "</li>";
          document.querySelector("[data-title]").textContent = it.name;
          document.querySelector("[data-sub]").textContent = v.sub;
          document.querySelector("[data-badges]").innerHTML = v.badges + ui.badge("Sample listing", "placeholder");
          el.innerHTML = '<div class="container page-body"><div class="detail-layout"><div class="detail-main">' + v.main + '</div><aside class="detail-aside" aria-label="Contact and actions"><div class="aside-card">' + v.aside + '<p class="form-note">' + esc(v.asideNote) + "</p></div></aside></div></div>";
        });
      }).catch(function (e) { if (e && e.code === "NOT_FOUND") fail("We couldn’t find that listing", "It may have been removed or the link may be wrong."); else el.innerHTML = '<div class="container page-body">' + ui.state("error", "We couldn’t load this page", (e && e.message) || "Please try again.", '<button class="btn btn-primary" type="button" onclick="location.reload()">Try again</button>') + "</div>"; });
    }
  };
})(window.PAMOJA);
