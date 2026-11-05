/* Auth forms + session UI. TEST BUILD: any well-formed email and an 8+ character password are accepted; no account is created or checked.
   The live backend replaces PAMOJA.api.post("/auth/...") responses; this file's form logic stays the same. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var ui = P.ui;
  var RULES = {
    login:    { email: ["required", "email"], password: ["required"] },
    register: { name: ["required"], email: ["required", "email"], password: ["required", { min: 8 }], confirmPassword: ["required", { match: "password" }], terms: ["required"] },
    forgot:   { email: ["required", "email"] },
    reset:    { password: ["required", { min: 8 }], confirmPassword: ["required", { match: "password" }] },
    activate: { name: ["required"], password: ["required", { min: 8 }], confirmPassword: ["required", { match: "password" }], terms: ["required"] }
  };
  function strength(v) { var s = 0; if (v.length >= 8) s++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++; if (/\d/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++; return s; }

  P.auth = {
    user: null,
    session: function () { return P.api.mode() === "sample" ? (P.sample ? P.sample.session() : null) : P.auth.user; },
    /* In hybrid/live mode ask the backend who is signed in (cookie session). */
    load: function () {
      if (P.api.mode() === "sample") return Promise.resolve();
      return P.api.live("GET", "/auth/me").then(function (r) { P.auth.user = r && r.user ? r : null; }).catch(function () { P.auth.user = null; });
    },
    decorate: function () {
      var s = P.auth.session(); if (!s) return;
      document.querySelectorAll('[data-route="login"]').forEach(function (a) {
        if (a.getAttribute("data-decorated")) return; a.setAttribute("data-decorated", "1");
        a.textContent = "Sign out"; a.removeAttribute("data-planned"); a.setAttribute("href", "#");
        a.addEventListener("click", function (e) { e.preventDefault(); P.api.post("/auth/logout", {}).then(function () { try { sessionStorage.removeItem("pamoja-csrf"); } catch (x) {} P.toast("You’ve been signed out."); setTimeout(function () { location.reload(); }, 600); }); });
      });
    },
    mount: function (form) {
      var sampleMode = P.api.mode() === "sample";
      document.querySelectorAll("[data-sample-only]").forEach(function (el) { el.hidden = !sampleMode; });
      var kind = form.getAttribute("data-form"), rules = RULES[kind], needsToken = kind === "reset" || kind === "activate", token = ui.params().token;
      if (needsToken && !token) {
        form.innerHTML = ui.state("error", "This link is missing or has expired", "Links are single-use and expire for your security. Request a new one to continue.", '<a class="btn btn-primary" href="' + ui.url(kind === "reset" ? "forgot" : "contact") + '">' + (kind === "reset" ? "Request a new link" : "Contact support") + "</a>" + (sampleMode ? '<p class="form-note">Test build: add <code>?token=sample</code> to the address to try this page.</p>' : ""));
        return;
      }
      P.validate.live(form, rules);
      var pw = form.elements.password, bar = form.querySelector(".strength i");
      if (pw && bar && kind !== "login") pw.addEventListener("input", function () { var s = strength(pw.value); bar.style.width = (s * 25) + "%"; bar.style.background = ["var(--danger)", "var(--danger)", "var(--gold-600)", "var(--green-500)", "var(--green-600)"][s]; });
      var toggle = form.querySelector("[data-toggle-pw]");
      if (toggle) toggle.addEventListener("click", function () { var on = pw.type === "password"; pw.type = on ? "text" : "password"; toggle.textContent = on ? "Hide" : "Show"; toggle.setAttribute("aria-pressed", on); });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var r = P.validate.run(form, rules); if (!r.valid) return;
        var btn = form.querySelector('[type="submit"]'), label = btn.textContent; btn.disabled = true; btn.textContent = "Please wait…";
        var path = { login: "/auth/login", register: "/auth/register", forgot: "/auth/forgot", reset: "/auth/reset", activate: "/auth/activate" }[kind];
        P.api.post(path, Object.assign({}, r.data, token ? { token: token } : {})).then(function (res) {
          if (kind === "login") {
            if (res && res.mfaRequired) { form.innerHTML = '<div class="alert alert-info" role="status">' + P.icon("shield-check") + "<span>This account uses multi-factor authentication. The authentication-code screen arrives with the Command Centre pages. Use the developer console to finish signing in.</span></div>"; return; }
            P.toast(sampleMode ? "Signed in (sample session)." : "Signed in."); setTimeout(function () { location.href = ui.url("home"); }, 700); return;
          }
          var t = sampleMode ? " Test build: " : "";
          var msg = { register: ["Check your email", "We’ve sent a message to " + r.data.email + "." + (sampleMode ? " Test build: no account was created." : "")], forgot: ["Check your email", "If an account exists for " + r.data.email + ", we’ll send a link to reset your password." + (sampleMode ? " Test build: no email was sent." : "")], reset: ["Password updated", "You can now sign in with your new password." + (sampleMode ? " Test build: nothing was changed." : "")], activate: ["Account activated", "You can now sign in." + (sampleMode ? " Test build: no account was activated." : "")] }[kind];
          form.innerHTML = '<div class="alert alert-ok" role="status">' + P.icon("check") + "<span><b>" + msg[0] + ".</b> " + ui.esc(msg[1]) + '</span></div><div class="form-actions"><a class="btn btn-primary" href="' + ui.url(kind === "register" || kind === "forgot" ? "home" : "login") + '">' + (kind === "register" || kind === "forgot" ? "Back to home" : "Go to sign in") + "</a></div>";
        }).catch(function (err) {
          btn.disabled = false; btn.textContent = label;
          var a = form.querySelector(".alert-err") || document.createElement("div"); a.className = "alert alert-err"; a.setAttribute("role", "alert"); a.innerHTML = P.icon("shield-check") + "<span>" + ui.esc(err.message || "Something went wrong. Please try again.") + "</span>"; form.insertBefore(a, form.firstChild);
        });
      });
    }
  };
})(window.PAMOJA);
