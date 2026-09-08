/*
 * Generator data/gallery.js - spis zdjęć podstrony portfolio.
 *
 * URUCHOMIENIE (z katalogu projektu, JDK 18+ / single-file source launch):
 *   java tools/GalleryIndex.java
 *
 * PO CO TO JEST: zdjęć jest kilkaset. Gdyby przeglądarka miała sama odkryć
 * proporcje każdego kadru (tak robiła stara galeria: new Image() na każdy
 * plik), pobrałaby WSZYSTKIE pliki tylko po to, żeby je zmierzyć - przy
 * plikach po kilka MB to setki megabajtów transferu na jedno wejście.
 * Dlatego wymiary czytamy tutaj, raz, z nagłówków plików i zapisujemy do
 * danych. Strona zna wtedy kształt kadru zanim cokolwiek pobierze: nie
 * skacze układ (CSS aspect-ratio) i działa loading="lazy".
 *
 * KIEDY URUCHAMIAĆ PONOWNIE: po każdym dorzuceniu / usunięciu zdjęć
 * w images/portfolio/**. Plik data/gallery.js jest generowany - nie edytuj
 * go ręcznie, bo najbliższe uruchomienie tego programu go nadpisze.
 *
 * KOLEJNOŚĆ ZDJĘĆ (to nie jest zwykłe sortowanie po nazwie):
 * nazwy plików mają postać N.png / N(1).png / N(2).png / NA.png - to jeden
 * pokój sfotografowany z kilku stron. Podstrona pokazuje na start 12 kadrów,
 * więc najpierw idą OKŁADKI (po jednym ujęciu z każdego pokoju), a dopiero
 * potem pozostałe ujęcia, pogrupowane przy swoich pokojach. Dzięki temu
 * pierwsze 12 kafli to 12 różnych wnętrz, a nie cztery wnętrza z trzech stron.
 */

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

public class GalleryIndex {

  /** Folder na dysku -> nazwa kategorii na stronie, kotwica w adresie i fraza
   *  do atrybutu alt (w dopełniaczu, bo doklejamy do niej numer kadru).
   *  Kolejność wpisów = kolejność sekcji na podstronie portfolio.
   *  Etykiety muszą się zgadzać z window.PROJECT_CATEGORIES (data/projects.js)
   *  i z prozą, która wylicza rodzaje wnętrz (lead podstrony, opisy meta/OG,
   *  knowsAbout w JSON-LD strony głównej). */
  static final String[][] ROOMS = {
      {"kitchen",       "Kuchnie",             "kuchnie",          "Projekt kuchni"},
      {"bathroom",      "Łazienki",            "lazienki",         "Projekt łazienki"},
      {"living-room",   "Salony",              "salony",           "Projekt salonu"},
      {"bedroom",       "Sypialnie",           "sypialnie",        "Projekt sypialni"},
      {"children-room", "Pokoje dziecięce",    "pokoje-dzieciece", "Projekt pokoju dziecięcego"},
      {"home-office",   "Gabinety",            "gabinety",         "Projekt gabinetu"},
      {"communication", "Komunikacja / Hole",  "komunikacja",      "Projekt holu"},
  };

  /** Zdjęcia bierzemy z kopii webowych (java tools/GalleryOptimize.java), a na
   *  oryginały spadamy tylko wtedy, gdy kopii jeszcze nie ma. Oryginalne PNG-i
   *  mają po kilka MB - galeria na nich byłaby nie do przewinięcia. */
  static final Path WEB = Paths.get("images", "portfolio-web");
  static final Path RAW = Paths.get("images", "portfolio");
  static final Path SRC = Files.isDirectory(WEB) ? WEB : RAW;
  static final Path OUT = Paths.get("data", "gallery.js");

  /** N.png (okładka pokoju), N(3).png (kolejne ujęcie), N A.png / N a.png (wariant). */
  static final Pattern COVER  = Pattern.compile("^(\\d+)$");
  static final Pattern SHOT   = Pattern.compile("^(\\d+)\\((\\d+)\\)$");
  static final Pattern LETTER = Pattern.compile("^(\\d+)([A-Za-z]+)$");

  record Photo(String file, int w, int h, int group, int variant, String named) {}

