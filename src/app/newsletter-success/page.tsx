import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "Registered | Appalachian Cryptid Division",
  robots: { index: false },
};

export default function NewsletterSuccess() {
  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col">
      <main
        id="main-content"
        className="flex-1 flex items-center justify-center py-16 px-6"
      >
        <div className="text-center max-w-md">
          <CheckCircle className="h-8 w-8 text-primary mx-auto mb-4" />
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-4">
            Roster Addition Confirmed
          </div>
          <h1 className="text-title font-bold text-foreground font-display mb-4">
            Registered
          </h1>
          <p className="text-muted-foreground mb-8">
            Your transmission address has been logged with the Bureau.
            You will receive dispatches as new case files are processed.
          </p>
          <Link href="/">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Return to Directory
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
