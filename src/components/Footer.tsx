import { Link } from "react-router-dom";

interface FooterProps {
  variant?: "simple" | "full";
}

export const Footer = ({ variant = "simple" }: FooterProps) => {
  if (variant === "simple") {
    return (
      <footer className="border-t border-border bg-card py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Appalachian Cryptid Field Guide. Compiled in East Tennessee.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border bg-card py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-3">
              <h4 className="text-lg font-bold text-foreground font-display">
                Appalachian Cryptid
              </h4>
            </div>
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
                  to="/field-guide"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Field Guide
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About This Project
                </Link>
              </li>
              <li>
                <Link
                  to="/report"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  File a Report
                </Link>
              </li>
              <li>
                <Link
                  to="/map"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Sighting Map
                </Link>
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
            © 2026 Appalachian Cryptid Field Guide. Compiled in East Tennessee.
          </p>
        </div>
      </div>
    </footer>
  );
};