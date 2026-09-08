/*
 * Przygotowanie zdjęć portfolio do sieci: images/portfolio -> images/portfolio-web
 *
 * URUCHOMIENIE (z katalogu projektu, JDK 18+):
 *   java tools/GalleryOptimize.java
 * potem ZAWSZE:
 *   java tools/GalleryIndex.java
 *
 * PO CO: oryginały to PNG-i po 2-5 MB sztuka (cały folder ~1,4 GB). Galeria
 * pokazuje na start 12 kadrów w każdej kategorii - na oryginałach byłoby to
 * kilkadziesiąt MB na jedno wejście, a przewinięcie całej podstrony ciągnęłoby
 * gigabajty. Tu robimy z każdego zdjęcia WebP-a o dłuższym boku MAX_EDGE px.
 * Kafel w siatce ma najwyżej ~520 px szerokości, więc 1400 px starcza też na
 * ekrany 2x.
 *
 * DLACZEGO WebP, a nie JPEG (tak było wcześniej): przy tej samej wadze pliku
 * WebP trzyma wyraźnie więcej szczegółu. Pomiar SSIM względem nieskompresowanego
 * wzorca, na trzech kadrach z portfolio:
 *     kitchen/1(1)      JPEG q82 196 kB -> 0,9733   |  WebP q90 196 kB -> 0,9900
 *     bathroom/1(1)     JPEG q82 152 kB -> 0,9810   |  WebP q90 124 kB -> 0,9905
 *     living-room/1(1)  JPEG q82 176 kB -> 0,9829   |  WebP q90 148 kB -> 0,9920
 * Czyli q90 w WebP jest jednocześnie ŁADNIEJSZE i LŻEJSZE od poprzedniego
 * JPEG-a q82. Dlatego QUALITY stoi na 90 - schodzenie niżej oszczędza kilka
 * kilobajtów kosztem jakości, której ta strona ma bronić.
 *
 * DLACZEGO ffmpeg, a nie ImageIO: standardowa Java nie umie zapisać WebP-a
 * (brak enkodera w ImageIO). ffmpeg ma libwebp i przy okazji lepiej skaluje
 * (lanczos zamiast dwuliniowego zmniejszania połówkami).
 *   winget install Gyan.FFmpeg
 * Program szuka ffmpeg w PATH, w zmiennej FFMPEG i w domyślnej lokalizacji winget.
 *
 * Oryginały zostają NIETKNIĘTE - to jest kopia, nie konwersja w miejscu.
 * Program jest wznawialny: pliki, które już mają aktualną kopię, pomija,
 * więc po dorzuceniu kilku zdjęć przelicza tylko nowe. Sprząta też kopie
 * osierocone po poprzednim formacie (.jpg) i po skasowanych oryginałach -
 * inaczej stary, nieużywany już zestaw pojechałby na serwer razem z nowym.
 */

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Stream;

public class GalleryOptimize {

  static final Path SRC = Paths.get("images", "portfolio");
  static final Path DST = Paths.get("images", "portfolio-web");
  static final int MAX_EDGE = 1400;
  static final int QUALITY = 90;

  static final AtomicInteger done = new AtomicInteger();
  static final AtomicInteger skipped = new AtomicInteger();
  static final AtomicInteger failed = new AtomicInteger();
  static final AtomicLong bytesIn = new AtomicLong();
  static final AtomicLong bytesOut = new AtomicLong();

  static String ffmpeg;

  public static void main(String[] args) throws Exception {
    if (!Files.isDirectory(SRC)) {
      System.out.println("Brak folderu " + SRC);
      return;
    }
    ffmpeg = findFfmpeg();
    if (ffmpeg == null) {
      System.out.println("""
          Nie znalazłem ffmpeg-a, a bez niego nie da się zapisać WebP-a.
            winget install Gyan.FFmpeg
          albo wskaż plik ręcznie:  set FFMPEG=C:\\ścieżka\\ffmpeg.exe""");
      return;
    }
    System.out.println("ffmpeg: " + ffmpeg);

    List<Path> files;
    try (Stream<Path> walk = Files.walk(SRC)) {
      files = walk.filter(Files::isRegularFile).filter(GalleryOptimize::isImage).sorted().toList();
    }
    System.out.println("Zdjęć do przerobienia: " + files.size());

    // Ścieżki, które POWINNY istnieć po tym przebiegu - reszta w DST to śmieci.
    Set<Path> expected = ConcurrentHashMap.newKeySet();
    for (Path f : files) expected.add(target(f));

    int threads = Math.max(2, Runtime.getRuntime().availableProcessors() - 1);
    ExecutorService pool = Executors.newFixedThreadPool(threads);
    for (Path f : files) pool.submit(() -> convert(f));
    pool.shutdown();
    pool.awaitTermination(4, TimeUnit.HOURS);

    int removed = cleanup(expected);

    System.out.printf("%nGotowe: %d przerobionych, %d pominiętych (już aktualne)%n",
        done.get(), skipped.get());
    if (failed.get() > 0) System.out.printf("BŁĘDÓW: %d%n", failed.get());
    if (removed > 0) System.out.printf("Usunięto osieroconych kopii: %d%n", removed);
    System.out.printf("Rozmiar: %.1f MB -> %.1f MB%n",
        bytesIn.get() / 1048576.0, bytesOut.get() / 1048576.0);
    System.out.println("Teraz uruchom: java tools/GalleryIndex.java");
  }

