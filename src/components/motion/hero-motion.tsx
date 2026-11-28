"use client";

import {
  AnimatePresence,
  m,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePointerEffects, usePrefersReducedMotion } from "./hooks";
import { getLenis } from "./smooth-scroll";

/* -------------------------------------------------------------------------- */
/* Jabatan: transisi vertikal halus (selalu terbaca utuh, tidak pernah kosong)*/
/* -------------------------------------------------------------------------- */

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
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || roles.length < 2) return;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const startId = setTimeout(
      () => {
        intervalId = setInterval(() => {
          setIndex((i) => (i + 1) % roles.length);
        }, 3200);
      },
      Math.max(1200, startDelay * 1000 + 800),
    );
    return () => {
      clearTimeout(startId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [reduced, roles.length, startDelay]);

  const current = roles[index] ?? roles[0] ?? "";
  const words = current.split(" ");
  const firstLine = words[0] ?? "";
  const restLines = words.slice(1).join(" ");

  if (reduced || roles.length < 2) {
    return (
      <p className="font-display text-2xl leading-[1.02] font-extrabold tracking-[-0.02em] text-role-tint uppercase sm:text-3xl lg:text-[clamp(1.85rem,3vw,2.85rem)]">
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
    <div className="min-h-[4.4rem] sm:min-h-[5.4rem] lg:min-h-[6.2rem]">
      <span className="sr-only">
        {label}: {roles.join(", ")}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <m.p
          key={current}
          aria-hidden="true"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-2xl leading-[1.02] font-extrabold tracking-[-0.02em] text-role-tint uppercase sm:text-3xl lg:text-[clamp(1.85rem,3vw,2.85rem)]"
        >
          <span className="block">{firstLine}</span>
          {restLines && <span className="block">{restLines}</span>}
        </m.p>
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Foto: potret tanpa latar yang "keluar bingkai" — kepala melewati tepi atas */
/* panggung, sisi bawah terpotong rapi mengikuti sudut kartu.                 */
/* -------------------------------------------------------------------------- */

const MAX_TILT = 5; // derajat halus agar tetap elegan

export function HeroPhoto({
  children,
  delay,
}: {
  /** Gambar potret transparan (fill, object-contain, rata bawah). */
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
      if (rect.bottom < 0) return;
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
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1100,
          transformOrigin: "50% 100%",
        }}
        className="relative aspect-[3/4]"
      >
        {/* Cahaya lembut di belakang kepala & bahu agar rambut dan kemeja
            gelap tetap terpisah dari latar, terutama di dark mode. */}
        <div
          aria-hidden="true"
          className="hero-head-glow pointer-events-none absolute top-[-4%] left-1/2 aspect-square w-[95%] -translate-x-1/2 rounded-full motion-safe:animate-fade-in"
          style={{ animationDelay: `${delay}s` }}
        />

        {/* Potret tanpa bingkai, langsung di atas latar hero dan berdiri di
            garis bawah section (tanpa pudar agar kemeja tetap hitam pekat). */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 motion-safe:animate-mask-up motion-reduce:animate-fade-in"
            style={{ animationDelay: `${delay}s` }}
          >
            <div className="hero-portrait absolute inset-0">{children}</div>
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
      className="pointer-events-none absolute -inset-12 -z-10"
    >
      <m.div
        className="absolute -top-4 -right-4 size-3/4 rounded-full bg-[radial-gradient(circle,var(--accent-secondary)_0%,transparent_68%)] opacity-25 blur-3xl dark:opacity-35"
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
          y: 44,
          ease: "none",
          scrollTrigger,
        });
        // Potret berdiri di garis bawah hero: hanya boleh turun (sisa yang
        // melewati garis dipotong overflow section), jangan naik.
        gsap.to('[data-parallax="photo"]', {
          y: 30,
          ease: "none",
          scrollTrigger,
        });
        gsap.to('[data-parallax="role"]', {
          y: 38,
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
