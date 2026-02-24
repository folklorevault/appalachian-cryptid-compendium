import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Stamp } from "@/components/Stamp";
import { IncidentLog } from "@/components/IncidentLog";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareButtons } from "@/components/ShareButtons";
import { CryptidDetailSkeleton } from "@/components/CryptidDetailSkeleton";
import { BackToTop } from "@/components/BackToTop";
import { LabelTape } from "@/components/EvidenceChip";
import { FilingCabinet, FilingDrawer, FilingCabinetControls } from "@/components/FilingDrawer";
import { MapPin, Calendar, AlertTriangle, Clock, Zap, Ghost, Skull, Eye, Volume2, Cloud, MapPinned } from "lucide-react";
import { StructuredData, createCryptidArticleSchema, createBreadcrumbSchema, createFAQPageSchema } from "@/components/StructuredData";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSEO } from "@/hooks/use-seo";
import { useAnomaly, useRelatedAnomalies } from "@/hooks/use-sanity-anomalies";
import { urlFor } from "@/lib/sanity";
import { analytics } from "@/lib/analytics";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import type { AnomalyType, AnomalyStatus } from "@/types/sanity";

// Icon mapping for anomaly types
const typeIcons: Record<AnomalyType, typeof Zap> = {
  'Lights': Zap,
  'Hauntings': Ghost,
  'Curses': Skull,
  'Omen Events': Eye,
  'Sounds/Calls': Volume2,
  'Weather Oddities': Cloud,
  'Time Weirdness': Clock,
  'Places': MapPinned,
};

