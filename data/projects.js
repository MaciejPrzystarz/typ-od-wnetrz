/**
 * Portfolio - dane projektów.
 * W Next.js: data/projects.ts (export const projects = [...]).
 *
 * Stan obecny: po jednym projekcie (i jednym zdjęciu) na kategorię.
 * Zdjęcia leżą w images/home-images/, wszystkie 1600x2000 - czyli PIONOWE,
 * dlatego każdy kafel ma orient "tall". Siatka na stronie głównej ma 12 kolumn,
 * kafel pionowy zajmuje 4, więc sześć kafli układa się w dwa równe rzędy po trzy.
 *
 * Pola projektu:
 *   slug     - identyfikator projektu (używany w id kafla i w danych)
 *   catSlug  - kotwica SEKCJI na podstronie portfolio (portfolio.html#catSlug).
 *              Podstrona jest ułożona kategoriami, nie projektami, więc kafel
 *              ze strony głównej prowadzi do galerii swojego rodzaju wnętrz.
 *              Wartości muszą się zgadzać ze `slug` w data/gallery.js.
 *   photos   - lista zdjęć; każde daje osobny kafel na stronie głównej
 *   location / year - MOGĄ być puste; puste pola po prostu się nie renderują
 *
 * Pola zdjęcia:
 *   src      - ścieżka do pliku
 *   orient   - kształt KAFLA na stronie głównej: "tall" (pionowy, 1/3 szerokości)
 *              lub "wide" (poziomy, 2/3). Dobieraj do orientacji zdjęcia.
 *              Rząd domyka się jako 3x tall albo tall+wide - app.js sam przeplata
 *              kafle, ale liczby muszą się zgadzać, inaczej zostaje dziura.
 *
 * DODAWANIE ZDJĘĆ DO PROJEKTU: dopisz kolejne pozycje do `photos`. Strona główna
 * zrobi z każdego osobny kafel, więc pilnuj wtedy bilansu tall/wide.
 *
 * TODO (Mateusz): uzupełnić `location` i `year` prawdziwymi danymi - zostawiam
 * je puste, żeby nie wpisywać zmyślonych miast i lat pod prawdziwe realizacje.
 * Tytuły są opisem tego, co widać na zdjęciach - śmiało zmień na własne.
 */
window.PROJECTS = [
  {
    slug: "kuchnia-z-ryflowana-wyspa",
    catSlug: "kuchnie",
    title: "Kuchnia z ryflowaną wyspą",
    category: "Kuchnie",
    location: "",
    year: "",
    photos: [
      { src: "images/home-images/kitchen.webp", orient: "tall" },
    ],
  },
  {
    slug: "lazienka-w-kamieniu-i-drewnie",
    catSlug: "lazienki",
    title: "Łazienka w kamieniu i drewnie",
    category: "Łazienki",
    location: "",
    year: "",
    photos: [
      { src: "images/home-images/bathroom01.webp", orient: "tall" },
    ],
  },
  {
    slug: "salon-pod-drewnianym-stropem",
    catSlug: "salony",
    title: "Salon pod drewnianym stropem",
    category: "Salony",
    location: "",
    year: "",
    photos: [
      { src: "images/home-images/living-room01.webp", orient: "tall" },
    ],
  },
  {
    slug: "sypialnia-w-kolorze-terakoty",
    catSlug: "sypialnie",
    title: "Sypialnia w kolorze terakoty",
    category: "Sypialnie",
    location: "",
    year: "",
    photos: [
      { src: "images/home-images/bedroom01.webp", orient: "tall" },
    ],
  },
  {
    slug: "pokoj-dzieciecy-z-antresola",
    catSlug: "pokoje-dzieciece",
    title: "Pokój dziecięcy z antresolą",
    category: "Pokoje dziecięce",
    location: "",
    year: "",
    photos: [
      { src: "images/home-images/children-room01.webp", orient: "tall" },
    ],
  },
  {
    slug: "hol-z-przeszklonymi-drzwiami",
    catSlug: "komunikacja",
    title: "Hol z przeszklonymi drzwiami",
    category: "Komunikacja / Hole",
    location: "",
    year: "",
    photos: [
      { src: "images/home-images/communication01.webp", orient: "tall" },
    ],
  },
];

window.PROJECT_CATEGORIES = [
  "Wszystkie",
  "Kuchnie",
  "Łazienki",
  "Salony",
  "Sypialnie",
  "Pokoje dziecięce",
  "Komunikacja / Hole",
];
