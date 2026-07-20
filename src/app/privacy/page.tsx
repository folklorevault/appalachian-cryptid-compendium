import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How the Appalachian Cryptid Field Guide and Shop collect, use, and protect your information.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Appalachian Cryptid Field Guide",
    description:
      "How the Appalachian Cryptid Field Guide and Shop collect, use, and protect your information.",
    url: "https://appalachiancryptid.com/privacy",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Appalachian Cryptid Field Guide",
    description:
      "How the Appalachian Cryptid Field Guide and Shop collect, use, and protect your information.",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background paper-texture">
      <main id="main-content">
        <div className="max-w-3xl mx-auto px-6 pt-12 pb-6">
          <span className="font-typewriter text-xs tracking-eyebrow uppercase text-bureau-ink-muted">
            Bureau of Appalachian Cryptid Documentation
          </span>
          <h1 className="mt-3 font-display font-bold text-foreground leading-tight text-[clamp(2rem,5vw,3rem)]">
            Privacy Policy
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
            sole proprietorship based in Johnson City, Tennessee. This policy
            explains what information I collect through the site, how I use
            it, and the services involved in processing it.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Shop orders
          </h2>
          <p className="mb-4">
            Purchases from the Appalachian Cryptid Shop are completed through
            a Stripe-hosted checkout page.
          </p>
          <p className="mb-4">
            Stripe collects and processes payment information, including your
            card details and billing information. I do not receive or store
            your full card number.
          </p>
          <p className="mb-4">
            I receive the information needed to process and support your
            order, which may include your name, email address, shipping
            address, items ordered, order total, payment status, and limited
            payment details.
          </p>
          <p className="mb-4">
            I use this information to fulfill orders, provide customer
            support, issue refunds when appropriate, maintain transaction
            records, and meet tax or legal obligations.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Newsletter
          </h2>
          <p className="mb-4">
            If you subscribe to the newsletter, your email address is sent to
            Loops, the service I use to manage the mailing list and deliver
            emails.
          </p>
          <p className="mb-4">
            You can unsubscribe at any time through the link included in each
            newsletter.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Site analytics
          </h2>
          <p className="mb-4">
            I use a self-hosted installation of Rybbit and Vercel Analytics to
            understand how the site is being used. This may include
            information such as pages viewed, referring sites, general
            browser or device information, and approximate usage patterns.
          </p>
          <p className="mb-4">
            I use this information to maintain and improve the site, not to
            build advertising profiles about individual visitors.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Interactive map
          </h2>
          <p className="mb-4">
            The interactive map uses Mapbox GL JS. When the map loads, your
            browser connects to Mapbox and may send information such as your
            IP address and technical request data. Mapbox processes that
            information under its{" "}
            <a
              href="https://www.mapbox.com/legal/privacy"
              className="text-primary underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              own privacy policy
            </a>
            .
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Messages and optional submissions
          </h2>
          <p className="mb-4">
            If you email me, request shop support, or submit information
            through a site form, I receive the information you choose to
            provide.
          </p>
          <p className="mb-4">
            The optional sighting form may collect an account of the reported
            encounter and any name, email address, date, time, location, or
            other details you choose to include. Submissions are stored in
            Sanity and reviewed before anything is published. Identifying
            information may be removed before publication.
          </p>
          <p className="mb-4">
            Protected forms may use Vercel BotID to identify and block
            automated submissions.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            How I use information
          </h2>
          <p className="mb-4">
            I use collected information only as reasonably necessary to:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6">
            <li>operate and maintain the site;</li>
            <li>process and support shop orders;</li>
            <li>send newsletters you requested;</li>
            <li>respond to messages and requests;</li>
            <li>review optional submissions;</li>
            <li>understand general site usage;</li>
            <li>prevent spam, fraud, and technical abuse;</li>
            <li>comply with legal, tax, or recordkeeping obligations.</li>
          </ul>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Service providers
          </h2>
          <p className="mb-4">
            Information may be processed by services that perform specific
            functions for the site, including:
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-6">
            <li>Stripe for checkout and payment processing;</li>
            <li>Loops for newsletter delivery;</li>
            <li>Sanity for site content and optional submissions;</li>
            <li>Vercel for site hosting, analytics, and bot protection;</li>
            <li>Mapbox for the interactive map.</li>
          </ul>
          <p className="mb-4">
            These services process information under their own terms and
            privacy policies.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            What I do not do
          </h2>
          <p className="mb-4">I do not sell your personal information.</p>
          <p className="mb-4">
            I do not use sighting submissions for purposes unrelated to
            reviewing, editing, or potentially publishing them.
          </p>
          <p className="mb-4">
            I do not currently use third-party behavioral advertising
            trackers on the site.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Retention
          </h2>
          <p className="mb-4">
            I keep information only for as long as reasonably necessary for
            the purpose for which it was collected, including order support,
            tax and accounting records, site operations, or legal
            obligations.
          </p>
          <p className="mb-4">
            Newsletter information remains on the mailing list until you
            unsubscribe or ask for it to be removed.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Your choices
          </h2>
          <p className="mb-4">
            You may ask to access, correct, or delete personal information you
            have submitted by emailing{" "}
            <a
              href="mailto:dispatch@appalachiancryptid.com"
              className="text-primary underline underline-offset-2"
            >
              dispatch@appalachiancryptid.com
            </a>
            .
          </p>
          <p className="mb-4">
            Some transaction records may need to be retained for tax,
            accounting, fraud-prevention, or legal purposes even after a
            deletion request.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Children&rsquo;s privacy
          </h2>
          <p className="mb-4">
            Appalachian Cryptid is not directed to children under 13, and I do
            not knowingly collect personal information from children under
            13.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Changes
          </h2>
          <p className="mb-4">
            I may update this policy when the site, shop, or services change.
            The current revision date will appear at the top of this page.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Contact
          </h2>
          <p className="mb-4">
            Privacy questions and requests can be sent to:
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
