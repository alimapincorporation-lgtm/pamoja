/* Home page initialisation. Page-specific behaviour only; shared behaviour lives in js/core. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  P.page = P.page || {};
  P.page.home = {
    init: function () {
      // Move keyboard focus to in-page targets (e.g. "Explore PAMOJA" -> #discover) so screen-reader and keyboard users land there.
      document.addEventListener("click", function (e) {
        var a = e.target.closest('a[href^="#"]');
        if (!a || a.getAttribute("href") === "#") return;
        var t = document.getElementById(a.getAttribute("href").slice(1));
        if (t) { t.setAttribute("tabindex", "-1"); setTimeout(function () { t.focus({ preventScroll: true }); }, 400); }
      });
    }
  };
})(window.PAMOJA);
