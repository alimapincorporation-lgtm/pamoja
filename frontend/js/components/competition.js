/* Competition centre: Overview / Matches / Table / Stats. Mount: <div data-mount="competition">.
   Reads PAMOJA.api resources "matches", "standings" and "playerstats" (sample data in test builds; official data feed later). */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var ui = P.ui, esc = ui.esc, TABS = ["overview", "matches", "table", "stats"], LABEL = { overview: "Overview", matches: "Matches", table: "Table", stats: "Stats" };
  var ZONE = function (rank) { return rank <= 2 ? "var(--info)" : rank === 3 ? "var(--gold-accent)" : "transparent"; };

  function crest(c, sm) { return '<span class="crest' + (sm ? " sm" : "") + '" style="--c:' + c.color + '" aria-hidden="true">' + esc(c.short) + "</span>"; }
  function when(iso) {
    var d = new Date(iso + "T00:00:00"), t = new Date(); t.setHours(0, 0, 0, 0); var diff = Math.round((d - t) / 864e5);
    return diff === 0 ? "Today" : diff === -1 ? "Yesterday" : diff === 1 ? "Tomorrow" : ui.date(iso);
  }
  function mcard(m) {
    var fin = m.status === "finished", hw = fin && m.hs > m.as, aw = fin && m.as > m.hs;
    function row(c, name, score, cls) { return '<span class="mc-team ' + cls + '">' + crest(c) + '<span class="mc-name">' + esc(name) + "</span>" + (fin ? '<span class="mc-score">' + score + "</span>" : "<span></span>") + "</span>"; }
    var aria = m.home + (fin ? " " + m.hs + ", " + m.away + " " + m.as + ", full time, " : " versus " + m.away + ", kick-off " + m.time + ", ") + when(m.date) + ". Open match details";
    return '<button class="mcard" type="button" data-match="' + m.id + '" aria-label="' + esc(aria) + '"><span class="mc-teams">' + row(m.homeClub, m.home, m.hs, fin && aw ? "is-lose" : hw ? "is-win" : "") + row(m.awayClub, m.away, m.as, fin && hw ? "is-lose" : aw ? "is-win" : "") + '</span><span class="mc-side"><span class="mc-status">' + (fin ? "FT" : esc(m.time)) + '</span><span class="mc-date">' + esc(when(m.date)) + "</span></span></button>";
  }
  function tableHtml(rows, compact) {
    var cols = compact ? [["MP", "mp"], ["GD", "gd"], ["Pts", "pts"]] : [["MP", "mp"], ["W", "w"], ["D", "d"], ["L", "l"], ["GF", "gf"], ["GA", "ga"], ["GD", "gd"], ["Pts", "pts"]];
    var th = '<th scope="col"><span class="visually-hidden">Position</span></th><th scope="col" class="club">Club</th>' + cols.map(function (c) { return '<th scope="col" title="' + { MP: "Matches played", W: "Won", D: "Drawn", L: "Lost", GF: "Goals for", GA: "Goals against", GD: "Goal difference", Pts: "Points" }[c[0]] + '">' + c[0] + "</th>"; }).join("") + (compact ? "" : '<th scope="col">Form</th>');
    var body = rows.map(function (r) {
      return '<tr><td style="--zone:' + ZONE(r.rank) + '">' + r.rank + '</td><th scope="row" class="club" style="font-weight:inherit"><span class="c">' + crest(r.club, true) + esc(r.club.name) + "</span></th>" +
        cols.map(function (c) { var v = r[c[1]]; if (c[1] === "gd" && v > 0) v = "+" + v; return '<td class="' + (c[1] === "pts" ? "pts" : "") + '">' + v + "</td>"; }).join("") +
        (compact ? "" : '<td><span class="form" aria-label="Last results: ' + r.form.join(", ") + '">' + r.form.map(function (f) { return "<i class=\"" + f + "\">" + f + "</i>"; }).join("") + "</span></td>") + "</tr>";
    }).join("");
    return '<div class="tbl-wrap" tabindex="0" role="region" aria-label="League table"><table class="tbl' + (compact ? " compact" : "") + '"><thead><tr>' + th + "</tr></thead><tbody>" + body + "</tbody></table></div>";
  }
  function statRows(rows, label) {
    return '<div class="shead"><span>Player</span><span>' + label + "</span></div>" + rows.map(function (r) {
      var ini = r.name.replace(/[^A-Za-z ]/g, "").split(" ").map(function (x) { return x[0]; }).join("").slice(0, 2);
      return '<div class="srow"><span class="rk">' + r.rank + '</span><span class="avatar" style="--c:' + r.club.color + '" aria-hidden="true">' + esc(ini) + '</span><span class="who"><b>' + esc(r.name) + '</b><span class="club">' + crest(r.club, true) + esc(r.club.name) + '</span></span><span class="val">' + r.value + "</span></div>";
    }).join("");
  }

  P.competition = {
    mount: function (el) {
      var st = { tab: "overview", stat: "goals", md: "recent" }, data = null;
      var h = (location.hash || "").slice(1); if (TABS.indexOf(h) > -1) st.tab = h;
      var followKey = "pamoja-follow-sample-cup";
      function following() { try { return localStorage.getItem(followKey) === "1"; } catch (e) { return false; } }
      el.innerHTML = ui.skeletons(2);
      Promise.all([P.api.list("matches", { pageSize: 100 }), P.api.list("standings"), P.api.list("playerstats", { stat: "goals" }), P.api.list("playerstats", { stat: "assists" })]).then(function (r) {
        data = { matches: r[0].items, table: r[1].items, goals: r[2].items, assists: r[3].items }; shell(); show();
      }).catch(function (e) { el.innerHTML = ui.state("error", "We couldn’t load the match centre", (e && e.message) || "Please try again.", '<button class="btn btn-primary" type="button" onclick="location.reload()">Try again</button>'); });

      function shell() {
        el.innerHTML = '<div class="comp-head"><div class="comp-title"><span class="icon-tile">' + P.icon("ball") + '</span><div><h2>Sample Cup</h2><p>Sample competition · fictional clubs · sample data</p></div></div><div class="comp-actions"><label class="visually-hidden" for="season">Season</label><select class="select" id="season"><option>Season 2026–27 (sample)</option></select><button class="btn btn-outline btn-follow" type="button" aria-pressed="' + following() + '">' + (following() ? "Following" : "Follow") + '</button></div></div>' +
          '<div class="pills" role="tablist" aria-label="Match centre sections">' + TABS.map(function (t) { return '<button class="pill" role="tab" id="ct-' + t + '" aria-controls="cp" aria-selected="' + (t === st.tab) + '" data-tab="' + t + '">' + LABEL[t] + "</button>"; }).join("") + '</div><div id="cp" role="tabpanel" tabindex="-1"></div>' +
          '<div class="alert alert-warn comp-note">' + P.icon("shield-check") + "<span><b>Sample data.</b> Clubs, scores, tables and players are fictional and generated for testing. Official fixtures, results, logos and player photos appear only once an authorised data source is connected. Source: sample data · Updated: not applicable.</span></div>";
      }
      function show() {
        var p = el.querySelector("#cp"); if (!p) return;
        el.querySelectorAll("[data-tab]").forEach(function (b) { var on = b.getAttribute("data-tab") === st.tab; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
        p.setAttribute("aria-labelledby", "ct-" + st.tab);
        p.innerHTML = { overview: overview, matches: matches, table: table, stats: stats }[st.tab]();
      }
      function overview() {
        var fin = data.matches.filter(function (m) { return m.status === "finished"; }).slice(0, 3), up = data.matches.filter(function (m) { return m.status === "upcoming"; }).slice(0, 3);
        return '<div class="comp-grid"><section class="comp-section" aria-label="Matches"><h3>Matches</h3><p class="comp-sub">Latest results</p><div class="mlist">' + fin.map(mcard).join("") + '</div><p class="comp-sub">Next fixtures</p><div class="mlist">' + up.map(mcard).join("") + '</div><button class="more-btn" type="button" data-tab="matches">More matches ' + P.icon("arrow-right") + "</button></section>" +
          '<div style="display:grid;gap:24px"><section class="comp-section" aria-label="Table"><h3>Table</h3>' + tableHtml(data.table.slice(0, 6), true) + '<button class="more-btn" type="button" data-tab="table">Full table ' + P.icon("arrow-right") + '</button></section><section class="comp-section" aria-label="Top scorers"><h3>Top scorers</h3>' + statRows(data.goals.slice(0, 3), "Goals") + '<button class="more-btn" type="button" data-tab="stats">More stats ' + P.icon("arrow-right") + "</button></section></div></div>";
      }
      function matches() {
        var mds = {}; data.matches.forEach(function (m) { (mds[m.matchday] = mds[m.matchday] || []).push(m); });
        var all = Object.keys(mds).map(Number).sort(function (a, b) { return a - b; }), lastDone = Math.max.apply(null, data.matches.filter(function (m) { return m.status === "finished"; }).map(function (m) { return m.matchday; }));
        var show = st.md === "all" ? all : st.md === "recent" ? all.filter(function (n) { return n >= lastDone - 1 && n <= lastDone + 1; }) : [Number(st.md)];
        var sel = '<div class="field" style="max-width:260px"><label for="mdsel">Matchday</label><select class="select" id="mdsel"><option value="recent"' + (st.md === "recent" ? " selected" : "") + '>Around now</option><option value="all"' + (st.md === "all" ? " selected" : "") + ">All matchdays</option>" + all.map(function (n) { return '<option value="' + n + '"' + (String(st.md) === String(n) ? " selected" : "") + ">Matchday " + n + "</option>"; }).join("") + "</select></div>";
        return sel + show.map(function (n) { return '<h3 class="md-title">Matchday ' + n + " of " + all.length + '</h3><div class="mlist">' + mds[n].sort(function (a, b) { return a.date.localeCompare(b.date) || a.time.localeCompare(b.time); }).map(mcard).join("") + "</div>"; }).join("") + (st.md === "recent" ? '<button class="more-btn" type="button" data-md="all">More matches ' + P.icon("arrow-right") + "</button>" : "");
      }
      function table() {
        return '<h3 class="comp-h">League table</h3>' + tableHtml(data.table, false) + '<div class="legend"><span style="--z:var(--info)">Knockout places (sample)</span><span style="--z:var(--gold-accent)">Play-off place (sample)</span></div><p class="form-note" style="margin-top:8px">MP played · W won · D drawn · L lost · GF goals for · GA goals against · GD goal difference · Pts points. Ranked by points, then goal difference, then goals for.</p>';
      }
      function stats() {
        var g = st.stat === "goals", rows = g ? data.goals : data.assists;
        return '<div class="subtabs" role="tablist" aria-label="Statistic"><button role="tab" aria-selected="' + g + '" data-stat="goals">Goals</button><button role="tab" aria-selected="' + !g + '" data-stat="assists">Assists</button></div>' + statRows(rows, g ? "Goals" : "Assists") + '<p class="form-note" style="margin-top:12px">Player names are fictional. Tied players share a position.</p>';
      }
      el.addEventListener("click", function (e) {
        var t = e.target.closest("[data-tab]"); if (t) { st.tab = t.getAttribute("data-tab"); if (history.replaceState) history.replaceState(null, "", "#" + st.tab); show(); if (e.target.closest(".more-btn")) el.querySelector("#cp").scrollIntoView({ block: "start" }); return; }
        var s = e.target.closest("[data-stat]"); if (s) { st.stat = s.getAttribute("data-stat"); show(); el.querySelector('[data-stat="' + st.stat + '"]').focus(); return; }
        var md = e.target.closest("[data-md]"); if (md) { st.md = md.getAttribute("data-md"); show(); return; }
        var f = e.target.closest(".btn-follow"); if (f) { var on = !following(); try { localStorage.setItem(followKey, on ? "1" : "0"); } catch (x) {} f.setAttribute("aria-pressed", on); f.textContent = on ? "Following" : "Follow"; P.toast(on ? "Following Sample Cup. In this test build it’s saved in this browser only." : "You’ve unfollowed Sample Cup."); return; }
        var mc = e.target.closest("[data-match]"); if (mc) openMatch(data.matches.filter(function (m) { return m.id === mc.getAttribute("data-match"); })[0], mc);
      });
      el.addEventListener("change", function (e) { if (e.target.id === "mdsel") { st.md = e.target.value; show(); el.querySelector("#mdsel").focus(); } });
      el.addEventListener("keydown", function (e) {
        var b = e.target.closest('[role="tab"][data-tab]'); if (!b || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
        var i = TABS.indexOf(st.tab), n = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length]; st.tab = n; show(); el.querySelector('[data-tab="' + n + '"]').focus();
      });
      window.addEventListener("hashchange", function () { var h = (location.hash || "").slice(1); if (TABS.indexOf(h) > -1 && h !== st.tab && data) { st.tab = h; show(); } });
      function openMatch(m, trigger) {
        var fin = m.status === "finished";
        var body = '<div class="mdet"><div class="big"><div>' + crest(m.homeClub) + "<div>" + esc(m.home) + '</div></div><div class="score">' + (fin ? m.hs + " – " + m.as : esc(m.time)) + "</div><div>" + crest(m.awayClub) + "<div>" + esc(m.away) + '</div></div></div><p>' + esc(when(m.date)) + " · " + ui.date(m.date, { weekday: "long", day: "numeric", month: "long" }) + (fin ? " · Full time" : " · Kick-off " + esc(m.time)) + "</p><p>" + P.icon("map-pin") + " " + esc(m.stadiumName) + ", " + esc(m.city) + '</p><div class="form-actions" style="justify-content:center"><a class="btn btn-primary" href="' + ui.url("stadiumDetails", { id: m.stadium }) + '">Venue information</a>' + (fin ? "" : '<button class="btn btn-outline" type="button" data-cal>Add to calendar</button>') + '</div><p class="form-note">Sample match. Venue details are to be confirmed by the venue operator.</p></div>';
        var d = P.modal(m.stage + " · " + m.competition, m.home + " v " + m.away, body, trigger);
        var cal = d.querySelector("[data-cal]"); if (cal) cal.addEventListener("click", function () { P.readers.ics({ id: m.id, date: m.date, time: m.time, title: m.home + " v " + m.away, venue: m.stadiumName, city: m.city }); });
      }
    }
  };
})(window.PAMOJA);
