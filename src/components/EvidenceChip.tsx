import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type ChipVariant = "label-tape" | "manila-tab" | "punch-card";

interface EvidenceChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  onRemove?: () => void;
  className?: string;
}

/**
 * Evidence chip styled like physical filing artifacts:
 * - label-tape: DYMO-style embossed label maker tape
 * - manila-tab: Folder tab with typewriter text
 * - punch-card: Vintage computer punch card header
 */
export const EvidenceChip = ({
  children,
  variant = "label-tape",
  onRemove,
  className,
}: EvidenceChipProps) => {
  const baseStyles = "inline-flex items-center gap-1 text-xs font-medium transition-colors";

  const variantStyles: Record<ChipVariant, string> = {
    "label-tape": cn(
      // DYMO label maker aesthetic - embossed black on colored tape
      "px-2.5 py-1 rounded-sm",
      "bg-[hsl(var(--bureau-manila))] text-[hsl(var(--bureau-ink))]",
      "font-typewriter uppercase tracking-[0.15em] text-xs",
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.1)]",
      "border border-[hsl(var(--bureau-border))]",
      // Slight embossed/debossed effect
      "[text-shadow:0_1px_0_rgba(255,255,255,0.3)]"
    ),
    "manila-tab": cn(
      // Manila folder tab
      "px-3 py-1 rounded-t-md rounded-b-none",
      "bg-[hsl(var(--bureau-manila))] text-[hsl(var(--bureau-ink))]",
      "font-typewriter text-xs",
      "border-x border-t border-[hsl(var(--bureau-border))]",
      "shadow-[0_2px_0_hsl(var(--bureau-manila-dark))]",
      // Tab shape with notched bottom
      "relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[2px] before:bg-[hsl(var(--bureau-border))]"
    ),
    "punch-card": cn(
      // IBM punch card aesthetic
      "px-2 py-0.5 rounded-none",
      "bg-[hsl(var(--bureau-paper))] text-[hsl(var(--bureau-ink))]",
      "font-typewriter uppercase text-xs tracking-[0.2em]",
      "border border-[hsl(var(--bureau-border))]",
      // Punch holes effect on sides
      "before:content-['◯'] before:text-xs before:text-[hsl(var(--bureau-ink-muted))] before:mr-1",
      "after:content-['◯'] after:text-xs after:text-[hsl(var(--bureau-ink-muted))] after:ml-1"
    ),
  };

  const chipClasses = cn(
    baseStyles,
    variantStyles[variant],
    onRemove && "cursor-pointer hover:opacity-80 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1",
    className
  );

  if (onRemove) {
    const labelText = typeof children === "string" ? children : undefined;
    return (
      <button
        type="button"
        className={chipClasses}
        onClick={onRemove}
        aria-label={labelText ? `Remove ${labelText} filter` : "Remove filter"}
      >
        {children}
        <X className="h-3 w-3 opacity-70" aria-hidden="true" />
      </button>
    );
  }

  return (
    <span className={chipClasses}>
      {children}
    </span>
  );
};

// Pre-styled variants for common use cases
export const LabelTape = (props: Omit<EvidenceChipProps, "variant">) => (
  <EvidenceChip variant="label-tape" {...props} />
);

export const ManilaTab = (props: Omit<EvidenceChipProps, "variant">) => (
  <EvidenceChip variant="manila-tab" {...props} />
);

export const PunchCard = (props: Omit<EvidenceChipProps, "variant">) => (
  <EvidenceChip variant="punch-card" {...props} />
);
