import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { fetchLinkInBio } from "@/lib/sanity/fetchers";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Stamp } from "@/components/Stamp";
import { cn } from "@/lib/utils";
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
        <header className="relative text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="block h-px w-8 bg-border" aria-hidden="true" />
            <span className="font-typewriter text-[10px] uppercase tracking-eyebrow text-bureau-ink-muted">
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

          {/* Stamped across the masthead — these files have been cleared for the public */}
          <div className="mt-5 flex justify-center">
            <Stamp
              text="Declassified"
              variant="danger"
              rotation={-7}
              className="text-xs px-3 py-1 opacity-90"
            />
          </div>

          <p className="mt-4 font-typewriter text-sm leading-relaxed text-muted-foreground">
            {data.tagline}
          </p>
        </header>

        {/* Pinned dispatch — clipped memo */}
        {data.pinnedNote && (
          <div className="relative mt-10">
            <div className="paper-clip" aria-hidden="true" />
            <aside className="border border-dashed border-accent/60 bg-accent/[0.06] p-4 pt-5">
              <div className="mb-2 font-typewriter text-[10px] uppercase tracking-eyebrow text-accent">
                ◆ Current Dispatch
              </div>
              <p className="font-typewriter text-sm leading-relaxed text-foreground">
                {data.pinnedNote}
              </p>
            </aside>
          </div>
        )}

        {/* Case files */}
        <nav aria-label="Bureau directory" className="mt-8 space-y-4">
          {data.links.map((link, idx) => {
            const external = isExternal(link.url);
            const key = link._key ?? `${link.url}-${idx}`;
            const caseNo = String(idx + 1).padStart(2, "0");
            const isFeatured = link.badge?.toUpperCase() === "FEATURED";

            const inner = (
              <div className="relative z-[1]">
                {/* File header: case number + stamp badge */}
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <span className="font-typewriter text-[10px] uppercase tracking-eyebrow text-bureau-ink-muted">
                    Case No. {caseNo}
                  </span>
                  {link.badge ? (
                    <span
                      style={{ transform: "rotate(2.5deg)" }}
                      className={cn(
                        "shrink-0 border-2 px-2 py-0.5 font-display text-[9px] font-bold uppercase tracking-eyebrow shadow-[inset_0_0_0_1px_currentColor]",
                        isFeatured
                          ? "border-destructive text-destructive"
                          : "border-accent text-accent"
                      )}
                    >
                      {link.badge}
                    </span>
                  ) : (
                    <span className="font-typewriter text-[10px] uppercase tracking-eyebrow text-muted-foreground/40">
                      ◆ Open File
                    </span>
                  )}
                </div>

                {/* Title + outbound arrow */}
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                    {link.label}
                  </span>
                  <ArrowUpRight
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>

                {link.description && (
                  <p className="mt-1.5 font-typewriter text-xs leading-relaxed text-muted-foreground">
                    {link.description}
                  </p>
                )}
              </div>
            );

            const className =
              "group case-file-card block rounded-[2px] px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

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
        <div className="mt-10">
          <NewsletterSignup variant="compact" />
        </div>

        {/* Socials */}
        {data.socials && data.socials.length > 0 && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="block h-px w-6 bg-border" aria-hidden="true" />
              <span className="font-typewriter text-[10px] uppercase tracking-eyebrow text-bureau-ink-muted">
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
                      className="block border border-accent/40 px-3 py-1.5 font-typewriter text-[11px] uppercase tracking-label text-bureau-ink-muted transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
          <p className="font-typewriter text-[10px] uppercase tracking-eyebrow text-bureau-ink-muted">
            Filed ◆ Appalachian Region ◆ {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
