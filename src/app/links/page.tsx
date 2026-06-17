import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { fetchLinkInBio } from "@/lib/sanity/fetchers";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import type { SocialPlatform } from "@/types/sanity";

export const metadata: Metadata = {
  title: "Bureau Directory",
  description:
    "Quick access to the Bureau's case files, bulletins, and field reports.",
  alternates: {
    canonical: "/links",
  },
  robots: {
    index: false,
    follow: true,
  },
};

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  bluesky: "Bluesky",
  youtube: "YouTube",
  threads: "Threads",
  x: "X",
  email: "Email",
  rss: "RSS",
};

function isExternal(url: string): boolean {
  return /^(https?:|mailto:)/i.test(url);
}

export default async function LinksPage() {
  const data = await fetchLinkInBio();

  return (
    <div className="min-h-screen bg-background paper-texture">
      <main
        id="main-content"
        className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-12 sm:py-16"
      >
        {/* Masthead */}
        <header className="text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="block h-px w-8 bg-border" aria-hidden="true" />
            <span className="font-typewriter text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--bureau-ink-muted))]">
              Bureau ◆ Directory
            </span>
            <span className="block h-px w-8 bg-border" aria-hidden="true" />
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Appalachian Cryptid
            <br />
            Compendium
          </h1>

          <div
            className="mx-auto mt-4 max-w-[200px] border-b border-t-2 border-foreground"
            style={{ height: "4px" }}
            aria-hidden="true"
          />

          <p className="mt-5 font-typewriter text-sm leading-relaxed text-muted-foreground">
            {data.tagline}
          </p>
        </header>

        {/* Pinned dispatch */}
        {data.pinnedNote && (
          <aside className="mt-8 border border-dashed border-foreground/40 bg-card/60 p-4">
            <div className="mb-2 font-typewriter text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--bureau-ink-muted))]">
              ◆ Current Dispatch
            </div>
            <p className="font-typewriter text-sm leading-relaxed text-foreground">
              {data.pinnedNote}
            </p>
          </aside>
        )}

        {/* Link list */}
        <nav aria-label="Bureau directory" className="mt-8 space-y-3">
          {data.links.map((link, idx) => {
            const external = isExternal(link.url);
            const key = link._key ?? `${link.url}-${idx}`;

            const inner = (
              <>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                    {link.label}
                  </span>
                  <span className="flex items-center gap-2">
                    {link.badge && (
                      <span className="border border-foreground/60 px-1.5 py-0.5 font-typewriter text-[9px] uppercase tracking-[0.16em] text-foreground">
                        {link.badge}
                      </span>
                    )}
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                {link.description && (
                  <p className="mt-1.5 font-typewriter text-xs leading-relaxed text-muted-foreground">
                    {link.description}
                  </p>
                )}
              </>
            );

            const className =
              "group block border border-foreground/30 bg-card/80 px-4 py-3.5 transition-colors hover:border-foreground hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

            return external ? (
              <a
                key={key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {inner}
              </a>
            ) : (
              <Link key={key} href={link.url} className={className}>
                {inner}
              </Link>
            );
          })}
        </nav>

        {/* Newsletter */}
        <div className="mt-8">
          <NewsletterSignup variant="compact" />
        </div>

        {/* Socials */}
        {data.socials && data.socials.length > 0 && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="block h-px w-6 bg-border" aria-hidden="true" />
              <span className="font-typewriter text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--bureau-ink-muted))]">
                Field Channels
              </span>
              <span className="block h-px w-6 bg-border" aria-hidden="true" />
            </div>
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {data.socials.map((social, idx) => {
                const label = SOCIAL_LABELS[social.platform];
                if (!label) return null;
                const key = social._key ?? `${social.platform}-${idx}`;
                return (
                  <li key={key}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border border-foreground/30 px-3 py-1.5 font-typewriter text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Bureau seal */}
        <footer className="mt-auto pt-12 text-center">
          <p className="font-typewriter text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--bureau-ink-muted))]">
            Filed ◆ Appalachian Region ◆ {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
