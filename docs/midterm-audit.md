# EsportsHub Midterm Audit — Stage 0

**Current implementation:** HTML/CSS only, following the updated user constraint on 2026-10-08. Stages 0–9 below are historical records. The final HTML/CSS-only cleanup section supersedes their Bootstrap JavaScript implementation and test claims. Temporary testing files and screenshots are no longer included.

**Audit date:** 2026-10-07

**Repository:** `https://github.com/drissakov/EsportsHub`

**Audited checkout:** `main` at commit `f7e6bd6291c354458f7581db2cc57bcb4318260c`

**Scope:** repository source files, local static checks, image signatures/dimensions, dependency responses, and the deployed GitHub Pages URL.

This is an audit of the existing static prototype. No page redesign, framework migration, backend, or working-project deletion was performed. The checkout was clean before this audit; the only repository change is this file.

## Status key

| Status | Meaning |
| --- | --- |
| **Present** | Evidence is implemented and found in the audited source. |
| **Partial** | Some evidence is present, but the exact requirement has a gap, dependency, or unresolved risk. |
| **Missing** | No implementation was found. |

## 1. Repository and file inventory

```text
EsportsHub/
├── README.md
├── index.html
├── events.html
├── teams.html
├── players.html
├── rankings.html
├── contact.html
├── css/
│   └── style.css
└── images/
    ├── contact.jpg
    ├── donk.jpg
    ├── esports.jpg
    ├── events.jpg
    ├── eventsfeature.jpg
    ├── faker.jpg
    ├── monesy.jpg
    ├── players.jpg
    ├── rankings.jpg
    ├── team.jpg
    └── teams.jpg
```

Inventory findings:

- Six HTML pages are present and use GitHub Pages-compatible relative page and asset paths.
- `css/style.css` is the only project stylesheet and is linked by all six pages.
- Eleven image files are present; all are referenced by at least one page, but three have file-format/extension mismatches documented in the image inventory below.
- No project JavaScript file, package manifest, build configuration, GitHub Actions workflow, `.nojekyll`, test suite, or deployment configuration was found. Bootstrap JavaScript is loaded from jsDelivr on every page.
- README claims the Pages URL is `https://drissakov.github.io/EsportsHub/`. A direct HTTP check on 2026-10-07 returned `200 OK` for the root, all six page URLs, and all eleven image URLs.
- The live server returned `Content-Type: image/jpeg` for every `.jpg` URL, including the three files whose bytes identify as AVIF/WebP. This is a deployment/runtime image risk even though the URLs themselves return 200.

### Files inspected

`README.md`, `index.html`, `events.html`, `teams.html`, `players.html`, `rankings.html`, `contact.html`, `css/style.css`, every file in `images/`, the Git history/remote metadata, all local `href`, `src`, and form `action` targets, and the live Pages/CDN URLs.

## 2. Page-by-page implementation summary

| Page | Current implementation | Evidence and notable risk |
| --- | --- | --- |
| `index.html` | Home/landing page with shared header/sidebar/footer, hero CTA, popular-game tiles, three upcoming-event rows, a three-card Bootstrap featured-player section, and an About section. | Main content starts at `index.html:103`; Bootstrap cards at `index.html:277-335`; footer at `index.html:369-390`. Home title is only `EsportsHub`, less descriptive than the other page titles. |
| `events.html` | Upcoming-events page with hero, four game tiles, featured event image, five event rows, an event-feature image, ordered “how to follow” list, and About section. | Main content starts at `events.html:103`; event list at `events.html:181-300`; ordered list at `events.html:315-326`. `eventsfeature.jpg` is an AVIF file named `.jpg`. |
| `teams.html` | Teams page with hero, four game/team tiles, team feature image, team-focus CTA, and About section. | Main content starts at `teams.html:103`; feature image at `teams.html:168`; several cards/CTAs link back to `teams.html` instead of team detail pages. `teams.jpg` is WebP bytes named `.jpg`. |
| `players.html` | Players page with the separate CSS-only three/two/one player-card group, player feature section, nine-image Bootstrap carousel, controls/indicators, and About section. | CSS card group at `players.html:161-204`; carousel at `players.html:263-410`. The carousel has nine images and captions, but it is not a CSS Grid gallery. Previous/next buttons at `players.html:400-408` have no visible or ARIA accessible name. |
| `rankings.html` | Rankings page with feature image, Bootstrap button group, horizontally scrollable four-column ranking table, leaderboard CTA, and About section. | Table region at `rankings.html:199-278`; `Rank`, `Team`, `Game`, and `Points` columns. The table wrapper uses `div role="region"`, which the validator flags as a native-element suggestion. |
| `contact.html` | Contact page with contact tiles, responsive Bootstrap form, contact image, unordered list, team biography/profile image, CTA, and About section. | Form at `contact.html:166-218`; biography at `contact.html:237-250`. The form uses `mailto:info@esportshub.com`, so submission depends on a configured desktop email application and has no server-side delivery. Discord, Instagram, and Location tiles point back to `contact.html`. |

## 3. Requirements matrix

### Assignment 1

| Requirement | Status | Evidence / gap |
| --- | --- | --- |
| Full HTML5 boilerplate and descriptive title on every page | **Partial** | All pages have `<!DOCTYPE html>`, `lang`, charset, viewport, and `<title>` in lines 1-11. `index.html:7-9` uses only `EsportsHub`; the other titles identify their page. |
| Existing creator/team credit comment | **Present** | `<!-- Created by Damir, Alina and Aisha -->` at line 6 of every HTML page. |
| Semantic headings, paragraphs, ordered lists, and unordered lists | **Present** | Landmarks/headings occur throughout all pages; `events.html:315-326` has an ordered list; navigation/content lists occur on every page. |
| At least one meaningful image with valid alt text on every page | **Partial** | Every page has one or more `<img alt="...">` elements. Three referenced `.jpg` files are actually AVIF/WebP bytes, so markup is good but runtime image rendering is not yet reliable. |
| One consistent global navigation connecting all six pages | **Present** | Each page has the same six-link navbar at lines 19-60 and a matching quick-links sidebar at lines 65-100. |
| Table with `th`, `tr`, `td`, and at least three columns | **Present** | `rankings.html:200-278` has four columns, column headers, row headers, body rows, and data cells. |
| Contact/registration form with name, email, choice, textarea, and submit | **Present** | `contact.html:166-215` has text name input, email input, required topic dropdown, textarea, and submit button. |
| One shared external stylesheet linked by every page | **Present** | `css/style.css` is linked at line 11 of all six pages. |
| Element, class, ID, and descendant selectors | **Present** | Examples: `p`, `.sidebar`, `#contact-form`, `.sidebar a`, `.about-content > p` in `css/style.css:19-59`, `330-346`, and `451-480`. |
| Custom typography, palette, backgrounds, links, hover states, box model, responsive sizing | **Present** | Global palette/typography at `css/style.css:5-17`, backgrounds at `72-74`/`123-125`, hover states at `146-186`/`232-235`, spacing/borders throughout, and media queries at `401-430`, `456-474`, and `556-573`. |
| Circular profile or feature image using `border-radius: 50%` | **Present** | `.profile-image` at `css/style.css:361-367`; used by the team image at `contact.html:243`. |
| About the Team Members / biography section | **Present** | `contact.html:237-250` contains the labelled biography section and team profile image. |
| All team members named in every footer | **Present** | Every footer lists `Damir · Alina · Aisha`; examples: `index.html:382-385`, `players.html:457-460`, and equivalent footer blocks on the other four pages. |
| GitHub Pages-compatible relative paths | **Partial** | Local HTML/image paths are relative and all local targets exist. The three incorrectly named image formats may still fail because Pages serves them as `image/jpeg`. |

### Assignment 2

| Requirement | Status | Evidence / gap |
| --- | --- | --- |
| Flexbox navigation with logo left, links right, alignment and spacing | **Present** | Bootstrap `navbar`/`navbar-nav ms-auto` classes at every page’s header; the shared nav is loaded after the custom stylesheet and uses Bootstrap Flexbox behavior. |
| Flexbox row of at least three cards with image, title, text, button, equal-height behavior, gaps, and hover effect | **Present** | CSS-only card group in `players.html:161-204`; `.players-container` and `.player-card` at `css/style.css:127-149` use Flexbox, `gap`, `align-items: stretch`, fixed image geometry, and hover transform/shadow. |
| CSS Grid page layout with header, sidebar, main, and footer areas | **Present** | `.page-layout` at `css/style.css:29-38` defines the four grid areas; responsive one-column areas are at `401-410`. |
| CSS Grid gallery with at least nine images, equal tracks, gaps, hover, and captions | **Partial** | `players.html:278-390` contains nine images and captions in a Bootstrap carousel. `.gallery-section` has no CSS Grid track/gap implementation, and carousel slides do not provide the required grid hover treatment. |
| Responsive behavior and footer spanning the page | **Present** | Breakpoint rules alter the page grid, cards, sidebar, game tiles, event rows, typography, and footer; `.grid-footer` spans the `footer footer` grid area. |

### Assignment 3

| Requirement | Status | Evidence / gap |
| --- | --- | --- |
| Media-query typography for mobile, tablet, and desktop | **Present** | Base desktop typography plus tablet rules at `css/style.css:456-464` and mobile rules at `466-474`. |
| Separate CSS-only responsive card group: 3 desktop, 2 tablet, 1 mobile | **Present** | `players.html:168-204` uses custom cards; `.player-card` changes from 3 columns to 2 at `991.98px` and 1 at `767.98px` (`css/style.css:134-144`, `456-474`). |
| Bootstrap Grid with two-column `col-lg-6` and three-column `col-lg-4` examples | **Present** | Two-column content at `index.html:105-121` and three-column player cards at `index.html:284-335`; equivalents occur on other information sections. |
| Bootstrap container/container-fluid and responsive grid classes | **Partial** | `.container`, `.row`, `col-sm-12`, `col-md-6`, and `col-lg-6/4` are used widely. No `container-fluid` class was found. |
| Bootstrap spacing utilities including examples such as `mt-lg-4` and `px-sm-2` | **Present** | `mt-lg-4` at `index.html:117`; `px-sm-2` in every navbar; `py-4`, `py-lg-5`, `p-md-4`, and related utilities occur throughout. |
| Responsive Bootstrap navbar with at least four links and collapsing toggler | **Present** | Every page has six links, `navbar-expand-lg`, a `navbar-toggler`, and collapse target `#mainNavigation` at lines 19-60. |
| Bootstrap buttons, different button states, and a `btn-group` | **Present** | Buttons/links use Bootstrap button classes; custom hover/active/disabled variables are at `css/style.css:494-516`; the rankings group is at `rankings.html:187-197`. |
| Functional Bootstrap carousel with nine images, indicators, previous/next controls | **Present** | `players.html:278-410` has nine slides, nine indicators, previous/next controls, `data-bs-*` targets, and Bootstrap JS. It depends on the external CDN and its two navigation buttons need accessible labels. |
| At least three Bootstrap cards with images, titles, descriptions | **Present** | `index.html:284-335` has three `.card` articles with `.card-img-top`, `.card-title`, and `.card-text`. |
| Responsive Bootstrap form using form controls, labels/select/input group | **Present** | `contact.html:166-218` uses `form-control`, `form-label`, `form-select`, `input-group`, responsive columns, and native required/email validation. |
| Semantic HTML, contrast, readability, accessibility | **Partial** | Semantic landmarks, skip link, focus styles, labels, alt text, table caption, ARIA regions, and reduced-motion rules are present. Remaining gaps are the unlabeled carousel prev/next buttons, validator findings, image-format risk, and no recorded automated contrast result. |

