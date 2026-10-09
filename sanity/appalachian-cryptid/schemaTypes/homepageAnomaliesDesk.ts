import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'homepageAnomaliesDesk',
  title: 'Homepage: Anomalies Desk',
  type: 'document',
  description:
    'Singleton — the dark Anomalies Desk band on the homepage, below the Case Drawers. Only create one document of this type.',
  groups: [
    {name: 'desk', title: 'The Desk', default: true},
    {name: 'feature', title: 'Featured Anomaly'},
  ],
  fields: [
    // ── The desk ────────────────────────────────────────────
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'desk',
      description: 'Small rust label above the headline.',
      initialValue: 'The Anomalies Desk',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'desk',
      description: 'The big line. Keep it short; it is set very large.',
      initialValue: 'Not everything strange has a body.',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 4,
      group: 'desk',
      description: 'Plain paragraphs under the headline. Blank lines separate paragraphs. Avoid em dashes.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'typedLine',
      title: 'Typewriter Line',
      type: 'string',
      group: 'desk',
      description: 'Optional closing line set in the typewriter face, e.g. "The Bureau maintains a separate department for these matters."',
    }),
    defineField({
      name: 'countSuffix',
      title: 'Count Line Ending',
      type: 'string',
      group: 'desk',
      description:
        'Follows the automatic "6 anomalies currently under investigation." line. Leave blank to show the count alone.',
      initialValue: 'None satisfactorily explained.',
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button Label',
      type: 'string',
      group: 'desk',
      description: 'The stamp button that links to /anomalies.',
      initialValue: 'Explore the Anomalies Desk',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'briefingBulletin',
      title: 'Briefing Bulletin',
      type: 'reference',
      to: [{type: 'bulletin'}],
      group: 'desk',
      description: 'Optional. Adds a "What is the Anomalies Desk?" link to this bulletin next to the button.',
    }),

    // ── Featured anomaly ────────────────────────────────────
    defineField({
      name: 'featuredAnomaly',
      title: 'Featured Anomaly',
      type: 'reference',
      to: [{type: 'anomaly'}],
      group: 'feature',
      description:
        'The file shown under the desk intro. Its name, type, status, location and image fill in automatically. Leave blank to hide the feature.',
    }),
    defineField({
      name: 'featureHeadline',
      title: 'Feature Headline',
      type: 'string',
      group: 'feature',
      description: 'Large line for the feature, e.g. "If you hear whistling after dark,". Falls back to the anomaly name.',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'featureHeadlineEmphasis',
      title: 'Feature Headline Ending (Rust)',
      type: 'string',
      group: 'feature',
      description: 'Optional words printed in rust right after the headline, e.g. "you didn\'t."',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'featureRules',
      title: 'Rules',
      type: 'array',
      group: 'feature',
      description: 'Optional numbered rules ("Rule 1", "Rule 2"…). Leave empty for anomalies without folk rules.',
      of: [defineArrayMember({type: 'string'})],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'featureBlurb',
      title: 'Feature Blurb',
      type: 'text',
      rows: 3,
      group: 'feature',
      description: "Optional. Uses the anomaly's Short Description when blank.",
    }),
    defineField({
      name: 'featureImage',
      title: 'Feature Image Override',
      type: 'image',
      options: {hotspot: true},
      group: 'feature',
      description: "Optional. Uses the anomaly's Grid Image (or Primary Image) when blank. Shown as a 3:4 portrait.",
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'headline', feature: 'featuredAnomaly.name'},
    prepare: ({title, feature}) => ({
      title: 'Homepage: Anomalies Desk',
      subtitle: feature ? `${title} · Featuring ${feature}` : title,
    }),
  },
})
