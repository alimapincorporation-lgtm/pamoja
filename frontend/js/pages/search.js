/* Search results across every resource, grouped, with counts. URL: search.html?q=term */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var ui = P.ui, RES = ["hotels", "destinations", "tours", "transport", "businesses", "restaurants", "events", "stadiums", "news"];
  P.page.search = {
    init: function () {
      var form = document.getElementById("search-form"), out = document.getElementById("search-out"), q = ui.params().q || "", input = form.elements.q;
      input.value = q;
      form.addEventListener("submit", function (e) { e.preventDefault(); var v = input.value.trim(); history.replaceState(null, "", v ? "?q=" + encodeURIComponent(v) : location.pathname); run(v); });
      function run(term) {
        if (!term) { out.innerHTML = ui.state("empty", "Search AFCON PAMOJA", "Try a place, hotel, tour or stadium name — for example “Kampala” or “safari”."); return; }
        out.innerHTML = ui.skeletons(3);
        Promise.all(RES.map(function (r) { return P.api.list(r, { q: term, pageSize: 3 }).then(function (x) { return { res: r, data: x }; }); })).then(function (all) {
          var total = all.reduce(function (n, g) { return n + g.data.total; }, 0);
          if (!total) { out.innerHTML = ui.state("empty", "No results for “" + term + "”", "Check the spelling or try a broader word, like a city name.", '<a class="btn btn-outline" href="' + ui.url("explore") + '">Browse everything</a>'); return; }
          out.innerHTML = '<p class="results-count" role="status">' + total + " result" + (total === 1 ? "" : "s") + " for “" + ui.esc(term) + "”</p>" + all.filter(function (g) { return g.data.total; }).map(function (g) {
            return '<section style="margin-top:32px"><div class="row-head"><h2>' + ui.LABEL[g.res] + " (" + g.data.total + ')</h2><a href="' + ui.url(ui.LIST[g.res], { q: term }) + '">See all</a></div><div class="res-grid">' + g.data.items.map(function (i) { return P.cards.render(g.res, i); }).join("") + "</div></section>";
          }).join("");
        }).catch(function (e) { out.innerHTML = ui.state("error", "Search isn’t working right now", (e && e.message) || "Please try again.", '<button class="btn btn-primary" type="button" onclick="location.reload()">Try again</button>'); });
      }
      run(q);
    }
  };
})(window.PAMOJA);
