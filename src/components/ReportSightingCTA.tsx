import Link from "next/link";
import { Stamp } from "@/components/Stamp";
import { FileText, ArrowRight } from "lucide-react";

interface ReportSightingCTAProps {
  cryptidName: string;
  cryptidSlug?: string;
}

export const ReportSightingCTA = ({ cryptidName, cryptidSlug }: ReportSightingCTAProps) => {
  const reportHref = cryptidSlug
    ? `/report?cryptid=${encodeURIComponent(cryptidName)}`
    : "/report";

  return (
    <aside aria-labelledby="report-cta-heading" className="my-10">
      <div className="relative" style={{ transform: "rotate(-0.3deg)" }}>
        <div className="paper-clip" aria-hidden="true" />

        <div className="memo-paper border border-border/40 rounded-sm p-6 pt-7 pl-10 relative overflow-hidden">
          <div className="hole-punch" style={{ top: "30px" }} aria-hidden="true" />
          <div className="hole-punch" style={{ top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
          <div className="hole-punch" style={{ bottom: "30px" }} aria-hidden="true" />

          <div className="absolute top-3 right-4 z-20">
            <Stamp
              text="Field Inquiry"
              variant="primary"
              rotation={-6}
              className="text-[10px] px-2 py-0.5 opacity-70"
            />
          </div>

          <div className="memo-form-ref absolute bottom-3 right-4 text-right">
            Form No. ACD-12<br />
            Citizen Tipline
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 relative z-2">
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-sm border-2 border-bureau-border bg-muted/30 flex items-center justify-center">
                <FileText className="h-6 w-6 text-foreground/70" aria-hidden="true" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-eyebrow text-muted-foreground font-typewriter mb-1">
                Witness Report Requested
              </div>
              <h2 id="report-cta-heading" className="text-lg sm:text-xl font-bold text-foreground font-display leading-tight">
                Have you seen the {cryptidName}?
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5 font-typewriter">
                File a sighting with the Bureau. Anonymous reports welcome — no account needed.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href={reportHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 border-[3px] border-primary rounded-sm font-bold uppercase tracking-widest text-xs font-display text-primary shadow-[inset_0_0_0_1.5px_hsl(var(--primary))] hover:bg-primary/10 active:bg-primary/20 transition-colors duration-200 whitespace-nowrap"
                style={{ transform: "rotate(-1deg)" }}
              >
                <span className="flex items-center gap-1.5" style={{ filter: "url(#__svg-stamp-texture)" }}>
                  File Report
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
