/* Generic listing: filters (URL-synced) + grid/map + states + load more. Mount with <div data-mount="listing" data-resource="hotels" ...>. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var ui = P.ui, esc = ui.esc;
  var COUNTRY = [["UG", "Uganda"], ["KE", "Kenya"], ["TZ", "Tanzania"]];
  var OPT = {
    destinations: { category: ["wildlife", "nature", "culture", "city", "beach"] },
    tours: { category: ["wildlife", "adventure", "culture", "city"] },
    transport: { type: ["Airport transfer", "Shuttle service", "Private hire", "Car hire"] },
    businesses: { category: ["Medical", "Retail", "Services", "Entertainment"] },
    restaurants: { cuisine: ["East African grill", "Café and brunch", "Kenyan nyama choma", "International", "Swahili seafood", "Street food"] },
    events: { type: ["Fan event", "Culture", "Sport", "Food", "Music", "Market"] },
    news: { tag: ["Match preview", "Travel guide", "Food", "Transport", "Itinerary"] }
  };
  var DEFAULT_FILTERS = {
    hotels: ["q", "country", "budget", "available", "sort"], destinations: ["q", "country", "category"], tours: ["q", "country", "category", "budget"], transport: ["q", "country", "type"],
    businesses: ["q", "country", "category"], restaurants: ["q", "country", "cuisine"], events: ["q", "country", "type", "free"], news: ["q", "tag"], matches: ["q"], stadiums: ["q", "country"]
  };
  var NOUN = { hotels: "hotel", destinations: "destination", tours: "tour", transport: "transport provider", businesses: "business", restaurants: "restaurant", events: "event", news: "article", matches: "match", stadiums: "stadium" };

  function sel(name, label, options, val, pairs) {
    return '<div class="field"><label for="flt-' + name + '">' + label + '</label><select class="select" id="flt-' + name + '" name="' + name + '"><option value="">All</option>' +
      options.map(function (o) { var v = pairs ? o[0] : o, l = pairs ? o[1] : o; return '<option value="' + esc(v) + '"' + (String(val) === String(v) ? " selected" : "") + ">" + esc(l) + "</option>"; }).join("") + "</select></div>";
  }
  function control(k, res, p) {
    if (k === "q") return '<div class="field"><label for="flt-q">Search</label><input class="input" id="flt-q" name="q" type="search" placeholder="Name, place or keyword" value="' + esc(p.q || "") + '"></div>';
    if (k === "country") return sel("country", "Country", COUNTRY, p.country, true);
    if (k === "budget") return '<div class="field"><label for="flt-maxPrice">Max price</label><div style="display:grid;grid-template-columns:1fr 92px;gap:6px"><input class="input" id="flt-maxPrice" name="maxPrice" type="number" min="0" inputmode="numeric" placeholder="e.g. 200000" value="' + esc(p.maxPrice || "") + '"><select class="select" name="currency" aria-label="Currency"><option>UGX</option><option' + (p.currency === "KES" ? " selected" : "") + '>KES</option><option' + (p.currency === "TZS" ? " selected" : "") + ">TZS</option></select></div></div>";
    if (k === "available") return '<div class="field"><span class="label">Availability</span><label class="check" style="min-height:44px;align-items:center"><input type="checkbox" name="available" value="1"' + (p.available === "1" ? " checked" : "") + "><span>Available only</span></label></div>";
    if (k === "free") return '<div class="field"><span class="label">Price</span><label class="check" style="min-height:44px;align-items:center"><input type="checkbox" name="free" value="1"' + (p.free === "1" ? " checked" : "") + "><span>Free only</span></label></div>";
    if (k === "sort") return '<div class="field"><label for="flt-sort">Sort by</label><select class="select" id="flt-sort" name="sort"><option value="">Recommended</option><option value="price-asc"' + (p.sort === "price-asc" ? " selected" : "") + '>Price: low to high</option><option value="price-desc"' + (p.sort === "price-desc" ? " selected" : "") + '>Price: high to low</option><option value="distance"' + (p.sort === "distance" ? " selected" : "") + ">Closest to stadium</option></select></div>";
    var o = (OPT[res] || {})[k]; if (o) return sel(k, k.charAt(0).toUpperCase() + k.slice(1), o, p[k]);
    return "";
  }

  P.listing = {
    mount: function (el) {
      var res = el.getAttribute("data-resource"), fixed = {}, urlState = el.getAttribute("data-urlstate") !== "false";
      try { fixed = JSON.parse(el.getAttribute("data-fixed") || "{}"); } catch (e) {}
      var keys = el.hasAttribute("data-filters") ? el.getAttribute("data-filters").split(",").filter(Boolean) : DEFAULT_FILTERS[res];
      var canMap = el.getAttribute("data-map") === "true", size = Number(el.getAttribute("data-page-size")) || 9, view = "grid", page = 1;
      var p = urlState ? ui.params() : {};
      el.innerHTML = (keys.length ? '<form class="filters" role="search" aria-label="Filter ' + LABEL() + '">' + keys.map(function (k) { return control(k, res, p); }).join("") + '<div class="filters-actions"><button class="btn btn-outline" type="button" data-clear>Clear filters</button></div></form>' : "") +
        '<div class="results-bar"><p class="results-count" role="status" aria-live="polite"></p>' + (canMap ? '<div class="seg" role="group" aria-label="Results view"><button type="button" data-view="grid" aria-pressed="true">List</button><button type="button" data-view="map" aria-pressed="false">Map</button></div>' : "") + '</div><div data-out></div><div class="loadmore" data-more hidden></div>';
      function LABEL() { return ui.LABEL[res] || "results"; }
      var out = el.querySelector("[data-out]"), count = el.querySelector(".results-count"), more = el.querySelector("[data-more]"), form = el.querySelector("form");

      function current() {
        var q = Object.assign({}, fixed);
        if (form) Array.prototype.forEach.call(form.elements, function (c) { if (!c.name) return; if (c.type === "checkbox") { if (c.checked) q[c.name] = c.value; } else if (c.value) q[c.name] = c.value; });
        if (q.currency && !q.maxPrice) delete q.currency;
        return q;
      }
      function sync(q) {
        if (!urlState || !window.history.replaceState) return;
        var s = new URLSearchParams(); Object.keys(q).forEach(function (k) { if (!(k in fixed)) s.set(k, q[k]); });
        history.replaceState(null, "", location.pathname + (s.toString() ? "?" + s : ""));
      }
      function load(append) {
        var q = current(); sync(q); q.page = page; q.pageSize = size;
        if (!append) { out.innerHTML = ui.skeletons(Math.min(size, 3)); more.hidden = true; count.textContent = "Loading…"; }
        P.api.list(res, q).then(function (r) {
          count.textContent = r.total === 0 ? "No results" : "Showing " + Math.min(r.items.length, r.total) + " of " + r.total + " " + (r.total === 1 ? NOUN[res] : NOUN[res] + "s");
          if (!r.items.length) { out.innerHTML = ui.state("empty", "No " + LABEL().toLowerCase() + " match your filters", "Try removing a filter or searching a different place.", '<button class="btn btn-outline" type="button" data-clear>Clear filters</button>'); more.hidden = true; return; }
          var cards = '<div class="res-grid' + (view === "map" ? " is-split" : "") + '"' + (res === "matches" ? ' style="grid-template-columns:1fr"' : "") + ">" + r.items.map(function (i) { return P.cards.render(res, i); }).join("") + "</div>";
          out.innerHTML = view === "map" ? '<div class="map-split"><div>' + cards + '</div><div class="map-col">' + P.mapView.render(r.items, { kind: res === "stadiums" ? "stadium" : "" }) + "</div></div>" : cards;
          if (r.items.length < r.total) { more.hidden = false; more.innerHTML = '<button class="btn btn-outline" type="button" data-load>Load more</button><span class="form-note">Showing ' + r.items.length + " of " + r.total + "</span>"; } else more.hidden = true;
        }).catch(function (err) {
          count.textContent = ""; more.hidden = true;
          out.innerHTML = ui.state("error", "We couldn’t load " + LABEL().toLowerCase(), (err && err.message) || "Please try again.", '<button class="btn btn-primary" type="button" data-retry>Try again</button>');
        });
      }
      var t; if (form) { form.addEventListener("input", function (e) { clearTimeout(t); t = setTimeout(function () { page = 1; load(); }, e.target.type === "search" ? 300 : 0); }); form.addEventListener("submit", function (e) { e.preventDefault(); }); }
      el.addEventListener("click", function (e) {
        if (e.target.closest("[data-clear]")) { if (form) form.reset(); Array.prototype.forEach.call(form ? form.elements : [], function (c) { if (c.type === "checkbox") c.checked = false; else if (c.tagName === "SELECT" || c.type === "search" || c.type === "number") c.value = c.tagName === "SELECT" && c.name === "currency" ? "UGX" : ""; }); page = 1; load(); }
        if (e.target.closest("[data-retry]")) load();
        if (e.target.closest("[data-load]")) { page += 1; load(); }
        var v = e.target.closest("[data-view]"); if (v) { view = v.getAttribute("data-view"); el.querySelectorAll("[data-view]").forEach(function (b) { b.setAttribute("aria-pressed", b === v); }); page = 1; load(); }
      });
      load();
    }
  };
})(window.PAMOJA);
