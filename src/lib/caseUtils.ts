import type { AnomalyStatus } from "@/types/sanity";

type DangerLevel = "Low" | "Medium" | "High";

export function getAnomalyStatusColor(status: AnomalyStatus): string {
  switch (status) {
    case "Active":
      return "bg-destructive text-destructive-foreground";
    case "Open File":
      return "bg-secondary text-secondary-foreground";
    case "Cold":
      return "bg-muted text-muted-foreground";
    case "Seasonal":
      return "bg-accent text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getDangerLevelColor(dangerLevel: DangerLevel): string {
  switch (dangerLevel) {
    case "High":
      return "bg-destructive text-destructive-foreground";
    case "Medium":
      return "bg-secondary text-secondary-foreground";
    case "Low":
      return "bg-accent text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getDangerLevelLabel(dangerLevel: DangerLevel): string {
  switch (dangerLevel) {
    case "High":
      return "Elevated";
    case "Medium":
      return "Moderate";
    case "Low":
      return "Low";
    default:
      return dangerLevel;
  }
}
