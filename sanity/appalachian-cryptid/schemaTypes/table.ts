import {defineArrayMember, defineField, defineType} from 'sanity'

// Portable Text table, edited with the Studio's built-in table plugin
// (Sanity v6.6+). The type and field names (table/rows/row/cells/cell/value)
// are the plugin's canonical shape, so do not rename them without passing
// `containers` to the plugin. `headerRows` is required: without it the
// header-row toggle silently does nothing.
export default defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({type: 'number', name: 'headerRows', title: 'Header Rows'}),
    defineField({
      type: 'array',
      name: 'rows',
      title: 'Rows',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'row',
          fields: [
            defineField({
              type: 'array',
              name: 'cells',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'cell',
                  fields: [
                    defineField({
                      type: 'array',
                      name: 'value',
                      of: [defineArrayMember({type: 'block'})],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {rows: 'rows'},
    prepare: ({rows}) => ({
      title: 'Table',
      subtitle: `${rows?.length ?? 0} rows`,
    }),
  },
})
