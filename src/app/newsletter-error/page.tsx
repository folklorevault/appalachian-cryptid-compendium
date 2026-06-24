import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Error | Appalachian Cryptid Division",
  robots: { index: false },
};

export default function NewsletterError() {
  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col">
      <main
        id="main-content"
        className="flex-1 flex items-center justify-center py-16 px-6"
      >
        <div className="text-center max-w-md">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-4">
            Transmission Failed
          </div>
          <h1 className="text-title font-bold text-foreground font-display mb-4">
            Registration Error
          </h1>
          <p className="text-muted-foreground mb-8">
            The Bureau was unable to process your registration at this time.
            Please return and try again.
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
