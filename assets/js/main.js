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
  if (!tabs.length || !cards.length) return;

  function applyFilter(filter) {
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
  }

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
});
