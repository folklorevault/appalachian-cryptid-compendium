'use client';

import { useState, useEffect } from 'react';
import { Stamp } from '@/components/Stamp';
import styles from '@/components/AboutContent.module.css';

const SECTIONS = [
  { id: 'mandate', label: '01. MANDATE', title: 'Operational Mandate' },
  { id: 'terrain', label: '02. TERRAIN', title: 'Terrain & Jurisdiction' },
  { id: 'ethics', label: '03. ETHICS', title: 'Archival Protocols' },
  { id: 'class', label: '04. CLASS', title: 'Classification Standards' },
  { id: 'security', label: '05. SECURITY', title: 'Witness Security' },
];

export function AboutContent() {
  const [activeSection, setActiveSection] = useState('mandate');

  // Auto-update active tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;

      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (
          element &&
          element.offsetTop <= scrollPosition &&
          element.offsetTop + element.offsetHeight > scrollPosition
        ) {
          setActiveSection(section.id);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 relative">
          {/* LEFT SIDE: INDEX TABS (Sticky Sidebar) */}
          <nav className="hidden md:block w-64 shrink-0 z-10">
            <div className="sticky top-24">
              <div className="text-xs font-typewriter text-muted-foreground mb-4 tracking-widest uppercase border-b border-border pb-2">
                Index: Directive 001
              </div>

              <ul className="flex flex-col space-y-2">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollTo(section.id)}
                      className={`
                        ${styles.filingTab} w-full text-left py-3 px-4 pr-6 font-typewriter text-xs uppercase tracking-wider
                        ${activeSection === section.id ? `${styles.filingTabActive} text-foreground font-bold` : 'text-foreground/70'}
                      `}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* DECORATIVE: "Classified" footer on sidebar */}
              <div className="mt-12 p-4 border border-border text-xs text-muted-foreground font-typewriter leading-tight bg-card/50">
                <span className="block font-bold mb-1">AUTHORIZED PERSONNEL ONLY</span>
                Violation of Bureau protocols regarding witness anonymity will result in immediate
                revocation of access.
              </div>
            </div>
          </nav>

          {/* RIGHT SIDE: THE CONTENT */}
          <div className="flex-1 bg-card p-8 md:p-12 shadow-xs min-h-screen border-l border-border relative vintage-frame">
            {/* Directive Header - Memo Style */}
            <div className="relative mb-12" style={{ transform: "rotate(-0.5deg)" }}>
              {/* Paper Clip */}
              <div className="paper-clip" aria-hidden="true" />

              {/* Memo Paper */}
              <div className="memo-paper border border-border/40 rounded-sm p-6 pt-8 pl-10 relative overflow-hidden">
                {/* Three-hole punch marks */}
                <div className="hole-punch" style={{ top: "30px" }} aria-hidden="true" />
                <div className="hole-punch" style={{ top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
                <div className="hole-punch" style={{ bottom: "30px" }} aria-hidden="true" />

                {/* Form Reference Number */}
                <div className="memo-form-ref absolute top-3 right-4 text-right">
                  Form No. ACD-001<br />
                  Rev. 01/2026
                </div>

                {/* Declassified Stamp */}
                <div className="absolute -top-3 right-12 z-20">
                  <Stamp
                    text="Declassified"
                    variant="danger"
                    rotation={-8}
                    className="text-xs px-3 py-1 opacity-70 border-2"
                  />
                </div>

                {/* Internal Stamp */}
                <div className="absolute top-20 left-6 z-20">
                  <Stamp
                    text="Public Record"
                    variant="muted"
                    rotation={-15}
                    className="text-xs px-2 py-0.5 opacity-40 border-2"
                  />
                </div>

                {/* Directive Header */}
                <div className="memo-header">
                  <div className="memo-letterhead">
                    Appalachian Cryptid Division<br />
                    Department of Unexplained Phenomena
                  </div>
                  <div className="memo-title">
                    Operational Directive
                  </div>
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
                      <span className="memo-meta-value">Operational Mandate & Protocols</span>
                    </div>
                  </div>
                </div>

                {/* Directive Title */}
                <div className="mt-4 mb-2 relative z-2">
                  <h1 className="text-[28px] font-bold text-foreground font-display">
                    DIRECTIVE 001: Operational Mandate
                  </h1>
                </div>
              </div>
            </div>

            {/* THE CONTENT */}
            <div className="max-w-none text-foreground/90 text-base leading-relaxed font-sans [&_h2]:font-typewriter [&_h3]:font-display [&_strong]:text-foreground [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground/70">
              {/* SECTION 1: MANDATE */}
              <section id="mandate" className="mb-20 scroll-mt-32">
                <h2 className="text-sm font-typewriter text-muted-foreground uppercase tracking-widest mb-4">
                  01. The Objective
                </h2>
                <h3 className="text-xl font-bold text-foreground mt-0 mb-6 font-display">
                  We are racing against "Link Rot."
                </h3>
                <p className="leading-relaxed mb-4">
                  For decades, the strangest stories in the American South lived in three places:
                  front porches, handwritten diaries, and—for a brief, golden window—on GeoCities fan
                  pages and phpBB forums.
                </p>
                <p className="leading-relaxed mb-4">
                  Today, the porches are quieting down and the forums are dying. The servers are being
                  wiped, the image links are breaking, and the old keepers are passing on.
                </p>
                <p className="leading-relaxed">
                  <strong>The Appalachian Cryptid Directory</strong> functions as a digital field
                  office designed to arrest that decay. We are tagging cases, cross-referencing
                  sightings, and digitizing the nightmare before it vanishes.
                </p>
              </section>

              {/* SECTION 2: TERRAIN */}
              <section id="terrain" className="mb-20 scroll-mt-32">
                <h2 className="text-sm font-typewriter text-muted-foreground uppercase tracking-widest mb-4">
                  02. The Terrain
                </h2>
                <h3 className="text-xl font-bold text-foreground mt-0 mb-6 font-display">
                  Jurisdiction & Geography
                </h3>
                <p className="leading-relaxed mb-4">
                  This Bureau operates in a region where geography dictates reality. We focus on three
                  primary zones of high strangeness:
                </p>
                <ul className="list-none pl-0 space-y-4 mb-6">
                  <li className="pl-4 border-l-2 border-border">
                    <strong className="block text-foreground">The Hollers</strong>
                    <span className="text-foreground/80">
                      Deep, isolated acoustic valleys where sound—and silence—behaves differently.
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
                      Low-lying drainages that serve as highways for things that don't use roads.
                    </span>
                  </li>
                </ul>

                {/* FIELD NOTICE - Purple Paint Warning */}
                <div className={`${styles.fieldNoticeCard} mt-12 p-6 pt-8 text-sm relative`}>
                  <div className="absolute top-2 right-3 opacity-40">
                    <Stamp
                      text="Advisory"
                      variant="muted"
                      rotation={8}
                      className="text-xs px-2 py-0.5 border"
                    />
                  </div>
                  <strong className="block text-foreground/90 uppercase tracking-wider text-xs mb-3 font-typewriter border-b border-foreground/30 pb-2">
                    ⚠ Field Advisory: Boundaries
                  </strong>
                  <p className="text-foreground/90 leading-relaxed font-typewriter text-xs">
                    The Bureau recognizes the sanctity of private land. In Appalachia, a fence line is
                    a hard border. We do not encourage, condone, or publish information that leads to
                    trespassing. If a sighting occurred on private property, the location is redacted
                    to the nearest public landmark. We document the <em>phenomenon</em>, not the
                    address. We respect the "Purple Paint" law.
                  </p>
                </div>
              </section>

              {/* SECTION 3: ETHICS */}
              <section id="ethics" className="mb-20 scroll-mt-32">
                <h2 className="text-sm font-typewriter text-muted-foreground uppercase tracking-widest mb-4">
                  03. Archival Protocols
                </h2>
                <h3 className="text-xl font-bold text-foreground mt-0 mb-6 font-display">
                  We do not invent monsters. We file reports.
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-foreground font-display mb-2">
                      Indigenous Primacy
                    </h4>
                    <p className="text-foreground/80 leading-relaxed">
                      We acknowledge that 90% of what modern cryptozoology "discovers" was mapped,
                      named, and understood by the Cherokee (Aniyvwiya) and other Indigenous nations
                      centuries ago. When we catalog a "cryptid," we are often just filing a chaotic
                      modern sighting of an ancient, established entity. We default to the oldest name
                      whenever possible.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-foreground font-display mb-2">
                      The "Uncle" Factor
                    </h4>
                    <p className="text-foreground/80 leading-relaxed">
                      Academic folklore is valuable, but "Oral History" is vital. If a story was told
                      in a gravel driveway after church, or whispered during a smoke break outside a
                      factory, it goes in the file. We treat local gossip as raw intelligence.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-foreground font-display mb-2">
                      High Strangeness
                    </h4>
                    <p className="text-foreground/80 leading-relaxed">
                      We embrace the glitch. If a sighting involves a creature that walks through a
                      wall or a light that behaves like a solid object, we don't edit it to make it
                      "biological." We log the anomaly exactly as the witness described it.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 4: CLASSIFICATION */}
              <section id="class" className="mb-20 scroll-mt-32">
                <h2 className="text-sm font-typewriter text-muted-foreground uppercase tracking-widest mb-4">
                  04. Classification Standards
                </h2>
                <h3 className="text-xl font-bold text-foreground mt-0 mb-6 font-display">
                  The Desk System
                </h3>
                <p className="leading-relaxed mb-6">
                  The Directory is divided into two distinct desks to separate biological entities
                  from environmental events.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 ">
                  {/* Desk 01 - File Folder Card */}
                  <div className={`${styles.fileFolderCard} ${styles.indexCardLines} ${styles.indexCardMargin} p-6 pt-8 mt-4`}>
                    <span className="text-xs font-typewriter font-bold text-foreground/60 block mb-2 relative z-10">
                      DESK 01 // BIOLOGICAL
                    </span>
                    <h4 className="text-xl font-bold text-foreground mb-3 font-display relative z-10">
                      Cryptids
                    </h4>
                    <p className="text-sm text-foreground/90 mb-2 font-bold relative z-10">
                      Biological / Corporeal
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed relative z-10">
                      Entities that leave footprints, have predation patterns, and appear to be
                      undiscovered flora or fauna. (e.g., The Woodbooger, The Wampus Cat).
                    </p>
                  </div>

                  {/* Desk 02 - File Folder Card */}
                  <div className={`${styles.fileFolderCard} ${styles.indexCardLines} ${styles.indexCardMargin} p-6 pt-8 mt-4`}>
                    <span className="text-xs font-typewriter font-bold text-foreground/60 block mb-2 relative z-10">
                      DESK 02 // ENVIRONMENTAL
                    </span>
                    <h4 className="text-xl font-bold text-foreground mb-3 font-display relative z-10">
                      Anomalies
                    </h4>
                    <p className="text-sm text-foreground/90 mb-2 font-bold relative z-10">
                      Environmental / Temporal
                    </p>
                    <p className="text-sm text-foreground/80 leading-relaxed relative z-10">
                      Events where the environment itself malfunctions. Lights that shouldn't exist,
                      sounds without sources, and areas where time or gravity appears distorted.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 5: SECURITY */}
              <section id="security" className="mb-12 scroll-mt-32">
                <h2 className="text-sm font-typewriter text-muted-foreground uppercase tracking-widest mb-4">
                  05. Witness Security
                </h2>
                <h3 className="text-xl font-bold text-foreground mt-0 mb-6 font-display">
                  We protect our sources.
                </h3>
                <p className="leading-relaxed mb-4">
                  Many people never tell their stories for fear of ridicule or reputation damage. The
                  Bureau offers total anonymity to witnesses. We remove names, blur faces in submitted
                  media, and obscure exact coordinates upon request.
                </p>
                <p className="font-bold text-foreground leading-relaxed">
                  We are not here to debug your sanity; we are here to record your data.
                </p>

                {/* CTA to Report */}
                <div className="mt-8 p-6 bg-primary/10 border-2 border-primary/30 text-center">
                  <h4 className="text-base font-bold text-foreground mb-2 font-display">
                    Seen Something You Can't Explain?
                  </h4>
                  <p className="text-sm text-foreground/80 mb-4">
                    Your account could help fill in the map. All submissions are reviewed and treated
                    with discretion.
                  </p>
                  <a
                    href="/report"
                    className="inline-flex items-center gap-2 px-6 py-2.5 border-[3px] border-bureau-stamp rounded-sm font-bold uppercase tracking-widest text-sm font-display text-bureau-stamp shadow-[inset_0_0_0_1.5px_hsl(var(--bureau-stamp))] hover:bg-[hsl(var(--bureau-stamp)/0.06)] active:bg-[hsl(var(--bureau-stamp)/0.12)] transition-all duration-200"
                    style={{ transform: "rotate(-1deg)", filter: "url(#__svg-stamp-texture)" }}
                  >
                    File a Report
                  </a>
                </div>
              </section>
            </div>

            {/* End of File Marker */}
            <div className="mt-16 pt-8 border-t-2 border-dashed border-border text-center font-typewriter text-xs text-muted-foreground">
              --- END OF DIRECTIVE 001 ---
            </div>
          </div>
        </div>
  );
}
