/* =========================================================================
   TYP OD WNĘTRZ - podstrona portfolio
   Ściana zdjęć: jedna sekcja na rodzaj wnętrza, w każdej 12 kadrów
   i przycisk „pokaż wszystkie". Dane: window.GALLERY z data/gallery.js -
   pliku GENEROWANEGO przez tools/GalleryIndex.java (nie edytuj go ręcznie).
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
    // Zamknięte menu jest schowane tylko clip-pathem - bez inert Tab na
    // desktopie wchodziłby w jego niewidoczne linki.
    mobileMenu?.toggleAttribute("inert", !open);
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
     GALERIA - jedna sekcja na rodzaj wnętrza
     Dane: window.GALLERY z data/gallery.js (plik GENEROWANY przez
     tools/GalleryIndex.java - patrz komentarz na jego górze).
     ===================================================================== */
  const gallery = window.GALLERY || [];
  const list = $("#pfpList");
  const empty = $("#pfpEmpty");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  // Nazwy plików są takie, jak je wgrał autor - zmienia się tylko rozszerzenie
  // na .webp: nawiasy, polskie znaki, kropki (Łaz_31.webp, 1(2).webp,
  // Pok_p.Kasi_4.webp). W adresie muszą być zakodowane, inaczej serwer dostaje
  // inną ścieżkę, niż widać w danych.
  const enc = (f) => encodeURIComponent(f);
  // #slug z adresu. decodeURIComponent rzuca URIError na uszkodzonym
  // kodowaniu (np. #zle%E0 z uciętego linku) - a że czytamy go przed
  // wyrenderowaniem sekcji, taki adres dawał całkiem pustą stronę.
  const hashSlug = () => {
    try { return decodeURIComponent(window.location.hash || "").slice(1); }
    catch (e) { return ""; }
  };

  /* Polska odmiana przez przypadki: 1 zdjęcie / 2-4 zdjęcia / 5+ zdjęć.
     Bez tego przycisk mówiłby „Pokaż wszystkie 22 zdjęć". */
  const plural = (n, one, few, many) => {
    const d10 = n % 10, d100 = n % 100;
    if (n === 1) return one;
    if (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) return few;
    return many;
  };

  /**
   * Ile kadrów widać, zanim ktoś kliknie „pokaż wszystkie".
   * Reszta jest w HTML-u OD RAZU (wyszukiwarki i Ctrl+F ją widzą), ale
   * schowana przez display:none - a ukrytych zdjęć przeglądarka nie pobiera.
   * Razem z loading="lazy" znaczy to, że wejście na podstronę kosztuje
   * kilkanaście miniatur, a nie czterysta.
   */
  const PREVIEW = 12;

  /**
   * Kategoria, którą zobaczy wchodzący: z #slug w adresie (tak prowadzą kafle
   * ze strony głównej), inaczej pierwsza. Tylko ona dostaje trzy kadry
   * "eager" (pierwszy z fetchpriority="high" - to kandydat na LCP). Wcześniej
   * dostawały je zawsze Kuchnie, więc wejście z #lazienki pobierało trzy
   * niewidoczne zdjęcia kuchni, a widoczne łazienki czekały jako "lazy".
   */
  const startSlug = hashSlug();
  const startIdx = Math.max(0, gallery.findIndex((s) => s.slug === startSlug));

  /**
   * Kadr. Wymiary idą do atrybutów width/height - przeglądarka zna kształt
   * zdjęcia zanim je pobierze, więc rezerwuje na nie miejsce i nic nie skacze
   * przy doczytywaniu (żadnego mierzenia przez new Image(), jak w poprzedniej
   * wersji - przy 395 plikach oznaczałoby to pobranie ich wszystkich).
   */
  function shotHTML(sec, p, i, eager, secIdx) {
    const extra = i >= PREVIEW ? " is-extra" : "";
    const alt = `${sec.alt} – kadr ${i + 1}`;
    // <button>, a nie samo <figure>: kadr otwiera podgląd, więc musi dać się
    // kliknąć TABem i Enterem, a nie tylko myszką. data-sec/data-i to adres
    // zdjęcia w window.GALLERY - podgląd czyta dane, nie DOM.
    return `
      <figure class="pfp__shot${extra}">
        <button type="button" class="pfp__open" data-sec="${secIdx}" data-i="${i}"
                aria-label="Powiększ: ${esc(alt)}">
          <img src="${esc(sec.dir)}/${esc(enc(p.f))}" width="${p.w}" height="${p.h}"
               loading="${eager ? "eager" : "lazy"}" decoding="async"${eager && i === 0 ? ` fetchpriority="high"` : ""}
               alt="${esc(alt)}" />
        </button>
      </figure>`;
  }

  function sectionHTML(sec, idx) {
    const n = sec.photos.length;
    const rest = n - PREVIEW;
    const galId = `gal-${sec.slug}`;
    return `
      <section class="pfp" id="${esc(sec.slug)}" data-cat="${esc(sec.cat)}">
        <header class="pfp__head" data-reveal>
          <div class="pfp__title">
            <span class="pfp__idx">${pad(idx + 1)}</span>
            <h2 class="display">${esc(sec.cat)}</h2>
          </div>
          <dl class="pfp__facts">
            <div><dt>Zdjęcia</dt><dd>${n}</dd></div>
          </dl>
        </header>
        <div class="pfp__gallery" id="${galId}" data-reveal>
          ${sec.photos.map((p, i) => shotHTML(sec, p, i, idx === startIdx && i < 3, idx)).join("")}
        </div>
        ${rest > 0 ? `
        <div class="pfp__more">
          <button class="btn btn--ghost pfp__more-btn" type="button" aria-expanded="false" aria-controls="${galId}"
                  data-all="Pokaż wszystkie ${n} ${plural(n, "zdjęcie", "zdjęcia", "zdjęć")}"
                  data-less="Pokaż mniej">
            <span class="pfp__more-txt">Pokaż wszystkie ${n} ${plural(n, "zdjęcie", "zdjęcia", "zdjęć")}</span>
            <span class="arr" aria-hidden="true">↓</span>
          </button>
          <span class="pfp__more-note" data-collapsed="Widocznych ${PREVIEW} z ${n}" data-open="Widocznych wszystkie ${n}">Widocznych ${PREVIEW} z ${n}</span>
        </div>` : ""}
      </section>`;
  }

  /* Dane strukturalne: ImageGallery z jednym kadrem na kategorię (okładka,
     czyli pierwsze zdjęcie z gallery.js). Wszystkie 395 tylko spuchłyby
     stronę - a z pliku generowanego, bo tylko on wie, co leży na serwerze. */
  if (gallery.length) {
    const site = "https://typodwnetrz.pl/";
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      "@id": `${site}portfolio.html#galeria`,
      url: `${site}portfolio.html`,
      name: "Portfolio projektów wnętrz – Typ od Wnętrz",
      inLanguage: "pl-PL",
      isPartOf: { "@id": `${site}#serwis` },
      image: gallery.filter((s) => s.photos.length).map((s) => ({
        "@type": "ImageObject",
        contentUrl: `${site}${s.dir}/${enc(s.photos[0].f)}`,
        width: s.photos[0].w,
        height: s.photos[0].h,
        name: s.cat,
        caption: s.alt,
        creator: { "@type": "Person", "@id": `${site}#mateusz-przystarz`, name: "Mateusz Przystarz" },
        creditText: "Typ od Wnętrz",
        copyrightNotice: "© Mateusz Przystarz Wnętrza",
      })),
    });
    document.head.appendChild(ld);
  }

  if (list && gallery.length) {
    list.innerHTML = gallery.map(sectionHTML).join("");
  }

  /* ---------------- „Pokaż wszystkie" ----------------
     Rozwijamy klasą na sekcji, a nie dorysowywaniem kadrów: zdjęcia już są
     w DOM-ie, więc nie ma czego renderować, a zwinięcie z powrotem nie
     kasuje niczego, co przeglądarka zdążyła pobrać. */
  list?.addEventListener("click", (e) => {
    const btn = e.target.closest(".pfp__more-btn");
    if (!btn) return;
    const sec = btn.closest(".pfp");
    // Gdzie na ekranie stoi teraz przycisk - patrz niżej.
    const btnY = btn.getBoundingClientRect().top;
    const open = sec.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
    $(".pfp__more-txt", btn).textContent = open ? btn.dataset.less : btn.dataset.all;
    // Notka obok przycisku musi mówić prawdę także po rozwinięciu - inaczej
    // przy komplecie zdjęć na ekranie nadal twierdziła „Widocznych 12 z 29".
    const note = $(".pfp__more-note", sec);
    if (note) note.textContent = open ? note.dataset.open : note.dataset.collapsed;

    // Zwinięcie kasuje kilkadziesiąt ekranów treści NAD przyciskiem, więc
    // czytający zostałby nagle gdzieś w następnej sekcji. Przyklejamy więc
    // przycisk do tego samego miejsca na ekranie, w którym był w chwili
    // kliknięcia - to jest ta sama zasada, co w każdym „pokaż mniej".
    //
    // Dwa szczegóły, oba wyszły w testach:
    //   - korekta jest SYNCHRONICZNA, bez requestAnimationFrame. rAF nie
    //     odpala się, kiedy karta się nie maluje (ta sama pułapka, co przy
    //     IntersectionObserver na tej stronie), więc poprawka potrafiła nie
    //     wykonać się w ogóle. getBoundingClientRect i tak wymusza tu
    //     przeliczenie układu, więc pomiar po zmianie klasy jest już aktualny.
    //     Przed nadpisaniem przez Chrome broni nas overflow-anchor: none
    //     na #pfpList (styles.css),
    //   - „instant", a nie „auto": strona ma scroll-behavior: smooth, więc
    //     „auto" animowałoby przewijanie o kilkanaście tysięcy pikseli.
    if (!open) {
      const dy = btn.getBoundingClientRect().top - btnY;
      if (Math.abs(dy) > 1) window.scrollBy({ top: dy, behavior: "instant" });
    }
  });

  /* ---------------- Przełącznik kategorii ----------------
     Podstrona pokazuje JEDNĄ kategorię naraz. Siedmiu sekcji pod sobą to
     ~20 000 px przewijania, więc chipy nie filtrują listy, tylko ją
     przełączają - jak zakładki. Nie ma chipa „Wszystkie": znaczyłby dokładnie
     tę jedną długą stronę, od której uciekamy.

     Przełączamy przez ukrywanie sekcji, nie przez ponowne renderowanie -
     inaczej rozwinięta galeria zwijałaby się przy każdym kliknięciu, a
     przeglądarka pobierałaby te same zdjęcia od nowa.

     Adres nadaje się do wysłania: wybór kategorii wpisuje się w #slug przez
     replaceState (a nie pushState - inaczej po siedmiu kliknięciach trzeba by
     siedem razy cofnąć, żeby wyjść ze strony). */
  const chipWrap = $("#pfFilter");
  const slugIndex = (slug) => gallery.findIndex((s) => s.slug === slug);

  /**
   * Docelowa pozycja przewijania dla sekcji `node`.
   *
   * Kotwiczymy się na PASKU CHIPÓW, nie na samej sekcji. Stała odległość od
   * sekcji nie działa: nagłówek ma 102 px na desktopie i ~76 px na telefonie,
   * a chipy z trzykolumnowej siatki rosną tam do kilku wierszy. Przy stałym
   * odsunięciu pasek kategorii chował się pod przyklejonym nagłówkiem, więc
   * wchodząc z kafla strony głównej widziało się ścianę zdjęć i żadnej
   * informacji, że kategorie da się przełączyć.
   *
   * Mierzymy więc realną wysokość nagłówka i stawiamy chipy tuż pod nim -
   * sekcja i tak zaczyna się zaraz niżej.
   */
  const scrollTopFor = (node) => {
    const anchor = chipWrap || node;
    const hdrH = hdr ? hdr.getBoundingClientRect().height : 80;
    return anchor.getBoundingClientRect().top + window.scrollY - hdrH - 18;
  };

  if (chipWrap && gallery.length) {
    chipWrap.innerHTML = gallery
      .map((s) => `<button class="chip" type="button" data-slug="${esc(s.slug)}" aria-pressed="false">${esc(s.cat)}</button>`)
      .join("");

    const showCat = (slug, opts = {}) => {
      const sec = gallery[Math.max(0, slugIndex(slug))];
      let node = null;
      $$(".pfp", list).forEach((el) => {
        const on = el.id === sec.slug;
        el.hidden = !on;
        // .is-first zdejmuje górną kreskę - widoczna sekcja jest zawsze
        // pierwsza, więc nie ma nad czym rysować linii podziału.
        el.classList.toggle("is-first", on);
        if (on) node = el;
      });
      $$(".chip", chipWrap).forEach((c) => {
        const on = c.dataset.slug === sec.slug;
        c.classList.toggle("is-on", on);
        c.setAttribute("aria-pressed", String(on));
      });
      if (empty) empty.hidden = true;
      if (opts.url !== false) history.replaceState(null, "", "#" + sec.slug);

      observeReveals();
      revealInView();

      // Po przełączeniu z rozwiniętej (długiej) kategorii można wylądować
      // pod całą treścią nowej - wtedy wracamy na jej początek. Synchronicznie
      // i „instant" - z tych samych powodów, co przy zwijaniu galerii wyżej.
      if (opts.scroll && node) {
        const top = scrollTopFor(node);
        if (window.scrollY > top) window.scrollTo({ top, behavior: "instant" });
      }
    };

    chipWrap.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      showCat(b.dataset.slug, { scroll: true });
    });

    // Wejście: kategoria z adresu (#lazienki - tak prowadzą kafle ze strony
    // głównej), a bez adresu pierwsza z brzegu. Adresu przy starcie NIE
    // dopisujemy - wejście na czyste portfolio.html ma zostać czyste.
    const start = hashSlug();
    showCat(slugIndex(start) >= 0 ? start : gallery[0].slug, { url: false });
  }

  /* =======================================================================
     PODGLĄD ZDJĘCIA (lightbox)
     Kafle w siatce mają najwyżej ~500 px szerokości, więc muszą dać się
     obejrzeć w pełnym kadrze. Podgląd jest ZAMKNIĘTY W SEKCJI: strzałki
     chodzą po zdjęciach jednej kategorii, nie po wszystkich 395 - inaczej
     przewijanie z kuchni wjeżdżałoby w łazienki bez ostrzeżenia.
     Chodzi też po kadrach jeszcze nierozwiniętych w siatce, więc „resztę
     zdjęć" można obejrzeć także tędy, bez klikania „pokaż wszystkie".
     ===================================================================== */
  const lb = {
    root: null, img: null, count: null, cat: null,
    sec: 0, i: 0, lastFocus: null,
  };

  function buildLightbox() {
    const el = document.createElement("div");
    el.className = "lb";
    el.id = "lb";
    el.hidden = true;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "Podgląd zdjęcia");
    el.innerHTML = `
      <button type="button" class="lb__btn lb__close" aria-label="Zamknij podgląd (Esc)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
      <button type="button" class="lb__btn lb__nav lb__prev" aria-label="Poprzednie zdjęcie">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 4L7 12l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="lb__stage"><img class="lb__img" alt="" /></div>
      <button type="button" class="lb__btn lb__nav lb__next" aria-label="Następne zdjęcie">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 4l8 8-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="lb__bar">
        <span class="lb__cat"></span>
        <span class="lb__count" aria-live="polite"></span>
      </div>`;
    document.body.appendChild(el);

    lb.root = el;
    lb.img = $(".lb__img", el);
    lb.count = $(".lb__count", el);
    lb.cat = $(".lb__cat", el);

    $(".lb__close", el).addEventListener("click", closeLB);
    $(".lb__prev", el).addEventListener("click", () => step(-1));
    $(".lb__next", el).addEventListener("click", () => step(1));
    // Kliknięcie w tło zamyka, kliknięcie w samo zdjęcie nie.
    el.addEventListener("click", (e) => { if (e.target === el || e.target.classList.contains("lb__stage")) closeLB(); });

    // Przesunięcie palcem w bok = następne / poprzednie zdjęcie.
    let x0 = null, y0 = null;
    el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      // Tylko wyraźny ruch poziomy - inaczej każde muśnięcie przy przewijaniu
      // przeskakiwałoby zdjęcie.
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    }, { passive: true });
    return el;
  }

  function show(secIdx, i) {
    const sec = gallery[secIdx];
    if (!sec) return;
    const n = sec.photos.length;
    // Zawijanie: z ostatniego zdjęcia strzałka w prawo wraca na pierwsze.
    lb.sec = secIdx;
    lb.i = (i + n) % n;
    const p = sec.photos[lb.i];

    lb.img.src = `${sec.dir}/${enc(p.f)}`;
    lb.img.width = p.w;
    lb.img.height = p.h;
    lb.img.alt = `${sec.alt} – kadr ${lb.i + 1}`;
    lb.cat.textContent = sec.cat;
    lb.count.textContent = `${lb.i + 1} / ${n}`;
    lb.root.classList.toggle("is-single", n < 2);

    // Sąsiadów pobieramy z wyprzedzeniem, żeby strzałka nie mrugała pustką.
    [1, -1].forEach((d) => {
      const nb = sec.photos[(lb.i + d + n) % n];
      if (nb) new Image().src = `${sec.dir}/${enc(nb.f)}`;
    });
  }

  function step(d) { show(lb.sec, lb.i + d); }

  function openLB(secIdx, i, trigger) {
    if (!lb.root) buildLightbox();
    lb.lastFocus = trigger || document.activeElement;
    show(secIdx, i);
    lb.root.hidden = false;
    // Blokada przewijania tła: bez tego kółko myszy przewija stronę POD
    // podglądem i po zamknięciu ląduje się gdzie indziej.
    document.body.classList.add("lb-open");
    $(".lb__close", lb.root).focus();
  }

  function closeLB() {
    if (!lb.root || lb.root.hidden) return;
    lb.root.hidden = true;
    document.body.classList.remove("lb-open");
    lb.img.removeAttribute("src");
    lb.lastFocus?.focus();
  }

  list?.addEventListener("click", (e) => {
    const btn = e.target.closest(".pfp__open");
    if (!btn) return;
    openLB(+btn.dataset.sec, +btn.dataset.i, btn);
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.root || lb.root.hidden) return;
    if (e.key === "Escape") { closeLB(); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    // Podgląd jest oknem modalnym - TAB nie ma z niego wychodzić na stronę
    // pod spodem. Pętla po trzech przyciskach wystarczy, bo tylko one są
    // klikalne.
    if (e.key === "Tab") {
      const btns = $$(".lb__btn", lb.root).filter((b) => b.offsetParent !== null);
      if (!btns.length) return;
      const at = btns.indexOf(document.activeElement);
      const next = e.shiftKey ? at - 1 : at + 1;
      e.preventDefault();
      btns[(next + btns.length) % btns.length].focus();
    }
  });

  /* ---------------- Liczby w nagłówku podstrony ----------------
     Została jedna liczba: ile zdjęć leży w galerii. Licznik kategorii stąd
     zniknął - pasek chipów tuż pod spodem i tak wymienia je wszystkie z
     nazwy, więc „7 kategorii wnętrz" nic do strony nie wnosiło. */
  const stats = $("#pgStats");
  if (stats && gallery.length) {
    const shots = gallery.reduce((n, s) => n + s.photos.length, 0);
    const label = plural(shots, "zdjęcie w galerii", "zdjęcia w galerii", "zdjęć w galerii");
    stats.innerHTML = `<div><b>${shots}</b><span>${label}</span></div>`;
  }

  /* ---------------- Wejście z linku #slug ----------------
     Sekcje są renderowane po wczytaniu skryptu, więc natywny skok do
     kotwicy z adresu już się nie uda - dojeżdżamy tu ręcznie. Dojazd
     powtarzamy po `load` i chwilę później, bo fonty ustalają ostateczne
     wysokości dopiero po pierwszym renderze - ale tylko dopóki użytkownik
     sam nie ruszy stroną, żeby mu jej nie wyrywać spod palca. */
  const hash = hashSlug();
  const target = hash ? document.getElementById(hash) : null;
  if (target) {
    let userMoved = false;
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) =>
      window.addEventListener(ev, () => { userMoved = true; }, { once: true, passive: true })
    );
    // „instant" jest tu KONIECZNE. Strona ma scroll-behavior: smooth, a przy
    // „auto" decyduje CSS - wejście z kotwicą animowałoby się przez kilkanaście
    // tysięcy pikseli galerii, a każde kolejne wywołanie (po `load` i chwilę
    // później) zaczynałoby tę animację od nowa. Efekt: strona zostawała na
    // górze i nie dojeżdżała do sekcji w ogóle.
    const goToTarget = () => {
      if (userMoved) return;
      // Pozycję liczy scrollTopFor: kotwiczy pasek chipów tuż pod nagłówkiem,
      // zamiast odsuwać sekcję o stałą liczbę pikseli (patrz komentarz tam).
      window.scrollTo({ top: scrollTopFor(target), behavior: "instant" });
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
