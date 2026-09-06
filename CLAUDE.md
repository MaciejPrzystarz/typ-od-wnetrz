# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A marketing site for **Typ od Wnętrz**, an interior-design studio (Wrocław & online): a long single-page `index.html` plus one subpage, `portfolio.html`. Plain static HTML/CSS/vanilla JS - **no build step, no framework, no package.json, no tests**. All UI copy is in Polish; keep it that way.

## Running locally

Serve the folder over HTTP (not `file://`) - `image-slot.js` fetches a sidecar JSON at load, which fails on the file protocol:

```bash
# -d needs an ABSOLUTE path - `-d .` fails with "server config failed: Path is not absolute"
java -m jdk.httpserver -b 127.0.0.1 -p 8000 -d "C:\Users\Miacus\IdeaProjects\typ-od-wnetrz"
# then open http://localhost:8000
```

Do **not** use Python to serve this project — stick to the Java toolchain.

There is nothing to build, lint, or test. To deploy, publish the repo root as static files.

## Architecture

**Data-driven rendering.** `index.html` ships mostly empty section shells with mount-point IDs (`#pfGrid`, `#offerGrid`, `#types`, `#procGrid`, `#timeline`, `#revTrack`, `#csList`, `#faqList`, …). At runtime `app.js` reads global data objects and injects HTML via template strings. To change site *content*, edit the `data/*.js` files - not `index.html`.

**Portfolio subpage** (`portfolio.html` + `portfolio.js`). The full project list: beige page-head panel, category filter, and a photo gallery per project. It renders from the same `window.PROJECTS` as the home page. Photos live in `images/home-images/` and are listed per project as `{ src, orient }`. (`images/portfolio/<room>/` folders still exist but are empty - they were an earlier layout.)
Categories live in `window.PROJECT_CATEGORIES` and are Polish room types: Wszystkie, Kuchnie, Łazienki, Salony, Sypialnie, Pokoje dziecięce, Komunikacja / Hole. When you change them, also update the prose that lists them - the portfolio lead on both pages, `portfolio.html`'s meta/OG descriptions, and `knowsAbout` in the home page JSON-LD.
Two different layout rules read that data. On the home page `#pfGrid` shows **one tile per PHOTO, not per project**, using the `orient` field; `app.js` interleaves tall/wide because the 12-column grid only closes a row as tall+wide or 3x tall, and adds `.is-sparse` when a filtered view has fewer than three tiles so the leftovers centre instead of leaving two thirds of a row empty. On the subpage the gallery ignores `orient` and reads each file's real proportions, laying landscapes full width, portraits in pairs, and a lone portrait narrowed and centred.
`portfolio.js` is deliberately separate from `app.js`: the subpage has no hero, calculator or contact form, and `app.js` would throw without those nodes in the DOM, so `portfolio.js` re-implements only header/menu/reveal. The category filter **hides** projects (`[hidden]`) instead of re-rendering the list - `<image-slot>` keeps the dropped image inside itself, so a rebuild would blank the gallery. `<body class="page-sub">` forces the light header from the first paint (no dark hero underneath it).
Tiles in `#pfGrid` link to `portfolio.html#<slug>`, and "Zobacz pełne portfolio" points at this subpage.
Two traps found the hard way, both now commented in the CSS: never put `transition` on `aspect-ratio` that JS sets right after insertion (Chrome freezes it at the start value), and never centre a grid item with `margin-inline: auto` plus `max-width` (auto margins kill the stretch, so the item collapses to zero width) - use an explicit `width`.

**Sample-documentation subpage** (`przykladowy-projekt.html` + `samples.js`). Shows what the client gets at the end: the real PDFs (plus one JPG) from `images/pdf/`, listed in `window.SAMPLES` (`data/samples.js`) with `title`, `scope`, `note`. PDF pages render to `<canvas>` via PDF.js pinned at 3.11.174 from cdnjs — library and worker must be the same release. Image files (`.jpg`/`.png`/…) skip PDF.js and go in as `<img>`. Those files are **public**: anything with a client name, address, phone or contractor data must not land there. The link to this page sits under the Szkic Projektu note on the home page and `app.js` renders it **only when `window.SAMPLES` is non-empty**, so an empty list never produces a link into an empty page — which is why `index.html` also loads `data/samples.js`.
The page opens with a **schedule** built from `window.SCHEDULE_SAMPLE` — real dates from one project, set as text (not the original screenshot) so it is selectable, readable by screen readers and indexable. Each row carries `who` (`"Ja"` / `"Ty"`), which is the point of that table: the deadlines bind both sides. A multi-page PDF shows only the first `maxPages` pages (default 3) plus a link to the whole file — the last page of a long document is usually a quarter full and left a blank sheet the size of the screen right above the footer.
Loading is deliberately **not** `IntersectionObserver`-based: the observer only fires while the tab is painting, so a page opened in a background tab could sit on „Ładuję podgląd…" forever. A scroll/position check does the same job predictably (same reasoning as the reveal fallback in `app.js`). Note that `page.render()` itself uses `requestAnimationFrame` internally, so in a background tab the render finishes only once the tab is shown — that is fine, but it makes the viewer impossible to verify in an automated/headless tab.

