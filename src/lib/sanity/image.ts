import { createImageUrlBuilder } from "@sanity/image-url";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8thljucm";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// The image URL builder only needs project configuration. Keeping it detached
// from the full Sanity client avoids shipping @sanity/client to browser bundles.
const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: any) {
  return builder.image(source).auto("format");
}
