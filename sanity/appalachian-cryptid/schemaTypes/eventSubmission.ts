import {defineType, defineField} from 'sanity'

/**
 * A listing update or new-event tip sent through /events/submit. Created by
 * /api/event-submissions as a DRAFT (drafts.event-submission-…) on purpose:
 * the dataset is public, only documents with a dot in their _id are hidden
 * from unauthenticated reads, and these hold an optional email address.
 * Publish is removed for this type in sanity.config.ts. Review the submission,
 * apply any changes to the Event, then set the status here.
 */
export default defineType({
  name: 'eventSubmission',
  title: 'Event Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Applied to listing', value: 'applied'},
          {title: 'Rejected', value: 'rejected'},
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'role',
      title: 'Sender is',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          {title: 'Organizer', value: 'organizer'},
          {title: 'Attendee', value: 'attendee'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({name: 'eventName', title: 'Event name', type: 'string', readOnly: true}),
    defineField({
      name: 'eventSlug',
      title: 'Listing slug',
      type: 'string',
      readOnly: true,
      description: 'Set when sent from an existing event page; empty for a new event.',
    }),
    defineField({name: 'town', title: 'Town', type: 'string', readOnly: true}),
    defineField({name: 'state', title: 'State', type: 'string', readOnly: true}),
    defineField({
      name: 'dates',
      title: 'Dates, as written',
      type: 'string',
      readOnly: true,
    }),
    defineField({name: 'officialUrl', title: 'Official link', type: 'url', readOnly: true}),
    defineField({
      name: 'sourceUrl',
      title: 'Where the dates were seen',
      type: 'url',
      readOnly: true,
    }),
    defineField({name: 'note', title: 'Note', type: 'text', rows: 5, readOnly: true}),
    defineField({name: 'email', title: 'Email (optional)', type: 'string', readOnly: true}),
    defineField({
      name: 'organizerInterest',
      title: 'Asked about Bureau tools for organizers',
      type: 'boolean',
      readOnly: true,
      description: 'They ticked the opt-in box. Not yet synced to Sequenzy.',
    }),
    defineField({name: 'submittedAt', title: 'Submitted', type: 'datetime', readOnly: true}),
    defineField({
      name: 'reviewerNotes',
      title: 'Reviewer notes',
      type: 'text',
      rows: 3,
      description: 'Internal only. Still never put contact details here.',
    }),
  ],
  orderings: [
    {title: 'Newest first', name: 'newest', by: [{field: 'submittedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {name: 'eventName', status: 'status', role: 'role', at: 'submittedAt'},
    prepare: ({name, status, role, at}) => ({
      title: name || 'Untitled submission',
      subtitle: [status, role, at && String(at).slice(0, 10)].filter(Boolean).join(' · '),
    }),
  },
})
