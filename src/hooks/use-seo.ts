// Custom hook for managing SEO meta tags dynamically
import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function useSEO({
  title,
  description,
  image,
  url,
  type = "website",
}: SEOProps) {
  useEffect(() => {
    const baseTitle = "Appalachian Cryptids List";
    const baseDescription =
      "Complete list of Appalachian cryptids, monsters, and strange creatures. Browse documented sightings of Mothman, Wampus Cat, and more from the mountains and hollers of the American South.";
    const baseUrl = "https://appalachiancryptid.com";
    const baseImage = `${baseUrl}/og-image.jpg`;

    // Update document title
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (
      selector: string,
      content: string,
      attributeName: string = "name"
    ) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, selector.split("=")[1].replace(/['"]/g, ""));
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Update meta description
    updateMetaTag(
      'meta[name="description"]',
      description || baseDescription
    );

    // Update Open Graph tags
    updateMetaTag(
      'meta[property="og:site_name"]',
      baseTitle,
      "property"
    );
    updateMetaTag(
      'meta[property="og:title"]',
      title ? `${title} | ${baseTitle}` : baseTitle,
      "property"
    );
    updateMetaTag(
      'meta[property="og:description"]',
      description || baseDescription,
      "property"
    );
    updateMetaTag(
      'meta[property="og:type"]',
      type,
      "property"
    );
    updateMetaTag(
      'meta[property="og:url"]',
      url || baseUrl,
      "property"
    );
    updateMetaTag(
      'meta[property="og:image"]',
      image || baseImage,
      "property"
    );

    // Update Twitter Card tags
    updateMetaTag(
      'meta[name="twitter:title"]',
      title ? `${title} | ${baseTitle}` : baseTitle
    );
    updateMetaTag(
      'meta[name="twitter:description"]',
      description || baseDescription
    );
    updateMetaTag(
      'meta[name="twitter:image"]',
      image || baseImage
    );

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.href = url || baseUrl;

  }, [title, description, image, url, type]);
}
