/* Finds [data-mount] placeholders and initialises the matching shared component. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  P.mountAll = function () {
    document.querySelectorAll("[data-mount]").forEach(function (el) {
      var k = el.getAttribute("data-mount");
      try {
        if (k === "listing") P.listing.mount(el);
        else if (k === "detail") P.detail.mount(el);
        else if (k === "stadium") P.stadium.mount(el);
        else if (k === "assistant") P.assistant.mount(el);
        else if (k === "competition") P.competition.mount(el);
        else if (k === "tabs") P.ui.initTabs(el);
        else if (k === "featured") P.mountFeatured(el);
      } catch (e) { P.reportError(e, "mount:" + k); el.innerHTML = P.ui.state("error", "This section couldn’t load", "Please refresh the page."); }
    });
    document.querySelectorAll("form[data-form]").forEach(function (f) { P.auth.mount(f); });
  };
  /* Horizontal featured row: <div data-mount="featured" data-resource="hotels" data-limit="3" data-fixed='{"country":"UG"}'> */
  P.mountFeatured = function (el) {
    var res = el.getAttribute("data-resource"), n = Number(el.getAttribute("data-limit")) || 3, fixed = {};
    try { fixed = JSON.parse(el.getAttribute("data-fixed") || "{}"); } catch (e) {}
    el.innerHTML = P.ui.skeletons(n);
    P.api.list(res, Object.assign({ pageSize: n }, fixed)).then(function (r) { el.innerHTML = '<div class="res-grid">' + r.items.slice(0, n).map(function (i) { return P.cards.render(res, i); }).join("") + "</div>"; })
      .catch(function (e) { el.innerHTML = P.ui.state("error", "We couldn’t load this section", (e && e.message) || "Please try again.", '<button class="btn btn-primary" type="button" onclick="location.reload()">Try again</button>'); });
  };
})(window.PAMOJA);
