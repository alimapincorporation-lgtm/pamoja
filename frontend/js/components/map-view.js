/* Illustrative map: pins are placed from latitude/longitude on a stylised background. This is NOT Google Maps;
   it shows relative positions only. "Get directions" opens Google Maps. Interactive maps arrive with the Maps integration. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var ui = P.ui;
  function bg() {
    return '<rect class="map-land" width="400" height="280"/><path class="map-park" d="M14 34c40-24 96-14 116 22s-12 62-62 62S-8 78 14 34z"/><path class="map-water" d="M262 206c32-34 88-24 138 4v70H246c-18-30-8-52 16-74z"/>' +
      '<g class="map-road-edge"><path d="M-10 152C76 140 160 172 240 132S350 82 410 92"/><path d="M112-10c10 74 40 142 30 300"/></g><g class="map-road"><path d="M-10 152C76 140 160 172 240 132S350 82 410 92"/><path d="M112-10c10 74 40 142 30 300"/></g>';
  }
  var enc = encodeURIComponent;
  P.maps = {
    query: function (it) { return it.mapsQuery || (it.lat + "," + it.lng); },
    embedUrl: function (it, origin) {
      var key = (P.config.maps || {}).embedApiKey, q = P.maps.query(it);
      if (origin) return key ? "https://www.google.com/maps/embed/v1/directions?key=" + enc(key) + "&origin=" + enc(origin) + "&destination=" + enc(q) + "&mode=driving" : "https://www.google.com/maps?saddr=" + enc(origin) + "&daddr=" + enc(q) + "&output=embed";
      return key ? "https://www.google.com/maps/embed/v1/place?key=" + enc(key) + "&q=" + enc(q) + "&zoom=15" : "https://www.google.com/maps?q=" + enc(q) + "&z=15&output=embed";
    },
    directionsUrl: function (it, origin) { return "https://www.google.com/maps/dir/?api=1" + (origin ? "&origin=" + enc(origin) : "") + "&destination=" + enc(P.maps.query(it)); }
  };
  P.mapView = {
    /* Live Google Map for one place, with an optional route from a starting point the visitor types or shares. */
    live: function (it) {
      var name = it.name || it.title, q = P.maps.query(it);
      return '<div class="live-map" data-live-map data-q="' + ui.esc(q) + '"><div class="live-frame"><span class="live-wait">Loading map…</span><iframe title="Google Map showing ' + ui.esc(name) + '" src="' + P.maps.embedUrl(it) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>' +
        '<form class="route-form" data-route-form novalidate><div class="field"><label for="origin-' + ui.esc(it.id) + '">Get directions from</label><div class="route-row"><input class="input" id="origin-' + ui.esc(it.id) + '" name="origin" autocomplete="off" placeholder="e.g. Entebbe airport or your hotel"><button class="btn btn-primary btn-sm" type="submit">Show route</button><button class="btn btn-outline btn-sm" type="button" data-use-location>' + P.icon("map-pin") + 'Use my location</button></div><p class="field-error"></p></div></form>' +
        '<p class="row"><a class="btn btn-outline btn-sm" data-open-maps href="' + P.maps.directionsUrl(it) + '" target="_blank" rel="noopener">' + P.icon("map-pin") + 'Open in Google Maps</a></p>' +
        '<p class="map-note" style="border:0;background:none;padding:0">Map by Google; loading it shares your IP address with Google. Route times are estimates. The pin for sample listings is not verified.</p></div>';
    },
    init: function () {
      function err(box, msg) { var f = box.querySelector(".field"), e = f.querySelector(".field-error"); f.classList.toggle("has-error", !!msg); e.textContent = msg || ""; }
      function route(box, origin) {
        var it = { mapsQuery: box.getAttribute("data-q") };
        box.querySelector("iframe").src = P.maps.embedUrl(it, origin);
        box.querySelector("[data-open-maps]").href = P.maps.directionsUrl(it, origin);
      }
      document.addEventListener("submit", function (e) {
        var f = e.target.closest("[data-route-form]"); if (!f) return; e.preventDefault();
        var box = f.closest("[data-live-map]"), v = f.elements.origin.value.trim();
        if (!v) { err(box, "Enter a starting point, like a hotel name or area."); f.elements.origin.focus(); return; }
        err(box, ""); route(box, v);
      });
      document.addEventListener("click", function (e) {
        var b = e.target.closest("[data-use-location]"); if (!b) return;
        var box = b.closest("[data-live-map]");
        if (!navigator.geolocation) { err(box, "Your browser can’t share its location. Type a starting point instead."); return; }
        b.disabled = true;
        navigator.geolocation.getCurrentPosition(function (pos) { b.disabled = false; var o = pos.coords.latitude.toFixed(5) + "," + pos.coords.longitude.toFixed(5); box.querySelector("[name=origin]").value = "My location"; err(box, ""); route(box, o); },
          function () { b.disabled = false; err(box, "We couldn’t get your location. Allow location access, or type a starting point instead."); }, { timeout: 10000, maximumAge: 60000 });
      });
    },
    render: function (items, opts) {
      opts = opts || {}; var pts = items.filter(function (i) { return typeof i.lat === "number"; }).slice(0, 12);
      if (!pts.length) return "";
      var lats = pts.map(function (p) { return p.lat; }), lngs = pts.map(function (p) { return p.lng; });
      var minLa = Math.min.apply(null, lats), maxLa = Math.max.apply(null, lats), minLn = Math.min.apply(null, lngs), maxLn = Math.max.apply(null, lngs);
      function px(v, mn, mx, size, pad) { return mx - mn < 1e-6 ? size / 2 : pad + (v - mn) / (mx - mn) * (size - pad * 2); }
      var pins = pts.map(function (p, i) {
        var x = px(p.lng, minLn, maxLn, 400, 44), y = 280 - px(p.lat, minLa, maxLa, 280, 40);
        var cls = opts.kind === "stadium" ? "pin-stadium" : "pin-hotel";
        return '<g><circle class="' + cls + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="12"/><text class="map-pin-num' + (cls === "pin-stadium" ? " on-gold" : "") + '" x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '">' + (i + 1) + "</text></g>";
      }).join("");
      var legend = pts.map(function (p, i) {
        return '<li><span style="display:flex;gap:10px;align-items:center;min-width:0"><span class="num">' + (i + 1) + '</span><span style="overflow:hidden;text-overflow:ellipsis">' + ui.esc(p.name || p.title) + '</span></span><a class="btn btn-outline btn-sm" href="' + ui.mapsUrl(p) + '" target="_blank" rel="noopener">' + P.icon("map-pin") + "Directions</a></li>";
      }).join("");
      return '<div class="mapbox"><svg viewBox="0 0 400 280" role="img" aria-label="Illustrative map showing ' + pts.length + ' location' + (pts.length > 1 ? "s" : "") + '. Use the list below for directions.">' + bg() + pins + '</svg><ul class="map-legend">' + legend + '</ul><p class="map-note">Illustrative map (relative positions only). Sample locations are not verified. Directions open in Google Maps.</p></div>';
    }
  };
})(window.PAMOJA);
