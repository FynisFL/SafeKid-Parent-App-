# 10 — Privacy, Accessibility and Trust

## 1. Privacy-by-demo design
- No login or remote account.
- Local-only parent/child demo profiles.
- Use fictional child, device and location data.
- Do not request the phone owner's location by default.
- No background tracking.
- No remote analytics, advertising SDK or cloud sync.
- Clear reset/delete controls.
- Explain that the app is a simulated prototype and not monitoring a real child.

## 2. Data handling
- Store only fields needed for the local demo.
- IndexedDB data stays in the local app origin/container; explain browser storage may be cleared by the user/device.
- Do not store real child contact information in the default seed.
- Do not log sensitive data to console or export files by default.
- Exported usability logs should contain event type, duration and outcome, not real addresses or personal child details.

## 3. Safety language
Preferred:
- “Simulated location”
- “Demo device connected”
- “Test SOS event”
- “No real alert was sent”
- “AI is informational only”
- “This demo is not an emergency response service”

Forbidden:
- “Your child is safe” as a factual live claim when using mock data.
- “Emergency services have been notified”.
- “SOS sent to parent/watch” unless actual integration exists and is verified.
- “Live GPS” for mock coordinates.

## 4. SOS interface requirements
- Distinguish test mode in the button label and confirmation.
- Avoid a one-tap ambiguous critical action.
- Acknowledge state should be clear.
- Do not bury the demo disclosure.
- AI must never mediate or delay SOS.

## 5. Accessibility
- Minimum 44x44px touch target.
- Semantic button/link/input elements.
- Visible focus on keyboard navigation.
- Accessible names for icon-only controls.
- Status communicated by icon/text as well as color.
- Contrast target WCAG AA for normal text where practical.
- Respect reduced motion.
- Screen reader announcement for critical demo alert, once per event.
- Forms have visible labels and inline validation.

## 6. Localization
Vietnamese (`vi-VN`) is the default for the Vietnam demo. Keep all visible strings in a centralized message catalog so English (`en`) can be added without editing feature components. Do not mix languages randomly in the UI; brand feature names such as Grow Safe, Safe Zone and S.F AI may remain in English with Vietnamese explanations.

## 7. Production boundary
Before real child data or real watch integration, the project requires a dedicated privacy/security review, access control and guardian authorization design, data minimization/retention decisions, encryption design, OEM/backend responsibility mapping, legal review and tested device data deletion. Do not claim these are solved by this demo.
