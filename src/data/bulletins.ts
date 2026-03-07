import type { SanityBulletinListItem, SanityBulletin } from "@/types/sanity";

export const bulletins: SanityBulletin[] = [
  {
    _id: "bulletin-001",
    _type: "bulletin",
    title: "What Is a Cryptid? A Bureau Field Primer",
    slug: { _type: "slug", current: "what-is-a-cryptid" },
    bulletinNumber: "BUR-001",
    date: "2026-03-01",
    category: "field-terminology",
    summary:
      "An operational definition of 'cryptid' as used by Bureau field agents, distinguishing cryptids from folklore creatures, paranormal entities, and misidentified wildlife.",
    readTime: "6 min",
    relatedCryptids: [
      { _id: "mothman", name: "Mothman", slug: { _type: "slug", current: "mothman" } },
      { _id: "wampus-cat", name: "Wampus Cat", slug: { _type: "slug", current: "wampus-cat" } },
    ],
    body: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "The Bureau defines a cryptid as any creature whose existence is suggested by anecdotal evidence—sightings, tracks, audio recordings—but which has not been confirmed by mainstream zoological science. This distinguishes cryptids from folklore creatures (which exist primarily in oral tradition) and paranormal entities (which defy physical laws).",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "b2",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s2",
            text: "A cryptid is, in essence, a biological hypothesis. It is an animal that might exist. The Bureau's role is to document the evidence for and against that hypothesis with the rigor of a field investigation, not the credulity of a campfire story.",
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _id: "bulletin-002",
    _type: "bulletin",
    title: "Why Appalachia? Geography of the Unexplained",
    slug: { _type: "slug", current: "why-appalachia" },
    bulletinNumber: "BUR-002",
    date: "2026-03-04",
    category: "regional-analysis",
    summary:
      "An analysis of why the Appalachian region produces more cryptid sightings per capita than any comparable landmass in North America.",
    readTime: "8 min",
    relatedCryptids: [
      { _id: "bigfoot", name: "Bighoot", slug: { _type: "slug", current: "bighoot" } },
    ],
    body: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "The Appalachian Mountains are among the oldest on Earth, predating the Atlantic Ocean itself. Over 480 million years of geological history have created a landscape of deep hollows, cave systems, and unbroken forest canopy that could conceal populations of unknown species for centuries.",
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _id: "bulletin-003",
    _type: "bulletin",
    title: "Cryptid vs. Folklore Creature: Where the Bureau Draws the Line",
    slug: { _type: "slug", current: "cryptid-vs-folklore" },
    bulletinNumber: "BUR-003",
    date: "2026-03-08",
    category: "field-terminology",
    summary:
      "Not everything in Appalachian tradition qualifies as a cryptid. This bulletin clarifies the Bureau's distinction between cryptids, folklore creatures, and anomalies.",
    readTime: "5 min",
    relatedCryptids: [
      { _id: "wampus-cat", name: "Wampus Cat", slug: { _type: "slug", current: "wampus-cat" } },
    ],
    body: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "The distinction matters because it determines how the Bureau allocates investigative resources. A cryptid warrants field teams, camera traps, and cast molds. A folklore creature warrants ethnographic documentation. An anomaly warrants instrumentation. Misclassification wastes time and money.",
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _id: "bulletin-004",
    _type: "bulletin",
    title: "The Cultural Weight of 'Monster': Language and Appalachian Identity",
    slug: { _type: "slug", current: "cultural-weight-of-monster" },
    bulletinNumber: "BUR-004",
    date: "2026-03-16",
    category: "cultural-brief",
    summary:
      "A brief on how the language used to describe cryptids reflects and shapes regional identity. Why the Bureau avoids the word 'monster.'",
    readTime: "7 min",
    relatedCryptids: [],
    body: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Words carry weight in the mountains. When outsiders call the Flatwoods entity a 'monster,' they flatten a complex cultural relationship into a punchline. The Bureau uses clinical, respectful language—not because we lack imagination, but because the people who live alongside these phenomena deserve precision.",
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _id: "bulletin-005",
    _type: "bulletin",
    title: "Seasonal Patterns in Appalachian Sighting Reports",
    slug: { _type: "slug", current: "seasonal-sighting-patterns" },
    bulletinNumber: "BUR-005",
    date: "2026-03-20",
    category: "regional-analysis",
    summary:
      "Bureau data analysis of sighting frequency by month, revealing a consistent autumn spike and a winter lull.",
    readTime: "6 min",
    relatedCryptids: [
      { _id: "mothman", name: "Mothman", slug: { _type: "slug", current: "mothman" } },
    ],
    body: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Bureau records going back to 1947 show a consistent pattern: sighting reports spike in September and October, plateau through November, and drop sharply from December through February. This pattern holds across all cryptid types and all Appalachian sub-regions.",
          },
        ],
        markDefs: [],
      },
    ],
  },
];

/** Convert full bulletin to list item (strip body) */
export function bulletinToListItem(b: SanityBulletin): SanityBulletinListItem {
  return {
    _id: b._id,
    title: b.title,
    slug: b.slug,
    bulletinNumber: b.bulletinNumber,
    date: b.date,
    category: b.category,
    summary: b.summary,
    readTime: b.readTime,
    relatedCryptids: b.relatedCryptids,
  };
}
