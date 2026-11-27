/**
 * Nama di hero muncul per huruf dari bawah garis. Murni CSS (tanpa JS) supaya
 * tampil sejak cat pertama; delay tiap huruf diatur lewat animation-delay.
 * prefers-reduced-motion: tanpa gerak, hanya fade sederhana.
 */
export const LETTER_STEP = 0.035;
export const NAME_START = 0.15;

export function HeroName({
  lines,
}: {
  lines: { text: string; className?: string }[];
}) {
  let index = 0;
  return (
    <>
      <span className="sr-only">{lines.map((l) => l.text).join(" ")}</span>
      <span aria-hidden="true" className="block motion-reduce:animate-fade-in">
        {lines.map((line) => (
          // Padding bawah agar ekor huruf (y, p) tidak terpotong mask.
          <span
            key={line.text}
            className={`-mb-[0.14em] block overflow-hidden pb-[0.14em] ${line.className ?? ""}`}
          >
            {Array.from(line.text).map((char, i) => (
              <span
                key={`${char}-${i}`}
                className="inline-block motion-safe:animate-letter-up"
                style={{
                  animationDelay: `${(NAME_START + index++ * LETTER_STEP).toFixed(3)}s`,
                }}
              >
                {char === " " ? " " : char}
              </span>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}
