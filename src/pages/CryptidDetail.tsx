import { useParams, Link } from "react-router-dom";
import { cryptids } from "@/data/cryptids";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Eye, Calendar, AlertTriangle } from "lucide-react";

const CryptidDetail = () => {
  const { id } = useParams();
  const cryptid = cryptids.find((c) => c.id === id);

  if (!cryptid) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Specimen Not Found</h1>
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

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Directory
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-primary font-display">CRYPTID_DIRECTORY</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Image & Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-border">
            <img src={cryptid.image} alt={cryptid.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4">
              <Badge className={getDangerColor()}>{cryptid.dangerLevel} THREAT</Badge>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                SPECIMEN CLASSIFICATION
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
                  <div className="text-xs uppercase text-muted-foreground font-typewriter">Documented Sightings</div>
                  <div className="text-foreground">{cryptid.sightings} confirmed encounters</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-secondary mt-1" />
                <div>
                  <div className="text-xs uppercase text-muted-foreground font-typewriter">Last Sighting</div>
                  <div className="text-foreground">{cryptid.lastSighting}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                <div>
                  <div className="text-xs uppercase text-muted-foreground font-typewriter">Threat Assessment</div>
                  <div className="text-foreground">{cryptid.dangerLevel} risk to human interaction</div>
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
          <h2 className="text-2xl font-bold text-foreground font-display mb-6">Witness Testimonies</h2>
          <div className="space-y-4">
            {cryptid.testimonies.map((testimony) => (
              <Card key={testimony.id} className="border-2 border-border hover:border-primary/50 transition-colors">
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
          <h2 className="text-2xl font-bold text-foreground font-display mb-6">Historical Timeline</h2>
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
