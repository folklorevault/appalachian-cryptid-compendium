import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8thljucm",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false, // Server components always fetch fresh data
});

// Local draft preview. With SANITY_PREVIEW_TOKEN (a Viewer token) in
// .env.local, `mise dev` reads drafts as if they were published, so unpublished
// content can be checked in the browser. Gated on NODE_ENV so a production
// build ignores the token even if it is ever set there.
const previewToken =
  process.env.NODE_ENV === "development" ? process.env.SANITY_PREVIEW_TOKEN : undefined;

if (previewToken) {
  console.info("[sanity] Draft preview ON: dev server is reading unpublished drafts.");
}

/** Client for page fetchers: the published client, or drafts in local preview. */
export const sanityReadClient = previewToken
  ? sanityClient.withConfig({
      token: previewToken,
      // `drafts` replaced `previewDrafts` as of API v2025-02-19.
      apiVersion: "2025-02-19",
      perspective: "drafts",
      useCdn: false,
    })
  : sanityClient;
