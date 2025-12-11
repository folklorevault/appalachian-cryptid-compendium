// Schema.org structured data component for SEO
// Renders JSON-LD scripts in the document head

import { useEffect } from "react";

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

type StructuredDataProps = {
  type: "website" | "article" | "breadcrumb";
  data: WebSiteSchema | ArticleSchema | BreadcrumbSchema;
};

export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    // Create script element
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    script.id = `structured-data-${type}`;

    // Add to head
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById(`structured-data-${type}`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [type, data]);

  return null; // This component doesn't render anything visible
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
  lastSighting?: string;
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
    dateModified: cryptid.lastSighting,
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
        url: "https://appalachiancryptid.com/og-image.png",
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
