import cryptid from './cryptid'
import anomaly from './anomaly'
import sightingReport from './sightingReport'
import bulletin from './bulletin'
import linkInBio from './linkInBio'
import homepageAnomaliesDesk from './homepageAnomaliesDesk'
import caseFileSection from './caseFileSection'
import sighting from './sighting'
import table from './table'
import marginNote from './marginNote'
import specimenRecord from './specimenRecord'

// Shared object types (caseFileSection, sighting, table, marginNote,
// specimenRecord) are registered before the documents that reference them.
export const schemaTypes = [
  caseFileSection,
  sighting,
  table,
  marginNote,
  specimenRecord,
  cryptid,
  anomaly,
  sightingReport,
  bulletin,
  linkInBio,
  homepageAnomaliesDesk,
]
