/**
 * Garis kontur topografi halus di latar hero (murni SVG + CSS drift halus).
 * Tersembunyi dari pembaca layar; animasi berhenti pada prefers-reduced-motion.
 */
export function HeroTopoBg() {
  return (
    <div
      aria-hidden="true"
      data-parallax="bg"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Sorotan studio lembut di belakang potret */}
      <div className="absolute top-1/2 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,91,255,0.16)_0%,rgba(242,72,87,0.08)_42%,transparent_70%)] blur-3xl dark:opacity-100 opacity-50" />

      {/* Kontur gelombang topografi */}
      <svg
        viewBox="0 0 1440 760"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        className="topo-drift h-full w-full text-foreground/[0.06] dark:text-white/[0.065]"
        style={{
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 45%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 45%, black 35%, transparent 100%)",
        }}
      >
        <g stroke="currentColor" strokeWidth="1.25">
          <path d="M-120 140C120 40 310 260 560 170C810 80 980 280 1240 160C1380 95 1480 130 1560 180" />
          <path d="M-120 205C140 105 330 325 580 235C830 145 990 340 1255 225C1395 160 1485 195 1560 245" />
          <path d="M-120 270C160 170 350 385 600 300C850 215 1005 405 1270 290C1410 225 1495 260 1560 310" />
          <path d="M-120 335C180 235 370 450 620 365C870 280 1020 470 1285 355C1425 290 1505 325 1560 375" />
          <path d="M-120 400C195 305 390 515 640 430C890 345 1035 535 1300 420C1440 355 1515 390 1560 440" />
          <path d="M-120 465C210 375 410 580 660 495C910 410 1050 600 1315 485C1450 425 1520 455 1560 505" />
          <path d="M-120 530C225 445 430 645 680 560C930 475 1065 665 1330 550C1460 490 1530 520 1560 570" />
          <path d="M-120 595C240 515 450 710 700 625C950 540 1080 730 1345 615C1470 555 1535 585 1560 635" />
          <path d="M-120 75C100 -15 290 195 540 105C790 15 960 215 1220 95C1365 30 1470 65 1560 115" />
        </g>
      </svg>

      {/* Gradasi lembut di tepi bawah agar transisi ke section berikutnya mulus */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

