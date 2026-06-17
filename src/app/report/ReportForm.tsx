"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SightingReceipt } from "@/components/SightingReceipt";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, FileText, Send, Loader2, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormErrors {
  description?: string;
  email?: string;
}

interface SubmissionData {
  witnessName: string;
  date: string;
  location: string;
  state: string;
  creatureName?: string;
  email?: string;
}

// Appalachian Regional Commission's 13 states, plus the catch-all so people
// outside the region don't bounce off a rigid dropdown.
const APPALACHIAN_STATES = [
  "Alabama",
  "Georgia",
  "Kentucky",
  "Maryland",
  "Mississippi",
  "New York",
  "North Carolina",
  "Ohio",
  "Pennsylvania",
  "South Carolina",
  "Tennessee",
  "Virginia",
  "West Virginia",
  "Other / Unsure",
];

export function ReportForm() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [loadedAt] = useState(() => Date.now());

  const [formData, setFormData] = useState(() => ({
    witnessName: "",
    email: "",
    date: "",
    time: "",
    location: "",
    state: "",
    // Pre-fill creature name from ?cryptid=... query (set by detail-page CTA).
    creatureName: searchParams.get("cryptid") ?? "",
    description: "",
    physicalDescription: "",
    behavior: "",
  }));

  const validateField = useCallback((field: string, value: string): string | undefined => {
    switch (field) {
      case "description":
        if (!value.trim()) return "Please tell us what you saw.";
        return undefined;
      case "email":
        // Email is optional, but if provided it should look like an email.
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "That email address looks off.";
        }
        return undefined;
      default:
        return undefined;
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    const descError = validateField("description", formData.description);
    if (descError) newErrors.description = descError;
    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.description, formData.email, validateField]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const finalizeSubmission = () => {
    setSubmissionData({
      witnessName: formData.witnessName.trim() || "Anonymous",
      date: formData.date,
      location: formData.location.trim(),
      state: formData.state || "Other / Unsure",
      creatureName: formData.creatureName.trim() || undefined,
      email: formData.email.trim() || undefined,
    });
    setSubmitted(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ description: true, email: true });

    if (!validateForm()) {
      toast({
        title: "Almost there.",
        description: "Please add a description of what you saw.",
        variant: "destructive",
      });
      return;
    }

    // Honeypot: bots fill the hidden field. Fake success and bail.
    if (honeypot) {
      finalizeSubmission();
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/sightings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          witness_name: formData.witnessName,
          email: formData.email,
          date: formData.date || undefined,
          time: formData.time || undefined,
          location: formData.location,
          state: formData.state,
          creature_name: formData.creatureName,
          description: formData.description,
          physical_description: formData.physicalDescription,
          behavior: formData.behavior,
          _t: loadedAt,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to submit report" }));
        throw new Error(errorData.error || "Failed to submit report");
      }

      finalizeSubmission();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[DEV MODE] API failed, showing receipt anyway:", error);
        finalizeSubmission();
        return;
      }
      toast({
        title: "Submission Failed",
        description: (error as Error).message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileAnother = () => {
    setSubmitted(false);
    setSubmissionData(null);
    setFormData({
      witnessName: "",
      email: "",
      date: "",
      time: "",
      location: "",
      state: "",
      creatureName: searchParams.get("cryptid") || "",
      description: "",
      physicalDescription: "",
      behavior: "",
    });
    setTouched({});
    setErrors({});
  };

  if (submitted && submissionData) {
    return (
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center space-y-4 mb-8">
            <div className="font-typewriter text-xs tracking-[0.2em] uppercase text-muted-foreground">
              Report Submitted
            </div>
            <h1 className="text-[28px] font-bold text-foreground font-display">
              Report Filed Successfully
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Your sighting has been logged in the official record. Please retain this receipt for your files.
            </p>
          </div>
          <SightingReceipt
            submissionData={submissionData}
            onFileAnother={handleFileAnother}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center space-y-4 mb-8">
          <div className="font-typewriter text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Citizen Tipline
          </div>
          <h1 className="text-[28px] font-bold text-foreground font-display">
            Tell the Bureau what you saw
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Anonymous reports welcome. No account needed. Share whatever detail
            you&apos;re comfortable with — even &ldquo;something weird in the woods&rdquo;
            is useful.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot — visually hidden, traps bots */}
          <div
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px" }}
            tabIndex={-1}
          >
            <label htmlFor="website-report">Website</label>
            <input
              id="website-report"
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* PRIMARY: Just the essentials. */}
          <Card className="border-2 border-border">
            <fieldset>
              <CardContent className="p-6 space-y-5">
                <legend className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  The Encounter
                </legend>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    What happened? <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    onBlur={() => handleBlur("description")}
                    placeholder="Tell us what you saw, heard, or felt — in your own words."
                    rows={6}
                    aria-invalid={touched.description && !!errors.description}
                    aria-describedby={
                      touched.description && errors.description
                        ? "description-error"
                        : "description-hint"
                    }
                    className={`bg-background border-border resize-none ${
                      touched.description && errors.description
                        ? "border-destructive"
                        : ""
                    }`}
                  />
                  {touched.description && errors.description ? (
                    <p
                      id="description-error"
                      role="alert"
                      className="text-xs text-destructive"
                    >
                      {errors.description}
                    </p>
                  ) : (
                    <p
                      id="description-hint"
                      className="text-xs text-muted-foreground"
                    >
                      A sentence is fine. A paragraph is better. Long is welcome.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    Which state?
                  </Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleInputChange("state", value)}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select state (or pick 'Other / Unsure')" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPALACHIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </fieldset>
          </Card>

          {/* OPTIONAL DETAIL — collapsed by default to keep the form short. */}
          <details className="group border-2 border-dashed border-border rounded-md bg-card/40">
            <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 select-none">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-0.5">
                  Optional
                </div>
                <div className="text-sm font-bold text-foreground font-display">
                  Add more detail (date, location, your name…)
                </div>
              </div>
              <ChevronDown
                className="h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>

            <div className="px-5 pb-5 space-y-5 border-t border-dashed border-border pt-5">
              {/* Identification */}
              <div className="space-y-2">
                <Label htmlFor="creatureName">
                  Did it match a known cryptid?
                </Label>
                <Input
                  id="creatureName"
                  value={formData.creatureName}
                  onChange={(e) => handleInputChange("creatureName", e.target.value)}
                  placeholder="e.g., Not Deer, Mothman, Sheepsquatch — or leave blank"
                  className="bg-background border-border"
                />
              </div>

              {/* When */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date of sighting</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Approximate time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              {/* Where */}
              <div className="space-y-2">
                <Label htmlFor="location">Specific location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Near Pine Creek Trail, Pocahontas County"
                  className="bg-background border-border"
                />
              </div>

              {/* Physical / behavior */}
              <div className="space-y-2">
                <Label htmlFor="physicalDescription">
                  What did it look like?
                </Label>
                <Textarea
                  id="physicalDescription"
                  value={formData.physicalDescription}
                  onChange={(e) =>
                    handleInputChange("physicalDescription", e.target.value)
                  }
                  placeholder="Size, color, features — anything you noticed."
                  rows={3}
                  className="bg-background border-border resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="behavior">How did it behave?</Label>
                <Textarea
                  id="behavior"
                  value={formData.behavior}
                  onChange={(e) => handleInputChange("behavior", e.target.value)}
                  placeholder="Movements, sounds, how it reacted to you."
                  rows={3}
                  className="bg-background border-border resize-none"
                />
              </div>

              {/* Witness info — last, lowest pressure */}
              <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-dashed border-border">
                <div className="space-y-2">
                  <Label htmlFor="witnessName">Your name or pseudonym</Label>
                  <Input
                    id="witnessName"
                    value={formData.witnessName}
                    onChange={(e) =>
                      handleInputChange("witnessName", e.target.value)
                    }
                    placeholder="Anonymous if left blank"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (for follow-up only)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="your@email.com"
                    aria-invalid={touched.email && !!errors.email}
                    aria-describedby={
                      touched.email && errors.email ? "email-error" : undefined
                    }
                    className={`bg-background border-border ${
                      touched.email && errors.email ? "border-destructive" : ""
                    }`}
                  />
                  {touched.email && errors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="text-xs text-destructive"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </details>

          {/* Submit */}
          <Card className="border-2 border-[hsl(var(--bureau-border))] bg-card">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Submissions are reviewed before publishing. Honest reports only.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 border-[3px] border-[hsl(var(--bureau-stamp))] rounded-sm font-bold uppercase tracking-widest text-sm font-display text-[hsl(var(--bureau-stamp))] shadow-[inset_0_0_0_1.5px_hsl(var(--bureau-stamp))] hover:bg-[hsl(var(--bureau-stamp)/0.06)] active:bg-[hsl(var(--bureau-stamp)/0.12)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px] justify-center"
                  style={{
                    transform: "rotate(-1deg)",
                    filter: "url(#__svg-stamp-texture)",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Filing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      File Report
                    </>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </section>
  );
}
