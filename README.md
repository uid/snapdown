Snapdown
========

**Snapshot diagrams from plain text**


Development
-----------

Open `test/development.html`, which includes dependencies from a CDN and generates a parser on the fly.
Edit the grammar in `src/snapdown.peg.js` and the renderer in `src/index.js`.

To build the production version, a Node environment is required.
Use `npm run-script build` to generate `dist/snapdown.min.js`.
