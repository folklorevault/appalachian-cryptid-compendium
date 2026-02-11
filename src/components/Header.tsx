import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  isAnchor?: boolean;
  isExternal?: boolean;
}

interface HeaderProps {
  badge?: string;
}

const navItems: NavItem[] = [
  { to: "/anomalies", label: "Anomalies Desk" },
  { to: "/map", label: "Sighting Map" },
  { to: "/about", label: "About" },
];

export const Header = ({ badge }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path.startsWith("/#")) return location.pathname === "/";
    return location.pathname === path;
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-primary font-display tracking-tight">
                  Appalachian Cryptid
                </h1>
              </Link>
              {badge && (
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex border-primary/50 text-primary text-xs"
                >
                  {badge}
                </Badge>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                item.isAnchor ? (
                  <a
                    key={item.to}
                    href={item.to}
                    className={`text-sm transition-colors ${
                      isActive(item.to)
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`text-sm transition-colors ${
                      isActive(item.to)
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              <a
                href="https://ko-fi.com/appalachiancryptidkeeper"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors"
              >
                <Heart className="h-4 w-4" />
                Support
              </a>
              <Link to="/report">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Report Sighting
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-card">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              item.isAnchor ? (
                <a
                  key={item.to}
                  href={item.to}
                  className={`text-sm transition-colors ${
                    isActive(item.to)
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-sm transition-colors ${
                    isActive(item.to)
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
            <a
              href="https://ko-fi.com/appalachiancryptidkeeper"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="h-4 w-4" />
              Support
            </a>
            <Link to="/report" onClick={() => setMobileMenuOpen(false)}>
              <Button
                size="sm"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Report Sighting
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;

