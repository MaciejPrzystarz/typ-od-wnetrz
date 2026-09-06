# images/pdf/

Przykładowe składowe projektu pokazywane na `przykladowy-projekt.html`.

Jak dodać plik:

1. Wrzuć PDF (albo JPG/PNG) tutaj. Nazwa bez polskich znaków i spacji,
   np. `rzuty-techniczne.pdf` - inaczej adres pliku zamienia się w
   `%C5%81%C4%84...` i bywa problemem na serwerze.
2. Dopisz pozycję w `data/samples.js` (`title`, `file`, `scope`, `note`).
3. Podbij wersję `data/samples.js?v=…` w `index.html` i `przykladowy-projekt.html`.

Te pliki są publiczne - leżą na serwerze pod własnym adresem i każdy, kto zna
link, może je pobrać. Nie wrzucaj tu dokumentacji z nazwiskiem klienta, adresem
inwestycji, telefonem ani danymi wykonawców.

Podgląd renderuje PDF.js (canvas), obrazki idą jako zwykły `<img>` - niczego
nie trzeba konwertować.
