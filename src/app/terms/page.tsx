import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms governing use of the Appalachian Cryptid Field Guide and Shop.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms & Conditions | Appalachian Cryptid Field Guide",
    description:
      "Terms governing use of the Appalachian Cryptid Field Guide and Shop.",
    url: "https://appalachiancryptid.com/terms",
  },
  twitter: {
    card: "summary",
    title: "Terms & Conditions | Appalachian Cryptid Field Guide",
    description:
      "Terms governing use of the Appalachian Cryptid Field Guide and Shop.",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background paper-texture">
      <main id="main-content">
        <div className="max-w-3xl mx-auto px-6 pt-12 pb-6">
          <span className="font-typewriter text-xs tracking-eyebrow uppercase text-bureau-ink-muted">
            Bureau of Appalachian Cryptid Documentation
          </span>
          <h1 className="mt-3 font-display font-bold text-foreground leading-tight text-[clamp(2rem,5vw,3rem)]">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm text-muted-foreground font-typewriter">
            Last updated July 19, 2026
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <hr className="border-t-2 border-bureau-ink-muted mb-10" />
        </div>

        <article className="max-w-3xl mx-auto px-6 pb-16 text-foreground/90 leading-relaxed">
          <p className="mb-6">
            These terms govern your use of the Appalachian Cryptid Field
            Guide and Shop (&ldquo;the site&rdquo;), operated by Welborn
            Creative Studio, a sole proprietorship based in Johnson City,
            Tennessee. By using the site, you agree to these terms.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Site content
          </h2>
          <p className="mb-4">
            This site is a folklore and entertainment project. Cryptid
            entries, anomaly reports, bulletins, and community-submitted
            sighting accounts are presented for storytelling and archival
            purposes — they are not verified scientific claims, and nothing
            here should be treated as fact.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Submitting a sighting report
          </h2>
          <p className="mb-4">
            When you submit a sighting report, you grant us permission to
            publish, edit, and redact it for the site — including removing
            identifying details to protect your anonymity, per our{" "}
            <a href="/privacy" className="text-primary underline underline-offset-2">
              Privacy Policy
            </a>
            . We review submissions before publishing and reserve the right
            to decline or remove any submission at our discretion.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Shop purchases
          </h2>
          <p className="mb-4">
            Orders placed through the Appalachian Cryptid Shop are processed
            by Stripe via an external checkout page. Shipping timelines and
            costs are shown at checkout. If your order arrives damaged,
            incorrect, or doesn&rsquo;t show up, contact{" "}
            <a
              href="mailto:dispatch@appalachiancryptid.com"
              className="text-primary underline underline-offset-2"
            >
              dispatch@appalachiancryptid.com
            </a>{" "}
            within 30 days of delivery and we&rsquo;ll work with you to make
            it right.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Intellectual property
          </h2>
          <p className="mb-4">
            The site&rsquo;s design, original writing, and artwork belong to
            Welborn Creative Studio. The folklore and oral traditions we
            document belong to the communities who originated them — we
            catalog and credit these stories, we don&rsquo;t claim to have
            invented them.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            No professional advice
          </h2>
          <p className="mb-4">
            Content on this site is for entertainment and informational
            purposes only and isn&rsquo;t a substitute for professional,
            legal, medical, or safety advice.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Limitation of liability
          </h2>
          <p className="mb-4">
            The site is provided &ldquo;as is,&rdquo; without warranties of
            any kind. To the extent permitted by law, Welborn Creative Studio
            isn&rsquo;t liable for any indirect, incidental, or consequential
            damages arising from your use of the site.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Governing law
          </h2>
          <p className="mb-4">
            These terms are governed by the laws of the State of Tennessee,
            United States, without regard to conflict-of-law principles.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Changes to these terms
          </h2>
          <p className="mb-4">
            If these terms change, we&rsquo;ll update the date at the top of
            this page.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Contact
          </h2>
          <p>
            Questions about these terms can be sent to{" "}
            <a
              href="mailto:dispatch@appalachiancryptid.com"
              className="text-primary underline underline-offset-2"
            >
              dispatch@appalachiancryptid.com
            </a>
            .
          </p>
        </article>
      </main>

      <Footer variant="full" />
    </div>
  );
}
