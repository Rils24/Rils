"use client";

import { m, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

/** Fade + naik sedikit saat elemen masuk layar. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={item}
      transition={{ delay }}
    >
      {children}
    </m.div>
  );
}

/** <ul> yang menampilkan anak-anaknya bergantian (stagger) saat masuk layar. */
export function Stagger({
  children,
  className,
  step = 0.1,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
}) {
  return (
    <m.ul
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step } } }}
    >
      {children}
    </m.ul>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <m.li className={className} variants={item}>
      {children}
    </m.li>
  );
}
