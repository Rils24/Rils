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

const INTERVAL = 6500;

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
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
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

  const control =
    "inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface-2/80 text-foreground transition-colors hover:border-accent/60 hover:text-accent";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={titleId}
      className="mx-auto max-w-5xl"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false);
      }}
    >
      <div aria-live={autoplay ? "off" : "polite"} className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={current.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${items.length}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="grid items-center gap-6 lg:grid-cols-12"
          >
            {/* Kiri: Potret klien berukuran besar bergaya editorial */}
            <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-3xl border border-border/80 bg-surface-2 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.75)] lg:col-span-5 lg:max-w-none">
              <div className="relative aspect-[4/4.2] w-full">
                {current.photoUrl ? (
                  <Image
                    src={current.photoUrl}
                    alt={current.name}
                    fill
                    sizes="(min-width: 1024px) 380px, 320px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_30%_25%,rgba(59,91,255,0.22),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(242,72,87,0.16),transparent_60%)]">
                    <span
                      aria-hidden="true"
                      className="font-display text-6xl font-black tracking-tight text-foreground/25 select-none"
                    >
                      {current.initials}
                    </span>
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent"
                />
              </div>
            </div>

            {/* Kanan: Kartu kutipan gelap yang sedikit menumpuk di desktop */}
            <div className="relative z-10 rounded-3xl border border-border/90 bg-surface/95 p-7 shadow-[0_28px_72px_-28px_rgba(0,0,0,0.8)] backdrop-blur-md sm:p-10 lg:col-span-8 lg:-ml-12">
              {/* Tanda kutip cobalt khas referensi */}
              <span
                aria-hidden="true"
                className="mb-4 inline-flex font-display text-6xl leading-none font-black text-accent-secondary select-none"
              >
                “
              </span>

              <figure>
                <blockquote className="text-base leading-relaxed text-foreground/90 sm:text-lg md:text-[1.18rem]">
                  {current.quote}
                </blockquote>

                <figcaption className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-6">
                  <div>
                    <span className="block font-display text-base font-bold tracking-tight text-accent-secondary-text">
                      {current.name}
                    </span>
                    {current.role && (
                      <span className="mt-0.5 block text-xs font-medium tracking-wide text-muted">
                        {current.role}
                      </span>
                    )}
                  </div>

                  {items.length > 1 && (
                    <div className="flex items-center gap-4">
                      {/* Indikator titik / pill */}
                      <div className="flex items-center gap-1.5">
                        {items.map((item, i) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setIndex(i)}
                            aria-label={`${i + 1} / ${items.length}`}
                            aria-current={i === index ? "true" : undefined}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              i === index
                                ? "w-6 bg-accent"
                                : "w-2 bg-border hover:bg-muted"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
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
                              <Play aria-hidden="true" className="size-3.5" />
                            ) : (
                              <Pause aria-hidden="true" className="size-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </figcaption>
              </figure>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
