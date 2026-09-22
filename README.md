# Sushant Kumar Das: accessible portfolio (semantic HTML5)

A four-page portfolio built for WCAG 2.2 AA and Lighthouse Accessibility / SEO audits.

## Files
- `index.html`, `about.html`, `projects.html`, `contact.html`
- `styles.css` shared styles, `contact.js` form validation (all files sit in one folder)
- `favicon.svg`, `robots.txt`, `sitemap.xml`

## Run it
Extract the zip and double-click `index.html`.

## Before you publish
1. Replace `https://www.example.com/` with your real domain in every page, `sitemap.xml` and `robots.txt`.
2. Uncomment the `<link rel="canonical">` line in each page once the domain is correct.
   (Lighthouse fails a canonical that points to a different domain, so leave it commented when testing on localhost.)
3. Optional: add a 1200x630 image and an `og:image` meta tag for link previews.
4. Contact form: set `data-endpoint` on the `<form>` in `contact.html` to your form service URL (for example a Formspree endpoint). Without it the form only shows a demo success message.
5. Add new projects by copying an `<article class="project">` block in `projects.html`.

## Test it
- Serve the folder (`npx serve .`), open Chrome DevTools > Lighthouse, and run Accessibility and SEO.
- Tab through every page: the skip link appears first, focus is always visible, and the form is fully usable by keyboard.

