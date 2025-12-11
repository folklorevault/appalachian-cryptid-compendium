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
      name: 'sightings',
      title: 'Number of Sightings',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'lastSighting',
      title: 'Last Sighting',
      type: 'string',
      description: 'e.g., "November 2023"',
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
      name: 'timeline',
      title: 'Timeline Events',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'timelineEvent',
          title: 'Timeline Event',
          fields: [
            {
              name: 'year',
              title: 'Year',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'event',
              title: 'Event',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'location',
              title: 'Location',
              type: 'string',
            },
          ],
          preview: {
            select: {title: 'year', subtitle: 'event'},
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
      title: 'Most Sightings',
      name: 'sightingsDesc',
      by: [{field: 'sightings', direction: 'desc'}],
    },
  ],
})
