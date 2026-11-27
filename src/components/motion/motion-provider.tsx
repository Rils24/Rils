"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { CustomCursor } from "./custom-cursor";
import { SmoothScroll } from "./smooth-scroll";

/**
 * reducedMotion="user": bila pengguna memilih prefers-reduced-motion, animasi
 * transform (gerak, skala, layout) dimatikan dan hanya fade (opacity) yang tersisa.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <SmoothScroll />
      <CustomCursor />
      {children}
    </MotionConfig>
  );
}
