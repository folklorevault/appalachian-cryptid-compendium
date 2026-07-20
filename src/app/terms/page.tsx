import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Use & Shop Terms",
  description:
    "Terms governing use of the Appalachian Cryptid site and purchases from the Appalachian Cryptid Shop.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Use & Shop Terms | Appalachian Cryptid Field Guide",
    description:
      "Terms governing use of the Appalachian Cryptid site and purchases from the Appalachian Cryptid Shop.",
    url: "https://appalachiancryptid.com/terms",
  },
  twitter: {
    card: "summary",
    title: "Terms of Use & Shop Terms | Appalachian Cryptid Field Guide",
    description:
      "Terms governing use of the Appalachian Cryptid site and purchases from the Appalachian Cryptid Shop.",
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
            Terms of Use &amp; Shop Terms
          </h1>
          <p className="mt-3 text-sm text-muted-foreground font-typewriter">
            Last updated July 20, 2026
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <hr className="border-t-2 border-bureau-ink-muted mb-10" />
        </div>

        <article className="max-w-3xl mx-auto px-6 pb-16 text-foreground/90 leading-relaxed">
          <p className="mb-6">
            Appalachian Cryptid is operated by Welborn Creative Studio, my
            sole proprietorship based in Johnson City, Tennessee. These terms
            apply to your use of the site and purchases from the Appalachian
            Cryptid Shop.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            About the site
          </h2>
          <p className="mb-4">
            Appalachian Cryptid documents folklore, legends, reported
            encounters, and regional stories. The material is provided for
            informational and entertainment purposes. Cryptid entries,
            reports, bulletins, and similar content should not be treated as
            verified scientific claims or professional advice.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Shop orders
          </h2>
          <p className="mb-4">
            Orders are completed through a Stripe-hosted checkout page.
            Prices, shipping charges, and available delivery estimates are
            shown before you complete your purchase.
          </p>
          <p className="mb-4">
            I make reasonable efforts to ship orders within the stated
            timeframe. If an order cannot be shipped on time, I will contact
            you with updated information and the option to accept the delay
            or cancel the order for a refund.
          </p>
          <p className="mb-4">
            If your order arrives damaged or incorrect, or has not arrived by
            its expected delivery date, email{" "}
            <a
              href="mailto:dispatch@appalachiancryptid.com"
              className="text-primary underline underline-offset-2"
            >
              dispatch@appalachiancryptid.com
            </a>{" "}
            within 30 days of the delivery or expected delivery date. Include
            the email address used for the order and a description of the
            problem.
          </p>
          <p className="mb-4">
            Product availability may change without notice. I may cancel and
            refund an order if an item is unavailable, an order cannot be
            fulfilled, or the listed price was clearly incorrect.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Optional submissions
          </h2>
          <p className="mb-4">
            If you submit material through an optional site form, including
            the sighting form, you give me permission to review, edit, redact,
            publish, or decline the submission. I may remove identifying
            details before publication and may remove published material at
            my discretion.
          </p>
          <p className="mb-4">
            Do not submit material that you do not have the right to share or
            that violates another person&rsquo;s privacy or intellectual
            property rights.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Intellectual property
          </h2>
          <p className="mb-4">
            The site&rsquo;s original writing, design, artwork, photographs,
            and other original materials belong to Welborn Creative Studio
            unless otherwise stated. They may not be copied, republished,
            sold, or used commercially without permission.
          </p>
          <p className="mb-4">
            The folklore and oral traditions documented on the site originate
            with the people and communities who have carried them. I do not
            claim ownership of the underlying traditions themselves.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Third-party services and links
          </h2>
          <p className="mb-4">
            The site uses third-party services for functions such as payment
            processing, email delivery, analytics, and maps. Those services
            may have their own terms and privacy policies.
          </p>
          <p className="mb-4">
            Links to other websites are provided for reference or
            convenience. I am not responsible for the content or practices of
            external sites.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Disclaimer
          </h2>
          <p className="mb-4">
            The site is provided on an &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; basis. I do not guarantee that every page will
            always be available, error-free, or complete.
          </p>
          <p className="mb-4">
            Nothing on the site is a substitute for professional, medical,
            legal, emergency, outdoor-safety, or other expert advice.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Limitation of liability
          </h2>
          <p className="mb-4">
            To the extent permitted by law, Welborn Creative Studio is not
            responsible for indirect, incidental, special, or consequential
            losses arising from your use of the site or reliance on its
            content.
          </p>
          <p className="mb-4">
            Nothing in these terms limits rights or remedies that cannot
            legally be excluded.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Governing law
          </h2>
          <p className="mb-4">
            These terms are governed by the laws of the State of Tennessee,
            without regard to conflict-of-law rules.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Changes
          </h2>
          <p className="mb-4">
            I may update these terms when the site or shop changes. The
            current revision date will always appear at the top of this page.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Contact
          </h2>
          <p className="mb-4">
            Questions about these terms or a shop order can be sent to:
          </p>
          <p>
            <a
              href="mailto:dispatch@appalachiancryptid.com"
              className="font-bold text-primary underline underline-offset-2"
            >
              dispatch@appalachiancryptid.com
            </a>
          </p>
        </article>
      </main>

      <Footer variant="full" />
    </div>
  );
}
