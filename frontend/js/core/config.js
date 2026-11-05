/* Central configuration: brand, route registry and navigation. Plain scripts (no modules) so pages also open from file://. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  P.config = {
    brand: { name: "AFCON PAMOJA", developer: "Alimap Incorporation", developerUrl: "https://www.alimapincorporation.org" },
    // mode: "sample" = built-in sample data only; "hybrid" = resources listed in `live` (plus auth, contact, reports) use the backend, the rest stay sample;
    // "live" = everything from the backend. Overridden by window.PAMOJA_BOOT_API (injected when the backend serves this site),
    // by localStorage "pamoja-api", or by adding ?api=sample | ?api=hybrid | ?api=live to any page address.
    api: { mode: "sample", baseUrl: "/api/v1", live: ["businesses"] },
    // Google Maps. Leave embedApiKey empty to use keyless embeds (fine for testing). For production, create a Maps Embed API key,
    // restrict it to your domain (HTTP referrers) and paste it here; embeds then use the official Maps Embed API.
    maps: { embedApiKey: "" },
    routes: {
      home:               { label: "Home",               href: "index.html" },
      explore:            { label: "Explore",            href: "pages/public/explore.html" },
      football:           { label: "Football",           href: "pages/public/football.html" },
      destinations:       { label: "Destinations",       href: "pages/public/destinations.html" },
      destinationDetails: { label: "Destination",        href: "pages/public/destination-details.html" },
      hotels:             { label: "Hotels",             href: "pages/public/hotels.html" },
      hotelDetails:       { label: "Hotel",              href: "pages/public/hotel-details.html" },
      transport:          { label: "Transport",          href: "pages/public/transport.html" },
      transportDetails:   { label: "Transport provider", href: "pages/public/transport-details.html" },
      businesses:         { label: "Businesses",         href: "pages/public/businesses.html" },
      businessDetails:    { label: "Business",           href: "pages/public/business-details.html" },
      tours:              { label: "Tour packages",      href: "pages/public/tours.html" },
      tourDetails:        { label: "Tour",               href: "pages/public/tour-details.html" },
      restaurants:        { label: "Restaurants & food", href: "pages/public/restaurants.html" },
      events:             { label: "Events & activities", href: "pages/public/events.html" },
      news:               { label: "Sports news & media", href: "pages/public/news.html" },
      search:             { label: "Search",             href: "pages/public/search.html" },
      stadiums:           { label: "Stadiums",           href: "pages/public/stadiums.html" },
      stadiumDetails:     { label: "Stadium",            href: "pages/public/stadium-details.html" },
      stadiumFacilities:  { label: "Facilities & accessibility", href: "pages/public/stadium-facilities.html" },
      stadiumEvents:      { label: "Stadium events",     href: "pages/public/stadium-events.html" },
      stadiumTravel:      { label: "Travel & parking",   href: "pages/public/stadium-travel.html" },
      ai:                 { label: "AI Assistant",       href: "pages/public/ai-assistant.html" },
      login:              { label: "Sign in",            href: "pages/public/login.html" },
      register:           { label: "Create account",     href: "pages/public/register.html" },
      forgot:             { label: "Forgot password",    href: "pages/public/forgot-password.html" },
      reset:              { label: "Reset password",     href: "pages/public/reset-password.html" },
      activate:           { label: "Activate account",   href: "pages/public/activate-account.html" },
      about:              { label: "About Alimap",       href: "pages/public/about.html" },
      contact:            { label: "Contact & Support",  href: "pages/public/contact.html" },
      help:               { label: "Help Centre & FAQs", href: "pages/public/help.html" },
      privacy:            { label: "Privacy",            href: "pages/public/privacy.html" },
      terms:              { label: "Terms",              href: "pages/public/terms.html" }
    },
    nav: ["explore", "football", "destinations", "hotels", "transport", "businesses", "stadiums", "ai"],
    footer: [
      { title: "Explore",  links: ["explore", "destinations", "tours", "restaurants", "events", "businesses"] },
      { title: "Football & travel", links: ["football", "news", "stadiums", "hotels", "transport"] },
      { title: "Platform", links: ["ai", "about", "help", "contact", "login"] }
    ],
    legal: ["privacy", "terms"]
  };

  (function () {
    var a = P.config.api;
    if (window.PAMOJA_BOOT_API) Object.assign(a, window.PAMOJA_BOOT_API);
    try {
      var q = new URLSearchParams(location.search).get("api");
      if (q === "sample") localStorage.removeItem("pamoja-api");
      else if (q === "hybrid" || q === "live") localStorage.setItem("pamoja-api", JSON.stringify({ mode: q }));
      var o = JSON.parse(localStorage.getItem("pamoja-api") || "null");
      if (o) Object.assign(a, o);
      if (q === "sample") a.mode = "sample";
    } catch (e) { /* storage unavailable */ }
    // When the page is served by a static server on :8080 and the API runs on :3000 of the same host.
    if (a.mode !== "sample" && a.baseUrl === "/api/v1" && location.port === "8080") a.baseUrl = location.protocol + "//" + location.hostname + ":3000/api/v1";
  })();
})(window.PAMOJA);
