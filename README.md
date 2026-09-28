# EsportsHub

An esports community website extended in place for Assignment #3: Media Queries + Bootstrap Grid.

The original six pages, esports content, image files, color palette and footer are preserved. HTML5, CSS3, Flexbox, CSS Grid and Bootstrap 5.3.8 are used. Bootstrap CSS and JavaScript Bundle load once per page from the jsDelivr CDN; an internet connection is required for these resources.

## Pages
- index.html
- events.html
- teams.html
- players.html
- rankings.html
- contact.html

## Original assignment requirements preserved
- Full HTML5 boilerplate and descriptive titles
- Shared external CSS stylesheet
- Semantic headings and paragraphs
- Ordered and unordered lists
- Images with descriptive alt text on every page
- Global navigation linking all pages
- HTML table with headers, rows, and 4 columns
- Contact form with name, email, dropdown, textarea, and submit button
- Element, class, ID, and descendant CSS selectors
- Hover states and styled navigation
- Box model using margin, padding, borders, and responsive units
- Circular profile image using border-radius: 50%
- Team member biography section
- Footer with all team member names on every page

## Assignment #3 implementation

| Task | Location | Implementation |
| --- | --- | --- |
| 1. Typography | All pages, css/style.css | Heading and introduction sizes at 768px and 992px |
| 2. CSS card group | players.html | Existing Featured Players: Flexbox and media queries, 3 / 2 / 1 columns; no Bootstrap Grid on this group |
| 3. Bootstrap Grid | index.html and information sections | container, row, col-sm-12, col-md-6, col-lg-6 and col-lg-4 |
| 4. Spacing | All pages | py-4 py-lg-5, mt-lg-4, px-sm-2 and other relevant spacing utilities |
| 5. Navbar | All six pages | Six links, navbar-expand-lg, accessible collapse button and active page |
| 6. Buttons | Home, Players, Rankings, Contact; section links | Primary, secondary, outline, large and small buttons; Rankings button group |
| 7. Carousel | players.html | Nine original gallery images/captions, indicators, previous/next, keyboard navigation; no autoplay |
| 8. Bootstrap Cards | index.html | Three player cards with image, body, title and description in Bootstrap Grid |
| 9. Form | contact.html | Original name, email, topic and message; form-control, form-select, form-label, input-group and responsive columns |
| 10. Accessibility | All pages | Semantic landmarks, skip link, focus styles, alt text, labels, ARIA, table headers and reduced-motion support |

## Responsive behavior

- Desktop: 992px and wider. Expanded navbar, sidebar on the left and three player cards per row.
- Tablet: 768px to below 992px. Collapsed navbar, quick links above main and two player cards per row.
- Mobile: below 768px. One player card per row, stacked form fields and smaller typography.
- Below 576px, the existing game/contact tiles also stack into one column.
- The ranking table scrolls inside its own labeled region when necessary.

Task 2 intentionally keeps custom card geometry. Bootstrap owns the separate Task 8 card grid. Useful original CSS, including the overall page grid and theme, remains in place. Bootstrap 5 uses responsive grid columns instead of the removed Bootstrap 4 card-deck class.

## Team page responsibilities for the defense

| Member | Page 1 | Page 2 |
| --- | --- | --- |
| Damir | index.html: Navbar, Grid, Cards, Buttons | events.html: Navbar, Grid |
| Alina | teams.html: Navbar, Grid, Buttons | players.html: Navbar, Carousel, Buttons |
| Aisha | rankings.html: Navbar, Grid, button group | contact.html: Navbar, Grid, Form, submit button |

All three names appear in every footer. This table maps the requested ownership for the team demonstration.

## Run locally

Open index.html in a modern browser, or serve this directory with `python -m http.server 8000` and visit http://localhost:8000.

The contact form retains its original `mailto:info@esportshub.com` action. It validates required fields and the email format, then opens a configured email application. It has no backend and does not promise server-side delivery.

## Verification and submission

Browser checks cover all six pages, responsive boundaries, Bootstrap resource loading, card counts, navigation, carousel controls/indicators, form validation and keyboard access. The supplied materials outside the website contain the detailed audit, actual screenshots, explanation, defense questions and report text.

GitHub Pages publishes the root of the `main` branch at https://drissakov.github.io/EsportsHub/. Pushes to that branch trigger a rebuild.

The PDF's submission stage also asks for a PDF report, code/page screenshots, the group number and a ZIP. The supplied report text identifies any remaining submission information explicitly.

## Team
Damir Issakov, Alina Aitmukhamet, Aisha Mussina
