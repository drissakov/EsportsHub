# Assignment 4: implementation and defense guide

**Team FAN - group SE-2501**

Objective: use JavaScript to validate forms, toggle FAQ answers, open and close a subscription popup, change the page background and display the current date and time.

## Assigned responsibilities

| Member | Components to prepare and explain |
| --- | --- |
| Damir Issakov | Task 3 subscription popup; Task 5 current date/time |
| Alina Aitmukhamet | Task 2 FAQ accordion; Task 4 background palette |
| Aisha Mussina | Task 1 registration validation and enhancement of the existing contact form |

This is the team's agreed responsibility map. Before the defense, every member should run the complete demonstration, understand the other scripts and practice making a small change to their assigned component. The earlier page ownership remains Damir: Home/Events; Alina: Teams/Players; Aisha: Rankings/Community.

## Task 1: form validation

**Files:** [contact.html](../contact.html), [js/email-validation.js](../js/email-validation.js), [js/validation.js](../js/validation.js), [css/validation.css](../css/validation.css).

1. Open [Community: player sign-up](../contact.html#registration). The form supplies labels, required attributes, email input type, `minlength="8"` and a confirmation field with `data-match="#registration-password"`.
2. The script finds `form[data-validate-form]` and the existing `#contact-form`. It creates a separate error paragraph for each field and adds that paragraph's ID to `aria-describedby`, preserving any existing help description.
3. After the shared email helper loads, `form.noValidate = true` replaces browser validation bubbles with consistent inline errors. `getError()` checks required content, the shared email policy, explicit minimum/maximum lengths, HTML constraints and password confirmation. Passwords are compared exactly, without trimming or storing them.
4. On submit, ordinary text fields are trimmed. A valid email has only outer ASCII spaces removed and its domain lowercased; its mailbox case, dots and `+tag` are preserved. `validateAll()` returns invalid fields, `validateField()` updates messages and `aria-invalid`, and the live summary lists corrections. Invalid submission calls `preventDefault()` and focuses the first invalid field.
5. Blur validates a field. After failed submission, `input` and `change` update feedback; changing the password also rechecks confirmation. Reset clears inline errors, `aria-invalid`, the summary and submission state.
6. A valid sign-up demo calls `preventDefault()`, states that no account was created and no data was sent, and clears both password fields. Its submit button stays disabled until JavaScript has initialized.
7. The contact form checks its existing required name, email, topic and message. An invalid submission is blocked. A valid submission retains the original `mailto:info@esportshub.com` action to open an email draft; it does not prove delivery.

**Demonstration:** submit blank fields; try a whitespace-only name, incomplete email, password shorter than eight characters and mismatched confirmation. Correct the data, then show the success message and empty password fields. For contact validation, demonstrate errors without sending a real message.

**Email policy:** one unquoted ASCII mailbox and a fully qualified ASCII/punycode domain. Maximums: 254 characters overall, 64 before `@`, 63 per domain label. Check one `@`, allowed characters, edge/repeated dots, domain labels/hyphens and suffix. Domain suffixes have at least two letters or valid punycode; `URL` checks punycode without a network request. Unicode-written/quoted mailbox formats, address lists, display names, IP literals and local-only domains are unsupported. These are format checks, not proof of an existing mailbox. Real registration needs server-side validation and a verification email.

**Code to explain:** the shared pure `EsportsHubEmail.validate()` result, bounded regular expressions and length checks, preserving mailbox spelling, `preventDefault()`, exact password comparison, `aria-invalid`, `aria-describedby`, the summary and first-error focus. Run `node --test tests/email-validation.test.cjs` for the email edge cases.

## Task 2: FAQ accordion

**Files:** [contact.html#community-faq](../contact.html#community-faq), [js/accordion.js](../js/accordion.js), [css/interactive.css](../css/interactive.css).

1. Each question is a native button with `data-accordion-trigger`, `aria-expanded` and `aria-controls` pointing to its answer panel.
2. The answer starts hidden in HTML. JavaScript establishes the collapsed state, marks the panel `inert` and `aria-hidden="true"`, then removes the HTML `hidden` property so CSS can animate it.
3. Clicking a question reads `aria-expanded`, computes the opposite state and toggles `.is-open` on the matching panel. Clicking again closes the same answer.
4. CSS changes `grid-template-rows` from `0fr` to `1fr`. Visibility and overflow rules hide collapsed content; `inert` prevents keyboard focus inside a collapsed answer.
5. `prefers-reduced-motion: reduce` removes the transition for visitors who request less animation. Native buttons support Enter and Space without custom keyboard handlers.

**Demonstration:** show the initially collapsed list, open one answer, close it again, then repeat using the keyboard. Questions operate independently.

**Code to explain:** `querySelectorAll()`, `getElementById()`, `aria-controls`, boolean state, `classList.toggle()` and the CSS transition.

## Task 3: subscription popup

**Files:** shared HTML dialog markup, [js/email-validation.js](../js/email-validation.js), [js/subscription.js](../js/subscription.js), [css/subscription.css](../css/subscription.css).

1. The subscription form is inside `#subscription-dialog`, a native `<dialog>` without the `open` attribute, so it starts hidden.
2. A `[data-open-subscription]` button saves the opener and calls `showModal()`. The email field receives focus. Native modal behavior makes the background inert and supports Escape. A Tab/Shift+Tab boundary handler explicitly cycles between the first and last dialog controls.
3. The close button calls `dialog.close()`. For a click on the backdrop, the handler checks the pointer against the dialog's bounding rectangle and closes only when it is outside the popup area.
4. The `close` event resets the form and its messages, then restores focus to the button that opened it.
5. Subscription submit always calls `preventDefault()` and uses the same email helper as registration/contact. The submit button starts disabled until its validator is ready. Blur reports an invalid address; input/reset clear stale feedback. A valid demo displays that no subscription was sent or saved.

**Demonstration:** open Subscribe, try an invalid email and then a valid sample address. Close with the close button, reopen and click outside, reopen and press Escape. Check focus returns to the opener each time.

**Code to explain:** the difference between `showModal()` and changing display styles, the `close` event, backdrop detection, `event.target`, `getBoundingClientRect()` and focus restoration.

## Task 4: background color

**Files:** sidebar `section.hub-tools`, [js/site.js](../js/site.js), [css/interactive.css](../css/interactive.css).

1. `backgrounds` contains four named colors: White `#ffffff`, Soft mint `#edf7ef`, Soft lavender `#f3effa` and Warm cream `#fff7df`.
2. A `[data-background-cycle]` button increments `backgroundIndex`. The remainder operator `% backgrounds.length` wraps the index back to the first option.
3. JavaScript changes `document.body.style.backgroundColor` and `document.documentElement.style.setProperty('--hub-page-color', ...)`.
4. CSS uses that custom property for `.about`, `.games` and the hero gradient endpoint, making the page-level change visible. A `[data-background-name]` element announces the selected name.
5. Background transitions last 280 ms and respect reduced-motion preferences. The selected color is kept only for the current page visit; no persistence is implemented.

**Demonstration:** click through all four colors and show the cycle returning to White. Repeat at a mobile width.

**Code to explain:** arrays, index state, the modulo operator, event listeners, DOM style changes and CSS custom properties.

## Task 5: current date and time

**Files:** sidebar time element, [js/site.js](../js/site.js).

1. The script finds `[data-current-time]` elements and creates an `Intl.DateTimeFormat('en-US', ...)` formatter with month, day, year, hour, minute, second and AM/PM.
2. `updateClock()` creates `new Date()` on every update, using the device's current instant rather than incrementing a saved counter.
3. The formatted value becomes the visible text. `now.toISOString()` fills the time element's machine-readable `dateTime` property.
4. The displayed time-zone label comes from `formatter.resolvedOptions().timeZone`, so the site identifies the visitor's browser time zone.
5. The clock updates immediately, then `setInterval(updateClock, 1000)` refreshes it each second. A `visibilitychange` event refreshes it when the tab visibility changes.

**Demonstration:** show the readable date, changing seconds and time-zone label. Switch to another tab and back, then compare with the computer's clock.

**Code to explain:** the `Date` object, `Intl.DateTimeFormat`, the difference between visible local time and ISO UTC, `setInterval()` and why actual `Date` values prevent accumulated counter drift.

## Complete demonstration route

1. Open Home. Point out the full team names, FAN and SE-2501 in the footer and the shared sidebar tools.
2. Open Community sign-up. Demonstrate required fields, email, short password, mismatched confirmation and a successful demo.
3. Open the Community FAQ. Toggle an answer twice and repeat using Enter or Space.
4. Use Subscribe. Demonstrate opening, validation, close button, outside click and Escape.
5. Cycle the background colors and show the selected color name.
6. Show the current date/time changing each second and identify its browser time zone.
7. Resize to a mobile width. Repeat popup/accordion checks, inspect the forms and confirm that the page has no horizontal overflow.
8. Open the source and explain each assigned script. Every member should also be able to describe the other components.

## Browser and regression checks

Final integrated verification on 2026-10-21 passed in Chrome 155.0.8059.85 and Edge 155.0.4283.62. All six pages fit at 1440, 992, 768, 375 and 320 px (60 page-width checks). All five components passed, including repeated/multiple FAQ toggles, the four-color cycle, live clock updates, popup validation and every close method, focus restoration and 20 forward/backward Tab moves per browser. There were no console, JavaScript or failed-resource errors. A further 60 width checks with external HTTP(S) requests blocked confirmed that the local Bootstrap CSS is active and all website assets load locally. These are desktop browser viewport checks, not claims of testing physical phones, Firefox or Safari.

Registration and contact validation were checked in headless Google Chrome and Microsoft Edge using the registration markup and existing contact form. The checks covered blank/whitespace input, invalid email, short password, mismatched confirmation, revalidation when the password changes, first-error focus, valid demo prevention, cleared passwords, retained mailto behavior and absence of JavaScript page errors. These isolated checks do not replace testing the integrated website.

Before submission, verify the final integrated revision in available browsers and record what was actually checked:

- At desktop and 375/320 px mobile widths, open all six pages. Check menus, links, images, footer names, shared tools and absence of page overflow or console errors.
- Check every FAQ's default closed state and repeated open/close behavior; repeat with keyboard input and reduced motion enabled.
- Check popup hidden state, trigger, close button, outside click, Escape, keyboard focus and both invalid/valid email messages.
- Submit invalid and valid sign-up examples. Confirm no navigation occurs, success is truthful and passwords are cleared. Verify changing the original password revalidates confirmation.
- Confirm contact errors block an invalid submission. A valid submission may open the installed email application; do not treat that as a delivered message.
- Cycle all background options and watch the seconds update. Compare the date/time and time-zone label with the browser/device configuration.
- Recheck on the deployed URL after the successful Pages run. Do not describe untested browsers, operating systems or real mobile devices as tested.

## Likely defense questions

**Why are HTML validation attributes retained when JavaScript sets `noValidate`?** They document the field requirements and preserve native validation for the existing contact form when JavaScript is unavailable. JavaScript supplies the assignment's inline error interface after loading.

**Why does valid registration not create an account?** This is a frontend assignment without an account backend. The demo verifies the rules, prevents transmission and states the result accurately.

**Is client-side validation sufficient for a real service?** A real backend must validate incoming values again because browser code can be bypassed. This project demonstrates frontend behavior.

**Why revalidate confirmation after the original password changes?** A previously matching confirmation becomes invalid when the original value changes. Rechecking both prevents stale success feedback.

**Why use a native button for accordion questions?** It already supports focus, Enter and Space. `aria-expanded` conveys the open state and `aria-controls` associates the answer.

**Why use `<dialog>`?** `showModal()` provides a modal top layer, focus containment and Escape behavior. The script adds the required outside-click close and explicit focus restoration.

**What does `% backgrounds.length` do?** It keeps the next palette index within the array; after the last option it returns zero.

**Which time zone is shown?** The browser's configured local time zone. The visible text is local; the HTML `datetime` value is ISO UTC.

**Why use `defer`?** External scripts can load while HTML is being parsed and execute after parsing, so the components can find their elements.

**Do the old midterm audits verify Assignment 4?** No. They describe an earlier revision. Assignment 4 adds custom JavaScript and requires its own integrated checks and screenshots.

## Deployment and report

The website URL is [https://drissakov.github.io/EsportsHub/](https://drissakov.github.io/EsportsHub/). GitHub Pages uses `main` and the repository root. After committing and pushing, confirm the latest Pages build succeeds for the submitted commit and verify the live components.

Prepare a report with Team FAN, Damir Issakov, Alina Aitmukhamet, Aisha Mussina, group SE-2501, objective, all five tasks, step-by-step implementation explanations, actual screenshots, the deployed URL and a final reflection. Use screenshots from the tested revision and write reflections in the team's own words. Package the full working HTML, CSS, JavaScript, images and documentation into the project ZIP. Each member must submit in LMS before its stated deadline and attend the practical defense.
