import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

// ============================================
// FILING DRAWER - Bureau-issued accordion UI
// ============================================

interface FilingCabinetProps {
  children: React.ReactNode;
  defaultOpen?: string[];
  className?: string;
}

interface FilingDrawerProps {
  value: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}

// Context for expand/collapse all
const FilingCabinetContext = React.createContext<{
  expandAll: () => void;
  collapseAll: () => void;
  values: string[];
  allValues: string[];
} | null>(null);

export const useFilingCabinet = () => {
  const context = React.useContext(FilingCabinetContext);
  if (!context) {
    throw new Error("useFilingCabinet must be used within a FilingCabinet");
  }
  return context;
};

/**
 * FilingCabinet - Container for multiple FilingDrawer components
 *
 * Multiple mode by default - several drawers can be open at once.
 * "Like a chaotic investigator's desk."
 */
export const FilingCabinet = ({
  children,
  defaultOpen = [],
  className,
}: FilingCabinetProps) => {
  // Track all drawer values for expand/collapse all
  const [allValues, setAllValues] = React.useState<string[]>([]);
  const [openValues, setOpenValues] = React.useState<string[]>(defaultOpen);

  // Register drawer values
  const registerDrawer = React.useCallback((value: string) => {
    setAllValues((prev) => (prev.includes(value) ? prev : [...prev, value]));
  }, []);

  const expandAll = React.useCallback(() => {
    setOpenValues(allValues);
  }, [allValues]);

  const collapseAll = React.useCallback(() => {
    setOpenValues([]);
  }, []);

  return (
    <FilingCabinetContext.Provider
      value={{ expandAll, collapseAll, values: openValues, allValues }}
    >
      <FilingCabinetInner
        value={openValues}
        onValueChange={setOpenValues}
        registerDrawer={registerDrawer}
        className={className}
      >
        {children}
      </FilingCabinetInner>
    </FilingCabinetContext.Provider>
  );
};

// Inner component to handle accordion state
const FilingCabinetInner = ({
  children,
  value,
  onValueChange,
  registerDrawer,
  className,
}: {
  children: React.ReactNode;
  value: string[];
  onValueChange: (value: string[]) => void;
  registerDrawer: (value: string) => void;
  className?: string;
}) => {
  return (
    <RegisterContext.Provider value={registerDrawer}>
      <AccordionPrimitive.Root
        type="multiple"
        value={value}
        onValueChange={onValueChange}
        className={cn("space-y-3", className)}
      >
        {children}
      </AccordionPrimitive.Root>
    </RegisterContext.Provider>
  );
};

// Context for registering drawers
const RegisterContext = React.createContext<(value: string) => void>(() => {});

/**
 * FilingDrawer - Individual drawer/folder within the cabinet
 *
 * Styled like a manila folder tab with aged paper interior.
 */
export const FilingDrawer = ({
  value,
  label,
  children,
  className,
}: FilingDrawerProps) => {
  const register = React.useContext(RegisterContext);

  // Register this drawer on mount
  React.useEffect(() => {
    register(value);
  }, [value, register]);

  return (
    <AccordionPrimitive.Item
      value={value}
      className={cn(
        "group",
        "rounded-sm overflow-hidden",
        "border-2 border-[#c4a55a]/60",
        "bg-[#f5f0e1]",
        // Subtle shadow for depth
        "shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.1)]",
        className
      )}
    >
      {/* Trigger - The folder tab */}
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            "flex flex-1 items-center gap-3 w-full text-left",
            "px-4 py-3",
            "bg-[#e8dcc4]",
            "border-b-2 border-[#c4a55a]/40",
            // Hover state - tab "lifts"
            "hover:bg-[#efe4ce]",
            "transition-colors duration-75",
            // Focus state
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1",
            // Open state styling
            "group-data-[state=open]:bg-[#efe4ce]",
            "group-data-[state=open]:border-b-[#c4a55a]/60"
          )}
        >
          {/* Tab shape - sits above the line */}
          <div
            className={cn(
              "relative",
              "px-3 py-1",
              "bg-[#d4c49a]",
              "border border-[#b8a070]",
              "rounded-t-md rounded-b-none",
              "-mb-1",
              // Shadow under tab
              "shadow-[0_2px_0_#c4b078]",
              // Slight lift on hover/open
              "group-hover:-translate-y-px",
              "group-data-[state=open]:-translate-y-px",
              "transition-transform duration-75"
            )}
          >
            <span
              className={cn(
                "font-mono text-[11px] font-semibold tracking-[0.08em] uppercase",
                "text-[#4a3f2f]"
              )}
            >
              {label}
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Drawer indicator */}
          <div
            className={cn(
              "flex items-center justify-center",
              "w-6 h-6",
              "text-[#7a6a50]",
              "transition-transform duration-75"
            )}
          >
            <span
              className={cn(
                "font-mono text-sm font-bold",
                "group-data-[state=closed]:block",
                "group-data-[state=open]:hidden"
              )}
            >
              +
            </span>
            <span
              className={cn(
                "font-mono text-sm font-bold",
                "group-data-[state=closed]:hidden",
                "group-data-[state=open]:block"
              )}
            >
              −
            </span>
          </div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      {/* Content - Inside the folder */}
      <AccordionPrimitive.Content
        className={cn(
          // INSTANT open - no slide animation
          "overflow-hidden",
          "data-[state=closed]:hidden",
          "data-[state=open]:block"
        )}
      >
        <div className="relative">
          {/* Slotted-in notch effect - darker line where tab meets content */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a08050]/40 to-transparent"
            aria-hidden="true"
          />

          <div
            className={cn(
              "px-5 py-4 pt-5 pr-24",
              // Interior paper - slightly different texture
              "bg-[#faf8f2]",
              // Inset shadow for depth - "looking into folder"
              "shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]",
              // Content typography
              "text-[#3a352d]",
              "text-sm leading-relaxed"
            )}
          >
            {/* "IN REVIEW" stamp - only visible when open */}
            <div
              className={cn(
                "absolute top-3 right-4",
                "px-2 py-0.5",
                "bg-[#8b0000]/10",
                "border border-[#8b0000]/30",
                "rounded-sm",
                "transform rotate-[-2deg]"
              )}
            >
              <span
                className={cn(
                  "font-mono text-[9px] font-bold tracking-[0.15em] uppercase",
                  "text-[#8b0000]/70"
                )}
              >
                In Review
              </span>
            </div>

            {children}
          </div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
};

/**
 * FilingCabinetControls - Expand/Collapse all buttons
 */
export const FilingCabinetControls = ({ className }: { className?: string }) => {
  const { expandAll, collapseAll, values, allValues } = useFilingCabinet();
  const allOpen = values.length === allValues.length && allValues.length > 0;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        onClick={allOpen ? collapseAll : expandAll}
        className={cn(
          "inline-flex items-center gap-1.5",
          "px-2.5 py-1",
          "text-[10px] font-mono uppercase tracking-wider",
          "text-[#6a5a4a]",
          "bg-[#e8dcc4] hover:bg-[#ded2bc]",
          "border border-[#c4a55a]/50",
          "rounded-sm",
          "transition-colors duration-75",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        )}
      >
        {allOpen ? "Close All Drawers" : "Open All Drawers"}
      </button>
    </div>
  );
};
