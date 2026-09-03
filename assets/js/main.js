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

  // ---- Petite intégration itch.io (widget officiel embarqué) ----
  var itchEmbeds = document.querySelectorAll(".itch-embed[data-game-id]");
  itchEmbeds.forEach(function (card) {
    var gameId = card.getAttribute("data-game-id");
    var title = card.getAttribute("data-game-title") || "Aperçu du jeu sur itch.io";
    var isPerso = document.body.classList.contains("theme-perso");

    // Couleurs alignées sur les tokens du thème actuel (pro = bleu, perso = jaune).
    var linkColor = isPerso ? "d9d64a" : "5566d6";
    var params = "linkback=true&bg_color=faf9f4&fg_color=253449&link_color=" + linkColor + "&border_color=e0ded2";

    var iframe = document.createElement("iframe");
    iframe.src = "https://itch.io/embed/" + gameId + "?" + params;
    iframe.width = "552";
    iframe.height = "167";
    iframe.frameBorder = "0";
    iframe.loading = "lazy";
    iframe.title = title;

    card.innerHTML = "";
    card.appendChild(iframe);
  });

  // ---- Petites cartes GitHub (stats en direct via l'API) ----
  var githubEmbeds = document.querySelectorAll(".github-embed[data-repo]");
  githubEmbeds.forEach(function (card) {
    var repo = card.getAttribute("data-repo");
    var descEl = card.querySelector("[data-github-desc]");
    var statsEl = card.querySelector("[data-github-stats]");
    var starsEl = card.querySelector("[data-github-stars] span");
    var forksEl = card.querySelector("[data-github-forks] span");
    var updatedEl = card.querySelector("[data-github-updated] span");

    fetch("https://api.github.com/repos/" + repo)
      .then(function (res) {
        if (!res.ok) throw new Error("Réponse GitHub invalide");
        return res.json();
      })
      .then(function (data) {
        if (descEl) descEl.textContent = data.description || "Voir le dépôt sur GitHub.";
        if (starsEl) starsEl.textContent = data.stargazers_count;
        if (forksEl) forksEl.textContent = data.forks_count;
        if (updatedEl && data.pushed_at) {
          var updated = new Date(data.pushed_at);
          updatedEl.textContent = updated.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
        }
        if (statsEl) statsEl.hidden = false;
      })
      .catch(function () {
        // Hors ligne, dépôt privé ou limite de l'API GitHub atteinte :
        // on retombe simplement sur un lien silencieux vers le dépôt.
        if (descEl) descEl.textContent = "Voir le dépôt sur GitHub.";
      });
  });

  // ---- Petit clin d'œil automatique sur le lien pro / perso ----
  // Rejoue l'effet de bascule tout seul, sans que le visiteur ait
  // besoin de survoler le lien, pour attirer l'attention dessus.
  var flipLink = document.querySelector(".nav-flip");
  if (flipLink) {
    var flipStopped = false;
    flipLink.addEventListener("mouseenter", function () {
      flipStopped = true;
    }, { once: true });

    var playAutoFlip = function () {
      if (flipStopped) return;
      flipLink.classList.add("nav-flip--auto");
      window.setTimeout(function () {
        flipLink.classList.remove("nav-flip--auto");
      }, 900);
    };

    window.setTimeout(function () {
      playAutoFlip();
      var autoFlipInterval = window.setInterval(function () {
        if (flipStopped) {
          window.clearInterval(autoFlipInterval);
          return;
        }
        playAutoFlip();
      }, 14000);
    }, 2500);
  }

  // ---- Table des matières flottante des articles / projets ----
  var contentEl = document.getElementById("post-content");
  var toc = document.getElementById("post-toc");
  var tocList = document.getElementById("post-toc-list");
  if (!contentEl || !toc || !tocList) return;

  var headings = contentEl.querySelectorAll("h1, h2, h3");
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
    if (heading.tagName === "H2") li.className = "post-toc__list--sub";
    if (heading.tagName === "H3") li.className = "post-toc__list--subsub";
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
