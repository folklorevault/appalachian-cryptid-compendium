'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Stamp } from '@/components/Stamp';
import styles from '@/components/AboutContent.module.css';

// Dry filing labels drive the index/nav; each section's in-body heading is the
// punchy statement itself (see the <h2>s below), so the visible hierarchy and
// the accessibility tree agree instead of inverting.
const SECTIONS = [
  { id: 'mandate', num: '01', label: 'Mandate' },
  { id: 'terrain', num: '02', label: 'Terrain' },
  { id: 'protocols', num: '03', label: 'Protocols' },
  { id: 'classification', num: '04', label: 'Classification' },
  { id: 'security', num: '05', label: 'Witness Security' },
] as const;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function AboutContent() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);

  // Scroll-spy via IntersectionObserver — no per-frame layout reads. A thin
  // band near the top of the viewport acts as the "you are here" trip line.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const topMost = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (topMost) {
          // Functional update: return prev unchanged (no re-render) when the
          // active section hasn't moved, so we don't need a ref to read it.
          setActiveSection((prev) =>
            topMost.target.id !== prev ? topMost.target.id : prev
          );
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: 0 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const yOffset = -100;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    setActiveSection(id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 relative">
      {/* LEFT: sticky filing index (desktop) */}
      <nav aria-label="Directive contents" className="hidden md:block w-64 shrink-0 z-10">
        <div className="sticky top-24">
          <div className="text-xs font-typewriter text-muted-foreground mb-4 tracking-widest uppercase border-b border-border pb-2">
            Index: Directive 001
          </div>

          <ul className="flex flex-col space-y-2">
            {SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(section.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`
                      ${styles.filingTab} flex w-full items-baseline gap-2 text-left py-3 px-4 pr-6 font-typewriter text-xs uppercase tracking-wider
                      ${isActive ? `${styles.filingTabActive} text-foreground font-bold` : 'text-foreground/70'}
                    `}
                  >
                    <span className="tabular-nums text-bureau-stamp-ink/70">{section.num}</span>
                    <span>{section.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Decorative: "classified" footer on sidebar */}
          <div className="mt-12 p-4 border border-border text-xs text-muted-foreground font-typewriter leading-tight bg-card/50">
            <span className="block font-bold mb-1">AUTHORIZED PERSONNEL ONLY</span>
            Violation of Bureau protocols regarding witness anonymity will result in immediate
            revocation of access.
          </div>
        </div>
      </nav>

      {/* RIGHT: the directive */}
      <div className="flex-1 bg-card p-6 sm:p-8 md:p-12 shadow-xs border-l border-border relative vintage-frame">
        {/* Directive header — memo artifact */}
        <div className="relative mb-12" style={{ transform: 'rotate(-0.5deg)' }}>
          <div className="paper-clip" aria-hidden="true" />

          {/* Declassified stamp — kept outside memo-paper's overflow clip so its
              top edge isn't cut off where it overhangs the sheet. */}
          <div className="absolute -top-2 right-10 z-20" aria-hidden="true">
            <Stamp
              text="Declassified"
              variant="danger"
              rotation={-8}
              className="text-xs px-3 py-1 opacity-70 border-2"
            />
          </div>

          <div className="memo-paper border border-border/40 rounded-sm p-6 pt-8 pl-10 relative overflow-hidden">
            {/* Three-hole punch marks */}
            <div className="hole-punch" style={{ top: '30px' }} aria-hidden="true" />
            <div className="hole-punch" style={{ top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
            <div className="hole-punch" style={{ bottom: '30px' }} aria-hidden="true" />

            {/* Form reference number */}
            <div className="memo-form-ref absolute top-3 right-4 text-right">
              Form No. ACD-001<br />
              Rev. 01/2026
            </div>

            {/* Directive header */}
            <div className="memo-header">
              <div className="memo-letterhead">
                Appalachian Cryptid Division<br />
                Department of Unexplained Phenomena
              </div>
              <div className="memo-title">Operational Directive 001</div>
              <div className="space-y-1">
                <div className="memo-meta-line">
                  <span className="memo-meta-label">To:</span>
                  <span className="memo-meta-value">Field Research Personnel</span>
                </div>
                <div className="memo-meta-line">
                  <span className="memo-meta-label">From:</span>
                  <span className="memo-meta-value">Bureau Chief</span>
                </div>
                <div className="memo-meta-line">
                  <span className="memo-meta-label">Date:</span>
                  <span className="memo-meta-value">January 2026</span>
                </div>
                <div className="memo-meta-line">
                  <span className="memo-meta-label">Re:</span>
                  <span className="memo-meta-value">Standing mandate, terrain &amp; field protocols</span>
                </div>
              </div>
            </div>

            {/* Directive title — the page's single H1 */}
            <div className="mt-5 mb-1 relative z-2">
              <h1 className="text-title font-bold text-foreground font-display leading-tight">
                The Bureau of Appalachian Cryptid Documentation
              </h1>
              <p className="mt-2 text-sm text-foreground/70 font-sans max-w-[52ch]">
                What we do, where we work, and the rules we keep while we do it.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile: pocket field-notebook index (desktop uses the sticky sidebar) */}
        <nav aria-label="Directive contents" className="md:hidden mb-10">
          <div className="border border-border rounded-sm bg-card/60 p-4">
            <p className="text-xs font-typewriter text-muted-foreground uppercase tracking-widest border-b border-border pb-2 mb-1">
              Index: Directive 001
            </p>
            <ol className="flex flex-col">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(section.id)}
                    aria-current={activeSection === section.id ? 'location' : undefined}
                    className="flex w-full min-h-[44px] items-center gap-3 text-left font-typewriter text-xs uppercase tracking-wider text-foreground/80 hover:text-foreground border-b border-border/50 last:border-b-0"
                  >
                    <span className="tabular-nums text-bureau-stamp-ink/70">{section.num}</span>
                    <span>{section.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        {/* THE CONTENT — held to a readable measure */}
        <div className="max-w-[68ch] text-foreground/90 text-base leading-relaxed font-sans">
          {/* 01 — MANDATE */}
          <section id="mandate" className="mb-20 scroll-mt-32">
            <p className="text-xs font-typewriter text-muted-foreground uppercase tracking-widest mb-3">
              01 · Mandate
            </p>
            <h2 className="text-xl font-bold text-foreground mb-6 font-display leading-tight">
              We&rsquo;re racing against link rot.
            </h2>
            <p className="mb-4">
              For decades, the strangest stories in the American South lived in three places: front
              porches, handwritten diaries, and&mdash;for one brief, luminous window&mdash;GeoCities
              fan pages and phpBB forums.
            </p>
            <p className="mb-4">
              The porches are quieting. The forums are dying. Servers get wiped, image links break,
              and the people who kept these stories are passing on.
            </p>
            <p>
              The <strong className="text-foreground">Appalachian Cryptid Directory</strong> is a
              field office built to arrest that decay&mdash;tagging cases, cross-referencing
              sightings, and digitizing the nightmare before it disappears for good.
            </p>
          </section>

          {/* 02 — TERRAIN */}
          <section id="terrain" className="mb-20 scroll-mt-32">
            <p className="text-xs font-typewriter text-muted-foreground uppercase tracking-widest mb-3">
              02 · Terrain
            </p>
            <h2 className="text-xl font-bold text-foreground mb-6 font-display leading-tight">
              Geography sets the rules here.
            </h2>
            <p className="mb-6">
              This Bureau works a region where the land dictates reality. Three zones produce most of
              our files:
            </p>
            <ul className="list-none pl-0 space-y-4 mb-6">
              <li className="pl-4 border-l-2 border-border">
                <strong className="block text-foreground">The Hollers</strong>
                <span className="text-foreground/80">
                  Deep, isolated valleys where sound&mdash;and silence&mdash;refuses to behave.
                </span>
              </li>
              <li className="pl-4 border-l-2 border-border">
                <strong className="block text-foreground">The Coal Seams</strong>
                <span className="text-foreground/80">
                  Industrial scars where history and haunting bleed together.
                </span>
              </li>
              <li className="pl-4 border-l-2 border-border">
                <strong className="block text-foreground">The River Bottoms</strong>
                <span className="text-foreground/80">
                  Low drainages that serve as highways for things that don&rsquo;t use roads.
                </span>
              </li>
            </ul>

            {/* Field advisory — Purple Paint boundaries */}
            <div className={`${styles.fieldNoticeCard} mt-12 p-6 pt-8 text-sm relative`}>
              <div className="absolute top-2 right-3 opacity-40" aria-hidden="true">
                <Stamp text="Advisory" variant="muted" rotation={8} className="text-xs px-2 py-0.5 border" />
              </div>
              <strong className="flex items-center gap-2 text-foreground/90 uppercase tracking-wider text-xs mb-3 font-typewriter border-b border-foreground/30 pb-2">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Field Advisory: Boundaries
              </strong>
              <p className="text-foreground/90 leading-relaxed font-typewriter text-xs">
                The Bureau recognizes the sanctity of private land. In Appalachia, a fence line is a
                hard border. We do not encourage, condone, or publish anything that leads to
                trespassing. When a sighting occurs on private property, we redact the location to the
                nearest public landmark. We document the <em>phenomenon</em>, not the address. We
                honor the &ldquo;Purple Paint&rdquo; law.
              </p>
            </div>
          </section>

          {/* 03 — PROTOCOLS */}
          <section id="protocols" className="mb-20 scroll-mt-32">
            <p className="text-xs font-typewriter text-muted-foreground uppercase tracking-widest mb-3">
              03 · Protocols
            </p>
            <h2 className="text-xl font-bold text-foreground mb-6 font-display leading-tight">
              We don&rsquo;t invent monsters. We file reports.
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-foreground font-display mb-2">
                  Indigenous Primacy
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Long before modern cryptozoology named anything, the Cherokee (Aniyvwiya) and other
                  Indigenous nations of these mountains had already mapped, named, and understood much
                  of what we now file as &ldquo;cryptids.&rdquo; Often, cataloging a creature means
                  logging a chaotic modern sighting of an entity that has been known here for
                  generations. We default to the oldest name we can responsibly source, and we do not
                  claim these traditions as our own.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground font-display mb-2">
                  The &ldquo;Uncle&rdquo; Factor
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Academic folklore matters. So does the story told in a gravel driveway after church,
                  or traded over a cigarette outside the plant. If it was witnessed and it was told, it
                  goes in the file. We treat local gossip as raw intelligence.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground font-display mb-2">
                  High Strangeness
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  We embrace the glitch. When a creature walks through a wall, or a light behaves like a
                  solid object, we don&rsquo;t sand it down into something &ldquo;biological.&rdquo; We
                  log the anomaly exactly as the witness described it.
                </p>
              </div>
            </div>
          </section>

          {/* 04 — CLASSIFICATION */}
          <section id="classification" className="mb-20 scroll-mt-32">
            <p className="text-xs font-typewriter text-muted-foreground uppercase tracking-widest mb-3">
              04 · Classification
            </p>
            <h2 className="text-xl font-bold text-foreground mb-6 font-display leading-tight">
              Two desks: living things, and things that only feel alive.
            </h2>
            <p className="mb-8">
              The Directory runs two desks, separating biological entities from environmental events.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Desk 01 — memo-paper card, matching the bulletin card elsewhere */}
              <div className="memo-paper memo-flat relative border border-border/60 rounded-[2px] p-6">
                <div className="relative z-[2]">
                  <span className="text-xs font-typewriter font-bold text-foreground/60 block mb-2">
                    DESK 01 // BIOLOGICAL
                  </span>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-display">
                    Cryptids
                  </h3>
                  <p className="text-sm text-foreground/90 mb-2 font-bold">
                    Biological / Corporeal
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Entities that leave footprints, hunt on a pattern, and behave like undiscovered
                    flora or fauna. (The Woodbooger. The Wampus Cat.)
                  </p>
                </div>
              </div>

              {/* Desk 02 — memo-paper card */}
              <div className="memo-paper memo-flat relative border border-border/60 rounded-[2px] p-6">
                <div className="relative z-[2]">
                  <span className="text-xs font-typewriter font-bold text-foreground/60 block mb-2">
                    DESK 02 // ENVIRONMENTAL
                  </span>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-display">
                    Anomalies
                  </h3>
                  <p className="text-sm text-foreground/90 mb-2 font-bold">
                    Environmental / Temporal
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Events where the environment itself malfunctions: lights that shouldn&rsquo;t
                    exist, sounds without a source, places where time or gravity slips.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 05 — SECURITY */}
          <section id="security" className="mb-12 scroll-mt-32">
            <p className="text-xs font-typewriter text-muted-foreground uppercase tracking-widest mb-3">
              05 · Witness Security
            </p>
            <h2 className="text-xl font-bold text-foreground mb-6 font-display leading-tight">
              We protect our sources.
            </h2>
            <p className="mb-4">
              Most people never tell their story&mdash;they&rsquo;re afraid of ridicule, or of what the
              neighbors will say. The Bureau offers witnesses total anonymity. We strip names, blur
              faces in submitted media, and obscure exact coordinates on request.
            </p>
            <p className="font-bold text-foreground leading-relaxed">
              We&rsquo;re not here to question your sanity. We&rsquo;re here to record your data.
            </p>

            {/* CTA to report */}
            <div className="mt-8 p-6 bg-primary/10 border-2 border-primary/30 text-center">
              <h3 className="text-base font-bold text-foreground mb-2 font-display">
                Seen something you can&rsquo;t explain?
              </h3>
              <p className="text-sm text-foreground/80 mb-4">
                Your account could fill in the map. Every submission is reviewed and handled with
                discretion.
              </p>
              <a
                href="/report"
                className="inline-flex items-center gap-2 px-6 py-2.5 border-[3px] border-bureau-stamp-ink rounded-sm font-bold uppercase tracking-widest text-sm font-display text-bureau-stamp-ink shadow-[inset_0_0_0_1.5px_hsl(var(--bureau-stamp-ink))] hover:bg-[hsl(var(--bureau-stamp-ink)/0.08)] active:bg-[hsl(var(--bureau-stamp-ink)/0.14)] transition-colors duration-200"
                style={{ transform: 'rotate(-1deg)' }}
              >
                <span style={{ filter: 'url(#__svg-stamp-texture)' }}>File a Report</span>
              </a>
            </div>
          </section>
        </div>

        {/* End of file marker */}
        <div className="mt-16 pt-8 border-t-2 border-dashed border-border text-center font-typewriter text-xs text-muted-foreground">
          --- END OF DIRECTIVE 001 ---
        </div>
      </div>
    </div>
  );
}
