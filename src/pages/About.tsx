import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stamp } from "@/components/Stamp";
import { ArrowLeft, Mountain, Trees, Factory, Waves } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background paper-texture">
      <Header />

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
            <img
              src="/appalachian-cryptid-logo.webp"
              alt="Appalachian Cryptid Field Guide"
              className="h-60 w-60 mx-auto mb-4"
            />
            <Badge className="bg-primary/10 text-primary border-primary" variant="outline">
              ABOUT THE PROJECT
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display">
              Our Mission
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Documenting and preserving the strange stories, backroad sightings, and local legends
              of the Appalachian Mountains and the American South.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <Card className="border-2 border-border relative overflow-hidden aged-card">
              <div className="absolute top-4 right-4 hidden sm:block">
                <Stamp text="Est. 2024" variant="muted" rotation={12} className="text-xs" />
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
                  FIELD NOTES // ORIGIN STORY
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  The Cryptid Directory grew out of front-porch stories and late-night talk, long before 
                  it ever became a website. These are the kinds of tales you hear snapping beans on your 
                  grandparents' porch, standing in a gravel driveway after church, or riding the backroads 
                  while someone points at a ridge and says, "That's where your uncle saw it."
                </p>
                <p className="text-foreground/90 leading-relaxed">
                  In a region that proudly calls Jonesborough the Storytelling Capital of the World, stories 
                  move faster than cell service. For generations, ghost lights, strange tracks, river monsters, 
                  and night creatures have been passed down in family kitchens, truck stops, and festival tents.
                </p>
                <p className="text-foreground/90 leading-relaxed">
                  These reports already live in Cherokee and other Indigenous traditions, family lore, county ghost books, and dead forums full of broken image links.
                </p>
                <p className="text-foreground/90 leading-relaxed">
                  This site behaves like a regional field office: tagging cases, cross-referencing sightings, and keeping the paperwork barely under control.
                </p>
              </CardContent>
            </Card>

            {/* Regional Boxes - Qualitative */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 border-border">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mountain className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground font-display text-lg">Cherokee Territories</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Many creatures in this guide trace back to Cherokee oral traditions—stories that 
                        were here long before any settler wrote them down.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-border">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Trees className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground font-display text-lg">Mountain Hollers</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Remote valleys and ridgelines where sightings cluster. If it's been seen, 
                        chances are it was somewhere off the main road.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-border">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <Factory className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground font-display text-lg">Coal Country</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Industrial history and folklore intertwine. Abandoned mines, rail lines, 
                        and factory towns have their own haunted corners.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-border">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <Waves className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground font-display text-lg">River Bottoms</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Swamps, creeks, and lowlands where things move in the dark. 
                        Water draws life—and whatever else might be out there.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-border">
              <CardContent className="p-6 space-y-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
                  ROOTS OF THE WORK
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  The entries in this guide sit at the crossroads of several traditions. Some stories echo 
                  older Cherokee and other Indigenous accounts that settlers tried to recast as "lost races" 
                  or monsters, like the so-called Moon-Eyed People of Appalachian legend.
                </p>
                <p className="text-foreground/90 leading-relaxed">
                  Others grew out of frontier ghost lore and 19th-century hauntings, such as the Bell Witch 
                  reports from Middle Tennessee, where a family claimed to be tormented by a talking, physical 
                  spirit between 1817 and 1821.
                </p>
                <p className="text-foreground/90 leading-relaxed">
                  More recent cryptids emerged alongside railroads, mines, highways, and disasters. In Point 
                  Pleasant, West Virginia, sightings of a red-eyed winged figure in the 1960s became intertwined 
                  with the 1967 collapse of the Silver Bridge, folding industrial tragedy into modern monster 
                  folklore and tourism.
                </p>
                <p className="text-foreground/90 leading-relaxed italic border-l-2 border-primary/30 pl-4">
                  Taken together, these stories say as much about fear, landscape, and community memory as 
                  they do about any creature in the dark.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border">
              <CardContent className="p-6 space-y-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
                  RESEARCH METHODOLOGY
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-3 font-display">Investigation Process</h3>
                    <ul className="space-y-2 text-foreground/80 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">▸</span>
                        Collect witness accounts and local stories
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">▸</span>
                        Note locations, conditions, and recurring details
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">▸</span>
                        Cross-reference reports with newspapers, folklore collections, and regional history
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">▸</span>
                        Organize material into case files and regional categories
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-3 font-display">Classification System</h3>
                    <ul className="space-y-2 text-foreground/80 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-accent">▸</span>
                        Advisory level based on reported behavior and local reputation
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">▸</span>
                        Regional tags tied to specific towns, hollers, and landmarks
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">▸</span>
                        Taxonomic speculation where it helps track patterns
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">▸</span>
                        Cultural notes on who tells the story, how it's used, and why it persists
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-xs uppercase tracking-widest text-primary font-typewriter">
                  FILE A REPORT
                </div>
                <h3 className="text-xl font-bold text-foreground font-display">Seen Something You Can't Explain?</h3>
                <p className="text-muted-foreground">
                  Your account could help fill in the map. All submissions are reviewed 
                  and treated with discretion.
                </p>
                <Link to="/report">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Submit Your Account
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;