import cryptid from './cryptid'
import anomaly from './anomaly'
import sightingReport from './sightingReport'
import bulletin from './bulletin'
import linkInBio from './linkInBio'
import caseFileSection from './caseFileSection'
import sighting from './sighting'

// Shared object types (caseFileSection, sighting) are registered before the
// documents that reference them by name.
export const schemaTypes = [
  caseFileSection,
  sighting,
  cryptid,
  anomaly,
  sightingReport,
  bulletin,
  linkInBio,
]
