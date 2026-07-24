import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'cryptid',
  title: 'Cryptid',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subhead',
      title: 'Subhead',
      type: 'string',
      description: 'A one to two sentence micro intro displayed under the name',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      description: 'Show this cryptid in the "Featured Case File" slot on the homepage. If multiple are flagged, the most recently added wins.',
      initialValue: false,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'scientificName',
      title: 'Scientific Name',
      type: 'string',
      description: 'Pseudo-Latin classification for the field guide aesthetic',
    }),
    defineField({
      name: 'classification',
      title: 'Bureau Classification',
      type: 'string',
      description:
        'Short stamp label for the featured case-file photo, e.g. "Harbinger" or "Apex Predator". Keep to 1-2 words; the stamp hides when unset.',
    }),
    defineField({
      name: 'location',
      title: 'Primary Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coordinates',
      title: 'Map Coordinates',
      type: 'geopoint',
      description: 'For map marker placement',
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      options: {
        list: [
          {title: 'Appalachia', value: 'Appalachia'},
          {title: 'Southeast', value: 'Southeast'},
          {title: 'Southern', value: 'Southern'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dangerLevel',
      title: 'Danger Level',
      type: 'string',
      options: {
        list: [
          {title: 'Low', value: 'Low'},
          {title: 'Medium', value: 'Medium'},
          {title: 'High', value: 'High'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'firstDocumented',
      title: 'First Documented',
      type: 'string',
      description: 'Year or date of first known documentation, e.g., "1966" or "November 1966"',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief summary shown on cards and previews',
    }),
    defineField({
      name: 'fileAbstract',
      title: 'File Abstract',
      type: 'text',
      rows: 6,
      description:
        'Always-visible summary rendered directly under the name, above all drawers. Entity-first and definitional: lead with a flat "The [name] is a creature reported across..." sentence so it works as a search snippet. Blank lines separate paragraphs. Avoid em dashes.',
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (SEO)',
      type: 'string',
      description:
        'The <title> shown in Google results and the browser tab. Lead with the name so it reads as a case file. Aim for 50-60 characters. If left blank, a fallback of "[name] | Sightings & Case File" is used. Avoid em dashes.',
      validation: (Rule) =>
        Rule.max(65).warning('Google truncates titles past ~60 characters.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 2,
      description:
        'The <meta name="description"> shown in Google results. Write it as a hook in Bureau voice, not a summary. Aim for 150-155 characters. If left blank, a fallback is derived from the subhead. Avoid em dashes.',
      validation: (Rule) =>
        Rule.max(160).warning('Google truncates descriptions past ~155 characters.'),
    }),
    defineField({
      name: 'image',
      title: 'Detail Image (Portrait)',
      type: 'image',
      options: {hotspot: true},
      description: 'Full portrait image for the detail page hero',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image Alt Text',
      type: 'string',
      description: 'Descriptive alt text for accessibility',
    }),
    defineField({
      name: 'gridImage',
      title: 'Grid Image (Square)',
      type: 'image',
      options: {hotspot: true},
      description: 'Square crop for grid cards on homepage',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'physicalDescription',
      title: 'Physical Description',
      type: 'text',
      rows: 5,
      description: 'Detailed physical characteristics',
    }),
    defineField({
      name: 'behavior',
      title: 'Behavior',
      type: 'text',
      rows: 5,
      description: 'Known behavioral patterns and habits',
    }),
    defineField({
      name: 'habitat',
      title: 'Habitat',
      type: 'text',
      rows: 4,
      description: 'Preferred environments and territories',
    }),
    defineField({
      name: 'diet',
      title: 'Diet',
      type: 'text',
      rows: 3,
      description: 'Known or suspected dietary habits',
    }),
    defineField({
      name: 'testimonies',
      title: 'Witness Testimonies',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'testimony',
          title: 'Testimony',
          fields: [
            {
              name: 'witness',
              title: 'Witness Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'date',
              title: 'Date',
              type: 'string',
              description: 'e.g., "November 15, 1966"',
            },
            {
              name: 'location',
              title: 'Location',
              type: 'string',
            },
            {
              name: 'account',
              title: 'Account',
              type: 'text',
              rows: 5,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {title: 'witness', subtitle: 'date'},
          },
        },
      ],
    }),
    defineField({
      name: 'notableSightings',
      title: 'Notable Sightings',
      type: 'text',
      rows: 6,
      description: 'Summary of notable sighting events',
    }),
    defineField({
      name: 'bureauNotes',
      title: 'Bureau Notes',
      type: 'text',
      rows: 6,
      description: 'Internal notes from Bureau field agents',
    }),
    defineField({
      name: 'caseFileSections',
      title: 'Case File Sections (always visible)',
      type: 'array',
      description:
        'Prominent, always-visible narrative sections rendered above the collapsible drawers. Use for answers people arrive searching for (e.g. "Is the [name] real?", "Where the name came from"). The heading carries the search query; the label is the Bureau chrome.',
      of: [
        {
          type: 'object',
          name: 'caseFileSection',
          title: 'Case File Section',
          fields: [
            {
              name: 'heading',
              title: 'Heading (semantic, carries the search query)',
              type: 'string',
              description: 'Plain-language, query-shaped. e.g. "Is the Not Deer Real?"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'label',
              title: 'Bureau Label (visual chrome)',
              type: 'string',
              description: 'Short stencil label shown beside the heading. e.g. "Disease Assessment"',
            },
            {
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 10,
              description: 'Blank lines separate paragraphs. Avoid em dashes.',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {title: 'heading', subtitle: 'label'},
          },
        },
      ],
    }),
    defineField({
      name: 'declassifiedBriefings',
      title: 'Declassified Briefings (FAQ)',
      type: 'array',
      description: 'Frequently asked questions displayed as "Declassified Briefings" on the detail page. Powers Google FAQ rich snippets.',
      of: [
        {
          type: 'object',
          name: 'briefing',
          title: 'Briefing',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {title: 'question'},
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'location',
      media: 'gridImage',
    },
  },
  orderings: [
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Danger Level (High first)',
      name: 'dangerDesc',
      by: [{field: 'dangerLevel', direction: 'desc'}],
    },
    {
      title: 'First Documented (Oldest)',
      name: 'firstDocumentedAsc',
      by: [{field: 'firstDocumented', direction: 'asc'}],
    },
  ],
})