### Midterm rubric

| Rubric area | Status | Stage 0 assessment |
| --- | --- | --- |
| Responsiveness — 15 points | **Partial** | Breakpoints and responsive layout rules are present, including card 3/2/1 behavior and table scrolling. Exact-width and visual regression checks have not been completed; narrow carousel captions, event rows, and the bad image formats remain risks. |
| Hosting/GitHub Pages — 10 points | **Partial** | Root, six pages, assets, and CDN endpoints returned HTTP 200. There is no deployment configuration, and Pages serves the mislabeled image files as `image/jpeg`, so successful URL responses do not guarantee successful image rendering. |
| Design quality — 20 points | **Partial** | The red/yellow/brown theme, spacing, card geometry, hover states, and responsive structure are cohesive. Design quality is reduced by the invalid image extensions, very heavy `Arial Black` fallback choice, and missing CSS Grid gallery requirement; no visual review was recorded for every target viewport. |
| Feature cohesion and relevance — 15 points | **Present** | Home, events, teams, players, rankings, and contact form a coherent static esports discovery prototype with shared navigation and repeated community-focused CTAs. Some prototype cards are self-links rather than detail destinations. |
| Defense readiness — 40 points | **Partial** | README has page ownership and assignment notes, and the implementation is easy to trace. Defense risks still need explicit explanation: carousel vs. CSS Grid gallery, image container formats, mailto-only form behavior, validator findings, and the self-link controls. |

## 4. Broken links, missing assets, dead controls, and suspicious markup

### Link and asset checks

- Static local-target check found **no missing local page, stylesheet, image, or fragment target**. The three featured-player fragments `players.html#donk`, `#monesy`, and `#faker` resolve to IDs in `players.html:169`, `181`, and `193`.
- All six deployed pages returned `200 OK`: `/`, `/index.html`, `/events.html`, `/teams.html`, `/players.html`, `/rankings.html`, and `/contact.html`.
- All eleven deployed image URLs returned `200 OK`, but `donk.jpg`, `eventsfeature.jpg`, and `teams.jpg` have binary formats that do not match their `.jpg` names or the server’s `image/jpeg` response. Treat these as invalid/mislabeled assets until normalized.
- Bootstrap CSS and JS are the only HTTP external dependencies found. Both jsDelivr URLs returned `200 OK`; locally calculated SHA-384 hashes matched the SRI values in the HTML.
- `mailto:info@esportshub.com` appears in contact links and the form action. It is intentionally backend-free, but it is not a server endpoint and requires a configured mail application.

### Dead or low-value controls

- Contact page Discord, Instagram, and Location tiles at `contact.html:134-150` all link to `contact.html` and do not open an actual destination.
- Browse/game tiles and event rows on `events.html`, `teams.html`, and `players.html` repeatedly link to their current page, for example `events.html:126-150`, `events.html:194-297`, and `teams.html:126-196`. These are valid links but act as low-value/self-link controls until detail pages or meaningful anchors exist.
- The previous/next carousel buttons at `players.html:400-408` have icon-only content with `aria-hidden="true"` spans and no `aria-label` or visually hidden text. They may work visually but are not reliably named for assistive technology.

### Duplicate IDs and markup validation

- No duplicate IDs were found within any page. `mainNavigation` and `main-content` are intentionally repeated across separate documents, not duplicated within one document.
- `npx --yes html-validate@8.24.0 index.html events.html teams.html players.html rankings.html contact.html` reported 51 findings:
  - 49 HTML5 void-element style findings for self-closing `<meta/>`, `<link/>`, `<input/>`, and `<img/>` tags. These should be normalized to HTML syntax without the slash in a later cleanup, although browsers generally parse them.
  - `players.html:278` and `rankings.html:199` received `prefer-native-element` findings for `div` elements carrying `role="region"`; review whether `section`/`figure` or the current ARIA structure is more appropriate.
- No JavaScript/configuration file exists locally to inspect for additional controls or deployment behavior.

## 5. Image inventory

Dimensions below come from the HTML width/height declarations and local decoder checks. JPEG dimensions were decoded locally. The three format-mismatch files could not be decoded by the installed `System.Drawing` JPEG decoder; their declared dimensions are recorded and must be verified during the next implementation stage.

| File | Declared / decoded dimensions | Aspect ratio | Use | Stretched/cropped | Source/license |
| --- | --- | ---: | --- | --- | --- |
| `images/contact.jpg` | 554 × 554 (decoded JPEG) | 1.00 | Contact graphic, `contact.html:223` | `.feature-image` fixes height to 260px and uses `object-fit: cover`; cropped on wider renders. | Unknown; no source or license metadata in repo. |
| `images/donk.jpg` | Declared 1350 × 900; bytes identify as AVIF (`ftypavif`) | 1.50 declared | Home card, player card, carousel slides | Card/player/carousel rules use fixed heights and `object-fit: cover`; crop risk. Extension/MIME mismatch is a load risk. | Unknown; no source or license metadata in repo. |
| `images/esports.jpg` | 960 × 720 (decoded JPEG) | 1.33 | Home hero and carousel slide 1 | Hero height 360px and carousel clamp height use `object-fit: cover`; crop risk. | Unknown; no source or license metadata in repo. |
| `images/events.jpg` | 738 × 414 (decoded JPEG) | 1.78 | Events feature image and carousel slide 2 | Feature image fixed at 260px and carousel uses cover; crop risk. | Unknown; no source or license metadata in repo. |
| `images/eventsfeature.jpg` | Declared 740 × 740; bytes identify as AVIF (`ftypavif`) | 1.00 declared | Events feature image and carousel slide 3 | `.feature-image` and carousel use cover; crop risk. Extension/MIME mismatch is a load risk. | Unknown; no source or license metadata in repo. |
| `images/faker.jpg` | 730 × 365 (decoded JPEG) | 2.00 | Home card, player card, carousel slide 6 | Fixed card/carousel boxes use `object-fit: cover`; crop risk. | Unknown; EXIF signature exists, but provenance/license is not documented. |
| `images/monesy.jpg` | 1200 × 900 (decoded JPEG) | 1.33 | Home card, player card, carousel slide 5 | Fixed card/carousel boxes use `object-fit: cover`; crop risk. | Unknown; no source or license metadata in repo. |
| `images/players.jpg` | 275 × 183 (decoded JPEG) | 1.50 | Players feature image and carousel slide 7 | Feature image and carousel use fixed/cover geometry; crop risk and low source resolution on large displays. | Unknown; no source or license metadata in repo. |
| `images/rankings.jpg` | 401 × 498 (decoded JPEG) | 0.81 | Rankings feature image and carousel slide 9 | Rankings feature preserves ratio with `height:auto`; carousel uses cover and crops. | Unknown; no source or license metadata in repo. |
| `images/team.jpg` | 204 × 192 (decoded JPEG) | 1.06 | Circular team biography image, `contact.html:243` | Forced to 150 × 150 and circular `object-fit: cover`; small crop is intentional. | Unknown; no source or license metadata in repo. |
| `images/teams.jpg` | Declared 905 × 410; bytes identify as WebP (`RIFF....WEBP`) | 2.21 declared | Teams feature image and carousel slide 8 | Feature image and carousel use fixed/cover geometry; crop risk. Extension/MIME mismatch is a load risk. | Unknown; no source or license metadata in repo. |

## 6. Responsive risk list

These are code-based risks at the requested viewport widths. They are not a claim that every risk is already visible in a screenshot; visual viewport regression still needs to be run in the next stage.

| Viewport | Current rules | Risk to verify |
| ---: | --- | --- |
| **1440px** | Desktop two-column page grid; 220px sidebar; expanded navbar; four game tiles; three-card sections. | Large display crops the fixed-height hero/card images. The custom `Arial Black` typography can make headings and navigation wider than intended. Verify max-width/container alignment and visual balance. |
| **1200px** | Same desktop mode; main content is reduced by the 220px sidebar; game tiles remain four columns. | Four tiles and long labels may become cramped inside the remaining main column. Verify that the 90% section container and `overflow-wrap:anywhere` do not create awkward breaks. |
| **992px** | Exact 992px remains desktop because breakpoints switch at `max-width: 991.98px`; navbar remains expanded and sidebar remains left. | This one-pixel boundary is easy to misread during defense. At 992px, the sidebar plus expanded nav can leave a narrow main column; check table, cards, and hero image. |
| **768px** | Tablet mode: one-column page grid, sidebar above main, collapsed navbar, two custom player cards per row, two game tiles per row, 48px hero heading. | Sidebar link wrapping and two-column cards need verification. Event rows and long headings may be dense at the lower edge of tablet mode. |
| **576px** | Still tablet rules at exactly 576px; game tiles remain two columns; player cards remain two columns; event grid is 56px/1fr/18px. | The 575.98px breakpoint is another one-pixel boundary. At 576px two-column tiles may be too narrow for the heavy font; verify labels and focus outlines. |
| **375px** | Mobile mode: one game tile/card column, 36px hero heading, collapsed navbar, 56px event date column, fixed minimum carousel image height of 280px. | Carousel captions have only 70% width, may become tall, and controls overlay the image. Verify no horizontal overflow from event text, sidebar links, or navbar branding. |
| **320px** | Same mobile rules at the smallest target; single-column content and wrapped sidebar links. | Highest risk of text wrapping/overflow: icon-only carousel controls, long event titles, heavy fallback font, 480px minimum ranking table (intentionally scrollable), and contact form controls. Verify keyboard focus and horizontal scroll behavior. |

Cross-viewport risks common to all sizes:

- The three mislabeled image files may fail or render inconsistently depending on browser MIME sniffing.
- The carousel uses nine images and captions, but the required CSS Grid gallery is absent.
- `mailto:` form submission cannot be verified as delivered without a configured email application.
- No browser automation, screenshot matrix, contrast analyzer, or keyboard walkthrough was recorded in this Stage 0 pass.

## 7. Prioritized implementation plan for next stages

### P0 — resolve before visual polish

1. Normalize `donk.jpg`, `eventsfeature.jpg`, and `teams.jpg`: either convert to real JPEGs or rename them to their actual formats and update every relative reference. Confirm correct server MIME types on the Pages URL.
2. Add accessible names to the carousel previous/next buttons and re-run keyboard/screen-reader checks.
3. Decide how Assignment 2’s CSS Grid gallery will coexist with the existing Bootstrap carousel. Preserve the carousel for Assignment 3, and add a separate CSS Grid gallery only if the rubric requires both features.

### P1 — improve rubric confidence and control meaning

4. Replace self-links with meaningful destinations or section fragments, especially Contact social/location tiles and Events/Teams/Players detail CTAs.
5. Normalize HTML5 void elements by removing the XHTML-style closing slashes, then re-run `html-validate` and inspect the two `role="region"` suggestions.
6. Run a real browser regression at 1440, 1200, 992, 768, 576, 375, and 320px, including navbar collapse, carousel indicators/controls, table scrolling, focus order, and image rendering.
7. Run a contrast/accessibility check and record results. Reconsider `Arial Black` as the global UI font if it causes wrapping or readability problems.

