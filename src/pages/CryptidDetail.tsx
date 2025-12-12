import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Stamp } from "@/components/Stamp";
import { ArrowLeft, MapPin, Eye, AlertTriangle, Loader2 } from "lucide-react";
import { StructuredData, createCryptidArticleSchema, createBreadcrumbSchema } from "@/components/StructuredData";
import { useSEO } from "@/hooks/use-seo";
import { useCryptid, useRelatedCryptids } from "@/hooks/use-sanity-cryptids";
import { urlFor } from "@/lib/sanity";
import { getStaticImagePath } from "@/lib/sanity-provider";

const CryptidDetail = () => {
  const { id } = useParams();

  // Fetch cryptid from Sanity (or static fallback)
  const { data: cryptid, isLoading, error } = useCryptid(id);

  // Fetch related cryptids
  const { data: relatedCryptids = [] } = useRelatedCryptids(
    cryptid?.slug?.current,
    cryptid?.region,
    cryptid?.dangerLevel
  );

  // Get image URL - from Sanity if available, otherwise static fallback
  const imageUrl = cryptid?.image
    ? urlFor(cryptid.image).width(800).height(1200).url()
    : id ? getStaticImagePath(id, 'detail') : '';

  // OG image - use wider format for social sharing
  const ogImageUrl = cryptid?.image
    ? urlFor(cryptid.image).width(1200).height(630).fit('crop').url()
    : `https://appalachiancryptid.com/og-image.png`;

  // Build SEO-optimized description with location context
  // Prefer subhead for concise intro, fall back to description
  const seoDescription = cryptid
    ? `${cryptid.subhead || cryptid.description || `Learn about the ${cryptid.name}`} Sightings reported near ${cryptid.location}. Part of the Appalachian Cryptid Field Guide.`
    : undefined;

  // SEO meta tags
  useSEO({
    title: cryptid ? `${cryptid.name} - ${cryptid.location} Cryptid` : undefined,
    description: seoDescription,
    image: ogImageUrl,
    url: `https://appalachiancryptid.com/cryptid/${id}`,
    type: "article"
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading case file...</p>
        </div>
      </div>
    );
  }

  if (error || !cryptid) {
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
      <StructuredData
        type="article"
        data={createCryptidArticleSchema({
          name: cryptid.name,
          description: cryptid.subhead || cryptid.description || '',
          image: imageUrl,
          slug: cryptid.slug?.current,
          tags: cryptid.tags,
          location: cryptid.location
        })}
      />
      <StructuredData
        type="breadcrumb"
        data={createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: cryptid.name }
        ])}
      />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg vintage-frame">
            <img
              src={imageUrl}
              alt={cryptid.imageAlt || cryptid.name}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              width="800"
              height="1200"
              className="w-full h-full object-cover sepia-light"
            />
            <div className="absolute top-4 right-4">
              <Badge className={getDangerColor()}>Advisory: {getAdvisoryLabel()}</Badge>
            </div>
            <div className="absolute bottom-4 left-4">
              <Stamp text="Documented" variant="primary" rotation={-8} />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                CASE FILE #{cryptid.slug?.current?.toUpperCase().slice(0, 3) || 'UNK'}-{(cryptid.sightings ?? 0).toString().padStart(3, '0')}
              </div>
              <h1 className="text-4xl font-bold text-foreground font-display mb-2">{cryptid.name}</h1>
              {cryptid.subhead && (
                <p className="text-base text-foreground/80 mb-2">{cryptid.subhead}</p>
              )}
              {cryptid.scientificName && (
                <p className="text-xl italic text-muted-foreground font-serif">{cryptid.scientificName}</p>
              )}
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
                  <div className="text-foreground">{cryptid.sightings ?? 0} documented encounters</div>
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

            {cryptid.tags && cryptid.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {cryptid.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-primary/30 text-primary">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {cryptid.physicalDescription && (
            <Card className="border-2 border-border">
              <CardContent className="p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-3">Physical Description</h3>
                <p className="text-foreground/90 leading-relaxed">{cryptid.physicalDescription}</p>
              </CardContent>
            </Card>
          )}

          {cryptid.behavior && (
            <Card className="border-2 border-border">
              <CardContent className="p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-3">Behavior Patterns</h3>
                <p className="text-foreground/90 leading-relaxed">{cryptid.behavior}</p>
              </CardContent>
            </Card>
          )}

          {cryptid.habitat && (
            <Card className="border-2 border-border">
              <CardContent className="p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-3">Habitat & Range</h3>
                <p className="text-foreground/90 leading-relaxed">{cryptid.habitat}</p>
              </CardContent>
            </Card>
          )}

          {cryptid.diet && (
            <Card className="border-2 border-border">
              <CardContent className="p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-3">Dietary Information</h3>
                <p className="text-foreground/90 leading-relaxed">{cryptid.diet}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Witness Testimonies */}
        {cryptid.testimonies && cryptid.testimonies.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground font-display mb-6">Witness Accounts</h2>
            <div className="space-y-4">
              {cryptid.testimonies.map((testimony) => (
                <Card key={testimony._key} className="border-2 border-border hover:border-primary/50 transition-colors aged-card">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <div><span className="text-muted-foreground">Witness:</span> <span className="text-foreground font-medium">{testimony.witness}</span></div>
                      {testimony.date && <div><span className="text-muted-foreground">Date:</span> <span className="text-foreground">{testimony.date}</span></div>}
                      {testimony.location && <div><span className="text-muted-foreground">Location:</span> <span className="text-foreground">{testimony.location}</span></div>}
                    </div>
                    <p className="text-foreground/80 leading-relaxed italic border-l-2 border-primary pl-4">"{testimony.account}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Historical Timeline */}
        {cryptid.timeline && cryptid.timeline.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground font-display mb-6">Timeline of Reports</h2>
            <div className="space-y-4">
              {cryptid.timeline.map((event) => (
                <div key={event._key} className="flex gap-4">
                  <div className="flex-shrink-0 w-24">
                    <Badge variant="outline" className="font-mono border-primary text-primary">{event.year}</Badge>
                  </div>
                  <Card className="flex-1 border-2 border-border">
                    <CardContent className="p-4">
                      <p className="text-foreground font-medium mb-1">{event.event}</p>
                      {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Cryptids */}
        {relatedCryptids.length > 0 && (
          <div className="mb-8 border-t border-border pt-8">
            <h2 className="text-2xl font-bold text-foreground font-display mb-6">Related Case Files</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedCryptids.map((related) => {
                const relatedImageUrl = related.gridImage
                  ? urlFor(related.gridImage).width(400).height(400).url()
                  : getStaticImagePath(related.slug?.current || '', 'grid');

                return (
                  <Link
                    key={related._id}
                    to={`/cryptid/${related.slug?.current}`}
                    className="group"
                  >
                    <Card className="border-2 border-border hover:border-primary transition-colors overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={relatedImageUrl}
                          alt={related.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 sepia-light"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {related.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{related.location}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptidDetail;
