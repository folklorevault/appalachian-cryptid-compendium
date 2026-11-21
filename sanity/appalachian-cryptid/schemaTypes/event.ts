import {defineType, defineField, defineArrayMember} from 'sanity'

// State values mirror the `states` field in cryptid.ts and src/lib/states.ts
// (minus "Across Appalachia": an event always happens in one town).
const STATE_OPTIONS = [
  {title: 'West Virginia', value: 'WV'},
  {title: 'North Carolina', value: 'NC'},
  {title: 'Virginia', value: 'VA'},
  {title: 'Tennessee', value: 'TN'},
  {title: 'Kentucky', value: 'KY'},
  {title: 'Pennsylvania', value: 'PA'},
  {title: 'Maryland', value: 'MD'},
  {title: 'Ohio', value: 'OH'},
  {title: 'New York', value: 'NY'},
  {title: 'South Carolina', value: 'SC'},
  {title: 'Georgia', value: 'GA'},
  {title: 'Alabama', value: 'AL'},
  {title: 'Mississippi', value: 'MS'},
  {title: 'Louisiana', value: 'LA'},
  {title: 'Arkansas', value: 'AR'},
  {title: 'Florida', value: 'FL'},
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
].map((title, i) => ({title, value: i + 1}))

/**
 * A recurring cryptid festival or conference. One document per event, not per
 * year: each year's dates live in `editions`, so the URL never changes and the
 * site works out "Confirmed / Dates not announced / Last held" from them.
 */
