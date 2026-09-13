/* =========================================================================
   TYP OD WNĘTRZ - podstrona „Przykładowe składowe projektu"
   Renderuje listę plików z window.SAMPLES (data/samples.js) i pokazuje ich
   strony przez PDF.js. Osobny plik od app.js i portfolio.js: ta podstrona
   nie ma hero, kalkulatora, formularza ani portfolio, więc powtarza tylko
   nagłówek, menu i odsłanianie - dokładnie tak samo jak portfolio.js.
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

  /* ---------------- Rok w stopce ---------------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------- Odsłanianie treści ----------------
     Sekcje mają w HTML-u `data-reveal`, a reguła `html.js [data-reveal]`
     w styles.css daje im `opacity: 0` - dopóki coś nie dopisze `.is-in`,
     harmonogram, nagłówki sekcji i CTA są na tej podstronie niewidoczne.
     Świadomie bez IntersectionObserver, z tego samego powodu co podgląd
     PDF-ów niżej: obserwator odzywa się dopiero, gdy karta się rysuje. */
  const revealInView = () => $$("[data-reveal]:not(.is-in)").forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add("is-in");
  });
  let rTick = false;
  window.addEventListener("scroll", () => {
    if (rTick) return; rTick = true;
    requestAnimationFrame(() => { revealInView(); rTick = false; });
  }, { passive: true });
  window.addEventListener("load", () => { revealInView(); setTimeout(revealInView, 400); });
  document.addEventListener("visibilitychange", revealInView);
  revealInView();

  /* =======================================================================
     HARMONOGRAM - przykład
     ===================================================================== */
  const schedBox = $("#smpSchedule");
  const sched = window.SCHEDULE_SAMPLE;
  if (schedBox && sched && sched.rows) {
    const legend = sched.legend
      ? `<p class="sched__legend">${Object.entries(sched.legend).map(([who, txt]) =>
          `<span><span class="sched__who" data-who="${who}">${who}</span> ${txt}</span>`).join("")}</p>`
      : "";
    schedBox.innerHTML = `
      ${sched.note ? `<p class="sched__note">${sched.note}</p>` : ""}
      ${legend}
      <ol class="sched">
        ${sched.rows.map((r) => `
          <li class="sched__row${r.pay ? " is-pay" : ""}">
            <span class="sched__date"><b>${r.date}</b><i>${r.day}</i></span>
            <span class="sched__who" data-who="${r.who}">${r.who}</span>
            <span class="sched__what">${r.text}</span>
            ${r.pay ? `<span class="sched__pay">wpłata ${r.pay}</span>` : ""}
          </li>`).join("")}
      </ol>`;
  }

  /* =======================================================================
     LISTA SKŁADOWYCH
     ===================================================================== */
  const list = $("#smpList");
  const empty = $("#smpEmpty");
  const samples = window.SAMPLES || [];

  if (!list) return;
  if (!samples.length) {
    if (empty) empty.hidden = false;
    return;
  }

  list.innerHTML = samples.map((s, i) => `
    <article class="smp" id="smp-${i}">
      <header class="smp__head">
        <div>
          ${s.scope ? `<span class="smp__scope">${s.scope}</span>` : ""}
          <h2 class="smp__title">${s.title}</h2>
          ${s.note ? `<p class="smp__note">${s.note}</p>` : ""}
        </div>
        <!-- Zawsze widoczny, nie tylko awaryjnie: część osób woli otworzyć
             plik w swojej przeglądarce PDF-ów albo go zapisać. -->
        <a class="smp__open" href="${s.file}" target="_blank" rel="noopener">Otwórz plik ${/\.pdf$/i.test(s.file) ? "PDF" : "w nowej karcie"} <span aria-hidden="true">→</span></a>
      </header>
      <div class="smp__doc" data-file="${s.file}" data-title="${s.title}"${s.maxPages ? ` data-max="${s.maxPages}"` : ""}>
        <!-- Stan POCZĄTKOWY, a nie „ładuję": render startuje dopiero, gdy karta
             zbliży się do ekranu (patrz sweep niżej), więc pierwsza karta stoi
             ~2300 px niżej i nic się nie pobiera. Dziesięć napisów „Ładuję
             podgląd…", z których żaden nic nie ładuje, wyglądało na zawieszone.
             Uwaga: to wnętrze template literala - żadnych backticków tutaj. -->
        <p class="smp__status">Podgląd wczyta się przy przewijaniu…</p>
      </div>
    </article>`).join("");

  const lib = window.pdfjsLib;
  if (lib) {
    // Worker MUSI pochodzić z tego samego wydania co biblioteka - inaczej
    // PDF.js przerywa z „API version does not match Worker version".
    lib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  /**
   * Rysuje wszystkie strony pliku na osobnych <canvas>.
   * Skala liczona ze ZMIERZONEJ szerokości kontenera razy gęstość ekranu
   * (maks. 2) - na telefonie z retiną strony nie mogą być rozmyte, a przy
   * większym mnożniku canvas potrafi przekroczyć limit pamięci przeglądarki.
   */
  async function renderDoc(box) {
    const file = box.dataset.file;
    const title = box.dataset.title;
    const status = $(".smp__status", box);

    // Składowa bywa zwykłym obrazkiem (np. harmonogram wyeksportowany do JPG).
    // Wtedy nie ma czego renderować - wystarczy <img> w tej samej oprawie.
    if (/\.(jpe?g|png|webp|avif|gif)$/i.test(file)) {
      const img = document.createElement("img");
      img.className = "smp__page";
      img.src = file;
      img.alt = title;
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = () => {
        box.innerHTML = `<p class="smp__status smp__status--err">Nie udało się wczytać podglądu. <a href="${file}" target="_blank" rel="noopener">Otwórz plik</a>.</p>`;
      };
      box.innerHTML = "";
      box.appendChild(img);
      return;
    }

    if (!lib) {
      box.innerHTML = `<p class="smp__status smp__status--err">Podgląd nie zadziałał w tej przeglądarce. <a href="${file}" target="_blank" rel="noopener">Otwórz plik PDF</a>.</p>`;
      return;
    }

    try {
      const doc = await lib.getDocument(file).promise;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = box.clientWidth || 900;
      const frag = document.createDocumentFragment();
      // Wielostronicowe dokumenty pokazujemy w skrócie. Powód praktyczny:
      // ostatnia strona takiego pliku bywa zapisana w jednej czwartej i przed
      // stopką zostawała pusta kartka na cały ekran. Powód drugi: podgląd ma
      // pokazać, JAK to wygląda, a nie zastąpić plik - od tego jest odnośnik.
      const limit = Math.max(1, Number(box.dataset.max) || 3);
      const shown = Math.min(doc.numPages, limit);

      for (let n = 1; n <= shown; n++) {
        const page = await doc.getPage(n);
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: (cssW / base.width) * dpr });
        const canvas = document.createElement("canvas");
        canvas.className = "smp__page";
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        // Canvas jest dla czytnika ekranu pustym prostokątem - podpisujemy go,
        // bo inaczej cała podstrona jest dla niego pusta.
        canvas.setAttribute("role", "img");
        canvas.setAttribute("aria-label", `${title} – strona ${n} z ${doc.numPages}`);
        await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
        frag.appendChild(canvas);
      }

      if (doc.numPages > shown) {
        const more = document.createElement("p");
        more.className = "smp__more";
        more.innerHTML = `Podgląd: ${shown} z ${doc.numPages} stron. <a href="${file}" target="_blank" rel="noopener">Otwórz plik PDF</a>, żeby zobaczyć całość.`;
        frag.appendChild(more);
      }

      box.innerHTML = "";
      box.appendChild(frag);
      box.dataset.renderedWidth = String(Math.round(cssW));
    } catch (err) {
      if (status) {
        status.classList.add("smp__status--err");
        status.innerHTML = `Nie udało się wczytać podglądu. <a href="${file}" target="_blank" rel="noopener">Otwórz plik PDF</a>.`;
      }
    }
  }

  // Renderujemy dopiero, gdy składowa zbliża się do ekranu - przy kilku
  // plikach po kilka MB wejście na stronę ściągałoby wszystko naraz.
  //
  // Świadomie BEZ IntersectionObserver, choć to jego typowe zastosowanie:
  // obserwator odpala się dopiero, gdy karta się rysuje, więc w karcie
  // otwartej w tle (albo przywróconej z sesji) podgląd potrafi zostać na
  // „Ładuję podgląd…" na zawsze. Zwykłe sprawdzenie pozycji przy scrollu
  // jest tu przewidywalne - i tak samo rozwiązano odsłanianie w app.js.
  const boxes = $$(".smp__doc", list);
  const sweep = () => {
    const limit = window.innerHeight + 600;
    boxes.forEach((b) => {
      if (b.dataset.state) return;
      if (b.getBoundingClientRect().top > limit) return;
      b.dataset.state = "loading";
      // Dopiero TERAZ coś się faktycznie pobiera, więc dopiero teraz napis
      // o ładowaniu jest prawdziwy (stan początkowy mówi „wczyta się przy
      // przewijaniu" - patrz komentarz przy szablonie karty wyżej).
      const st = b.querySelector(".smp__status");
      if (st) st.textContent = "Ładuję podgląd…";
      renderDoc(b);
    });
  };
  let sweeping = false;
  const onScroll = () => {
    if (sweeping) return;
    sweeping = true;
    setTimeout(() => { sweeping = false; sweep(); }, 120);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", sweep);
  sweep();

  // Zmiana szerokości okna = strony narysowane w starej skali są rozmyte lub
  // przycięte. Przerysowujemy dopiero przy realnej zmianie (>120 px), żeby
  // chowający się pasek adresu na telefonie nie wywoływał renderu bez końca.
  let rt = 0;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      boxes.forEach((b) => {
        const was = Number(b.dataset.renderedWidth || 0);
        if (was && Math.abs(b.clientWidth - was) > 120) {
          b.innerHTML = '<p class="smp__status">Ładuję podgląd…</p>';
          renderDoc(b);
        }
      });
      sweep();
    }, 300);
  });
})();
