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
- `assets/site-config.js` — current contact inbox, official social URLs, optional contact methods, approved news stories, and product launch details.
- `assets/friday-startup-emblem.png` — the supplied emblem on a transparent background. The page renders “Friday Startup” beside it as live text; the emblem is not redrawn.
- `assets/social-*.svg` — Facebook, Instagram, Gmail, X, LinkedIn, and WhatsApp marks. All six are kept in the Help section and remain inactive until official destinations are added.
- `assets/*.jpg` — Pexels photography; credits and source pages are below.

### Help & contact

Keep `contactEmail` in `assets/site-config.js` set to the official company inbox before inviting real inquiries. The focused form asks for name, email, inquiry type, and a short message; company/site is optional. The page prepares an email draft in the visitor’s mail app and does not store or send submissions.

Add only official account destinations under `socials`: verified Facebook, Instagram, X, LinkedIn, a company Gmail address, and the official WhatsApp link. Optional phone, WhatsApp, and booking shortcuts appear only when configured.

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

The existing Vercel project serves production from this repository’s `main` branch. The container copies only the public website files (`index.html`, `news.html`, and `assets/`) into the web root; repository documents, previews, and unrelated archives are not copied.
