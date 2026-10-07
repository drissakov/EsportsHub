# EsportsHub defense evidence

Updated for the HTML/CSS-only handoff on 2026-10-08. This supports the oral defense; it does not guarantee the instructor's awarded score. Historical Stage 9 tests refer to the earlier Bootstrap JS implementation; the latest audit section documents its replacements.

## Ownership

| Member | Pages | Demonstration |
| --- | --- | --- |
| Damir | [Home](../index.html), [Events](../events.html) | Product flow, Bootstrap hero/cards, sample calendar and ordered participation steps |
| Alina | [Teams](../teams.html), [Players](../players.html) | Team/player anchors, custom Flexbox cards, Grid gallery and nine-slide carousel |
| Aisha | [Rankings](../rankings.html), [Community](../contact.html) | Table headers/overflow, related controls, native form validation and member biographies |

## Evidence to explain

| Area | Source / selector | What to demonstrate |
| --- | --- | --- |
| HTML | All six pages; [events.html#event-guidance](../events.html#event-guidance), [contact.html#team](../contact.html#team) | One h1, semantic landmarks, ordered/unordered lists, paragraphs, alt text and three member sections |
| CSS selectors and box model | [css/style.css](../css/style.css): `body`, `.player-card`, `#contact-form`, `table td`, `.bio h3` | Element/class/ID/descendant selectors; padding, margin, borders, radius and responsive units |
| Flexbox | `.navbar > .container`, `.players-container`, `.player-card` | Logo/links aligned horizontally; cards wrap with a 20px gap and stretch equally within each row |
| CSS Grid | `.page-layout`, `.gallery-grid` | Four named page areas; sidebar placement; nine gallery figures with 3/2/1 equal tracks and visible captions |
| Media queries | 1199.98, 991.98, 767.98 and 575.98px rules | At 992px the navbar remains expanded and custom cards have three columns; at 768px they have two; below 768px one |
| Bootstrap Grid | Home `.row`, `.col-md-6.col-lg-6`, `.col-md-6.col-lg-4` | Two columns measure half their row; three columns measure a third at lg and stack/wrap below it |
| Bootstrap CSS components | [Home cards](../index.html#featured-players), [ranking controls](../rankings.html#ranking-table), [form](../contact.html#contact-form) | Navbar styling, button variants/group, three cards and a responsive labeled form; no JS plugins |
| HTML/CSS interactions | `.nav-menu-toggle:checked ~ .navbar-collapse`; [carousel](../players.html#esportsCarousel): `.carousel-track`, `.carousel-panel` | Space toggles the native menu checkbox. Nine fragment-linked slides have Previous/Next links, numbered links and native scroll snapping |
| Responsive images | `img`, `.feature-image`; five named media wrappers | Normal content uses max-width:100% and height:auto. Only bounded 4:3, 16:10, 16:9 and square avatar areas intentionally crop |
| Accessibility | Skip links, aria-current, form labels, table scope headers, focus/reduced-motion rules | Enter on Skip moves focus to main; Tab outlines controls; invalid input blocks submission; table arrows scroll its own region |

## Short demonstration route

1. Open Home at 1440px, then follow its Events CTA to the sample controls.
2. Select CS2/Championship and Preview. Explain that this navigates to the calendar without claiming dynamic filtering.
3. Open a Home player card and show its real profile anchor, then the related team/event paths.
4. Resize Players to 992, 768 and 375px: show the custom Flexbox row at 3/2/1, distinct from the Home Bootstrap cards.
5. Show all nine gallery figures, then the HTML/CSS carousel's numbered and Previous/Next links. Focus its scroll region and use arrow keys; explain that no Bootstrap JS plugin is loaded.
6. At 320px, focus the ranking table and use arrow keys. The page itself must not scroll horizontally.
7. On Community, demonstrate empty and invalid-email validation, then valid sample fields without sending an email draft. Explain mailto and the absence of a backend.
8. Show each member's contribution section and the original square avatar inside its circular wrapper.

## Answers to likely questions

- **Why keep custom CSS alongside Bootstrap?** Assignments 1–2 require selectors, box-model, Flexbox and named Grid examples. Assignment 3 explicitly adds Bootstrap; the two card implementations remain separate and explainable.
- **Why use object-fit:cover only in certain places?** A bounded media component needs a consistent crop. Ordinary content preserves its natural ratio; changing both width and height independently would stretch it.
- **Why SVG for the new illustrations?** The old player graphic was enlarged from 275px to 1088px in the carousel. Original vector artwork stays sharp and has clear repository provenance.
- **Why no JavaScript?** The updated scope is HTML/CSS only. Bootstrap's styling remains, but its collapse/carousel plugins were removed and replaced with native controls, CSS and fragment navigation.
- **How was this tested?** The historical Stage 9 matrix records the earlier checks. The latest audit section records the HTML/CSS-only menu, carousel, layout, navigation and validation rechecks. Temporary scripts/screenshots are not part of the handoff.
- **Is the live site the final version?** Compare the latest GitHub Pages deployment with `main`. Stage 9 recorded the older live revision before publication was authorized on 2026-10-08. Existing raster provenance remains unresolved.

See [the final audit](midterm-audit.md) for the full matrix, test results and coverage limits.
