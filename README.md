# Snapdown

**Draw snapshot diagrams with plain text**

## Development

Open `web/development.html`, which includes dependencies from unpkg and generates a parser on the fly.

To build the production version (entry point `web/production.html`):

- `vagrant up` to provision a VM with Node.js
- `npm run build` to generate `dist/main.js`, `dist/main.js.map`, `static/main.js`, and `static/main.js.map`.

`web/production.html` is also available in development mode by running `npm start`. This continuously watches for code changes: each time you make a change to the code, all bundle files will recompile, and refreshing the page will load the new version.

`web/production_noapp.html` is also available for testing without the web app interface.

## Deployment

To deploy to a website, such as Athena: first run `npm run build` as described above. Then copy the following files to hosting location:

- All `.js` files in `static/`, `dist/`
- All files in `docs/`
- `web/production.html`

Snapdown is now accessible at `web/production.html`.
