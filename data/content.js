/**
 * Treści: proces, czas realizacji, opinie, case studies, FAQ.
 * W Next.js: data/process.ts, data/reviews.ts, data/faq.ts itd.
 */

window.PROCESS_STEPS = [
  { n: "01", title: "Zgłoszenie i rozmowa", desc: "Opisujesz wnętrze, zakres i potrzeby. Rozmawiamy, żeby dobrać właściwy typ projektu." },
  { n: "02", title: "Wybór zakresu", desc: "Dobieramy typ projektu – od samych układów funkcjonalnych po kompleksowy projekt. Możesz łączyć typy między pomieszczeniami." },
  { n: "03", title: "Umowa, harmonogram i rezerwacja", desc: "Dostajesz umowę, pro-formę i harmonogram. Rezerwacja terminu po wpłacie 20% (30% przy małych projektach)." },
  { n: "04", title: "Ankieta, inspiracje i materiały", desc: "Dedykowana ankieta projektowa i folder na Dysku Google. Wszystkie materiały w jednym miejscu." },
  // „szkicowe" / „szkicową" zamienione na „wstępne" / „wstępną": Szkic Projektu
  // to nazwa osobnej, płatnej usługi (patrz window.SKETCH), więc to samo słowo
  // w opisie etapów projektu mieszało dwie różne rzeczy.
  { n: "05", title: "Układy funkcjonalne", desc: "Przygotowuję 3 wstępne wersje układu funkcjonalnego i składam finalną na podstawie Twoich decyzji." },
  { n: "06", title: "Wizualizacje i lista zakupów", desc: "Dostajesz wizualizacje oraz wstępną listę zakupów dopasowaną do budżetu." },
  { n: "07", title: "Poprawki", desc: "W projektach z wizualizacjami masz 2 rundy poprawek." },
  { n: "08", title: "Dokumentacja finalna", desc: "Finalne wizualizacje, rysunki techniczne, widoki ścian, lista zakupów i rady do realizacji." },
];

window.TIMELINE = [
  { label: "Łazienka / jedno pomieszczenie", time: "ok. 1 miesiąc" },
  { label: "Mieszkanie", time: "ok. 1,5–3 miesiąca" },
  { label: "Dom", time: "ok. 2–4 miesiące" },
  { label: "Bardzo duży dom", time: "ok. 3–5 miesięcy" },
];

/**
 * Opinie klientów - PRAWDZIWE, przysłane mailem. Nic tu nie wymyślamy:
 * jeśli czegoś nie wiemy (miasto, metraż, imię), pole zostaje krótsze.
 * Wiadomość bez podpisu dostaje w `name` „Klientka" / „Klient" / „Klienci"
 * (rodzaj i liczba zgodnie z tym, jak pisze o sobie autor), a rozpoznawalny
 * staje się przez `meta` - zakres projektu.
 *
 * Każda opinia ma dwa pola tekstowe:
 *   `lead`  - zdanie otwierające wiadomość, składane Cormorantem jako fraza
 *             wiodąca. To NIE jest streszczenie ani hasło reklamowe: zawsze
 *             pierwsze zdanie klienta, wycięte z jego tekstu.
 *   `quote` - reszta wiadomości: string albo tablica akapitów (app.js złoży
 *             z nich <p>). `lead` + `quote` czytane po kolei dają całość.
 *
 * Teksty są skrócone tylko o to, co nie jest opinią: powitania, podpisy oraz
 * sprawy prywatne i organizacyjne (przelewy, budżet, ustalenia mailowe).
 * Sformułowania klientów zostają bez zmian - poprawiona jest wyłącznie
 * interpunkcja (przecinki, półpauzy). Pełne oryginały: skrzynka mailowa.
 */
