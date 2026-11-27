"use client";

import {
  Award,
  Briefcase,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Newspaper,
  Sparkles,
  Tags,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Item = {
  href: string;
  label: string;
  Icon: LucideIcon;
  badge?: ReactNode;
};

export function AdminNav({ unreadBadge }: { unreadBadge: ReactNode }) {
  const pathname = usePathname();
  const groups: { title?: string; items: Item[] }[] = [
    {
      items: [
        { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
        {
          href: "/admin/messages",
          label: "Pesan",
          Icon: Mail,
          badge: unreadBadge,
        },
      ],
    },
    {
      title: "Konten",
      items: [
        { href: "/admin/projects", label: "Proyek", Icon: FolderKanban },
        { href: "/admin/categories", label: "Kategori", Icon: Tags },
        { href: "/admin/posts", label: "Blog", Icon: Newspaper },
        { href: "/admin/services", label: "Layanan", Icon: Wrench },
        {
          href: "/admin/testimonials",
          label: "Testimoni",
          Icon: MessageSquareQuote,
        },
      ],
    },
    {
      title: "Tentang saya",
      items: [
        { href: "/admin/profile", label: "Profil", Icon: UserRound },
        { href: "/admin/skills", label: "Skill", Icon: Sparkles },
        { href: "/admin/experiences", label: "Pengalaman", Icon: Briefcase },
        { href: "/admin/educations", label: "Pendidikan", Icon: GraduationCap },
        { href: "/admin/certifications", label: "Sertifikat", Icon: Award },
      ],
    },
  ];

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav aria-label="Menu admin" className="flex flex-col gap-6">
      {groups.map((group, i) => (
        <div key={group.title ?? i}>
          {group.title && (
            <p className="mb-2 px-3 text-xs font-semibold tracking-wide text-muted uppercase">
              {group.title}
            </p>
          )}
          <ul className="flex flex-col gap-0.5">
            {group.items.map(({ href, label, Icon, badge }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground aria-[current=page]:bg-surface-2 aria-[current=page]:text-foreground"
                >
                  <Icon aria-hidden="true" className="size-4" />
                  <span className="flex-1">{label}</span>
                  {badge}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
