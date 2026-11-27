"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { usePointerEffects } from "./hooks";

const INTERACTIVE = "a, button, [role=button], input, textarea, select, label";

/**
 * Cincin yang mengikuti kursor dan membesar di atas elemen interaktif.
 * Kursor bawaan tetap tampil (aksesibilitas); hanya aktif di perangkat
 * dengan mouse dan tanpa prefers-reduced-motion.
 */
export function CustomCursor() {
  const enabled = usePointerEffects();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setHovering(
        Boolean((e.target as Element | null)?.closest?.(INTERACTIVE)),
      );
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] -mt-4 -ml-4 size-8 rounded-full border border-accent"
      style={{ x: springX, y: springY }}
      animate={{
        scale: hovering ? 1.6 : 1,
        opacity: visible ? (hovering ? 0.5 : 1) : 0,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  );
}