window.REVIEWS = [
  {
    lead: "Współpracę z Mateuszem opisałabym jako bardzo profesjonalną, rzetelną i przyjazną dla klienta.",
    quote: [
      "Mateusz przeprowadził Nas bardzo sprawnie przez cały proces projektowania naszego pierwszego mieszkania. Dzięki jego zaangażowaniu stworzyliśmy projekt przestrzeni funkcjonalnych, a zarazem odpowiadających naszym ulubionym kolorom, akcentom i dekoracjom.",
      "Realizator nie miał żadnych wątpliwości i problemów podczas remontu mieszkania, dzięki skrupulatnym zapisom projektanta, co wpłynęło na znaczące usprawnienie procesu i szybszą przeprowadzkę – na czym nam bardzo zależało.",
      "Gorąco polecam",
    ],
    name: "Michalina G.",
    meta: "Mieszkanie · Wrocław",
  },
  {
    lead: "Bardzo dziękuję, projekt wyszedł świetny i jestem nim zachwycona!",
    quote: [
      "Bardzo dziękuję za wszystkie wskazówki i współpracę. Mam nadzieję, że w przyszłości będziemy wykonywać jeszcze jakiś projekt.",
      "Jeszcze raz bardzo dziękuję i trzymam kciuki za Twoją dalszą karierę! Robisz naprawdę świetną robotę.",
    ],
    name: "Katarzyna R.",
    meta: "Mieszkanie · Warszawa",
  },
  {
    lead: "Panie Mateuszu, dziękujemy za finalną wersję – wszystko zgodnie z ustaleniami.",
    quote: [
      "Dziękujemy bardzo za pomoc i współpracę – naprawdę jesteśmy bardzo zadowoleni z wyboru Pana jako projektanta. Otoczenie dopytuje, kto nam tak fajnie zaprojektował i zwizualizował mieszkanie, więc z miłą chęcią polecamy Pana i współpracę.",
    ],
    name: "Paulina i Sebastian",
    meta: "Strefa dzienna i łazienka · 38 m²",
  },
  {
    // Oryginał to jeden blok tekstu - podzielony na akapity wyłącznie dla
    // czytelności na slajdzie, bez zmiany ani jednego słowa.
    lead: "Współpraca z panem Mateuszem to była czysta przyjemność!",
    quote: [
      "Pan Mateusz jest bardzo sympatycznym człowiekiem, zawsze chętnie i z zaangażowaniem odpowiadał na moje pytania i rozwiewał różne wątpliwości dotyczące projektu. Dostałam też liczne pomysły odnośnie tego, jakie ciekawe rozwiązania można zastosować oraz co zrobić, żeby uzyskać jednocześnie piękną, ale też praktyczną kuchnię.",
      "Wszystkie moje wymagania zostały uwzględnione. Projekt został wykonany idealnie nie tylko dla mnie, ale również dla stolarza, który nie miał żadnego problemu z odczytaniem wszystkich ważnych dla niego informacji. Poprosiłam o kilka wersji kolorystycznych i wszystkie były tak extra, że nie mogłam się zdecydować, którą finalnie wybrać 😅",
      "Jestem pod wrażeniem, naprawdę. Każdemu, kto zdecyduje się na skorzystanie z usług projektanta wnętrz, z ręką na sercu będę polecać pana Mateusza! 😊",
    ],
    name: "Dominika S.",
    meta: "Duża kuchnia",
  },
  {
    lead: "Serdecznie dziękujemy za przewspaniałą współpracę.",
    quote: [
      "Może nie mamy dużego doświadczenia w tym zakresie, ale niezmiernie nam jest miło, że to właśnie Pana spotkaliśmy na nowej wspólnej drodze – szczególnie że jest to pierwsza taka inwestycja i na pewno zostanie na długo z nami.",
      "Współpraca z Panem to czysta przyjemność, zarówno z punktu technicznego, ale przede wszystkim estetyki. Pan ma wyczucie, a kompetencje robią ogromne wrażenie i bardzo to z nami zarezonowało. Cała współpraca układała się z naszego punktu widzenia wręcz książkowo – sprawił Pan, że czuliśmy się w tym bardzo bezpiecznie i niezależnie od efektu wiedzieliśmy, że co by nie było, to będzie to.",
      "Jak tylko będziemy mieli okazję polecić znajomym, to będziemy na pewno podkreślać, że tylko i wyłącznie „Typ od wnętrz” – absolutnie nikt inny 😄",
      "Troska, dbałość o szczegóły – mogłabym wymieniać godzinami… Zagrało od początku i jesteśmy przeszczęśliwi. Dziękujemy za wszystkie wskazówki i towarzyszenie nam w otwieraniu nowego rozdziału w życiu.",
    ],
    name: "Aleksandra i Kamil",
    meta: "Łazienka · Warszawa",
  },
  {
    lead: "Po pierwsze bardzo dziękujemy za Twoją pracę i tak fajną współpracę z nami!",
    quote: [
      "Współpraca z Tobą, Mati, układała nam się bardzo dobrze. Mieliśmy cały czas płynny kontakt, zawsze trzymałeś się ustalonych terminów, uwzględniałeś wszystkie nasze uwagi i dbałeś o to, aby wnętrza wpisywały się w nasze gusta. To dzięki Twoim pomysłom i sugestiom w kwestii układu funkcjonalnego przestrzeń dzienna i kuchnia w naszym domu nabrały formy, która bardzo nam pasuje, świetnie wygląda i super wykorzystuje otwartą przestrzeń na parterze. Jesteśmy naprawdę zadowoleni.",
      "Współpraca z Tobą zaoszczędziła nam mnóstwo czasu, który musielibyśmy poświęcić na wybór m.in. płytek, podłóg, drzwi, armatury, kolorów, dodatków i wiele innych. Nie wspominając już o znacznym ułatwieniu podczas rozmów z wykonawcami. Na pewno zdecydowalibyśmy się na współpracę ponownie.",
    ],
    name: "Katarzyna P.",
    meta: "Dom · Ostrów Wielkopolski",
  },
  {
    lead: "Bardzo dziękujemy za świetną współpracę przy projekcie naszej kuchni.",
    quote: [
      "Jesteśmy naprawdę zadowoleni z efektu końcowego – wszystko wyszło dokładnie tak, jak chcieliśmy (a nawet lepiej!). Doceniamy Pana zaangażowanie, tempo pracy (projekt zakończony aż dwa tygodnie przed planowanym terminem!) i profesjonalne podejście na każdym etapie.",
      "Dziękujemy też za otwartość na nasze uwagi – każda sugestia była brana pod uwagę i uwzględniana w kolejnych wizualizacjach, co dało nam poczucie realnego wpływu na projekt. Do tego Pana własne propozycje i warianty okazały się bardzo trafione i wzbogaciły cały pomysł.",
      "Jeszcze raz wielkie dzięki – z czystym sumieniem możemy polecić Pana każdemu, kto szuka dobrego i rzetelnego projektanta wnętrz! 😊",
    ],
    name: "Dominika T.",
    meta: "Projekt kuchni",
  },
  {
    // Oryginał to jeden blok tekstu - podzielony na akapity wyłącznie dla
    // czytelności na slajdzie.
    lead: "Jesteśmy bardzo zadowoleni z projektu łazienki, która była dosyć problematyczna.",
    quote: [
      "Mały metraż powodował, że nie potrafiliśmy samodzielnie ugryźć tematu, gdzie zmieścić wszystko, co chcieliśmy w tym pomieszczeniu mieć. Mateusz znalazł rozwiązania na WSZYSTKO, dosłownie wszystko. Projekt został zakończony kilkanaście dni przed planowanym terminem, byliśmy w stałym kontakcie. Jeśli coś nie wpasowało się w nasze gusta, mieliśmy do wyboru kilka alternatywnych rozwiązań czy modeli danego produktu.",
      "Na sam koniec otrzymaliśmy informację od naszego podwykonawcy, że może wejść z pracami w ciągu kilku dni, a my nie mieliśmy na tamten moment skończonego projektu. Mateusz stanął na rzęsach, podjął rękawicę i udało nam się zrealizować ostatnie poprawki w ciągu kilku godzin.",
      "Jesteśmy bardzo wdzięczni za piękny projekt, który przerósł nasze oczekiwania i już nie możemy się doczekać, aż zobaczymy naszą wymarzoną łazienkę po zakończeniu prac remontowych. Polecamy i polecać będziemy!",
    ],
    name: "Maja W.",
    meta: "Łazienka · 5 m²",
  },
  {
    lead: "Już oficjalnie po zakończeniu całej przygody z projektem – chcielibyśmy bardzo podziękować Ci za sprawną współpracę i zaangażowanie.",
    quote: [
      "Dbałość o detale, umiejętność łączenia funkcjonalności z estetyką i profesjonalizm sprawiły, że pracowanie z Tobą nad tym projektem było wyjątkowo łatwe i przyjemne. Jesteśmy pewni, że dzięki temu z łatwością przejdziemy przez każdy etap remontu mieszkania. Dziękujemy za otwartość na nasze potrzeby i styl życia, nie możemy się już doczekać przebywania w tych wnętrzach.",
    ],
    name: "Joanna Z.",
    meta: "Mieszkanie · 48 m²",
  },
  {
    lead: "Bardzo się cieszymy, że udało się zakończyć projekt szybciej.",
    quote: [
      "Jeśli chodzi o sam projekt, to możemy powiedzieć, że jesteśmy zachwyceni współpracą oraz efektem końcowym – wyszło dokładnie tak, jak sobie wymarzyliśmy, a nawet lepiej. Projekt jest piękny, spójny, funkcjonalny i w 100% w naszym stylu. Nie możemy się doczekać prac wykończeniowych.",
      "Bardzo doceniamy Pana zaangażowanie, profesjonalizm, terminowość oraz świetny kontakt na każdym etapie współpracy. Czuliśmy się zaopiekowani i spokojni o efekt, a jednocześnie mieliśmy poczucie, że nasza wizja jest w pełni rozumiana i realizowana. Sporo rzeczy nam Pan również podpowiedział, za co także bardzo dziękujemy.",
      "Z całego serca polecamy współpracę z Panem każdemu, kto jest na etapie projektowania wnętrz!",
    ],
    name: "Magdalena S.",
    meta: "Dom · 113,82 m²",
  },
  {
    // Oryginał to list z powitaniem i podpisem - zostały tu tylko akapity
    // właściwej wiadomości. Ta sama klientka podpisuje case study „Łazienka
    // pod skosami" (patrz `reviewFrom` w window.CASE_STUDIES).
    lead: "Pięknie dziękuję za tak wspaniały i niebanalny projekt.",
    quote: [
      "Mimo dużego wyzwania sprostał Pan mu w 101%! 😊 Projekt został przygotowany bardzo profesjonalnie, a wszystkie nasze sugestie i pomysły zostały uwzględnione.",
      "Mimo kilku wprowadzanych zmian, ostatecznie zdecydowaliśmy się na pierwszą przesłaną wizualizację, która od początku okazała się najlepiej dopasowana do naszych potrzeb. To tylko potwierdza Pana trafność zaproponowanej koncepcji oraz duże wyczucie estetyki i funkcjonalności.",
      "Jeszcze raz dziękujemy. Już czekam na projekty kolejnych pomieszczeń! ✨",
    ],
    name: "Karina",
    meta: "Łazienka pod skosami",
  },
];

