import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'sightingReport',
  title: 'Sighting Report',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending Review', value: 'pending'},
          {title: 'Approved', value: 'approved'},
          {title: 'Rejected', value: 'rejected'},
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'witnessName',
      title: 'Witness Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'date',
      title: 'Date of Sighting',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'time',
      title: 'Time of Sighting',
      type: 'string',
      description: 'Approximate time if provided',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      options: {
        list: [
          'Alabama', 'Arkansas', 'Florida', 'Georgia', 'Kentucky',
          'Louisiana', 'Mississippi', 'North Carolina', 'South Carolina',
          'Tennessee', 'Texas', 'Virginia', 'West Virginia',
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'creatureName',
      title: 'Creature Name',
      type: 'string',
      description: 'What the witness thinks they saw (if known)',
    }),
    defineField({
      name: 'relatedCryptid',
      title: 'Related Cryptid',
      type: 'reference',
      to: [{type: 'cryptid'}],
      description: 'Link to existing cryptid if this matches one',
    }),
    defineField({
      name: 'description',
      title: 'Account of Encounter',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'physicalDescription',
      title: 'Physical Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'behavior',
      title: 'Observed Behavior',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'reviewerNotes',
      title: 'Reviewer Notes',
      type: 'text',
      rows: 3,
      description: 'Internal notes for your reference',
    }),
  ],
  preview: {
    select: {
      title: 'witnessName',
      subtitle: 'creatureName',
      status: 'status',
      date: 'date',
    },
    prepare({title, subtitle, status, date}) {
      const statusEmoji = status === 'pending' ? '⏳' : status === 'approved' ? '✅' : '❌'
      return {
        title: `${statusEmoji} ${title}`,
        subtitle: `${subtitle || 'Unknown creature'} — ${date || 'No date'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'dateDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
    {
      title: 'Status (Pending first)',
      name: 'statusAsc',
      by: [{field: 'status', direction: 'asc'}],
    },
  ],
})
