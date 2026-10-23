# EsportsHub

EsportsHub is a six-page academic frontend prototype for discovering esports events, teams, players and sample rankings. Assignment 4 adds JavaScript form validation, an FAQ accordion, a subscription popup, a background color button and a live date/time display to the existing responsive website.

## Team

**Team FAN - group SE-2501**

| Member | Assigned Assignment 4 responsibility | Existing page responsibility |
| --- | --- | --- |
| Damir Issakov | Subscription popup; current date and time | Home and Events |
| Alina Aitmukhamet | FAQ accordion; background color change | Teams and Players |
| Aisha Mussina | Registration validation; contact form validation | Rankings and Community |

All three members' full names, team name and group appear in the footer of every HTML page. Each member must understand the other components and be able to explain and modify the assigned JavaScript during the defense.

## Technologies and scope

The project uses semantic HTML5, CSS3, Flexbox, CSS Grid, responsive media queries, Bootstrap **5.3.8 CSS** and plain JavaScript. No package installation, compilation, framework or backend is needed. The mobile menu still uses a native checkbox and CSS; the nine-image carousel still uses native scrolling and real fragment links. Bootstrap JavaScript is not loaded.

Events, profiles and rankings are sample content. Calendar preview controls do not filter data. The sign-up and subscription components demonstrate client-side validation; they do not create accounts, store credentials or send subscriptions. The existing contact form opens an email draft through `mailto:` after its inputs pass JavaScript validation; delivery depends on the visitor's email application and is not confirmed by this website.

## Assignment 4 components