  public static void main(String[] args) throws Exception {
    StringBuilder js = new StringBuilder();
    js.append("""
        /**
         * PLIK GENEROWANY - nie edytuj ręcznie.
         * Tworzy go `java tools/GalleryIndex.java` (uruchom po dorzuceniu zdjęć
         * do images/portfolio/**). Opis formatu i kolejności - w tym programie.
         *
         * window.GALLERY: sekcje podstrony portfolio, po jednej na rodzaj wnętrza.
         *   key    - nazwa folderu w images/portfolio/
         *   cat    - etykieta kategorii (ta sama, co w filtrze i w PROJECT_CATEGORIES)
         *   slug   - kotwica sekcji: portfolio.html#slug
         *   dir    - katalog zdjęć
         *   covers - ile pierwszych zdjęć to osobne pokoje (reszta to kolejne
         *            ujęcia tych samych wnętrz)
         *   photos - [{ f: nazwa pliku, w, h }] - wymiary z nagłówków plików,
         *            żeby przeglądarka znała proporcje kadru przed pobraniem
         *
         * W Next.js: data/gallery.ts (generowane w kroku build).
         */
        window.GALLERY = [
        """);

    int total = 0, portrait = 0, landscape = 0;
    for (String[] room : ROOMS) {
      Path dir = SRC.resolve(room[0]);
      if (!Files.isDirectory(dir)) {
        System.out.println("POMIJAM (brak folderu): " + dir);
        continue;
      }
      List<Photo> photos = read(dir);
      List<Photo> ordered = order(photos);
      long covers = photos.stream().filter(p -> p.variant() == 0).count();

      total += ordered.size();
      for (Photo p : ordered) {
        if (p.h() > p.w()) portrait++; else landscape++;
      }

      js.append("  {\n")
        .append("    key: \"").append(room[0]).append("\",\n")
        .append("    cat: \"").append(room[1]).append("\",\n")
        .append("    slug: \"").append(room[2]).append("\",\n")
        .append("    alt: \"").append(room[3]).append("\",\n")
        .append("    dir: \"").append(SRC.toString().replace('\\', '/')).append("/").append(room[0]).append("\",\n")
        .append("    covers: ").append(covers).append(",\n")
        .append("    photos: [\n");
      for (Photo p : ordered) {
        js.append("      { f: \"").append(p.file().replace("\\", "\\\\").replace("\"", "\\\""))
          .append("\", w: ").append(p.w()).append(", h: ").append(p.h()).append(" },\n");
      }
      js.append("    ],\n  },\n");

      System.out.printf("%-14s %s: %d zdjęć (%d pokoi)%n", room[0], room[1], ordered.size(), covers);
    }
    js.append("];\n");

    Files.createDirectories(OUT.getParent());
    Files.writeString(OUT, js.toString(), StandardCharsets.UTF_8);
    System.out.printf("%nRAZEM %d zdjęć (pionowych %d, poziomych %d) -> %s%n",
        total, portrait, landscape, OUT);
  }

