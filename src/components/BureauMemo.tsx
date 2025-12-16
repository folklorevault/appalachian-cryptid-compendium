import { Stamp } from "@/components/Stamp";

interface BureauMemoProps {
  content: string;
  cryptidName: string;
  caseNumber?: string;
}

export const BureauMemo = ({ content, cryptidName, caseNumber }: BureauMemoProps) => {
  return (
    <div className="relative mt-4" style={{ transform: "rotate(-1.5deg)" }}>
      {/* Paper Clip */}
      <div className="paper-clip" aria-hidden="true" />

      {/* Main Memo Paper */}
      <div className="memo-paper border border-border/40 rounded-sm p-6 pt-8 pl-10 relative overflow-hidden">
        {/* Three-hole punch marks */}
        <div className="hole-punch" style={{ top: "30px" }} aria-hidden="true" />
        <div className="hole-punch" style={{ top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
        <div className="hole-punch" style={{ bottom: "30px" }} aria-hidden="true" />

        {/* Form Reference Number */}
        <div className="memo-form-ref absolute top-3 right-4 text-right">
          Form No. ACD-47B<br />
          Rev. 08/1972
        </div>

        {/* Internal Memo Stamp */}
        <div className="absolute -top-3 right-12 z-20">
          <Stamp
            text="Internal"
            variant="muted"
            rotation={-3}
            className="text-[9px] px-2 py-1 opacity-60 border-2"
          />
        </div>

        {/* File Copy Stamp */}
        <div className="absolute top-16 left-6 z-20">
          <Stamp
            text="File Copy"
            variant="muted"
            rotation={-12}
            className="text-[8px] px-2 py-0.5 opacity-40 border-2"
          />
        </div>

        {/* Memo Header */}
        <div className="memo-header">
          <div className="memo-letterhead">
            Appalachian Cryptid Division<br />
            Department of Unexplained Phenomena
          </div>
          <div className="memo-title">
            Internal Memorandum
          </div>
          <div className="space-y-1">
            <div className="memo-meta-line">
              <span className="memo-meta-label">To:</span>
              <span className="memo-meta-value">Field Research Division</span>
            </div>
            <div className="memo-meta-line">
              <span className="memo-meta-label">From:</span>
              <span className="memo-meta-value">Regional Director</span>
            </div>
            <div className="memo-meta-line">
              <span className="memo-meta-label">Date:</span>
              <span className="memo-meta-value">[CLASSIFIED]</span>
            </div>
            <div className="memo-meta-line">
              <span className="memo-meta-label">Re:</span>
              <span className="memo-meta-value">{cryptidName} - Case {caseNumber || "Update"}</span>
            </div>
          </div>
        </div>

        {/* Memo Body */}
        <div className="memo-body">
          {content}
        </div>

        {/* Bureau Seal/Logo Stamp */}
        <div className="absolute bottom-12 right-6 z-10 pointer-events-none" aria-hidden="true">
          <img
            src="/appalachian-cryptid-logo.webp"
            alt=""
            className="w-24 h-24 opacity-[0.15] sepia saturate-0"
            style={{
              transform: "rotate(8deg)",
              filter: "sepia(100%) saturate(0%) brightness(0.4)"
            }}
          />
        </div>

        {/* Classification Footer */}
        <div className="mt-6 pt-3 border-t border-dashed border-foreground/20">
          <p className="memo-footer">
            For Official Use Only — Distribution Restricted
          </p>
        </div>
      </div>
    </div>
  );
};
