# 15 — Motion Specification (Mandatory)

## 1. Motion principle

**Motion is mandatory in the default experience, but every animation must communicate hierarchy, state, feedback, continuity or reward.**

SafeKid should feel responsive and polished—not busy. Motion must never delay a safety action, obscure important information or make the app feel like a game.

Use Motion for React (`motion` package; import APIs from `motion/react`) for coordinated React transitions and CSS transitions for simple color/border feedback. Do not add a second animation library without documenting a concrete need.

## 2. Global motion contract

- Wrap the app in `MotionConfig` with `reducedMotion="user"`.
- Use `useReducedMotion()` for special cases such as marker movement, mascot idle motion and reward bursts.
- Honor CSS `@media (prefers-reduced-motion: reduce)` for CSS-driven motion.
- Reduced-motion mode must preserve state communication using immediate state changes, opacity/color changes, labels and icons. Do not remove information when animation is removed.
- All actions remain usable while an animation runs. Never await animation completion before dispatching a critical action.
- Animate `transform` and `opacity` preferentially. Avoid layout thrashing and large-area blur filters.
- Avoid `transition: all`; specify the properties being animated.
- No flashing, strobing, rapid pulsing, scroll hijacking or large parallax effects.
- Never auto-play a long product animation before the parent can reach Home or SOS.
- Continuous motion is limited to at most one small ambient element on a screen, and only on Welcome/Onboarding or a relevant empty/growth state. Do not run idle animations on Location, Alerts or SOS screens.

## 3. Motion tokens

Use these as starting tokens. Adjust only if a rendered-device test shows a usability issue.

```ts
export const motionTokens = {
  instant: 90,
  micro: 120,
  standard: 200,
  enter: 220,
  emphasis: 300,
  sheet: 280,
  reward: 480,
  progress: 520,
  stagger: 35,
};
```

Suggested easing:
- Standard: `easeOut` / `cubic-bezier(0.2, 0, 0, 1)`.
- Enter: gentle deceleration; no overshoot for utility content.
- Spring: use a restrained spring only for bottom sheets, segmented indicators or small tactile feedback.
- Exit: shorter than entry; keep the interface responsive.

## 4. Required motion inventory

The Agent must implement and visually verify each applicable item:

| Area | Required motion | Default behavior | Reduced-motion behavior |
|---|---|---|---|
| App route change | Short crossfade or small horizontal transition | 180–220ms | Immediate swap or opacity-only |
| Bottom navigation | Active indicator slides to selected tab | 180–220ms | Instant indicator update |
| Primary button | Press compression and release feedback | 90–140ms; subtle scale/fill response | Color/border feedback only |
| Switch / checkbox | Thumb/check state transition | 140–200ms | Immediate state with clear label |
| Dashboard content | Small, staggered first-entry reveal | 180–240ms; 25–40ms stagger | Immediate content |
| Bottom sheet / modal | Enter/exit from its anchor or bottom edge | 240–300ms | Opacity-only / instant |
| Progress bar | Fill from previous to new value | 450–520ms | Set value immediately |
| Task completion | Checkbox draw/check and card state change | 180–240ms | Immediate completion state |
| Coin reward | Small coin/count increment and restrained reward cue | 350–500ms, once per award | Static updated balance and text confirmation |
| GPS simulator | Marker interpolates to the next simulated coordinate | 300–450ms | Marker jumps to destination with updated label |
| Safe Zone | Circle/zone appears or changes radius smoothly | 180–260ms | Immediate redraw |
| New notification | Toast/row enters with a short slide/fade | 180–240ms | Opacity-only / instant |
| SOS demo event | Critical alert panel appears; optional single, slow emphasis pulse (maximum 2 cycles) | Immediate alert content; motion is secondary | Static critical style and text |
| S.F AI | Typing indicator with three restrained dots; messages enter cleanly | Brief and cancellable | Static “Đang phản hồi…” state or immediate answer |
| 3D watch viewer | User-controlled drag/rotation; optional slow idle rotation only after entry | Smooth, interruptible | Static image / 2D fallback |

The exact values can vary slightly by component, but the event must have visible feedback. Motion should not make a common task feel slower.

## 5. Motion choreography by screen family

### Welcome / Onboarding
- Logo and headline enter with a subtle opacity + short vertical reveal.
- If using a mascot/logo idle animation, keep it small and slow; no bouncing across the full screen.
- CTA receives press feedback.
- Do not force a long animation sequence before the user can continue.

### Home / Safety
- Dashboard sections may stagger on the first mount only.
- Connection, battery and safety states change with a quick, explicit transition.
- Do not continuously animate the dashboard or use floating decorations near safety data.

### Location / Safe Zone
- Animate marker position only when a simulator event changes coordinates.
- Keep map gestures under the user's control; no auto-follow unless explicitly toggled.
- A Safe Zone circle may fade/scale in once when created.
- Do not animate the entire map on navigation.

### Alerts / SOS
- Alert content must render immediately.
- Use a single arrival transition and, for a new unacknowledged SOS, no more than two slow emphasis pulses. Do not use flashing red lights.
- The sound/haptic action must not depend on animation completion.
- Acknowledgement changes the event state clearly and once.

### Growth / Task / Coin
- Progress fill animates on meaningful data changes.
- Task completion uses a small check-state motion.
- Coin award receives one short count-up or coin movement cue. It must not repeat on rerender or replay unless a new unique transaction is created.
- Avoid confetti storms, slot-machine effects, streak pressure or gamified punishment.

### S.F AI
- Typing indicator should be short, stop when response arrives and never imply human presence.
- Avoid animated assistant avatar lip-sync or artificial personality effects.

## 6. Motion performance

- Target smooth 60fps on typical mobile devices; degrade gracefully on weaker devices.
- Animate transforms and opacity rather than repeatedly recalculating layout.
- Lazy-load the 3D viewer and heavy assets.
- Do not animate large shadows, full-screen filters or multiple high-resolution canvases simultaneously.
- Pause nonessential animation when its screen is not active or the app is backgrounded.
- Keep the primary app usable when animation assets or WebGL fail.

## 7. Motion QA and acceptance

A release cannot pass visual QA unless:
1. All rows in the required motion inventory applicable to v1.0 have an implemented behavior.
2. Every interactive control has visible pressed/focus/state feedback.
3. Motion feels consistent across the same interaction type.
4. A user can navigate and acknowledge SOS without waiting for animation.
5. `prefers-reduced-motion` is tested in browser and maps motion to a usable alternative.
6. Android/iOS smoke tests verify that native transitions do not conflict with the web motion layer.
7. No continuous animation runs on the Location, Alerts or SOS screens.
8. Motion has been inspected in rendered screenshots/video, not only inferred from source code.

## 8. Reference guidance

- Apple recommends purposeful, optional motion and warns against gratuitous or excessive animation: <https://developer.apple.com/design/human-interface-guidelines/motion>.
- Motion for React provides `MotionConfig` and `useReducedMotion` guidance: <https://motion.dev/docs/react-accessibility> and <https://motion.dev/docs/react-use-reduced-motion>.
- W3C documents reduced-motion techniques for interaction-triggered animation: <https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html>.
- Material Design's duration/easing guidance is a useful timing reference, not a requirement to copy Material's visual style: <https://m1.material.io/motion/duration-easing.html>.

The user specifically requires motion in SafeKid. The correct interpretation is purposeful motion with accessible alternatives—not motion removed from the default app and not constant decoration.