/**
 * Case studies - dwie realizacje opisane w układzie problem / założenia /
 * rozwiązanie / efekt. Kolejność w tablicy = kolejność na stronie:
 * najpierw łazienka, pod nią kuchnia.
 *
 * ZDJĘCIA - `shots`. Lista kadrów „przed / po", w kolejności, w jakiej mają
 * się przewijać. Każdy wpis to `{ label, src, alt }`, gdzie `label` to podpis
 * na plakietce („Przed" / „Po"). Trzymaj je PARAMI i w tym samym ujęciu:
 * karuzela robi przenikanie w miejscu, więc zdjęcie sprzed remontu i render
 * z tego samego punktu zmieniają się jedno w drugie - to cały efekt.
 * Karuzela sama przechodzi do następnego kadru co 4 s (zatrzymuje się pod
 * kursorem, przy fokusie i poza ekranem), a strzałki, kropki i swipe pozwalają
 * przewijać ręcznie. Bez `shots` karta jest jednokolumnowa i czysto tekstowa
 * (`.cs__item.is-textonly` w styles.css) - nie zostaje po niej żadna dziura.
 * Pojedynczy, nieruchomy kadr nadal da się wstawić starym polem `img` + `alt`.
 * Pliki: kopie .webp z images/case-studies/ (PNG-i obok są .gitignore'owane,
 * patrz .gitignore) - konwersja tym samym poleceniem co galeria:
 *     ffmpeg -i przed.png -c:v libwebp -quality 90 -preset photo \
 *            -compression_level 6 przed.webp
 *
 * OPINIA - `reviewFrom`. Imię z window.REVIEWS. app.js wyszukuje po polu
 * `name` i dokleja tę wiadomość pod opisem realizacji, w tej samej formie co
 * w sekcji opinii. Treść żyje w JEDNYM miejscu (w REVIEWS), więc poprawka
 * cytatu nie musi być robiona dwa razy. Nazwisko, którego nie ma na liście,
 * po prostu nic nie doda - karta wyrenderuje się bez cytatu.
 */