  static boolean isImage(Path p) {
    String n = p.getFileName().toString().toLowerCase(Locale.ROOT);
    return n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".webp");
  }

  /** images/portfolio/kitchen/1(2).png -> images/portfolio-web/kitchen/1(2).webp */
  static Path target(Path src) {
    Path rel = SRC.relativize(src);
    String base = rel.getFileName().toString();
    int dot = base.lastIndexOf('.');
    if (dot > 0) base = base.substring(0, dot);
    return DST.resolve(rel).resolveSibling(base + ".webp");
  }

  static void convert(Path src) {
    try {
      Path out = target(src);
      long srcSize = Files.size(src);

      // Kopia jest aktualna, jeśli istnieje i jest młodsza od oryginału.
      if (Files.exists(out)
          && Files.getLastModifiedTime(out).toMillis() >= Files.getLastModifiedTime(src).toMillis()) {
        skipped.incrementAndGet();
        bytesIn.addAndGet(srcSize);
        bytesOut.addAndGet(Files.size(out));
        return;
      }

      Files.createDirectories(out.getParent());
      if (!run(src, out)) {
        failed.incrementAndGet();
        System.out.println("BŁĄD konwersji: " + src);
        return;
      }

      bytesIn.addAndGet(srcSize);
      bytesOut.addAndGet(Files.size(out));
      int n = done.incrementAndGet();
      if (n % 25 == 0) System.out.println("  ... " + n);
    } catch (IOException | InterruptedException e) {
      failed.incrementAndGet();
      System.out.println("BŁĄD: " + src + " - " + e.getMessage());
    }
  }

  /** Dłuższy bok schodzi do MAX_EDGE, krótszy wylicza się sam (-2 = parzysty,
   *  proporcje zachowane). min(...) pilnuje, żeby mniejszych zdjęć NIE rozciągać
   *  w górę - powiększanie tylko rozmyłoby kadr i napompowało plik. */
  static boolean run(Path src, Path out) throws IOException, InterruptedException {
    String scale = "scale=w='if(gte(iw,ih),min(" + MAX_EDGE + ",iw),-2)'"
                 + ":h='if(gte(iw,ih),-2,min(" + MAX_EDGE + ",ih))':flags=lanczos";
    List<String> cmd = List.of(
        ffmpeg, "-y", "-nostdin", "-v", "error",
        "-i", src.toAbsolutePath().toString(),
        "-vf", scale,
        "-c:v", "libwebp",
        "-quality", String.valueOf(QUALITY),
        "-preset", "photo",
        "-compression_level", "6",
        out.toAbsolutePath().toString());

    Process p = new ProcessBuilder(cmd).redirectErrorStream(true).start();
    String err = new String(p.getInputStream().readAllBytes());
    boolean ok = p.waitFor() == 0 && Files.exists(out) && Files.size(out) > 0;
    if (!ok && !err.isBlank()) System.out.println("  ffmpeg: " + err.strip());
    return ok;
  }

  /** Wszystko w DST, czego nie ma na liście oczekiwanych - czyli kopie po
   *  skasowanych oryginałach i stare .jpg z czasów, gdy galeria była w JPEG-u. */
  static int cleanup(Set<Path> expected) throws IOException {
    if (!Files.isDirectory(DST)) return 0;
    List<Path> stale;
    try (Stream<Path> walk = Files.walk(DST)) {
      stale = walk.filter(Files::isRegularFile).filter(p -> !expected.contains(p)).toList();
    }
    int n = 0;
    for (Path p : stale) {
      try {
        Files.delete(p);
        n++;
      } catch (IOException e) {
        System.out.println("Nie udało się usunąć " + p + " - " + e.getMessage());
      }
    }
    return n;
  }

  static String findFfmpeg() {
    String env = System.getenv("FFMPEG");
    if (env != null && Files.isRegularFile(Paths.get(env))) return env;

    if (works("ffmpeg")) return "ffmpeg";

    // winget (Gyan.FFmpeg) rozpakowuje się tutaj, a świeżo po instalacji nie ma
    // go jeszcze w PATH otwartej konsoli.
    Path packages = Paths.get(System.getenv("LOCALAPPDATA") == null ? "" : System.getenv("LOCALAPPDATA"),
        "Microsoft", "WinGet", "Packages");
    if (Files.isDirectory(packages)) {
      try (Stream<Path> walk = Files.walk(packages, 4)) {
        Optional<Path> hit = walk.filter(p -> p.getFileName().toString().equals("ffmpeg.exe")).findFirst();
        if (hit.isPresent()) return hit.get().toString();
      } catch (IOException ignored) {
      }
    }
    return null;
  }

  static boolean works(String exe) {
    try {
      Process p = new ProcessBuilder(exe, "-version").redirectErrorStream(true).start();
      p.getInputStream().readAllBytes();
      return p.waitFor() == 0;
    } catch (IOException | InterruptedException e) {
      return false;
    }
  }
}
