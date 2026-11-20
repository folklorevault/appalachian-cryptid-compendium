// Schema.org structured data component for SEO
// Renders JSON-LD scripts inline (not via useEffect) so Googlebot sees them

import { formatSightingDate } from "@/lib/utils";

interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  description: string;
  url: string;
  publisher?: {
    "@type": "Organization";
    name: string;
    url: string;
  };
}

interface ArticleSchema {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    "@type": "Organization";
    name: string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    url: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
  };
  keywords?: string[];
  about?: {
    "@type": "Thing";
    name: string;
    description: string;
  };
}

interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

interface BlogSchema {
  "@context": "https://schema.org";
  "@type": "Blog";
  name: string;
  description: string;
  url: string;
  publisher?: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  blogPost: Array<{
    "@type": "BlogPosting";
    headline: string;
    description: string;
    datePublished: string;
    url: string;
    author?: {
      "@type": "Organization";
      name: string;
    };
  }>;
}

interface BlogPostingSchema {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description: string;
  datePublished: string;
  url: string;
  author?: {
    "@type": "Organization";
    name: string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    url: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
  };
  wordCount?: number;
}

interface CollectionPageSchema {
  "@context": "https://schema.org";
  "@type": "CollectionPage";
  name: string;
  description: string;
  url: string;
  publisher?: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  mainEntity: {
    "@type": "ItemList";
    numberOfItems: number;
    itemListElement: Array<{
      "@type": "ListItem";
      position: number;
      url: string;
      name: string;
      description?: string;
    }>;
  };
}

interface ItemListSchema {
  "@context": "https://schema.org";
  "@type": "ItemList";
  name: string;
  numberOfItems: number;
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    description?: string;
  }>;
}

interface EventSchema {
  "@context": "https://schema.org";
  "@type": "Event";
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  eventStatus: "https://schema.org/EventScheduled";
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode";
  url: string;
  isAccessibleForFree?: boolean;
  location: {
    "@type": "Place";
    name: string;
    address: {
      "@type": "PostalAddress";
      addressLocality: string;
      addressRegion: string;
      addressCountry: "US";
    };
  };
  organizer?: {
    "@type": "Organization";
    name: string;
    url?: string;
  };
}

type StructuredDataProps = {
  type: "website" | "article" | "breadcrumb" | "collection" | "faq" | "blog" | "blogPosting" | "itemList" | "event";
  data: WebSiteSchema | ArticleSchema | BreadcrumbSchema | CollectionPageSchema | FAQPageSchema | BlogSchema | BlogPostingSchema | ItemListSchema | EventSchema;
};

export function StructuredData({ type, data }: StructuredDataProps) {
  // Render script tag directly in JSX so it's in the initial HTML render
  // This ensures Googlebot sees the structured data without needing to execute JS
  // We sanitize the JSON by escaping '<' to prevent XSS from CMS data (e.g. </script> injection)
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

// Helper functions to create common schemas

export function createWebSiteSchema(): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Appalachian Cryptid Field Guide",
    description:
      "A field guide to the creatures that haunt the ridgelines, backroads, and hollers of the Appalachian Mountains and American South.",
    url: "https://appalachiancryptid.com",
    publisher: {
      "@type": "Organization",
      name: "Appalachian Cryptid Field Guide",
      url: "https://appalachiancryptid.com",
    },
  };
}

export function createCryptidArticleSchema(cryptid: {
  name: string;
  description: string;
  image?: string;
  slug?: string;
  tags?: string[];
  location?: string;
}): ArticleSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${cryptid.name} - Appalachian Cryptid Case File`,
    description: cryptid.description,
    image: cryptid.image
      ? (cryptid.image.startsWith('http') ? cryptid.image : `https://appalachiancryptid.com${cryptid.image}`)
      : undefined,
    author: {
      "@type": "Organization",
      name: "Appalachian Cryptid Field Guide",
    },
    publisher: {
      "@type": "Organization",
      name: "Appalachian Cryptid Field Guide",
      url: "https://appalachiancryptid.com",
      logo: {
        "@type": "ImageObject",
        url: "https://appalachiancryptid.com/og-image.jpg",
      },
    },
    mainEntityOfPage: cryptid.slug ? {
      "@type": "WebPage",
      "@id": `https://appalachiancryptid.com/cryptid/${cryptid.slug}`,
    } : undefined,
    keywords: cryptid.tags,
    about: {
      "@type": "Thing",
      name: cryptid.name,
      description: `${cryptid.name} cryptid sightings and reports${cryptid.location ? ` near ${cryptid.location}` : ''}.`,
    },
  };
}

