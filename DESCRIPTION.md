# Project Description

`vabbuo.it` is now a small Rust + SQLite web application built around a simple
idea: show short sentences on screen, let visitors submit their own, and keep
the implementation lightweight.

## Technologies

- `Rust` for the HTTP server and database access layer.
- `axum` for routing and request handling.
- `sqlx` with `SQLite` for persistence.
- `JavaScript` for the animated sentence display and the submission form.
- `HTML5 Canvas` for the landing-page animation.
- `SVG` for the central landing button.
- `Bootstrap 5` for form layout, modals, and tooltips.
- `fetch` and native DOM APIs instead of `jQuery`.

## Main Pages

- `/` and `/index.php`
  - Serve the animated landing page.
  - Use frontend viewport detection to switch between the falling and static
    sentence presentations.

- `/main` and `/main.php`
  - Serve the submission form.
  - Keep the original casual tone, but use Bootstrap 5 and plain JavaScript.

## Front-End Behavior

- Sentences are rendered on a full-screen canvas and animated with
  `requestAnimationFrame`.
- The landing button keeps the original circular SVG style.
- Mobile behavior is decided in the browser with viewport and pointer queries,
  not on the server.
- The submission form uses native `fetch` for async posting.
- The email field is shown only when the contact checkbox is enabled.

## Backend Behavior

- `/api/sentence` and `/sentence.php`
  - Accept a seed from the browser.
  - Select a sentence by offset so deleted rows do not break lookup.
  - Return JSON with the sentence text and optional author.

- `/api/submit` and `/submitSentence.php`
  - Accept the submitted form fields.
  - Normalize empty values before saving.
  - Store the submission in SQLite.

## Database Tables

The rewrite uses two active tables:

- `sentences` for the source sentence pool.
- `submissions` for visitor-submitted content.

The legacy logging and geolocation tables are no longer part of the active
runtime.

## Notes

- The server seeds a small fallback sentence list if the database starts empty.
- The old PHP files remain in the repository as historical sources, but the
  active app no longer depends on them.
