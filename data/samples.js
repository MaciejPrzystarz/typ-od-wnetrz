/**
 * Przykładowe składowe projektu - PDF-y pokazywane na podstronie
 * przykladowy-projekt.html.
 *
 * Dodanie nowego pliku = wrzucenie PDF-a (albo JPG/PNG) do `images/pdf/`
 * i dopisanie tu jednej pozycji. Nic więcej: podstrona sama go wyrenderuje,
 * a na stronie głównej sam pokaże się przycisk przy Szkicu Projektu (app.js
 * sprawdza, czy ta lista jest niepusta - dopóki jest pusta, linku nie ma).
 *
 * Pola:
 *   title    - nagłówek nad podglądem, nazwa składowej („Rzuty techniczne").
 *   file     - ścieżka do pliku względem katalogu strony.
 *   note     - jedno zdanie: co to jest i po co klientowi. Opcjonalne.
 *   scope    - do którego zakresu należy ta składowa („Typ 8", „Od Typu 5").
 *              Opcjonalne, ale warto: klient od razu wie, co dostanie.
 *   maxPages - ile stron pokazać w podglądzie (domyślnie 3). Reszta zostaje
 *              w pliku, pod podglądem pojawia się odnośnik do całości.
 *
 * UWAGA: te pliki są publiczne. Zanim tu trafią, muszą być pozbawione
 * nazwisk, adresów inwestycji, telefonów i cen.
 *
 * W Next.js: data/samples.ts.
 */
/**
 * Harmonogram - przykład z prawdziwego projektu, złożony na podstronie jako
 * tekst (nie obrazek): da się go zaznaczyć, przeczytać czytnikiem ekranu
 * i widzi go Google.
 *
 * `who` mówi, po czyjej stronie jest dany krok - „Ja" to projektant, „Ty"
 * klient. To sedno tej tabeli: widać, że terminy wiążą obie strony.
 * `pay` oznacza etapy z płatnością (bez kwot - te zależą od wyceny).
 */
window.SCHEDULE_SAMPLE = {
  note: "Daty z projektu mieszkania rozpoczętego w styczniu 2026. Każdy projekt dostaje własny harmonogram przy podpisaniu umowy – ten jest po to, żebyś wiedział, jak gęsto rozłożone są terminy i co jest po Twojej stronie.",
  legend: { Ja: "przygotowuję i wysyłam materiały", Ty: "Twoja decyzja, uwagi albo wpłata" },
  rows: [
    { date: "09.01.26", day: "piątek", who: "Ty", text: "Wpłata zadatku", pay: "I" },
    { date: "14.01.26", day: "środa", who: "Ty", text: "Wypełnienie ankiety i wstawienie inspiracji (przy podpisaniu umowy do 10 stycznia)" },
    { date: "21.01.26", day: "środa", who: "Ja", text: "Trzy wstępne propozycje układu funkcjonalnego" },
    { date: "25.01.26", day: "niedziela", who: "Ty", text: "Odpowiedź nt. propozycji trzech układów" },
    { date: "28.01.26", day: "środa", who: "Ja", text: "Finalna wersja układu funkcjonalnego", pay: "II" },
    { date: "19.02.26", day: "czwartek", who: "Ja", text: "Pierwsze wizualizacje i lista zakupów", pay: "III" },
    { date: "22.02.26", day: "niedziela", who: "Ty", text: "Uwagi do wizualizacji" },
    { date: "24.02.26", day: "wtorek", who: "Ja", text: "I poprawki wizualizacji" },
    { date: "27.02.26", day: "piątek", who: "Ty", text: "Uwagi do I etapu poprawek" },
    { date: "02.03.26", day: "poniedziałek", who: "Ja", text: "II poprawki wizualizacji, wybór aranżacji na finalne widoki" },
    { date: "17.03.26", day: "poniedziałek", who: "Ja", text: "Sfinalizowany projekt oraz rysunki techniczne", pay: "IV" },
  ],
};

