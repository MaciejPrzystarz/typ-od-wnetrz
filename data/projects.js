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
 *   slug     - id sekcji na podstronie portfolio.html (adres: portfolio.html#slug)
 *   slot     - id dla <image-slot> (stałe, nie zmieniaj po wgraniu zdjęć)
 *   photos   - lista zdjęć; pierwsze jest kadrem otwierającym galerię
 *   location / year - MOGĄ być puste; puste pola po prostu się nie renderują
 *
 * Pola zdjęcia:
 *   src      - ścieżka do pliku
 *   orient   - kształt KAFLA na stronie głównej: "tall" (pionowy, 1/3 szerokości)
 *              lub "wide" (poziomy, 2/3). Dobieraj do orientacji zdjęcia.
 *              Rząd domyka się jako 3x tall albo tall+wide - app.js sam przeplata
 *              kafle, ale liczby muszą się zgadzać, inaczej zostaje dziura.
 *              Na podstronie portfolio to pole nie ma znaczenia: galeria czyta
 *              prawdziwe proporcje z pliku.
 *
 * DODAWANIE ZDJĘĆ DO PROJEKTU: dopisz kolejne pozycje do `photos`. Podstrona
 * portfolio pokaże je wszystkie w galerii; strona główna zrobi z każdego
 * osobny kafel, więc pilnuj wtedy bilansu tall/wide.
 *
 * TODO (Mateusz): uzupełnić `location` i `year` prawdziwymi danymi - zostawiam
 * je puste, żeby nie wpisywać zmyślonych miast i lat pod prawdziwe realizacje.
 * Tytuły i opisy są opisem tego, co widać na zdjęciach - śmiało zmień na własne.
 */
window.PROJECTS = [
  {
    slug: "kuchnia-z-ryflowana-wyspa",
    title: "Kuchnia z ryflowaną wyspą",
    category: "Kuchnie",
    location: "",
    year: "",
    excerpt: "Ryflowany front wyspy, drewniana zabudowa górna i kamienna lamperia. Czarna szyna oświetleniowa pod sufitem.",
    slot: "pf-kuchnia",
    photos: [
      { src: "images/home-images/kitchen.webp", orient: "tall" },
    ],
  },
  {
    slug: "lazienka-w-kamieniu-i-drewnie",
    title: "Łazienka w kamieniu i drewnie",
    category: "Łazienki",
    location: "",
    year: "",
    excerpt: "Kamień na ścianie i blacie, ciemna zabudowa do sufitu i faliste lampy przy lustrze. Łukowe wejście do strefy prysznica.",
    slot: "pf-lazienka",
    photos: [
      { src: "images/home-images/bathroom01.webp", orient: "tall" },
    ],
  },
  {
    slug: "salon-pod-drewnianym-stropem",
    title: "Salon pod drewnianym stropem",
    category: "Salony",
    location: "",
    year: "",
    excerpt: "Skośny strop z drewnianych desek, kominek w jasnej obudowie i oliwkowa sofa modułowa przy stalowym przeszkleniu.",
    slot: "pf-salon",
    photos: [
      { src: "images/home-images/living-room01.webp", orient: "tall" },
    ],
  },
  {
    slug: "sypialnia-w-kolorze-terakoty",
    title: "Sypialnia w kolorze terakoty",
    category: "Sypialnie",
    location: "",
    year: "",
    excerpt: "Tapicerowane łóżko w terakocie, artystyczny tynk na ścianie i podświetlana lamperia. W rogu wydzielone miejsce do pracy.",
    slot: "pf-sypialnia",
    photos: [
      { src: "images/home-images/bedroom01.webp", orient: "tall" },
    ],
  },
  {
    slug: "pokoj-dzieciecy-z-antresola",
    title: "Pokój dziecięcy z antresolą",
    category: "Pokoje dziecięce",
    location: "",
    year: "",
    excerpt: "Antresola ze schodkami-szufladami i siatką do wspinania, girlanda świetlna i stolik z pastelowymi krzesełkami.",
    slot: "pf-pokoj-dzieciecy",
    photos: [
      { src: "images/home-images/children-room01.webp", orient: "tall" },
    ],
  },
  {
    slug: "hol-z-przeszklonymi-drzwiami",
    title: "Hol z przeszklonymi drzwiami",
    category: "Komunikacja / Hole",
    location: "",
    year: "",
    excerpt: "Przeszklone drzwi w czarnej stalowej ramie, drewniana zabudowa po całej ścianie i lampa z obręczy nad konsolą.",
    slot: "pf-hol",
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
