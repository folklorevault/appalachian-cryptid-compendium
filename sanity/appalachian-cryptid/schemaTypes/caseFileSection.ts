import {defineType} from 'sanity'

// Shared object type used by both `cryptid` and `anomaly` documents.
// Extracted from the original inline definition in cryptid so anomaly can
// reuse the exact same type without duplicating it. Array items keep
// `_type: 'caseFileSection'`, so no existing data needs migration.
export default defineType({
  name: 'caseFileSection',
  title: 'Case File Section',
  type: 'object',
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
})
