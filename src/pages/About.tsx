import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, MapPin, FileText, Eye } from "lucide-react";

const About = () => {
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
                v2.4.1
              </Badge>
            </div>
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-sm text-foreground hover:text-primary transition-colors">
                Directory
              </Link>
              <Link to="/about" className="text-sm text-primary transition-colors">
                About
              </Link>
              <Link to="/map" className="text-sm text-foreground hover:text-primary transition-colors">
                Map
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

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-primary/10 text-primary border-primary" variant="outline">
              ABOUT THE PROJECT
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display">
              Our Mission
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Documenting and preserving the rich folklore and mysterious sightings 
              of the Appalachian Mountains and Southern United States.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <Card className="border-2 border-border">
              <CardContent className="p-6 space-y-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
                  FIELD NOTES // ORIGIN STORY
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  The Cryptid Directory was established in 1987 by a group of dedicated field researchers, 
                  folklorists, and enthusiasts who recognized the need for a comprehensive database of 
                  cryptid sightings in the Appalachian region. What started as a collection of handwritten 
                  notes and grainy photographs has evolved into the digital archive you see today.
                </p>
                <p className="text-foreground/90 leading-relaxed">
                  Our team has spent decades interviewing witnesses, investigating sighting locations, 
                  and compiling historical records. We approach each case with scientific rigor while 
                  respecting the cultural significance these creatures hold in local communities.
                </p>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-2 border-border">
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">500+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Documented Cases</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-border">
                <CardContent className="p-4 text-center">
                  <Eye className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">1,200+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Witness Accounts</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-border">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">13</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">States Covered</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-border">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">37</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Field Researchers</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-border">
              <CardContent className="p-6 space-y-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
                  RESEARCH METHODOLOGY
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Investigation Process</h3>
                    <ul className="space-y-2 text-foreground/80 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">▸</span>
                        Initial witness interview and statement recording
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">▸</span>
                        Site visit and environmental documentation
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">▸</span>
                        Historical research and cross-reference with archives
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">▸</span>
                        Analysis and classification of evidence
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Classification System</h3>
                    <ul className="space-y-2 text-foreground/80 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-accent">▸</span>
                        Threat level assessment based on documented behavior
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">▸</span>
                        Regional categorization and habitat mapping
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">▸</span>
                        Taxonomic speculation where applicable
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">▸</span>
                        Cultural significance and folklore documentation
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-xs uppercase tracking-widest text-primary font-typewriter">
                  CONTRIBUTE TO RESEARCH
                </div>
                <h3 className="text-xl font-bold text-foreground">Have You Witnessed Something Unexplained?</h3>
                <p className="text-muted-foreground">
                  Your account could be vital to our research. All submissions are reviewed by our team 
                  and treated with the utmost confidentiality.
                </p>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Submit a Sighting Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Cryptid Directory. All field notes and specimen data classified.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
