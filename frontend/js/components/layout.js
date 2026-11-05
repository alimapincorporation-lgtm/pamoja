/* Shared header + footer. Pages declare <div data-slot="header"></div> / <div data-slot="footer"></div>
   and <body data-base="" data-page="home"> (data-base is the path prefix back to the frontend root). */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  function link(key, cls, base) {
    var r = P.config.routes[key];
    return '<a href="' + base + r.href + '"' + (cls ? ' class="' + cls + '"' : "") +
      (r.built === false ? ' data-planned="' + r.label + '"' : "") + ' data-route="' + key + '">' + r.label + "</a>";
  }
  function banner() {
    var m = P.config.api.mode;
    if (m === "live") return "";
    var t = m === "hybrid"
      ? "<b>Test build.</b> The business directory, sign-in, enquiries, contact and reports use the live test backend. Hotels, tours, transport, restaurants, events, news and fixtures are still sample data."
      : "<b>Frontend test build.</b> Listings, prices, availability, fixtures and articles are sample data. Nothing you submit is sent to a business.";
    return '<div class="sample-banner"><div class="container">' + t + "</div></div>";
  }
  function header(base) {
    var c = P.config, i = P.icon;
    var items = c.nav.map(function (k) { return "<li>" + link(k, "", base) + "</li>"; }).join("");
    return '<a class="skip-link" href="#main">Skip to main content</a>' +
      '<header class="site-header"><div class="container header-inner">' +
      '<a class="brand" href="' + base + 'index.html" aria-label="' + c.brand.name + ' home"><img src="' + base + 'assets/logos/pamoja-mark.svg" alt="" width="34" height="34"><span>AFCON <b>PAMOJA</b></span></a>' +
      '<nav class="primary-nav" id="primary-nav" aria-label="Primary"><ul>' + items + "</ul>" +
      '<div class="nav-extra">' + link("login", "btn btn-outline-light", base) + link("ai", "btn btn-light", base).replace(">AI Assistant<", ">Plan My Journey<") + "</div></nav>" +
      '<div class="header-actions">' +
      '<button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="Switch theme">' + i("sun", "icon-sun") + i("moon", "icon-moon") + "</button>" +
      link("login", "btn-link desktop-only", base) +
      link("ai", "btn btn-light desktop-only sm-up", base).replace(">AI Assistant<", ">Plan My Journey<") +
      '<button class="icon-btn menu-btn" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">' + i("menu", "icon-open") + i("x", "icon-close") + "</button>" +
      "</div></div></header>" + banner();
  }
  function footer(base) {
    var c = P.config;
    var cols = c.footer.map(function (g) {
      return '<div class="footer-col"><h3>' + g.title + "</h3>" + g.links.map(function (k) { return link(k, "", base); }).join("") + "</div>";
    }).join("");
    var legal = c.legal.map(function (k) { return link(k, "", base); }).join(" · ");
    return '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid"><div class="footer-brand"><a class="brand" href="' + base + 'index.html"><img src="' + base + 'assets/logos/pamoja-mark.svg" alt="" width="34" height="34"><span>AFCON <b>PAMOJA</b></span></a>' +
      "<p>Football, travel, local businesses and stadium information in one place across Uganda, Kenya and Tanzania.</p></div>" + cols + "</div>" +
      '<div class="footer-legal"><p>AFCON PAMOJA is an independent platform operated by <a href="' + c.brand.developerUrl + '" rel="noopener" style="text-decoration:underline">' + c.brand.developer + "</a>. It is not endorsed by, affiliated with, or licensed by CAF, AFCON, any organising committee, stadium operator or government body.</p>" +
      "<p>Third-party names, data and media are shown only with permission and carry their source and last-updated date. Prices and availability must be confirmed with the provider before booking.</p>" +
      "<p>© " + new Date().getFullYear() + " " + c.brand.developer + ". " + legal + "</p></div></div></footer>";
  }
  P.layout = {
    render: function () {
      var base = document.body.getAttribute("data-base") || "";
      var h = document.querySelector('[data-slot="header"]'), f = document.querySelector('[data-slot="footer"]');
      if (h) h.outerHTML = header(base);
      if (f) f.outerHTML = footer(base);
      var cur = document.body.getAttribute("data-page");
      if (cur) document.querySelectorAll('[data-route="' + cur + '"]').forEach(function (a) { a.setAttribute("aria-current", "page"); });
    }
  };
})(window.PAMOJA);
