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
            Last updated July 19, 2026
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <hr className="border-t-2 border-bureau-ink-muted mb-10" />
        </div>

        <article className="max-w-3xl mx-auto px-6 pb-16 text-foreground/90 leading-relaxed">
          <p className="mb-6">
            The Appalachian Cryptid Field Guide and Shop (&ldquo;the site,&rdquo;
            &ldquo;we,&rdquo; &ldquo;us&rdquo;) is operated by Welborn Creative
            Studio, a sole proprietorship based in Johnson City, Tennessee. This
            policy explains what information we collect when you use the site,
            why we collect it, and how you can reach us about it.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            What we collect
          </h2>

          <h3 className="font-display text-base font-bold text-foreground mt-6 mb-2">
            Sighting reports
          </h3>
          <p className="mb-4">
            When you file a report through our{" "}
            <a href="/report" className="text-primary underline underline-offset-2">
              sighting form
            </a>
            , we store what you submit — your account of the encounter, and
            optionally your name, email address, date, time, location, and
            description of the creature or event. Only the description of what
            you saw is required; everything else is optional. Submissions are
            reviewed before any part of them is published, and we redact
            identifying details on request. Reports are stored in our content
            system (Sanity) and protected at submission by automated bot
            filtering (BotID) to keep the queue free of spam.
          </p>

          <h3 className="font-display text-base font-bold text-foreground mt-6 mb-2">
            Newsletter
          </h3>
          <p className="mb-4">
            If you sign up for our newsletter, your email address is sent to
            our email service provider, Loops.so, which manages the mailing
            list and delivers the emails. Every newsletter includes an
            unsubscribe link.
          </p>

          <h3 className="font-display text-base font-bold text-foreground mt-6 mb-2">
            Shop orders
          </h3>
          <p className="mb-4">
            Purchases from the Appalachian Cryptid Shop are completed through
            a Stripe-hosted checkout page, external to this site. Stripe
            collects and processes your payment and shipping details directly
            — we never receive or store your card information, and payment
            data never touches our servers.
          </p>

          <h3 className="font-display text-base font-bold text-foreground mt-6 mb-2">
            Site analytics
          </h3>
          <p className="mb-4">
            We use Rybbit, a self-hosted analytics tool, and Vercel Analytics
            to understand aggregate usage — pages viewed, referring sites, and
            device type. We use this to see what&rsquo;s working, not to
            identify individual visitors.
          </p>

          <h3 className="font-display text-base font-bold text-foreground mt-6 mb-2">
            Interactive map
          </h3>
          <p className="mb-4">
            The sightings map is powered by Mapbox GL JS. Loading the map may
            share your IP address with Mapbox, subject to{" "}
            <a
              href="https://www.mapbox.com/legal/privacy"
              className="text-primary underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mapbox&rsquo;s own privacy policy
            </a>
            .
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            What we don&rsquo;t do
          </h2>
          <p className="mb-4">
            We don&rsquo;t sell your personal information, and we don&rsquo;t
            use sighting report data for anything beyond reviewing and
            publishing sightings. We don&rsquo;t run third-party ad trackers
            on this site.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Your choices
          </h2>
          <p className="mb-4">
            You can ask us to access, correct, or delete any information
            you&rsquo;ve submitted by emailing{" "}
            <a
              href="mailto:dispatch@appalachiancryptid.com"
              className="text-primary underline underline-offset-2"
            >
              dispatch@appalachiancryptid.com
            </a>
            . For newsletter emails, you can also unsubscribe directly from
            any message we send.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Children&rsquo;s privacy
          </h2>
          <p className="mb-4">
            This site isn&rsquo;t directed at children under 13, and we
            don&rsquo;t knowingly collect information from them.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Changes to this policy
          </h2>
          <p className="mb-4">
            If this policy changes, we&rsquo;ll update the date at the top of
            this page.
          </p>

          <h2 className="font-display text-xl font-bold text-foreground mt-10 mb-3">
            Contact
          </h2>
          <p>
            Questions about this policy or your data can be sent to{" "}
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
