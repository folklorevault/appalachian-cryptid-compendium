import { useState } from "react";
import { Link } from "react-router-dom";
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
import { ArrowLeft, Upload, MapPin, Calendar, FileText, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReportSighting = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
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

  const states = [
    "Alabama", "Arkansas", "Florida", "Georgia", "Kentucky",
    "Louisiana", "Mississippi", "North Carolina", "South Carolina",
    "Tennessee", "Texas", "Virginia", "West Virginia"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    setIsSubmitting(true);

    // Simulate submission (no backend connected)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Report Received",
      description: "Thank you for your submission. Our research team will review your sighting report.",
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
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <h1 className="text-2xl font-bold text-primary font-display tracking-tight">
                  CRYPTID_DIRECTORY
                </h1>
              </Link>
              <Badge variant="outline" className="hidden sm:inline-flex border-primary text-primary">
                FIELD REPORT
              </Badge>
            </div>
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-sm text-foreground hover:text-primary transition-colors">
                Directory
              </Link>
              <Link to="/about" className="text-sm text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/map" className="text-sm text-foreground hover:text-primary transition-colors">
                Map
              </Link>
              <Link to="/report" className="text-sm text-primary transition-colors">
                Report
              </Link>
            </nav>
          </div>
        </div>
      </header>

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
                      placeholder="Enter your name"
                      required
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="bg-background border-border"
                    />
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
                      required
                      className="bg-background border-border"
                    />
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
                      placeholder="e.g., Near Pine Creek Trail"
                      required
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => handleInputChange("state", value)}
                    >
                      <SelectTrigger className="bg-background border-border">
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
                      placeholder="Describe what happened in as much detail as possible..."
                      required
                      rows={5}
                      className="bg-background border-border resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="physicalDescription">Physical Description of Creature *</Label>
                    <Textarea
                      id="physicalDescription"
                      value={formData.physicalDescription}
                      onChange={(e) => handleInputChange("physicalDescription", e.target.value)}
                      placeholder="Describe the creature's appearance: size, color, features..."
                      required
                      rows={4}
                      className="bg-background border-border resize-none"
                    />
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
                      "Submitting..."
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

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Cryptid Directory. All field notes and specimen data classified.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ReportSighting;
