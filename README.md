# EsportsHub

EsportsHub is a responsive site for esports fans and aspiring competitive players. Find tournaments, explore teams and player profiles, compare sample standings, and create a local demo profile.

**Team FAN · SE-2501**

Damir Issakov (Home and Events), Alina Aitmukhamet (Teams and Players), and Aisha Mussina (Rankings and Community).

- [Live website](https://drissakov.github.io/EsportsHub/)
- [GitHub repository](https://github.com/drissakov/EsportsHub)

## Pages

| Page | Features |
| --- | --- |
| [Home](index.html) | Featured events and players, game shortcuts, gallery, player tips, nickname greeting, and rating |
| [Events](events.html) | Search with suggestions and match highlighting, combinable game and format filters, shareable event links, and live Dota 2 team ratings from OpenDota |
| [Teams](teams.html) | Sample team directory with links to player profiles and rankings |
| [Players](players.html) | Player cards, photo gallery, and keyboard-accessible carousel |
| [Rankings](rankings.html) | Sample multi-game standings with a horizontally scrollable table on narrow screens |
| [Community](contact.html) | FAQ, contact email draft, and a three-step demo player application |
| [Account](account.html) | Separate sign-up and log-in views for the browser-local demo account |
| [Profile](profile.html) | The signed-in player's name, email, and phone, with a log-out action |

Page tools groups the local clock, background options, and subscription demo. Home also offers a nickname greeting there.

## Run locally

Serve the repository root over HTTP. For example, run this command and open [the local site](http://localhost:8000/).

    python -m http.server 8000

The site runs directly from its HTML, CSS, and JavaScript files. Bootstrap 5.3.8 CSS, jQuery 4.0.0, and the password estimator are included locally. The [jQuery license](js/vendor/jquery-LICENSE.txt) and [password estimator license](js/vendor/password-strength-LICENSE.txt) ship with the project. A network connection is needed to fetch live [OpenDota](https://docs.opendota.com/) ratings. The Events page displays an error and a retry button if the API is unavailable.

Use localhost or HTTPS for the demo account flow. Sign-up, log-in, the active profile, the selected theme, and the tournament filter state use this browser's local storage. Use fictional details. Sign-up stores the name, email, phone, and a salted password verifier. The account and application flows simulate a service in the browser. The contact form opens an email draft in the visitor's mail application.

All form checks run in JavaScript. Account creation checks required fields, email format, international phone format, password strength, and exact confirmation. The existing subscription and application demos validate the fields they collect. Event dates and the standings on Rankings are sample data. The labeled OpenDota panel displays separate data returned by the API.

## Verification

Run the automated tests with Node.js 22 or later.

    node --test tests/*.test.cjs

For a browser check, try the following flows.

1. Switch to dark mode and navigate from Home to Events. Verify the selected mode persists.
2. Combine a game and format on Events, search for a tournament, and clear the filters. Follow a direct link to a tournament and confirm its card is visible.
3. Open the Dota 2 ratings panel and verify the loading state and API results. With the API blocked, check that the error offers a retry.
4. Create a demo account with fictional details. Try an incorrect password, log in with the correct one, verify the Profile page, and log out.
5. Open Home, Events, and Community on desktop, tablet, and mobile. Check the mobile navigation, images, forms, and keyboard focus.

GitHub Pages serves the repository root on main. The .nojekyll file keeps static paths intact.

## Earlier assignments

The [Assignment 4 defense guide](docs/assignment-4-defense.md), [Assignment 4 checks](docs/assignment-4-checks.md), and [midterm evidence](docs/defense-evidence.md) document earlier versions of the project.

## Image credits

The repository contains original SVG artwork for the [player room](images/player-room.svg), [community desk](images/community-support.svg), [team avatar](images/team-avatar.svg), and [ranking illustration](images/demo-ranking.svg). The site also reuses raster images from the earlier project. Source and license records for those original raster files are unavailable in the repository.
