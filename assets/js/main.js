document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("nav-toggle");
  var links = document.querySelector(".site-nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // ---- Filtre de la page /projets/ par catégorie ----
  var tabs = document.querySelectorAll(".filter-tabs__button");
  var cards = document.querySelectorAll("#projects-grid .project-card");
  var empty = document.getElementById("projects-empty");

  if (tabs.length && cards.length) {
    var applyFilter = function (filter) {
      var visibleCount = 0;
      cards.forEach(function (card) {
        var match = filter === "all" || card.getAttribute("data-category") === filter;
        card.style.display = match ? "" : "none";
        if (match) visibleCount++;
      });
      if (empty) empty.hidden = visibleCount !== 0;

      tabs.forEach(function (tab) {
        var isActive = tab.getAttribute("data-filter") === filter;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    };

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var filter = tab.getAttribute("data-filter");
        applyFilter(filter);
        history.replaceState(null, "", filter === "all" ? location.pathname : "#" + filter);
      });
    });

    // Permet à un lien externe (ex: bouton "JDR" ailleurs sur le site)
    // de pointer directement vers /projets/#jdr et d'ouvrir ce filtre.
    var initialFilter = location.hash ? location.hash.slice(1) : "all";
    var hasMatchingTab = Array.prototype.some.call(tabs, function (t) {
      return t.getAttribute("data-filter") === initialFilter;
    });
    applyFilter(hasMatchingTab ? initialFilter : "all");
  }

  // ---- Table des matières flottante des articles / projets ----
  var contentEl = document.getElementById("post-content");
  var toc = document.getElementById("post-toc");
  var tocList = document.getElementById("post-toc-list");
  if (!contentEl || !toc || !tocList) return;

  var headings = contentEl.querySelectorAll("h2, h3");
  if (headings.length < 2) return; // pas la peine d'afficher un sommaire pour 0 ou 1 titre

  var usedIds = {};
  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // enlève les accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  var links = [];
  headings.forEach(function (heading) {
    if (!heading.id) {
      var base = slugify(heading.textContent) || "section";
      var id = base;
      var i = 2;
      while (usedIds[id]) { id = base + "-" + i; i++; }
      usedIds[id] = true;
      heading.id = id;
    } else {
      usedIds[heading.id] = true;
    }

    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + heading.id;
    a.textContent = heading.textContent;
    if (heading.tagName === "H3") li.className = "post-toc__list--sub";
    li.appendChild(a);
    tocList.appendChild(li);
    links.push({ id: heading.id, link: a });
  });

  toc.hidden = false;

  // Surbrillance du lien correspondant à la position de lecture actuelle
  var ticking = false;
  function updateActiveLink() {
    var referenceLine = 130; // px depuis le haut de la fenêtre
    var current = headings[0];
    headings.forEach(function (heading) {
      if (heading.getBoundingClientRect().top <= referenceLine) current = heading;
    });
    links.forEach(function (l) {
      l.link.classList.toggle("is-active", l.id === current.id);
    });
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(updateActiveLink);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateActiveLink);

  updateActiveLink();
});
