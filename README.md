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

### Homepage structure and motion ("Agents at work" redesign)

- Identity: deep evergreen surfaces with a single lime signal colour (plus sky, violet and peach to tell the four agents apart). General Sans (Fontshare) for headings and body, Instrument Serif italic for emphasis, IBM Plex Mono for labels.
- The homepage is standalone: `index.html` loads only `assets/css/home.css` and `assets/js/home.js`.
- Sections: floating pill header that hides on scroll down, with a **command palette** (Ctrl/⌘ + K) → hero with an interactive **agent console**: type a task or pick an example and the matching agent plans it step by step, then waits for your approval → services ticker → **Business Agents** bento (Marketing, Website, Social Media, Growth) with animated mini-visuals → **How it works**, a scroll-driven horizontal track (Discover, Design, Deploy, Develop) → **One studio. Many services.** cards with a pointer spotlight, ending with "In the lab" for upcoming solutions → **What's new** news carousel with social links → FAQ → contact card with copy-email, call link, social links and a quick project brief that opens a pre-filled email → footer.
- Inner pages keep `site.css`, `premium.css` and `site.js`, plus `assets/css/theme.css`, which applies the same type, evergreen background and lime accent.
- Motion is disabled for visitors with `prefers-reduced-motion` (the console shows its final state, the how-it-works track becomes a normal list); content stays readable without JavaScript.

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
