"use client";

import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePointerEffects, usePrefersReducedMotion } from "./hooks";
import { getLenis } from "./smooth-scroll";

/* -------------------------------------------------------------------------- */
/* Jabatan: efek mengetik bergantian                                          */
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
    const id = setTimeout(() => setStarted(true), startDelay * 1000 + 1200);
    return () => clearTimeout(id);
  }, [reduced, roles.length, startDelay]);

  useEffect(() => {
    if (!started) return;
    const full = roles[state.index];
    let wait: number;
    let next: TypingState;

    if (!state.deleting && state.text === full) {
      wait = 1800; // jeda saat kata lengkap
      next = { ...state, deleting: true };
    } else if (state.deleting && state.text === "") {
      wait = 250;
      next = {
        index: (state.index + 1) % roles.length,
        text: "",
        deleting: false,
      };
    } else if (state.deleting) {
      wait = 35;
      next = { ...state, text: state.text.slice(0, -1) };
    } else {
      wait = 70;
      next = { ...state, text: full.slice(0, state.text.length + 1) };
    }

    const id = setTimeout(() => setState(next), wait);
    return () => clearTimeout(id);
  }, [started, state, roles]);

  // prefers-reduced-motion: semua jabatan tampil statis.
  if (reduced || roles.length < 2) {
    return (
      <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
        <span className="sr-only">{label}: </span>
        {roles.map((role, i) => (
          <span key={role}>
            {i > 0 && (
              <>
                {" "}
                <span aria-hidden="true" className="text-accent">
                  /
                </span>{" "}
              </>
            )}
            <span
              className={`whitespace-nowrap ${i === 0 ? "" : "text-muted"}`}
            >
              {role}
            </span>
          </span>
        ))}
      </p>
    );
  }

  return (
    <p className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
      <span className="sr-only">
        {label}: {roles.join(", ")}
      </span>
      <span
        aria-hidden="true"
        className="inline-flex min-h-[1.3em] items-center"
      >
        {state.text}
        <m.span
          className="ml-1 inline-block h-[1em] w-[3px] rounded-full bg-accent"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </span>
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Foto: reveal lewat mask, tilt 3D mengikuti kursor, blob di belakang         */
/* -------------------------------------------------------------------------- */

const MAX_TILT = 8; // derajat (PRD: 5–10°)

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
  const spring = { stiffness: 150, damping: 20, mass: 0.6 };
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
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="relative"
      >
        {/* Mask: isi naik dari bawah ke dalam bingkai (CSS, tanpa menunggu JS,
            agar foto sebagai kandidat LCP tetap cepat tampil). */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface-2">
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
        </div>
      </m.div>
    </div>
  );
}

function HeroBlob() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-10 -z-10"
    >
      <m.div
        className="absolute top-0 right-0 size-3/4 rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_65%)] opacity-25 blur-2xl dark:opacity-20"
        animate={{
          x: [0, -30, 10, 0],
          y: [0, 20, -20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        className="absolute bottom-0 left-0 size-2/3 rounded-full bg-[radial-gradient(circle,var(--muted)_0%,transparent_65%)] opacity-20 blur-2xl"
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -25, 15, 0],
          scale: [1, 0.94, 1.06, 1],
        }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Parallax saat scroll (GSAP ScrollTrigger, dimuat terpisah)                 */
/* -------------------------------------------------------------------------- */

/**
 * Menggerakkan [data-parallax="name"] dan [data-parallax="photo"] di dalam
 * #hero dengan kecepatan berbeda. GSAP di-import dinamis agar tidak masuk
 * bundle awal, dan tidak dimuat sama sekali saat prefers-reduced-motion.
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
          scrub: true,
        };
        gsap.to('[data-parallax="name"]', {
          y: 120,
          ease: "none",
          scrollTrigger,
        });
        gsap.to('[data-parallax="photo"]', {
          y: -80,
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
