# Offline password strength bundle

This builds a standalone browser asset from pinned `@zxcvbn-ts/core`, common and English language packages. It runs synchronously and makes no network requests. It includes keyboard adjacency graphs and the full common/English dictionaries.

## Rebuild

Use Node.js 18 or newer in this directory:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run build
```

Copy `dist/password-strength.min.js`, `dist/password-strength-LICENSE.txt` and `dist/password-strength-sources.json` into `../../js/vendor/` after a rebuild. The source manifest records versions, registry integrity values and the bundle SHA-256. The lockfile pins transitive runtime dependencies and the build tool. Neither `node_modules/` nor scratch `dist/` is included in the website source archive.

No installation or build step is required to run the finished browser asset. Load it before the form's custom password helper. It exposes:

```js
window.EsportsHubStrength.estimate(password, userInputs);
// => { score: 0..4, feedback: { warning, suggestions } }
```

The application rejects values outside its 15–128 Unicode codepoint policy before estimating and requires score 4. Its helper supplies published example phrases and current name/email as known guesses, so simple suffixes and context-based passwords are penalized. The wrapper also rejects non-string values and strings longer than 256 UTF-16 units, preventing the upstream estimator's truncation path. It returns only the score and feedback; it does not expose password or pattern-match details, store values, or send values anywhere.

The estimate recognizes dictionary words, common passwords, repeated/sequence/keyboard/date patterns and supplied context. It is a heuristic, not a complete breached-password lookup. Long publicly known example phrases can still receive a high score; a real service needs separate breached-password checks and server enforcement.

Primary references: [project usage documentation](https://zxcvbn-ts.github.io/zxcvbn/guide/getting-started/) and [source repository](https://github.com/zxcvbn-ts/zxcvbn).
