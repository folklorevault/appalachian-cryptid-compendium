import { useParams, Link } from "react-router-dom";
import { cryptids } from "@/data/cryptids";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Stamp } from "@/components/Stamp";
import { ArrowLeft, MapPin, Eye, Calendar, AlertTriangle } from "lucide-react";

const CryptidDetail = () => {
  const { id } = useParams();
  const cryptid = cryptids.find((c) => c.id === id);

  if (!cryptid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Case File Not Found</h1>
          <Link to="/">
            <Button variant="outline" className="border-primary text-primary">Return to Directory</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getDangerColor = () => {
    switch (cryptid.dangerLevel) {
      case "High": return "bg-destructive text-destructive-foreground";
      case "Medium": return "bg-secondary text-secondary-foreground";
      case "Low": return "bg-accent text-accent-foreground";
    }
  };

  const getAdvisoryLabel = () => {
    switch (cryptid.dangerLevel) {
      case "High": return "Elevated";
      case "Medium": return "Moderate";
      case "Low": return "Low";
      default: return cryptid.dangerLevel;
    }
  };

  return (
    <div className="min-h-screen bg-background paper-texture">
      <Header badge="Case File" />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link to="/">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Hero Image & Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg vintage-frame">
            <img src={cryptid.image} alt={cryptid.name} className="w-full h-full object-cover sepia-light" />
            <div className="absolute top-4 right-4">
              <Badge className={getDangerColor()}>Advisory: {getAdvisoryLabel()}</Badge>
            </div>
            <div className="absolute bottom-4 left-4">
              <Stamp text="Documented" variant="primary" rotation={-8} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                CASE FILE #{cryptid.id.toUpperCase().slice(0, 3)}-{cryptid.sightings.toString().padStart(3, '0')}
              </div>
              <h1 className="text-4xl font-bold text-foreground font-display mb-2">{cryptid.name}</h1>
              <p className="text-xl italic text-muted-foreground font-serif">{cryptid.scientificName}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="text-xs uppercase text-muted-foreground font-typewriter">Primary Location</div>
                  <div className="text-foreground">{cryptid.location}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-accent mt-1" />
                <div>
                  <div className="text-xs uppercase text-muted-foreground font-typewriter">Filed Reports</div>
                  <div className="text-foreground">{cryptid.sightings} documented encounters</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-secondary mt-1" />
                <div>
                  <div className="text-xs uppercase text-muted-foreground font-typewriter">Most Recent</div>
                  <div className="text-foreground">{cryptid.lastSighting}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                <div>
                  <div className="text-xs uppercase text-muted-foreground font-typewriter">Advisory Level</div>
                  <div className="text-foreground">{getAdvisoryLabel()} - based on reported behavior</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {cryptid.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-primary/30 text-primary">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-border">
            <CardContent className="p-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-3">Physical Description</h3>
              <p className="text-foreground/90 leading-relaxed">{cryptid.physicalDescription}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardContent className="p-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-3">Behavior Patterns</h3>
              <p className="text-foreground/90 leading-relaxed">{cryptid.behavior}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardContent className="p-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-3">Habitat & Range</h3>
              <p className="text-foreground/90 leading-relaxed">{cryptid.habitat}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardContent className="p-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-3">Dietary Information</h3>
              <p className="text-foreground/90 leading-relaxed">{cryptid.diet}</p>
            </CardContent>
          </Card>
        </div>

        {/* Witness Testimonies */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground font-display mb-6">Witness Accounts</h2>
          <div className="space-y-4">
            {cryptid.testimonies.map((testimony) => (
              <Card key={testimony.id} className="border-2 border-border hover:border-primary/50 transition-colors aged-card">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <div><span className="text-muted-foreground">Witness:</span> <span className="text-foreground font-medium">{testimony.witness}</span></div>
                    <div><span className="text-muted-foreground">Date:</span> <span className="text-foreground">{testimony.date}</span></div>
                    <div><span className="text-muted-foreground">Location:</span> <span className="text-foreground">{testimony.location}</span></div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed italic border-l-2 border-primary pl-4">"{testimony.account}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Historical Timeline */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground font-display mb-6">Timeline of Reports</h2>
          <div className="space-y-4">
            {cryptid.timeline.map((event, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-24">
                  <Badge variant="outline" className="font-mono border-primary text-primary">{event.year}</Badge>
                </div>
                <Card className="flex-1 border-2 border-border">
                  <CardContent className="p-4">
                    <p className="text-foreground font-medium mb-1">{event.event}</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptidDetail;