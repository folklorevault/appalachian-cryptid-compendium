import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, Upload, MapPin, Calendar, FileText, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubmitSighting } from "@/hooks/use-sightings";
import { analytics } from "@/lib/analytics";

interface FormErrors {
  witnessName?: string;
  email?: string;
  date?: string;
  location?: string;
  state?: string;
  description?: string;
  physicalDescription?: string;
}

const ReportSighting = () => {
  const { toast } = useToast();
  const submitSighting = useSubmitSighting();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

    try {
      await submitSighting.mutateAsync({
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
        photo_url: photoPreview || undefined,
      });

      toast({
        title: "Report Received",
        description: "Thank you for your submission. Our research team will review your sighting report.",
      });

      // Track successful sighting submission
      analytics.trackEvent("sighting_submitted", {
        creature: formData.creatureName || "unknown",
        state: formData.state,
        has_photo: !!photoPreview,
      });

      // Reset form
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
      setPhotoPreview(null);
      setTouched({});
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: (error as Error).message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const isSubmitting = submitSighting.isPending;

  return (
    <div className="min-h-screen bg-background">
      <Header badge="File a Report" />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Button>
        </Link>
      </div>

      {/* Form Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center space-y-4 mb-8">
            <Badge className="bg-primary/10 text-primary border-primary" variant="outline">
              SUBMIT FIELD REPORT
            </Badge>
            <h1 className="text-4xl font-bold text-foreground font-display">
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
              <CardContent className="p-6 space-y-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                  WITNESS INFORMATION
                </div>
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
                      className={`bg-background border-border ${touched.witnessName && errors.witnessName ? "border-destructive" : ""}`}
                    />
                    {touched.witnessName && errors.witnessName && (
                      <p className="text-xs text-destructive">{errors.witnessName}</p>
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
                      className={`bg-background border-border ${touched.email && errors.email ? "border-destructive" : ""}`}
                    />
                    {touched.email && errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sighting Details */}
            <Card className="border-2 border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                  <Calendar className="h-4 w-4" />
                  SIGHTING DATE & TIME
                </div>
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
                      className={`bg-background border-border ${touched.date && errors.date ? "border-destructive" : ""}`}
                    />
                    {touched.date && errors.date && (
                      <p className="text-xs text-destructive">{errors.date}</p>
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
            </Card>

            {/* Location */}
            <Card className="border-2 border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                  <MapPin className="h-4 w-4" />
                  LOCATION DETAILS
                </div>
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
                      className={`bg-background border-border ${touched.location && errors.location ? "border-destructive" : ""}`}
                    />
                    {touched.location && errors.location && (
                      <p className="text-xs text-destructive">{errors.location}</p>
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
                      <p className="text-xs text-destructive">{errors.state}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creature Description */}
            <Card className="border-2 border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                  <FileText className="h-4 w-4" />
                  CREATURE DESCRIPTION
                </div>
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
                      className={`bg-background border-border resize-none ${touched.description && errors.description ? "border-destructive" : ""}`}
                    />
                    <div className="flex justify-between">
                      {touched.description && errors.description ? (
                        <p className="text-xs text-destructive">{errors.description}</p>
                      ) : (
                        <span />
                      )}
                      <p className="text-xs text-muted-foreground">{formData.description.length} / 50 min</p>
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
                      className={`bg-background border-border resize-none ${touched.physicalDescription && errors.physicalDescription ? "border-destructive" : ""}`}
                    />
                    <div className="flex justify-between">
                      {touched.physicalDescription && errors.physicalDescription ? (
                        <p className="text-xs text-destructive">{errors.physicalDescription}</p>
                      ) : (
                        <span />
                      )}
                      <p className="text-xs text-muted-foreground">{formData.physicalDescription.length} / 20 min</p>
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
            </Card>

            {/* Photo Upload */}
            <Card className="border-2 border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                  <Upload className="h-4 w-4" />
                  PHOTOGRAPHIC EVIDENCE (OPTIONAL)
                </div>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    {photoPreview ? (
                      <div className="space-y-4">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded border border-border"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setPhotoPreview(null)}
                          className="border-border"
                        >
                          Remove Photo
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <div className="space-y-2">
                          <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    By submitting, you confirm this report is truthful and accurate.
                  </p>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[150px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReportSighting;