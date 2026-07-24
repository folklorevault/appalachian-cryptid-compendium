"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
}

const desktopNavItems: NavItem[] = [
  { href: "/", label: "Field Guide" },
  { href: "/anomalies", label: "Anomalies" },
  { href: "/map", label: "Sightings Map" },
  { href: "/bulletins", label: "Bulletins" },
  { href: "/shop", label: "Shop" },
];

const mobileMainItems: NavItem[] = [
  { href: "/", label: "Guide" },
  { href: "/shop", label: "Shop" },
  { href: "/map", label: "Map" },
];

const mobileMoreItems: NavItem[] = [
  { href: "/anomalies", label: "Anomalies" },
  { href: "/bulletins", label: "Bulletins" },
  { href: "/report", label: "File a Report" },
];

export const Header = () => {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!moreOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [moreOpen]);

  const moreHasActive = mobileMoreItems.some((item) => isActive(item.href));

  return (
    <header className="sticky top-0 z-50 bg-card border-b-2 border-border paper-texture-nav">
      {/* Row 1: Centered title */}
      <div className="pt-1 pb-0.5 px-4">
        <Link
          href="/"
          className="block text-center no-underline"
        >
          <span className="hidden md:inline font-display text-[1.4rem] font-bold text-primary leading-none tracking-tight">
            Appalachian Cryptid Field Guide
          </span>
          <span className="md:hidden font-display text-[1.15rem] font-bold text-primary leading-none tracking-tight">
            Appalachian Cryptid
          </span>
        </Link>
      </div>

      {/* Decorative rule */}
      <div className="flex items-center justify-center gap-3 px-6" aria-hidden="true">
        <span className="block w-12 h-px bg-border" />
        <span className="text-border text-[8px]">◆</span>
        <span className="block w-12 h-px bg-border" />
      </div>

      {/* Row 2: Nav links */}
      <nav className="pt-px pb-[3px] px-4">
        {/* Desktop nav */}
        <div className="hidden md:flex justify-center items-center">
          {desktopNavItems.map((item, i) => (
            <span key={item.href} className="flex items-center">
              {i > 0 && (
                <span
                  className="text-border text-xs select-none mx-[-2px]"
                  aria-hidden="true"
                >
                  |
                </span>
              )}
              <Link
                href={item.href}
                className={`font-typewriter text-xs tracking-type px-3 py-1 whitespace-nowrap relative transition-colors ${
                  isActive(item.href)
                    ? "text-primary nav-link-active"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            </span>
          ))}
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden justify-center items-center">
          {mobileMainItems.map((item, i) => (
            <span key={item.href} className="flex items-center">
              {i > 0 && (
                <span
                  className="text-border text-xs select-none mx-[-2px]"
                  aria-hidden="true"
                >
                  |
                </span>
              )}
              <Link
                href={item.href}
                className={`font-typewriter text-xs tracking-type px-3 py-1 whitespace-nowrap relative transition-colors ${
                  isActive(item.href)
                    ? "text-primary nav-link-active"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            </span>
          ))}

          {/* More dropdown */}
          <span className="flex items-center">
            <span
              className="text-border text-xs select-none mx-[-2px]"
              aria-hidden="true"
            >
              |
            </span>
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`font-typewriter text-xs tracking-type px-3 py-1 whitespace-nowrap relative transition-colors inline-flex items-center gap-1 ${
                  moreHasActive
                    ? "text-primary"
                    : "text-foreground/70 hover:text-primary"
                }`}
                aria-expanded={moreOpen}
                aria-haspopup="true"
              >
                More
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    moreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {moreOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1 bg-card border border-border shadow-md rounded-sm min-w-[160px] py-1 z-50"
                >
                  {mobileMoreItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className={`block px-4 py-2.5 font-typewriter text-sm transition-colors ${
                        isActive(item.href)
                          ? "text-primary"
                          : "text-foreground hover:text-primary hover:bg-primary/5"
                      }`}
                      onClick={() => setMoreOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
