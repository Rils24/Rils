"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { usePointerEffects } from "./hooks";

/**
 * Tombol "magnetik": isi bergeser mengikuti kursor saat didekati lalu kembali
 * dengan pegas. Nonaktif di layar sentuh dan saat prefers-reduced-motion.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className = "inline-flex",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const enabled = usePointerEffects();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 250, damping: 18, mass: 0.5 });

  function onMove(e: PointerEvent<HTMLSpanElement>) {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
