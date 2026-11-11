import {defineField, defineType} from 'sanity'

// A short aside for the body. Specimen reports set it in the right margin
// beside the paragraph that follows it; standard bulletins and phones show
// it inline. Place it directly ABOVE the paragraph it annotates.
export default defineType({
  name: 'marginNote',
  title: 'Margin Note',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Short uppercase kicker, e.g. "Related record" or "Not part of this accession".',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(280),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'text'},
    prepare: ({title, subtitle}) => ({title: title || 'Margin note', subtitle}),
  },
})
