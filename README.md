# Friday Startup

A responsive, static website for the Friday Startup venture-studio brand: build digital products under one umbrella and partner with other businesses on considered growth.

## Run locally

No build step or package install is needed:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Update the site

- `index.html` — page content, layout, responsive styling, navigation, FAQ, and interaction.
- `assets/site-config.js` — editable contact inbox, official social URLs, optional contact methods, and scheduled launches.
- `assets/friday-startup-emblem.png` — the supplied F/orbit/star emblem isolated on a transparent background. The header and footer place “Friday Startup” beside it as live text; the emblem artwork is not redrawn.
- `assets/social-*.svg` — the six requested platform marks.
- `assets/*.jpg` — Pexels photography; credits and source pages are below.

### Help & contact

All social icons and their future links are confined to the **Help & contact** section. Before inviting real inquiries, replace `contactEmail` in `assets/site-config.js` with the verified company inbox. The form asks for name, email, inquiry type, and a short message; company/site is optional. It prepares a message in the visitor's default email app. This static site does not receive, store, or send submissions. The visitor reviews and sends the draft themselves.

Add official account destinations under `socials` in the same file. Facebook, Instagram, X, and LinkedIn should use verified profile URLs; `gmail` should be the company email address; `whatsapp` should be the official business `wa.me` or WhatsApp profile URL. Icons remain visibly marked “Not connected” and unclickable while a destination is blank. Optional `phone`, `whatsapp`, and `bookingUrl` contact shortcuts appear only after they are configured.

### Schedule a product announcement

Add an approved item to `launches` in `assets/site-config.js`:

```js
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

Use the real logo file and an ISO 8601 launch date with its timezone. The announcement becomes visible 48 hours before launch, with a countdown. At launch time, the product and its mark move into the right-to-left logo lineup. The list is empty for now, so the page shows clearly labelled placeholder slots—not fictitious products. The motion can be paused, and reduced-motion preferences are respected.

## Research behind the inquiry flow

The contact experience follows [HubSpot's contact-page guidance](https://blog.hubspot.com/service/best-contact-us-pages) and [Formidable Forms' contact-form best practices](https://formidableforms.com/research-based-tips-improve-contact-form-conversions/): make contact easy to find, keep the initial form focused, use responsive fields, and avoid requesting unnecessary personal information. Details and maintenance steps are in [`docs/website-research-and-maintenance.md`](docs/website-research-and-maintenance.md).

The social icons are from [Simple Icons](https://github.com/simple-icons/simple-icons); review its [legal disclaimer](https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md). Each platform's marks remain its property; they identify intended contact destinations and do not imply endorsement.

## Photo credits

- Team collaboration — [fauxels on Pexels](https://www.pexels.com/photo/people-working-in-front-of-the-computer-3184357/)
- Product building — [Mizuno K on Pexels](https://www.pexels.com/photo/discussion-about-software-development-in-office-12899191/)
- Growth partnership — [Vitaly Gariev on Pexels](https://www.pexels.com/photo/creative-team-brainstorming-in-modern-office-39205102/)

Images link to their photographers' pages. Review the [Pexels license](https://www.pexels.com/license/) for current terms.

## Deployment

This plain static site can be hosted on any static host. The temporary preview for this task is created with:

```bash
npx --yes wrangler@4.102.0 deploy --temporary
```
