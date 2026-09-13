/**
 * Oferta + cennik.
 * W Next.js: data/offer.ts / data/pricing.ts.
 * `price` = zł/m². Kalkulator korzysta z tego samego źródła (window.PRICING).
 *
 * NAZEWNICTWO: bez skrótów myślowych. W typach 1-7 piszemy zawsze pełne
 * nazwy zakresu - „lista zakupów" (nie „lista"), „układy funkcjonalne"
 * (nie „układ"), „wizualizacje z poprawkami" (nie same „wizualizacje").
 * Klient czyta kafle bez kontekstu reszty cennika, więc skrót w jednym
 * kaflu potrafi zmienić sens całej pozycji.
 *
 * `tags` nie jest nigdzie renderowane - zostaje jako pole pod migrację.
 */
window.OFFER_TYPES = [
  {
    n: 1,
    name: "Same układy funkcjonalne",
    price: 50,
    scope: "3 wersje układu funkcjonalnego oraz stworzenie jednej finalnej.",
    tags: ["układy funkcjonalne"],
  },
  {
    n: 2,
    name: "Same wizualizacje z poprawkami",
    price: 130,
    // „2 rundy poprawek", nie „2 poprawki" - proces (krok 07) i FAQ mówią
    // o rundach, a runda to nie to samo co pojedyncza poprawka.
    scope: "Wizualizacje na istniejącym układzie funkcjonalnym, bez projektowania układu. W cenie 2 rundy poprawek.",
    tags: ["wizualizacje 3D"],
  },
  {
    n: 3,
    name: "Wizualizacje z poprawkami + lista zakupów lub układy funkcjonalne",
    price: 145,
    scope: "Wizualizacje z poprawkami oraz lista zakupów albo układy funkcjonalne – do wyboru.",
    tags: ["wizualizacje 3D", "lista zakupów", "układy funkcjonalne"],
  },
  {
    n: 4,
    name: "Wizualizacje z poprawkami + lista zakupów + układy funkcjonalne",
    price: 160,
    scope: "Wizualizacje z poprawkami, lista zakupów i układy funkcjonalne.",
    tags: ["wizualizacje 3D", "lista zakupów", "układy funkcjonalne"],
  },
  {
    n: 5,
    name: "+ Rzuty techniczne",
    price: 175,
    scope: "Wizualizacje z poprawkami, lista zakupów, układy funkcjonalne oraz rzuty: elektryka, hydraulika, oświetlenie.",
    tags: ["rzuty techniczne"],
  },
  {
    n: 6,
    name: "+ Widoki ścian dla stolarza",
    price: 205,
    scope: "Wizualizacje z poprawkami, lista zakupów, układy funkcjonalne i widoki ścian dla stolarza.",
    tags: ["widoki ścian"],
  },
  {
    n: 7,
    name: "Rzuty techniczne + widoki ścian",
    price: 220,
    scope: "Wizualizacje z poprawkami, lista zakupów, układy funkcjonalne, rzuty techniczne i widoki ścian.",
    tags: ["rzuty techniczne", "widoki ścian"],
  },
  {
    n: 8,
    name: "Pełny projekt",
    price: 240,
    scope: "Wszystko z Typu 7 plus rozrysowanie mebli na wymiar – razem z tym, jak wyglądają w środku.",
    tags: ["pełny zakres", "meble na wymiar"],
    featured: true,
  },
];

/**
 * Szkic Projektu - osobna usługa obok ośmiu typów projektu.
 * Cena RYCZAŁTOWA (zł za całość), nie za m², więc nie wchodzi do PRICING
 * ani do kalkulatora - kalkulator liczy wyłącznie stawki metrażowe.
 * Renderuje app.js do #sketch.
 */
window.SKETCH = {
  title: "Szkic Projektu – forma online",
  packages: [
    {
      name: "Pakiet Podstawowy",
      scope: "Propozycja zmian ergonomii, przykłady wyposażenia, przydatne linki.",
      price: 290,
    },
    {
      name: "Pakiet Rozszerzony",
      scope: "Zbiór założeń projektowych, propozycja zmian ergonomii, propozycje materiałowe, przykłady wyposażenia, przydatne linki.",
      price: 390,
    },
  ],
  note: "Wynikiem prac jest opracowanie w formacie PDF zawierające zestawienie rekomendacji i listę produktów. Usługa nie obejmuje rysunków wykonawczych ani wizualizacji 3D.",
};

/**
 * Moodboard - druga usługa ryczałtowa obok Szkicu Projektu, ale krótsza,
 * więc nie dostaje własnego panelu: renderuje się do #moodboard jako trzecia
 * notka pod tabelą typów, obok „Łączenia typów" i „Małych pomieszczeń".
 * Ceny za całość, nie za m² - poza PRICING i kalkulatorem.
 */
window.MOODBOARD = {
  title: "Moodboard",
  desc: "Gdy nie wiesz, jakie kolory, materiały i meble do siebie pasują. Zestawienie graficzne inspiracji produktowych dla Twojego wnętrza.",
  packages: [
    { name: "Sam moodboard", price: 290 },
    { name: "Moodboard ze spisem użytych materiałów", price: 390 },
  ],
};

// Wspólne źródło dla kalkulatora
window.PRICING = {
  perType: window.OFFER_TYPES.reduce((acc, t) => ((acc[t.n] = t.price), acc), {}),
  // Etykiety mówią „od", nie „powyżej": app.js liczy `a >= d.min`, więc rabat
  // należy się już przy DOKŁADNIE 100 / 150 / 225 m². Notka pod tabelą typów
  // („już od 100 m²") mówiła to samo, kalkulator przeczył jej o jeden metr.
  discounts: [
    { min: 225, rate: 0.30, label: "od 225 m²" },
    { min: 150, rate: 0.20, label: "od 150 m²" },
    { min: 100, rate: 0.10, label: "od 100 m²" },
  ],
  rushSurcharge: 0.15, // tryb przyspieszony +15%
  minArea: 10, // poniżej -> wycena indywidualna
};
