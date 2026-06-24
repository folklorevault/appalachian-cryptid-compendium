import type { Metadata } from "next";
import { ShopProductCard } from "@/components/ShopProductCard";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Gift Shop",
  description:
    "Official merchandise from Field Office No. 7. Designs inspired by Appalachian folklore and the Bureau's archive.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Gift Shop | Appalachian Cryptid Field Guide",
    description: "Official merchandise from Field Office No. 7.",
    url: "https://appalachiancryptid.com/shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gift Shop | Appalachian Cryptid Field Guide",
    description: "Official merchandise from Field Office No. 7.",
  },
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background paper-texture">
      <main id="main-content">
        {/* Hero */}
        <section className="relative py-20 px-6 lg:py-24 lg:px-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-3.5 mb-6">
              <span
                className="block w-10 h-px bg-border"
                aria-hidden="true"
              />
              <span className="font-typewriter text-xs tracking-[0.2em] uppercase text-bureau-ink-muted">
                Bureau of Appalachian Cryptid Documentation ◆ Field Office No. 7
              </span>
              <span
                className="block w-10 h-px bg-border"
                aria-hidden="true"
              />
            </div>
            <h1 className="font-display font-bold text-foreground leading-tight text-[clamp(2.2rem,5.5vw,3.75rem)]">
              Gift Shop
            </h1>
            <div
              className="max-w-[300px] mx-auto border-t-2 border-b border-foreground"
              style={{ height: "4px" }}
              aria-hidden="true"
            />
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed font-typewriter">
              Official merchandise from Field Office No. 7
            </p>
          </div>
        </section>

        {/* Intro copy */}
        <section className="max-w-3xl mx-auto px-6 pb-10 text-center">
          <p className="font-typewriter text-sm text-muted-foreground leading-relaxed">
            Designs from the Appalachian Cryptid Field Guide. Appalachian
            folklore has never been short on strange creatures and unexplained
            sightings, and the mountains have collected their fair share of
            stories over the years. The Bureau Gift Shop features items inspired
            by these legends, bringing a few pieces of the archive out into the
            world.
          </p>
        </section>

        {/* Product section */}
        <section className="max-w-5xl mx-auto px-6 pb-16 lg:pb-24">
          <div className="flex items-center gap-3.5 mb-10">
            <span
              className="block flex-1 h-px bg-border"
              aria-hidden="true"
            />
            <span className="font-typewriter text-xs tracking-[0.2em] uppercase text-bureau-ink-muted">
              Field Decals
            </span>
            <span
              className="block flex-1 h-px bg-border"
              aria-hidden="true"
            />
          </div>

          <ShopProductCard />
        </section>
      </main>
      <Footer variant="simple" />
    </div>
  );
}
