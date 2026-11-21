/**
 * The site-wide link-preview card (texts, Facebook, Slack, etc.).
 *
 * Next.js replaces — not merges — the root layout's `openGraph` and `twitter`
 * objects when a page sets its own, so any page that overrides them must pass
 * `images` again or its shared link shows no picture. Spread this in.
 */
export const SHARE_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Appalachian Cryptid Bureau: Mothman over the Appalachian mountains. Cryptids and mysteries from the holler.",
};
