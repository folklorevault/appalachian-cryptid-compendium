import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Appalachian Cryptid for shop support, corrections, press inquiries, and privacy requests.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Appalachian Cryptid Field Guide",
    description:
      "Contact Appalachian Cryptid for shop support, corrections, press inquiries, and privacy requests.",
    url: "https://appalachiancryptid.com/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact | Appalachian Cryptid Field Guide",
    description:
      "Contact Appalachian Cryptid for shop support, corrections, press inquiries, and privacy requests.",
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
            Contact
          </h1>
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <hr className="border-t-2 border-bureau-ink-muted mb-10" />
        </div>

        <article className="max-w-3xl mx-auto px-6 pb-16 text-foreground/90 leading-relaxed">
          <p className="mb-6">
            For shop support, corrections, press inquiries, or anything else
            related to Appalachian Cryptid, email:
          </p>

          <a
            href="mailto:dispatch@appalachiancryptid.com"
            className="inline-flex items-center gap-2 mb-6 px-6 py-3 border-[3px] border-bureau-stamp rounded-sm font-bold tracking-wide text-sm font-display text-bureau-stamp shadow-[inset_0_0_0_1.5px_hsl(var(--bureau-stamp))] hover:bg-[hsl(var(--bureau-stamp)/0.06)] active:bg-[hsl(var(--bureau-stamp)/0.12)] transition-all duration-200"
          >
            <Mail className="h-4 w-4" />
            dispatch@appalachiancryptid.com
          </a>

          <p className="mb-4">
            I usually reply within a few business days.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Shop support
          </h2>
          <p className="mb-4">
            For a damaged, incorrect, delayed, or missing order, include the
            email address used at checkout and a brief description of what
            happened. Photos are helpful for damaged or incorrect items.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Corrections and privacy requests
          </h2>
          <p className="mb-4">
            You can also use this address to request a correction, ask about
            information you have submitted, or request that personal
            information be updated or removed.
          </p>
          <p>
            For details about orders and site data, see the{" "}
            <Link
              href="/terms"
              className="font-bold text-primary underline underline-offset-2"
            >
              Terms of Use &amp; Shop Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-bold text-primary underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </article>
      </main>

      <Footer variant="full" />
    </div>
  );
}
