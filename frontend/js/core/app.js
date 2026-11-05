/* Boot sequence shared by every page. Page scripts register PAMOJA.page.<name> = { init() }. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  P.page = P.page || {};
  document.addEventListener("DOMContentLoaded", function () {
    try {
      P.layout.render();
      P.hydrateIcons();
      P.theme.init();
      P.nav.init();
      if (P.actions) P.actions.init();
      if (P.mapView && P.mapView.init) P.mapView.init();
      if (P.auth) { P.auth.decorate(); P.auth.load().then(function () { P.auth.decorate(); }); }
      if (P.mountAll) P.mountAll();
      var name = document.body.getAttribute("data-page");
      if (name && P.page[name] && P.page[name].init) P.page[name].init();
    } catch (err) { P.reportError(err, "boot"); }
  });
})(window.PAMOJA);
