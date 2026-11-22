# Friday Startup

A responsive, static website for Friday Startup: a venture-building umbrella for launching digital businesses and a partner for companies working on their next stage of growth.

## Run locally

No build step or package installation is required:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Update the site

- `index.html` — homepage content and structure (styled by `assets/css/home.css`, scripted by `assets/js/home.js`).
- `news.html` — separate News & updates page, including confirmed product previews and dated studio news.
- `assets/site-config.js` — the published email address, the four approved account links, approved news stories, and product launch details.
- `assets/friday-startup-emblem.png` — an exact copy of the supplied original logo image. The page renders “Friday Startup” beside it as live text; the logo file is not redrawn or altered.
- `assets/social-*.svg` — Facebook, Instagram, X, email and phone marks used for the official contact links.
- `robots.txt`, `sitemap.xml`, and `llms.txt` — crawler access, canonical page discovery, and an accurate source-of-truth summary for AI systems.
- `assets/*.jpg` — Pexels photography; credits and source pages are below.

### Help & contact

The published contact details are the official email address `fridaystartup@fridaystartup.cyou` (opened via `mailto:` links) and the phone number `+1 (740) 206-9647` (opened via `tel:+17402069647`). Both appear in the homepage Contact section, the Help Center and the footer of every page. Facebook, Instagram and X link to the official accounts. There is no contact form.

Do not add other account profiles or contact methods without an explicit site-owner request.

### Homepage structure and motion ("Keep your Friday" redesign)

- Concept: your Business Agents work Monday to Thursday, and you keep Friday. Light paper-and-ink palette with a single orange signal colour; Cabinet Grotesk (display) and Satoshi (body) from Fontshare, JetBrains Mono for labels.
- The homepage is standalone: `index.html` loads only `assets/css/home.css` and `assets/js/home.js`.
- Sections: sticky header with a live clock and scroll progress line → hero with an animated **week board** (four agents fill Mon–Thu tasks as a "now" line sweeps, live agent notifications, pointer tilt, a rising "Friday sun"; Friday stays free) → moving services ribbon → **Business Agents** roster with an interactive activity log and approval buttons → **Same week. Different Friday.** drag-to-compare week, also keyboard-operable → "Four Fridays" process with scroll-lit numerals → **More than agents** service index, ending with the "Next launch" row for upcoming solutions → **The Friday Edition** news with illustrated covers and social links → FAQ → orange contact section with a rotating "Book a call" badge → footer with an animated wordmark.
- Inner pages keep `site.css`, `premium.css` and `site.js`, plus `assets/css/theme.css`, which applies the same type, warm ink background and orange accent.
- Motion pauses off-screen and is disabled for visitors with `prefers-reduced-motion`; content stays visible without JavaScript.

### News and launches

Add an approved studio story to `newsItems` in `assets/site-config.js` with a title, summary, category, and ISO 8601 `publishAt` value. It appears on `news.html` at or after that time. Product teasers use `launches`: enter an approved name, accurate summary, real local logo path, timezone-aware `launchAt`, and optional HTTPS URL. A product preview appears in News only during the 48 hours before launch; after launch, the product and its logo appear in the homepage portfolio. Do not add a product or date until it is approved.

```js
newsItems: [
  {
    title: "Approved update title",
    summary: "A short, accurate update.",
    category: "Studio news",
    publishAt: "2027-02-01T10:00:00+06:00"
  }
],
launches: [
  {
    name: "Product name",
    summary: "A brief, approved description.",
    logo: "assets/product-logo.svg",
    launchAt: "2027-02-01T10:00:00+06:00",
    url: "https://example.com"
  }
]
```

The launch list is empty until a product is approved for announcement. Placeholder marks are labelled as such, never as live products or customer results.

## Photo credits

- Team collaboration — [fauxels on Pexels](https://www.pexels.com/photo/people-working-in-front-of-the-computer-3184357/)
- Product building — [Mizuno K on Pexels](https://www.pexels.com/photo/discussion-about-software-development-in-office-12899191/)
- Growth partnership — [Vitaly Gariev on Pexels](https://www.pexels.com/photo/creative-team-brainstorming-in-modern-office-39205102/)
- Venture workshop — [Kindel Media on Pexels](https://www.pexels.com/photo/planning-a-business-7688454/)
- Aurora Horizon homepage background — [Tobias Bjørkli on Pexels, photo 2113566](https://www.pexels.com/photo/mountain-beside-body-of-water-with-aurora-borealis-2113566/)

Images remain local to the site. Review the [Pexels license](https://www.pexels.com/license/) for current terms.

## Deployment

The existing Vercel project serves production from this repository’s `main` branch. The container copies the public pages, assets, and root discovery files (`robots.txt`, `sitemap.xml`, and `llms.txt`) into the web root; repository documents, previews, and unrelated archives are not copied.