### P2 — strengthen defense and submission evidence

8. Add a small local verification script or documented command set for link, asset, image-format, and HTML checks.
9. Add source/license notes for every image or replace images with assets whose provenance can be documented.
10. Update README after implementation changes so it matches the audited source, especially the CSS Grid gallery status, image formats, form limitations, and validation results.

## 8. Stage 0 completed

**Completed:** 2026-10-07

Checks actually performed:

- Cloned `https://github.com/drissakov/EsportsHub.git` into the task checkout and confirmed `main` was clean at commit `f7e6bd6291c354458f7581db2cc57bcb4318260c`.
- Enumerated repository files with `rg --files` and recursive file inventory; read `README.md`, all six HTML pages, and `css/style.css`.
- Extracted and checked all local `href`, `src`, fragment, and form `action` targets; no missing local targets or duplicate IDs were found.
- Checked image file signatures and decoded dimensions where the installed decoder supported them.
- Checked live GitHub Pages root, all six pages, all eleven image URLs, and both Bootstrap CDN URLs with `Invoke-WebRequest`.
- Calculated SHA-384 hashes for the downloaded Bootstrap CSS/JS and confirmed both matched their HTML `integrity` attributes.
- Ran `npx --yes html-validate@8.24.0 index.html events.html teams.html players.html rankings.html contact.html`; recorded its 51 findings in this audit.
- Did not modify any existing HTML, CSS, image, or README file; created only `docs/midterm-audit.md`.

Checks that were impossible or not completed:

- A full interactive browser/assistive-technology/keyboard walkthrough and screenshot comparison at all seven viewport widths was not completed in this Stage 0 static audit.
- Form delivery could not be verified because the form is `mailto:`-based and depends on the operator’s local email client; there is no backend.
- Source/license provenance for the images could not be established from the repository or README; no attribution metadata is recorded.
- The intrinsic dimensions of the AVIF/WebP files could not be decoded by the installed local JPEG decoder; their HTML-declared dimensions are recorded above and should be confirmed after format normalization.

## Stage 1 completed

**Completed:** 2026-10-07

### Information-architecture decisions

- The six-page product model is now explicit: Home explains the platform, Events is the discovery/calendar step, Teams and Players are the people/roster discovery step, Rankings explains the possible results loop, and Community/Contact handles support and participation.
- The primary navigation is identical across all six pages, with the active page marked by both the visual `active` class and `aria-current="page"`.
- The CSS Grid sidebar is retained, but each page now has task-specific links instead of a second copy of the full navbar. Examples include `#event-filters`, `#team-directory`, `#player-gallery`, `#ranking-table`, and `#contact-form`.
- Repeated informational cards now either point to meaningful content fragments/cross-page destinations or are non-interactive semantic articles. Bare `href="#"` controls and misleading same-page action links were not introduced.
- All event, team, player and ranking content is labelled as sample/prototype content where it could otherwise be mistaken for live data. Event filtering is an honest visual prototype affordance; it returns to the sample calendar but does not claim to filter a backend dataset.
- The footer now has one shared structure on every page: brand, Explore navigation, and the full team credit. Its links reinforce the product flow instead of duplicating the sidebar.

### Page-to-page user flow

```text
Home
 ├─ discover sample events ──> Events
 ├─ compare players and teams -> Players / Teams
 └─ understand the product flow -> sample Rankings

Players <──────────────> Teams
     \                    /
      └── find events ───┘
                |
                v
      Rankings explains how results could connect
                |
                v
      Community/Contact for questions, organizers,
      partnerships, feedback and problem reports
```

### Changed files and important anchors/components

| File | Stage 1 changes |
| --- | --- |
| `index.html` | Product explanation in the hero; `#how-it-works`, `#upcoming-events`, `#featured-players`, and `#community`; event preview links to event detail fragments; shared footer. |
| `events.html` | `#event-filters`, honest prototype game/format controls, `#event-list`, five event article IDs, sample-data note, `#event-guidance`, and cross-links to teams/community. |
| `teams.html` | `#team-directory`, semantic `.team-tile` sample profiles, `#team-focus`, `#team-community`, and a non-recruitment disclaimer. |
| `players.html` | `#player-directory`, `#player-focus`, `#player-context`, `#player-gallery`, existing `#donk`/`#monesy`/`#faker` profiles, a real `.gallery-grid`, accessible carousel controls, and cross-links to teams/rankings. |
| `rankings.html` | `#ranking-context`, `#ranking-table`, `#ranking-leaderboard`, `#how-rankings-work`, visible sample-data table caption, and result-flow copy. |
| `contact.html` | Renamed Community/Contact title/navigation, `#contact-options`, support categories for questions/organizers/partnerships/feedback/problems, `#contact-form`, `#team`, and honest mailto behavior copy. |
| `css/style.css` | Page-specific sidebar copy, event filter styling, shared footer navigation, team tile styling, CSS Grid gallery with responsive 3/2/1 tracks and hover captions, and reduced-motion handling for the new gallery. |
| `images/donk.avif`, `images/eventsfeature.avif`, `images/teams.webp` | Renamed from incorrectly labelled `.jpg` paths so their extensions match their binary formats; all HTML references were updated. |
| `docs/midterm-audit.md` | This Stage 1 record appended to the Stage 0 audit. |

### Requirements preserved

- All six original pages, the shared stylesheet, creator comment, semantic headings/paragraphs, ordered and unordered lists, biography section, table, form, footer credits, CSS Grid page areas, Flexbox responsive player cards, Bootstrap navbar, Bootstrap cards, Bootstrap carousel, responsive breakpoints, and relative paths remain present.
- The nine-image Bootstrap carousel remains functional and the separate CSS Grid gallery now exists alongside it, so the Assignment 2 gallery requirement and Assignment 3 carousel requirement are both represented.
- No framework, backend, build system, or unnecessary JavaScript was added.

### Stage 1 checks and remaining issues

Checks completed:

- Re-read this audit, inspected the current changed files, and opened all six HTML pages plus `css/style.css` before editing.
- Re-checked Stage 0 image signatures, self-link patterns, carousel controls, gallery selectors, and the presence of the static audit.
- Ran a static navigation/fragment checker across every local `href`, `src`, and form action. It found zero missing targets, zero duplicate IDs, six consistent primary-nav link sets, and exactly one active `aria-current="page"` item per page.
- Ran `npx --yes html-validate@8.24.0 index.html events.html teams.html players.html rankings.html contact.html`; it exits successfully after the Stage 1 markup cleanup.
- Served the checkout with `python -m http.server 8765`; the root and all six HTML pages returned `200 text/html`. The renamed AVIF files returned `image/avif`; the local Python server returned `application/octet-stream` for WebP, so Pages MIME behavior should still be verified after deployment.
- No push was performed. The public GitHub Pages deployment will remain unchanged until the user publishes these working-tree changes.

Remaining issues:

- Event filter controls are intentionally prototype-only and do not filter data without backend/JavaScript behavior.
- The contact form remains `mailto:`-based and depends on the visitor’s configured email application; there is no server-side delivery.
- The ranking table, event calendar, team profiles and player profiles are illustrative sample content, not live data or verified recruitment/results feeds.
- Image source/license provenance is still not recorded in the repository.
- A full visual, viewport-by-viewport browser regression, automated contrast check, and assistive-technology walkthrough remain future verification work.

## Stage 2 completed

**Completed:** 2026-10-07

### Verification before the foundation pass

- Re-read this audit and the complete Stage 1 section before editing.
- Inspected the working-tree diff and opened `index.html`, `events.html`, `teams.html`, `players.html`, `rankings.html`, `contact.html`, and `css/style.css`.
- Re-checked the Stage 1 product flow and anchors: Home discovery (`#how-it-works`, `#upcoming-events`, `#featured-players`), event discovery (`#event-filters`, `#event-list`), team/player directories, sample rankings, and Community/Contact support paths.
- Ran a local relative-path and fragment check before editing. It found zero missing local files, zero missing fragments, zero fake `href="#"` links, six primary navigation links per page, and one active `aria-current="page"` item per page.

### Information-architecture and semantic decisions

- Kept the Stage 1 flow intact: discover people and teams, find events, understand how sample results could inform rankings, then use Community/Contact for questions, organizers, partnerships, feedback, or problem reports.
- Preserved the CSS Grid sidebar as page-specific quick links rather than a second primary navbar. The sidebar blocks now appear after `<main>` in source order, so every document begins with its page-level `<h1>` while CSS Grid keeps the same visual sidebar placement.
- Preserved the shared Bootstrap navbar, custom external stylesheet, page-specific anchors, semantic event/team/player articles, Bootstrap cards and carousel, CSS Grid gallery, table, lists, biography content, and static contact form.

### Assignment 1 status matrix

