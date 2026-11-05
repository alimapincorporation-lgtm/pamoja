/* Developer test console: exercises the backend end to end (sign in, onboard a business, verify, publish, invite, activate, enquiries, audit).
   Uses PAMOJA.api.live directly. Remove from production builds. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var esc = function (s) { return P.ui.esc(s); }, root, me = null, last = "", orgId = null, cats = [];
  function out(label, data) { last = label + "\n" + JSON.stringify(data, null, 2); var el = document.getElementById("out"); if (el) el.textContent = last; }
  function call(method, path, body, quiet) {
    return P.api.live(method, path, body).then(function (r) { if (!quiet) out(method + " " + path + " → OK", r); return r; }, function (e) { out(method + " " + path + " → " + (e.status || "ERROR") + " " + (e.code || ""), e); throw e; });
  }
  var uid = 0;
  function f(name, label, type, extra) { var id = "c" + (++uid) + "-" + name; return '<div class="field"><label for="' + id + '">' + label + '</label><input class="input" id="' + id + '" name="' + name + '" type="' + (type || "text") + '" ' + (extra || "") + "></div>"; }
  function sel(name, label, opts) { var id = name === "org" ? "c-org" : "c" + (++uid) + "-" + name; return '<div class="field"><label for="' + id + '">' + label + '</label><select class="select" id="' + id + '" name="' + name + '">' + opts.map(function (o) { return '<option value="' + esc(o[0]) + '">' + esc(o[1]) + "</option>"; }).join("") + "</select></div>"; }
  var isStaff = function () { return me && me.platformRoles && me.platformRoles.length > 0; };

  function render() {
    var mode = P.api.mode();
    var h = '<div class="alert alert-' + (mode === "sample" ? "warn" : "info") + '" style="margin-bottom:16px"><span><b>Mode: ' + mode + '.</b> ' + (mode === "sample" ? 'The backend is not in use. Open this page from the backend address (npm start) or add <code>?api=hybrid</code>.' : "API base: <code>" + esc(P.config.api.baseUrl) + "</code>") + "</span></div>";
    h += '<div class="two-col" style="align-items:start"><div style="display:grid;gap:20px">';
    if (!me) {
      h += '<section class="panel"><h2>Sign in</h2><form id="f-login" class="form-grid" novalidate>' + f("email", "Email", "email") + f("password", "Password", "password") + '<div class="form-actions"><button class="btn btn-primary" type="submit">Sign in</button></div></form>'
        + '<form id="f-mfa" class="form-grid" style="margin-top:16px" hidden>' + f("code", "Authentication code (6 digits)") + '<div class="form-actions"><button class="btn btn-primary" type="submit">Verify</button></div></form></section>';
    } else {
      h += '<section class="panel"><h2>Signed in</h2><p><b>' + esc(me.user.name) + "</b> · " + esc(me.user.email) + '</p><p class="form-note">Platform roles: ' + (me.platformRoles.join(", ") || "none") + " · Organisations: " + (me.memberships.map(function (m) { return m.organisationName + " (" + m.role + ")"; }).join(", ") || "none") + " · MFA " + (me.mfa.enabled ? "on" : "off") + '</p><div class="form-actions"><button class="btn btn-outline" id="b-logout" type="button">Sign out</button></div></section>';
      if (isStaff()) h += staffPanels();
      if (me.memberships.length) h += orgPanels();
    }
    h += '<section class="panel"><h2>Activate an invitation</h2><form id="f-activate" class="form-grid" novalidate>' + f("token", "Invitation token (from the link or mail log)") + f("name", "Your name") + f("password", "Choose a password", "password") + '<div class="form-actions"><button class="btn btn-outline" type="submit">Activate</button></div></form></section>';
    h += '<section class="panel"><h2>Public enquiry</h2><form id="f-enq" class="form-grid" novalidate>' + f("listingId", "Business id or slug") + f("name", "Your name") + f("email", "Your email", "email") + f("message", "Message") + '<div class="form-actions"><button class="btn btn-outline" type="submit">Send enquiry</button></div></form></section>';
    h += '</div><div style="display:grid;gap:20px;position:sticky;top:90px"><section class="panel"><h2>Last response</h2><pre id="out" style="white-space:pre-wrap;word-break:break-word;font-size:12px;max-height:70vh;overflow:auto;background:var(--surface-2);padding:12px;border-radius:8px">' + esc(last || "Nothing yet.") + "</pre></section></div></div>";
    root.innerHTML = h; wire();
    if (me && isStaff()) { loadOverview(); loadBusinesses(); }
    if (me && me.memberships.length) loadOrg();
  }

  function staffPanels() {
    return '<section class="panel"><h2>Command Centre</h2><div id="overview" class="chip-list"></div></section>' +
      '<section class="panel"><h2>Create a business</h2><form id="f-biz" class="form-grid cols-2" novalidate>' + f("name", "Business name") + sel("category", "Category", cats.map(function (c) { return [c.id, c.label]; })) + sel("country", "Country", [["UG", "Uganda"], ["KE", "Kenya"], ["TZ", "Tanzania"]]) + f("city", "City") + f("lat", "Latitude", "number", 'step="any"') + f("lng", "Longitude", "number", 'step="any"') + f("phone", "Phone") + f("email", "Business email", "email") + f("summary", "Summary") + f("ownerEmail", "Owner email (sends an invitation)", "email") + '<div class="form-actions span-2"><button class="btn btn-primary" type="submit">Create business</button></div></form></section>' +
      '<section class="panel"><h2>Businesses</h2><div id="biz"></div></section>' +
      '<section class="panel"><h2>Bulk import (CSV)</h2><form id="f-import"><div class="field"><label for="c-csv">CSV text (columns: name,category,country,city,phone,summary,services,ownerEmail)</label><textarea class="textarea" id="c-csv" name="csv" placeholder="name,category,country,city,phone\\nDemo Cafe,restaurant,UG,Kampala,+256 700 123 456"></textarea></div><div class="form-actions"><button class="btn btn-outline" type="submit" data-dry="1">Dry run</button><button class="btn btn-primary" type="submit" data-dry="0">Import</button></div></form></section>' +
      '<section class="panel"><h2>Tickets and audit</h2><div class="form-actions"><button class="btn btn-outline" id="b-tickets" type="button">Show tickets</button><button class="btn btn-outline" id="b-audit" type="button">Show audit trail</button></div></section>';
  }
  function orgPanels() {
    var opts = me.memberships.map(function (m) { return [m.organisationId, m.organisationName + " (" + m.role + ")"]; });
    return '<section class="panel"><h2>My business</h2>' + sel("org", "Organisation", opts) + '<div id="org"></div></section>';
  }

  function loadOverview() { call("GET", "/admin/overview", undefined, true).then(function (o) { var e = document.getElementById("overview"); if (!e) return; e.innerHTML = o.businessesByStatus.map(function (s) { return P.ui.tag(s.status + ": " + s.n); }).join("") + P.ui.tag("verification pending: " + o.verificationPending) + P.ui.tag("awaiting activation: " + o.awaitingActivation) + P.ui.tag("open tickets: " + o.openTickets) + P.ui.tag("pending invitations: " + o.pendingInvitations); }).catch(function () {}); }
  function loadBusinesses() {
    call("GET", "/admin/businesses?pageSize=50", undefined, true).then(function (r) {
      var e = document.getElementById("biz"); if (!e) return;
      if (!r.items.length) { e.innerHTML = "<p>No businesses yet. Create one above.</p>"; return; }
      e.innerHTML = r.items.map(function (b) {
        var btn = function (a, l) { return '<button class="btn btn-outline btn-sm" type="button" data-act="' + a + '" data-id="' + b.id + '">' + l + "</button>"; };
        return '<div class="room-item" style="margin-bottom:10px"><div class="room-top"><div><h3>' + esc(b.name) + '</h3><div class="sub">' + esc(b.city) + ", " + esc(b.countryName) + " · " + esc(b.category) + '</div></div><div class="row">' + P.ui.badge(b.status, b.status === "published" ? "ok" : "neutral") + P.ui.badge("verification: " + b.verificationStatus, b.verificationStatus === "approved" ? "ok" : "warn") + P.ui.badge("location: " + b.locationStatus, b.locationStatus === "verified" ? "ok" : "warn") + P.ui.badge(b.activation.replace("_", " "), b.activation === "activated" ? "ok" : "info") + "</div></div>" +
          (b.missingForPublish.length ? '<div class="sub">Missing to publish: ' + esc(b.missingForPublish.join(", ")) + "</div>" : "") +
          '<div class="row">' + btn("verify", "Approve verification") + btn("loc", "Verify location") + btn("publish", "Publish") + btn("unpublish", "Unpublish") + btn("invite", "Invite owner") + btn("suspend", "Suspend") + btn("restore", "Restore") + btn("detail", "Details") + "</div></div>";
      }).join("");
    }).catch(function () {});
  }
  function loadOrg() {
    var s = document.getElementById("c-org"); orgId = s ? s.value : me.memberships[0].organisationId; var e = document.getElementById("org"); if (!e) return;
    Promise.all([call("GET", "/organisations/" + orgId + "/summary", undefined, true), call("GET", "/organisations/" + orgId + "/business", undefined, true), call("GET", "/organisations/" + orgId + "/enquiries", undefined, true), call("GET", "/organisations/" + orgId + "/members", undefined, true)]).then(function (r) {
      var sum = r[0], b = r[1], enq = r[2], mem = r[3], can = function (p) { return me.memberships.filter(function (m) { return m.organisationId === orgId; })[0].permissions.indexOf(p) > -1; };
      e.innerHTML = '<p>' + P.ui.badge("listing: " + sum.listingStatus, sum.listingStatus === "published" ? "ok" : "neutral") + " " + P.ui.badge("verification: " + sum.verificationStatus, sum.verificationStatus === "approved" ? "ok" : "warn") + " " + P.ui.tag("new enquiries: " + sum.enquiries.new) + '</p>' + (sum.missingForPublish.length ? '<p class="form-note">Still needed before it can go public: ' + esc(sum.missingForPublish.join(", ")) + ".</p>" : "") +
        (can("org.profile.edit") ? '<form id="f-profile" class="form-grid" style="margin:12px 0" novalidate>' + f("hours", "Opening hours", "text", 'value="' + esc(b.hours || "") + '"') + f("phone", "Phone", "text", 'value="' + esc(b.phone || "") + '"') + f("summary", "Summary", "text", 'value="' + esc(b.summary || "") + '"') + f("services", "Services (comma separated)", "text", 'value="' + esc((b.services || []).join(", ")) + '"') + '<div class="form-actions"><button class="btn btn-primary" type="submit">Save profile</button></div></form>' : "") +
        "<h3>Enquiries</h3>" + (enq.items.length ? enq.items.map(function (q) { return '<div class="room-item" style="margin:8px 0"><div class="room-top"><div><h3>' + esc(q.reference) + " · " + esc(q.type) + '</h3><div class="sub">' + esc(q.name) + " · " + esc(q.email) + '</div></div>' + P.ui.badge(q.status, q.status === "new" ? "warn" : "neutral") + "</div><p>" + esc(q.message || "") + "</p>" + (can("org.enquiries.reply") ? '<div class="row">' + ["read", "replied", "closed"].map(function (st) { return '<button class="btn btn-outline btn-sm" type="button" data-enq="' + q.id + '" data-st="' + st + '">Mark ' + st + "</button>"; }).join("") + "</div>" : "") + "</div>"; }).join("") : "<p>No enquiries yet.</p>") +
        "<h3>Team</h3><p>" + mem.items.map(function (m) { return esc(m.name) + " (" + esc(m.role) + ")"; }).join(", ") + "</p>" +
        (can("org.staff.manage") ? '<form id="f-staff" class="form-grid cols-2" novalidate>' + f("email", "Invite staff by email", "email") + sel("role", "Role", [["business_staff", "Staff"], ["business_manager", "Manager"], ["business_owner", "Owner"]]) + '<div class="form-actions span-2"><button class="btn btn-outline" type="submit">Send invitation</button></div></form>' : "");
      wireOrg();
    }).catch(function () {});
  }

  function data(form) { var o = {}; Array.prototype.forEach.call(form.elements, function (el) { if (el.name && el.value !== "") o[el.name] = el.value; }); return o; }
  function refresh() { return call("GET", "/auth/me", undefined, true).then(function (r) { me = r.user ? r : null; render(); }); }
  function on(id, ev, fn) { var el = document.getElementById(id); if (el) el.addEventListener(ev, fn); }

  function wire() {
    on("f-login", "submit", function (e) { e.preventDefault(); call("POST", "/auth/login", data(e.target)).then(function (r) { if (r.mfaRequired) { document.getElementById("f-mfa").hidden = false; P.toast("Enter your authentication code."); } else refresh(); }).catch(function () {}); });
    on("f-mfa", "submit", function (e) { e.preventDefault(); call("POST", "/auth/mfa/verify", data(e.target)).then(refresh).catch(function () {}); });
    on("b-logout", "click", function () { call("POST", "/auth/logout").then(function () { try { sessionStorage.removeItem("pamoja-csrf"); } catch (x) {} me = null; render(); }); });
    on("f-activate", "submit", function (e) { e.preventDefault(); call("POST", "/auth/activate", data(e.target)).then(function () { P.toast("Activated. Now sign in."); }).catch(function () {}); });
    on("f-enq", "submit", function (e) { e.preventDefault(); var d = data(e.target); d.consent = true; call("POST", "/enquiries", d).then(function () { P.toast("Enquiry sent."); if (me && me.memberships.length) loadOrg(); }).catch(function () {}); });
    on("f-biz", "submit", function (e) { e.preventDefault(); var d = data(e.target); ["lat", "lng"].forEach(function (k) { if (d[k] !== undefined) d[k] = Number(d[k]); }); call("POST", "/admin/businesses", d).then(function (r) { if (r.invitation && r.invitation.activationUrl) out("Business created. Activation link (dev only)", r.invitation); loadBusinesses(); loadOverview(); }).catch(function (er) { if (er.code === "DUPLICATE_BUSINESS") P.toast("Possible duplicate. See the response."); }); });
    on("f-import", "submit", function (e) { e.preventDefault(); var dry = e.submitter && e.submitter.getAttribute("data-dry") === "1"; fetch(P.config.api.baseUrl + "/admin/businesses/import?dryRun=" + (dry ? "true" : "false"), { method: "POST", credentials: "include", headers: { "Content-Type": "text/csv", "X-CSRF-Token": sessionStorage.getItem("pamoja-csrf") || "" }, body: document.getElementById("c-csv").value }).then(function (r) { return r.json(); }).then(function (j) { out("Import " + (dry ? "(dry run)" : "(committed)"), j); if (!dry) { loadBusinesses(); loadOverview(); } }); });
    on("b-tickets", "click", function () { call("GET", "/admin/tickets"); });
    on("b-audit", "click", function () { call("GET", "/admin/audit?pageSize=25"); });
    on("c-org", "change", loadOrg);
    var bz = document.getElementById("biz");
    if (bz) bz.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]"); if (!b) return; var id = b.getAttribute("data-id"), a = b.getAttribute("data-act"), base = "/admin/businesses/" + id, req;
      if (a === "verify") { var n = prompt("Evidence you checked (required):", "Licence and site visit"); if (!n) return; req = call("POST", base + "/verification", { status: "approved", note: n }); }
      else if (a === "loc") req = call("POST", base + "/location-verification", { status: "verified" });
      else if (a === "publish") req = call("POST", base + "/publish");
      else if (a === "unpublish") req = call("POST", base + "/unpublish");
      else if (a === "suspend") { var r = prompt("Reason (required):", "Complaint under review"); if (!r) return; req = call("POST", base + "/suspend", { reason: r }); }
      else if (a === "restore") req = call("POST", base + "/restore");
      else if (a === "invite") { var m = prompt("Owner email:"); if (!m) return; req = call("POST", base + "/invitations", { email: m }); }
      else if (a === "detail") req = call("GET", base);
      if (req) req.then(function () { loadBusinesses(); loadOverview(); }).catch(function () { loadBusinesses(); });
    });
  }
  function wireOrg() {
    on("f-profile", "submit", function (e) { e.preventDefault(); var d = data(e.target); if (d.services !== undefined) d.services = d.services.split(",").map(function (s) { return s.trim(); }).filter(Boolean); call("PATCH", "/organisations/" + orgId + "/business", d).then(loadOrg).catch(function () {}); });
    on("f-staff", "submit", function (e) { e.preventDefault(); call("POST", "/organisations/" + orgId + "/invitations", data(e.target)).catch(function () {}); });
    document.getElementById("org").addEventListener("click", function (e) { var b = e.target.closest("[data-enq]"); if (!b) return; call("PATCH", "/organisations/" + orgId + "/enquiries/" + b.getAttribute("data-enq"), { status: b.getAttribute("data-st") }).then(loadOrg).catch(function () {}); });
  }

  P.page.console = {
    init: function () {
      root = document.getElementById("console");
      if (P.api.mode() === "sample") { render(); return; }
      call("GET", "/categories", undefined, true).then(function (r) { cats = r.items; }).catch(function () {}).then(refresh).catch(function () { render(); });
    }
  };
})(window.PAMOJA);
