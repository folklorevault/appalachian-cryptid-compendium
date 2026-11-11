"use client";

import { useState, type ReactNode } from "react";
import { analytics } from "@/lib/analytics";
import { CONTACT_EMAIL, contactMailto } from "@/lib/contact";

// Tracked ways to reach the inbox. "contact_email_click" and
// "contact_email_copy" in Rybbit show whether people are trying to write in;
// clicks without matching emails would point to webmail users dead-ending on
// mailto, which is the case for adding a contact form.

interface EmailLinkProps {
  location: string;
  subject?: string;
  className?: string;
  children: ReactNode;
}

export function EmailLink({ location, subject, className, children }: EmailLinkProps) {
  return (
    <a
      href={contactMailto(subject)}
      onClick={() =>
        analytics.trackEvent("contact_email_click", { location, subject: subject ?? "none" })
      }
      className={className}
    >
      {children}
    </a>
  );
}

export function CopyEmailButton({ location, className }: { location: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = CONTACT_EMAIL;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    analytics.trackEvent("contact_email_copy", { location });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" onClick={handleCopy} className={className}>
      <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
    </button>
  );
}
