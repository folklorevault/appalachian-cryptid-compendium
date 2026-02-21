import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Stamp } from "@/components/Stamp";
import { BureauMemo } from "@/components/BureauMemo";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareButtons } from "@/components/ShareButtons";
import { CryptidDetailSkeleton } from "@/components/CryptidDetailSkeleton";
import { BackToTop } from "@/components/BackToTop";
import { LabelTape } from "@/components/EvidenceChip";
import { FilingCabinet, FilingDrawer, FilingCabinetControls } from "@/components/FilingDrawer";
import { ArrowLeft, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { StructuredData, createCryptidArticleSchema, createBreadcrumbSchema } from "@/components/StructuredData";
import { useSEO } from "@/hooks/use-seo";
import { useCryptid, useRelatedCryptids } from "@/hooks/use-sanity-cryptids";
import { urlFor } from "@/lib/sanity";
import { analytics } from "@/lib/analytics";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const CryptidDetail = () => {
  const { id } = useParams();
  const routeId = typeof id === "string" ? id : undefined;
  const safeSlugParam = routeId && /^[a-z0-9-]+$/i.test(routeId) ? routeId : undefined;

  // Fetch cryptid from Sanity (or static fallback)
  const { data: cryptid, isLoading, error } = useCryptid(safeSlugParam);

  // Fetch related cryptids
  const { data: relatedCryptids = [] } = useRelatedCryptids(
    cryptid?.slug?.current,
    cryptid?.region,
    cryptid?.dangerLevel
  );

  // Get image URL from Sanity
  const imageUrl = cryptid?.image
    ? urlFor(cryptid.image).width(800).height(1200).fit("crop").quality(70).url()
    : '';

  const heroSrcSet = cryptid?.image
    ? [480, 640, 800, 960]
        .map((w) => {
          const h = Math.round(w * 1.5); // 2:3 aspect
          const u = urlFor(cryptid.image).width(w).height(h).fit("crop").quality(70).url();
          return `${u} ${w}w`;
        })
        .join(", ")
    : undefined;

  // OG image - use wider format for social sharing
  const ogImageUrl = cryptid?.image
    ? urlFor(cryptid.image).width(1200).height(630).fit('crop').quality(80).url()
    : `https://appalachiancryptid.com/og-image.jpg`;

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
    url: cryptid?.slug?.current
      ? `https://appalachiancryptid.com/cryptid/${encodeURIComponent(cryptid.slug.current)}`
      : undefined,
    type: "article"
  });

  // Track cryptid view with analytics
  useEffect(() => {
    if (cryptid) {
      analytics.trackCryptidView(
        cryptid.slug?.current || cryptid.name.toLowerCase(),
        cryptid.name
      );
    }
  }, [cryptid]);

  if (isLoading) {
    return <CryptidDetailSkeleton />;
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
              srcSet={heroSrcSet}
              sizes="(max-width: 1024px) 92vw, 800px"
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
                CASE FILE #{cryptid.slug?.current?.toUpperCase().slice(0, 3) || 'UNK'}-{(cryptid.slug?.current?.length ?? 0).toString().padStart(3, '0')}
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
              {cryptid.firstDocumented && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-accent mt-1" />
                  <div>
                    <div className="text-xs uppercase text-muted-foreground font-typewriter">First Documented</div>
                    <div className="text-foreground">{cryptid.firstDocumented}</div>
                  </div>
                </div>
              )}
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
                  <LabelTape key={tag}>{tag}</LabelTape>
                ))}
              </div>
            )}

            {/* Actions: Favorite & Share */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border">
              <FavoriteButton
                slug={cryptid.slug?.current || ""}
                name={cryptid.name}
                variant="inline"
              />
              <ShareButtons title={cryptid.name} />
            </div>
          </div>
        </div>

        {/* Detailed Sections - Filing Cabinet */}
        {(cryptid.physicalDescription || cryptid.behavior || cryptid.habitat || cryptid.diet || cryptid.notableSightings) && (
          <div className="mb-8">
            <FilingCabinet defaultOpen={cryptid.physicalDescription ? ["physical"] : []}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground font-display">Case Sections</h2>
                <FilingCabinetControls />
              </div>

              {cryptid.physicalDescription && (
                <FilingDrawer value="physical" label="Physical Profile">
                  <p className="whitespace-pre-line">{cryptid.physicalDescription}</p>
                </FilingDrawer>
              )}

              {cryptid.behavior && (
                <FilingDrawer value="behavior" label="Behavioral Notes">
                  <p className="whitespace-pre-line">{cryptid.behavior}</p>
                </FilingDrawer>
              )}

              {cryptid.habitat && (
                <FilingDrawer value="habitat" label="Habitat Analysis">
                  <p className="whitespace-pre-line">{cryptid.habitat}</p>
                </FilingDrawer>
              )}

              {cryptid.diet && (
                <FilingDrawer value="diet" label="Dietary Report">
                  <p className="whitespace-pre-line">{cryptid.diet}</p>
                </FilingDrawer>
              )}

              {cryptid.notableSightings && (
                <FilingDrawer value="sightings" label="Sighting Timeline">
                  <p className="whitespace-pre-line">{cryptid.notableSightings}</p>
                </FilingDrawer>
              )}
            </FilingCabinet>
          </div>
        )}

        {/* Witness Testimonies - as Filing Drawers */}
        {cryptid.testimonies && cryptid.testimonies.length > 0 && (
          <div className="mb-8">
            <FilingCabinet defaultOpen={["addendum-0"]}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground font-display">Witness Accounts</h2>
                <FilingCabinetControls />
              </div>

              {cryptid.testimonies.map((testimony, index) => {
                // Convert index to letter: 0 -> A, 1 -> B, etc.
                const addendumLetter = String.fromCharCode(65 + index);

                return (
                  <FilingDrawer
                    key={testimony._key}
                    value={`addendum-${index}`}
                    label={`Addendum ${addendumLetter}`}
                  >
                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <div><span className="text-muted-foreground">Witness:</span> <span className="text-foreground font-medium">{testimony.witness}</span></div>
                      {testimony.date && <div><span className="text-muted-foreground">Date:</span> <span className="text-foreground">{testimony.date}</span></div>}
                      {testimony.location && <div><span className="text-muted-foreground">Location:</span> <span className="text-foreground">{testimony.location}</span></div>}
                    </div>
                    <p className="text-foreground/80 leading-relaxed italic border-l-2 border-primary pl-4">"{testimony.account}"</p>
                  </FilingDrawer>
                );
              })}
            </FilingCabinet>
          </div>
        )}

        {/* Bureau Memo - stands alone as official correspondence */}
        {cryptid.bureauNotes && (
          <div className="mb-8 max-w-2xl">
            <BureauMemo
              content={cryptid.bureauNotes}
              cryptidName={cryptid.name}
              caseNumber={cryptid.slug?.current?.toUpperCase().slice(0, 3) + "-" + (cryptid.slug?.current?.length ?? 0).toString().padStart(3, '0')}
            />
          </div>
        )}

        {/* Related Cryptids */}
        {relatedCryptids.length > 0 && (
          <div className="mb-8 border-t border-border pt-8">
            <h2 className="text-2xl font-bold text-foreground font-display mb-6">Related Case Files</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedCryptids.filter(related => related.gridImage).map((related) => {
                const relatedImageUrl = urlFor(related.gridImage).width(400).height(400).url();

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
        {/* Newsletter Signup - compact strip */}
        <div className="mb-8 border-t border-border pt-8">
          <NewsletterSignup variant="compact" />
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default CryptidDetail;
