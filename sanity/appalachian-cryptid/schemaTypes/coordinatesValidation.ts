import type {GeopointRule} from 'sanity'

// Every entry is in North America, so longitude must be negative. A dropped
// minus sign (e.g. 82.37 instead of -82.37) silently plots the pin in Asia.
export const westernHemisphere = (rule: GeopointRule) =>
  rule.custom((point) => {
    if (!point || typeof point.lng !== 'number') return true
    return point.lng < 0
      ? true
      : `Longitude ${point.lng} is east of Greenwich — North American points need a minus sign (try ${-point.lng}).`
  })