window.CASE_STUDIES = [
  {
    title: "Łazienka pod skosami",
    tag: "Łazienka",
    shots: [
      { label: "Przed", src: "images/case-studies/bathroom-before01.webp", alt: "Poddasze przed remontem: surowe ściany, odsłonięta belka i głębokie skosy w miejscu przyszłej strefy kąpielowej" },
      { label: "Po", src: "images/case-studies/bathroom-after01.webp", alt: "To samo ujęcie po projekcie: wanna wolnostojąca, prysznic walk-in i ściana z luksferów pod skosem" },
      { label: "Przed", src: "images/case-studies/bathroom-before02.webp", alt: "Poddasze przed remontem: stelaż podtynkowy WC i surowy słup w miejscu przyszłej strefy wejściowej" },
      { label: "Po", src: "images/case-studies/bathroom-after02.webp", alt: "To samo ujęcie po projekcie: dwie umywalki nablatowe, podświetlane lustra o falistym kształcie i ciemne drewno przy WC" },
    ],
    reviewFrom: "Karina",
    problem: "Niska łazienka z ogromnymi skosami, które przekreślały pomysł na wnętrze mieszczące wszystkie funkcje naraz.",
    approach: "Ukrycie skosów optycznie, spójna kolorystyka i wyznaczenie dwóch stref: wejściowej z umywalką i WC oraz kąpielowej z wanną, prysznicem i pionem do przechowywania.",
    solution: "Łazienkę powiększyliśmy optycznie płytkami o wertykalnym podziale, a skosy ukryliśmy, zachowując je w kolorze sufitu. Luksfery wydzieliły dwie części pomieszczenia. Znalazło się miejsce na wannę wolnostojącą i prysznic typu walk-in.",
    result: "Skosy nie rzucają się już w oczy, a uwagę przykuwają właściwe elementy. Dzięki strefowaniu wnętrze spełnia wymagania ergonomii – jest zgodne z codziennym funkcjonowaniem klientki.",
  },
  {
    title: "Kuchnia po poprzedniej właścicielce",
    tag: "Kuchnia",
    shots: [
      { label: "Przed", src: "images/case-studies/kitchen-before01.webp", alt: "Kuchnia przed zmianą: białe fronty w połysku, czarny blat i zabudowa kończąca się w połowie ściany" },
      { label: "Po", src: "images/case-studies/kitchen-after01.webp", alt: "To samo ujęcie po projekcie: orzechowe fronty, jasny blat, otwarte półki i zabudowa do sufitu z gzymsem" },
      { label: "Przed", src: "images/case-studies/kitchen-before02.webp", alt: "Kuchnia przed zmianą: narożnik z połyskliwą zabudową, okapem kominowym i sprzętami na blacie" },
      { label: "Po", src: "images/case-studies/kitchen-after02.webp", alt: "Ten sam narożnik po projekcie: kaszmirowa zabudowa do sufitu, drewniane półki i światło ukryte pod szafkami" },
    ],
    reviewFrom: "Dominika S.",
    problem: "Klientka planowała remont po poprzedniej właścicielce. Kuchnia nie pasowała stylistycznie, wydawała się zagracona i nieuporządkowana, a fronty w połysku sprawiały kłopoty w utrzymaniu czystości.",
    approach: "Zabudowa do sufitu i lekkie półki, stylizacja pomieszczenia oraz przejście na połączenie drewna i kaszmiru.",
    solution: "Zaprojektowanie zabudowy na nowo, wprowadzenie nowych materiałów, ukrycie instalacji maskownicą i dodanie gzymsów.",
    result: "Kuchnia wygląda lekko, jest dopasowana do stylu życia klientki, a materiały są trwałe i posłużą przez długie lata.",
  },
];

