# Real Estate Property Landing Page (Optimized Version)

A fast, responsive static landing page for showcasing a single property: hero section, highlights, carousel, and a Netlify-powered booking form with modern responsive image handling (AVIF/WebP fallbacks) and optional LQIP.

## Features
- Hero with responsive `<picture>` (AVIF/WebP/JPEG)
- Property highlights grid
- Accessible, swipe-enabled image carousel (vanilla JS)
- Netlify booking form (honeypot spam protection)
- Optional AJAX-like form feedback
- SEO + social Open Graph tags
- Structured Data (JSON-LD) snippet (commented)
- Performance oriented (lazy loading, decoding, sizes)
- Minimal dependencies (no framework)

## File Structure
```
/
  index.html
  styles.css
  script.js
  netlify.toml
  README.md
  images/
    hero-front-day-800.jpg
    hero-front-day-1200.jpg
    hero-front-day-1600.jpg
    hero-front-day-800.webp
    ...
    living-room-open-plan-1600.jpg
    kitchen-chef-island-1600.jpg
    primary-bedroom-suite-1600.jpg
    backyard-entertaining-1600.jpg
```

## Getting Started

### 1. Initialize and Push
```bash
git init
git add .
git commit -m "Initial real estate landing (optimized images)"
git branch -M main
git remote add origin https://github.com/YourUser/your-property-landing.git
git push -u origin main
```

### 2. Deploy on Netlify
1. New Site from Git
2. Select repo
3. Build command: (leave blank)
4. Publish directory: `.`
5. Deploy

Forms: Netlify auto-detects `<form name="booking" data-netlify="true">`.

### 3. Add Your Real Images
Replace placeholders in `images/` with real optimized images. Update alt text to match reality.

**Recommended widths:** 800 / 1200 / 1600 (or 1920)  
**Aspect ratios:** Use consistent (e.g., 16:9 for carousel).

### 4. Image Optimization Workflow (CLI Example)
```bash
mkdir -p images/dist
for f in hero-front-day living-room-open-plan kitchen-chef-island primary-bedroom-suite backyard-entertaining; do
  magick images/${f}.jpg -resize 1600x -strip images/dist/${f}-1600.jpg
  magick images/${f}.jpg -resize 1200x -strip images/dist/${f}-1200.jpg
  magick images/${f}.jpg -resize 800x  -strip images/dist/${f}-800.jpg
  cwebp -q 80 images/dist/${f}-1600.jpg -o images/dist/${f}-1600.webp
  cwebp -q 80 images/dist/${f}-1200.jpg -o images/dist/${f}-1200.webp
  cwebp -q 80 images/dist/${f}-800.jpg  -o images/dist/${f}-800.webp
  avifenc --min 30 --max 45 images/dist/${f}-1600.jpg images/dist/${f}-1600.avif
  avifenc --min 30 --max 45 images/dist/${f}-1200.jpg images/dist/${f}-1200.avif
  avifenc --min 30 --max 45 images/dist/${f}-800.jpg  images/dist/${f}-800.avif
done
```

### 5. Alt Text Guidelines
Be specific and neutral, e.g.:
- "Open concept living room with floor-to-ceiling windows and neutral decor."
- "Gourmet kitchen featuring a large quartz island and pendant lighting."

### 6. Structured Data
Uncomment the JSON-LD block in `index.html` and adjust domain, currency, amenities, etc.

### 7. Performance Tips
- Keep hero to one preload.
- Use `fetchpriority="high"` only on primary hero image.
- Convert large photos to AVIF/WebP; keep a JPEG fallback.
- Avoid over-preloading (let browser lazy-load).

### 8. Optional LQIP (Blur-Up)
If you create tiny blurred placeholders (e.g. `*-lqip.jpg`), you can:
1. Set the placeholder as the initial `src` and swap to main image with JS OR
2. Use CSS background with blur until load event.

The sample CSS/JS already supports `data-lqip` for fade-in if you annotate images.

### 9. Form Handling Adjustments
To let Netlify handle default redirect, remove the `e.preventDefault()` block in `script.js`.  
For spam reduction: keep honeypot, optionally enable reCAPTCHA in Netlify.

### 10. Accessibility Checklist
- Each meaningful image has an informative `alt`.
- Headings hierarchical (h1 → h2).
- Focus-visible outline retained.
- Form labels associated.

### 11. Future Enhancements
| Feature | Suggestion |
|---------|------------|
| Lightbox | Add a modal enlarger for carousel images |
| Multi-property | Convert to listing grid (cards) + dynamic detail pages |
| Analytics | Add `<script defer data-domain="..." src="https://plausible.io/js/script.js"></script>` |
| Dark Mode | Add [data-theme="dark"] body toggle with CSS var overrides |
| Map | Embed Google Maps or Leaflet & geocode property coords |

### 12. Updating Site
```bash
git add .
git commit -m "Update images and alt text"
git push
```
Netlify redeploys automatically.

## License
Use freely for personal or commercial landing pages. Attribution appreciated but not required.

## Support
Feel free to request a React, Next.js, or Tailwind port.
