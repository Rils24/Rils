import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const fontsDir = join(process.cwd(), "src/assets/fonts");
const fonts = Promise.all([
  readFile(join(fontsDir, "space-grotesk-latin-700-normal.woff")),
  readFile(join(fontsDir, "inter-latin-400-normal.woff")),
]);

/**
 * Kartu Open Graph 1200×630 bergaya situs: latar gelap, aksen merah,
 * judul besar Space Grotesk. Dipakai oleh semua file opengraph-image.
 */
export async function ogCard({
  eyebrow,
  title,
  subtitle,
  footer,
  brand = "Syahril Aprialsyah",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string | null;
  footer: string;
  brand?: string;
}) {
  const [display, body] = await fonts;
  const size = title.length > 60 ? 56 : title.length > 36 ? 68 : 84;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#0F0F12",
        color: "#F2F2F4",
        fontFamily: "Inter",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "#E63946",
          }}
        />
        <div style={{ fontSize: 28, color: "#A1A1AA" }}>{eyebrow}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontFamily: "Space Grotesk",
            fontSize: size,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: "#A1A1AA",
              maxWidth: 980,
            }}
          >
            {subtitle.length > 140 ? `${subtitle.slice(0, 137)}…` : subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "2px solid #2A2A31",
          paddingTop: 28,
          fontSize: 26,
        }}
      >
        <div style={{ fontFamily: "Space Grotesk" }}>{brand}</div>
        <div style={{ color: "#E63946" }}>{footer}</div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Space Grotesk", data: display, weight: 700, style: "normal" },
        { name: "Inter", data: body, weight: 400, style: "normal" },
      ],
    },
  );
}