window.SAMPLES = [
  {
    title: "Układy funkcjonalne – warianty",
    scope: "Od Typu 1",
    file: "images/pdf/rzuty-funkcjonalne-wstepne.pdf",
    note: "Trzy propozycje rozplanowania na rzucie po inwentaryzacji. Na tym etapie wybierasz kierunek, zanim cokolwiek pójdzie do wizualizacji.",
  },
  {
    title: "Układ funkcjonalny – wersja finalna",
    scope: "Od Typu 1",
    file: "images/pdf/rzut-funkcjonalny-wybrany.pdf",
    note: "Wybrany układ doprecyzowany pomieszczenie po pomieszczeniu, z opisem każdego mebla i sprzętu.",
  },
  {
    title: "Widoki ścian – kuchnia",
    scope: "Od Typu 6",
    file: "images/pdf/widoki-scian-kuchnia.pdf",
    note: "Rysunek dla stolarza: wymiary zabudowy, wysokości blend, cokołów i listew, oznaczone materiały i sposób otwierania frontów.",
  },
  {
    title: "Widoki ścian – łazienka",
    scope: "Od Typu 6",
    file: "images/pdf/widoki-scian-lazienka.pdf",
    note: "Rozrysowanie ścian z rozmieszczeniem płytek, armatury i zabudowy.",
  },
  {
    title: "Widoki ścian – sypialnia",
    scope: "Od Typu 6",
    file: "images/pdf/widoki-scian-sypialnia.pdf",
    note: "Ten sam poziom szczegółu w części sypialnej – zabudowa, oświetlenie i wykończenie ścian.",
  },
  {
    title: "Meble na wymiar",
    scope: "Typ 8",
    file: "images/pdf/meble-na-wymiar.pdf",
    note: "Zabudowa rozrysowana do wykonania, z uwagami dla stolarza – gdzie i dlaczego wymiar może wymagać korekty na miejscu.",
  },
  {
    title: "Rzut elektryki",
    scope: "Od Typu 5",
    file: "images/pdf/elektryka.pdf",
    note: "Gniazda, łączniki i punkty zasilania z legendą – ekipa nie musi zgadywać, gdzie kuć.",
  },
  {
    title: "Rzut hydrauliki",
    scope: "Od Typu 5",
    file: "images/pdf/hydraulika.pdf",
    note: "Punkty wodno-kanalizacyjne i grzejniki naniesione na rzut.",
  },
  {
    title: "Rzut oświetlenia",
    scope: "Od Typu 5",
    file: "images/pdf/oswietlenie.pdf",
    note: "Oświetlenie górne, kinkiety i listwy LED razem z obsługą łączników.",
  },
  /* WYŁĄCZONE PRZED PUBLIKACJĄ - NAZWISKO KLIENTA W PLIKU.
     `lista-zakupow.pdf` ma w metadanych tytuł dokumentu:
         „K. PASZKIEWICZ IDE I P. IDE LISTA ZAKUPÓW"
     Widać go w karcie przeglądarki po otwarciu pliku, a Google używa pola
     Title PDF-a jako tytułu wyniku wyszukiwania. Pozostałe dziewięć plików
     ma czysty tytuł „Model" - ten jeden nie.

     ŻEBY PRZYWRÓCIĆ (w tej kolejności):
       1. Otwórz plik i przejrzyj WSZYSTKIE 8 stron - skoro nazwisko jest
          w tytule projektu, prawdopodobnie stoi też w nagłówku arkusza.
       2. Wyczyść metadane, np. `qpdf --empty --pages plik.pdf 1-z -- czysty.pdf`
          (winget install QPDF.QPDF) albo wyeksportuj arkusz na nowo bez nazwy
          projektu w tytule dokumentu.
       3. Sprawdź: getMetadata().info.Title ma być puste albo neutralne.
       4. Odkomentuj tę pozycję.

  {
    title: "Lista zakupów",
    scope: "Od Typu 3",
    file: "images/pdf/lista-zakupow.pdf",
    note: "Konkretne produkty z linkami, ilościami i cenami – osiem stron, od podłogi po dodatki. Ceny są z dnia przygotowania projektu i służą jako punkt odniesienia.",
    maxPages: 3,
  },
  */
];
