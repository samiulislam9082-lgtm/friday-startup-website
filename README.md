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

### Homepage structure and motion ("Next" redesign)

- Identity: night-black immersive sections alternating with warm porcelain sections, and a single cobalt → violet → coral → amber "prism" accent. Clash Display for headings and Switzer for text (both self-hosted in `assets/fonts/`), Geist Mono for labels.
- The homepage is standalone: `index.html` loads only `assets/css/home.css` and `assets/js/home.js`.
- Sections: floating glass header that switches between dark and light with the section beneath it → hero with an interactive 3D particle orb (canvas, follows the pointer) and orbiting service labels → services marquee → **Our vision** manifesto whose words light up on scroll, plus three principles → **AI assistants** simulator: six tabs (Receptionist, Phone, Booking, Sales, Reviews, WhatsApp) play example conversations in a device frame, with a Custom AI Agent call-out → **Eighteen services. One team.** filterable catalogue (AI assistants, Web & search, Marketing, Systems) where each card can be added to a plan; a floating plan tray follows the visitor → **SEO · AEO · GEO** explainer that switches between a search result, a direct answer and an AI chat recommendation → **How we work** timeline that fills on scroll → **Friday Lab**, ideas in progress for future solutions → **News** with social links → FAQ → contact card with copy-email, call link, social links and a plan form that opens a pre-filled email → footer.
- Inner pages keep `site.css`, `premium.css` and `site.js`, plus `assets/css/theme.css`, which applies the same fonts, night palette and accent.
- Animations pause off-screen and are disabled for visitors with `prefers-reduced-motion`; content stays readable without JavaScript.

- Premium layer: restrained champagne-and-ivory palette, Boska serif italic for accent words, subtle film grain, a short "Friday Startup" intro curtain (first visit per session only, skipped for reduced motion), a custom cursor with magnetic buttons on mouse/trackpad devices, and soft blur reveals on section headings. Inner pages share the champagne accents via `assets/css/theme.css`.

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
