# EsportsHub

The **EsportsHub Midterm Project** is a frontend prototype for discovering esports events, teams, players and rankings. Its flow connects player/team discovery, competition, sample results and Community & Support.

## Scope and technologies

This is a static website built with **HTML and CSS only**: semantic HTML5, CSS3, Flexbox, CSS Grid, media queries and Bootstrap **5.3.8 CSS**. There are no scripts, JavaScript files, backend, package installation or build step. A native checkbox and CSS control the mobile menu; the nine-image carousel uses native scrolling and real fragment links.

Events, profiles, recruitment concepts and rankings are labeled samples. Calendar controls do not filter data. Accounts, verified listings, registration, saved messages and rankings calculated from verified results would require future application logic and a backend.

## Pages and defense ownership

| Page | Purpose | Owner |
| --- | --- | --- |
| [index.html](index.html) — Home | Product introduction, event previews and Bootstrap player cards | Damir |
| [events.html](events.html) — Events | Sample tournament discovery, prototype controls and participation steps | Damir |
| [teams.html](teams.html) — Teams | Featured profiles and sample community-team concepts | Alina |
| [players.html](players.html) — Players | Profile anchors, custom Flexbox cards, Grid gallery and carousel | Alina |
| [rankings.html](rankings.html) — Rankings | Demo points table, ranking explanation and related view links | Aisha |
| [contact.html](contact.html) — Community & Support | Questions, organizers, partnerships, feedback, problem reports and team biography | Aisha |

Damir, Alina and Aisha appear in every footer.

## Assignment 1–3 concepts preserved

- **Assignment 1:** HTML5 metadata, landmarks, headings, paragraphs, ordered/unordered lists, local images with alt text, shared navigation, four-column table, complete form, biography and circular avatar. The external [stylesheet](css/style.css) demonstrates element, class, ID and descendant selectors, the box model, typography, colors and hover states.
- **Assignment 2:** Flexbox navbar alignment; separate CSS-only `.players-container` cards; `.page-layout` with named header/sidebar/main/footer Grid areas; and a nine-image `.gallery-grid` with visible captions.
- **Assignment 3:** Media queries and custom 3/2/1 cards, Bootstrap CSS two/three-column grids, spacing utilities, navbar styling, button variants, ranking button group, three Home cards and responsive form. Keyboard focus, skip links, table headers, labels and reduced-motion styling remain visible examples. The menu and nine-slide carousel are HTML/CSS replacements, not Bootstrap JavaScript plugins, following the updated HTML/CSS-only constraint.

The custom Flexbox cards on Players are separate from the Bootstrap cards on Home. Detailed implementation evidence and checks are in [docs/midterm-audit.md](docs/midterm-audit.md).

Use [docs/defense-evidence.md](docs/defense-evidence.md) for the ownership map, demonstration route and likely defense questions.

## Responsive behavior

| Width | Navigation / sidebar | Custom player cards | Grid gallery |
| --- | --- | --- | --- |
| 992px and wider | Expanded navbar; sidebar on the left | 3 per row | 3 columns |
| 768px to below 992px | Collapsed navbar; quick links above main | 2 per row | 2 columns |
| 576px to below 768px | Collapsed navbar; stacked content and form fields | 1 per row | 2 columns |
| Below 576px | Collapsed navbar; wrapping quick links | 1 per row | 1 column |

Game/support tiles use four columns from 1200px, two from 576px, and one below 576px. The ranking table scrolls inside its labeled region; carousel captions and controls have separate rows. Normal images preserve their proportions, while cards/gallery/carousel/avatar use documented intentional crops.

All six pages are checked at **1440, 1200, 992, 768, 576, 375 and 320px**; the final Stage 9 matrix and interaction results are in the audit.

## Run locally

Open `index.html` directly in a modern browser, or preview the folder with any static server/editor preview. No Python files, testing scripts or build tools are included.

Bootstrap CSS loads from [jsDelivr](https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css), so its styling needs internet access. No Bootstrap JavaScript is loaded.

## Static contact form

The form requires name, a valid email, topic and message. Submission uses `mailto:info@esportshub.com` to open a draft in the visitor's configured email application. It does not store messages or confirm delivery. Support shortcuts lead to the same form; choose the topic there.

## GitHub Pages

Expected URL: [https://drissakov.github.io/EsportsHub/](https://drissakov.github.io/EsportsHub/).

This checkout is ready to serve from **main → /(root)**: `index.html` is the entry point, internal links/assets are relative, and `.nojekyll` disables Jekyll processing. No build command or custom deployment workflow is needed.

On **2026-10-07**, the published root and all six pages returned HTTP 200 for the earlier revision. Publication of the HTML/CSS revision to `main` was authorized on **2026-10-08**. Historical audit notes describe the deployment at the time of each check; the repository's latest commit and GitHub Pages deployment determine the current published version. No Pages settings were changed.

## Image Credits

No new third-party image was downloaded during the Midterm stages. The eleven original raster files remain in `images/`; `donk.avif`, `eventsfeature.avif` and `teams.webp` were renamed to match their existing formats without changing their bytes.

Stage 9 replaces four displayed raster graphics with original SVG artwork authored in this repository. These illustrations stay sharp when scaled and use no third-party artwork:

| Original project artwork | Source / attribution |
| --- | --- |
| [player-room.svg](images/player-room.svg) | EsportsHub Stage 9 SVG code; community gaming illustration |
| [community-support.svg](images/community-support.svg) | EsportsHub Stage 9 SVG code; community desk connections |
| [team-avatar.svg](images/team-avatar.svg) | EsportsHub Stage 9 SVG code; Damir/Alina/Aisha initials |
| [demo-ranking.svg](images/demo-ranking.svg) | EsportsHub Stage 9 SVG code; the sample table's points |

Original source/license records for the pre-existing raster imagery are absent from the repository. Their attribution remains unresolved; no source, license or reuse permission is invented here.
