import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'linkInBio',
  title: 'Link in Bio',
  type: 'document',
  description:
    'Singleton — the Bureau directory hub used from social profiles. Only create one document of this type.',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short line shown beneath the masthead, e.g., "Documenting the unexplained in the Appalachian region."',
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: 'pinnedNote',
      title: 'Pinned Dispatch',
      type: 'text',
      rows: 3,
      description: 'Optional small banner at the top of the link list (announcements, new releases, etc.). Leave blank to hide.',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      validation: (Rule) => Rule.required().min(1).max(12),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'link',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required().max(60),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              description: 'External URL or internal path (e.g., /bulletins).',
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ['http', 'https', 'mailto'],
                  allowRelative: true,
                  relativeOnly: false,
                }),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
              description: 'One short line under the label.',
              validation: (Rule) => Rule.max(120),
            }),
            defineField({
              name: 'badge',
              title: 'Badge',
              type: 'string',
              description: 'Optional small tag, e.g., "NEW", "FEATURED".',
              validation: (Rule) => Rule.max(16),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'url'},
          },
        }),
      ],
    }),
    defineField({
      name: 'socials',
      title: 'Social Links',
      type: 'array',
      description: 'Optional row of social profile links shown below the main list.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'Bluesky', value: 'bluesky'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Threads', value: 'threads'},
                  {title: 'X', value: 'x'},
                  {title: 'Email', value: 'email'},
                  {title: 'RSS', value: 'rss'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) =>
                Rule.required().uri({scheme: ['http', 'https', 'mailto']}),
            }),
          ],
          preview: {
            select: {title: 'platform', subtitle: 'url'},
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Link in Bio', subtitle: 'Singleton — Bureau directory'}),
  },
})
