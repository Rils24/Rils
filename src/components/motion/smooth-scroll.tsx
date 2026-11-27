"use client";

import type Lenis from "lenis";
import { useEffect } from "react";

let instance: Lenis | null = null;

/** Instance Lenis aktif (dipakai GSAP ScrollTrigger di hero agar sinkron). */
export function getLenis() {
  return instance;
}

/**
 * Smooth scroll global (Lenis). Lenis otomatis mematikan smoothing bila
 * pengguna memilih prefers-reduced-motion. Link anchor (#about) ikut halus.
 * Library di-import dinamis agar tidak masuk bundle awal halaman.
 */
export function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let cancelled = false;

    import("lenis").then(({ default: LenisClass }) => {
      if (cancelled) return;
      lenis = new LenisClass({
        autoRaf: true,
        anchors: { offset: -88 },
        lerp: 0.12,
        stopInertiaOnNavigate: true,
      });
      instance = lenis;
    });

    return () => {
      cancelled = true;
      lenis?.destroy();
      instance = null;
    };
  }, []);

  return null;
}
