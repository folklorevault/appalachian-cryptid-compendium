import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col">
      <main
        id="main-content"
        className="flex-1 flex items-center justify-center py-16 px-6"
      >
        <div className="text-center max-w-md">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-4">
            Case File Missing
          </div>
          <h1 className="text-[28px] font-bold text-foreground font-display mb-4">
            404
          </h1>
          <p className="text-muted-foreground mb-8">
            This file appears to have been removed from the cabinet, or may
            never have existed in our records.
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