**Script load order matters** (see bottom of `index.html`): `image-slot.js` → `data/projects.js` → `data/offer.js` → `data/content.js` → `data/samples.js` → `app.js`. On `portfolio.html` it is shorter: `image-slot.js` → `data/projects.js` → `portfolio.js`; on `przykladowy-projekt.html`: PDF.js (CDN) → `data/samples.js` → `samples.js`. The data files assign plain globals (`window.PROJECTS`, `window.OFFER_TYPES`, `window.PRICING`, `window.PROCESS_STEPS`, `window.TIMELINE`, `window.REVIEWS`, `window.CASE_STUDIES`, `window.FAQ`, `window.PROJECT_CATEGORIES`, `window.SAMPLES`), and `app.js` consumes them, so app.js must load last.

**Single source of truth for pricing.** `window.PRICING` in `data/offer.js` is *derived* from `OFFER_TYPES` (`perType` is built from each type's `price`). The quote calculator in `app.js` (`compute()`/`render()`) reads only `PRICING` - area × zł/m², then volume `discounts` by min m², then optional `rushSurcharge`, with `minArea` below which it shows "wycena indywidualna". Changing a type's price in `OFFER_TYPES` automatically updates the offer grid, the type selector, and the calculator together. Don't hardcode prices elsewhere.

**`<image-slot>`** (`image-slot.js`) is a self-contained custom element for user-fillable image placeholders, built for the "omelette" runtime: drops persist to a `.image-slots.state.json` sidecar via `window.omelette.writeFile`. Outside that runtime it's **read-only** (shows the placeholder caption). Each slot needs a unique `id`; portfolio/case-study slot ids come from the `slot` field in the data files. Treat this file as a vendored dependency - avoid editing it.

**`app.js` also owns** all interactions: scroll-reveal via `IntersectionObserver` (with a scroll/timeout fallback so content is never left hidden), header glass-on-scroll, mobile menu, hero parallax, smooth anchor scroll, portfolio category filter, reviews slider, FAQ accordion, and the contact form. The contact form posts to **Formspree** via `fetch` — the endpoint lives in one constant, `FORMSPREE_ENDPOINT`, at the top of the contact block in `app.js`, and is **live**: submissions really are sent, and reach `typodwnetrz@gmail.com`. Don't submit the form while testing unless you mean to send a real message. The HTML keeps `action=""` on purpose so the address stays in that one constant; `app.js` fills the attribute in at runtime. The honeypot field is Formspree's `_gotcha`. The form can attach the current calculator estimate to the message.

## Conventions

- **Dashes: `–` (en dash / półpauza), never `-`.** In Polish copy a sentence dash and a range are both `–`, surrounded by spaces (`Apartament – Stare Miasto`, `1–2 dni`). This is not just correctness: Cormorant Garamond's hyphen glyph is a short, slanted tick sitting near cap-height, and at display sizes it reads as a typo. The plain hyphen stays only inside compounds (`e-mail`), slugs and URLs (`#o-mnie`). **Never sweep this with a blind find-and-replace over the JS** - ` - ` there is also the minus operator (`scrollY - 70`, `length - 1`); change only the visible strings.
- The theme is **hard-locked to light** - the inline script in `<head>` forces `data-theme="light"` and ignores `?theme=dark` / stored prefs. There is no dark mode to maintain.
- Pricing numbers that appear in prose (not just in the offer grid or the calculator) are INJECTED from `window.PRICING`, never typed into `index.html`: `#rushPct` carries the rush surcharge, `#discFrom` the lowest volume-discount threshold. The number in the markup is only a fallback for when JS fails - keep it correct, but change the real value in `data/offer.js`.
- Cache-bust when editing shared assets by bumping the query version wherever it is referenced (`styles.css?v=…`, `app.js?v=…`, `portfolio.js?v=…`). The `data/*.js` files carry visible copy, so they are versioned too. `styles.css` is loaded by BOTH `index.html` and `portfolio.html` - bump it in both, or one page keeps serving the stale sheet. Note the HTML files themselves are **not** versioned, so browsers cache them — hard-refresh when their markup changes.
- Data-file header comments reference an eventual Next.js migration (`data/projects.ts`, etc.); the current site is the vanilla prototype of that.
- The contact address is `typodwnetrz@gmail.com`, written as plain `mailto:` links in three places (mobile menu, contact section, footer). Cloudflare may re-obfuscate them on serve (`__cf_email__` / `/cdn-cgi/l/email-protection`) and injects its own decode script — that markup is expected in production, not broken. Keep the source plain.
- The hero background is a looping `<video>` (`images/hero-video.mp4`), driven by `app.js`: pauses off-screen, retries blocked autoplay on first interaction, freezes on frame one under `prefers-reduced-motion`.
- SEO surfaces (`sitemap.xml`, `robots.txt`, canonical/OG/JSON-LD in `<head>`) hardcode the production domain `typodwnetrz.pl`.
