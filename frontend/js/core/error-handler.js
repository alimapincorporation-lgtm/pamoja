window.PAMOJA = window.PAMOJA || {};
(function (P) {
  P.reportError = function (err, context) {
    if (window.console) console.error("[PAMOJA]", context || "", err);
    // Later: send to the backend logging endpoint.
  };
  window.addEventListener("error", function (e) { P.reportError(e.error || e.message, "window.error"); });
  window.addEventListener("unhandledrejection", function (e) { P.reportError(e.reason, "unhandledrejection"); });
})(window.PAMOJA);
