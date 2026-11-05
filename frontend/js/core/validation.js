/* Form validation with accessible inline errors. Rules per field name: "required", "email", "phone", {min:n}, {minNum:n}, {maxNum:n}, "future", {after:"otherField"}, {match:"otherField"}. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  function field(el) { return el.closest(".field"); }
  function setError(el, msg) {
    var f = field(el); if (!f) return;
    var err = f.querySelector(".field-error");
    if (!err) { err = document.createElement("p"); err.className = "field-error"; f.appendChild(err); }
    if (!err.id) err.id = "err-" + (el.name || Math.random().toString(36).slice(2, 7));
    f.classList.toggle("has-error", !!msg);
    err.textContent = msg || "";
    if (msg) { el.setAttribute("aria-invalid", "true"); el.setAttribute("aria-describedby", err.id); } else { el.removeAttribute("aria-invalid"); el.removeAttribute("aria-describedby"); }
  }
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d.toISOString().slice(0, 10); }
  function check(el, rules, form) {
    var v = (el.type === "checkbox" ? (el.checked ? "1" : "") : (el.value || "")).trim(), label = el.getAttribute("data-label") || "This field";
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i], k = typeof r === "string" ? r : Object.keys(r)[0], arg = typeof r === "string" ? null : r[k];
      if (k === "required" && !v) return el.type === "checkbox" ? "Please tick this box to continue." : label + " is required.";
      if (!v) continue;
      if (k === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email address, like name@example.com.";
      if (k === "phone" && !/^\+?[0-9\s\-()]{7,18}$/.test(v)) return "Enter a valid phone number, including the country code.";
      if (k === "min" && v.length < arg) return label + " must be at least " + arg + " characters.";
      if (k === "minNum" && Number(v) < arg) return label + " must be at least " + arg + ".";
      if (k === "maxNum" && Number(v) > arg) return label + " must be " + arg + " or fewer.";
      if (k === "future" && v < today()) return "Choose today or a later date.";
      if (k === "after") { var o = form.elements[arg]; if (o && o.value && v <= o.value) return label + " must be after " + (o.getAttribute("data-label") || arg).toLowerCase() + "."; }
      if (k === "match") { var m = form.elements[arg]; if (m && m.value !== el.value) return "The passwords don’t match."; }
    }
    return "";
  }
  P.validate = {
    run: function (form, rules) {
      var ok = true, first = null, data = {};
      Object.keys(rules).forEach(function (name) {
        var el = form.elements[name]; if (!el) return;
        var msg = check(el, rules[name], form); setError(el, msg);
        if (msg) { ok = false; if (!first) first = el; }
      });
      Array.prototype.forEach.call(form.elements, function (el) { if (el.name && el.type !== "submit" && el.type !== "button") data[el.name] = el.type === "checkbox" ? el.checked : el.value.trim(); });
      if (first) first.focus();
      return { valid: ok, data: data };
    },
    clear: function (form) { Array.prototype.forEach.call(form.elements, function (el) { if (el.closest && field(el)) setError(el, ""); }); },
    live: function (form, rules) {
      form.addEventListener("blur", function (e) { var el = e.target, n = el.name; if (n && rules[n]) setError(el, check(el, rules[n], form)); }, true);
      form.addEventListener("input", function (e) { var el = e.target, f = field(el); if (f && f.classList.contains("has-error") && rules[el.name]) setError(el, check(el, rules[el.name], form)); });
    }
  };
})(window.PAMOJA);
