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
      "bg-[#c4b998] text-[#1a1a1a]", // Aged cream/tan tape
      "font-mono uppercase tracking-[0.15em] text-[10px]",
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.1)]",
      "border border-[#a89f7c]",
      // Slight embossed/debossed effect
      "[text-shadow:0_1px_0_rgba(255,255,255,0.3)]"
    ),
    "manila-tab": cn(
      // Manila folder tab
      "px-3 py-1 rounded-t-md rounded-b-none",
      "bg-[#e8d9a0] text-[#4a3728]",
      "font-typewriter text-[11px]",
      "border-x border-t border-[#c4a35a]",
      "shadow-[0_2px_0_#d4c078]",
      // Tab shape with notched bottom
      "relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[2px] before:bg-[#c4a35a]"
    ),
    "punch-card": cn(
      // IBM punch card aesthetic
      "px-2 py-0.5 rounded-none",
      "bg-[#f5f0dc] text-[#2d2d2d]",
      "font-mono uppercase text-[9px] tracking-[0.2em]",
      "border border-[#c9c4b0]",
      // Punch holes effect on sides
      "before:content-['◯'] before:text-[6px] before:text-[#bbb5a0] before:mr-1",
      "after:content-['◯'] after:text-[6px] after:text-[#bbb5a0] after:ml-1"
    ),
  };

  return (
    <span
      className={cn(
        baseStyles,
        variantStyles[variant],
        onRemove && "cursor-pointer hover:opacity-80",
        className
      )}
      onClick={onRemove}
    >
      {children}
      {onRemove && (
        <X className="h-3 w-3 opacity-60 hover:opacity-100" />
      )}
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
