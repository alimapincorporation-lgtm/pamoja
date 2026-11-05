window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var region;
  P.toast = function (message, ms) {
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = message;
    region.appendChild(t);
    setTimeout(function () { t.remove(); }, ms || 4000);
  };
})(window.PAMOJA);
