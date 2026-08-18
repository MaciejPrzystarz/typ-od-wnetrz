/**
 * Treści: proces, czas realizacji, opinie, case studies, FAQ.
 * W Next.js: data/process.ts, data/reviews.ts, data/faq.ts itd.
 */

window.PROCESS_STEPS = [
  { n: "01", title: "Zgłoszenie i rozmowa", desc: "Opisujesz wnętrze, zakres i potrzeby. Rozmawiamy, żeby dobrać właściwy typ projektu." },
  { n: "02", title: "Wybór zakresu", desc: "Dobieramy typ projektu - od samego układu funkcjonalnego po pełny projekt wykonawczy." },
  { n: "03", title: "Umowa, harmonogram i rezerwacja", desc: "Dostajesz umowę, pro-formę i harmonogram. Rezerwacja terminu po wpłacie 20% (30% przy małych projektach)." },
  { n: "04", title: "Ankieta, inspiracje i materiały", desc: "Dedykowana ankieta projektowa i folder na Dysku Google. Wszystkie materiały w jednym miejscu." },
  { n: "05", title: "Układy funkcjonalne", desc: "Przygotowuję 3 szkicowe wersje układu i składam finalną na podstawie Twoich decyzji." },
  { n: "06", title: "Wizualizacje i lista zakupów", desc: "Dostajesz wizualizacje oraz szkicową listę zakupów dopasowaną do budżetu." },
  { n: "07", title: "Poprawki", desc: "W projektach z wizualizacjami masz 2 globalne rundy poprawek." },
  { n: "08", title: "Dokumentacja finalna", desc: "Finalne wizualizacje, rysunki techniczne, widoki ścian, lista zakupów i rady do realizacji." },
];

window.TIMELINE = [
  { label: "Łazienka / jedno pomieszczenie", time: "ok. 1 miesiąc" },
  { label: "Mieszkanie", time: "ok. 1,5–3 miesiąca" },
  { label: "Dom", time: "ok. 2–4 miesiące" },
  { label: "Bardzo duży dom", time: "ok. 3–5 miesięcy" },
];

window.REVIEWS = [
  { quote: "Najbardziej doceniam harmonogram i to, że na każdym etapie wiedziałam, co się dzieje. Zero chaosu, zero zgadywania.", name: "Magda K.", meta: "Mieszkanie 62 m² · Wrocław" },
  { quote: "Lista zakupów z konkretnymi produktami i linkami zaoszczędziła nam tygodnie szukania. Wszystko zmieściło się w budżecie.", name: "Tomek i Ania", meta: "Dom 140 m² · okolice Wrocławia" },
  { quote: "Projekt zdalny, a czułam się prowadzona za rękę. Wizualizacje 1:1 z tym, co wyszło na remoncie.", name: "Karolina P.", meta: "Łazienka + kuchnia · online, Warszawa" },
  { quote: "Bez nadęcia, konkretnie i z charakterem. Dokładnie taki typ współpracy, jakiego szukaliśmy.", name: "Marcin W.", meta: "Salon 34 m² · Kraków" },
];

window.CASE_STUDIES = [
  {
    title: "Małe mieszkanie, które urosło",
    tag: "Mieszkanie · 38 m²",
    slot: "cs-01",
    problem: "Klient miał małe mieszkanie, chaos przestrzenny i brak miejsca do przechowywania.",
    approach: "Założenia: maksimum funkcji bez wrażenia ciasnoty, spójna ciepła paleta, jeden materiał przewodni.",
    solution: "Zaprojektowane strefy funkcjonalne, zabudowa pod sufit i spójne wizualizacje z gotową listą zakupów.",
    result: "Mieszkanie wygląda przestronniej, klient wiedział dokładnie co kupić i podejmował decyzje bez stresu.",
  },
  {
    title: "Dom pod klucz - bez remontowej ruletki",
    tag: "Dom · 140 m²",
    slot: "cs-02",
    problem: "Stan deweloperski, duży metraż i obawa przed rozjeżdżającym się budżetem.",
    approach: "Założenia: pełna dokumentacja wykonawcza, rzuty techniczne i widoki ścian dla ekip.",
    solution: "Typ 8 dla salonu i kuchni, lżejsze zakresy dla sypialni. Komplet rysunków, elektryka i oświetlenie rozrysowane.",
    result: "Ekipy pracowały z gotowej dokumentacji, a klient kontrolował koszty od pierwszego dnia.",
  },
];

window.FAQ = [
  { q: "Czy projektowanie zdalne ma sens?", a: "Tak. Większość projektów może być realizowana zdalnie. Komunikacja odbywa się przez e-mail i Dysk Google, gdzie masz dostęp do materiałów, ankiet, inspiracji i kolejnych etapów projektu." },
  { q: "Ile kosztuje projekt wnętrza?", a: "Cena zależy od metrażu i zakresu. Możesz wybrać od prostego układu funkcjonalnego po pełny projekt z wizualizacjami, listą zakupów, rzutami technicznymi i widokami ścian. Przy większych metrażach obowiązują rabaty." },
  { q: "Czy muszę od razu decydować się na pełny projekt?", a: "Nie. Można zacząć od Szkicu Projektu, czyli konsultacji projektowej. Jeśli zdecydujesz się później na projekt powyżej 10 m², koszt konsultacji może zostać odliczony od ceny projektu." },
  { q: "Co jeśli nie spodobają mi się wizualizacje?", a: "Projekt nie powstaje w ciemno. Najpierw ustalamy układ funkcjonalny, ankietę, inspiracje i kierunek. W projektach z wizualizacjami masz 2 globalne rundy poprawek." },
  { q: "Czy robisz nadzór nad ekipą remontową?", a: "Działam głównie zdalnie, więc nie prowadzę klasycznego nadzoru autorskiego. Możliwe są jednak spotkania na budowie lub inwentaryzacja we Wrocławiu i okolicach." },
  { q: "Czy lista zakupów uwzględnia budżet?", a: "Tak. Projekt powstaje w oparciu o Twój budżet. Lista zakupów zawiera konkretne produkty, dzięki czemu nie musisz samodzielnie szukać wszystkiego od zera." },
  { q: "Czy produkty z wizualizacji są realne do kupienia?", a: "Tak. Produkty poza meblami na wymiar są podlinkowane w liście zakupów." },
];
