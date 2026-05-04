// Lightweight analytics wrapper.
// Replace the body of `track` with your provider of choice (Plausible, PostHog, GA, etc.)
// when you're ready to wire it up.

export function track(event, properties = {}) {
  if (typeof window === 'undefined') return

  // Console log for development
  if (import.meta.env.DEV) {
    console.log('[analytics]', event, properties)
  }

  // Plausible example (uncomment after adding the Plausible script to index.html):
  // if (window.plausible) {
  //   window.plausible(event, { props: properties })
  // }

  // PostHog example:
  // if (window.posthog) {
  //   window.posthog.capture(event, properties)
  // }
}
