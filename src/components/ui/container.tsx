import type { ComponentProps } from "react";

const widths = {
  // Lebar konten maksimum 1200 px (PRD), plus gutter 24 px kiri-kanan.
  default: "max-w-[calc(1200px+3rem)]",
  // Kolom baca artikel.
  narrow: "max-w-[calc(760px+3rem)]",
};

export function Container({
  className = "",
  size = "default",
  ...props
}: ComponentProps<"div"> & { size?: keyof typeof widths }) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 ${widths[size]} ${className}`}
      {...props}
    />
  );
}
