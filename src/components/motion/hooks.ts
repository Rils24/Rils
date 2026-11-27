"use client";

import { useSyncExternalStore } from "react";

/**
 * Media query yang aman untuk hydration: server dan render pertama di browser
 * selalu `false`, lalu diperbarui setelah hydration tanpa mismatch.
 */
function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * true hanya untuk mouse/trackpad (bukan layar sentuh) dan bila pengguna tidak
 * meminta gerak dikurangi. Dipakai untuk tilt, kursor kustom, tombol magnetik.
 */
export function usePointerEffects() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = usePrefersReducedMotion();
  return finePointer && !reduced;
}
