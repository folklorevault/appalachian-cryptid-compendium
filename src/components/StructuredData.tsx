// Schema.org structured data component for SEO
// Renders JSON-LD scripts inline (not via useEffect) so Googlebot sees them

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

type StructuredDataProps = {
  type: "website" | "article" | "breadcrumb" | "collection" | "faq" | "blog" | "blogPosting";
  data: WebSiteSchema | ArticleSchema | BreadcrumbSchema | CollectionPageSchema | FAQPageSchema | BlogSchema | BlogPostingSchema;
};

export function StructuredData({ type, data }: StructuredDataProps) {
  // Render script tag directly in JSX so it's in the initial HTML render
  // This ensures Googlebot sees the structured data without needing to execute JS
  // Note: dangerouslySetInnerHTML is safe here because we control the data (JSON.stringify of our own objects)
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
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
