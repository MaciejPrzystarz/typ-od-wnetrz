/**
 * Portfolio - dane projektów.
 * W Next.js: data/projects.ts (export const projects = [...]).
 * `slot` = id dla <image-slot> (podmiana renderingu); `orient` steruje układem w gridzie.
 */
window.PROJECTS = [
  {
    slug: "apartament-stare-miasto",
    title: "Apartament - Stare Miasto",
    category: "Mieszkania",
    location: "Wrocław",
    year: "2025",
    orient: "tall",
    excerpt: "Ciepła, przytulna przestrzeń dzienna z zabudową pod sufit.",
    slot: "pf-01",
  },
  {
    slug: "kuchnia-w-bieli-i-drewnie",
    title: "Kuchnia w bieli i drewnie",
    category: "Kuchnie",
    location: "Wrocław",
    year: "2025",
    orient: "wide",
    excerpt: "Otwarta kuchnia z wyspą, naturalne fornery i mosiężne detale.",
    slot: "pf-02",
  },
  {
    slug: "lazienka-spa",
    title: "Łazienka SPA",
    category: "Łazienki",
    location: "Online · Warszawa",
    year: "2024",
    orient: "tall",
    excerpt: "Mikrocement, ciepłe światło i strefa relaksu w 6 m².",
    slot: "pf-03",
  },
  {
    slug: "salon-z-kominkiem",
    title: "Salon z kominkiem",
    category: "Salony",
    location: "Online · Kraków",
    year: "2025",
    orient: "wide",
    excerpt: "Miękkie tkaniny, ziemiste barwy i strefa kominkowa.",
    slot: "pf-04",
  },
  {
    slug: "dom-pod-lasem",
    title: "Dom pod lasem",
    category: "Domy",
    location: "okolice Wrocławia",
    year: "2024",
    orient: "tall",
    excerpt: "Parter 140 m² - spójna paleta drewna, lnu i kamienia.",
    slot: "pf-05",
  },
  {
    slug: "mieszkanie-dla-pary",
    title: "Mieszkanie dla pary",
    category: "Mieszkania",
    location: "Wrocław",
    year: "2025",
    orient: "wide",
    excerpt: "48 m² zaplanowane od układu po listę zakupów.",
    slot: "pf-06",
  },
];

window.PROJECT_CATEGORIES = ["Wszystkie", "Kuchnie", "Łazienki", "Salony", "Mieszkania", "Domy"];
