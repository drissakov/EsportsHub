# Assignment 4 verification

Team FAN, SE-2501. Final local verification: 2026-10-21.

Browsers: Google Chrome 155.0.8059.85 and Microsoft Edge 155.0.4283.62, headless on Windows, using Playwright. Both browsers use Chromium. Firefox, Safari and physical phones were not tested.

## Page and asset checks

- All six pages tested at 1440, 992, 768, 375 and 320 px: 60 successful page-width checks; no horizontal document overflow.
- Local links, resources and fragment anchors resolve. No duplicate IDs. External scripts use `defer`.
- No JavaScript page errors, console errors or HTTP resource errors in final runs.
- Bootstrap 5.3.8 CSS is included locally. Its original SHA-384 was verified against the original HTML integrity value before removing the optional source-map hint. Its MIT license header is preserved.
- With external HTTP(S) requests blocked: all six pages load with active Bootstrap styling and no external asset requests. Another 60 page-width checks passed.
- Each footer contains Damir Issakov, Alina Aitmukhamet, Aisha Mussina, FAN and SE-2501.

## Feature checks

1. Registration: blank and whitespace-only fields, malformed email, short password, mismatching confirmation and confirmation revalidation are rejected; errors are associated with inputs and first-invalid focus works. Valid demo stays on page and clears passwords. Contact validation rejects invalid values and preserves the valid mailto action; no real message was sent.
2. Accordion: four answers initially collapsed and inert; repeated mouse/keyboard toggles and independent questions work. Smooth animation and reduced-motion behavior were inspected.
3. Popup: hidden initially; trigger opens, close button/Escape/outside click close, opener focus restores. Email validation works. Twenty forward/backward Tab moves per browser remain within the dialog. Mobile-width presentation fits at 320 px.
4. Background: all four palette values and wrap to white checked; body and main section color updates observed.
5. Clock: immediately populated, valid ISO datetime, readable date/time and browser time zone; subsequent timestamp changes after the update interval.

Screenshots of the tested UI are embedded in the separately delivered report. No account, subscription or message delivery backend is connected.

## Email validation update - 2026-10-23

- `node --test tests/email-validation.test.cjs`: 76 passing tests, including 64/65-character mailbox and 254/255-character overall boundaries, 63/64-character domain labels, aliases, apostrophes, punycode, controls, hidden characters and oversized input.
- Chrome and Edge: shared helper checked with 9 valid and 44 invalid address cases, non-string inputs and optional values. Both contact and registration checked with 11 invalid and 9 valid submissions each, plus blur/input/reset, `requestSubmit()` and programmatic values that bypass HTML input length restrictions.
- Subscription uses the same policy on all six pages; valid aliases/punycode, invalid input, reset and a 320 px error layout checked. No page/console/network errors or external asset requests. A QA-only submit observer prevented actual mailto navigation during contact checks.
- Supported format and exclusions are documented in README. No claim is made that JavaScript validation proves mailbox existence, ownership or server-side security.
