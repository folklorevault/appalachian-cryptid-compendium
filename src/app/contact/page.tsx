import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact & Support",
  description:
    "Get in touch with the Appalachian Cryptid Field Guide and Shop.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact & Support | Appalachian Cryptid Field Guide",
    description:
      "Get in touch with the Appalachian Cryptid Field Guide and Shop.",
    url: "https://appalachiancryptid.com/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact & Support | Appalachian Cryptid Field Guide",
    description:
      "Get in touch with the Appalachian Cryptid Field Guide and Shop.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background paper-texture">
      <main id="main-content">
        <div className="max-w-3xl mx-auto px-6 pt-12 pb-6">
          <span className="font-typewriter text-xs tracking-eyebrow uppercase text-bureau-ink-muted">
            Bureau of Appalachian Cryptid Documentation
          </span>
          <h1 className="mt-3 font-display font-bold text-foreground leading-tight text-[clamp(2rem,5vw,3rem)]">
            Contact &amp; Support
          </h1>
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <hr className="border-t-2 border-bureau-ink-muted mb-10" />
        </div>

        <article className="max-w-3xl mx-auto px-6 pb-16 text-foreground/90 leading-relaxed">
          <p className="mb-8">
            We&rsquo;re a small, one-person operation — Welborn Creative
            Studio, based in Johnson City, Tennessee. We read every message
            and typically respond within a few business days.
          </p>

          <a
            href="mailto:dispatch@appalachiancryptid.com"
            className="inline-flex items-center gap-2 mb-10 px-6 py-3 border-[3px] border-bureau-stamp rounded-sm font-bold uppercase tracking-widest text-sm font-display text-bureau-stamp shadow-[inset_0_0_0_1.5px_hsl(var(--bureau-stamp))] hover:bg-[hsl(var(--bureau-stamp)/0.06)] active:bg-[hsl(var(--bureau-stamp)/0.12)] transition-all duration-200"
          >
            <Mail className="h-4 w-4" />
            dispatch@appalachiancryptid.com
          </a>

          <h2 className="font-display text-xl font-bold text-foreground mt-4 mb-3">
            What to reach out about
          </h2>
          <div className="space-y-4">
            <div className="pl-4 border-l-2 border-border">
              <strong className="block text-foreground">
                Shop orders
              </strong>
              <span className="text-foreground/80">
                Damaged, incorrect, or missing orders — email us with your
                Stripe receipt and we&rsquo;ll sort it out. See our{" "}
                <a
                  href="/terms"
                  className="text-primary underline underline-offset-2"
                >
                  Terms &amp; Conditions
                </a>{" "}
                for our order policy.
              </span>
            </div>
            <div className="pl-4 border-l-2 border-border">
              <strong className="block text-foreground">
                Sighting reports
              </strong>
              <span className="text-foreground/80">
                To submit a new encounter, use the{" "}
                <a
                  href="/report"
                  className="text-primary underline underline-offset-2"
                >
                  sighting report form
                </a>
                . To correct or remove a report you already filed, email us.
              </span>
            </div>
            <div className="pl-4 border-l-2 border-border">
              <strong className="block text-foreground">
                Privacy &amp; data requests
              </strong>
              <span className="text-foreground/80">
                See our{" "}
                <a
                  href="/privacy"
                  className="text-primary underline underline-offset-2"
                >
                  Privacy Policy
                </a>{" "}
                for how to access, correct, or delete your information.
              </span>
            </div>
            <div className="pl-4 border-l-2 border-border">
              <strong className="block text-foreground">
                Everything else
              </strong>
              <span className="text-foreground/80">
                Press, corrections, story tips, or just to say hello — email
                is the best way to reach us.
              </span>
            </div>
          </div>
        </article>
      </main>

      <Footer variant="full" />
    </div>
  );
}
