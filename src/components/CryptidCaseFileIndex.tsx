import Link from "next/link";
import type { SanityCryptidListItem } from "@/types/sanity";

interface CryptidCaseFileIndexProps {
  cryptids: SanityCryptidListItem[];
}

export function CryptidCaseFileIndex({ cryptids }: CryptidCaseFileIndexProps) {
  const alphabeticalCryptids = [...cryptids].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 -mt-6 pb-8">
      <details className="group rounded-sm border border-bureau-border/60 bg-card/40">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 select-none [&::-webkit-details-marker]:hidden">
          <span>
            <span className="block font-typewriter text-[9px] uppercase tracking-label text-muted-foreground">
              Reference Index
            </span>
            <span className="font-display text-base font-bold text-foreground">
              Complete Case File Index
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3 font-typewriter text-[10px] uppercase tracking-wide text-muted-foreground">
            {cryptids.length} files
            <span
              aria-hidden="true"
              className="text-lg leading-none transition-transform group-open:rotate-45"
            >
              +
            </span>
          </span>
        </summary>

        <ol className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-bureau-border/50 px-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
          {alphabeticalCryptids.map((cryptid, index) => (
            <li key={cryptid._id}>
              <Link
                href={`/cryptid/${cryptid.slug.current}`}
                className="group/link flex items-baseline gap-2 rounded-sm px-2 py-1.5 font-typewriter text-xs text-foreground transition-colors hover:bg-bureau-manila/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden="true"
                  className="w-5 shrink-0 text-[9px] tabular-nums text-muted-foreground/70"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="border-b border-dotted border-transparent group-hover/link:border-primary/50">
                  {cryptid.name}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
