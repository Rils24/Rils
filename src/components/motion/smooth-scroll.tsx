"use client";

import Lenis from "lenis";
import { useEffect } from "react";

let instance: Lenis | null = null;

/** Instance Lenis aktif (dipakai GSAP ScrollTrigger di hero agar sinkron). */
export function getLenis() {
  return instance;
}

/**
 * Smooth scroll global (Lenis). Lenis otomatis mematikan smoothing bila
 * pengguna memilih prefers-reduced-motion. Link anchor (#about) ikut halus.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: -88 },
      lerp: 0.12,
      stopInertiaOnNavigate: true,
    });
    instance = lenis;
    return () => {
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
