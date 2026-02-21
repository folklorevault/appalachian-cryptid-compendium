import { useState } from "react";
import { Stamp } from "@/components/Stamp";
import { Send, CheckCircle } from "lucide-react";

type SignupState = "idle" | "submitting" | "success" | "error";

interface NewsletterSignupProps {
  variant?: "full" | "compact";
}

function useNewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SignupState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setErrorMsg("A valid transmission address is required.");
      setState("error");
      return;
    }

    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setState("success");
      } else {
        setErrorMsg(data.error || "Transmission failed. Try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Transmission failed. Try again.");
      setState("error");
    }
  };

  return { email, setEmail, state, setState, errorMsg, handleSubmit };
}

// ─── COMPACT VARIANT ───────────────────────────────────────
// Slim inline strip for detail pages - no clips, stamps, or letterhead

const CompactSignup = () => {
  const { email, setEmail, state, setState, errorMsg, handleSubmit } = useNewsletterForm();

  if (state === "success") {
    return (
      <div className="newsletter-paper memo-paper border border-border/40 rounded-sm px-5 py-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
          <p className="text-sm font-typewriter text-foreground/80">
            Registered. You'll get an email when new case files drop.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="newsletter-paper memo-paper border border-border/40 rounded-sm px-5 py-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-3">
        Get notified when new cryptids are added to the guide
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === "error") setState("idle");
            }}
            placeholder="your email address"
            className="newsletter-input w-full bg-transparent border-0 border-b-2 border-dashed border-foreground/30 rounded-none px-0 py-1.5 font-typewriter text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-colors"
            disabled={state === "submitting"}
          />
          {state === "error" && errorMsg && (
            <p className="text-[10px] text-destructive font-typewriter mt-1 uppercase tracking-wider">
              {errorMsg}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="newsletter-stamp-btn self-end sm:self-auto inline-flex items-center gap-1.5 px-4 py-1.5 border-[3px] border-primary rounded-sm font-bold uppercase tracking-widest text-xs font-display text-primary shadow-[inset_0_0_0_1.5px_hsl(var(--primary))] hover:bg-primary/10 active:bg-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <span
            className="flex items-center gap-1.5"
            style={{ filter: "url(#stamp-texture)" }}
          >
            {state === "submitting" ? (
              <>Processing...</>
            ) : (
              <>
                <Send className="h-3 w-3" />
                Register
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

// ─── FULL VARIANT ──────────────────────────────────────────
// Complete memo-paper form with stamps, clips, and letterhead

const FullSignup = () => {
  const { email, setEmail, state, setState, errorMsg, handleSubmit } = useNewsletterForm();

  // Success state - receipt style
  if (state === "success") {
    return (
      <div className="max-w-xl mx-auto">
        <div className="relative" style={{ transform: "rotate(-0.3deg)" }}>
          <div className="paper-clip" aria-hidden="true" />

          <div className="newsletter-paper memo-paper border border-border/40 rounded-sm p-6 pt-8 pl-10 relative overflow-hidden">
            {/* Hole punches */}
            <div className="hole-punch" style={{ top: "30px" }} aria-hidden="true" />
            <div className="hole-punch" style={{ top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
            <div className="hole-punch" style={{ bottom: "30px" }} aria-hidden="true" />

            {/* Confirmed stamp */}
            <div className="absolute top-6 right-6 z-20">
              <Stamp
                text="Confirmed"
                variant="primary"
                rotation={-8}
                className="text-sm px-4 py-1.5"
              />
            </div>

            {/* Form ref */}
            <div className="memo-form-ref absolute top-3 right-4 text-right">
              Form No. ACD-104R<br />
              Rev. 06/1973
            </div>

            {/* Letterhead */}
            <div className="memo-header">
              <div className="memo-letterhead">
                Appalachian Cryptid Division<br />
                Department of Unexplained Phenomena
              </div>
              <div className="memo-title mt-3">
                Roster Addition — Confirmed
              </div>
            </div>

            {/* Confirmation content */}
            <div className="flex items-start gap-3 mt-4 mb-4">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="memo-body text-sm leading-relaxed">
                Your transmission address has been logged with the Bureau.
                You will receive dispatches as new case files are processed
                and field advisories are issued.
              </div>
            </div>

            {/* Email display */}
            <div className="bg-muted/30 border border-border rounded p-3 font-typewriter">
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                Registered Address
              </div>
              <div className="text-sm tracking-wider">
                {email}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-dashed border-foreground/20">
              <p className="memo-footer">
                For Official Use Only — Distribution Restricted
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default form state
  return (
    <div className="max-w-xl mx-auto">
      <div className="relative" style={{ transform: "rotate(0.4deg)" }}>
        {/* Paper Clip */}
        <div className="paper-clip" aria-hidden="true" />

        {/* Main Paper */}
        <div className="newsletter-paper memo-paper border border-border/40 rounded-sm p-6 pt-8 pl-10 relative overflow-hidden">
          {/* Three-hole punch marks */}
          <div className="hole-punch" style={{ top: "30px" }} aria-hidden="true" />
          <div className="hole-punch" style={{ top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
          <div className="hole-punch" style={{ bottom: "30px" }} aria-hidden="true" />

          {/* Form ref number */}
          <div className="memo-form-ref absolute top-3 right-4 text-right">
            Form No. ACD-104<br />
            Rev. 06/1973
          </div>

          {/* FORM 104: ROSTER ADDITION stamp - faded red, rotated */}
          <div className="absolute -top-3 right-14 z-20">
            <Stamp
              text="Form 104: Roster Addition"
              variant="danger"
              rotation={-6}
              className="text-[8px] px-2 py-0.5 opacity-50 border-2"
            />
          </div>

          {/* File Copy stamp */}
          <div className="absolute bottom-8 left-4 z-20">
            <Stamp
              text="File Copy"
              variant="muted"
              rotation={-15}
              className="text-[8px] px-2 py-0.5 opacity-30 border-2"
            />
          </div>

          {/* Letterhead */}
          <div className="memo-header">
            <div className="memo-letterhead">
              Appalachian Cryptid Division<br />
              Department of Unexplained Phenomena
            </div>
            <div className="memo-title mt-3">
              Personnel Dispatch Roster
            </div>
          </div>

          {/* Directive title */}
          <div className="mt-4 mb-3 relative z-[2]">
            <h3 className="text-base md:text-lg font-bold text-foreground font-display uppercase tracking-wide">
              Standing Order: Register for Bureau Dispatches
            </h3>
          </div>

          {/* Body text */}
          <div className="memo-body text-[11px] leading-relaxed mb-5">
            All field operatives and interested civilians are directed to register
            their transmission address with the Bureau. You will be notified of new
            case file additions, updated threat assessments, field advisories, and
            reclassification notices as they are processed.
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-[2]">
            {/* Email input - typewriter style with dotted underline */}
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                Transmission Address (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                  }}
                  placeholder="operative.email@field-office.gov"
                  className="newsletter-input w-full bg-transparent border-0 border-b-2 border-dashed border-foreground/30 rounded-none px-0 py-2 font-typewriter text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-colors"
                  disabled={state === "submitting"}
                />
              </div>
              {state === "error" && errorMsg && (
                <p className="text-xs text-destructive font-typewriter mt-1.5 uppercase tracking-wider">
                  {errorMsg}
                </p>
              )}
            </div>

            {/* Submit button - stamp styled */}
            <button
              type="submit"
              disabled={state === "submitting"}
              className="newsletter-stamp-btn group relative inline-flex items-center gap-2 px-6 py-2.5 border-4 border-primary rounded-sm font-bold uppercase tracking-widest text-sm font-display text-primary shadow-[inset_0_0_0_2px_hsl(var(--primary))] hover:bg-primary/10 active:bg-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ transform: "rotate(-1deg)" }}
            >
              <span
                className="block"
                style={{ filter: "url(#stamp-texture)" }}
              >
                {state === "submitting" ? (
                  <>Processing...</>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-3.5 w-3.5" />
                    Register
                  </span>
                )}
              </span>
            </button>
          </form>

          {/* Disclaimer */}
          <div className="mt-5 pt-3 border-t border-dashed border-foreground/20">
            <p className="memo-footer">
              Bureau dispatches are infrequent and classified. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── EXPORT ────────────────────────────────────────────────

export const NewsletterSignup = ({ variant = "full" }: NewsletterSignupProps) => {
  if (variant === "compact") return <CompactSignup />;
  return <FullSignup />;
};
