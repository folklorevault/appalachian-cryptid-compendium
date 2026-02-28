"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { SightingReceipt } from "@/components/SightingReceipt";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, MapPin, Calendar, FileText, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormErrors {
  witnessName?: string;
  email?: string;
  date?: string;
  location?: string;
  state?: string;
  description?: string;
  physicalDescription?: string;
}

interface SubmissionData {
  witnessName: string;
  date: string;
  location: string;
  state: string;
  creatureName?: string;
}

export function ReportForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
  const [formData, setFormData] = useState({
    witnessName: "",
    email: "",
    date: "",
    time: "",
    location: "",
    state: "",
    creatureName: "",
    description: "",
    physicalDescription: "",
    behavior: "",
  });

  const validateField = useCallback((field: string, value: string): string | undefined => {
    switch (field) {
      case "witnessName":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return undefined;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
        return undefined;
      case "date":
        if (!value) return "Date is required";
        if (new Date(value) > new Date()) return "Date cannot be in the future";
        return undefined;
      case "location":
        if (!value.trim()) return "Location is required";
        if (value.trim().length < 5) return "Please provide more location detail";
        return undefined;
      case "state":
        if (!value) return "State is required";
        return undefined;
      case "description":
        if (!value.trim()) return "Description is required";
        if (value.trim().length < 50) return "Please provide at least 50 characters";
        return undefined;
      case "physicalDescription":
        if (!value.trim()) return "Physical description is required";
        if (value.trim().length < 20) return "Please provide at least 20 characters";
        return undefined;
      default:
        return undefined;
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    const requiredFields = ["witnessName", "email", "date", "location", "state", "description", "physicalDescription"];

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const states = [
    "Alabama", "Arkansas", "Florida", "Georgia", "Kentucky",
    "Louisiana", "Mississippi", "North Carolina", "South Carolina",
    "Tennessee", "Texas", "Virginia", "West Virginia"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/sightings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          witness_name: formData.witnessName,
          email: formData.email,
          date: formData.date,
          time: formData.time || undefined,
          location: formData.location,
          state: formData.state,
          creature_name: formData.creatureName || undefined,
          description: formData.description,
          physical_description: formData.physicalDescription,
          behavior: formData.behavior || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to submit report" }));
        throw new Error(errorData.error || "Failed to submit report");
      }

      // Store submission data and show receipt
      setSubmissionData({
        witnessName: formData.witnessName,
        date: formData.date,
        location: formData.location,
        state: formData.state,
        creatureName: formData.creatureName || undefined,
      });
      setSubmitted(true);
    } catch (error) {
      // In dev mode, show the receipt anyway so we can test the UI
      if (process.env.NODE_ENV === 'development') {
        console.warn("[DEV MODE] API failed, showing receipt anyway:", error);
        setSubmissionData({
          witnessName: formData.witnessName,
          date: formData.date,
          location: formData.location,
          state: formData.state,
          creatureName: formData.creatureName || undefined,
        });
        setSubmitted(true);
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
      creatureName: "",
      description: "",
      physicalDescription: "",
      behavior: "",
    });
    setTouched({});
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Button>
        </Link>
      </div>

      {/* Form Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {submitted && submissionData ? (
            <>
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
            </>
          ) : (
            <>
              <div className="text-center space-y-4 mb-8">
                <div className="font-typewriter text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  Submit Field Report
                </div>
                <h1 className="text-[28px] font-bold text-foreground font-display">
                  Report a Sighting
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Your encounter could be vital to our research. Please provide as much detail as possible.
                  All submissions are reviewed by our team and treated with confidentiality.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
            {/* Witness Information */}
            <Card className="border-2 border-border">
              <fieldset>
              <CardContent className="p-6 space-y-4">
                <legend className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                  WITNESS INFORMATION
                </legend>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="witnessName">Your Name *</Label>
                    <Input
                      id="witnessName"
                      value={formData.witnessName}
                      onChange={(e) => handleInputChange("witnessName", e.target.value)}
                      onBlur={() => handleBlur("witnessName")}
                      placeholder="Enter your name"
                      aria-invalid={touched.witnessName && !!errors.witnessName}
                      aria-describedby={touched.witnessName && errors.witnessName ? "witnessName-error" : undefined}
                      className={`bg-background border-border ${touched.witnessName && errors.witnessName ? "border-destructive" : ""}`}
                    />
                    {touched.witnessName && errors.witnessName && (
                      <p id="witnessName-error" role="alert" className="text-xs text-destructive">{errors.witnessName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="your@email.com"
                      aria-invalid={touched.email && !!errors.email}
                      aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                      className={`bg-background border-border ${touched.email && errors.email ? "border-destructive" : ""}`}
                    />
                    {touched.email && errors.email && (
                      <p id="email-error" role="alert" className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>
              </CardContent>
              </fieldset>
            </Card>

            {/* Sighting Details */}
            <Card className="border-2 border-border">
              <fieldset>
              <CardContent className="p-6 space-y-4">
                <legend className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  SIGHTING DATE & TIME
                </legend>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date of Sighting *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      onBlur={() => handleBlur("date")}
                      max={new Date().toISOString().split('T')[0]}
                      aria-invalid={touched.date && !!errors.date}
                      aria-describedby={touched.date && errors.date ? "date-error" : undefined}
                      className={`bg-background border-border ${touched.date && errors.date ? "border-destructive" : ""}`}
                    />
                    {touched.date && errors.date && (
                      <p id="date-error" role="alert" className="text-xs text-destructive">{errors.date}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Approximate Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                </div>
              </CardContent>
              </fieldset>
            </Card>

            {/* Location */}
            <Card className="border-2 border-border">
              <fieldset>
              <CardContent className="p-6 space-y-4">
                <legend className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  LOCATION DETAILS
                </legend>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Specific Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      onBlur={() => handleBlur("location")}
                      placeholder="e.g., Near Pine Creek Trail"
                      aria-invalid={touched.location && !!errors.location}
                      aria-describedby={touched.location && errors.location ? "location-error" : undefined}
                      className={`bg-background border-border ${touched.location && errors.location ? "border-destructive" : ""}`}
                    />
                    {touched.location && errors.location && (
                      <p id="location-error" role="alert" className="text-xs text-destructive">{errors.location}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => {
                        handleInputChange("state", value);
                        setTouched((prev) => ({ ...prev, state: true }));
                      }}
                    >
                      <SelectTrigger
                        className={`bg-background border-border ${touched.state && errors.state ? "border-destructive" : ""}`}
                        aria-invalid={touched.state && !!errors.state}
                        aria-describedby={touched.state && errors.state ? "state-error" : undefined}
                      >
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched.state && errors.state && (
                      <p id="state-error" role="alert" className="text-xs text-destructive">{errors.state}</p>
                    )}
                  </div>
                </div>
              </CardContent>
              </fieldset>
            </Card>

            {/* Creature Description */}
            <Card className="border-2 border-border">
              <fieldset>
              <CardContent className="p-6 space-y-4">
                <legend className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  CREATURE DESCRIPTION
                </legend>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="creatureName">Known Cryptid Name (if identifiable)</Label>
                    <Input
                      id="creatureName"
                      value={formData.creatureName}
                      onChange={(e) => handleInputChange("creatureName", e.target.value)}
                      placeholder="e.g., Mothman, Skunk Ape, Unknown"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Account of the Encounter *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      onBlur={() => handleBlur("description")}
                      placeholder="Describe what happened in as much detail as possible..."
                      rows={5}
                      aria-invalid={touched.description && !!errors.description}
                      aria-describedby={touched.description && errors.description ? "description-error" : "description-hint"}
                      className={`bg-background border-border resize-none ${touched.description && errors.description ? "border-destructive" : ""}`}
                    />
                    <div className="flex justify-between">
                      {touched.description && errors.description ? (
                        <p id="description-error" role="alert" className="text-xs text-destructive">{errors.description}</p>
                      ) : (
                        <span />
                      )}
                      <p id="description-hint" className="text-xs text-muted-foreground">{formData.description.length} / 50 min</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="physicalDescription">Physical Description of Creature *</Label>
                    <Textarea
                      id="physicalDescription"
                      value={formData.physicalDescription}
                      onChange={(e) => handleInputChange("physicalDescription", e.target.value)}
                      onBlur={() => handleBlur("physicalDescription")}
                      placeholder="Describe the creature's appearance: size, color, features..."
                      rows={4}
                      aria-invalid={touched.physicalDescription && !!errors.physicalDescription}
                      aria-describedby={touched.physicalDescription && errors.physicalDescription ? "physicalDescription-error" : "physicalDescription-hint"}
                      className={`bg-background border-border resize-none ${touched.physicalDescription && errors.physicalDescription ? "border-destructive" : ""}`}
                    />
                    <div className="flex justify-between">
                      {touched.physicalDescription && errors.physicalDescription ? (
                        <p id="physicalDescription-error" role="alert" className="text-xs text-destructive">{errors.physicalDescription}</p>
                      ) : (
                        <span />
                      )}
                      <p id="physicalDescription-hint" className="text-xs text-muted-foreground">{formData.physicalDescription.length} / 20 min</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="behavior">Observed Behavior</Label>
                    <Textarea
                      id="behavior"
                      value={formData.behavior}
                      onChange={(e) => handleInputChange("behavior", e.target.value)}
                      placeholder="Describe how the creature behaved, movements, sounds..."
                      rows={3}
                      className="bg-background border-border resize-none"
                    />
                  </div>
                </div>
              </CardContent>
              </fieldset>
            </Card>

            {/* Submit */}
            <Card className="border-2 border-[hsl(var(--bureau-border))] bg-card">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    By submitting, you confirm this report is truthful and accurate.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 border-[3px] border-[hsl(var(--bureau-stamp))] rounded-sm font-bold uppercase tracking-widest text-sm font-display text-[hsl(var(--bureau-stamp))] shadow-[inset_0_0_0_1.5px_hsl(var(--bureau-stamp))] hover:bg-[hsl(var(--bureau-stamp)/0.06)] active:bg-[hsl(var(--bureau-stamp)/0.12)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px] justify-center"
                    style={{ transform: "rotate(-1deg)", filter: "url(#stamp-texture)" }}
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
            </>
          )}
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
}
