/* Result cards for every resource type. One template, per-resource specs. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var ui = P.ui, esc = ui.esc;

  function hotelAvail(h) {
    var s = h.rooms.map(function (r) { return r.availability; });
    if (s.indexOf("available") > -1) return ui.badge("Available", "ok");
    if (s.indexOf("limited") > -1) return ui.badge("Limited", "warn");
    if (s.indexOf("unknown") > -1) return ui.badge("Check availability", "warn");
    return ui.badge("Fully booked", "neutral");
  }
  function oldest(h) { return Math.max.apply(null, h.rooms.map(function (r) { return r.updatedDaysAgo; })); }
  function loc(it) { return [it.city, it.countryName].filter(Boolean).join(", "); }
  function dirBtn(it) { return '<a class="btn btn-outline btn-sm" href="' + ui.mapsUrl(it) + '" target="_blank" rel="noopener">' + P.icon("map-pin") + "Directions</a>"; }
  function viewBtn(res, it, label) { return '<a class="btn btn-primary btn-sm" href="' + ui.detailUrl(res, it.id) + '">' + esc(label || "View details") + "</a>"; }

  var specs = {
    hotels: function (h) {
      var f = ui.freshness(oldest(h)), facts = h.facilities.slice(0, 3).map(ui.tag);
      if (h.distanceKm) facts.push(ui.tag("About " + h.distanceKm + " km from " + h.stadium));
      return { badges: hotelAvail(h), meta: loc(h), summary: h.summary, facts: facts.join("") + (f.stale ? ui.badge(f.label, "warn") : ""),
        price: 'From <span class="res-price">' + ui.money(h.priceFrom, h.currency) + "</span> <small>/ night</small>", foot: viewBtn("hotels", h) + dirBtn(h) };
    },
    destinations: function (d) { return { badges: ui.badge(d.category, "info"), meta: loc(d), summary: d.summary, facts: d.bestFor.map(ui.tag).join(""), foot: viewBtn("destinations", d, "Explore") + dirBtn(d) }; },
    tours: function (t) { return { badges: ui.badge(t.days + (t.days > 1 ? " days" : " day"), "info"), meta: t.provider + " · " + loc(t), summary: t.summary, facts: ui.tag(t.category) + ui.tag("Next date " + ui.date(t.dates[0])),
        price: 'From <span class="res-price">' + ui.money(t.priceFrom, t.currency) + "</span> <small>per person</small>", foot: viewBtn("tours", t) + '<button class="btn btn-outline btn-sm" type="button" data-action="enquire" data-type="tour" data-resource="tours" data-id="' + t.id + '">Request booking</button>' }; },
    transport: function (t) { return { badges: ui.badge(t.type, "info"), meta: loc(t), summary: t.summary, facts: t.areas.slice(0, 2).map(ui.tag).join(""), price: '<span class="res-price">' + esc(t.priceNote) + "</span>",
        foot: viewBtn("transport", t) + '<button class="btn btn-outline btn-sm" type="button" data-action="enquire" data-type="quote" data-resource="transport" data-id="' + t.id + '">Request a quote</button>' }; },
    businesses: function (b) { return { badges: ui.badge(b.category, "info"), meta: loc(b), summary: b.summary, facts: ui.tag(b.hours), foot: viewBtn("businesses", b) + dirBtn(b) }; },
    restaurants: function (r) { return { badges: ui.badge(r.price, "neutral"), meta: loc(r), summary: r.summary, facts: ui.tag(r.cuisine) + ui.tag(r.hours),
        foot: '<button class="btn btn-primary btn-sm" type="button" data-action="menu" data-id="' + r.id + '">View menu</button>' + (r.reservations ? '<button class="btn btn-outline btn-sm" type="button" data-action="enquire" data-type="table" data-resource="restaurants" data-id="' + r.id + '">Request a table</button>' : '<button class="btn btn-outline btn-sm" type="button" data-action="enquire" data-type="enquiry" data-resource="restaurants" data-id="' + r.id + '">Send enquiry</button>') + dirBtn(r) }; },
    events: function (e) { return { badges: ui.badge(e.free ? "Free" : "Ticketed", e.free ? "ok" : "neutral"), meta: ui.date(e.date) + " · " + e.time + " · " + loc(e), title: e.title, summary: e.summary, facts: ui.tag(e.type) + ui.tag(e.venue),
        foot: '<button class="btn btn-primary btn-sm" type="button" data-action="calendar" data-id="' + e.id + '">' + P.icon("calendar") + "Add to calendar</button>" + dirBtn(e) }; },
    news: function (n) { return { badges: ui.badge(n.tag, "info"), meta: ui.date(n.date, { day: "numeric", month: "short", year: "numeric" }) + " · " + n.author, title: n.title, summary: n.summary, foot: '<button class="btn btn-primary btn-sm" type="button" data-action="read-news" data-id="' + n.id + '">Read</button>' }; },
    stadiums: function (s) { return { badges: ui.badge("Venue information", "info"), meta: loc(s), summary: s.summary, facts: s.alias ? ui.tag("Also known as " + s.alias) : "", foot: viewBtn("stadiums", s, "View stadium") + dirBtn(s) }; }
  };

  function matchCard(m) {
    var up = m.status === "upcoming";
    return '<article class="card" style="padding:16px;display:grid;gap:8px"><div class="res-meta">' + esc(m.competition) + " · " + esc(m.stage) + "</div>" +
      '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;font-family:var(--font-display);font-weight:600"><span>' + esc(m.home) + '</span><span class="badge ' + (up ? "badge-info" : "badge-neutral") + '">' + (up ? esc(m.time) : esc(m.score)) + "</span><span style=\"text-align:right\">" + esc(m.away) + "</span></div>" +
      '<div class="res-meta">' + ui.date(m.date) + " · " + esc(m.stadiumName) + ', ' + esc(m.city) + "</div></article>";
  }

  P.cards = {
    render: function (resource, it) {
      if (resource === "matches") return matchCard(it);
      var s = specs[resource](it);
      return '<article class="res-card"><div class="res-media ' + ui.tone(it.id) + '">' + P.icon(ui.ICON[resource]) + '<div class="badges">' + (s.badges || "") + ui.badge("Sample", "placeholder") + "</div></div>" +
        '<div class="res-body"><h3>' + esc(s.title || it.name) + '</h3><div class="res-meta">' + P.icon("map-pin") + "<span>" + esc(s.meta || "") + "</span></div>" +
        '<p class="res-summary">' + esc(s.summary) + "</p>" + (s.facts ? '<div class="res-facts">' + s.facts + "</div>" : "") + (s.price ? "<div>" + s.price + "</div>" : "") + "</div>" +
        '<div class="res-foot">' + (s.foot || "") + "</div></article>";
    }
  };
})(window.PAMOJA);
