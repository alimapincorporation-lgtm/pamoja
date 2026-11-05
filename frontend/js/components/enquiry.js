/* Enquiry / quote / booking-request / report dialog. Submits through PAMOJA.api (sample mode: stored locally only). */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var ui = P.ui, esc = ui.esc;
  var F = {
    name:        function () { return fld("name", "Full name", '<input class="input" name="name" autocomplete="name" data-label="Full name">'); },
    email:       function () { return fld("email", "Email", '<input class="input" type="email" name="email" autocomplete="email" data-label="Email">'); },
    phone:       function () { return fld("phone", "Phone or WhatsApp (optional)", '<input class="input" type="tel" name="phone" autocomplete="tel" placeholder="+256 …" data-label="Phone">'); },
    message:     function (r) { return fld("message", r ? "Message" : "Message (optional)", '<textarea class="textarea" name="message" data-label="Message"></textarea>', "span-2"); },
    checkIn:     function () { return fld("checkIn", "Check-in", '<input class="input" type="date" name="checkIn" data-label="Check-in">'); },
    checkOut:    function () { return fld("checkOut", "Check-out", '<input class="input" type="date" name="checkOut" data-label="Check-out">'); },
    guests:      function () { return fld("guests", "Guests", '<input class="input" type="number" name="guests" min="1" max="20" value="2" data-label="Guests">'); },
    date:        function () { return fld("date", "Date", '<input class="input" type="date" name="date" data-label="Date">'); },
    time:        function () { return fld("time", "Time (optional)", '<input class="input" type="time" name="time" data-label="Time">'); },
    travellers:  function () { return fld("travellers", "Travellers", '<input class="input" type="number" name="travellers" min="1" max="30" value="2" data-label="Travellers">'); },
    pickup:      function () { return fld("pickup", "Pick-up location", '<input class="input" name="pickup" data-label="Pick-up location" placeholder="e.g. Entebbe airport">'); },
    destination: function () { return fld("destination", "Destination", '<input class="input" name="destination" data-label="Destination" placeholder="e.g. hotel or stadium">'); },
    passengers:  function () { return fld("passengers", "Passengers", '<input class="input" type="number" name="passengers" min="1" max="60" value="2" data-label="Passengers">'); },
    what:        function () { return fld("what", "What’s wrong?", '<select class="select" name="what" data-label="This field"><option value="">Choose one</option><option>Wrong map location</option><option>Wrong price or availability</option><option>Wrong contact details</option><option>This business shouldn’t be listed</option><option>Something else</option></select>', "span-2"); }
  };
  function fld(name, label, control, cls) { return '<div class="field ' + (cls || "") + '"><label for="f-' + name + '">' + label + "</label>" + control.replace("name=\"" + name + "\"", 'name="' + name + '" id="f-' + name + '"') + '<p class="field-error"></p></div>'; }

  var T = {
    enquiry: { title: "Send an enquiry", fields: ["name", "email", "phone", "message"], req: { name: ["required"], email: ["required", "email"], phone: ["phone"], message: ["required", { min: 10 }] }, path: "/enquiries", submit: "Send enquiry", done: "Enquiry sent", note: "This is an enquiry, not a confirmed booking." },
    booking: { title: "Request to book", fields: ["checkIn", "checkOut", "guests", "name", "email", "phone", "message"], req: { checkIn: ["required", "future"], checkOut: ["required", { after: "checkIn" }], guests: ["required", { minNum: 1 }, { maxNum: 20 }], name: ["required"], email: ["required", "email"], phone: ["phone"] }, path: "/bookings", submit: "Send booking request", done: "Booking request sent", note: "This is a request, not a confirmed booking. The hotel confirms availability and price before you pay anything." },
    tour: { title: "Request a booking", fields: ["date", "travellers", "name", "email", "phone", "message"], req: { date: ["required", "future"], travellers: ["required", { minNum: 1 }, { maxNum: 30 }], name: ["required"], email: ["required", "email"], phone: ["phone"] }, path: "/bookings", submit: "Send booking request", done: "Booking request sent", note: "This is a request, not a confirmed booking. The operator confirms dates and price first." },
    quote: { title: "Request a quote", fields: ["pickup", "destination", "date", "time", "passengers", "name", "email", "phone", "message"], req: { pickup: ["required"], destination: ["required"], date: ["required", "future"], passengers: ["required", { minNum: 1 }, { maxNum: 60 }], name: ["required"], email: ["required", "email"], phone: ["phone"] }, path: "/enquiries", submit: "Request quote", done: "Quote request sent", note: "The provider replies with a quote. Nothing is booked until you accept it." },
    table: { title: "Request a table", fields: ["date", "time", "guests", "name", "email", "phone", "message"], req: { date: ["required", "future"], guests: ["required", { minNum: 1 }, { maxNum: 20 }], name: ["required"], email: ["required", "email"], phone: ["phone"] }, path: "/bookings", submit: "Send request", done: "Table request sent", note: "This is a request. The restaurant confirms your table." },
    report: { title: "Report a problem with this listing", fields: ["what", "email", "message"], req: { what: ["required"], email: ["email"], message: ["required", { min: 10 }] }, path: "/reports", submit: "Send report", done: "Report sent", note: "Our team reviews reports and may contact you if you add an email." }
  };

  P.enquiry = {
    open: function (o) {
      var t = T[o.type] || T.enquiry, name = o.item.name || o.item.title;
      var d = document.createElement("dialog"); d.className = "modal";
      var extra = o.room ? '<div class="alert alert-info" style="margin-bottom:16px">' + P.icon("bed") + "<span>Room: <b>" + esc(o.room) + "</b></span></div>" : "";
      d.innerHTML = '<div class="modal-head"><div><h2>' + t.title + "</h2><p>" + esc(name) + '</p></div><button class="icon-btn" type="button" aria-label="Close" data-close>' + P.icon("x") + "</button></div>" +
        '<div class="modal-body"><form novalidate>' + extra + '<div class="alert alert-info" style="margin-bottom:16px">' + P.icon("shield-check") + "<span>" + t.note + '</span></div><div class="form-grid cols-2">' + t.fields.map(function (k) { return F[k](t.req[k] && t.req[k].indexOf("required") > -1); }).join("") +
        '<div class="field span-2"><label class="check"><input type="checkbox" name="consent" data-label="Consent"><span>I agree to be contacted about this request. See the <a href="' + ui.url("privacy") + '" style="text-decoration:underline">privacy notice</a>.</span></label><p class="field-error"></p></div></div>' +
        '<div class="form-actions"><button class="btn btn-primary" type="submit">' + t.submit + '</button><button class="btn btn-outline" type="button" data-close>Cancel</button></div></form></div>';
      document.body.appendChild(d);
      var form = d.querySelector("form"), rules = Object.assign({}, t.req, { consent: ["required"] });
      P.validate.live(form, rules);
      var today = new Date().toISOString().slice(0, 10);
      ["checkIn", "date"].forEach(function (n) { if (form.elements[n]) form.elements[n].min = today; });
      d.addEventListener("click", function (e) { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
      d.addEventListener("close", function () { d.remove(); if (o.trigger && o.trigger.focus) o.trigger.focus(); });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var r = P.validate.run(form, rules); if (!r.valid) return;
        var btn = form.querySelector('[type="submit"]'); btn.disabled = true; btn.textContent = "Sending…";
        var TYPE = { enquiry: "enquiry", booking: "booking_request", tour: "booking_request", quote: "quote", table: "table_request" }, KEYS = ["checkIn", "checkOut", "date", "time", "guests", "travellers", "passengers", "pickup", "destination", "luggage"], details = {};
        KEYS.forEach(function (k) { if (r.data[k]) details[k] = r.data[k]; }); if (o.room) details.room = o.room;
        var body = t.path === "/reports"
          ? { resource: o.resource, listingId: o.item.id, what: r.data.what, email: r.data.email, message: r.data.message }
          : { resource: o.resource, listingId: o.item.id, listingName: name, type: TYPE[o.type] || "enquiry", name: r.data.name, email: r.data.email, phone: r.data.phone, message: r.data.message, details: details, consent: true };
        P.api.post(t.path, body).then(function (res) {
          form.parentNode.innerHTML = '<div class="alert alert-ok" role="status">' + P.icon("check") + "<span><b>" + t.done + ".</b> Your reference is <b>" + esc(res.reference) + "</b>.</span></div>" +
            (res.sample ? '<p class="form-note" style="margin-top:12px">Test build: nothing was sent to the business. In the live platform the business sees this in its dashboard and replies to the contact details you gave.</p>' : '<p class="form-note" style="margin-top:12px">The business has been notified and will reply to the contact details you gave.</p>') +
            '<div class="form-actions"><button class="btn btn-primary" type="button" data-close>Done</button></div>';
        }).catch(function (err) {
          btn.disabled = false; btn.textContent = t.submit;
          var a = form.querySelector(".alert-err") || document.createElement("div"); a.className = "alert alert-err"; a.setAttribute("role", "alert"); a.innerHTML = P.icon("shield-check") + "<span>" + esc(err.message || "We couldn’t send this. Please try again.") + "</span>"; form.insertBefore(a, form.firstChild);
        });
      });
      d.showModal();
      var first = form.querySelector("input,select,textarea"); if (first) first.focus();
    }
  };
})(window.PAMOJA);
