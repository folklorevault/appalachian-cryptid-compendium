import {defineType} from 'sanity'

// Shared object type used by both `cryptid` and `anomaly` documents.
// Extracted from the original inline definition in cryptid so anomaly can
// reuse the exact same type without duplicating it. Array items keep
// `_type: 'sighting'`, so no existing data needs migration. On the anomaly
// side the wrapping field is titled "Occurrence Log" via a per-usage field
// title override; the object type itself stays shared and unchanged.
export default defineType({
  name: 'sighting',
  title: 'Sighting',
  type: 'object',
  fields: [
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {dateFormat: 'MMMM D, YYYY'},
      description:
        'Best known date. Approximate to the month or year when the record is fuzzy (the list sorts by this).',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Human-readable place, e.g. "TNT Area, Point Pleasant, WV".',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'coordinates',
      title: 'Coordinates (optional)',
      type: 'geopoint',
      description:
        'Drop a pin for the map. Leave blank if the location is too vague to place — the sighting still lists.',
    },
    {
      name: 'witness',
      title: 'Witness',
      type: 'string',
    },
    {
      name: 'account',
      title: 'Account (short)',
      type: 'text',
      rows: 3,
      description:
        'One or two lines. For a full first-person quote, use Testimonies instead. Avoid em dashes.',
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Citation or attribution, e.g. newspaper, report number, book.',
    },
  ],
  preview: {
    select: {location: 'location', date: 'date', witness: 'witness'},
    prepare({location, date, witness}) {
      return {
        title: location || 'Unplaced sighting',
        subtitle: [date, witness].filter(Boolean).join(' · '),
      }
    },
  },
})
