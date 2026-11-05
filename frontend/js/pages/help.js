/* Help centre: filter FAQ entries as you type. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  P.page.help = {
    init: function () {
      var input = document.getElementById("faq-search"), items = Array.prototype.slice.call(document.querySelectorAll(".faq details")), none = document.getElementById("faq-none");
      input.addEventListener("input", function () {
        var t = input.value.toLowerCase().trim(), shown = 0;
        items.forEach(function (d) { var m = !t || d.textContent.toLowerCase().indexOf(t) > -1; d.hidden = !m; if (m) shown++; if (t && m) d.open = true; });
        none.hidden = shown > 0;
      });
    }
  };
})(window.PAMOJA);
