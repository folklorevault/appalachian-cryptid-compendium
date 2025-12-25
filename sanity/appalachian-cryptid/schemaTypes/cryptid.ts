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
