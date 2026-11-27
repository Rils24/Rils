"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { CustomCursor } from "./custom-cursor";
import { SmoothScroll } from "./smooth-scroll";

// Fitur animasi diunduh terpisah setelah halaman tampil, sehingga bundle awal
// hanya berisi komponen `m.*` yang ringan (lebih cepat di HP).
const loadFeatures = () => import("./features").then((mod) => mod.default);

/**
 * reducedMotion="user": bila pengguna memilih prefers-reduced-motion, animasi
 * transform (gerak, skala, layout) dimatikan dan hanya fade (opacity) yang tersisa.
 * `strict`: memastikan tidak ada komponen `motion.*` penuh yang ikut terbundel.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <SmoothScroll />
        <CustomCursor />
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
