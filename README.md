# Offshore Creative — Music website

This package contains the MUSIC website, not the property website currently shown at dj-offshore.vercel.app.

## Deploy through GitHub and Vercel

1. Extract this ZIP on your computer. Do not upload the ZIP itself to GitHub.
2. Upload ALL extracted contents together to the repository root, including the entire assets folder. index.html, app.js, style.css, gsap.min.js, vercel.json, and assets/ must be at the same level. Preserve assets/club-gallery/ as a subfolder.
3. If updating an existing repository, replace the corresponding code files too. Do not combine this music assets folder with the old property index.html.
4. In Vercel Settings > Build and Deployment, use Framework Preset: Other. Use the repository root as Root Directory. Leave Build Command empty. Set Output Directory to a single dot (.) if an override is enabled, or disable the override to use vercel.json. This package has no dist directory and needs no package installation or compilation.
5. Deploy the latest commit. If Vercel already deployed before you corrected the settings, redeploy after saving them.
6. Check /assets/brand.png on the deployed domain. Then check the hero video, slide controls, project videos, photography gallery, and mobile navigation.

## Included files

All 42 referenced image/font assets are included. The page, styles, scripts, and media URLs are preserved from the uploaded music export. The package only simplifies folder structure and updates deployment configuration/instructions.

## Video behavior

Videos stream from the external Offshorecreative GitHub URLs already in the source. MP4 files are intentionally not bundled. Playback requires those URLs to remain publicly accessible and is subject to browser autoplay settings.

ONYX BALI — Heatmap opens a poster and a Watch on YouTube link; the original export does not contain its direct MP4 URL.

## Local preview

Run python3 -m http.server 8000 from this folder (Windows: py -3 -m http.server 8000), then visit http://localhost:8000.
