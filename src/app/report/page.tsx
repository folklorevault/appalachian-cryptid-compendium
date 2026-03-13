import type { Metadata } from "next";
import { ReportForm } from "./ReportForm";

export const metadata: Metadata = {
  title: "Report a Sighting",
  description: "Submit your cryptid sighting report to the Appalachian Cryptid Field Guide.",
  alternates: {
    canonical: "/report",
  },
};

export default function ReportPage() {
  return <ReportForm />;
}
