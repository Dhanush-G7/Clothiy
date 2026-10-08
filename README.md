# Clothiy

Run it from a local server (needed for the WebGL textures and frame loading), not by double-clicking index.html:

    cd clothiy
    python -m http.server 8080      # then open http://localhost:8080
    (or: npx serve   /   VS Code "Live Server")

Needs internet for the CDN libraries (GSAP, Lenis, Three.js) and Google Fonts.

## Where things are
- assets/frames/women/frame_0001..0240.webp  (saree scroll sequence)
- assets/frames/men/frame_0001..0240.webp    (shirt scroll sequence)
- To change the frame count, edit `total` in the SEQ object at the top of js/main.js (frames section).
- Product cards: the P array in js/main.js. Hero copy per category: the C object.
- Colors: CSS variables at the top of css/style.css.
- If a frame is missing, a midnight-to-gold placeholder with the frame number is drawn so scrolling still works.

## SEO
Replace YOUR-DOMAIN.com in robots.txt and sitemap.xml with your real domain. After hosting, add <link rel="canonical"> and og:image / product image URLs (absolute) in index.html, then run Lighthouse.