| Task | Where to demonstrate | Implementation |
| --- | --- | --- |
| 1. Form validation | [Community: player sign-up](contact.html#registration), plus the [contact form](contact.html#contact-form) | [js/email-validation.js](js/email-validation.js), [js/validation.js](js/validation.js), [css/validation.css](css/validation.css) |
| 2. FAQ accordion | [Community FAQ](contact.html#community-faq) | [js/accordion.js](js/accordion.js), [css/interactive.css](css/interactive.css) |
| 3. Subscription popup | Subscribe button in the shared sidebar tools on every page | [js/subscription.js](js/subscription.js), [css/subscription.css](css/subscription.css) |
| 4. Background color | Change background button in the shared sidebar tools | [js/site.js](js/site.js), [css/interactive.css](css/interactive.css) |
| 5. Current date and time | Clock in the shared sidebar tools | [js/site.js](js/site.js) |

Registration checks required display name and email, valid email format, a password of at least eight characters and matching password confirmation. Whitespace-only input is rejected. Inline errors, `aria-invalid`, associated error descriptions, a live summary and focus on the first invalid field make corrections clear. A valid demo submission stays on the page, displays a truthful result and clears both password fields. Passwords are not stored or logged.

Contact, registration and subscription use the same JavaScript email validator. It accepts one unquoted ASCII mailbox with a fully qualified ASCII/punycode domain: at most 254 characters overall, 64 before `@`, and 63 per domain label. It rejects repeated/edge dots, malformed domains, control or hidden characters, address lists and display names. Domain suffixes must contain at least two letters or valid punycode. SMTPUTF8 mailbox names, Unicode-written domains, quoted mailbox names, IP literals and local-only domains are outside this browser form's supported format. Outer ASCII spaces are trimmed and only domain case is normalized; mailbox case, dots and `+tags` are preserved. JavaScript enforces lengths even for programmatically assigned values. Input, blur, submission and reset update the error state consistently.

These checks validate the supported spelling only. They do not prove mailbox existence or ownership, and JavaScript can be bypassed. A real account/subscription service would also need server-side validation and email ownership verification; this static demo has no such backend. See [OWASP email validation guidance](https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html).

Run the email regression tests with `node --test tests/email-validation.test.cjs` (Node.js built-in test runner; no package installation). They include length boundaries, supported aliases, malformed/hidden characters and oversized input.

FAQ answers start collapsed. Clicking a native question button toggles its answer with a CSS transition, updates `aria-expanded`, and keeps collapsed content out of keyboard navigation. The subscription popup starts hidden and supports its close button, clicking the backdrop and Escape, then returns focus to its opening button.

The background button cycles White, Soft mint, Soft lavender and Warm cream. JavaScript sets `body.style.backgroundColor` and the shared `--hub-page-color` CSS property, so the change is visible across the page. The clock creates a new `Date`, formats it in English with seconds and the browser's local time zone, and refreshes every second. Reduced-motion preferences disable the relevant transitions.

JavaScript files are linked with `defer`, so their code runs after the HTML has been parsed. Components check for their target elements, allowing the same site features to be used across all six pages. See [the Assignment 4 defense guide](docs/assignment-4-defense.md) for the code walkthrough, demonstration route and test checklist.

## Earlier assignment concepts preserved

- **Assignment 1:** Metadata, semantic landmarks, headings, ordered/unordered lists, local images with alt text, navigation, four-column table, labeled form, team biographies and circular avatar. [css/style.css](css/style.css) retains element, class, ID and descendant selectors, box-model rules, typography, colors and hover states.
- **Assignment 2:** Flexbox navbar alignment; custom `.players-container` cards; `.page-layout` with named header/sidebar/main/footer Grid areas; and a nine-image `.gallery-grid` with captions.
- **Assignment 3:** Responsive media queries, custom 3/2/1 player-card layouts, Bootstrap two/three-column grids, spacing utilities, navbar styling, button variants, ranking button group, Home cards and responsive forms. Skip links, visible keyboard focus and table headers remain in place.

The custom Flexbox cards on Players remain separate from the Bootstrap cards on Home. [docs/midterm-audit.md](docs/midterm-audit.md) and [docs/defense-evidence.md](docs/defense-evidence.md) describe the **earlier midterm revision**, including its former HTML/CSS-only scope and historical checks. They are not verification records for the new Assignment 4 JavaScript.

## Responsive behavior

| Width | Navigation / sidebar | Custom player cards | Grid gallery |
| --- | --- | --- | --- |
| 992px and wider | Expanded navbar; sidebar on the left | 3 per row | 3 columns |
| 768px to below 992px | Collapsed navbar; quick links above main | 2 per row | 2 columns |
| 576px to below 768px | Collapsed navbar; stacked content and form fields | 1 per row | 2 columns |
| Below 576px | Collapsed navbar; wrapping quick links | 1 per row | 1 column |

Game/support tiles use four columns from 1200px, two from 576px and one below 576px. The ranking table scrolls inside its own labeled region. Ordinary images preserve their proportions; bounded card, gallery, carousel and avatar images use intentional crops.

## Run locally

Open `index.html` in a modern browser, or serve this folder with a static server/editor preview. Keep the relative `css/`, `js/` and `images/` directories beside the HTML pages. Bootstrap 5.3.8 CSS is included locally in [css/vendor/bootstrap.min.css](css/vendor/bootstrap.min.css), with its license header preserved. It was downloaded from the existing jsDelivr source and its original SHA-384 integrity hash was verified before removing the optional source-map hint. The website assets work offline; external links and the mailto contact action require their normal applications or connectivity.

Use sample form data during demonstrations. Sign-up requires JavaScript and its demo button remains disabled until the validation script has initialized. The existing contact form retains native HTML validation as a fallback when JavaScript is unavailable.

## Deployment and submission

Website URL: [https://drissakov.github.io/EsportsHub/](https://drissakov.github.io/EsportsHub/).

GitHub Pages serves the repository's **main branch, root folder**. `index.html` is the entry point, internal assets use relative paths and `.nojekyll` disables Jekyll processing. Commit and push the updated project to the shared repository, then confirm the latest successful Pages deployment matches that commit.

The submission package consists of a report and a ZIP archive of the complete project files. The report must include Team FAN, the full member names, group SE-2501, the objective, all five tasks with actual screenshots and step-by-step explanations, the deployed URL and a final reflection. Each member must submit the assignment in LMS before its stated deadline and defend the work in the practice lesson.

## Image credits

Assignment 4 reuses the existing project images. The eleven original raster files remain in `images/`; `donk.avif`, `eventsfeature.avif` and `teams.webp` were previously renamed to match their existing formats without changing their bytes.

The earlier project revision introduced these original SVG illustrations:

| Original artwork | Source |
| --- | --- |
| [player-room.svg](images/player-room.svg) | Repository SVG code; community gaming illustration |
| [community-support.svg](images/community-support.svg) | Repository SVG code; community desk connections |
| [team-avatar.svg](images/team-avatar.svg) | Repository SVG code; team initials |
| [demo-ranking.svg](images/demo-ranking.svg) | Repository SVG code; sample ranking points |

Original source/license records for the pre-existing raster imagery are absent from the repository. No source, license or permission is inferred.