const AnomalyDetail = () => {
  const { id } = useParams();
  const routeId = typeof id === "string" ? id : undefined;
  const safeSlugParam = routeId && /^[a-z0-9-]+$/i.test(routeId) ? routeId : undefined;

  // Fetch anomaly from Sanity
  const { data: anomaly, isLoading, error } = useAnomaly(safeSlugParam);

  // Fetch related anomalies
  const { data: relatedAnomalies = [] } = useRelatedAnomalies(
    anomaly?.slug?.current,
    anomaly?.anomalyType,
    anomaly?.region
  );

  // Get image URL from Sanity
  const imageUrl = anomaly?.image
    ? urlFor(anomaly.image).width(800).height(1200).fit("crop").quality(70).url()
    : '';

  const heroSrcSet = anomaly?.image
    ? [480, 640, 800, 960]
        .map((w) => {
          const h = Math.round(w * 1.5); // 2:3 aspect
          const u = urlFor(anomaly.image).width(w).height(h).fit("crop").quality(70).url();
          return `${u} ${w}w`;
        })
        .join(", ")
    : undefined;

  // OG image
  const ogImageUrl = anomaly?.image
    ? urlFor(anomaly.image).width(1200).height(630).fit('crop').quality(80).url()
    : `https://appalachiancryptid.com/og-image.jpg`;

  const seoDescription = anomaly
    ? `${anomaly.subhead || anomaly.description || `Learn about ${anomaly.name}`} Reported near ${anomaly.location}. Part of the Anomalies Desk.`
    : undefined;

  // SEO meta tags
  useSEO({
    title: anomaly ? `${anomaly.name} - ${anomaly.location} | Anomalies Desk` : undefined,
    description: seoDescription,
    image: ogImageUrl,
    url: anomaly?.slug?.current
      ? `https://appalachiancryptid.com/anomaly/${encodeURIComponent(anomaly.slug.current)}`
      : undefined,
    type: "article"
  });

  // Track view with analytics
  useEffect(() => {
    if (anomaly) {
      analytics.trackEvent("anomaly_view", {
        slug: anomaly.slug?.current || anomaly.name.toLowerCase(),
        name: anomaly.name,
        type: anomaly.anomalyType,
      });
    }
  }, [anomaly]);

  if (isLoading) {
    return <CryptidDetailSkeleton />;
  }

  if (error || !anomaly) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Case File Not Found</h1>
          <Link to="/anomalies">
            <Button variant="outline" className="border-primary text-primary">Return to Anomalies Desk</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: AnomalyStatus) => {
    switch (status) {
      case "Active": return "bg-destructive text-destructive-foreground";
      case "Open File": return "bg-secondary text-secondary-foreground";
      case "Cold": return "bg-muted text-muted-foreground";
      case "Seasonal": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const TypeIcon = typeIcons[anomaly.anomalyType] || Zap;

  return (
    <div className="min-h-screen bg-background paper-texture">
      <StructuredData
        type="article"
        data={createCryptidArticleSchema({
          name: anomaly.name,
          description: anomaly.subhead || anomaly.description || '',
          image: imageUrl,
          slug: anomaly.slug?.current,
          tags: anomaly.tags,
          location: anomaly.location
        })}
      />
      <StructuredData
        type="breadcrumb"
        data={createBreadcrumbSchema([
          { name: "Cryptid Directory", url: "/" },
          { name: "Anomalies Desk", url: "/anomalies" },
          { name: anomaly.name }
        ])}
      />
      {anomaly.declassifiedBriefings && anomaly.declassifiedBriefings.length > 0 && (
        <StructuredData
          type="faq"
          data={createFAQPageSchema(anomaly.declassifiedBriefings)}
        />
      )}
      <Header badge="Case File" />

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList className="font-typewriter uppercase tracking-widest text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Directory</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/anomalies">Anomalies Desk</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{anomaly.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Hero Image & Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg vintage-frame">
            {imageUrl ? (
              <img
                src={imageUrl}
                srcSet={heroSrcSet}
                sizes="(max-width: 1024px) 92vw, 800px"
                alt={anomaly.imageAlt || anomaly.name}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width="800"
                height="1200"
                className="w-full h-full object-cover sepia-light"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <TypeIcon className="h-24 w-24 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute top-4 right-4">
              <Badge className={getStatusColor(anomaly.status)}>{anomaly.status}</Badge>
            </div>
            <div className="absolute top-4 left-4">
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-primary/50">
                <TypeIcon className="h-3 w-3 mr-1" />
                {anomaly.anomalyType}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4">
              <Stamp text="Anomaly" variant="primary" rotation={-8} />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mb-2">
                CASE FILE #{anomaly.slug?.current?.toUpperCase().slice(0, 3) || 'UNK'}-{(anomaly.slug?.current?.length ?? 0).toString().padStart(3, '0')}
              </div>
              <h1 className="text-4xl font-bold text-foreground font-display mb-2">{anomaly.name}</h1>
              {anomaly.subhead && (
                <p className="text-base text-foreground/80 mb-2">{anomaly.subhead}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="text-xs uppercase text-muted-foreground font-typewriter">Primary Location</div>
                  <div className="text-foreground">{anomaly.location}</div>
                  {anomaly.subRegion && (
                    <div className="text-sm text-muted-foreground">{anomaly.subRegion} region</div>
                  )}
                </div>
              </div>
              {anomaly.firstDocumented && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-accent mt-1" />
                  <div>
                    <div className="text-xs uppercase text-muted-foreground font-typewriter">First Documented</div>
                    <div className="text-foreground">{anomaly.firstDocumented}</div>
                  </div>
                </div>
              )}
              {anomaly.frequency && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-secondary mt-1" />
                  <div>
                    <div className="text-xs uppercase text-muted-foreground font-typewriter">Frequency</div>
                    <div className="text-foreground">{anomaly.frequency}</div>
                  </div>
                </div>
              )}
              {anomaly.safetyAdvisory && (
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                  <div>
                    <div className="text-xs uppercase text-muted-foreground font-typewriter">Safety Advisory</div>
                    <div className="text-foreground">{anomaly.safetyAdvisory}</div>
                  </div>
                </div>
              )}
            </div>

            {anomaly.tags && anomaly.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {anomaly.tags.map((tag) => (
                  <LabelTape key={tag}>{tag}</LabelTape>
                ))}
              </div>
            )}

            {/* Actions: Favorite & Share */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border">
              <FavoriteButton
                slug={`anomaly-${anomaly.slug?.current}` || ""}
                name={anomaly.name}
                variant="inline"
              />
              <ShareButtons title={anomaly.name} />
            </div>
          </div>
        </div>

        {/* Detailed Sections - Filing Cabinet */}
        {(anomaly.phenomenon || anomaly.theories || anomaly.relatedLocations) && (
          <div className="mb-8">
            <FilingCabinet defaultOpen={anomaly.phenomenon ? ["phenomenon"] : []}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground font-display">Case Sections</h2>
                <FilingCabinetControls />
              </div>

              {anomaly.phenomenon && (
                <FilingDrawer value="phenomenon" label="Phenomenon Description">
                  <p className="whitespace-pre-line">{anomaly.phenomenon}</p>
                </FilingDrawer>
              )}

              {anomaly.theories && (
                <FilingDrawer value="theories" label="Theories & Explanations">
                  <p className="whitespace-pre-line">{anomaly.theories}</p>
                </FilingDrawer>
              )}

              {anomaly.relatedLocations && (
                <FilingDrawer value="locations" label="Related Locations">
                  <p className="whitespace-pre-line">{anomaly.relatedLocations}</p>
                </FilingDrawer>
              )}
            </FilingCabinet>
          </div>
        )}

        {/* Declassified Briefings (FAQ) */}
        {anomaly.declassifiedBriefings && anomaly.declassifiedBriefings.length > 0 && (
          <div className="mb-8">
            <FilingCabinet defaultOpen={[]}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground font-display">Declassified Briefings</h2>
                <FilingCabinetControls />
              </div>

              {anomaly.declassifiedBriefings.map((briefing) => (
                <FilingDrawer
                  key={briefing._key}
                  value={briefing._key}
                  label={briefing.question}
                >
                  <p className="whitespace-pre-line">{briefing.answer}</p>
                </FilingDrawer>
              ))}
            </FilingCabinet>
          </div>
        )}

        {/* Witness Accounts - as Filing Drawers */}
        {anomaly.witnesses && anomaly.witnesses.length > 0 && (
          <div className="mb-8">
            <FilingCabinet defaultOpen={["addendum-0"]}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground font-display">Witness Accounts</h2>
                <FilingCabinetControls />
              </div>

              {anomaly.witnesses.map((witness, index) => {
                const addendumLetter = String.fromCharCode(65 + index);

                return (
                  <FilingDrawer
                    key={witness._key}
                    value={`addendum-${index}`}
                    label={`Addendum ${addendumLetter}`}
                  >
                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <div><span className="text-muted-foreground">Witness:</span> <span className="text-foreground font-medium">{witness.witness}</span></div>
                      {witness.date && <div><span className="text-muted-foreground">Date:</span> <span className="text-foreground">{witness.date}</span></div>}
                    </div>
                    <p className="text-foreground/80 leading-relaxed italic border-l-2 border-primary pl-4">"{witness.account}"</p>
                  </FilingDrawer>
                );
              })}
            </FilingCabinet>
          </div>
        )}

        {/* Incident Log */}
        {anomaly.bureauNotes && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground font-display mb-6">Field Transmission</h2>
            <IncidentLog
              content={anomaly.bureauNotes}
              anomalyName={anomaly.name}
              caseNumber={anomaly.slug?.current?.toUpperCase().slice(0, 3) + "-" + (anomaly.slug?.current?.length ?? 0).toString().padStart(3, '0')}
              station={anomaly.subRegion ? `${anomaly.subRegion.toUpperCase()} OUTPOST` : `${anomaly.region} FIELD STATION`}
            />
          </div>
        )}

        {/* Related Anomalies */}
        {relatedAnomalies.length > 0 && (
          <div className="mb-8 border-t border-border pt-8">
            <h2 className="text-2xl font-bold text-foreground font-display mb-6">Related Case Files</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedAnomalies.filter(related => related.gridImage).map((related) => {
                const relatedImageUrl = urlFor(related.gridImage).width(400).height(400).url();
                const RelatedIcon = typeIcons[related.anomalyType] || Zap;

                return (
                  <Link
                    key={related._id}
                    to={`/anomaly/${related.slug?.current}`}
                    className="group"
                  >
                    <Card className="border-2 border-border hover:border-primary transition-colors overflow-hidden">
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={relatedImageUrl}
                          alt={related.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 sepia-light"
                        />
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs">
                            <RelatedIcon className="h-3 w-3 mr-1" />
                            {related.anomalyType}
                          </Badge>
                        </div>
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
        {/* Newsletter Signup - compact strip */}
        <div className="mb-8 border-t border-border pt-8">
          <NewsletterSignup variant="compact" />
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default AnomalyDetail;
