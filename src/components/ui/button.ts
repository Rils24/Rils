type Variant = "primary" | "secondary";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-solid text-accent-foreground shadow-[0_10px_28px_-10px_rgba(242,72,87,0.65)] hover:bg-accent-solid-hover hover:shadow-[0_14px_34px_-10px_rgba(242,72,87,0.82)]",
  secondary:
    "border border-border bg-surface/90 text-foreground hover:border-foreground/35 hover:bg-surface-2",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-sm sm:text-base",
};

/** Kelas tombol pill yang konsisten untuk <button>, <a>, dan <Link>. */
export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className = "",
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}
