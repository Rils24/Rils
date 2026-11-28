import { Mail } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/icons/brand";
import type { Profile } from "@/lib/data";

type Item = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/** Hanya menampilkan link yang sudah diisi di profil. */
export function socialItems(profile: Profile | null): Item[] {
  if (!profile) return [];
  const items: (Item | null)[] = [
    profile.email
      ? { href: `mailto:${profile.email}`, label: "Email", Icon: Mail }
      : null,
    profile.linkedin_url
      ? { href: profile.linkedin_url, label: "LinkedIn", Icon: LinkedinIcon }
      : null,
    profile.github_url
      ? { href: profile.github_url, label: "GitHub", Icon: GithubIcon }
      : null,
    profile.instagram_url
      ? { href: profile.instagram_url, label: "Instagram", Icon: InstagramIcon }
      : null,
  ];
  return items.filter((i): i is Item => i !== null);
}

export function SocialLinks({
  profile,
  label,
}: {
  profile: Profile | null;
  label: string;
}) {
  const items = socialItems(profile);
  if (!items.length) return null;

  return (
    <ul aria-label={label} className="flex items-center gap-2">
      {items.map(({ href, label: name, Icon }) => (
        <li key={name}>
          <a
            href={href}
            aria-label={name}
            {...(href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface/80 text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:text-foreground"
          >
            <Icon className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
