import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Appalachian Cryptid',

  projectId: '8thljucm',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Visitor submissions hold names and emails and must stay drafts: the
    // dataset is public, and publishing would make them readable by anyone.
    // Review and edit them as drafts; never publish.
    actions: (prev, {schemaType}) =>
      schemaType === 'sightingReport' || schemaType === 'eventSubmission'
        ? prev.filter(
            (action) => action.action !== 'publish' && action.displayName !== 'SchedulePublishAction',
          )
        : prev,
  },
})
