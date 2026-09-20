# Motion principles

Motion is part of the corporate identity, and it is meant to stay
invisible when it is working: restrained, premium, purposeful.

## What N01 ships

- MotionReveal.vue: a single IntersectionObserver-based fade and rise-in
  primitive (.reveal to .reveal.is-visible in main.css), used once per
  page section. No stagger choreography or scroll-linked effects yet.
- CSS transitions only, on color, border, opacity, and transform. No
  animation library. GSAP is explicitly not installed in the foundation
  phase.
- ZDivider.vue: the only place the logos diagonal Z ribbon is echoed, as a
  slim, diagonally clipped divider bar using the silver gradient token. It
  is not reused as a literal graphic anywhere else. Any future use of this
  motif, such as a section transition line, an image-mask reveal, or an
  underline, should stay this restrained: a hint, never decoration
  plastered across the page.

## Reduced motion

prefers-reduced-motion: reduce is handled twice:

- CSS: a global media query in main.css collapses all transition and
  animation durations to effectively zero and forces .reveal content to
  be visible immediately.
- JS: usePrefersReducedMotion() lets MotionReveal skip attaching the
  IntersectionObserver entirely and show content immediately, rather than
  relying on the CSS override alone.

## Explicitly avoided

Bounce easing, autoplay sliders, scroll hijacking, heavy parallax, a
custom cursor, and animating everything on the page. None of these are
present, and adding any of them is a deliberate design decision for a
later phase, not a default.
