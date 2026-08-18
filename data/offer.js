/**
 * Oferta + cennik.
 * W Next.js: data/offer.ts / data/pricing.ts.
 * `price` = zł/m². Kalkulator korzysta z tego samego źródła (window.PRICING).
 */
window.OFFER_TYPES = [
  {
    n: 1,
    name: "Same układy funkcjonalne",
    price: 45,
    scope: "3 wersje układu oraz stworzenie jednej finalnej.",
    tags: ["układ funkcjonalny"],
  },
  {
    n: 2,
    name: "Same wizualizacje",
    price: 115,
    scope: "Wizualizacje bez układu, na istniejącym układzie. W cenie 2 poprawki.",
    tags: ["wizualizacje 3D"],
  },
  {
    n: 3,
    name: "Wizualizacje + lista zakupów lub układ",
    price: 130,
    scope: "Wizualizacje oraz lista zakupów albo układ funkcjonalny - do wyboru.",
    tags: ["wizualizacje 3D", "lista zakupów"],
  },
  {
    n: 4,
    name: "Wizualizacje + lista + układ",
    price: 145,
    scope: "Wizualizacje, lista zakupów i układ funkcjonalny.",
    tags: ["wizualizacje 3D", "lista zakupów", "układ"],
  },
  {
    n: 5,
    name: "+ Rzuty techniczne",
    price: 160,
    scope: "Wizualizacje, lista, układ oraz rzuty: elektryka, hydraulika, oświetlenie.",
    tags: ["rzuty techniczne"],
  },
  {
    n: 6,
    name: "+ Widoki ścian dla stolarza",
    price: 185,
    scope: "Wizualizacje, lista, układ i widoki ścian dla stolarza.",
    tags: ["widoki ścian"],
  },
  {
    n: 7,
    name: "Rzuty + widoki ścian",
    price: 200,
    scope: "Wizualizacje, lista, układ, rzuty techniczne i widoki ścian.",
    tags: ["rzuty techniczne", "widoki ścian"],
  },
  {
    n: 8,
    name: "Pełny projekt",
    price: 220,
    scope: "Wszystko z Typu 7 plus rozrysowanie mebli na wymiar.",
    tags: ["pełny zakres", "meble na wymiar"],
    featured: true,
  },
];

// Wspólne źródło dla kalkulatora
window.PRICING = {
  perType: window.OFFER_TYPES.reduce((acc, t) => ((acc[t.n] = t.price), acc), {}),
  discounts: [
    { min: 225, rate: 0.30, label: "powyżej 225 m²" },
    { min: 150, rate: 0.20, label: "powyżej 150 m²" },
    { min: 100, rate: 0.10, label: "powyżej 100 m²" },
  ],
  rushSurcharge: 0.20, // tryb przyspieszony +20%
  minArea: 10, // poniżej -> wycena indywidualna
};

window.CONSULTATIONS = [
  { name: "Szkic Projektu - 1h", price: 290 },
  { name: "Szkic Projektu - 2h", price: 390 },
];
