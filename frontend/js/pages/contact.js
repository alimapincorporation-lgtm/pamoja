window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var RULES = { name: ["required"], email: ["required", "email"], topic: ["required"], message: ["required", { min: 10 }] };
  P.page.contact = {
    init: function () {
      var form = document.getElementById("contact-form"); P.validate.live(form, RULES);
      form.addEventListener("submit", function (e) {
        e.preventDefault(); var r = P.validate.run(form, RULES); if (!r.valid) return;
        var btn = form.querySelector('[type="submit"]'); btn.disabled = true; btn.textContent = "Sending…";
        P.api.post("/contact", r.data).then(function (res) {
          form.innerHTML = '<div class="alert alert-ok" role="status">' + P.icon("check") + "<span><b>Message sent.</b> Your reference is <b>" + P.ui.esc(res.reference) + '</b>.</span></div><p class="form-note" style="margin-top:12px">' + (res.sample ? "Test build: nothing was sent to a person. In the live platform, support replies to " : "Support will reply to ") + P.ui.esc(r.data.email) + ".</p>";
        }).catch(function (err) { btn.disabled = false; btn.textContent = "Send message"; P.toast(err.message || "We couldn’t send your message. Please try again."); });
      });
    }
  };
})(window.PAMOJA);
