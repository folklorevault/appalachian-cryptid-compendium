import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'bulletin',
  title: 'Bureau Bulletin',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bulletinNumber',
      title: 'Bulletin Number',
      type: 'string',
      description: 'e.g., "BUR-001"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date Filed',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Field Terminology', value: 'field-terminology'},
          {title: 'Regional Analysis', value: 'regional-analysis'},
          {title: 'Cultural Brief', value: 'cultural-brief'},
          {title: 'Operational Notice', value: 'operational-notice'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'format',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Standard bulletin', value: 'standard'},
          {title: 'Specimen report', value: 'specimen'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'standard',
      description:
        'Specimen report: an object record with a photo-led ink cover, accession rows, and plates. Fill in the Specimen fields below.',
    }),
    defineField({
      name: 'specimen',
      title: 'Specimen',
      type: 'specimenRecord',
      hidden: ({document}) => document?.format !== 'specimen',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Brief summary shown in the ledger listing',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (SEO)',
      type: 'string',
      description:
        'The <title> shown in Google results and the browser tab. Aim for 50-60 characters. If left blank, "[title] | Bureau Bulletins" is used. Avoid em dashes.',
      validation: (Rule) =>
        Rule.max(65).warning('Google truncates titles past ~60 characters.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 2,
      description:
        'The <meta name="description"> shown in Google results. Write it as a hook in Bureau voice, not a summary. Aim for 150-155 characters. If left blank, a fallback is derived from the summary. Avoid em dashes.',
      validation: (Rule) =>
        Rule.max(160).warning('Google truncates descriptions past ~155 characters.'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({type: 'table'}),
        defineArrayMember({
          type: 'image',
          name: 'bodyImage',
          title: 'Photo',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Describe what the photo shows, for screen readers and search.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'placement',
              title: 'Placement',
              type: 'string',
              options: {
                list: [
                  {title: 'In the text column', value: 'inline'},
                  {title: 'In the margin (specimen reports)', value: 'margin'},
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              initialValue: 'inline',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Shown under the photo. Avoid em dashes.',
            }),
            defineField({
              name: 'credit',
              title: 'Credit',
              type: 'string',
              description: 'Photographer or holding institution, e.g. "Courtesy of Transylvania University"',
            }),
          ],
        }),
        defineArrayMember({type: 'marginNote'}),
      ],
      description: 'Full bulletin content: rich text, tables, photos, and margin notes',
      // Opt this field into the Studio's built-in table editor; other
      // Portable Text fields stay table-free.
      components: {
        portableText: {
          plugins: (props) =>
            props.renderDefault({
              ...props,
              plugins: {...props.plugins, table: {enabled: true}},
            }),
        },
      },
    }),
    defineField({
      name: 'relatedCryptids',
      title: 'Related Cryptids',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'cryptid'}]}],
      description: 'Cryptid case files referenced in this bulletin',
    }),
    defineField({
      name: 'relatedAnomalies',
      title: 'Related Anomalies',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'anomaly'}]}],
      description: 'Anomaly case files referenced in this bulletin',
    }),
    defineField({
      name: 'readTime',
      title: 'Estimated Read Time',
      type: 'string',
      description: 'e.g., "6 min"',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'bulletinNumber',
    },
  },
  orderings: [
    {
      title: 'Date Filed (Newest)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Bulletin Number',
      name: 'numberAsc',
      by: [{field: 'bulletinNumber', direction: 'asc'}],
    },
  ],
})
