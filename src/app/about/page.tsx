import type { Metadata } from "next";
import { AboutDirective } from "@/components/AboutDirective";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: { absolute: "About the Bureau | Appalachian Cryptid Compendium" },
  description:
    "Who keeps the files, what the Bureau is for, and the plain truth about this archive of Appalachian folklore, cryptids, and anomalies.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <AboutDirective />
      </main>

      <Footer variant="full" />
      <BackToTop />
    </div>
  );
}
