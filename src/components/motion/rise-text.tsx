/**
 * Entrance judul halaman (taste-skill motion.md, "The hero's entrance"): kata
 * demi kata naik dari balik mask-nya, 700ms tiap kata, berselang 40ms, sekali
 * saat halaman dibuka. Murni CSS (komponen server) sehingga judul — sering
 * elemen LCP — tampil tanpa menunggu hydration. Reduced motion: hanya fade.
 *
 * `delay` (detik) menggeser awal entrance; `step` jarak antar kata.
 */
export function RiseText({
  text,
  delay = 0.05,
  step = 0.04,
}: {
  text: string;
  delay?: number;
  step?: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="motion-reduce:animate-fade-in">
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            {/* Padding bawah agar ekor huruf (g, y, p) tidak terpotong mask. */}
            <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
              <span
                className="inline-block motion-safe:animate-word-up"
                style={{ animationDelay: `${(delay + i * step).toFixed(2)}s` }}
              >
                {word}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </>
  );
}

/** Total durasi entrance (detik), untuk menyusulkan elemen sesudah judul. */
export function riseEnd(text: string, delay = 0.05, step = 0.04) {
  const n = text.split(/\s+/).filter(Boolean).length;
  return delay + Math.max(0, n - 1) * step + 0.35;
}
