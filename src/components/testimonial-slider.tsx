"use client";

import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/hooks";

export type TestimonialItem = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  photoUrl: string | null;
  initials: string;
};

const INTERVAL = 6000;

export function TestimonialSlider({
  items,
  titleId,
}: {
  items: TestimonialItem[];
  titleId: string;
}) {
  const t = useTranslations("Testimonials");
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // tombol pause
  const [hovered, setHovered] = useState(false); // hover / fokus keyboard
  const autoplay = items.length > 1 && !reduced && !paused && !hovered;

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      INTERVAL,
    );
    return () => clearInterval(id);
  }, [autoplay, items.length]);

  const go = (delta: number) =>
    setIndex((i) => (i + delta + items.length) % items.length);
  const current = items[index];
  const pad = (n: number) => String(n).padStart(2, "0");

  const control =
    "inline-flex size-11 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:border-foreground/40";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={titleId}
      className="grid gap-8 lg:grid-cols-12"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false);
      }}
    >
      {items.length > 1 && (
        <div className="order-2 flex items-center gap-2 lg:col-span-12">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t("previous")}
            className={control}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t("next")}
            className={control}
          >
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? t("play") : t("pause")}
              className={control}
            >
              {paused ? (
                <Play aria-hidden="true" className="size-4" />
              ) : (
                <Pause aria-hidden="true" className="size-4" />
              )}
            </button>
          )}
          <p className="ml-3 font-display text-sm text-muted tabular-nums">
            <span className="text-foreground">{pad(index + 1)}</span> /{" "}
            {pad(items.length)}
          </p>
        </div>
      )}

      <div
        aria-live={autoplay ? "off" : "polite"}
        className="relative order-1 lg:col-span-12"
      >
        <AnimatePresence mode="wait" initial={false}>
          {/* role="group" di <div>, karena <figure> tidak boleh diberi role group. */}
          <m.div
            key={current.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${items.length}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-2xl border border-border bg-surface p-8 sm:p-12"
          >
            <figure>
              <blockquote className="max-w-4xl font-display text-2xl leading-snug font-medium tracking-tight sm:text-3xl">
                <span aria-hidden="true" className="mr-1 text-accent">
                  “
                </span>
                {current.quote}
                <span aria-hidden="true" className="text-accent">
                  ”
                </span>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                {current.photoUrl ? (
                  <Image
                    src={current.photoUrl}
                    alt=""
                    width={56}
                    height={56}
                    className="size-14 rounded-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="inline-flex size-14 items-center justify-center rounded-full bg-surface-2 font-semibold text-muted"
                  >
                    {current.initials}
                  </span>
                )}
                <span>
                  <span className="block font-semibold">{current.name}</span>
                  {current.role && (
                    <span className="block text-sm text-muted">
                      {current.role}
                    </span>
                  )}
                </span>
              </figcaption>
            </figure>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
