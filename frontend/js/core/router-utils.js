/* Navigation behaviour: mobile menu + honest handling of links to pages not built yet. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  P.nav = {
    init: function () {
      var btn = document.querySelector(".menu-btn"), panel = document.getElementById("primary-nav");
      function setOpen(open) {
        if (!btn || !panel) return;
        panel.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      }
      if (btn) btn.addEventListener("click", function () { setOpen(btn.getAttribute("aria-expanded") !== "true"); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setOpen(false); if (btn) btn.focus(); } });
      window.addEventListener("resize", function () { if (window.innerWidth >= 1280) setOpen(false); });

      document.addEventListener("click", function (e) {
        var a = e.target.closest("a[data-planned]");
        if (a) {
          e.preventDefault();
          P.toast(a.getAttribute("data-planned") + " is planned for a later phase and isn’t available yet.");
          setOpen(false);
          return;
        }
        if (e.target.closest(".primary-nav a[href^='#']")) setOpen(false);
      });
    }
  };
})(window.PAMOJA);
