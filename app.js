/* =========================================================================
   TYP OD WNĘTRZ - interactions
   ========================================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const PLN = (n) => Math.round(n).toLocaleString("pl-PL");

  /* ---------------- Header glass on scroll ---------------- */
  const hdr = $(".hdr");
  const onScroll = () => hdr.classList.toggle("is-stuck", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- Mobile menu ---------------- */
  const burger = $(".burger");
  const mobileMenu = $("#mobileMenu");
  const isMenuOpen = () => document.body.classList.contains("menu-open");
  // Jeden punkt prawdy o stanie menu: klasa na <body> (blokuje przewijanie tła
  // i animuje overlay) plus stan dla czytników ekranu na burgerze i overlayu.
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    mobileMenu?.setAttribute("aria-hidden", String(!open));
  };
  const closeMenu = () => setMenu(false);
  burger.addEventListener("click", () => setMenu(!isMenuOpen()));
  $$(".mobile a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());
  // Powrót na desktop z otwartym menu zostawiłby <body> z overflow:hidden -
  // czyli stronę, której nie da się przewinąć. Zamykamy je przy zmianie progu.
  const wide = window.matchMedia("(min-width: 1081px)");
  const onWide = () => { if (wide.matches && isMenuOpen()) closeMenu(); };
  wide.addEventListener ? wide.addEventListener("change", onWide) : wide.addListener(onWide);

  /* ---------------- Hero entrance ---------------- */
  requestAnimationFrame(() => $(".hero")?.classList.add("is-in"));

  /* ---------------- Reveal on scroll ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  const observeReveals = () => $$("[data-reveal]:not(.is-in)").forEach((el) => {
    $$(":scope > *", el).forEach((c, i) => c.style.setProperty("--si", i));
    io.observe(el);
  });

  // Safety net: if IntersectionObserver is unsupported or never fires, never
  // leave primary content hidden. Reveal anything already in/near the viewport,
  // and force-reveal everything as a last resort shortly after load.
  const revealInView = () => $$("[data-reveal]:not(.is-in)").forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add("is-in");
  });
  if (!("IntersectionObserver" in window)) {
    $$("[data-reveal]").forEach((el) => el.classList.add("is-in"));
  } else {
    window.addEventListener("load", () => { revealInView(); setTimeout(revealInView, 400); });
    setTimeout(revealInView, 2500);
    // Scroll fallback: if IO ever fails to fire in this environment, scrolling
    // still reveals sections as they enter the viewport.
    let rTick = false;
    window.addEventListener("scroll", () => {
      if (rTick) return; rTick = true;
      requestAnimationFrame(() => { revealInView(); rTick = false; });
    }, { passive: true });
  }

  /* ---------------- Parallax (hero media + portfolio) ---------------- */
  // Na telefonie paralaksa jest wyłączona: pionowy kadr i tak wypełnia ekran
  // (CSS ustawia tam height:100% zamiast 116%), a przesuwanie wideo przy
  // chowającym się pasku adresu kosztuje tylko płynność przewijania.
  const noParallax = window.matchMedia("(max-width: 820px), (pointer: coarse)");
  let ticking = false;
  const parallax = () => {
    ticking = false;
    const m = $(".hero__media .hero__video, .hero__media image-slot, .hero__media .ph");
    if (!m) return;
    if (noParallax.matches) { m.style.transform = ""; return; }
    const y = window.scrollY;
    if (y < window.innerHeight) m.style.transform = `translateY(${y * 0.18}px) scale(1.02)`;
  };
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(parallax); ticking = true; } }, { passive: true });

  /* ---------------- Hero video loop ---------------- */
  const heroVideo = $(".hero__video");
  if (heroVideo) {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Autoplay can still be blocked (iOS low-power, data saver) - retry on first interaction.
    const play = () => { if (!rm.matches) heroVideo.play().catch(() => {}); };
    play();
    ["pointerdown", "touchstart", "keydown"].forEach((ev) =>
      window.addEventListener(ev, play, { once: true, passive: true })
    );
    // Don't burn CPU while the hero is off-screen.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? play() : heroVideo.pause()));
      }, { threshold: 0.01 }).observe(heroVideo);
    }
    // Respect reduced-motion: freeze on the first frame instead of looping.
    const applyRM = () => { if (rm.matches) { heroVideo.pause(); heroVideo.removeAttribute("loop"); } else { heroVideo.setAttribute("loop", ""); play(); } };
    applyRM();
    rm.addEventListener?.("change", applyRM);
  }

  /* ---------------- Smooth scroll for in-page anchors ---------------- */
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const t = $(id);
    if (!t) return;
    e.preventDefault();
    closeMenu();
    const top = t.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: "smooth" });
  }));

  /* =======================================================================
     PORTFOLIO
     ===================================================================== */
  const pfGrid = $("#pfGrid");
  const cats = window.PROJECT_CATEGORIES || ["Wszystkie"];
  const projects = window.PROJECTS || [];

  // Lokalizacja i rok bywają puste (patrz data/projects.js) - sklejamy tylko to,
  // co faktycznie jest, żeby nie zostało wiszące "·" ani pusty wiersz.
  const metaOf = (p) => [p.location, p.year].filter(Boolean).join(" · ");
  // `photos` przyjmuje obiekt {src, orient} albo samą ścieżkę.
  const srcOf = (ph) => (typeof ph === "string" ? ph : (ph && ph.src) || "");

  /**
   * Kafel = pojedyncze ZDJĘCIE, nie projekt. Sekcja pokazuje cały materiał
   * (2 kuchnie, 2 łazienki, 2 sypialnie, 4 salony), a nie po jednej okładce
   * na projekt. Każdy kafel prowadzi do galerii SWOJEJ KATEGORII na
   * podstronie portfolio (catSlug) - pełne portfolio jest ułożone rodzajami
   * wnętrz, bo zdjęć są setki i pojedynczy projekt nie jest tam jednostką.
   *
   * Kolejność: przeplatamy pionowe z poziomymi. Siatka ma 12 kolumn, kafel
   * pionowy zajmuje 4, poziomy 8 - rząd domyka się więc tylko jako
   * pionowy+poziomy albo 3x pionowy. Bez przeplotu (czyli w kolejności
   * projektów) po każdym niedopasowanym rzędzie zostawała dziura.
   */
  function tilesOf(list) {
    const flat = [];
    list.forEach((p) => (p.photos || []).forEach((ph) => {
      const src = srcOf(ph);
      if (!src) return;
      flat.push({
        src,
        orient: (typeof ph === "object" && ph.orient) || "tall",
        project: p,
      });
    }));
    const tall = flat.filter((t) => t.orient !== "wide");
    const wide = flat.filter((t) => t.orient === "wide");
    const out = [];
    while (tall.length || wide.length) {
      if (tall.length) out.push(tall.shift());
      if (wide.length) out.push(wide.shift());
    }
    return out;
  }

  /**
   * Widok kategorii: 8 zdjęć (dwa rzędy po cztery) z galerii tej kategorii,
   * czyli prosto z images/portfolio-web/. „Wszystkie" zostaje bez zmian -
   * po jednym kadrze na kategorię z images/home-images/.
   *
   * Zdjęcia bierzemy z window.GALLERY (plik generowany, data/gallery.js),
   * a nie z window.PROJECTS: to jedyne miejsce, które wie, co naprawdę leży
   * w folderze i jakie ma wymiary. Kolejność w galerii nie jest alfabetyczna -
   * najpierw idą okładki, po jednej na wnętrze, więc te osiem kafli to osiem
   * różnych realizacji, a nie osiem ujęć tej samej kuchni.
   */
  const CAT_TILES = 8;

  function galleryOf(cat) {
    const secs = window.GALLERY || [];
    const p = projects.find((x) => x.category === cat);
    return secs.find((s) => s.cat === cat)
        || (p && secs.find((s) => s.slug === p.catSlug))
        || null;
  }

  function categoryTiles(cat) {
    const sec = galleryOf(cat);
    const photos = sec ? (sec.photos || []).slice(0, CAT_TILES) : [];
    if (!photos.length) return "";
    return photos.map((ph, i) => {
      const alt = `${sec.alt} – kadr ${i + 1}`;
      return `
      <a class="pf__item sq" href="portfolio.html#${sec.slug}" data-reveal aria-label="${alt} – przejdź do galerii">
        <img class="pf__img" src="${sec.dir}/${ph.f}" width="${ph.w}" height="${ph.h}" loading="lazy" decoding="async" alt="${alt}" />
        <div class="pf__shade"></div>
        <div class="pf__meta">
          <div><h3>${sec.cat}</h3></div>
          <span class="pf__arrow" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" stroke-width="1.3"/></svg>
          </span>
        </div>
      </a>`;
    }).join("");
  }

  function renderPortfolio(filter) {
    const isCat = !!filter && filter !== "Wszystkie";
    // Kategoria: osiem kadrów z galerii. Gdyby data/gallery.js nie doszedł
    // (albo kategorii w nim nie było), zostaje stary widok po jednym kaflu.
    const catHtml = isCat ? categoryTiles(filter) : "";
    if (catHtml) {
      pfGrid.classList.remove("is-sparse");
      pfGrid.classList.add("is-cat");
      pfGrid.innerHTML = catHtml;
      observeReveals();
      return;
    }
    pfGrid.classList.remove("is-cat");
    const list = isCat ? projects.filter((p) => p.category === filter) : projects;
    const tiles = tilesOf(list);
    // Rząd siatki mieszczą dopiero trzy kafle pionowe. Po filtrze kategorii
    // zostaje zwykle jeden i dwie trzecie rzędu stały puste - wyglądało to na
    // brakującą treść. Przy mniej niż trzech kaflach siatka przechodzi na
    // wyśrodkowany rząd (patrz .pf__grid.is-sparse w styles.css).
    pfGrid.classList.toggle("is-sparse", tiles.length < 3);
    pfGrid.innerHTML = tiles.map((t, i) => {
      const p = t.project;
      const meta = metaOf(p);
      return `
      <a class="pf__item ${t.orient}" href="portfolio.html#${p.catSlug || p.slug}" data-reveal aria-label="${p.title}">
        <img class="pf__img" src="${t.src}" width="1600" height="2000" loading="lazy" decoding="async" alt="${p.title} – ${p.category}" />
        <div class="pf__shade"></div>
        <span class="pf__cat">${p.category}</span>
        <div class="pf__meta">
          <div>
            <h3>${p.title}</h3>
            ${meta ? `<p>${meta}</p>` : ""}
          </div>
          <span class="pf__arrow" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" stroke-width="1.3"/></svg>
          </span>
        </div>
      </a>`;
    }).join("");
    observeReveals();
  }

  // filter chips
  const chipWrap = $("#pfFilter");
  chipWrap.innerHTML = cats.map((c, i) => `<button class="chip ${i === 0 ? "is-on" : ""}" data-cat="${c}">${c}</button>`).join("");
  chipWrap.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    $$(".chip", chipWrap).forEach((c) => c.classList.remove("is-on"));
    b.classList.add("is-on");
    renderPortfolio(b.dataset.cat);
  });
  renderPortfolio("Wszystkie");

  /* =======================================================================
     OFERTA - 8 typów
     ===================================================================== */
  const offer = window.OFFER_TYPES || [];
  const offerGrid = $("#offerGrid");
  if (offerGrid) {
    offerGrid.innerHTML = offer.map((t) => `
      <div class="tcard ${t.featured ? "is-featured" : ""}" data-reveal>
        ${t.featured ? '<span class="badge">Najczęściej wybierany</span>' : ""}
        <div class="tcard__top">
          <div class="tcard__n"><small>Typ</small>${t.n}</div>
        </div>
        <h3>${t.name}</h3>
        <p>${t.scope}</p>
        <div class="tcard__price"><b>${t.price}</b><span>zł / m²</span></div>
      </div>`).join("");
  }

  /* Odnośnik do przykładowych plików - tuż pod kaflami typów, bo pokazuje
     ich składowe. Renderowany tylko przy niepustym window.SAMPLES, żeby
     nigdy nie prowadził do pustej podstrony. */
  const offerSamples = $("#offerSamples");
  if (offerSamples && (window.SAMPLES || []).length) {
    offerSamples.innerHTML = `<a class="btn btn--solid" href="przykladowy-projekt.html">Zobacz przykładowe składowe projektu <span class="arr">→</span></a>`;
  }

  /* ---------------- Moodboard ----------------
     Notka w rzędzie pod tabelą typów, ale z cenami: dwa warianty, ryczałt
     za całość (jak Szkic Projektu), więc jednostka to „zł", nie „zł / m²". */
  const moodboardBox = $("#moodboard");
  const moodboard = window.MOODBOARD;
  if (moodboardBox && moodboard) {
    moodboardBox.innerHTML = `
      <h4>${moodboard.title}</h4>
      <p>${moodboard.desc}</p>
      <ul class="note__prices">
        ${(moodboard.packages || []).map((p) => `
          <li><span>${p.name}</span><b>${PLN(p.price)} zł</b></li>`).join("")}
      </ul>`;
  }

  /* ---------------- Szkic Projektu ----------------
     Osobna usługa obok ośmiu typów. Ceny są ryczałtowe (zł za całość),
     dlatego jednostka to samo „zł", a nie „zł / m²" jak w kaflach typów. */
  const sketchBox = $("#sketch");
  const sketch = window.SKETCH;
  if (sketchBox && sketch) {
    sketchBox.innerHTML = `
      <h4 class="sketch__title">${sketch.title}</h4>
      <div class="sketch__pkgs">
        ${(sketch.packages || []).map((p) => `
          <div class="sketch__pkg">
            <h5>${p.name}</h5>
            <p>${p.scope}</p>
            <div class="sketch__price"><b>${PLN(p.price)}</b><span>zł</span></div>
          </div>`).join("")}
      </div>
      ${sketch.note ? `<p class="sketch__note">${sketch.note}</p>` : ""}`;
  }

  /* =======================================================================
     KALKULATOR
     ===================================================================== */
  const P = window.PRICING;
  const state = { area: 60, type: 8, rush: false };

  const areaInput = $("#area");
  const areaRange = $("#areaRange");
  const typesWrap = $("#types");
  const typeName = $("#typeName");
  const rushToggle = $("#rushToggle");
  const outMain = $("#outMain");
  const outSmall = $("#outSmall");

  // build type selector
  typesWrap.innerHTML = offer.map((t) => `
    <button data-type="${t.n}" class="${t.n === state.type ? "is-on" : ""}">
      <span class="tn">${t.n}</span><span class="tp">${t.price} zł/m²</span>
    </button>`).join("");

  function activeType() { return offer.find((t) => t.n === state.type); }

  function compute() {
    const a = state.area;
    const per = P.perType[state.type];
    const base = a * per;
    const disc = P.discounts.find((d) => a >= d.min);
    const afterDisc = disc ? base * (1 - disc.rate) : base;
    const rushAdd = state.rush ? afterDisc * P.rushSurcharge : 0;
    const total = afterDisc + rushAdd;
    return { a, per, base, disc, afterDisc, rushAdd, total };
  }

  function render() {
    typeName.innerHTML = `Typ ${state.type} – <b>${activeType().name}</b>`;
    if (state.area < P.minArea) {
      outMain.classList.add("is-hidden");
      outSmall.classList.remove("is-hidden");
      return;
    }
    outMain.classList.remove("is-hidden");
    outSmall.classList.add("is-hidden");
    const c = compute();
    let rows = `
      <div class="r"><span>${c.a} m² × ${c.per} zł/m²</span><span>${PLN(c.base)} zł</span></div>`;
    if (c.disc) rows += `<div class="r discount"><span>Rabat (${c.disc.label})</span><span>−${Math.round(c.disc.rate * 100)}%</span></div>`;
    if (state.rush) rows += `<div class="r"><span>Tryb przyspieszony</span><span>+${Math.round(P.rushSurcharge * 100)}%</span></div>`;
    $("#outRows").innerHTML = rows;
    $("#outVal").textContent = PLN(c.total);
  }

  // events
  function setArea(v) {
    v = Math.max(0, Math.min(400, Math.round(v || 0)));
    state.area = v;
    if (areaInput.value != v) areaInput.value = v;
    areaRange.value = v;
    render();
  }
  areaInput.addEventListener("input", (e) => setArea(+e.target.value));
  areaRange.addEventListener("input", (e) => setArea(+e.target.value));
  typesWrap.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-type]");
    if (!b) return;
    state.type = +b.dataset.type;
    $$("button", typesWrap).forEach((x) => x.classList.remove("is-on"));
    b.classList.add("is-on");
    render();
  });
  // etykieta dopłaty zawsze zgodna z PRICING (bez zaszytego procentu w HTML)
  const rushPct = $("#rushPct");
  if (rushPct) rushPct.textContent = Math.round(P.rushSurcharge * 100);

  // Próg najniższego rabatu w notce pod tabelą typów - też z PRICING, żeby
  // liczba w treści nie rozjechała się z tym, co liczy kalkulator.
  const discFrom = $("#discFrom");
  if (discFrom && P.discounts && P.discounts.length) {
    discFrom.textContent = Math.min(...P.discounts.map((d) => d.min));
  }

  rushToggle.addEventListener("click", () => {
    state.rush = !state.rush;
    rushToggle.classList.toggle("is-on", state.rush);
    rushToggle.setAttribute("aria-pressed", String(state.rush));
    render();
  });

  setArea(60);
  render();

  // „Wyślij zapytanie z tą wyceną" - dowozi do formularza. Drugi handler na tym
  // samym przycisku (w bloku KONTAKT) zaznacza checkbox i przepisuje metraż
  // oraz typ z kalkulatora, żeby wycena poszła w treści zgłoszenia.
  $("#outCta")?.addEventListener("click", () => {
    const t = $("#kontakt");
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
  });

  /* =======================================================================
     PROCES
     ===================================================================== */
  const procGrid = $("#procGrid");
  if (procGrid && window.PROCESS_STEPS) {
    procGrid.innerHTML = window.PROCESS_STEPS.map((s) => `
      <div class="proc__step"><span class="pn">${s.n}</span><div><h3>${s.title}</h3><p>${s.desc}</p></div></div>`).join("");
  }

  /* =======================================================================
     CZAS REALIZACJI
     ===================================================================== */
  const tl = $("#timeline");
  if (tl && window.TIMELINE) {
    tl.innerHTML = window.TIMELINE.map((t, i) => `
      <div class="timeline__row"><span class="idx">0${i + 1}</span><span class="lbl">${t.label}</span><span class="time">${t.time}</span></div>`).join("");
  }

  /* =======================================================================
     OPINIE - slider
     ===================================================================== */
  const revTrack = $("#revTrack");
  const reviews = window.REVIEWS || [];
  if (revTrack && reviews.length) {
    // Wiadomość składa się z frazy wiodącej (`lead` - pierwsze zdanie klienta,
    // Cormorantem) i reszty tekstu (`quote`: string albo tablica akapitów).
    // Razem czytają się jako całość maila, tak jak przyszedł.
    revTrack.innerHTML = reviews.map((r) => {
      const paras = (Array.isArray(r.quote) ? r.quote : [r.quote]).filter(Boolean);
      const lead = r.lead ? `<p class="rev__lead">${r.lead}</p>` : "";
      const body = paras.length ? `<div class="rev__body">${paras.map((p) => `<p>${p}</p>`).join("")}</div>` : "";
      return `
      <article class="rev__slide">
        <blockquote class="rev__msg">${lead}${body}</blockquote>
        <footer class="rev__who"><span class="nm">${r.name}</span><span class="mt">${r.meta}</span></footer>
      </article>`;
    }).join("");

    // Spis nadawców = nawigacja. Bez numerów: to nie jest sekwencja ani ranking,
    // tylko lista osób. Kolejność w spisie to kolejność slajdów.
    //
    // Wszystkie opinie są dziś podpisane imieniem. Gdyby wróciła wiadomość bez
    // podpisu („Klienci" / „Klientka" w `name`), w spisie etykietą jest zakres
    // projektu - kilka identycznych wierszy nie odróżniałoby niczego od niczego.
    // Pod samą wiadomością podpis zostaje pełny.
    const revIndex = $("#revIndex");
    if (revIndex) {
      revIndex.innerHTML = reviews.map((r, i) => {
        const anon = /^Klien/.test(r.name);
        return `
        <li><button type="button" class="rev__pick" data-i="${i}" aria-label="Opinia: ${r.name}, ${r.meta}"><span class="nm">${anon ? r.meta : r.name}</span><span class="mt">${anon ? "" : r.meta}</span></button></li>`;
      }).join("");
      revIndex.addEventListener("click", (e) => {
        const b = e.target.closest(".rev__pick");
        if (b) go(Number(b.dataset.i));
      });
    }
    const picks = revIndex ? $$(".rev__pick", revIndex) : [];

    let ri = 0;
    const total = reviews.length;
    const revView = $("#revView");
    // Slajdy stoją obok siebie we flexie, więc bez tego wszystkie miałyby
    // wysokość najdłuższej opinii, a pod krótkimi zostawałaby dziura.
    // Okno dostaje wysokość aktywnego slajdu (transition dopiero po
    // pierwszym pomiarze - patrz `.rev__view.is-measured`).
    const fit = () => {
      if (!revView) return;
      const slide = revTrack.children[ri];
      // getBoundingClientRect, nie offsetHeight: ten drugi zaokrągla w dół i
      // przy ułamkowych wysokościach ucinał ostatni wiersz o piksel-dwa.
      if (slide) revView.style.height = `${Math.ceil(slide.getBoundingClientRect().height)}px`;
    };
    const go = (n) => {
      ri = (n + total) % total;
      revTrack.style.transform = `translateX(-${ri * 100}%)`;
      picks.forEach((b, i) => {
        b.classList.toggle("is-on", i === ri);
        // aria-current, nie aria-selected: to zwykłe przyciski w liście,
        // a nie zakładki z rolą tab.
        if (i === ri) b.setAttribute("aria-current", "true");
        else b.removeAttribute("aria-current");
      });
      fit();
    };
    // Wysokość slajdu zmienia to samo, co zmienia łamanie tekstu: szerokość
    // okna, dojeżdżający Cormorant, zoom przeglądarki. ResizeObserver łapie
    // wszystkie te przypadki naraz - i tylko wtedy, gdy naprawdę coś urosło.
    // Pętli nie ma: obserwujemy slajdy, a `fit` zmienia wysokość okna.
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(fit);
      Array.from(revTrack.children).forEach((c) => ro.observe(c));
    } else {
      window.addEventListener("resize", fit);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    }
    $("#revPrev").addEventListener("click", () => go(ri - 1));
    $("#revNext").addEventListener("click", () => go(ri + 1));

    // Przesuwanie palcem - na telefonie nikt nie celuje w strzałki.
    // Gest liczy się dopiero od 48 px i tylko jeśli jest wyraźnie poziomy,
    // żeby zwykłe przewijanie strony w pionie nie przeskakiwało opinii.
    let tx = 0, ty = 0;
    revTrack.addEventListener("touchstart", (e) => {
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
    }, { passive: true });
    revTrack.addEventListener("touchend", (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - tx;
      const dy = t.clientY - ty;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? ri + 1 : ri - 1);
    }, { passive: true });

    go(0);
  }

  /* =======================================================================
     CASE STUDIES
     ===================================================================== */
  const csList = $("#csList");
  if (csList && window.CASE_STUDIES) {
    const ARW = (d) => `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.4"/></svg>`;

    /* Karuzela „przed / po": wszystkie kadry leżą na sobie w .csx__stage,
       widoczny jest ten z .is-on. Przenikanie w miejscu (a nie przesuwanie
       taśmy) jest tu celem, nie ozdobą: zdjęcie sprzed remontu i render są
       robione z tego samego punktu, więc jedno zmienia się w drugie. */
    const shotsHtml = (c) => `
      <div class="csx" role="group" aria-roledescription="karuzela" aria-label="Przed i po – ${c.title}">
        <div class="csx__stage">
          ${c.shots.map((s, i) => `
            <figure class="csx__slide${i ? "" : " is-on"}" aria-hidden="${i !== 0}">
              <img src="${s.src}" loading="lazy" decoding="async" alt="${s.alt || c.title}" />
              <figcaption class="csx__badge">${s.label}</figcaption>
            </figure>`).join("")}
        </div>
        <button class="csx__arw csx__arw--p" type="button" aria-label="Poprzedni kadr">${ARW("M12 4l-6 6 6 6")}</button>
        <button class="csx__arw csx__arw--n" type="button" aria-label="Następny kadr">${ARW("M8 4l6 6-6 6")}</button>
        <div class="csx__dots">
          ${c.shots.map((s, i) => `<button class="csx__dot${i ? "" : " is-on"}" type="button" aria-label="${s.label}, kadr ${i + 1} z ${c.shots.length}"></button>`).join("")}
        </div>
      </div>`;

    // Opinia klientki mieszka w window.REVIEWS - tu tylko po nią sięgamy po
    // imieniu (`reviewFrom`), żeby ten sam cytat nie istniał w dwóch miejscach.
    const reviewOf = (c) => (window.REVIEWS || []).find((r) => r.name === c.reviewFrom);
    const quoteHtml = (r) => `
      <figure class="cs__block cs__quote">
        <span class="k">Opinia</span>
        <div class="cs__qbody">
          <blockquote>
            <p class="cs__qlead">${r.lead}</p>
            ${(r.quote || []).map((p) => `<p>${p}</p>`).join("")}
          </blockquote>
          <figcaption>${r.name}</figcaption>
        </div>
      </figure>`;

    // Kadry są OPCJONALNE. Bez `shots` (i bez starego pojedynczego `img`)
    // karta renderuje się jako sam tekst (.is-textonly w styles.css) -
    // wcześniej stał tu pusty <image-slot>, który każdemu odwiedzającemu
    // pokazywał placeholder „Rendering – ...".
    csList.innerHTML = window.CASE_STUDIES.map((c) => {
      const shots = Array.isArray(c.shots) && c.shots.length ? c.shots : null;
      const media = shots
        ? `<div class="cs__media cs__media--x">${shotsHtml(c)}</div>`
        : (c.img ? `<div class="cs__media"><img class="cs__img" src="${c.img}" loading="lazy" decoding="async" alt="${c.alt || c.title}" /></div>` : "");
      const rev = reviewOf(c);
      return `
      <article class="cs__item${media ? "" : " is-textonly"}" data-reveal>
        ${media}
        <div class="cs__body">
          <span class="cs__tag">${c.tag}</span>
          <h3>${c.title}</h3>
          <div class="cs__block"><span class="k">Problem</span><p>${c.problem}</p></div>
          <div class="cs__block"><span class="k">Założenia</span><p>${c.approach}</p></div>
          <div class="cs__block"><span class="k">Rozwiązanie</span><p>${c.solution}</p></div>
          <div class="cs__block"><span class="k">Efekt</span><p>${c.result}</p></div>
          ${rev ? quoteHtml(rev) : ""}
        </div>
      </article>`;
    }).join("");

    /* ------- karuzela: 4 s automatu + strzałki, kropki i swipe ------- */
    const CSX_MS = 4000;
    const csxRM = window.matchMedia("(prefers-reduced-motion: reduce)");

    $$(".csx", csList).forEach((root) => {
      const slides = $$(".csx__slide", root);
      const dots = $$(".csx__dot", root);
      if (slides.length < 2) return;

      let i = 0;
      let held = false;   // kursor na kadrze albo fokus w środku
      let timer = 0;

      const show = (n) => {
        i = (n + slides.length) % slides.length;
        slides.forEach((s, k) => {
          s.classList.toggle("is-on", k === i);
          s.setAttribute("aria-hidden", String(k !== i));
        });
        dots.forEach((d, k) => {
          d.classList.toggle("is-on", k === i);
          if (k === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
        });
      };

      // Czy kadr jest na ekranie. Świadomie BEZ IntersectionObserver-a:
      // obserwator nie odpala się, gdy karta nie jest malowana, a tu i tak co
      // 4 s budzi nas timer - jeden getBoundingClientRect() jest tańszy niż
      // trzymanie obserwatora i nie ma pułapki z kartą w tle.
      const onScreen = () => {
        const r = root.getBoundingClientRect();
        return r.bottom > 0 && r.top < (window.innerHeight || 0);
      };

      const tick = () => { if (!held && !document.hidden && onScreen()) show(i + 1); };
      const arm = () => { if (!csxRM.matches) { clearInterval(timer); timer = setInterval(tick, CSX_MS); } };
      // Ręczne przewinięcie zeruje fazę - inaczej automat mógłby przeskoczyć
      // kadr ułamek sekundy po tym, jak ktoś sam go wybrał.
      const go = (n) => { show(n); arm(); };

      $(".csx__arw--p", root).addEventListener("click", () => go(i - 1));
      $(".csx__arw--n", root).addEventListener("click", () => go(i + 1));
      dots.forEach((d, k) => d.addEventListener("click", () => go(k)));

      root.addEventListener("mouseenter", () => { held = true; });
      root.addEventListener("mouseleave", () => { held = false; });
      root.addEventListener("focusin", () => { held = true; });
      root.addEventListener("focusout", () => { held = false; });

      let sx = 0, sy = 0;
      root.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      root.addEventListener("touchend", (e) => {
        const t = e.changedTouches[0];
        const dx = t.clientX - sx;
        const dy = t.clientY - sy;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? i + 1 : i - 1);
      }, { passive: true });

      arm();
      csxRM.addEventListener?.("change", () => { clearInterval(timer); timer = 0; arm(); });
    });
  }

  /* =======================================================================
     FAQ - accordion
     ===================================================================== */
  const faqList = $("#faqList");
  if (faqList && window.FAQ) {
    faqList.innerHTML = window.FAQ.map((f, i) => `
      <div class="faq__item">
        <button class="faq__q" aria-expanded="false" aria-controls="faq-a-${i}">
          <h3>${f.q}</h3><span class="faq__ic" aria-hidden="true"></span>
        </button>
        <div class="faq__a" id="faq-a-${i}"><div><p>${f.a}</p></div></div>
      </div>`).join("");
    faqList.addEventListener("click", (e) => {
      const btn = e.target.closest(".faq__q");
      if (!btn) return;
      const item = btn.parentElement;
      const open = item.classList.contains("is-open");
      $$(".faq__item", faqList).forEach((it) => {
        it.classList.remove("is-open");
        it.querySelector(".faq__q").setAttribute("aria-expanded", "false");
      });
      if (!open) { item.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); }
    });
  }

  /* =======================================================================
     KONTAKT - formularz + dołączenie wyceny z kalkulatora
     ===================================================================== */
  const form = $("#contactForm");
  if (form) {
    // populate type select from offer
    const typeSel = $("#f-type");
    // Szkic Projektu jest osobną, płatną pozycją w ofercie, więc musi dać się
    // wybrać także tutaj - inaczej sekcja oferty obiecuje coś, czego formularz
    // zgłoszeniowy w ogóle nie przewiduje. Cena ryczałtowa, stąd samo „zł".
    ((window.SKETCH && window.SKETCH.packages) || []).forEach((p) => {
      const o = document.createElement("option");
      o.value = `Szkic Projektu – ${p.name}`;
      o.textContent = `Szkic Projektu – ${p.name} (${PLN(p.price)} zł)`;
      typeSel.appendChild(o);
    });
    offer.forEach((t) => {
      const o = document.createElement("option");
      o.value = `Typ ${t.n}`;
      o.textContent = `Typ ${t.n} – ${t.name} (${t.price} zł/m²)`;
      typeSel.appendChild(o);
    });

    const estimateBox = $("#formEstimate");
    const estimateVal = $("#formEstimateVal");
    const attachCb = $("#f-estimate");

    // keep contact estimate label in sync with calculator
    const syncEstimate = () => {
      if (state.area >= P.minArea) {
        estimateVal.textContent = `${PLN(compute().total)} zł · Typ ${state.type}, ${state.area} m²${state.rush ? ", tryb przyspieszony" : ""}`;
      } else {
        estimateVal.textContent = "wycena indywidualna (poniżej 10 m²)";
      }
    };
    attachCb.addEventListener("change", () => {
      estimateBox.hidden = !attachCb.checked;
      if (attachCb.checked) {
        syncEstimate();
        // prefill area + type from calculator for convenience
        if (!$("#f-area").value) $("#f-area").value = state.area;
        typeSel.value = `Typ ${state.type}`;
      }
    });
    // when CTA in calculator is clicked, also tick the attach box
    $("#outCta")?.addEventListener("click", () => {
      attachCb.checked = true;
      estimateBox.hidden = false;
      syncEstimate();
      if (!$("#f-area").value) $("#f-area").value = state.area;
      typeSel.value = `Typ ${state.type}`;
    });

    const submitBtn = $("#formSubmit");
    const errorBox = $("#formError");
    const btnLabel = submitBtn ? submitBtn.innerHTML : "";

    // Zgłoszenia lecą na typodwnetrz@gmail.com przez Formspree.
    // Zmiana adresu = podmiana tej jednej stałej (panel formspree.io → Forms).
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/mnpqbgwy";

    // W HTML `action` jest puste, żeby adres był w jednym miejscu. Ustawiamy je
    // tutaj, bo gdyby handler submit poleciał wyjątkiem, przeglądarka wysłałaby
    // formularz natywnie pod ten adres, a nie przeładowała strony gubiąc dane.
    form.setAttribute("action", FORMSPREE_ENDPOINT);

    const showSent = () => {
      form.querySelectorAll(".form__row, .form__field, .form__check, .form__estimate, .form__error, button[type=submit]")
        .forEach((n) => (n.style.display = "none"));
      $("#formSent").classList.add("is-on");
    };

    const showError = (msg) => {
      errorBox.textContent = msg;
      errorBox.hidden = false;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorBox.hidden = true;

      // simple required validation — ramka jest też CZYSZCZONA, gdy pole zostanie poprawione
      let ok = true;
      ["f-name", "f-email", "f-consent"].forEach((id) => {
        const el = $("#" + id);
        let valid = el.type === "checkbox" ? el.checked : el.value.trim() !== "";
        // e-mail musi mieć sensowny kształt, inaczej odpowiedź nie ma gdzie trafić
        if (valid && id === "f-email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
        if (!valid) ok = false;
        if (el.type !== "checkbox") el.style.borderColor = valid ? "" : "#b5483a";
      });
      if (!ok) {
        showError("Uzupełnij proszę imię, poprawny adres e-mail i zgodę na kontakt.");
        return;
      }

      const data = new FormData(form);
      data.set("_subject", `Zapytanie ze strony – ${data.get("name") || "bez imienia"}`);
      // czytelna wycena w treści maila zamiast samego "on" z checkboxa
      data.delete("attachEstimate");
      if (attachCb.checked) data.set("Wycena z kalkulatora", estimateVal.textContent);

      submitBtn.disabled = true;
      submitBtn.textContent = "Wysyłam…";

      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showSent();
      } catch (err) {
        console.error("[kontakt] wysyłka nieudana:", err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = btnLabel;
        showError("Nie udało się wysłać zapytania. Napisz proszę bezpośrednio na typodwnetrz@gmail.com – odpowiem tak samo szybko.");
      }
    });
  }


  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  observeReveals();
})();
