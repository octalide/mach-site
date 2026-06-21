// "why mach" explorer: the left selector swaps the single code panel on the right.
(function () {
  var sel = document.querySelector(".why-selector");
  if (!sel) return;
  var opts = Array.prototype.slice.call(sel.querySelectorAll(".why-option"));
  var pres = Array.prototype.slice.call(document.querySelectorAll(".why-code"));
  var fname = document.querySelector("[data-why-filename]");
  if (!opts.length || !pres.length) return;

  function select(demo) {
    opts.forEach(function (o) {
      var on = o.getAttribute("data-demo") === demo;
      o.classList.toggle("active", on);
      o.setAttribute("aria-selected", on ? "true" : "false");
      if (on && fname) fname.textContent = o.getAttribute("data-file");
    });
    pres.forEach(function (p) {
      p.hidden = p.getAttribute("data-demo") !== demo;
    });
  }

  opts.forEach(function (o, i) {
    o.addEventListener("click", function () { select(o.getAttribute("data-demo")); });
    o.addEventListener("keydown", function (e) {
      var j = e.key === "ArrowDown" ? i + 1 : e.key === "ArrowUp" ? i - 1 : -1;
      if (j >= 0 && j < opts.length) {
        opts[j].focus();
        select(opts[j].getAttribute("data-demo"));
        e.preventDefault();
      }
    });
  });
}());
