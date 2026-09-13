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
    title: "Pokój dziecięcy z łóżkiem piętrowym",
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

/**
 * Ręczny wybór 8 kadrów na stronie głównej po kliknięciu kategorii,
 * klucz = slug z data/gallery.js, wartości = nazwy plików (.webp) w kolejności
 * na ekranie. Kategoria, której tu nie ma, bierze pierwsze 8 z galerii.
 * Plik, którego nie ma w galerii, jest pomijany, a brakujące miejsca
 * dopełniają kolejne zdjęcia z galerii.
 */
window.HOME_CATEGORY_PHOTOS = {
  lazienki: ["1.webp", "2.webp", "3.webp", "4.webp", "5.webp", "6.webp", "1.1.webp", "8.webp"],
  sypialnie: ["16.webp", "Syp_2.webp", "18.webp", "44.webp", "38.webp", "Syp._1.webp", "22.webp", "37.webp"],
  salony: ["1.webp", "2.webp", "3.webp", "4.webp", "23.webp", "25.webp", "7.webp", "8.webp"],
  gabinety: ["Pok_p.Kasi_4.webp", "Pok_p.Kasi_1.webp", "35.webp", "26.webp", "29(1).webp", "23.webp", "30(1).webp", "33.webp"],
  // Wszystkie osiem wypisane, choć sześć z nich to i tak początek galerii:
  // gdyby lista była krótsza, luki dopełniłyby kolejne kadry z gallery.js -
  // czyli dokładnie 1.webp i 5.webp, te wyrzucone.
  komunikacja: ["30.webp", "3.webp", "28.webp", "6.webp", "8.webp", "14.webp", "15.webp", "16.webp"],
};

window.PROJECT_CATEGORIES = [
  "Wszystkie",
  "Kuchnie",
  "Łazienki",
  "Salony",
  "Sypialnie",
  "Pokoje dziecięce",
  "Gabinety",
  "Komunikacja / Hole",
];
