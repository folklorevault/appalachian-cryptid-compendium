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

        {/* Memo Header */}
        <div className="memo-header max-sm:mt-6">
          <div className="memo-letterhead">
            Appalachian Cryptid Division<br />
            Department of Unexplained Phenomena
          </div>
          {/* "Internal" stamp dropped — the title already says it. File Copy sits in flow so it can't cover the TO: line. */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-3.5">
            <div className="memo-title" style={{ marginBottom: 0 }}>
              Internal Memorandum
            </div>
            <Stamp
              text="File Copy"
              variant="muted"
              rotation={-6}
              className="text-xs px-2 py-0.5 opacity-50 border-2"
            />
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
