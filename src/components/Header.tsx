"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Field Guide" },
  { href: "/anomalies", label: "Anomalies Desk" },
  { href: "/bulletins", label: "Bureau Bulletins" },
  { href: "/map", label: "Sighting Map" },
  { href: "/about", label: "About" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Main Nav */}
      <nav className="sticky top-0 z-50 bg-card border-b-2 border-border paper-texture-nav">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 flex items-center justify-between h-[60px]">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-2.5 no-underline">
            <span className="font-display text-[1.35rem] font-bold text-primary leading-none tracking-tight">
              Appalachian Cryptid
            </span>
            <span className="hidden sm:inline font-typewriter text-xs text-[hsl(var(--bureau-ink-muted))] tracking-[0.08em] uppercase relative -top-px">
              Field Guide
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden xl:flex items-center">
            {navItems.map((item, i) => (
              <span key={item.href} className="flex items-center">
                {i > 0 && (
                  <span className="text-border text-sm select-none mx-[-2px]" aria-hidden="true">
                    |
                  </span>
                )}
                <Link
                  href={item.href}
                  className={`font-typewriter text-sm tracking-[0.02em] px-3 py-2 whitespace-nowrap relative transition-colors ${
                    isActive(item.href)
                      ? "text-primary nav-link-active"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden xl:flex items-center gap-4">
            <a
              href="https://ko-fi.com/appalachiancryptidkeeper"
              target="_blank"
              rel="noopener noreferrer"
              className="font-typewriter text-xs text-[hsl(var(--bureau-ink-muted))] no-underline px-2.5 py-1 inline-flex items-center gap-1.5 transition-colors hover:text-accent"
            >
              <Heart className="h-3.5 w-3.5" />
              Support
            </a>
            <Link
              href="/report"
              className="font-typewriter text-xs tracking-[0.12em] uppercase text-[hsl(var(--bureau-stamp))] no-underline py-1.5 px-3.5 border-2 border-[hsl(var(--bureau-stamp))] rounded-sm inline-block bg-transparent opacity-85 hover:opacity-100 hover:bg-[hsl(var(--bureau-stamp)/0.06)] transition-all"
              style={{ transform: "rotate(-1.5deg)" }}
            >
              ► File a Report
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden text-foreground p-2"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-card border-b-2 border-border px-6 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block font-typewriter text-sm py-2.5 transition-colors ${
                isActive(item.href)
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <a
              href="https://ko-fi.com/appalachiancryptidkeeper"
              target="_blank"
              rel="noopener noreferrer"
              className="font-typewriter text-xs text-[hsl(var(--bureau-ink-muted))] inline-flex items-center gap-1.5 hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="h-3.5 w-3.5" />
              Support
            </a>
          </div>
          <Link
            href="/report"
            className="inline-block mt-4 font-typewriter text-xs tracking-[0.12em] uppercase text-[hsl(var(--bureau-stamp))] py-1.5 px-3.5 border-2 border-[hsl(var(--bureau-stamp))] rounded-sm bg-transparent opacity-85 hover:opacity-100 transition-all"
            style={{ transform: "rotate(-1.5deg)" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            ► File a Report
          </Link>
        </div>
      )}
    </>
  );
};

export default Header;
