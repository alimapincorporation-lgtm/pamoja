/* API client. Pages and components only talk to PAMOJA.api.
   mode "sample": built-in sample data. mode "hybrid": businesses (see config.api.live), auth, contact, reports and enquiries for live listings
   use the backend REST API; everything else stays sample. mode "live": everything uses the backend. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var cfg = function () { return P.config.api; };
  function qs(params) {
    var o = [];
    Object.keys(params || {}).forEach(function (k) { if (params[k] !== "" && params[k] != null) o.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k])); });
    return o.length ? "?" + o.join("&") : "";
  }
  function csrf() { try { return sessionStorage.getItem("pamoja-csrf"); } catch (e) { return null; } }
  function live(method, path, body) {
    var h = { Accept: "application/json" }, t = csrf();
    if (body !== undefined) h["Content-Type"] = "application/json";
    if (t && method !== "GET") h["X-CSRF-Token"] = t;
    return fetch(cfg().baseUrl + path, { method: method, headers: h, credentials: "include", body: body !== undefined ? JSON.stringify(body) : undefined })
      .catch(function () { throw { code: "NETWORK", message: "We couldn’t reach the server. Check your connection and try again." }; })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (!r.ok) throw { status: r.status, code: j.code || "REQUEST_FAILED", message: j.message || "The request failed. Please try again.", fields: j.fields, details: j.details };
          if (j && j.csrfToken) { try { sessionStorage.setItem("pamoja-csrf", j.csrfToken); } catch (e) { /* ignore */ } }
          return j;
        });
      });
  }
  function sample(fn) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () { try { resolve(fn()); } catch (e) { reject(e && e.code ? e : { code: "SAMPLE_ERROR", message: (e && e.message) || "Something went wrong." }); } }, 250);
    });
  }
  var mode = function () { return cfg().mode; };
  var resourceLive = function (r) { return mode() === "live" || (mode() === "hybrid" && cfg().live.indexOf(r) > -1); };
  function postLive(path, body) {
    if (mode() === "live") return true;
    if (mode() !== "hybrid") return false;
    if (/^\/(auth|contact|reports)/.test(path)) return true;
    return /^\/(enquiries|bookings)$/.test(path) && !!body && cfg().live.indexOf(body.resource) > -1;
  }
  P.api = {
    mode: mode,
    live: live,   // direct call to the backend (used by the developer console and auth)
    list: function (resource, params) { return resourceLive(resource) ? live("GET", "/" + resource + qs(params)) : sample(function () { return P.sample.query(resource, params); }); },
    get: function (resource, id) {
      return resourceLive(resource) ? live("GET", "/" + resource + "/" + encodeURIComponent(id))
        : sample(function () { var r = P.sample.get(resource, id); if (!r) throw { code: "NOT_FOUND", message: "Not found" }; return r; });
    },
    post: function (path, body) {
      if (!postLive(path, body)) return sample(function () { return P.sample.submit(path, body); });
      return live("POST", path === "/bookings" ? "/enquiries" : path, body);
    }
  };
})(window.PAMOJA);
