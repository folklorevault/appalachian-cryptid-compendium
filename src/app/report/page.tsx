import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ReportForm } from "./ReportForm";

export const metadata: Metadata = {
  title: "Report a Sighting",
  description: "Submit your cryptid sighting report to the Appalachian Cryptid Field Guide.",
  alternates: {
    canonical: "/report",
  },
};

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        </div>

        <ReportForm />
      </main>

      <Footer />
    </div>
  );
}
