# Friday Startup

A responsive, static website for Friday Startup: a venture-building umbrella for launching digital businesses and a partner for companies working on their next stage of growth.

## Run locally

No build step or package installation is required:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Update the site

- `index.html` — homepage content, design, navigation, venture portfolio, approach, FAQs, and Help.
- `news.html` — separate News & updates page, including confirmed product previews and dated studio news.
- `assets/site-config.js` — the published email address, the four approved account links, approved news stories, and product launch details.
- `assets/friday-startup-emblem.png` — an exact copy of the supplied original logo image. The page renders “Friday Startup” beside it as live text; the logo file is not redrawn or altered.
- `assets/social-*.svg` — Facebook, Instagram, X, and Gmail marks used for the official account links.
- `robots.txt`, `sitemap.xml`, and `llms.txt` — crawler access, canonical page discovery, and an accurate source-of-truth summary for AI systems.
- `assets/*.jpg` — Pexels photography; credits and source pages are below.

### Help & contact

The single published email address is `fridaystartup1@gmail.com`. The Gmail button opens a Gmail compose window addressed to that inbox; the address is also shown in the contact section. There is no contact form. Use Gmail to contact Friday Startup; Facebook, Instagram, and X link to the supplied official accounts.

Only Facebook, Instagram, X, and Gmail are published as account links. Do not add other account profiles or contact methods without an explicit site-owner request.

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

Images remain local to the site. Review the [Pexels license](https://www.pexels.com/license/) for current terms.

## Deployment

The existing Vercel project serves production from this repository’s `main` branch. The container copies the public pages, assets, and root discovery files (`robots.txt`, `sitemap.xml`, and `llms.txt`) into the web root; repository documents, previews, and unrelated archives are not copied.
