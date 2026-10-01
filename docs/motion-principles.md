# Motion principles

Keep motion restrained and preserve readable content when animation cannot run.
The implementation uses CSS transitions/keyframes, native scrolling and JavaScript
timers/observers. No animation library is declared in `package.json`.

## Reveal and reduced motion

`app/components/motion/MotionReveal.vue` renders visible content by default. After
mounting, it adds `.is-pending` only when reduced motion is not requested and
IntersectionObserver exists. An intersection removes that class; its optional
`delay` prop supplies a transition delay. It does not depend on an `.is-visible` class.

`app/assets/css/main.css` defines the reveal transition and a reduced-motion media
query that reduces animation/transition durations, disables smooth scrolling and
keeps pending reveals visible. `usePrefersReducedMotion()` reads `matchMedia` only
on the client and listens for preference changes. `MotionReveal` skips its observer
when reduced motion is already enabled at mount; CSS handles visibility if the
preference changes later.

## Automatic motion that exists today

- `app/components/about/AboutTeamCarousel.vue` uses native scroll snapping and a
  5000 ms autoplay timer. It renders three roster copies for looping; the outer
  copies are hidden from assistive technology. Thumbnails and previous/next buttons
  provide manual navigation. An icon button with a translated action label toggles
  automatic rotation.
- The carousel stops autoplay while hovered, focused, explicitly paused, offscreen,
  in a hidden document, or under reduced motion. The shared visibility/motion gate
  lives in `app/composables/useMotionPlayback.ts`. The play/pause control is rendered
  only after mounting and when reduced motion is off. Reduced motion also makes
  manual programmatic scrolling instant instead of smooth.
- `app/components/home/HomeCapabilities.vue` rotates the active item every 3500 ms
  at widths up to 1023px when at least two items exist and motion is allowed. On
  larger screens, row visibility/hover selects the visual. It has an explicit
  pause/resume control for mobile automatic playback.
- `app/components/home/HomeNetwork.vue` animates its repeated logo row with CSS
  keyframes and gates `animation-play-state` through the same playback composable.
  `app/components/motion/PlaybackButton.vue` supplies the icon control with translated
  `aria-label` and `title` for the home components.

`useMotionPlayback()` combines mounting, user pause, reduced motion, element
visibility and document visibility. When IntersectionObserver is unavailable it
treats the element as visible; reduced-motion, document-visibility and pause checks
still apply. Timers/listeners/observers are cleaned up by their owning scopes.

## Rules for changes and verification

Preserve manual controls and reduced-motion behavior. Do not add autoplay or new
motion dependencies as an incidental styling change. Carousel extraction remains
outside this cleanup's scope; it is not an implemented shared carousel abstraction.

Existing checks in `tests/browser/site.spec.ts` cover marquee pause/visibility,
mobile capability playback and changing the team carousel's reduced-motion preference
after hydration. For the screenshot gate, see
[Verification](design-system.md#verification). Screenshots with motion disabled
do not replace these behavioral checks.
