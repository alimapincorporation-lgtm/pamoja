/* Inline SVG icon set (stroke icons, 24px grid). Usage: PAMOJA.icon("map-pin") */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var d = {
    "menu": '<path d="M4 6h16M4 12h16M4 18h16"/>',
    "x": '<path d="M18 6 6 18M6 6l12 12"/>',
    "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    "moon": '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "arrow-right": '<path d="M5 12h14M12 5l7 7-7 7"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    "map-pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    "bed": '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
    "car": '<path d="M3 17v-4l2-6h14l2 6v4M3 17h18M7 17v2M17 17v2"/><circle cx="7.5" cy="13.5" r="1"/><circle cx="16.5" cy="13.5" r="1"/>',
    "store": '<path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6"/>',
    "sparkles": '<path d="M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9z"/><path d="M19 3v4M17 5h4"/>',
    "ball": '<circle cx="12" cy="12" r="9"/><path d="m12 8 3.5 2.6-1.3 4.1H9.8l-1.3-4.1zM12 3v5M15.5 10.6 20 9M14.2 14.7l2.8 3.8M9.8 14.7 7 18.5M8.5 10.6 4 9"/>',
    "compass": '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    "route": '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h8"/>',
    "utensils": '<path d="M5 3v8a2 2 0 0 0 2 2v8M9 3v8a2 2 0 0 1-2 2M17 21V3c-2 1-3.5 4-3.5 8h3.5"/>',
    "mountain": '<path d="m3 20 6-11 4 7 3-4 5 8z"/>',
    "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    "message": '<path d="M21 12a8 8 0 0 1-11.7 7L4 20l1.2-4.6A8 8 0 1 1 21 12z"/>',
    "stadium": '<ellipse cx="12" cy="8" rx="9" ry="4"/><path d="M3 8v8c0 2.2 4 4 9 4s9-1.8 9-4V8"/>',
    "shield-check": '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    "send": '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>'
  };
  P.icon = function (name, cls) {
    return '<svg class="icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (d[name] || "") + "</svg>";
  };
  // Hydrate static markup: <i data-icon="map-pin"></i> -> inline svg
  P.hydrateIcons = function (root) {
    (root || document).querySelectorAll("i[data-icon]").forEach(function (el) {
      el.outerHTML = P.icon(el.getAttribute("data-icon"), el.getAttribute("data-class") || "");
    });
  };
})(window.PAMOJA);
