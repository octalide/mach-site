// docs shell: mobile nav, on-this-page scroll-spy, and a command-palette search.
(function () {
  // the doc map the palette searches (prototype: Overview + Variadics resolve)
  var PAGES = [
    { title: "Overview", group: "Start", url: "index.html" },
    { title: "Install", group: "Start", url: "#" },
    { title: "Hello world", group: "Start", url: "#" },
    { title: "Project layout", group: "Start", url: "#" },
    { title: "Types", group: "Language", url: "#" },
    { title: "Values and variables", group: "Language", url: "#" },
    { title: "Functions", group: "Language", url: "#" },
    { title: "Modules", group: "Language", url: "#" },
    { title: "The comptime channel", group: "Comptime", url: "#" },
    { title: "Intrinsics", group: "Comptime", url: "#" },
    { title: "Control flow", group: "Comptime", url: "#" },
    { title: "Variadic packs", group: "Comptime", url: "variadics.html" },
    { title: "Decorators", group: "Comptime", url: "#" },
    { title: "CLI", group: "Tooling", url: "#" },
    { title: "Manifest", group: "Tooling", url: "#" },
    { title: "Dependencies", group: "Tooling", url: "#" },
    { title: "Testing", group: "Tooling", url: "#" }
  ];

  // --- mobile sidebar ---
  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () { document.body.classList.toggle("nav-open"); });
  }
  document.querySelectorAll(".sidebar .nav-link").forEach(function (a) {
    a.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
  });

  // --- on-this-page scroll-spy ---
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var headings = tocLinks
      .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
      .filter(Boolean);
    var current = null;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) current = e.target.id;
      });
      tocLinks.forEach(function (a) { a.classList.remove("active"); });
      if (current && byId[current]) byId[current].classList.add("active");
    }, { rootMargin: "-15% 0px -70% 0px", threshold: 0 });
    headings.forEach(function (h) { spy.observe(h); });
  }

  // --- command palette ---
  var palette = document.querySelector(".palette");
  var trigger = document.querySelector(".search-trigger");
  if (palette && trigger) {
    var input = palette.querySelector(".palette-input");
    var list = palette.querySelector(".palette-list");
    var sel = 0;
    var shown = PAGES.slice();

    function render() {
      var q = input.value.trim().toLowerCase();
      shown = PAGES.filter(function (p) {
        return !q || (p.title + " " + p.group).toLowerCase().indexOf(q) !== -1;
      });
      if (sel >= shown.length) sel = Math.max(0, shown.length - 1);
      if (!shown.length) { list.innerHTML = '<div class="palette-empty">No matches.</div>'; return; }
      list.innerHTML = shown.map(function (p, i) {
        return '<div class="palette-item' + (i === sel ? " active" : "") + '" data-i="' + i + '">' +
          '<span class="pi-title">' + p.title + '</span>' +
          '<span class="pi-group">' + p.group + '</span></div>';
      }).join("");
    }
    function open() {
      palette.classList.add("open");
      input.value = ""; sel = 0; render();
      input.focus();
    }
    function close() { palette.classList.remove("open"); }
    function go(i) { var p = shown[i]; if (p && p.url !== "#") window.location.href = p.url; else close(); }

    trigger.addEventListener("click", open);
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open(); }
      else if (e.key === "Escape" && palette.classList.contains("open")) { close(); }
    });
    input.addEventListener("input", render);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { sel = Math.min(sel + 1, shown.length - 1); render(); e.preventDefault(); }
      else if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); }
      else if (e.key === "Enter") { go(sel); }
    });
    list.addEventListener("click", function (e) {
      var item = e.target.closest(".palette-item");
      if (item) go(parseInt(item.getAttribute("data-i"), 10));
    });
    palette.addEventListener("click", function (e) { if (e.target === palette) close(); });
  }
}());
