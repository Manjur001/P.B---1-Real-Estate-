# Real Estate Property Landing Page

A fast, responsive static landing page for showcasing a single property: hero section, highlights, photo carousel, and a Netlify-powered booking form.

## Features
- Hero with price, location & CTA
- Property highlights grid
- Responsive image carousel (vanilla JS)
- Netlify form for booking viewings
- Accessible markup, semantic structure
- SEO & social share metadata (Open Graph)
- Mobile nav + swipe carousel
- Easy to customize: no framework lock-in

## Getting Started

### 1. Clone / Create Repo
```bash
git init
git add .
git commit -m "Initial real estate landing page"
git branch -M main
git remote add origin https://github.com/YourUser/your-property-landing.git
git push -u origin main
```

### 2. Add Photos
Place high-quality images in `images/` and update filenames in:
- `index.html` hero `<img>`
- Carousel slides

Use descriptive `alt` text for accessibility. Consider optimized sizes:
- Hero: ~1600px wide
- Carousel: 1600x900 or 1400x788
- Use a service like TinyPNG or Squoosh

### 3. Deploy to Netlify
1. Log in to Netlify
2. New Site from Git
3. Pick your GitHub repo
4. Build command: (leave blank)
5. Publish directory: `.`
6. Deploy

Netlify will detect the form via:
```html
<form name="booking" method="POST" data-netlify="true">
```

### 4. Test the Form
Submit once in production; check Netlify Dashboard > Forms.

Optional spam protection:
- Honeypot already added (`bot-field`)
- You can enable Netlify reCAPTCHA if needed

### 5. Custom Domain
Add your domain in Netlify > Domain settings. Set DNS or use Netlify-managed DNS for automatic SSL.

### 6. SEO & Metadata
Update:
- `<title>`
- `<meta name="description">`
- Open Graph tags
- `og:image` must be an absolute URL (500x500+)

Create `sitemap.xml` and `robots.txt` later if you want better indexing.

### 7. Performance Tips
- Compress images
- Consider `loading="lazy"` for non-hero images
- Use WebP versions:
```html
<picture>
  <source srcset="images/hero-1.webp" type="image/webp">
  <img src="images/hero-1.jpg" alt="Description">
</picture>
```

### 8. Optional Enhancements
| Feature | Idea |
|---------|------|
| Map | Embed Google Maps iframe or Leaflet JS |
| Analytics | Add Plausible or Google Analytics |
| Inquiry CRM | Zapier → Google Sheets / HubSpot |
| Multi-property | Turn highlights into dynamic grid |
| Dark Mode | Add a `data-theme` toggle CSS variables |
| Image Lightbox | On click enlarge carousel images |
| Structured Data | Add JSON-LD `RealEstateListing` schema |

### 9. Structured Data Example (Optional)
Add before `</head>`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SingleFamilyResidence",
  "name": "Modern Luxury Home",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "742 Evergreen Terrace",
    "addressLocality": "Springfield",
    "addressRegion": "IL",
    "postalCode": "62704"
  },
  "numberOfRooms": 8,
  "floorSize": {
    "@type": "QuantitativeValue",
    "value": 3200,
    "unitCode": "FTK"
  },
  "amenityFeature": [
    {"@type":"LocationFeatureSpecification","name":"Solar Ready"},
    {"@type":"LocationFeatureSpecification","name":"EV Charger"},
    {"@type":"LocationFeatureSpecification","name":"Chef Kitchen"}
  ],
  "offers": {
    "@type": "Offer",
    "price": "1250000",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

### 10. Accessibility Checklist
- All images have descriptive `alt`
- Form inputs have `<label>` associations
- Visible focus styles
- Semantic headings (`h1`, `h2`, etc.)
- Sufficient color contrast

### 11. Editing & Iteration
After changes:
```bash
git add .
git commit -m "Update carousel images"
git push
```
Netlify auto-redeploys.

## License
You can use this freely for personal/commercial projects. Attribution appreciated but not required.

## Questions?
Open an issue or extend it with a backend/API if you want saved leads outside Netlify.
