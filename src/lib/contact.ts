// The Bureau's one inbox. Lives outside the client components so server
// components (Footer, /contact) can read the value, not a client reference.
export const CONTACT_EMAIL = "dispatch@appalachiancryptid.com";

export const contactMailto = (subject?: string) =>
  `mailto:${CONTACT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