window.FAQ = [
  { q: "Czy projektowanie zdalne ma sens?", a: "Tak. Większość projektów może być realizowana zdalnie. Komunikacja odbywa się przez e-mail i Dysk Google, gdzie masz dostęp do materiałów, ankiet, inspiracji i kolejnych etapów projektu." },
  { q: "Ile kosztuje projekt wnętrza?", a: "Cena zależy od metrażu i zakresu. Możesz wybrać od samych układów funkcjonalnych po pełny projekt z wizualizacjami, listą zakupów, rzutami technicznymi i widokami ścian. Przy większych metrażach obowiązują rabaty." },
  { q: "Czy muszę od razu decydować się na pełny projekt?", a: "Nie. Można zacząć od Szkicu Projektu w formie online. Jeśli zdecydujesz się później na projekt powyżej 10 m², koszt Szkicu Projektu zostanie odliczony od ceny projektu." },
  { q: "Co jeśli nie spodobają mi się wizualizacje?", a: "Projekt nie powstaje w ciemno. Najpierw ustalamy układ funkcjonalny, ankietę, inspiracje i kierunek. W projektach z wizualizacjami masz 2 rundy poprawek." },
  { q: "Czy robisz nadzór nad ekipą remontową?", a: "Działam głównie zdalnie, więc nie prowadzę klasycznego nadzoru autorskiego. Możliwe są jednak spotkania na budowie lub inwentaryzacja we Wrocławiu i okolicach." },
  { q: "Czy lista zakupów uwzględnia budżet?", a: "Tak. Projekt powstaje w oparciu o Twój budżet. Lista zakupów zawiera konkretne produkty, dzięki czemu nie musisz samodzielnie szukać wszystkiego od zera." },
  { q: "Czy produkty z wizualizacji są realne do kupienia?", a: "Tak. Produkty poza meblami na wymiar są podlinkowane w liście zakupów." },
];
