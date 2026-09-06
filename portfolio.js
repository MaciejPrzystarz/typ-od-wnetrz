/* =========================================================================
   TYP OD WNĘTRZ - podstrona portfolio
   Renderuje pełną listę projektów z window.PROJECTS (data/projects.js).
   Osobny plik od app.js: podstrona nie ma hero, kalkulatora ani formularza,
   więc ładuje tylko to, czego naprawdę używa.
   ========================================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------------- Header glass on scroll ---------------- */
  const hdr = $(".hdr");
  if (hdr) {
    const onScroll = () => hdr.classList.toggle("is-stuck", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- Mobile menu ---------------- */
  const burger = $(".burger");
  const mobileMenu = $("#mobileMenu");
  const isMenuOpen = () => document.body.classList.contains("menu-open");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    burger?.setAttribute("aria-expanded", String(open));
    burger?.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    mobileMenu?.setAttribute("aria-hidden", String(!open));
  };
  const closeMenu = () => setMenu(false);
  burger?.addEventListener("click", () => setMenu(!isMenuOpen()));
  $$(".mobile a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());
  const wide = window.matchMedia("(min-width: 1081px)");
  const onWide = () => { if (wide.matches && isMenuOpen()) closeMenu(); };
  wide.addEventListener ? wide.addEventListener("change", onWide) : wide.addListener(onWide);

  /* ---------------- Reveal on scroll ---------------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" })
    : null;

  const observeReveals = () => $$("[data-reveal]:not(.is-in)").forEach((el) => {
    if (io) io.observe(el); else el.classList.add("is-in");
  });
  // Siatka bezpieczeństwa - tak jak na stronie głównej: treść nigdy nie może
  // zostać niewidoczna, jeśli IntersectionObserver nie zadziała.
  const revealInView = () => $$("[data-reveal]:not(.is-in)").forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add("is-in");
  });
  window.addEventListener("load", () => { revealInView(); setTimeout(revealInView, 400); });
  setTimeout(revealInView, 2500);
  let rTick = false;
  window.addEventListener("scroll", () => {
    if (rTick) return; rTick = true;
    requestAnimationFrame(() => { revealInView(); rTick = false; });
  }, { passive: true });

  /* =======================================================================
     LISTA PROJEKTÓW
     ===================================================================== */
  const projects = window.PROJECTS || [];
  const cats = window.PROJECT_CATEGORIES || ["Wszystkie"];
  const list = $("#pfpList");
  const empty = $("#pfpEmpty");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  // Beżowe warianty placeholdera - jaśniejsze niż na stronie głównej, żeby
  // pusta galeria trzymała się palety podstrony, a nie robiła ciemnych plam.
  const phVariants = ["ph ph--sand", "ph ph--sand v2", "ph ph--sand v3"];

  /**
   * Kadry projektu: tyle sztuk, ile podaje `shots` (albo ile jest zdjęć).
   * Zdjęcie ze `photos[i]` ląduje w <image-slot src>; pusta pozycja zostaje
   * placeholderem do wgrania. Id kadru jest stałe (`slot-1`, `slot-2`, ...),
   * więc wgrane obrazy przeżywają kolejne wejścia na stronę.
   */
  function shotsOf(p) {
    const photos = Array.isArray(p.photos) ? p.photos : [];
    const n = Math.max(photos.length, Number(p.shots) || 0, 1);
    return Array.from({ length: n }, (_, i) => {
      // `photos` przyjmuje obiekt {src, orient} albo samą ścieżkę. `orient`
      // dotyczy tylko kafla na stronie głównej - tu proporcje i tak czytamy
      // z pliku, żeby galeria nie kadrowała zdjęć wbrew ich kształtowi.
      const ph = photos[i];
      return {
        id: `${p.slot}-${i + 1}`,
        src: typeof ph === "string" ? ph : (ph && ph.src) || "",
        n: i + 1,
      };
    });
  }

  function galleryHTML(p) {
    return shotsOf(p).map((s, i) => {
      const alt = `${p.title} – kadr ${s.n}`;
      return `
        <figure class="pfp__shot"${s.src ? ` data-src="${esc(s.src)}"` : ""}>
          <image-slot id="${esc(s.id)}" class="${phVariants[i % 3]}" shape="rect" fit="cover"
                      ${s.src ? `src="${esc(s.src)}"` : ""}
                      role="img" aria-label="${esc(alt)}"
                      placeholder="Wgraj zdjęcie – ${esc(p.title)} (${s.n})"></image-slot>
        </figure>`;
    }).join("");
  }

  /**
   * Kadr dostaje kształt swojego zdjęcia, a nie odwrotnie.
   * Proporcje czytamy z pliku, więc dorzucenie nowego zdjęcia do `photos`
   * nie wymaga dopisywania niczego w danych.
   *
   * Układ rzędu wynika z orientacji:
   *   full - zdjęcie poziome, przez całą szerokość (16:9),
   *   half - dwa pionowe obok siebie (4:5),
   *   solo - pionowe, któremu zabrakło pary: zamiast wisieć w połowie rzędu
   *          z pustką obok (wyglądało jak brakujący kadr), staje na środku
   *          w węższej kolumnie.
   */
  function layoutGallery(gallery) {
    const figs = $$(".pfp__shot", gallery);
    for (let i = 0; i < figs.length; ) {
      const a = figs[i], b = figs[i + 1];
      if (a.dataset.orient === "tall") {
        if (b && b.dataset.orient === "tall") {
          a.dataset.span = b.dataset.span = "half";
          i += 2;
        } else {
          a.dataset.span = "solo";
          i += 1;
        }
      } else {
        a.dataset.span = "full";
        i += 1;
      }
    }
  }

  function applyShotOrientation(root) {
    $$(".pfp__gallery", root).forEach((gallery) => {
      const figs = $$(".pfp__shot[data-src]", gallery);
      if (!figs.length) return;
      let pending = figs.length;
      const done = () => { if (--pending === 0) layoutGallery(gallery); };
      figs.forEach((fig) => {
        const probe = new Image();
        // Nawet jeśli zdjęcie się nie wczyta, układ musi się domknąć -
        // inaczej cała galeria zostałaby w stanie przejściowym 4:3.
        probe.onerror = done;
        probe.onload = () => {
          fig.dataset.orient = probe.naturalWidth >= probe.naturalHeight ? "wide" : "tall";
          done();
        };
        probe.src = fig.dataset.src;
      });
    });
  }

  function projectHTML(p, i) {
    // Lokalizacja i rok bywają puste (patrz data/projects.js). Pusty wiersz
    // z samą etykietą i kreską wygląda jak błąd, więc go po prostu nie ma.
    const facts = [
      ["Kategoria", p.category],
      ["Lokalizacja", p.location],
      ["Rok", p.year],
    ].filter(([, v]) => v);

    return `
      <article class="pfp" id="${esc(p.slug)}" data-cat="${esc(p.category)}">
        <header class="pfp__head" data-reveal>
          <div class="pfp__title">
            <span class="pfp__idx">${pad(i + 1)}</span>
            <h2 class="display">${esc(p.title)}</h2>
            ${p.excerpt ? `<p class="pfp__excerpt">${esc(p.excerpt)}</p>` : ""}
          </div>
          <dl class="pfp__facts">
            ${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
          </dl>
        </header>
        <div class="pfp__gallery" data-reveal>${galleryHTML(p)}</div>
      </article>`;
  }

  if (list) {
    list.innerHTML = projects.map(projectHTML).join("");
    applyShotOrientation(list);
  }

  /* ---------------- Filtr kategorii ----------------
     Filtrujemy przez ukrywanie, a nie przez ponowne renderowanie: <image-slot>
     trzyma wgrane zdjęcie w sobie, więc przebudowa listy gasiłaby galerię. */
  const chipWrap = $("#pfFilter");
  if (chipWrap) {
    chipWrap.innerHTML = cats
      .map((c, i) => `<button class="chip ${i === 0 ? "is-on" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`)
      .join("");

    const applyFilter = (cat) => {
      let shown = 0;
      $$(".pfp", list).forEach((el) => {
        const on = !cat || cat === "Wszystkie" || el.dataset.cat === cat;
        el.hidden = !on;
        // .is-first zdejmuje górną kreskę i wcięcie z pierwszego WIDOCZNEGO
        // projektu - po filtrowaniu :first-child wskazywałby ukryty kafel.
        el.classList.toggle("is-first", on && shown === 0);
        if (on) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    };

    chipWrap.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      $$(".chip", chipWrap).forEach((c) => c.classList.remove("is-on"));
      b.classList.add("is-on");
      applyFilter(b.dataset.cat);
      observeReveals();
      revealInView();
    });

    applyFilter("Wszystkie");
  }

  /* ---------------- Liczby w nagłówku ----------------
     Polska odmiana przez przypadki: 1 projekt / 2-4 projekty / 5+ projektów.
     Bez tego przy siódmym projekcie w danych zrobiłby się "7 projekty". */
  const plural = (n, one, few, many) => {
    const d10 = n % 10, d100 = n % 100;
    if (n === 1) return one;
    if (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) return few;
    return many;
  };

  const stats = $("#pgStats");
  if (stats && projects.length) {
    const years = projects.map((p) => String(p.year)).filter(Boolean).sort();
    const span = years.length > 1 && years[years.length - 1] !== years[0]
      ? `${years[0]}–${years[years.length - 1]}`
      : years[0] || "";
    const kinds = new Set(projects.map((p) => p.category)).size;
    const shots = projects.reduce((n, p) => n + ((p.photos && p.photos.length) || 0), 0);

    const tiles = [
      [projects.length, plural(projects.length, "projekt w portfolio", "projekty w portfolio", "projektów w portfolio")],
      [kinds, plural(kinds, "kategoria wnętrz", "kategorie wnętrz", "kategorii wnętrz")],
    ];
    // Lata pokazujemy tylko, jeśli w danych faktycznie są (patrz TODO
    // w data/projects.js). Bez tego kafel wyświetlał pustą wartość z podpisem.
    if (span) tiles.push([span, span.includes("–") ? "lata realizacji" : "rok realizacji"]);
    else if (shots) tiles.push([shots, plural(shots, "zdjęcie w galerii", "zdjęcia w galerii", "zdjęć w galerii")]);

    stats.innerHTML = tiles.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join("");
  }

  /* ---------------- Wejście z linku #slug ----------------
     Projekty są renderowane po wczytaniu skryptu, więc natywny skok do
     kotwicy z adresu już się nie uda - dojeżdżamy tu ręcznie. Dojazd
     powtarzamy po `load` i chwilę później, bo fonty i <image-slot> ustalają
     ostateczne wysokości dopiero po pierwszym renderze - ale tylko dopóki
     użytkownik sam nie ruszy stroną, żeby mu jej nie wyrywać spod palca. */
  const hash = decodeURIComponent(window.location.hash || "").slice(1);
  const target = hash ? document.getElementById(hash) : null;
  if (target) {
    let userMoved = false;
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) =>
      window.addEventListener(ev, () => { userMoved = true; }, { once: true, passive: true })
    );
    const goToTarget = () => {
      if (userMoved) return;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: "auto" });
    };
    target.classList.add("is-linked");
    requestAnimationFrame(goToTarget);
    window.addEventListener("load", () => { goToTarget(); setTimeout(goToTarget, 250); });
  }

  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  observeReveals();
  revealInView();
})();
