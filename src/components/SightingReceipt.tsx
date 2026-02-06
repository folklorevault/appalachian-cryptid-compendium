import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Stamp } from "@/components/Stamp";
import { FileText, RotateCcw } from "lucide-react";

interface SubmissionData {
  witnessName: string;
  date: string;
  location: string;
  state: string;
  creatureName?: string;
}

interface SightingReceiptProps {
  submissionData: SubmissionData;
  onFileAnother: () => void;
}

/**
 * Generates a case number in format SIG-YYYY-MMDD-XXXX
 * where XXXX is a random 4-digit hex string
 */
function generateCaseNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const suffix = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `SIG-${year}-${month}${day}-${suffix}`;
}

/**
 * Redacts a name to show first initial + last name
 * e.g., "Kathryn Welborn" -> "K. Welborn"
 */
function redactName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return `${parts[0].charAt(0)}.`;
  }
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastName = parts[parts.length - 1];
  return `${firstInitial}. ${lastName}`;
}

export const SightingReceipt = ({ submissionData, onFileAnother }: SightingReceiptProps) => {
  const caseNumber = generateCaseNumber();
  const redactedName = redactName(submissionData.witnessName);

  // Format the date for display
  const formattedDate = submissionData.date
    ? new Date(submissionData.date + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "[DATE PENDING]";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative mt-4" style={{ transform: "rotate(-0.5deg)" }}>
        {/* Paper Clip */}
        <div className="paper-clip" aria-hidden="true" />

        {/* Main Receipt Paper */}
        <div className="memo-paper border border-border/40 rounded-sm p-6 pt-8 pl-10 relative overflow-hidden">
          {/* Three-hole punch marks */}
          <div className="hole-punch" style={{ top: "30px" }} aria-hidden="true" />
          <div className="hole-punch" style={{ top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
          <div className="hole-punch" style={{ bottom: "30px" }} aria-hidden="true" />

          {/* Form Reference Number */}
          <div className="memo-form-ref absolute top-3 right-4 text-right">
            Form No. ACD-12R<br />
            Rev. 03/1974
          </div>

          {/* RECEIVED Stamp */}
          <div className="absolute top-20 right-8 z-20">
            <Stamp
              text="Received"
              variant="primary"
              rotation={-8}
              className="text-lg px-6 py-2"
            />
          </div>

          {/* File Copy Stamp */}
          <div className="absolute top-44 left-4 z-20">
            <Stamp
              text="File Copy"
              variant="muted"
              rotation={-15}
              className="text-[10px] px-3 py-1 opacity-50 border-2"
            />
          </div>

          {/* Receipt Header */}
          <div className="memo-header">
            <div className="memo-letterhead">
              Appalachian Cryptid Division<br />
              Department of Unexplained Phenomena
            </div>
            <div className="memo-title mt-4 mb-6 text-center">
              <span className="border-b-2 border-foreground/30 pb-1">
                Sighting Report — Filed
              </span>
            </div>
          </div>

          {/* Case Number */}
          <div className="bg-muted/30 border border-border rounded p-3 mb-6 font-typewriter">
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Assigned Case Number
            </div>
            <div className="text-lg font-bold tracking-wider">
              {caseNumber}
            </div>
          </div>

          {/* Submission Summary */}
          <div className="space-y-3 mb-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter border-b border-dashed border-foreground/20 pb-1">
              Report Summary
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-2 text-sm font-typewriter">
              <span className="text-muted-foreground">Witness:</span>
              <span className="text-foreground">{redactedName}</span>

              <span className="text-muted-foreground">Date of Incident:</span>
              <span className="text-foreground">{formattedDate}</span>

              <span className="text-muted-foreground">Location:</span>
              <span className="text-foreground">{submissionData.location}, {submissionData.state}</span>

              <span className="text-muted-foreground">Subject:</span>
              <span className="text-foreground">
                {submissionData.creatureName || "Unidentified Cryptid"}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="bg-secondary/20 border border-secondary/40 rounded p-3 mb-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-secondary" />
              <span className="text-xs uppercase tracking-widest font-typewriter text-secondary font-bold">
                Status: Pending Field Review
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="memo-body text-sm leading-relaxed mb-6">
            Your report has been logged and assigned to the nearest field office.
            A field agent may contact you if additional details are required for
            the ongoing investigation. Please retain this receipt for your records.
            <br /><br />
            <em className="text-muted-foreground">
              Do not discuss the contents of this report with unauthorized personnel.
            </em>
          </div>

          {/* Classification Footer */}
          <div className="pt-3 border-t border-dashed border-foreground/20">
            <p className="memo-footer">
              For Official Use Only — Distribution Restricted
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons - outside the paper for cleaner styling */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
        <Button
          onClick={onFileAnother}
          variant="outline"
          className="border-2 border-border hover:bg-muted"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          File Another Report
        </Button>
        <Link to="/">
          <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
            Return to Directory
          </Button>
        </Link>
      </div>
    </div>
  );
};
