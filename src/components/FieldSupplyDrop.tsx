import Image from "next/image";
import { cn } from "@/lib/utils";

interface FieldSupplyDropProps {
  variant?: "detail" | "homepage";
  className?: string;
}

const STRIPE_URL = "https://buy.stripe.com/3cI4gzfhjbjd8fS8Fx3ZK00";

const SPECS: [string, string][] = [
  ["Size", '2.5″ vinyl'],
  ["Finish", "Matte laminate"],
  ["Rated", "Weather / UV / scratch resistant"],
];

export const FieldSupplyDrop = ({
  variant = "detail",
  className,
}: FieldSupplyDropProps) => {
  return (
    <div
      className={cn(
        "relative w-full max-w-[280px]",
        className
      )}
      style={{ transform: "rotate(1.2deg)" }}
    >
      <div className="supply-card-inner border border-border/40 rounded-sm p-4 relative overflow-hidden">
        {/* Form reference */}
        <span className="absolute top-2 right-3 font-typewriter text-[8px] text-muted-foreground tracking-wider z-3">
          Form SRD-09
        </span>

        {/* Header */}
        <div className="border-b-[3px] border-double border-foreground/40 pb-2 mb-3 relative z-2">
          <p className="font-typewriter text-[9px] tracking-[0.18em] uppercase text-muted-foreground text-center">
            Field Supply Drop
          </p>
        </div>

        {/* Product image — hero */}
        <div className="relative z-2 mb-3 flex justify-center">
          <div className="relative w-48 h-48 rounded-sm border border-border overflow-hidden">
            <Image
              src="/products/sticker.png"
              alt="Appalachian Cryptid vinyl decal"
              fill
              sizes="192px"
              className="object-cover sepia-[0.2] saturate-75 contrast-[1.05]"
            />
          </div>
        </div>

        {/* Title + item number */}
        <div className="text-center mb-3 relative z-2">
          <h3 className="font-display font-bold text-sm text-foreground leading-tight">
            Appalachian Cryptid Decal
          </h3>
          <p className="font-typewriter text-[10px] tracking-wider text-muted-foreground mt-0.5">
            Item No. BFC-001
          </p>
        </div>

        {/* Specs */}
        <div className="space-y-1 mb-3 relative z-2">
          {SPECS.map(([label, value]) => (
            <div key={label} className="flex gap-2 font-typewriter text-[10px]">
              <span className="uppercase tracking-wider text-muted-foreground shrink-0 w-12">
                {label}
              </span>
              <span className="text-foreground/80 border-b border-dotted border-foreground/20 flex-1">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Price + Buy */}
        <div className="pt-2 border-t border-dashed border-foreground/15 relative z-2 text-center">
          <div className="mb-2">
            <span className="font-display font-bold text-lg text-foreground">
              $4.00
            </span>
            <span className="font-typewriter text-[9px] text-muted-foreground ml-1.5 tracking-wider uppercase">
              Free shipping
            </span>
          </div>
          <a
            href={STRIPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="supply-stamp-btn inline-flex items-center px-4 py-1.5 border-[3px] border-accent rounded-sm font-bold uppercase tracking-widest text-[10px] font-display text-accent bg-[hsl(var(--bureau-manila)/0.85)] shadow-[inset_0_0_0_2px_hsl(var(--accent))] hover:bg-accent/10 active:bg-accent/20 transition-colors duration-200"
            style={{ transform: "rotate(-1deg)" }}
          >
            <span style={{ filter: "url(#__svg-stamp-texture)" }}>
              Buy Now &rarr;
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
