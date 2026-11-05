/* Public stadium pages: overview, facilities & accessibility, events, travel & parking. Mount: <div data-mount="stadium" data-section="overview|facilities|events|travel"> */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var ui = P.ui, esc = ui.esc;
  var SECTIONS = [["overview", "stadiumDetails", "Overview"], ["facilities", "stadiumFacilities", "Facilities & accessibility"], ["events", "stadiumEvents", "Events"], ["travel", "stadiumTravel", "Travel & parking"]];
  function panel(t, i) { return '<section class="panel"><h2>' + t + "</h2>" + i + "</section>"; }
  function rows(arr, a, b) { return '<div class="room-list">' + arr.map(function (x) { return '<div class="room-item"><div class="room-top"><h3>' + esc(x[a]) + '</h3></div><p class="sub" style="color:var(--text-2);font-size:var(--fs-sm)">' + esc(x[b]) + "</p></div>"; }).join("") + "</div>"; }
  var TBC_ALERT = '<div class="alert alert-warn">' + "" + "<span><b>Venue details are not confirmed yet.</b> The information below is placeholder content until the venue operator provides and approves it. Do not rely on it for planning.</span></div>";

  P.stadium = {
    mount: function (el) {
      var section = el.getAttribute("data-section") || "overview", id = ui.params().id;
      el.innerHTML = '<div class="container page-body">' + ui.skeletons(1) + "</div>";
      P.api.list("stadiums", { pageSize: 20 }).then(function (r) {
        var all = r.items, s = all.filter(function (x) { return x.id === id; })[0] || (id ? null : all[0]);
        if (!s) { el.innerHTML = '<div class="container page-body">' + ui.state("missing", "We couldn’t find that stadium", "Choose a stadium from the directory.", '<a class="btn btn-primary" href="' + ui.url("stadiums") + '">Browse stadiums</a>') + "</div>"; return; }
        var sec = SECTIONS.filter(function (x) { return x[0] === section; })[0];
        document.title = s.name + " — " + sec[2] + " — AFCON PAMOJA";
        var crumbs = document.querySelector("[data-crumbs]");
        if (crumbs) crumbs.innerHTML = '<li><a href="' + ui.url("home") + '">Home</a></li><li><a href="' + ui.url("stadiums") + '">Stadiums</a></li><li aria-current="page">' + esc(s.name) + "</li>";
        document.querySelector("[data-title]").textContent = s.name + (section === "overview" ? "" : " — " + sec[2]);
        document.querySelector("[data-sub]").textContent = s.city + ", " + s.countryName + (s.alias ? " · also known as " + s.alias : "");
        document.querySelector("[data-badges]").innerHTML = ui.badge("Venue information", "info") + ui.badge("Unconfirmed (sample)", "placeholder");
        var nav = '<nav class="tabs" aria-label="Stadium sections">' + SECTIONS.map(function (x) { return '<a href="' + ui.url(x[1], { id: s.id }) + '" role="link" style="padding:12px 16px;font-weight:600;font-size:var(--fs-sm);white-space:nowrap;border-bottom:3px solid ' + (x[0] === section ? "var(--accent)" : "transparent") + ";color:" + (x[0] === section ? "var(--text)" : "var(--text-2)") + '"' + (x[0] === section ? ' aria-current="page"' : "") + ">" + x[2] + "</a>"; }).join("") + "</nav>";
        var pick = all.length > 1 ? '<div class="chip-list" style="margin-bottom:16px" role="group" aria-label="Choose a stadium">' + all.map(function (x) { return '<a class="btn btn-sm ' + (x.id === s.id ? "btn-primary" : "btn-outline") + '" href="' + ui.url(SECTIONS.filter(function (y) { return y[0] === section; })[0][1], { id: x.id }) + '">' + esc(x.name) + "</a>"; }).join("") + "</div>" : "";
        var dir = '<a class="btn btn-primary" href="' + ui.mapsUrl(s) + '" target="_blank" rel="noopener">' + P.icon("map-pin") + "Get directions</a>";
        var body = "";
        function done(extra) { el.innerHTML = '<div class="container page-body">' + nav + pick + '<div class="detail-layout"><div class="detail-main">' + TBC_ALERT + body + "</div>" + extra + "</div></div>"; }
        var aside = '<aside class="detail-aside" aria-label="Actions"><div class="aside-card">' + dir + '<a class="btn btn-outline" href="' + ui.url("transport", { country: s.country }) + '">Find transport</a><a class="btn btn-outline" href="' + ui.url("hotels", { country: s.country, sort: "distance" }) + '">Hotels nearby</a><p class="form-note">The Get directions link opens Google Maps. Approved entrances and parking are published here by the venue operator.</p></div></aside>';
        if (section === "overview") {
          return P.api.list("matches", { stadium: s.id, status: "upcoming", pageSize: 6 }).then(function (m) {
            body = panel("About", "<p>" + esc(s.summary) + "</p>") + '<div class="facts">' + [["City", s.city], ["Country", s.countryName], ["Capacity", s.capacity]].map(function (f) { return '<div class="fact"><span>' + f[0] + "</span>" + esc(f[1]) + "</div>"; }).join("") + "</div>" +
              panel("Entrances", rows(s.entrances, "name", "note")) + panel("Location", P.mapView.live(s)) +
              panel("Upcoming matches here", m.items.length ? '<div class="res-grid" style="grid-template-columns:1fr">' + m.items.map(function (x) { return P.cards.render("matches", x); }).join("") + '</div><p class="form-note" style="margin-top:8px">Sample fixtures. Official fixtures appear once an authorised data source is connected.</p>' : "<p>No matches listed yet.</p>");
            done(aside);
          });
        }
        if (section === "facilities") { body = panel("Facilities", rows(s.facilities, "name", "detail")) + panel("Accessibility", rows(s.accessibility, "name", "detail")) + panel("Report a correction", '<p>See something wrong or out of date? Tell us and we’ll check with the venue operator.</p><p style="margin-top:12px"><button class="btn btn-outline" type="button" data-action="enquire" data-type="report" data-resource="stadiums" data-id="' + s.id + '">Report a problem</button></p>'); done(aside); return; }
        if (section === "events") {
          return Promise.all([P.api.list("matches", { stadium: s.id, pageSize: 12 }), P.api.list("events", { city: s.city, pageSize: 6 })]).then(function (r) {
            body = panel("Matches at this venue", r[0].items.length ? '<div class="res-grid" style="grid-template-columns:1fr">' + r[0].items.map(function (x) { return P.cards.render("matches", x); }).join("") + "</div>" : "<p>No matches listed yet.</p>") + panel("Events in " + esc(s.city), r[1].items.length ? '<div class="res-grid">' + r[1].items.map(function (x) { return P.cards.render("events", x); }).join("") + "</div>" : "<p>No events listed yet.</p>");
            done(aside);
          });
        }
        return Promise.all([P.api.list("transport", { country: s.country, pageSize: 3 }), P.api.list("hotels", { country: s.country, sort: "distance", pageSize: 3 })]).then(function (r) {
          body = panel("Getting there", rows(s.travel, "mode", "note")) + panel("Entrances", rows(s.entrances, "name", "note")) + panel("Parking", rows(s.parking, "name", "note")) + panel("Location", P.mapView.live(s)) +
            '<section><div class="row-head"><h2>Transport providers</h2><a href="' + ui.url("transport", { country: s.country }) + '">See all</a></div><div class="res-grid">' + r[0].items.map(function (x) { return P.cards.render("transport", x); }).join("") + "</div></section>" +
            '<section><div class="row-head"><h2>Hotels nearby</h2><a href="' + ui.url("hotels", { country: s.country, sort: "distance" }) + '">See all</a></div><div class="res-grid">' + r[1].items.map(function (x) { return P.cards.render("hotels", x); }).join("") + "</div></section>";
          done(aside);
        });
      }).catch(function (e) { el.innerHTML = '<div class="container page-body">' + ui.state("error", "We couldn’t load stadium information", (e && e.message) || "Please try again.", '<button class="btn btn-primary" type="button" onclick="location.reload()">Try again</button>') + "</div>"; });
    }
  };
})(window.PAMOJA);
