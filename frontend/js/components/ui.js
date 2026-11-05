/* Shared UI helpers: escaping, formatting, URLs, states, tabs, delegated actions. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var DETAIL = { hotels: "hotelDetails", destinations: "destinationDetails", tours: "tourDetails", transport: "transportDetails", businesses: "businessDetails", stadiums: "stadiumDetails" };
  var LIST = { hotels: "hotels", destinations: "destinations", tours: "tours", transport: "transport", businesses: "businesses", restaurants: "restaurants", events: "events", news: "news", matches: "football", stadiums: "stadiums" };
  var LABEL = { hotels: "Hotels", destinations: "Destinations", tours: "Tours", transport: "Transport", businesses: "Businesses", restaurants: "Restaurants", events: "Events", news: "News", matches: "Matches", stadiums: "Stadiums" };
  var ICON = { hotels: "bed", destinations: "mountain", tours: "route", transport: "car", businesses: "store", restaurants: "utensils", events: "calendar", news: "ball", matches: "ball", stadiums: "stadium" };

  var ui = P.ui = {
    DETAIL: DETAIL, LIST: LIST, LABEL: LABEL, ICON: ICON,
    esc: function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); },
    base: function () { return document.body.getAttribute("data-base") || ""; },
    url: function (route, params) {
      var r = P.config.routes[route], q = [];
      Object.keys(params || {}).forEach(function (k) { if (params[k] !== "" && params[k] != null) q.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k])); });
      return ui.base() + r.href + (q.length ? "?" + q.join("&") : "");
    },
    detailUrl: function (resource, id) { return ui.url(DETAIL[resource], { id: id }); },
    params: function () { var o = {}; new URLSearchParams(location.search).forEach(function (v, k) { o[k] = v; }); return o; },
    money: function (n, cur) { return (cur ? cur + " " : "") + Number(n).toLocaleString("en-US"); },
    date: function (iso, opts) { return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", opts || { weekday: "short", day: "numeric", month: "short" }); },
    badge: function (text, kind) { return '<span class="badge badge-' + (kind || "neutral") + '">' + ui.esc(text) + "</span>"; },
    tone: function (id) { var h = 0; String(id).split("").forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) % 6; }); return "tone-" + (h + 1); },
    mapsUrl: function (it) {
      var dest = it.mapsQuery ? it.mapsQuery : it.lat + "," + it.lng;
      return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(dest);
    },
    freshness: function (days) {
      if (days == null) return { label: "Not updated", kind: "warn", stale: true };
      var label = days === 0 ? "Updated today" : days === 1 ? "Updated yesterday" : "Updated " + days + " days ago";
      return { label: label, kind: days > 2 ? "warn" : "neutral", stale: days > 2 };
    },
    availBadge: function (a) {
      return { available: ui.badge("Available · confirm before booking", "ok"), limited: ui.badge("Limited availability", "warn"), full: ui.badge("Fully booked", "neutral"), unknown: ui.badge("Availability unknown — enquire", "warn") }[a] || "";
    },
    state: function (kind, title, msg, actionHtml) {
      var ic = { empty: "search", error: "shield-check", missing: "compass" }[kind] || "search";
      return '<div class="state" role="' + (kind === "error" ? "alert" : "status") + '">' + P.icon(ic) + "<h3>" + ui.esc(title) + "</h3><p>" + ui.esc(msg) + "</p>" + (actionHtml || "") + "</div>";
    },
    skeletons: function (n) { var s = ""; for (var i = 0; i < n; i++) s += '<div class="skeleton" aria-hidden="true"></div>'; return '<div class="res-grid" aria-busy="true">' + s + '</div><span class="visually-hidden" role="status">Loading results</span>'; },
    tag: function (t) { return '<span class="tag">' + ui.esc(t) + "</span>"; },
    waUrl: function (phone, text) { return "https://wa.me/" + String(phone).replace(/[^0-9]/g, "") + "?text=" + encodeURIComponent(text); },
    contactButtons: function (it, label) {
      var call = it.phone ? '<a class="btn btn-outline" href="tel:' + ui.esc(it.phone.replace(/\s/g, "")) + '">' + P.icon("phone") + "Call now</a>" : '<button class="btn btn-outline" type="button" data-action="no-contact">' + P.icon("phone") + "Call now</button>";
      var wa = it.whatsapp ? '<a class="btn btn-outline" href="' + ui.waUrl(it.whatsapp, "Hello, I found " + it.name + " on AFCON PAMOJA and would like to ask about " + (label || "your services") + ".") + '" target="_blank" rel="noopener">' + P.icon("message") + "WhatsApp</a>" : '<button class="btn btn-outline" type="button" data-action="no-contact">' + P.icon("message") + "WhatsApp</button>";
      return call + wa;
    },
    initTabs: function (root) {
      var tabs = root.querySelectorAll('[role="tab"]');
      function select(t) {
        tabs.forEach(function (x) { var on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; var p = document.getElementById(x.getAttribute("aria-controls")); if (p) p.hidden = !on; });
      }
      tabs.forEach(function (t, i) {
        t.addEventListener("click", function () { select(t); });
        t.addEventListener("keydown", function (e) { var n = e.key === "ArrowRight" ? tabs[(i + 1) % tabs.length] : e.key === "ArrowLeft" ? tabs[(i - 1 + tabs.length) % tabs.length] : null; if (n) { n.focus(); select(n); } });
      });
    }
  };

  /* Delegated actions used by cards/details */
  P.actions = {
    init: function () {
      document.addEventListener("click", function (e) {
        var b = e.target.closest("[data-action]"); if (!b) return;
        var a = b.getAttribute("data-action"), res = b.getAttribute("data-resource"), id = b.getAttribute("data-id");
        if (a === "no-contact") { P.toast("This sample listing has no published phone number. Real listings will show a working call or WhatsApp link."); return; }
        if (a === "enquire" || a === "book") {
          P.api.get(res, id).then(function (it) { P.enquiry.open({ type: b.getAttribute("data-type") || "enquiry", resource: res, item: it, room: b.getAttribute("data-room") || "", trigger: b }); }).catch(function () { P.toast("We couldn’t load that listing. Please try again."); });
        }
        if (a === "read-news") P.api.get("news", id).then(function (it) { P.readers.news(it, b); });
        if (a === "menu") P.api.get("restaurants", id).then(function (it) { P.readers.menu(it, b); });
        if (a === "calendar") P.api.get("events", id).then(function (it) { P.readers.ics(it); });
      });
    }
  };

  /* Reader dialogs (news article, menu) and calendar export */
  function modal(title, sub, bodyHtml, trigger) {
    var d = document.createElement("dialog"); d.className = "modal";
    d.innerHTML = '<div class="modal-head"><div><h2>' + ui.esc(title) + "</h2>" + (sub ? "<p>" + ui.esc(sub) + "</p>" : "") + '</div><button class="icon-btn" type="button" aria-label="Close" data-close>' + P.icon("x") + '</button></div><div class="modal-body">' + bodyHtml + "</div>";
    document.body.appendChild(d);
    d.addEventListener("click", function (e) { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
    d.addEventListener("close", function () { d.remove(); if (trigger && trigger.focus) trigger.focus(); });
    d.showModal(); return d;
  }
  P.modal = modal;
  P.readers = {
    news: function (n, t) { modal(n.title, n.tag + " · " + ui.date(n.date, { day: "numeric", month: "long", year: "numeric" }) + " · " + n.author, '<div class="prose">' + n.body.map(function (p) { return "<p>" + ui.esc(p) + "</p>"; }).join("") + '<p class="form-note">Sample article for testing. Real articles will show their sources and last-updated date.</p></div>', t); },
    menu: function (r, t) { modal(r.name + " — menu", r.cuisine + " · " + r.price, '<ul class="menu-list">' + r.menu.map(function (m) { return "<li><span>" + ui.esc(m.item) + "</span><span>" + ui.esc(m.price) + "</span></li>"; }).join("") + '</ul><p class="form-note" style="margin-top:12px">Sample menu. Prices are set by the restaurant and may change.</p>', t); },
    ics: function (ev) {
      var d = ev.date.replace(/-/g, ""), t = ev.time.replace(":", "") + "00";
      var txt = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AFCON PAMOJA//Sample//EN", "BEGIN:VEVENT", "UID:" + ev.id + "@pamoja.sample", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z", "DTSTART:" + d + "T" + t, "SUMMARY:" + ev.title, "LOCATION:" + ev.venue + ", " + ev.city, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/calendar" })); a.download = ev.id + ".ics"; document.body.appendChild(a); a.click(); a.remove();
      P.toast("Calendar file downloaded.");
    }
  };
})(window.PAMOJA);