export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    {name: 'listing', title: 'Listing', default: true},
    {name: 'dates', title: 'Dates'},
    {name: 'internal', title: 'Internal'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'listing',
      description: 'The event’s own name, without the year (e.g. "Mothman Festival").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'listing',
      description: 'Stays the same every year. Do not put the year in it.',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) =>
        Rule.required().custom((slug) =>
          slug?.current && /\b(19|20)\d{2}\b/.test(slug.current)
            ? 'Leave the year out of the slug so the page keeps its search ranking year to year'
            : true
        ),
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      group: 'listing',
      options: {
        list: [
          {title: 'Festival', value: 'festival'},
          {title: 'Conference', value: 'conference'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'festival',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'legend',
      title: 'Celebrates',
      type: 'string',
      group: 'listing',
      description:
        'The creature or legend, as a short chip label (e.g. "Mothman", "West Virginia cryptids").',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'subjects',
      title: 'Case files',
      type: 'array',
      group: 'listing',
      of: [defineArrayMember({type: 'reference', to: [{type: 'cryptid'}, {type: 'anomaly'}]})],
      description:
        'Cryptid or anomaly files this event celebrates. Each one shows the event in its "Where to celebrate" box.',
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'listing',
      description: 'One or two sentences for the event page and search results.',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'town',
      title: 'Town',
      type: 'string',
      group: 'listing',
      description: 'Town or venue as people search for it (e.g. "Point Pleasant").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      group: 'listing',
      options: {list: STATE_OPTIONS},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organizer',
      title: 'Organizer',
      type: 'string',
      group: 'listing',
      description: 'Public name only (e.g. "City of Norton"). Shown on the page.',
    }),
    defineField({
      name: 'officialUrl',
      title: 'Official link',
      type: 'url',
      group: 'listing',
      description: 'The organizer’s own site, Facebook page or ticket page.',
    }),
    defineField({
      name: 'admission',
      title: 'Admission',
      type: 'string',
      group: 'listing',
      options: {
        list: [
          {title: 'Free', value: 'free'},
          {title: 'Ticketed', value: 'ticketed'},
          {title: 'Free entry, some paid events', value: 'mixed'},
        ],
      },
    }),
    defineField({
      name: 'familyFriendly',
      title: 'Family friendly',
      type: 'boolean',
      group: 'listing',
    }),
    defineField({
      name: 'performers',
      title: 'Featured guests',
      type: 'array',
      group: 'listing',
      description:
        'Headline speakers, bands or performers the organizer has announced. Optional: Google shows them in event results. Leave empty if none are announced.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'performer',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'kind',
              title: 'Kind',
              type: 'string',
              options: {
                list: [
                  {title: 'Person (speaker, author, guest)', value: 'person'},
                  {title: 'Band or group', value: 'group'},
                ],
                layout: 'radio',
              },
              initialValue: 'person',
            }),
          ],
          preview: {select: {title: 'name', subtitle: 'kind'}},
        }),
      ],
    }),

    // ── Dates ──────────────────────────────────────────────────
    defineField({
      name: 'usualMonth',
      title: 'Usual month',
      type: 'number',
      group: 'dates',
      description: 'Files the event under this month until this year’s dates are announced.',
      options: {list: MONTHS},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'usualTiming',
      title: 'Usual timing',
      type: 'string',
      group: 'dates',
      description: 'Shown while dates aren’t out (e.g. "Third weekend of September", "Early May").',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'editions',
      title: 'Editions',
      type: 'array',
      group: 'dates',
      description:
        'One entry per year it ran or is scheduled. Add next year’s dates here as soon as the organizer announces them.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'edition',
          fields: [
            defineField({
              name: 'year',
              title: 'Year',
              type: 'number',
              validation: (Rule) => Rule.required().integer().min(1990).max(2100),
            }),
            defineField({
              name: 'startDate',
              title: 'Start date',
              type: 'date',
              description: 'Leave empty only for a past year whose exact dates you couldn’t find.',
              validation: (Rule) =>
                Rule.custom((start, context) => {
                  const year = (context.parent as {year?: number})?.year
                  if (!start) {
                    return year && year >= new Date().getFullYear()
                      ? 'This year and future editions need a start date'
                      : true
                  }
                  return year && Number(String(start).slice(0, 4)) !== year
                    ? 'Start date is in a different year from the Year field'
                    : true
                }),
            }),
            defineField({
              name: 'endDate',
              title: 'End date',
              type: 'date',
              description: 'Leave empty for one-day events.',
              validation: (Rule) =>
                Rule.custom((end, context) => {
                  const start = (context.parent as {startDate?: string})?.startDate
                  if (!end) return true
                  if (!start) return 'Add a start date first'
                  return String(end) < String(start) ? 'End date is before the start date' : true
                }),
            }),
            defineField({
              name: 'verifiedAt',
              title: 'Verified on',
              type: 'date',
              description: 'The day you checked these dates against the source.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sourceUrl',
              title: 'Source',
              type: 'url',
              description: 'Where the dates came from (organizer post, tourism page, news story).',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {year: 'year', start: 'startDate', end: 'endDate'},
            prepare: ({year, start, end}) => ({
              title: String(year ?? 'No year'),
              subtitle: start ? (end && end !== start ? `${start} to ${end}` : start) : 'Dates not on file',
            }),
          },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((editions) => {
          const years = (editions as {year?: number}[] | undefined)?.map((e) => e.year) ?? []
          return new Set(years).size === years.length ? true : 'Each year should appear once'
        }),
    }),
    defineField({
      name: 'lastCheckedAt',
      title: 'Last checked',
      type: 'date',
      group: 'dates',
      description:
        'The last time you looked for news on this event, even if nothing changed. Shown on the listing.',
    }),

    // ── Internal ───────────────────────────────────────────────
    // The production dataset is publicly readable: anything here can be
    // fetched by anyone. Public facts only — no contact details or notes.
    defineField({
      name: 'organizerType',
      title: 'Organizer type',
      type: 'string',
      group: 'internal',
      description: 'Not shown on the site, but readable through the public API. No contact details here.',
      options: {
        list: [
          {title: 'Town or city', value: 'town'},
          {title: 'Tourism office', value: 'tourism'},
          {title: 'Museum or nonprofit', value: 'nonprofit'},
          {title: 'Business or resort', value: 'business'},
          {title: 'Private organizer', value: 'private'},
          {title: 'Unknown', value: 'unknown'},
        ],
      },
    }),
    defineField({
      name: 'webPresence',
      title: 'Web presence',
      type: 'string',
      group: 'internal',
      description: 'Not shown on the site, but readable through the public API.',
      options: {
        list: [
          {title: 'Own website', value: 'own-site'},
          {title: 'Page on a town or tourism site', value: 'listing-page'},
          {title: 'Ticket page only', value: 'ticket-page'},
          {title: 'Facebook only', value: 'facebook-only'},
          {title: 'Nothing found', value: 'none'},
        ],
      },
    }),
  ],
  orderings: [
    {title: 'Usual month', name: 'usualMonth', by: [{field: 'usualMonth', direction: 'asc'}]},
    {title: 'Name', name: 'name', by: [{field: 'name', direction: 'asc'}]},
  ],
  preview: {
    select: {name: 'name', town: 'town', state: 'state', timing: 'usualTiming'},
    prepare: ({name, town, state, timing}) => ({
      title: name,
      subtitle: [town && state ? `${town}, ${state}` : town || state, timing].filter(Boolean).join(' · '),
    }),
  },
})
