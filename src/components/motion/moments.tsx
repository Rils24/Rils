"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * Dua "momen" yang di-deal taste-skill (moments.mjs pick --page service):
 * - WordHighlight  : satu pernyataan besar, kata demi kata menyala saat scroll
 *                    (mengikuti scrollbar, berjalan mundur saat scroll ke atas).
 * - PictureDevelops: satu foto besar "dicuci" sekali saat masuk layar, dari
 *                    cetakan abu-abu pucat ke foto berwarna (~1,6 detik).
 *
 * Aturan "still" taste-skill: tanpa JS, saat gagal, atau prefers-reduced-motion
 * isi tampil utuh dan diam. Keduanya ringan (warna/filter/transform), jadi
 * tetap berjalan di HP.
 */

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* -------------------------------------------------------------------------- */
/* WordHighlight                                                              */
/* -------------------------------------------------------------------------- */

export function WordHighlight({
  text,
  className = "",
  from = 0.85,
  to = 0.45,
}: {
  text: string;
  className?: string;
  /** Posisi atas teks (porsi tinggi layar) saat kata pertama menyala. */
  from?: number;
  /** Posisi bawah teks saat kata terakhir menyala. */
  to?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>(".wh-word"));
    el.classList.add("wh-live");

    let lit = -1;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * from;
      const end = vh * to;
      const t = Math.min(
        1,
        Math.max(0, (start - r.top) / Math.max(1, start - end + r.height)),
      );
      // Di dasar halaman teks tidak bisa naik lagi: tampilkan semuanya.
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      const k = atEnd ? spans.length : Math.round(t * spans.length);
      if (k === lit) return;
      lit = k;
      spans.forEach((s, i) => s.classList.toggle("is-on", i < k));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.classList.remove("wh-live");
    };
  }, [from, to, text]);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="wh-word">{word}</span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* PictureDevelops (tampilan "film")                                          */
/* -------------------------------------------------------------------------- */

const DEVELOP: Keyframe[] = [
  {
    filter: "grayscale(1) contrast(.55) brightness(1.32)",
    transform: "scale(1.06)",
  },
  { filter: "grayscale(.8) contrast(.82) brightness(1.14)", offset: 0.3 },
  { filter: "grayscale(.35) contrast(.95) brightness(1.04)", offset: 0.62 },
  { filter: "grayscale(0) contrast(1) brightness(1)", transform: "none" },
];

export function PictureDevelops({
  children,
  className = "",
  duration = 1600,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const img = root?.querySelector("img");
    if (!root || !img || reducedMotion()) return;

    let done = false;
    let anim: Animation | undefined;
    const arm = () => {
      if (!done) root.classList.add("pd-armed");
    };
    const finish = () => {
      if (done) return;
      done = true;
      root.classList.remove("pd-armed");
      near.disconnect();
      seen.disconnect();
    };
    const run = async () => {
      if (done || anim) return;
      arm();
      if (!img.complete) {
        await new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      }
      if (done) return;
      // Gelap datang lebih dulu (kontras), warna terakhir (saturasi); zoom
      // turun sepanjang durasi. Perubahan dimulai di frame pertama.
      anim = img.animate(DEVELOP, {
        duration,
        easing: "cubic-bezier(.3, .2, .3, 1)",
        fill: "both",
      });
      root.classList.remove("pd-armed");
      anim.finished.then(() => {
        anim?.cancel();
        finish();
      }, finish);
    };

    // Dipasang sedikit sebelum masuk layar, agar cetakan pucat hanya terlihat
    // sebentar sebelum mulai berubah.
    const near = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && arm(),
      { rootMargin: "0px 0px 25% 0px" },
    );
    const height = root.getBoundingClientRect().height;
    const seen = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && run(),
      {
        threshold: Math.min(
          0.25,
          (0.4 * window.innerHeight) / Math.max(1, height),
        ),
      },
    );
    near.observe(root);
    seen.observe(root);

    return () => {
      anim?.cancel();
      finish();
    };
  }, [duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
