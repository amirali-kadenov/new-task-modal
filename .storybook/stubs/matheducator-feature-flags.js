/** Storybook stub for matheducator featureFlags. */
export function isDevEnvironment() {
  return true
}

export function getFeatureFlags() {
  return { showStatsButtons: true }
}

export function subscribeFeatureFlags(_listener) {
  return () => {}
}
