import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'anomaly',
  title: 'Case File',
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
          {title: 'Tennessee', value: 'TN'},
          {title: 'North Carolina', value: 'NC'},
          {title: 'Virginia', value: 'VA'},
          {title: 'West Virginia', value: 'WV'},
          {title: 'Kentucky', value: 'KY'},
          {title: 'Georgia', value: 'GA'},
          {title: 'South Carolina', value: 'SC'},
          {title: 'Alabama', value: 'AL'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subRegion',
      title: 'Sub-Region',
      type: 'string',
      options: {
        list: [
          {title: 'Great Smoky Mountains', value: 'Smokies'},
          {title: 'Blue Ridge', value: 'Blue Ridge'},
          {title: 'Cumberland Plateau', value: 'Cumberland'},
          {title: 'Allegheny Mountains', value: 'Allegheny'},
          {title: 'Shenandoah Valley', value: 'Shenandoah'},
          {title: 'New River Valley', value: 'New River'},
          {title: 'Ohio River Valley', value: 'Ohio River'},
        ],
      },
      description: 'Optional sub-region for more specific location',
    }),
    defineField({
      name: 'anomalyType',
      title: 'Type of Anomaly',
      type: 'string',
      options: {
        list: [
          {title: 'Lights', value: 'Lights'},
          {title: 'Hauntings', value: 'Hauntings'},
          {title: 'Curses', value: 'Curses'},
          {title: 'Omen Events', value: 'Omen Events'},
          {title: 'Sounds/Calls', value: 'Sounds/Calls'},
          {title: 'Weather Oddities', value: 'Weather Oddities'},
          {title: 'Time Weirdness', value: 'Time Weirdness'},
          {title: 'Places', value: 'Places'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Case Status',
      type: 'string',
      options: {
        list: [
          {title: 'Open File', value: 'Open File'},
          {title: 'Active', value: 'Active'},
          {title: 'Cold', value: 'Cold'},
          {title: 'Seasonal', value: 'Seasonal'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'firstDocumented',
      title: 'First Documented',
      type: 'string',
      description: 'Year or date of first known documentation, e.g., "1913" or "pre-Colonial"',
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
      title: 'Primary Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Main image for the detail page',
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
      description: 'Square crop for grid cards on the Anomalies Desk',
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
      name: 'phenomenon',
      title: 'Phenomenon Description',
      type: 'text',
      rows: 6,
      description: 'Detailed description of what occurs during this anomaly',
    }),
    defineField({
      name: 'theories',
      title: 'Theories & Explanations',
      type: 'text',
      rows: 5,
      description: 'Scientific, folkloric, or paranormal theories about the cause',
    }),
    defineField({
      name: 'frequency',
      title: 'Frequency of Occurrence',
      type: 'string',
      description: 'How often does this occur? e.g., "Nightly", "Seasonal (autumn)", "Sporadic"',
    }),
    defineField({
      name: 'witnesses',
      title: 'Witness Accounts',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'witnessAccount',
          title: 'Witness Account',
          fields: [
            {
              name: 'witness',
              title: 'Witness Name/Description',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'date',
              title: 'Date',
              type: 'string',
              description: 'e.g., "September 1913" or "1960s"',
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
      name: 'relatedLocations',
      title: 'Related Locations',
      type: 'text',
      rows: 3,
      description: 'Other nearby places where similar phenomena have been reported',
    }),
    defineField({
      name: 'bureauNotes',
      title: 'Bureau Notes',
      type: 'text',
      rows: 6,
      description: 'Internal notes from Bureau field agents',
    }),
    defineField({
      name: 'safetyAdvisory',
      title: 'Safety Advisory',
      type: 'text',
      rows: 3,
      description: 'Any warnings or precautions for investigators',
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
      title: 'Type',
      name: 'typeAsc',
      by: [{field: 'anomalyType', direction: 'asc'}],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{field: 'status', direction: 'asc'}],
    },
  ],
})
