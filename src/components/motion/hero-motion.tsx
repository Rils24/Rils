"use client";

import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePointerEffects, usePrefersReducedMotion } from "./hooks";
import { getLenis } from "./smooth-scroll";

/* -------------------------------------------------------------------------- */
/* Jabatan: tipografi display kanan bergaya editorial (ketik bergantian)      */
/* -------------------------------------------------------------------------- */

type TypingState = { index: number; text: string; deleting: boolean };

export function HeroRoles({
  roles,
  label,
  startDelay,
}: {
  roles: string[];
  label: string;
  startDelay: number;
}) {
  const reduced = usePrefersReducedMotion();
  // Render awal (server) sudah berisi jabatan pertama secara utuh.
  const [state, setState] = useState<TypingState>({
    index: 0,
    text: roles[0] ?? "",
    deleting: false,
  });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reduced || roles.length < 2) return;
    const id = setTimeout(() => setStarted(true), startDelay * 1000 + 1400);
    return () => clearTimeout(id);
  }, [reduced, roles.length, startDelay]);

  useEffect(() => {
    if (!started) return;
    const full = roles[state.index];
    let wait: number;
    let next: TypingState;

    if (!state.deleting && state.text === full) {
      wait = 2200; // jeda saat kata lengkap
      next = { ...state, deleting: true };
    } else if (state.deleting && state.text === "") {
      wait = 260;
      next = {
        index: (state.index + 1) % roles.length,
        text: "",
        deleting: false,
      };
    } else if (state.deleting) {
      wait = 32;
      next = { ...state, text: state.text.slice(0, -1) };
    } else {
      wait = 68;
      next = { ...state, text: full.slice(0, state.text.length + 1) };
    }

    const id = setTimeout(() => setState(next), wait);
    return () => clearTimeout(id);
  }, [started, state, roles]);

  // prefers-reduced-motion: semua jabatan tampil statis.
  if (reduced || roles.length < 2) {
    return (
      <p className="font-display text-2xl leading-[1.05] font-extrabold tracking-[-0.02em] text-role-tint uppercase sm:text-3xl lg:text-4xl">
        <span className="sr-only">{label}: </span>
        {roles.map((role, i) => (
          <span key={role} className={i > 0 ? "block opacity-75" : "block"}>
            {role}
          </span>
        ))}
      </p>
    );
  }

  return (
    <p className="font-display text-2xl leading-[1.05] font-extrabold tracking-[-0.02em] text-role-tint uppercase sm:text-3xl lg:text-[clamp(1.9rem,3.1vw,3rem)]">
      <span className="sr-only">
        {label}: {roles.join(", ")}
      </span>
      <span
        aria-hidden="true"
        className="inline-flex min-h-[2.2em] flex-wrap items-center"
      >
        <span>{state.text}</span>
        <m.span
          className="ml-1.5 inline-block h-[0.95em] w-[3px] rounded-full bg-accent"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </span>
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Foto: panggung potret tengah, reveal mask CSS, tilt 3D mengikuti kursor    */
/* -------------------------------------------------------------------------- */

const MAX_TILT = 6; // derajat halus agar tetap elegan

export function HeroPhoto({
  children,
  delay,
}: {
  children: ReactNode;
  delay: number;
}) {
  const tiltEnabled = usePointerEffects();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 140, damping: 22, mass: 0.65 };
  const rotateY = useSpring(
    useTransform(px, [-1, 1], [-MAX_TILT, MAX_TILT]),
    spring,
  );
  const rotateX = useSpring(
    useTransform(py, [-1, 1], [MAX_TILT, -MAX_TILT]),
    spring,
  );

  useEffect(() => {
    if (!tiltEnabled) {
      px.set(0);
      py.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0) return; // hero sudah lewat
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      px.set(
        clamp(
          (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2),
        ),
      );
      py.set(
        clamp(
          (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2),
        ),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [tiltEnabled, px, py]);

  return (
    <div ref={ref} className="relative">
      <HeroBlob />
      <m.div
        style={{ rotateX, rotateY, transformPerspective: 1100 }}
        className="relative"
      >
        {/* Mask: isi naik dari bawah ke dalam bingkai (CSS, tanpa menunggu JS,
            agar foto sebagai kandidat LCP tetap cepat tampil). */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border/80 bg-surface-2 shadow-[0_32px_84px_-24px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.06]">
          <div
            className="absolute inset-0 motion-safe:animate-mask-up motion-reduce:animate-fade-in"
            style={{ animationDelay: `${delay}s` }}
          >
            <div
              className="absolute inset-0 motion-safe:animate-settle"
              style={{ animationDelay: `${delay}s` }}
            >
              {children}
            </div>
          </div>
          {/* Vignette bawah halus agar potret menyatu ke panggung gelap */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/85 via-background/20 to-transparent"
          />
        </div>
      </m.div>
    </div>
  );
}

function HeroBlob() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-12 -z-10"
    >
      <m.div
        className="absolute -top-4 -right-4 size-3/4 rounded-full bg-[radial-gradient(circle,var(--accent-secondary)_0%,transparent_68%)] opacity-25 blur-3xl dark:opacity-30"
        animate={{
          x: [0, -24, 12, 0],
          y: [0, 18, -16, 0],
          scale: [1, 1.07, 0.96, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        className="absolute -bottom-6 -left-6 size-2/3 rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_68%)] opacity-20 blur-3xl dark:opacity-25"
        animate={{
          x: [0, 22, -14, 0],
          y: [0, -20, 14, 0],
          scale: [1, 0.95, 1.06, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Parallax multi-lapis saat scroll (GSAP ScrollTrigger, dimuat terpisah)     */
/* -------------------------------------------------------------------------- */

/**
 * Menggerakkan lapisan hero ([data-parallax="bg|name|photo|role"]) dengan
 * kecepatan berbeda sesuai panduan ui-ux-pro-max. GSAP di-import dinamis agar
 * tidak masuk bundle awal, dan tidak dimuat sama sekali saat reduced motion.
 */
export function HeroParallax({ targetId }: { targetId: string }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const section = document.getElementById(targetId);
      if (!section) return;

      const ctx = gsap.context(() => {
        const scrollTrigger = {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        };
        gsap.to('[data-parallax="bg"]', {
          y: 36,
          ease: "none",
          scrollTrigger,
        });
        gsap.to('[data-parallax="name"]', {
          y: 52,
          ease: "none",
          scrollTrigger,
        });
        gsap.to('[data-parallax="photo"]', {
          y: -36,
          ease: "none",
          scrollTrigger,
        });
        gsap.to('[data-parallax="role"]', {
          y: 42,
          ease: "none",
          scrollTrigger,
        });
      }, section);

      const lenis = getLenis();
      const update = () => ScrollTrigger.update();
      lenis?.on("scroll", update);

      cleanup = () => {
        lenis?.off("scroll", update);
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reduced, targetId]);

  return null;
}
