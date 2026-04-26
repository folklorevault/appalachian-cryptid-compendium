import Link from "next/link";
import { Heart } from "lucide-react";

interface FooterProps {
  variant?: "simple" | "full";
}

export const Footer = ({ variant = "simple" }: FooterProps) => {
  const year = new Date().getFullYear();

  if (variant === "simple") {
    return (
      <footer className="border-t border-border bg-card py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © {year} Appalachian Cryptid Field Guide. Compiled in East
            Tennessee.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border bg-card py-16 px-6 lg:py-20 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-xl font-bold text-foreground font-display mb-3">
              Appalachian Cryptid
            </h4>
            <p className="text-sm text-muted-foreground">
              Front-porch stories, backroad sightings, and local legends from
              the mountains and hollers of Appalachia and the American South.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
              Explore
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#field-guide"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Field Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/anomalies"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Anomalies
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Sightings Map
                </Link>
              </li>
              <li>
                <Link
                  href="/bulletins"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Bulletins
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Gift Shop
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
              Bureau
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About This Project
                </Link>
              </li>
              <li>
                <Link
                  href="/report"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  File a Report
                </Link>
              </li>
              <li>
                <a
                  href="https://ko-fi.com/appalachiancryptidkeeper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1.5"
                >
                  <Heart className="h-3.5 w-3.5" />
                  Support This Project
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
              A Note
            </h5>
            <p className="text-xs text-muted-foreground">
              This field guide honors the storytelling traditions of Appalachia
              and the South. Many accounts trace back through Cherokee and other
              Indigenous traditions. We're just trying to organize the lore—not
              claim to be the first to record it.
            </p>
          </div>
        </div>
        <div className="border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {year} Appalachian Cryptid Field Guide. Compiled in East
            Tennessee.
          </p>
        </div>
      </div>
    </footer>
  );
};
