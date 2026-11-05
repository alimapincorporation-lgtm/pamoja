/* Theme: "light" | "dark" | system default. An inline script in <head> applies the saved theme before first paint. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var KEY = "pamoja-theme";
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function resolve() { return saved() || (mq && mq.matches ? "dark" : "light"); }
  function apply(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-label", mode === "dark" ? "Switch to light theme" : "Switch to dark theme");
      b.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
    });
  }
  P.theme = {
    init: function () {
      apply(resolve());
      document.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-theme-toggle]");
        if (!btn) return;
        var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        try { localStorage.setItem(KEY, next); } catch (err) {}
        apply(next);
      });
      if (mq && mq.addEventListener) mq.addEventListener("change", function () { if (!saved()) apply(resolve()); });
    }
  };
})(window.PAMOJA);
