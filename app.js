/* =========================================================================
   TYP OD WNĘTRZ — interactions
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
  const closeMenu = () => document.body.classList.remove("menu-open");
  burger.addEventListener("click", () => document.body.classList.toggle("menu-open"));
  $$(".mobile__nav a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

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
  let ticking = false;
  const parallax = () => {
    const y = window.scrollY;
    const m = $(".hero__media image-slot, .hero__media .ph");
    if (m && y < window.innerHeight) m.style.transform = `translateY(${y * 0.18}px) scale(1.02)`;
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(parallax); ticking = true; } }, { passive: true });

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
  const phVariants = ["ph", "ph v2", "ph v3"];

  function renderPortfolio(filter) {
    const list = filter && filter !== "Wszystkie" ? projects.filter((p) => p.category === filter) : projects;
    pfGrid.innerHTML = list.map((p, i) => `
      <a class="pf__item ${p.orient}" href="#kontakt" data-reveal aria-label="${p.title}">
        <image-slot id="${p.slot}" class="ph ${phVariants[i % 3]}" shape="rect" placeholder="Wgraj rendering — ${p.title}"></image-slot>
        <div class="pf__shade"></div>
        <span class="pf__cat">${p.category}</span>
        <div class="pf__meta">
          <div>
            <h3>${p.title}</h3>
            <p>${p.location} · ${p.year}</p>
          </div>
          <span class="pf__arrow" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" stroke-width="1.3"/></svg>
          </span>
        </div>
      </a>`).join("");
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
     OFERTA — 8 typów
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
      <span class="tn">${t.n}</span><span class="tp">${t.price} zł</span>
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
    typeName.innerHTML = `Typ ${state.type} — <b>${activeType().name}</b>`;
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
  rushToggle.addEventListener("click", () => {
    state.rush = !state.rush;
    rushToggle.classList.toggle("is-on", state.rush);
    render();
  });

  setArea(60);
  render();

  // CTA — pass estimate to contact (placeholder behaviour for prototype)
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
     OPINIE — slider
     ===================================================================== */
  const revTrack = $("#revTrack");
  const reviews = window.REVIEWS || [];
  if (revTrack && reviews.length) {
    revTrack.innerHTML = reviews.map((r) => `
      <div class="rev__slide"><blockquote class="rev__q">${r.quote}</blockquote>
        <div class="rev__who"><span class="nm">${r.name}</span><span class="dot"></span><span class="mt">${r.meta}</span></div></div>`).join("");
    let ri = 0;
    const total = reviews.length;
    const cnt = $("#revCount");
    const go = (n) => {
      ri = (n + total) % total;
      revTrack.style.transform = `translateX(-${ri * 100}%)`;
      cnt.textContent = `${String(ri + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    };
    $("#revPrev").addEventListener("click", () => go(ri - 1));
    $("#revNext").addEventListener("click", () => go(ri + 1));
    go(0);
  }

  /* =======================================================================
     CASE STUDIES
     ===================================================================== */
  const csList = $("#csList");
  if (csList && window.CASE_STUDIES) {
    csList.innerHTML = window.CASE_STUDIES.map((c, i) => `
      <article class="cs__item" data-reveal>
        <div class="cs__media"><image-slot id="${c.slot}" class="ph ${i % 2 ? "v2" : "v3"}" shape="rect" placeholder="Rendering — ${c.title}"></image-slot></div>
        <div class="cs__body">
          <span class="cs__tag">${c.tag}</span>
          <h3>${c.title}</h3>
          <div class="cs__block"><span class="k">Problem</span><p>${c.problem}</p></div>
          <div class="cs__block"><span class="k">Założenia</span><p>${c.approach}</p></div>
          <div class="cs__block"><span class="k">Rozwiązanie</span><p>${c.solution}</p></div>
          <div class="cs__block"><span class="k">Efekt</span><p>${c.result}</p></div>
        </div>
      </article>`).join("");
  }

  /* =======================================================================
     FAQ — accordion
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
     KONTAKT — formularz + dołączenie wyceny z kalkulatora
     ===================================================================== */
  const form = $("#contactForm");
  if (form) {
    // populate type select from offer
    const typeSel = $("#f-type");
    offer.forEach((t) => {
      const o = document.createElement("option");
      o.value = `Typ ${t.n}`;
      o.textContent = `Typ ${t.n} — ${t.name} (${t.price} zł/m²)`;
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

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // simple required validation
      let ok = true;
      ["f-name", "f-email", "f-consent"].forEach((id) => {
        const el = $("#" + id);
        const valid = el.type === "checkbox" ? el.checked : el.value.trim() !== "";
        if (!valid) { ok = false; el.closest(".form__field, .form__check").style.outline = ""; el.style.borderColor = el.type === "checkbox" ? "" : "#b5483a"; }
      });
      if (!ok) return;
      // prototype: no backend — show success state
      form.querySelectorAll(".form__row, .form__field, .form__check, .form__estimate, button[type=submit]").forEach((n) => n.style.display = "none");
      $("#formSent").classList.add("is-on");
    });
  }


  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  observeReveals();
})();