export function createAnomalyArticleSchema(anomaly: {
  name: string;
  description: string;
  image?: string;
  slug?: string;
  tags?: string[];
  location?: string;
}): ArticleSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${anomaly.name} - Appalachian Anomaly Case File`,
    description: anomaly.description,
    image: anomaly.image
      ? (anomaly.image.startsWith('http') ? anomaly.image : `https://appalachiancryptid.com${anomaly.image}`)
      : undefined,
    author: {
      "@type": "Organization",
      name: "Appalachian Cryptid Field Guide",
    },
    publisher: {
      "@type": "Organization",
      name: "Appalachian Cryptid Field Guide",
      url: "https://appalachiancryptid.com",
      logo: {
        "@type": "ImageObject",
        url: "https://appalachiancryptid.com/og-image.jpg",
      },
    },
    mainEntityOfPage: anomaly.slug ? {
      "@type": "WebPage",
      "@id": `https://appalachiancryptid.com/anomaly/${anomaly.slug}`,
    } : undefined,
    keywords: anomaly.tags,
    about: {
      "@type": "Thing",
      name: anomaly.name,
      description: `${anomaly.name} anomaly sightings and reports${anomaly.location ? ` near ${anomaly.location}` : ''}.`,
    },
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; url?: string }>): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? `https://appalachiancryptid.com${item.url}` : undefined,
    })),
  };
}

export function createFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function createBlogSchema(
  bulletins: Array<{ title: string; summary: string; date: string; slug: string }>
): BlogSchema {
  const baseUrl = "https://appalachiancryptid.com";
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Bureau Bulletins — Appalachian Cryptid Field Guide",
    description:
      "Official communications from the Bureau of Appalachian Cryptid Documentation. Field primers, regional analysis, and operational guidance.",
    url: `${baseUrl}/bulletins`,
    publisher: {
      "@type": "Organization",
      name: "Appalachian Cryptid Field Guide",
      url: baseUrl,
    },
    blogPost: bulletins.map((b) => ({
      "@type": "BlogPosting",
      headline: b.title,
      description: b.summary,
      datePublished: b.date,
      url: `${baseUrl}/bulletin/${b.slug}`,
      author: {
        "@type": "Organization",
        name: "Appalachian Cryptid Field Guide",
      },
    })),
  };
}

export function createBlogPostingSchema(bulletin: {
  title: string;
  summary: string;
  date: string;
  slug: string;
  readTime?: string;
}): BlogPostingSchema {
  const baseUrl = "https://appalachiancryptid.com";
  const wordCount = bulletin.readTime
    ? parseInt(bulletin.readTime) * 200
    : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: bulletin.title,
    description: bulletin.summary,
    datePublished: bulletin.date,
    url: `${baseUrl}/bulletin/${bulletin.slug}`,
    author: {
      "@type": "Organization",
      name: "Appalachian Cryptid Field Guide",
    },
    publisher: {
      "@type": "Organization",
      name: "Appalachian Cryptid Field Guide",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/og-image.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/bulletin/${bulletin.slug}`,
    },
    wordCount,
  };
}

// Structured list of a cryptid's individual sightings. Uses ItemList (not
// Event) deliberately: Event rich results are governed by Google's
// scheduled-event guidelines, which historical folklore sightings don't meet.
// ItemList is honest, penalty-free, and still gives AI extractors a clean,
// quotable "when + where" record set.
export function createSightingListSchema(
  cryptidName: string,
  sightings: Array<{
    date?: string;
    location: string;
    witness?: string;
    account?: string;
    source?: string;
  }>
): ItemListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cryptidName} sightings`,
    numberOfItems: sightings.length,
    itemListElement: sightings.map((s, index) => {
      const displayDate = formatSightingDate(s.date);
      const description =
        [
          displayDate ? `Date: ${displayDate}.` : null,
          s.witness ? `Witness: ${s.witness}.` : null,
          s.account || null,
          s.source ? `Source: ${s.source}.` : null,
        ]
          .filter(Boolean)
          .join(" ") || undefined;
      return {
        "@type": "ListItem" as const,
        position: index + 1,
        name: [`${cryptidName} sighting`, s.location].filter(Boolean).join(" — "),
        description,
      };
    }),
  };
}

export function createCollectionPageSchema(
  cryptids: Array<{ name: string; slug?: { current?: string }; description?: string }>
): CollectionPageSchema {
  const baseUrl = "https://appalachiancryptid.com";
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Appalachian Cryptids List",
    description:
      "Complete list of Appalachian cryptids, monsters, and strange creatures. Browse documented sightings from the mountains and hollers of the American South.",
    url: baseUrl,
    publisher: {
      "@type": "Organization",
      name: "Appalachian Cryptid Field Guide",
      url: baseUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cryptids.length,
      itemListElement: cryptids.map((cryptid, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/cryptid/${cryptid.slug?.current}`,
        name: cryptid.name,
        description: cryptid.description || undefined,
      })),
    },
  };
}

// Only for an edition with confirmed dates: Google treats Event markup without
// a real start date as invalid, so "Dates not announced" pages get none.
export function createEventSchema(event: {
  name: string;
  slug: string;
  summary?: string;
  startDate: string;
  endDate?: string;
  town: string;
  state: string;
  organizer?: string;
  officialUrl?: string;
  free?: boolean;
}): EventSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    ...(event.summary && { description: event.summary }),
    startDate: event.startDate,
    ...(event.endDate && { endDate: event.endDate }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `https://appalachiancryptid.com/events/${event.slug}`,
    ...(event.free !== undefined && { isAccessibleForFree: event.free }),
    location: {
      "@type": "Place",
      name: event.town,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.town,
        addressRegion: event.state,
        addressCountry: "US",
      },
    },
    ...(event.organizer && {
      organizer: {
        "@type": "Organization",
        name: event.organizer,
        ...(event.officialUrl && { url: event.officialUrl }),
      },
    }),
  };
}