  /** Wymiary czytamy z nagłówka pliku - bez dekodowania pikseli, inaczej
   *  400 plików po kilka MB mieliłoby się minutami. */
  static List<Photo> read(Path dir) throws IOException {
    try (Stream<Path> files = Files.list(dir)) {
      return files
          .filter(Files::isRegularFile)
          .filter(p -> {
            String n = p.getFileName().toString().toLowerCase(Locale.ROOT);
            return n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".webp");
          })
          .map(GalleryIndex::measure)
          .filter(Objects::nonNull)
          .toList();
    }
  }

  static Photo measure(Path p) {
    String file = p.getFileName().toString();
    String base = file.contains(".") ? file.substring(0, file.lastIndexOf('.')) : file;

    int group, variant;
    String named = null;
    Matcher m;
    if ((m = COVER.matcher(base)).matches()) {
      group = Integer.parseInt(m.group(1));
      variant = 0;
    } else if ((m = SHOT.matcher(base)).matches()) {
      group = Integer.parseInt(m.group(1));
      variant = Integer.parseInt(m.group(2));
    } else if ((m = LETTER.matcher(base)).matches()) {
      group = Integer.parseInt(m.group(1));
      variant = 900 + Character.toLowerCase(m.group(2).charAt(0)) - 'a';
    } else {
      // Nazwa własna (Łaz_3.jpeg, Pok_p.Kasi_2.png, IMG_4081.JPG) - nie wiadomo,
      // które z nich są tym samym wnętrzem, więc każda jest osobnym pokojem
      // (osobną okładką). Idą po numerowanych, alfabetycznie.
      group = Integer.MAX_VALUE;
      variant = 0;
      named = base;
    }

    // WebP: standardowe ImageIO go nie czyta (brak wtyczki w JDK), więc wymiary
    // bierzemy wprost z nagłówka RIFF. Patrz webpSize().
    if (file.toLowerCase(Locale.ROOT).endsWith(".webp")) {
      try {
        int[] wh = webpSize(p);
        if (wh == null) {
          System.out.println("POMIJAM (uszkodzony WebP): " + p);
          return null;
        }
        return new Photo(file, wh[0], wh[1], group, variant, named);
      } catch (IOException e) {
        System.out.println("POMIJAM (nie da się odczytać): " + p + " - " + e.getMessage());
        return null;
      }
    }

    try (ImageInputStream in = ImageIO.createImageInputStream(p.toFile())) {
      if (in == null) return null;
      Iterator<ImageReader> readers = ImageIO.getImageReaders(in);
      if (!readers.hasNext()) {
        System.out.println("POMIJAM (nieznany format): " + p);
        return null;
      }
      ImageReader r = readers.next();
      try {
        r.setInput(in);
        return new Photo(file, r.getWidth(0), r.getHeight(0), group, variant, named);
      } finally {
        r.dispose();
      }
    } catch (IOException e) {
      System.out.println("POMIJAM (nie da się odczytać): " + p + " - " + e.getMessage());
      return null;
    } catch (UncheckedIOException e) {
      return null;
    }
  }

  /** Wymiary WebP-a prosto z nagłówka RIFF - w JDK nie ma czytnika tego formatu,
   *  a dociąganie biblioteki dla dwóch liczb byłoby przesadą. Plik zaczyna się
   *  od "RIFF" (4 B), rozmiaru (4 B) i "WEBP" (4 B), a od bajtu 12 stoi nazwa
   *  bloku, która mówi, w którym wariancie zapisano obraz:
   *    "VP8 " - stratny: szerokość i wysokość po 14 bitów, od bajtu 26,
   *    "VP8L" - bezstratny: 14-bitowe (wymiar - 1), upakowane od bajtu 21,
   *    "VP8X" - rozszerzony (np. z alfą): 24-bitowe (wymiar - 1) od bajtu 24.
   *  Zwraca {szerokość, wysokość} albo null, jeśli to nie jest WebP. */
  static int[] webpSize(Path p) throws IOException {
    byte[] h = new byte[30];
    try (var in = Files.newInputStream(p)) {
      if (in.readNBytes(h, 0, h.length) < 30) return null;
    }
    if (!"RIFF".equals(new String(h, 0, 4, StandardCharsets.US_ASCII))
        || !"WEBP".equals(new String(h, 8, 4, StandardCharsets.US_ASCII))) {
      return null;
    }
    String chunk = new String(h, 12, 4, StandardCharsets.US_ASCII);
    switch (chunk) {
      case "VP8 " -> {
        // Po nagłówku bloku idzie 3-bajtowy znacznik klatki i sygnatura 9D 01 2A.
        if ((h[23] & 0xFF) != 0x9D || (h[24] & 0xFF) != 0x01 || (h[25] & 0xFF) != 0x2A) return null;
        int w = ((h[26] & 0xFF) | ((h[27] & 0xFF) << 8)) & 0x3FFF;
        int hh = ((h[28] & 0xFF) | ((h[29] & 0xFF) << 8)) & 0x3FFF;
        return new int[] {w, hh};
      }
      case "VP8L" -> {
        if ((h[20] & 0xFF) != 0x2F) return null;
        int bits = (h[21] & 0xFF) | ((h[22] & 0xFF) << 8) | ((h[23] & 0xFF) << 16) | ((h[24] & 0xFF) << 24);
        return new int[] {(bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1};
      }
      case "VP8X" -> {
        int w = ((h[24] & 0xFF) | ((h[25] & 0xFF) << 8) | ((h[26] & 0xFF) << 16)) + 1;
        int hh = ((h[27] & 0xFF) | ((h[28] & 0xFF) << 8) | ((h[29] & 0xFF) << 16)) + 1;
        return new int[] {w, hh};
      }
      default -> {
        return null;
      }
    }
  }

  /** Najpierw okładki (po jednym ujęciu z pokoju), potem reszta ujęć przy
   *  swoich pokojach. Patrz komentarz na górze pliku. */
  static List<Photo> order(List<Photo> photos) {
    Comparator<Photo> byRoom = Comparator
        .comparingInt(Photo::group)
        .thenComparing(p -> p.named() == null ? "" : p.named())
        .thenComparingInt(Photo::variant);

    List<Photo> covers = photos.stream().filter(p -> p.variant() == 0).sorted(byRoom).toList();
    List<Photo> rest = photos.stream().filter(p -> p.variant() != 0).sorted(byRoom).toList();

    List<Photo> out = new ArrayList<>(photos.size());
    out.addAll(covers);
    out.addAll(rest);
    return out;
  }
}