| Assignment 1 item | Status | Actual implementation |
| --- | --- | --- |
| HTML5 doctype, language, charset, viewport, descriptive title | **Present** | All six page heads; examples: [index.html](../index.html), [events.html](../events.html), [contact.html](../contact.html). |
| Accurate project/team credit comment | **Present** | `<!-- Created by Damir, Alina and Aisha -->` in each page head. |
| Logical h1-h3 hierarchy and readable paragraphs | **Present** | Each page has one leading `<h1>` followed by ordered `<h2>`/`<h3>` sections; examples: [players.html](../players.html#player-directory) and [rankings.html](../rankings.html#ranking-table). |
| Meaningful local image with useful alt text on every page | **Present** | Hero/feature images in [index.html](../index.html), [events.html](../events.html), [teams.html](../teams.html), [players.html](../players.html), [rankings.html](../rankings.html), and [contact.html](../contact.html#team), all with local paths, dimensions, and descriptive `alt`. |
| Shared global navigation connecting all six pages | **Present** | Identical six-item Bootstrap navbar in all pages; active link uses `.active` and `aria-current="page"`. |
| Shared external `css/style.css` link | **Present** | `<link href="css/style.css" rel="stylesheet">` in all six heads. |
| Footer containing Damir, Alina, and Aisha | **Present** | Shared `.footer-nav`/footer structure in all six pages; team credit is visible in each footer. |
| Relative paths compatible with GitHub Pages | **Partial** | All local `href`, `src`, stylesheet, image, and fragment targets pass the repository-relative checker, and the local static server serves all six pages. **Remaining deployment issue:** these working-tree changes have not been pushed, so the public Pages deployment still represents the previous published revision. |
| Meaningful ordered and unordered lists | **Present** | Ordered event-following steps in [events.html#event-guidance](../events.html#event-guidance); unordered product-flow/support lists in [index.html#how-it-works](../index.html#how-it-works) and [contact.html#contact-options](../contact.html#contact-options). |
| Table with headers, rows, and at least three data columns | **Present** | Sample ranking table in [rankings.html#ranking-table](../rankings.html#ranking-table), with `<thead>`/`<th>`, `<tbody>`/`<tr>`, and four data columns. |
| Responsive community form with required control types | **Present** | [contact.html#contact-form](../contact.html#contact-form) contains labelled name text, email, topic dropdown, textarea, native required validation, and submit button. Bootstrap grid classes provide responsive layout. |
| Honest static form behavior | **Present** | The form visibly explains that submission opens a prepared email draft through `mailto:`; it makes no server-storage or delivery claim. |
| Team-member biography/About section | **Present** | [contact.html#team](../contact.html#team) contains the Damir, Alina, and Aisha biography content and circular team profile image. |
| Working links and visible hover states | **Present** | Local link/fragment checks pass; reusable link hover rules are in [`css/style.css`](../css/style.css), including `.sidebar a:hover`, `.footer-nav a:hover`, card/tile/event hover states, and Bootstrap button hover variables. |
| Element, class, ID, and descendant CSS selectors | **Present** | [`css/style.css`](../css/style.css) includes element selectors (`body`, `p`, `table`), reusable classes, unique `#contact-form`, and descendant selectors such as `.sidebar a`, `.footer-nav a`, and `.table-wrap table`. |
| Readable external CSS, box model, responsive units, palette, and typography | **Present** | [`css/style.css`](../css/style.css) retains the custom palette, typography hierarchy, margins, padding, borders, Grid/Flexbox layout, responsive breakpoints, and reduced-motion behavior. |
| Intentional circular profile/feature image | **Present** | [contact.html#team](../contact.html#team) uses `.profile-image`; [`css/style.css`](../css/style.css) keeps `border-radius: 50%` with `object-fit: cover`. |

### Changed files and important components

- `index.html`, `events.html`, `teams.html`, `players.html`, `rankings.html`, `contact.html`: reordered the existing sidebar/main source order for heading semantics, added explicit lazy-loading to below-the-fold images, and retained the same CSS Grid areas and all Stage 1 content/links.
- `docs/midterm-audit.md`: added this Stage 2 verification record and Assignment 1 status matrix.
- The working tree also retains the earlier Stage 1 changes in `css/style.css`, the renamed correctly typed image assets (`images/donk.avif`, `images/eventsfeature.avif`, `images/teams.webp`), and all Stage 1 navigation/anchor work.

### Stage 2 checks and remaining issues

Checks completed after editing:

- Ran the Assignment 1 foundation checker: all required metadata, credit, heading, image/alt, navigation, stylesheet, footer, path, list, table, form, CSS-selector, circular-image, hover, and focus checks passed.
- Ran the local link/asset/fragment checker across all six pages: zero problems.
- Ran `npx --yes html-validate@8.24.0 index.html events.html teams.html players.html rankings.html contact.html`: exit code 0 with no findings after the source-order-only repair.
- Ran `git diff --check`: no whitespace errors.
- Served the checkout with `python -m http.server 8768`; all six pages returned `200 text/html`, and all 36 primary-navigation paths returned `200`.
- Preserved Bootstrap and the custom CSS, CSS Grid areas, Flexbox card examples, Bootstrap cards/navbar/carousel, table, form, lists, biography, and responsive structures.

Remaining issues:

- The event filters remain clearly labelled prototype controls without backend filtering.
- The contact form remains `mailto:`-based and depends on the visitor's configured email application.
- Rankings, events, teams, and player profiles remain illustrative sample content rather than live feeds.
- Image source/license provenance and a full visual multi-viewport/assistive-technology walkthrough are still not recorded in the repository.
- The corrected working-tree paths need a future GitHub Pages publish to verify the hosted deployment itself; no push was performed in this stage.

## Stage 3 completed

**Completed:** 2026-10-07

### Verification before the Assignment 2 pass

- Re-read this audit through the Stage 2 section and inspected all six pages, `css/style.css`, and every current gallery/card asset. The Stage 1 discovery flow and Stage 2 Assignment 1 foundations remain present.
- Re-checked the local page/asset/fragment navigation model and confirmed that the shared six-link navbar, active-page state, contextual sidebars, product anchors, form, table, lists, biography, and footers are still in place.
- Used a fresh local static-server origin and browser viewport checks at 1440×900, 768×900, 375×812, and 320×800 to avoid stale CSS cache results. The layout had no document-level horizontal overflow at those sizes.

### Assignment 2 implementation

- **Flexbox navigation:** Every page keeps `<nav class="navbar navbar-expand-lg">`, the `.navbar-brand` logo, `.navbar-collapse`, and `.navbar-nav ms-auto` markup. Bootstrap supplies the explainable Flexbox navbar alignment, while [`css/style.css`](../css/style.css) themes `.navbar`, `.navbar .nav-link`, `.navbar .nav-link.active`, and `.navbar-toggler`. Desktop metrics show the six links in the expanded row; tablet/mobile metrics show the toggler and collapsed menu. `aria-current="page"`, focus-visible outlines, and the active underline remain present.
- **CSS-only Flexbox card group:** [players.html#player-directory](../players.html#player-directory) contains the separate `.players-container` / `.player-card` group with three image/title/text/action cards. [`css/style.css`](../css/style.css) uses `display: flex`, wrapping, `gap: 20px`, `align-items: stretch`, equal `min-height: 470px`, and a transform/shadow hover effect. The reduced-motion block disables the transform and transitions. This remains separate from the Bootstrap `.card` group on Home.
- **Named Grid page layout:** `.page-layout` in [`css/style.css`](../css/style.css) keeps the named areas `"header header" "sidebar main" "footer footer"`; `.grid-header`, `.sidebar`, `.grid-main`, and `.grid-footer` map to those areas. At `max-width: 991.98px`, the areas intentionally become `"header" "sidebar" "main" "footer"`, placing contextual links above the main content on smaller screens and keeping the footer spanning the page.
- **Sidebar behavior:** Each page retains a useful contextual `<aside class="sidebar">` with page-specific discovery links, not a duplicated primary navbar. The desktop sidebar is the 220px left column; tablet/mobile rules remove its right border, add a bottom border, and wrap its links with Flexbox.
- **CSS Grid gallery:** [players.html#player-gallery](../players.html#player-gallery) contains exactly nine `.gallery-card` figures inside `.gallery-grid`. [`css/style.css`](../css/style.css) uses `repeat(3, minmax(0, 1fr))`, `gap: 18px`, then two columns at `max-width: 991.98px` and one column at `max-width: 575.98px`. Captions remain visible in normal flow, so hover scaling does not hide essential information from keyboard users. The original nine-image Bootstrap carousel remains below the Grid gallery for Assignment 3.
- **Intentional crops:** CSS comments document the fixed 220px player-card media area, 16:10 gallery cells, fixed carousel slide window, and Bootstrap card image area as intentional component crops. These rules are not applied as a blanket image fix; the rankings image and profile image keep their distinct sizing rules.

### Responsive check results

| Viewport | Page Grid | Navigation | Flexbox cards | CSS Grid gallery | Overflow |
| ---: | --- | --- | --- | --- | --- |
| 1440×900 | `header header` / `sidebar main` / `footer footer` | Expanded six-link row | Three equal 470px cards | 3 columns, 18px gap, 9 figures | None |
| 768×900 | One-column named areas | Collapsed toggler | Two columns, equal heights | 2 columns, 18px gap, 9 figures | None |
| 375×812 | One-column named areas | Collapsed toggler | One column, equal 470px cards | 1 column, 18px gap, 9 figures | None |
| 320×800 | One-column named areas | Collapsed toggler | One column, equal 470px cards | 1 column, 18px gap, 9 figures | None |

The mobile toggler was activated in the browser and exposed all six primary links with `aria-expanded="true"`. Desktop, tablet, and mobile screenshots were also inspected on the Players page to verify the visible sidebar, header, card rows, and responsive collapse.

### Stage 3 checks and remaining issues

Checks completed after editing:

- Re-ran the local navigation/asset/fragment checks across all six pages; no missing targets or fake links were found.
- Re-ran `npx --yes html-validate@8.24.0 index.html events.html teams.html players.html rankings.html contact.html`; exit code 0.
- Re-ran the foundation/product-flow checks: all six pages retain valid Assignment 1 structure, shared navigation, Stage 1 anchors, Bootstrap components, and the static-site form behavior.
- Served the final checkout from a fresh local static-server port and checked all six HTML pages plus every primary-navigation destination with HTTP 200 responses.
- Ran `git diff --check`; no whitespace errors were reported.

Remaining issues:

- The event filter controls and contact form remain intentionally frontend-only prototype affordances (`mailto:` for contact); no backend was added.
- The nine-image Bootstrap carousel now uses the local Bootstrap 5.3.8 JavaScript bundle; Bootstrap CSS remains an external 5.3.8 CDN dependency, while the CSS Grid gallery is the local Assignment 2 implementation.
- Image source/license provenance, deployed GitHub Pages verification of the unpushed working tree, and a full automated contrast/assistive-technology audit remain outstanding.

## Stage 4 completed

**Completed:** 2026-10-07

### Verification before the Assignment 3 pass

- Re-read the Stage 1, Stage 2, and Stage 3 records and inspected all six page files, [`css/style.css`](../css/style.css), and the gallery/card image assets. The Assignment 1 foundations, product flow, named Grid layout, CSS-only Flexbox cards, CSS Grid gallery, table, form, biographies, and lists remain present.
- Confirmed that every page keeps the same Bootstrap 5.3.8 CSS reference and now uses the same local `js/bootstrap.bundle.min.js` asset. The local bundle is the exact Bootstrap v5.3.8 bundle previously verified against the jsDelivr SRI hash, so the static preview does not depend on external JavaScript execution.
- Re-ran the internal path/fragment check before editing and after the bundle-path change; there were no missing local files, anchors, or fake `href="#"` actions.

### Assignment 3 implementation

- **Media queries and CSS-only cards:** [`css/style.css`](../css/style.css) uses the readable `991.98px`, `767.98px`, and `575.98px` breakpoints for typography, sidebar/page-layout behavior, gallery tracks, and the custom [players.html#player-directory](../players.html#player-directory) `.players-container`. The `.player-card` group stays custom Flexbox: three cards per row on desktop, two on tablet, and one on mobile, with equal height, gap, and reduced-motion-aware hover styling. It remains separate from the Bootstrap cards.
- **Bootstrap Grid and spacing:** The Home hero at [index.html#how-it-works](../index.html#how-it-works) keeps `.container`, `.row`, `.col-sm-12 col-md-6 col-lg-6`, and the three-column `.col-sm-12 col-md-6 col-lg-4` step/cards sections. The same responsive two-column pattern appears in the Events, Teams, Players, Rankings, and Contact sections. Responsive utilities such as `mt-lg-4`, `px-sm-2`, `py-4`, `py-lg-5`, `p-md-4`, and `gap-3` provide major spacing without replacing the custom Grid/Flexbox examples.
- **Bootstrap navbar (historical Stage 4):** All six pages kept the semantic `.navbar.navbar-expand-lg`, six working links, `.navbar-toggler`, `aria-controls="mainNavigation"`, `aria-expanded`, `data-bs-toggle="collapse"`, and visible active-page state. The then-local `js/bootstrap.bundle.min.js` supplied collapse behavior; this bundle was later removed for the HTML/CSS-only handoff.
- **Bootstrap buttons:** [index.html](../index.html) uses the `btn-primary btn-lg` hero action; [rankings.html#ranking-context](../rankings.html#ranking-context) keeps the related-controls `.btn-group` with secondary and outline variants. Actions lead to real page sections or anchors rather than fake links.
- **Bootstrap carousel:** [players.html#player-gallery](../players.html#player-gallery) retains `#esportsCarousel` with nine unique `.carousel-item` slides, nine indicators, accessible previous/next buttons, captions, `aria-roledescription="carousel"`, and `data-bs-interval="false"`. The carousel is inside Bootstrap responsive columns and does not autoplay. Its fixed slide window is documented in the CSS as an intentional component crop.
- **Bootstrap cards:** [index.html#featured-players](../index.html#featured-players) keeps three `.card` components in a responsive `.row`, each with a local image, title, description, equal-height `h-100` behavior, and actions to `players.html#donk`, `players.html#monesy`, or `players.html#faker`. Their image crop is documented as component-specific and does not alter the separate Flexbox card group.
- **Bootstrap form:** [contact.html#contact-form](../contact.html#contact-form) keeps the original name text input, email input inside `.input-group`, required topic `.form-select`, required `.form-control` textarea, submit button, associated `.form-label` elements, native validation attributes, and responsive `.col-12 col-md-6` layout. The visible help text explains that `mailto:` opens a prepared email draft; no server storage is claimed.
- **Accessibility and contrast:** Semantic header/nav/main/aside/footer landmarks, page-specific `aria-current`, control labels, table headers, useful image alt text, carousel labels, keyboard-visible focus outlines, readable theme colors, and the `prefers-reduced-motion` block remain in place. No autoplay or unnecessary JavaScript was added.

### Stage 4 responsive and interaction checks

| Check | Result |
| --- | --- |
| Six pages at 1440×900, 768×900, and 375×812 | All loaded with the local bundle, one active nav link, six nav links, footer, expected named Grid areas, and no horizontal overflow. |
| CSS-only Flexbox cards | Players page measured three equal cards at desktop, two columns at tablet, and one column at mobile; all cards remained 470px high. |
| CSS Grid gallery | Players page kept nine images with 3/2/1 columns at desktop/tablet/mobile. |
| Bootstrap navbar | Mobile toggler changed `aria-expanded` from `false` to `true` and exposed all six links. |
| Bootstrap carousel | Players next control advanced the active slide and indicator from 1 to 2; captions/controls remained available and autoplay stayed disabled. |
| Contact form | Empty required fields matched `:invalid`; filling name, email, topic, and message matched valid without submitting the `mailto:` action. |
| Internal paths | All local href/src paths and fragment targets across all six pages resolved; no `href="#"` placeholders were found. |

### Stage 4 files and remaining issues

- **Changed:** `index.html`, `events.html`, `teams.html`, `players.html`, `rankings.html`, and `contact.html` now point to the shared local Bootstrap 5.3.8 bundle; `js/bootstrap.bundle.min.js` was added; this audit was updated.
- **Preserved:** `css/style.css`, the custom CSS selector examples, named CSS Grid layout, custom Flexbox card row, CSS Grid gallery, Bootstrap Grid/navbar/cards/carousel/form, Assignment 1 structures, product IA, and all six page filenames remain intact.
- **Remaining:** event filters are still honest frontend-only prototype controls; the contact form remains `mailto:`-based; rankings/events/teams/player data is illustrative sample content; Bootstrap CSS still comes from the 5.3.8 CDN; image provenance, deployed GitHub Pages verification, and a full automated contrast/assistive-technology audit remain outstanding. No push or backend work was performed.

## Stage 5 completed

**Completed:** 2026-10-07

### Verification before the image pass

- Re-read the Stage 4 section and confirmed that the six pages, shared product flow, Bootstrap components, custom Flexbox cards, named CSS Grid layout, CSS Grid gallery, table, form, lists, biographies, and local Bootstrap JavaScript remain present.
- Inspected every `<img>` element and every image-related rule in [`css/style.css`](../css/style.css). The previous implementation used fixed heights and `object-fit: cover` on normal hero/feature images as well as on the bounded card/gallery/carousel components. Browser measurements confirmed repeated aspect-ratio mismatches before this pass.
- Inspected the local assets. The current set is usable and already has corrected extensions for `images/donk.avif`, `images/eventsfeature.avif`, and `images/teams.webp`; no new or replacement third-party asset was needed for this stage.

### Image behavior decisions and implementation

- **Normal responsive images:** the global `img` rule in [`css/style.css`](../css/style.css) sets `display: block`, `max-width: 100%`, and `height: auto`. The Home hero (`index.html .hero-image img`) and feature images on Events, Teams, Players, Rankings, and Community/Contact use intrinsic sizing; the corresponding HTML images use Bootstrap `.img-fluid` where appropriate. `.feature-image` and `.ranking-image` no longer force a fixed height or `object-fit` crop, so the lower-resolution `images/players.jpg` is not enlarged beyond its natural content size.
- **CSS-only player cards:** [players.html#player-directory](../players.html#player-directory) now wraps each image in `.player-card-media`, with `aspect-ratio: 4 / 3`, `overflow: hidden`, and a child image using `object-fit: cover`. The crop is intentional for equal-height Flexbox card media and is separate from the normal feature image.
- **Bootstrap cards:** [index.html#featured-players](../index.html#featured-players) now uses `.bootstrap-card-media` wrappers with the same deliberate 4:3 crop. `.card-img-top` is no longer assigned a global fixed height.
- **CSS Grid gallery:** [players.html#player-gallery](../players.html#player-gallery) keeps all nine images and now places each inside `.gallery-media`, a 16:10 aspect-ratio/overflow wrapper. Captions remain outside the crop and visible in normal flow.
- **Bootstrap carousel:** [players.html#esportsCarousel](../players.html#esportsCarousel) keeps all nine slides and wraps each slide image in `.carousel-media`, a 16:9 aspect-ratio/overflow media area. The carousel crop is intentional and no longer relies on a fixed pixel height.
- **Circular profile image:** [contact.html#team](../contact.html#team) now uses `.profile-avatar` as a square 1:1 overflow wrapper with `border-radius: 50%`; `.profile-image` fills the wrapper with `object-fit: cover` without stretching the 204×192 source into a non-square image.
- **Crop scope:** `object-fit: cover` remains only in the named intentional crop wrappers: `.player-card-media img`, `.bootstrap-card-media .card-img-top`, `.gallery-media img`, `.carousel-media img`, and `.profile-avatar .profile-image`. Normal content images do not use it.

### Assets and credit status

- Preserved all existing local images and corrected-format filenames from earlier stages; no new or replaced third-party asset was introduced in Stage 5.
- Because no asset was added or replaced, no new Image Credits section was invented in `README.md`. Existing image provenance/license information remains unknown and should be documented if a future stage replaces any asset.
- Updated [`README.md`](../README.md) only to keep the Bootstrap CSS/locally vendored JavaScript dependency description accurate; this was not an asset replacement.

### Stage 5 viewport checks

The local static site was checked at 1440px, 1200px, 992px, 768px, 576px, 375px, and 320px across all six pages. Normal image content-box ratios matched their intrinsic ratios; intentional crop images filled their declared wrappers; no image exceeded its containing block; no document-level horizontal overflow remained after the feature/ranking image corrections; and all images loaded when the page was scrolled through for the lazy-image check. The custom player-card media remained visually consistent, while the `players.jpg` feature image stayed at natural resolution instead of being enlarged to fill a large column.

### Stage 5 checks and remaining risks

- Re-ran the local path/fragment and asset checks after adding the media wrappers; the six-page IA, primary navigation, gallery count, carousel count, form, table, lists, and Bootstrap components remain present.
- Re-ran the HTML validator and whitespace check after editing the six pages, shared CSS, README, and this audit.
- Browser-tested normal and intentional-crop image geometry at all seven requested viewport widths, including lazy-loaded below-fold images and the existing CSS-only card/Grid/Bootstrap layout behavior.

Remaining risks:

- Existing image provenance/license records are still incomplete because those assets predate Stage 5 and were not replaced.
- Bootstrap CSS remains a 5.3.8 CDN dependency; the JavaScript bundle is local.
- Events, rankings, teams, and player content remains illustrative sample data, and the contact form remains a static `mailto:` prototype.
- The corrected working tree still needs a future GitHub Pages publish for hosted deployment verification; no push was performed.

## Stage 6 completed

**Completed:** 2026-10-07

### Product behavior and page flow

- **Home** ([`index.html`](../index.html)) now states the product value proposition in the hero, links to [`events.html#event-filters`](../events.html#event-filters), previews the sample calendar at [`index.html#upcoming-events`](../index.html#upcoming-events), and keeps three Bootstrap player cards in [`index.html#featured-players`](../index.html#featured-players). The `#how-it-works` links connect discovery to events, teams, and sample rankings; the player cards connect into `players.html#donk`, `#monesy`, and `#faker`.
- **Events** ([`events.html`](../events.html)) is organized around “Find your next competition.” The controls in [`#event-filters`](../events.html#event-filters) are explicitly labelled prototype controls. [`#event-list`](../events.html#event-list) contains a featured tournament plus upcoming/completed sample cards with status, game, date, location, format/team-size metadata, and actions into teams, players, rankings, or the static contact form. [`#event-guidance`](../events.html#event-guidance) preserves the ordered three-step participation flow: find a tournament, check requirements, and register through the organizer’s stated process.
- **Teams** ([`teams.html`](../teams.html)) keeps browse-by-game team anchors in [`#team-directory`](../teams.html#team-directory), a featured Team Spirit path, and adds [`#community-teams`](../teams.html#community-teams) with fictional community-team/looking-for-players concepts. The visible disclaimer explains that these are not verified organizations or live recruitment listings; actions lead to sample players, events, or the community form.
- **Players** ([`players.html`](../players.html)) keeps the CSS-only Flexbox cards in [`#player-directory`](../players.html#player-directory), now with nickname, game, role, region/status metadata and explicit sample-profile language. The featured anchors `#donk`, `#monesy`, and `#faker` remain available. The nine-image CSS gallery at [`#player-gallery`](../players.html#player-gallery) and the nine-slide Bootstrap carousel `#esportsCarousel` remain intact.
- **Rankings** ([`rankings.html`](../rankings.html)) now exposes a visible “Demo ranking · sample platform data” note, explains that points illustrate placement/participation/consistency, and keeps the readable four-column table in [`#ranking-table`](../rankings.html#ranking-table). The Bootstrap [`btn-group`](../rankings.html#ranking-context) links Teams, Players, and Events; the table remains internally scrollable through `.table-wrap` at narrow widths.
- **Community / Contact** ([`contact.html`](../contact.html)) now uses the heading “Community & Support” and presents General Question, Tournament Organizer, Partnership, Feedback, and Report a Problem paths in [`#contact-options`](../contact.html#contact-options). [`#contact-form`](../contact.html#contact-form) retains the full accessible Bootstrap form and visibly explains its static `mailto:` behavior. The team biographies remain in [`#team`](../contact.html#team).

The intended journey is: Home → discover an event → compare teams and players → inspect sample ranking context → use Community & Support for organizer questions, feedback, or a future participation request. Each primary nav link remains available from every page, while sidebars provide page-specific shortcuts instead of duplicating the navbar.

### Preserved rubric requirements

- All six original page files, shared external [`css/style.css`](../css/style.css), Bootstrap 5.3.8 navbar/grid/buttons/btn-group/cards/carousel/form, local Bootstrap bundle, four CSS selector types, named CSS Grid areas, Flexbox navigation and CSS-only card row, responsive media queries, CSS Grid gallery, nine-image carousel, table, ordered/unordered lists, biography section, circular profile image, meaningful alt text, active `aria-current="page"`, footer names Damir/Alina/Aisha, and reduced-motion/focus behavior remain present.
- No backend, framework, build step, fake `href="#"`, or new asset was introduced. Existing Stage 5 image-ratio rules and intentional media wrappers were not changed. The sample/demo status labels make illustrative data explicit rather than claiming live results, recruitment, registration, or rankings.

### Stage 6 checks and remaining limitations

- Inspected the current six pages, the shared stylesheet, local assets, README image-credit status, and the Stage 5 image behavior before editing. Existing normal-image `height:auto` rules and named intentional crop wrappers remain present.
- Ran a local static-server link/path check for all six documents, their relative assets, and fragment IDs; no missing local page, asset, or fragment target remained. The only same-document URLs are meaningful section anchors plus conventional brand/active-nav links; no fake `href="#"` placeholder remains.
- Ran `npx --yes html-validate@8.24.0 index.html events.html teams.html players.html rankings.html contact.html` successfully and ran `git diff --check` successfully.
- Browser-tested all six pages at 1440px, 768px, and 375px with no document-level horizontal overflow and exactly one active nav item per page. Tested all 36 primary-nav paths from every page, the mobile navbar open/close transition, the nine-slide carousel (slide 1 → slide 2 with autoplay disabled), the event prototype controls by selecting CS2/Championship and returning to `#event-list`, the internally scrollable 480px ranking table at a 320px viewport, and native required-field validity for the complete contact form without submitting the `mailto:` action. The form intentionally opens a prepared email draft and does not store data server-side.
- Remaining limitations are unchanged: event filters and sample data are frontend-only, Bootstrap CSS still depends on the 5.3.8 CDN, existing image provenance is not documented because no Stage 6 asset was added, and the working tree has not been published to GitHub Pages.

## Stage 7 completed

**Completed:** 2026-10-07

### Previous-stage verification

- Read the audit through Stage 6, inspected the current diff and all six HTML files, and reviewed the shared stylesheet, image rules and README asset-credit status.
- The initial local path/fragment check found no missing pages, images, stylesheets, scripts or fragment IDs. All six pages retained one h1, six primary links, one active `aria-current="page"` link, named landmarks and footer credits.
- Confirmed the three CSS-only Flexbox cards, three Home Bootstrap cards, nine Grid-gallery images, nine carousel slides, four-column ranking table, complete form, ordered/unordered lists, biography and circular avatar. Existing Stage 5 normal-image sizing and intentional crop wrappers remained present.

### Visual and responsive repairs

- [Shared CSS](../css/style.css) now uses a readable system/Segoe UI/Roboto/Arial body stack and inherited control typography. Strong headings retain distinct desktop, tablet and mobile sizes, while paragraphs use comfortable line spacing.
- Normalized card borders to a softer gold, reused a 12px component radius, retained the red/yellow/brown EsportsHub palette, and added consistent page gutters. Team cards now keep their labels, descriptions and actions in a predictable vertical anatomy.
- Scoped tile rules to `.game-list > a` and `.game-list > .team-tile`, so nested Bootstrap buttons keep Bootstrap as their source of styling. Removed the special nested-button overrides, duplicate typography declarations, redundant rankings-image rule and scattered duplicate breakpoint blocks.
- Consolidated responsive rules at `1199.98px`, `991.98px`, `767.98px` and `575.98px`. Tiles change to two columns below 1200px; the required custom Flexbox cards still use three columns at 992px and above, two at 768–991px, and one below 768px.
- Buttons, navbar controls, form controls and event action links have a 44px minimum height. Related ranking controls wrap within the existing Bootstrap button group. [Event prototype controls](../events.html#event-filters) place their Preview button on a separate row below 1200px, avoiding a cramped two-column content area.
- [Carousel](../players.html#esportsCarousel) captions now remain in normal flow beneath the intentional 16:9 media crop. Previous/next controls and the wrapping indicator group occupy their own row. Controls are 44×44px; indicators are 24×44px. No caption/control overlap was found at any requested width.
- Corrected player and ranking shortcuts to their actual profile/team IDs. Replaced the shortcut that promised a missing player profile with the existing community-team discovery path. Home now previews an upcoming Dota event instead of the completed sample finals; the completed event uses a September sample date. Decorative event arrows are hidden from assistive technology.

### Seven-width browser results

All six pages were scrolled through, measured and captured at every width below: **42 page/viewport combinations**. The full-page captures were inspected individually or in six-page comparison sheets.

| Width | Navbar / sidebar | CSS-only player cards | Grid gallery | Result across all six pages |
| ---: | --- | --- | --- | --- |
| 1440px | Expanded / left 220px column | 3 columns | 3 columns | No page overflow, clipped text, overlapping sections or squeezed normal images |
| 1200px | Expanded / left column | 3 columns | 3 columns | Passed; cards and controls fit the main column |
| 992px | Expanded / left column | 3 columns | 3 columns | Passed at the exact Bootstrap lg boundary; tiles use 2 columns |
| 768px | Collapsed / contextual links above main | 2 columns | 2 columns | Passed at the exact md boundary |
| 576px | Collapsed / contextual links above main | 1 column | 2 columns | Passed; filters, feature sections and form fields stack |
| 375px | Collapsed / wrapping quick links | 1 column | 1 column | Passed; buttons, captions and footer remain readable |
| 320px | Collapsed / wrapping quick links | 1 column | 1 column | Passed; table overflow stays inside its labeled region |

Normal hero/feature image content ratios matched their intrinsic ratios at every width. Cover crops remain limited to the named player-card, Bootstrap-card, gallery, carousel and square-avatar media wrappers. Gallery and carousel counts stayed at nine each. No image asset was added or replaced.

### Accessibility and interaction checks

- Retained semantic header/nav/main/aside/footer landmarks, informative local-image alt text and one meaningful h1 on every page. Added section headings where a label alone did not identify the content; no forward heading-level skips remain.
- Activated the skip link with Enter on all six pages: every test updated the fragment to `#main-content` and moved keyboard focus to the main landmark. Its first-Tab visibility and 44px target were verified.
- Fixed a real Bootstrap specificity conflict: generic element `:focus-visible` rules lost to Bootstrap control rules. Explicit `.btn`, `.nav-link`, `.navbar-toggler`, `.form-control` and `.form-select` focus selectors now restore the visible outline. Tab tests confirmed outlines on form controls, submit buttons and the table region; footer/carousel focus uses a gold outline against the dark background.
- Keyboard-opened and closed the mobile navbar on every page. `aria-expanded` changed false → true → false, `aria-controls` matched the existing collapse target, and all six links were available. Click-tested **all 36 primary navigation paths** from their actual source page with the correct active destination.
- Checked rendered text/background color pairs on every page, including the cream end of the hero gradient. All measured normal-text pairs met 4.5:1; the lowest measured default-state ratio was approximately **4.66:1**. Statuses retain visible words, the active navbar retains an underline, and the active carousel indicator retains an outline.
- [Community form](../contact.html#contact-form) now has a named heading, visible required-field instructions, associated email/message guidance and matching visible/accessibility names for support paths. Empty submission was blocked and focused Name; an invalid email was blocked and focused Email with `typeMismatch=true`; completed sample inputs passed native validity. A valid mailto submission was not sent.
- [Ranking table](../rankings.html#ranking-method) retains four column headers, row headers, caption, wrapper name, keyboard focus and explanatory scroll instructions. Arrow keys changed the wrapper's horizontal scroll position without creating page overflow.
- Carousel tests covered indicators, Next, keyboard ArrowLeft and matching active-slide/`aria-current` updates, including slide 9 → 8 → 9 at 320px. Captions, controls and indicators remained separate; autoplay stayed disabled.
- Reviewed the `prefers-reduced-motion` block: it disables custom hover transforms and all transitions, including Bootstrap carousel/collapse transitions. The system preference was not changed or emulated during the browser checks.
- Final local markup/path/ARIA-reference checks reported no missing targets or duplicate IDs. The cached **html-validate 8.24.0** CLI validated all six pages with exit code 0. `git diff --check` passed.

### Changed files, preserved requirements and remaining risks

**Edited in Stage 7:** `index.html`, `events.html`, `teams.html`, `players.html`, `rankings.html`, `contact.html`, `css/style.css` and this audit. QA scripts and screenshot comparison sheets were generated outside the repository for verification; no runtime JavaScript, framework or build step was added.

All Assignment 1–3 demonstrations remain: metadata/credits, headings, lists, table, accessible static form, biographies, footer names, four selector types, circular image, external CSS, Flexbox navigation and 3/2/1 cards, named Grid areas/sidebar, nine-image Grid gallery, media queries, Bootstrap Grid/spacing/navbar/buttons/button group/cards/carousel/form, focus and reduced-motion rules.

Remaining limits:

- Bootstrap 5.3.8 CSS still loads from the CDN; its JavaScript bundle is local.
- Events, profiles and rankings remain sample content; filters remain a labeled prototype and contact depends on a configured email application.
- Existing image licensing/provenance remains incomplete. No third-party image was introduced in this stage.
- Verification used the available Chromium browser. A dedicated screen-reader walkthrough, other browser engines and runtime OS reduced-motion testing remain unperformed; the contrast measurements do not cover text baked into image assets.
- GitHub Pages deployment verification awaits publication of the working tree. No push or deployment was performed.

## Stage 8 completed

**Completed:** 2026-10-07

### Verification and README handoff

- Read this audit through Stage 7, inspected the final checkout and verified the six HTML pages, shared CSS, all eleven images and the only JavaScript file. No package manifest, backend, application framework, custom JavaScript or build configuration is present.
- The foundation/path checker and HTML validator passed before editing. The six pages retain their metadata, headings, named landmarks, six-link navigation, active `aria-current`, footer credits, lists, four-column table, complete form, biography, circular avatar, custom Flexbox cards, named Grid layout/sidebar, nine-image Grid gallery and nine-slide Bootstrap carousel.
- [README.md](../README.md) now presents the EsportsHub Midterm Project, its product flow and static scope, actual technologies, six page purposes and Damir/Alina/Aisha ownership. It explains preserved Assignment 1–3 concepts, exact responsive ranges, local preview, dependencies, static contact behavior and the expected Pages URL.
- Added an **Image Credits** section without invented attribution. Decoding and SHA-256 comparisons confirmed that all eleven current assets have the same bytes as the original committed images; three have corrected AVIF/WebP filenames. No new or replacement third-party image exists to credit. Existing source/license records remain unresolved.
- [`.nojekyll`](../.nojekyll) is a zero-byte root marker for direct static publishing from a branch. It disables Jekyll processing without adding a build step. This follows [GitHub's static-site guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#static-site-generators).
- Removed only the trailing `sourceMappingURL=bootstrap.bundle.min.js.map` comment from the then-local Bootstrap bundle, because that optional map was absent. Its executable content and MIT banner were unchanged in Stage 8; the bundle was subsequently removed for the HTML/CSS-only handoff.

### Deployment/readiness checks

| Check | Result |
| --- | --- |
| Entry point | `index.html` exists at the repository root; the project-prefix HTTP root served it successfully |
| Internal navigation | All six pages use relative page/fragment URLs; all 36 primary navigation references resolve |
| Local resources | `css/style.css`, eleven images and `js/bootstrap.bundle.min.js` exist with valid case-sensitive relative paths |
| Runtime portability | No localhost URL, file URI, drive path or root-absolute project asset reference was found in the website markup; CSS has no imports or local URL dependency |
| Dependencies | All six pages use the same Bootstrap 5.3.8 CSS URL and local 5.3.8 JavaScript bundle |
| CDN verification | Both versioned jsDelivr resources returned HTTP 200; CSS SHA-384 matched the SRI attribute on all six pages; JavaScript executable content matched the official bundle after excluding the optional map comment |
| Static hosting | The checkout can be served from `main` → `/(root)` with no backend, installation or project build command; the source-folder setting itself was not confirmed remotely |
| Contact / filters | Mailto opens a draft in a configured email client; the calendar controls remain labeled prototype affordances |
| Preservation | All six HTML files, shared CSS and eleven images are byte-identical to the verified Stage 7 handoff; only documentation, the static marker and optional JS debug comment changed |

Local preview addresses in README instructions and historical audit paths are documentation, not runtime website dependencies. The QA scripts and screenshots remain outside the repository.

### Live GitHub Pages and remote state

- The web-reading tool could not access the Pages URL, so a separate direct HTTPS GET check was used. On **2026-10-07**, [the expected root](https://drissakov.github.io/EsportsHub/) and all six HTML URLs returned **HTTP 200**. The published stylesheet also returned 200.
- These responses verify reachability of the existing deployment, **not publication of the local Midterm changes**. All six published HTML bodies and the stylesheet differ from this checkout. The public URLs for `js/bootstrap.bundle.min.js`, `images/donk.avif`, `images/eventsfeature.avif` and `images/teams.webp` returned **404**; those files exist and pass checks locally.
- Public [repository metadata](https://api.github.com/repos/drissakov/EsportsHub) confirms `default_branch=main` and `has_pages=true`. The latest public [deployment record](https://api.github.com/repos/drissakov/EsportsHub/deployments?per_page=1) identifies `ref=main`, environment `github-pages`, commit `f7e6bd6291c354458f7581db2cc57bcb4318260c`, created on 2026-09-28. That is the local base commit before the uncommitted Midterm improvements.
- The unauthenticated Pages-settings endpoint returned 404. The exact publishing folder could therefore not be verified; it is recorded as unconfirmed rather than assumed. No settings, remote files or deployments were changed, and no push was performed.

### Final repository file tree

The following tree contains **22 files**, excluding Git internals:

```text
EsportsHub/
├── .nojekyll
├── README.md
├── index.html
├── events.html
├── teams.html
├── players.html
├── rankings.html
├── contact.html
├── css/
│   └── style.css
├── docs/
│   └── midterm-audit.md
├── images/
│   ├── contact.jpg
│   ├── donk.avif
│   ├── esports.jpg
│   ├── events.jpg
│   ├── eventsfeature.avif
│   ├── faker.jpg
│   ├── monesy.jpg
│   ├── players.jpg
│   ├── rankings.jpg
│   ├── team.jpg
│   └── teams.webp
└── js/
    └── bootstrap.bundle.min.js
```

### Final smoke test and remaining issues

- Served the checkout temporarily under `/EsportsHub/`, matching the project-site prefix, and fetched the root, six pages, shared stylesheet, local bundle and eleven images: **20 unique HTTP targets, all 200**, with no missing local file or fragment.
- Checked README/audit Markdown paths, duplicate IDs, ARIA references and consistent navigation. Re-ran html-validate 8.24.0 on all six pages, `node --check` on the local bundle and `git diff --check`; all passed.
- Compared the six HTML files, CSS and eleven images against the Stage 7 ZIP: **18 unchanged files**. The only JS difference is the removed optional source-map comment.

**Changed in Stage 8:** `README.md`, `docs/midterm-audit.md`, `js/bootstrap.bundle.min.js` and the new `.nojekyll` marker.

Remaining issues: the local working tree is not published; publication must include the local bundle, renamed image files and marker alongside the page changes. The exact Pages source folder remains unconfirmed. Original image provenance, the CSS CDN dependency, static mailto behavior and the Stage 7 assistive-technology/browser-engine testing limits remain documented. These limitations do not prevent the checked local static site from opening.

## Stage 9 final matrix — testing and repair gate

**Completed:** 2026-10-08. Testing spanned 2026-10-07–08. The following matrix supersedes earlier implementation statuses without erasing their historical findings.

### Verification and repairs before reporting

- Read the audit through Stage 8, inspected the current tree/diff and README, opened all six pages and rechecked the public Pages/CDN/deployment endpoints.
- Found a real Bootstrap conflict: mouse focus reset the active carousel indicator's outline. The more specific `.carousel-indicators [data-bs-target].active` rule now preserves its state; a separate `:focus-visible` rule keeps keyboard focus distinct.
- The player raster was only 275×183 but rendered at 1088×612 on desktop. Replaced its feature/gallery/carousel references with original `images/player-room.svg`. Its text banner was widened after visual inspection and rechecked at every width.
- Replaced the watermarked contact graphic, unrelated team-avatar cartoon and ranking graphic with original `community-support.svg`, `team-avatar.svg` and `demo-ranking.svg`. The ranking illustration uses the same sample values as the accessible table. The old raster files were retained, not deleted.
- Added three individually labeled contribution/biography sections for Damir, Alina and Aisha in [contact.html#team](../contact.html#team), reflecting the requested page ownership.
- Updated README image provenance and added [docs/defense-evidence.md](defense-evidence.md). No new third-party image, framework, backend, build step or runtime JavaScript was introduced.

### Assignment 1 — exact requirements matrix

| Item | Status | Evidence file / selector / section | Note after repair |
| --- | --- | --- | --- |
| HTML boilerplate and descriptive titles | Present | All six HTML heads | Doctype, lang, charset, viewport, credit comment and page-specific titles; browser loads and validator passed |
| Headings and paragraphs | Present | All six `main` elements | One h1 each, logical h2/h3 progression and rendered paragraphs |
| Ordered and unordered lists | Present | [events.html#event-guidance](../events.html#event-guidance); [players.html#player-directory](../players.html#player-directory) | Three participation steps and player metadata lists; other product/support lists remain |
| One image with alt text per page | Present | Hero/feature images on all pages | Every page has a loaded local image and informative alt; new SVGs also have title/desc |
| Global navigation | Present | Shared `nav[aria-label="Main navigation"]` | Six links, active aria-current and 36 successful source-to-destination browser clicks |
| Table with th/tr/td and at least three columns | Present | [rankings.html#ranking-method](../rankings.html#ranking-method) | Four column headers, four rows, scoped row headers and data cells |
| Name/email/choice/textarea/submit form | Present | [contact.html#contact-form](../contact.html#contact-form) | Labels and native required/email validation tested at four widths; mailto behavior is explicit |
| Shared external style.css | Present | All six heads → [css/style.css](../css/style.css) | Separate shared file loaded; Bootstrap CSS remains a deliberate documented CDN dependency |
| Element, class, ID and descendant selectors | Present | `body`, `.player-card`, `#contact-form`, `table td`, `.bio h3` | Four distinct selector types remain in readable custom CSS |
| Typography, palette, links, hover and box model | Present | Shared CSS; hero/cards/forms/footer | Readable font hierarchy, actual hover transforms, padding/margins/borders and measured contrast |
| Circular image | Present | `.profile-avatar` in contact | Square 512×512 original SVG in a 1:1, border-radius:50% wrapper; no stretching |
| Team biographies | Present | `#bio-damir`, `#bio-alina`, `#bio-aisha` | Repaired from the generic group paragraph to three member sections; original paragraph retained |
| All names in every footer | Present | Shared `footer` on all pages | Rendered Damir · Alina · Aisha verified in all 42 layouts |
| GitHub Pages-compatible paths | Present | Relative href/src/action targets; root index and .nojekyll | Local paths, exact filename case and fragments pass; hosted publication is assessed separately below |

### Assignment 2 — exact requirements matrix

| Item | Status | Evidence file / selector / section | Note after repair |
| --- | --- | --- | --- |
| Flexbox navigation | Present | `.navbar > .container`, `.navbar-nav` | Browser computed display:flex and centered alignment; brand/links and collapse work |
| Three-card Flexbox row with equal height, gap and hover | Present | [players.html#player-directory](../players.html#player-directory): `.players-container`, `.player-card` | Three cards, 20px measured gap, equal first-row heights; actual hover moves cards -5px |
| CSS Grid named page areas | Present | `.page-layout` | Computed header/sidebar/main/footer area strings verified at all widths |
| Sidebar and footer placement | Present | `.sidebar`, `.grid-main`, `.grid-footer` | Sidebar left at lg+, above main below lg; footer spans below main; bounding-box checks pass |
| Nine-image CSS Grid gallery with gaps and captions | Present | [players.html#player-gallery](../players.html#player-gallery): `.gallery-grid`, `.gallery-card` | Nine figures, equal responsive tracks, 18px gap and always-visible captions; hover verified |
| Responsive layout | Present | Four custom breakpoint blocks | All six pages pass all seven widths with no page overflow or clipped text |

### Assignment 3 — exact requirements matrix

| Item | Status | Evidence file / selector / section | Note after repair |
| --- | --- | --- | --- |
| Media-query typography | Present | Hero/paragraph rules at 1199.98, 991.98 and 767.98px | Browser measured h1 at 58/48/36px and introductions at 18/17/16px across tested widths |
| CSS-only 3/2/1 responsive card group | Present | `.players-container` / `.player-card` | Measured 3 at 992+, 2 at 768, 1 below 768; no Bootstrap columns in this group |
| Bootstrap container, row, col-lg-6 and col-lg-4 | Present | [index.html](../index.html): hero and `#featured-players` | Actual column/row ratios: 1/2 for two columns, 1/3 for three at lg; responsive wrapping verified |
| Responsive Bootstrap spacing utilities | Present | `py-4 py-lg-5`, `mt-3 mt-lg-4`, `px-sm-2`, `g-4` | Hero padding measures 48px at lg+ and 24px below; row gutters and responsive utilities retained |
| Responsive Bootstrap navbar/toggler | Present | All six headers / `#mainNavigation` | 24 mobile-layout open/close tests; aria-expanded true→false and correct control target |
| Bootstrap buttons and btn-group | Present | Home CTA, card actions, ranking `.btn-group` | Primary/outline/size variants render; CTA, three card actions and all three related controls navigated correctly |
| Nine-image carousel with indicators and controls | Present | [players.html#esportsCarousel](../players.html#esportsCarousel) | 63 slide checks, all nine at all seven widths; Next/Previous wrap at every width; state/focus outline repaired |
| Three Bootstrap cards | Present | [index.html#featured-players](../index.html#featured-players) | Three rendered image/title/text/action cards; h-100/Grid behavior and profile links work |
| Responsive Bootstrap form | Present | [contact.html#contact-form](../contact.html#contact-form) | Associated labels, controls/select/input-group and stacked/responsive columns; native validation tested |
| Semantic/accessibility/contrast checks | Present | Landmarks, skip/focus rules, table/form/carousel labels | Required structural and browser checks pass; not a claim of complete WCAG certification or an unperformed screen-reader test |

### Responsive and image results

| Width | Pages | Navbar / sidebar | Custom cards | Gallery tracks | Result |
| ---: | ---: | --- | ---: | ---: | --- |
| 1440 | 6 | Expanded / left | 3 | 3 | Pass |
| 1200 | 6 | Expanded / left | 3 | 3 | Pass |
| 992 | 6 | Expanded / left | 3 | 3 | Pass at exact lg boundary |
| 768 | 6 | Collapsed / above main | 2 | 2 | Pass at exact md boundary |
| 576 | 6 | Collapsed / above main | 1 | 2 | Pass at exact sm boundary |
| 375 | 6 | Collapsed / above main | 1 | 1 | Pass |
| 320 | 6 | Collapsed / above main | 1 | 1 | Pass; table scroll remains internal |

- **Normal images:** `img`, `.hero-image img`, `.feature-image` use max-width:100% and height:auto. All decoded content ratios matched, with maximum measured ratio difference **0.000077** after subtracting borders. No fixed-height normal image was found.
- **Intentional crops:** `.player-card-media` and `.bootstrap-card-media` use 4:3; `.gallery-media` 16:10; `.carousel-media` 16:9; `.profile-avatar` 1:1. Browser measurements confirmed those shapes, object-fit:cover, loaded images and containment. Cover is not applied to ordinary content.
- Custom Flexbox first-row heights were exactly equal at every multi-card width: approximately 540px at 1440, 510px at 1200, 508px at 992 and 526px at 768. Heights can grow with content; equality is achieved by stretching, not by distorting images.
- Four original SVG files total approximately 7KB. XML structure/IDs and text containment were checked; seven additional player-image follow-ups verified the final banner correction. Original raster files remain available, while the four unsuitable displayed graphics no longer appear in the pages.

### Tests and outcomes

| Test | Result |
| --- | --- |
| Six page loads, titles, h1, active state and footer × seven widths | 42 combinations passed |
| Navbar mobile collapse and aria-controls/expanded | 24 open/close combinations passed |
| Skip link and main focus | 42 Enter/focus checks passed |
| Page Grid, card/Bootstrap column geometry, spacing, controls and text containment | All measured layouts passed; no page-level horizontal overflow or clipped text |
| All nine slides × seven widths | 63 checks passed: loaded image, matching indicator/aria-current, visible caption and no overlap |
| Previous/Next wrap | Both controls passed at every width |
| Global primary navigation | 36 actual source-to-destination clicks passed |
| Product actions | Home Events CTA, event Preview query/anchor, three ranking controls and three Home card profile anchors passed |
| Actual custom hover states | Card transform -5px; gallery transform -4px and image scale 1.04; caption remained visible |
| Required fields / email / valid sample form | Passed at 1440, 768, 375 and 320px; empty submission focused Name, invalid email focused Email, valid data passed without sending a draft |
| Keyboard input/button/table focus | Visible solid outlines passed; table arrow keys moved scrollLeft to 80px at 320px without body overflow |
| Reduced-motion CSS effects | Test-only origin activated the existing reduce block as @media all: hovered card/gallery transforms none, transition durations 0s, carousel still functional with no autoplay |
| Text/background contrast | 501 rendered text pairs passed; minimum normal-text ratio approximately 4.66:1, including the cream hero-gradient bound |
| Local page/asset/fragment/filename-case/Markdown checks | 20 unique runtime HTTP targets all 200; zero missing targets, duplicate HTML IDs or unresolved ARIA references |
| Image inventory | 11 original rasters decoded; four original SVGs parsed and loaded; no executable SVG content |
| HTML / JavaScript / whitespace | html-validate 8.24.0, node --check and git diff --check passed |
| Console health | Fresh six-page HTML/interaction run had no errors or warnings; direct standalone-SVG inspection produced four automation-viewer animation messages despite the SVGs containing no JavaScript, so those are recorded as tool coverage limits rather than project JS failures |
| Visual QA | 42 full-page native captures and seven comparison sheets inspected; final player illustration rechecked at all widths |
| Live hosting | Root and six pages returned HTTP 200 but remain the earlier published revision; local bundle/corrected asset URLs still 404 |

Reduced-motion testing verified the actual CSS block's effects through a lightweight fixture outside the repository. The native operating-system preference was not changed or emulated. Other browser engines and a dedicated screen-reader walkthrough were not performed. The semantic/accessibility matrix is limited to the stated structural, keyboard and contrast checks.

### Midterm rubric assessment

These are evidence-based estimates, not instructor-awarded grades. The local submitted code and actual hosted state are assessed separately.

| Area | Status | Evidence / note | Estimate |
| --- | --- | --- | ---: |
| Responsiveness — target 15/15 | Present | 42 verified layouts, precise image ratios, responsive cards/Grid/forms/table/carousel | 15/15 |
| Hosting/GitHub Pages — target 10/10 | Partial | Local static readiness and live HTTPS routes verified; final revision remains unpublished and source folder unconfirmed | 6/10 |
| Design quality — target 20/20 | Partial | Coherent palette, readable controls, contrast and original sharp graphics; pre-existing raster provenance remains incomplete | 19/20 |
| Feature cohesion/relevance — target 15/15 | Present | Tested discovery → teams/players → events → sample ranking → community paths with honest prototype labels | 15/15 |
| Defense readiness — prepare evidence for 40/40 | Present | Ownership/demo guide, source selectors, matrices, screenshots and interaction records prepared; oral performance is not graded here | Evidence prepared |

**Project estimate: 55/60.** Defense evidence is separate from the 60-point project estimate.

### Actual changed files and remaining issues

- `contact.html`: original community/avatar graphics and three member biographies.
- `players.html`: sharp player-room illustration and matching sample ranking graphic in feature/gallery/carousel references, without changing nine-image counts.
- `rankings.html`: original illustration matching the sample table.
- `css/style.css`: active-indicator mouse-focus conflict fixed, distinct keyboard focus retained, member-heading styling.
- `images/player-room.svg`, `images/community-support.svg`, `images/team-avatar.svg`, `images/demo-ranking.svg`: original project artwork, including the corrected banner bounds.
- `README.md`, `docs/defense-evidence.md`, `docs/midterm-audit.md`: accurate image provenance, defense evidence and this final matrix.

Real unresolved issues:

1. The repaired working tree is not published to GitHub Pages. Exact publishing-folder settings remain unconfirmed. The earlier instruction forbidding pushes/settings changes remains in force; none were performed.
2. Source/license records for pre-existing raster imagery are still absent. No attribution or permission was invented, and no new third-party player photography was introduced.
3. Native OS reduced-motion switching, a dedicated screen-reader walkthrough and other browser engines remain outside the available test coverage.

The labeled calendar prototype, sample data and mailto-only form are intentional frontend scope, not unreported backend failures.

## HTML/CSS-only cleanup — completed 2026-10-08

This section supersedes the earlier Bootstrap JS implementation after the user's explicit request to remove JavaScript and temporary testing artifacts. Historical stages remain as records, not claims that removed files still exist.

### Changes and preserved functionality

- Removed the local Bootstrap bundle, its empty `js/` directory and all six script elements. No inline event handlers, script elements, JavaScript files or unused `data-bs-*` controls remain.
- Kept Bootstrap 5.3.8 **CSS only**, alongside the external custom stylesheet. Grids, spacing, cards, buttons/button group and form styles still work without JavaScript.
- All six headers now use a labeled native checkbox, `#navigation-toggle`, with `aria-controls="mainNavigation"`. Space changes its native checked state; `.nav-menu-toggle:checked ~ .navbar-collapse` shows links below 992px. There is no misleading fixed `aria-expanded` attribute. Desktop links stay expanded and active-page `aria-current` remains correct.
- Replaced the JS carousel with [the nine-slide HTML/CSS carousel](../players.html#esportsCarousel). `.carousel-track` uses native horizontal scrolling and scroll snapping. `#gallery-slide-1` through `#gallery-slide-9` are real targets for numbered and per-slide Previous/Next links, including first/last wrapping. Caption text, position numbers, focus styles and intentional 16:9 media crops remain; no autoplay.
- Fixed two regressions found during testing: the narrow-header brand margin forced the Menu label onto another line; absolute visually-hidden carousel labels escaped the scrolling clip and caused document overflow. A scoped small-screen margin rule and positioned scroll container fix these in CSS.
- Preserved all six product pages, local images, 3/2/1 custom Flexbox cards, named page Grid/sidebar/footer, nine-image Grid gallery, Bootstrap CSS examples, table, native-validation form, lists, circular avatar and three biographies.
- Removed eight temporary Python scripts, Stage 7/9 evidence/screenshots/sheets folders, old output snapshots, three stage ZIPs, six output screenshots and the redundant Stage 7 report. These generated artifacts were permanently removed, not moved to Trash. No screenshot, test script, JSON evidence or archive is included in the clean handoff.
- Updated README and the defense guide to describe the current stack accurately. Original project image assets and Markdown documentation remain; they are not executable code.

### Rechecks after editing

| Check | Result |
| --- | --- |
| Six pages at 1440, 1200, 992, 768, 576, 375 and 320px | 42 combinations passed: one h1, six primary links, correct active state/footer/Grid and no document horizontal overflow |
| Mobile menu keyboard open/close | 24 combinations passed; native checkbox changes state, links show/hide and focus is visible |
| Global navigation | 36 actual source-to-destination link clicks passed |
| HTML/CSS carousel | 63 numbered-link checks passed; all nine loaded images aligned to their viewport, captions/44px controls remained usable and 16:9 crops were preserved |
| Carousel boundary links | Next 9→1 and Previous 1→9 passed at all seven widths using keyboard Enter |
| Native scroll keyboard behavior | Carousel arrow keys scroll to another panel; the small ranking table scrolls inside its own region without body overflow |
| Custom Flexbox cards | Measured 3/3/3/2/1/1/1 first-row counts across the seven widths; equal heights within multi-card rows |
| Normal images | Loaded hero/features preserve natural proportions after subtracting borders; lazy images rechecked after scrolling into view |
| Form | Empty submission focuses Name; malformed email focuses Email; completed sample fields pass native validation without sending a draft |
| Skip/focus and console | Six skip-link Enter checks focus main; menu/carousel focus visible; no console errors or warnings |
| Source paths/IDs/ARIA | 236 relative markup references passed, with no missing file/fragment, duplicate ID or unresolved ARIA reference; documentation links passed |
| Final validation | All six pages pass html-validate 8.24.0; git diff --check passes; no executable JavaScript in page sources |

Browser checks used temporary in-memory commands and an external preview runtime only; no test code or captures were saved into the project.

### Current files and scope limits

```text
EsportsHub/
├── index.html, events.html, teams.html
├── players.html, rankings.html, contact.html
├── css/style.css
├── images/ (15 project image assets)
├── README.md
├── docs/midterm-audit.md
├── docs/defense-evidence.md
└── .nojekyll
```

**Intentional rubric adjustment:** the Bootstrap JavaScript navbar/collapse and carousel plugins are no longer present. Their user-facing behaviors have HTML/CSS replacements, as required by the updated stack constraint; this is not a claim that the original plugin-specific requirement is still fully met.

Remaining limitations are unchanged: the local revision has not been published, legacy raster licensing is unresolved, and other browser engines/dedicated screen-reader coverage are not verified. Bootstrap CSS needs internet access and the contact form still depends on a configured mail application. No push or hosting setting change was made.
