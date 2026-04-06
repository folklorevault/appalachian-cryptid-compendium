import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { AboutContent } from "@/components/AboutContent";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: 'About the Bureau',
  description: 'Operational mandate and archival protocols for documenting unexplained phenomena in the Appalachian region.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background paper-texture">
      <main id="main-content">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        </div>

        <AboutContent />
      </main>

      <Footer variant="full" />
      <BackToTop />
    </div>
  );
}
