import { cn } from "@/lib/utils";

interface StampProps {
  text: string;
  variant?: "primary" | "accent" | "danger" | "muted";
  className?: string;
  rotation?: number;
}

// Data URI SVG filter avoids fragment URLs (#id) that crawlers follow as phantom pages
const STAMP_TEXTURE_FILTER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='t'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' result='n'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='n' scale='3' xChannelSelector='R' yChannelSelector='G'/%3E%3C/filter%3E%3C/svg%3E#t")`;

export const Stamp = ({ text, variant = "primary", className, rotation = -5 }: StampProps) => {
  const variantClasses = {
    primary: "border-primary text-primary",
    accent: "border-accent text-accent",
    danger: "border-destructive text-destructive",
    muted: "border-muted-foreground text-muted-foreground",
  };

  return (
    <div
      className={cn(
        "inline-block px-4 py-2 border-4 rounded-sm font-bold uppercase tracking-widest text-sm font-display opacity-80",
        "bg-[hsl(var(--bureau-manila)/0.85)] shadow-[inset_0_0_0_2px_currentColor]",
        variantClasses[variant],
        className
      )}
      style={{
        transform: `rotate(${rotation}deg)`,
        textShadow: "none",
      }}
    >
      <span className="block" style={{
        filter: STAMP_TEXTURE_FILTER
      }}>
        {text}
      </span>
    </div>
  );
};
