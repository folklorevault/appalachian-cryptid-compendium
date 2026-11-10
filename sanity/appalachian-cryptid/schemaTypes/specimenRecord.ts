import {defineArrayMember, defineField, defineType} from 'sanity'

// The object-record half of a specimen-report bulletin (format: 'specimen').
// The essay itself stays in the bulletin's `body`; these fields feed the
// photo-led ink cover, the plates section, and the closing curator band.
export default defineType({
  name: 'specimenRecord',
  title: 'Specimen Record',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'number',
      title: 'Specimen Number',
      type: 'string',
      description: 'e.g., "SP 001". Shown in rust beside the bulletin number.',
    }),
    defineField({
      name: 'wallLabel',
      title: 'Wall Label',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description:
        'Two to four short museum-label lines under the title: what it is, where and when it is from, who holds it. The first line is emphasized.',
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'plates',
      title: 'Plates',
      type: 'array',
      description:
        'Photos of the specimen, numbered Pl. I, Pl. II… in this order. The first plate is the cover photo; a portrait (4:5) crop works best.',
      of: [
        defineArrayMember({
          type: 'image',
          name: 'plate',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'e.g., "The Olympia Springs jar." Avoid em dashes.',
            }),
            defineField({
              name: 'credit',
              title: 'Credit',
              type: 'string',
              description: 'e.g., "Courtesy of Transylvania University"',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'accession',
      title: 'Accession Record',
      type: 'array',
      description: 'Label and value rows, e.g. "Date of fall" / "Friday, March 3, 1876".',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'accessionRow',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required()}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({
      name: 'curatorsNote',
      title: "Curator's Note",
      type: 'text',
      rows: 6,
      description: 'Closes the report on the ink band. Blank lines separate paragraphs. Avoid em dashes.',
    }),
    defineField({
      name: 'status',
      title: 'Record Status',
      type: 'array',
      description: 'Shown under the curator\'s note, e.g. "Provenance" / "Incomplete".',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'statusItem',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'emphasis',
              title: 'Emphasize',
              type: 'boolean',
              description: 'Prints the value in rust, e.g. "Record: OPEN".',
              initialValue: false,
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
      validation: (Rule) => Rule.max(4),
    }),
  ],
})
