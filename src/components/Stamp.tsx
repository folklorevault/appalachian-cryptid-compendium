import { cn } from "@/lib/utils";

interface StampProps {
  text: string;
  variant?: "primary" | "accent" | "danger" | "muted";
  className?: string;
  rotation?: number;
}

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
        filter: "url(#stamp-texture)" 
      }}>
        {text}
      </span>
    </div>
  );
};

// SVG filter for stamp texture effect - add to your main layout
export const StampFilter = () => (
  <svg className="hidden">
    <defs>
      <filter id="stamp-texture">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);