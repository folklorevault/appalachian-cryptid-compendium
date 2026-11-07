import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { fetchLatestCaseFiles, fetchLinkInBio } from "@/lib/sanity/fetchers";
import { urlFor } from "@/lib/sanity/image";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Stamp } from "@/components/Stamp";
import { cn } from "@/lib/utils";
import type { LatestCaseFile, SocialPlatform } from "@/types/sanity";

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

function caseFileHref(file: LatestCaseFile): string {
  return `/${file._type}/${file.slug}`;
}

function caseFileDesk(file: LatestCaseFile): string {
  return file._type === "anomaly" ? "Anomalies Desk" : "Cryptid File";
}

function caseFileStatus(file: LatestCaseFile): string | null {
  if (!file.status) return null;
  return file.status === "Cold" ? "Cold Case" : file.status;
}

/** Rule, label, rule: the section head used throughout this page. */
function SectionHead({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mb-4 flex items-center gap-3", className)}>
      <span className="block h-px flex-1 bg-border" aria-hidden="true" />
      <h2
        id={id}
        className="font-typewriter text-tag uppercase tracking-eyebrow text-bureau-ink-muted"
      >
        {children}
      </h2>
      <span className="block h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}

export default async function LinksPage() {
  const [data, latest] = await Promise.all([fetchLinkInBio(), fetchLatestCaseFiles()]);
  const [justFiled, ...alsoFiled] = latest;

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
            <span className="font-typewriter text-tag uppercase tracking-eyebrow text-bureau-ink-muted">
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
              <div className="mb-2 font-typewriter text-tag uppercase tracking-eyebrow text-accent">
                ◆ Current Dispatch
              </div>
              <p className="font-typewriter text-sm leading-relaxed text-foreground">
                {data.pinnedNote}
              </p>
            </aside>
          </div>
        )}

        {/* Newsletter: first thing visitors from social posts see */}
        <section aria-label="Newsletter signup" className="mt-10">
          <NewsletterSignup variant="compact" />
        </section>

        {/* Just filed: newest case file, pulled automatically */}
        {justFiled && (
          <section aria-labelledby="just-filed-heading" className="mt-12">
            <SectionHead id="just-filed-heading">Just Filed</SectionHead>

            <Link
              href={caseFileHref(justFiled)}
              className="group plate-stock plate-ink relative block overflow-hidden rounded-sm border border-bureau-ink-dark bg-bureau-ink text-bureau-manila-light shadow-md transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {justFiled.gridImage?.asset && (
                <div className="relative aspect-[4/3] border-b border-bureau-manila-light/20">
                  <Image
                    src={urlFor(justFiled.gridImage).width(896).height(672).url()}
                    alt={justFiled.imageAlt ?? ""}
                    fill
                    sizes="(max-width: 448px) 100vw, 448px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="relative z-[2] px-5 pb-6 pt-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <p className="flex items-center gap-2.5 font-typewriter text-xs uppercase tracking-eyebrow text-bureau-rust-ink">
                    <span className="block h-px w-6 bg-current opacity-70" aria-hidden="true" />
                    {caseFileDesk(justFiled)}
                    {justFiled.kind && <span className="text-bureau-manila-light/70">· {justFiled.kind}</span>}
                  </p>
                  {caseFileStatus(justFiled) && (
                    <span
                      className="shrink-0 border-2 border-bureau-rust-ink px-2 py-0.5 font-typewriter text-tag font-bold uppercase tracking-label text-bureau-rust-ink"
                      style={{ transform: "rotate(-5deg)" }}
                    >
                      {caseFileStatus(justFiled)}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-title font-bold leading-tight text-bureau-paper">
                  {justFiled.name}
                </h3>

                {(justFiled.subhead || justFiled.description) && (
                  <p className="mt-2.5 line-clamp-4 font-sans text-sm leading-relaxed text-bureau-manila-light/90">
                    {justFiled.subhead || justFiled.description}
                  </p>
                )}

                <span
                  className="stamp-btn mt-5 inline-block px-4 py-2.5 text-xs text-bureau-rust-ink"
                  style={{ "--stamp-rot": "-1.5deg" } as React.CSSProperties}
                >
                  Open the file<span aria-hidden="true">{"\u00A0→"}</span>
                </span>
              </div>
            </Link>

            {alsoFiled.length > 0 && (
              <ul className="mt-4 divide-y divide-dashed divide-border border-y border-dashed border-border">
                {alsoFiled.map((file) => (
                  <li key={file._id}>
                    <Link
                      href={caseFileHref(file)}
                      className="group flex items-center gap-3.5 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {file.gridImage?.asset ? (
                        <Image
                          src={urlFor(file.gridImage).width(112).height(112).url()}
                          alt=""
                          width={56}
                          height={56}
                          className="h-14 w-14 shrink-0 rounded-sm border border-border object-cover"
                        />
                      ) : (
                        <span className="h-14 w-14 shrink-0 rounded-sm border border-border bg-bureau-manila" aria-hidden="true" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block font-typewriter text-caption uppercase tracking-label text-muted-foreground">
                          {caseFileDesk(file)}
                          {file.kind && ` · ${file.kind}`}
                        </span>
                        <span className="block truncate font-display text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                          {file.name}
                        </span>
                      </span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-primary/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Curated directory (Link in Bio singleton) */}
        <SectionHead className="mt-12">Bureau Directory</SectionHead>
        <nav aria-label="Bureau directory" className="space-y-4">
          {data.links.map((link, idx) => {
            const external = isExternal(link.url);
            const key = link._key ?? `${link.url}-${idx}`;
            const caseNo = String(idx + 1).padStart(2, "0");
            const isFeatured = link.badge?.toUpperCase() === "FEATURED";

            const inner = (
              <div className="relative z-[1]">
                {/* File header: case number + stamp badge */}
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <span className="font-typewriter text-tag uppercase tracking-eyebrow text-bureau-ink-muted">
                    Case No. {caseNo}
                  </span>
                  {link.badge ? (
                    <span
                      style={{ transform: "rotate(2.5deg)" }}
                      className={cn(
                        "shrink-0 border-2 px-2 py-0.5 font-display text-tag font-bold uppercase tracking-eyebrow shadow-[inset_0_0_0_1px_currentColor]",
                        isFeatured
                          ? "border-destructive text-destructive"
                          : "border-accent text-accent"
                      )}
                    >
                      {link.badge}
                    </span>
                  ) : (
                    <span className="font-typewriter text-tag uppercase tracking-eyebrow text-muted-foreground/40">
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

        {/* Socials */}
        {data.socials && data.socials.length > 0 && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="block h-px w-6 bg-border" aria-hidden="true" />
              <span className="font-typewriter text-tag uppercase tracking-eyebrow text-bureau-ink-muted">
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
                      className="block border border-accent/40 px-3 py-1.5 font-typewriter text-caption uppercase tracking-label text-bureau-ink-muted transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
          <p className="font-typewriter text-tag uppercase tracking-eyebrow text-bureau-ink-muted">
            Filed ◆ Appalachian Region ◆ {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
