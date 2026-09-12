# Homepage image mapping verification

Verified 2026-09-12 on `fix/homepage-image-mapping`.

The homepage fetches `/projects?isPublished=true` once per mount. It preserves API order, skips projects without a usable image URL, and keeps the selected image, localized title, description, and category in one record. Hero and Specializations use the first representative per category (maximum five); Featured Projects uses the first three usable records; About uses the first usable record. Image download failures show neutral text without substituting another project.

The read-only production response contained 13 projects. Hero/Specializations representatives were Amwaj Tower (architectural), Al Mouj Sarai (masterplan), and Greenz Danube (business-gifts). Featured Projects were Amwaj Tower, Al Mouj Sarai, and Dusit Thani. About used Amwaj Tower. Each selected image URL was checked against its exact source record, including localized title fallback for English, Arabic, and Russian.

Validation:

- `npm run build`: passed (existing middleware deprecation warning).
- `node --test tests/homepage-projects.test.mjs`: four tests passed, covering identity/order, image validation, category representatives/limits, empty responses, one slide, and localization fallback.
- Changed files checked using the installed Next core-web-vitals flat ESLint configuration: zero errors, one existing dependency warning in the testimonials/clients effect. The repository's standard `npm run lint` is blocked by its existing legacy ESLint configuration incompatibility (circular structure while loading Next's config).
- Playwright against the local production export, with captured production records and intercepted API responses: English, Arabic/RTL, Russian, desktop/mobile, delayed load, empty response, HTTP failure, missing image records, one slide, and failed image downloads passed. One project request per homepage load was confirmed.
- Specializations hover, click, keyboard focus/Enter, selection persistence after data arrival, and touch selection checked. No category is selectable before initial data arrives; the request never writes selected-category state.
- Hero photo/title relationships checked during transitions. Desktop/mobile hero and Specializations screenshots visually reviewed.
- Locale-aware portfolio links checked. Existing Masterplan filtering and project gallery next/close smoke-tested. No production forms submitted.

Backend, production data, project gallery implementation, and broader design remain outside this change.

## PR finding regressions

Both findings fixed and verified on 2026-09-12. `homepageProjects` requires an array before searching images, skips malformed records, and preserves surviving order and identity. Carousel hover, focus within, and manual selection pause independently. Mouse leave and external blur clear only their own interaction plus manual pause; internal focus transfers clear nothing. Autoplay restarts with a full five-second interval once all reasons clear, and stays disabled for fewer than two slides.

- Unit tests: 4/4 passed, including missing (deleted and explicitly undefined), null, object, string, number, boolean image containers, malformed array entries, and mixed valid/malformed records with full surviving identity and order assertions.
- External Playwright reproduction converted to assertions at `/private/tmp/aiconmac-live-preview/review.cjs`. API responses are intercepted. All assertions passed for focus surviving mouse leave, hover surviving external blur, internal focus transfers, next/previous buttons, indicators, left/right touch swipes, manual pause, and a full five-second restart. Empty, single-slide, entirely malformed, and mixed responses render without frontend errors. The test clock is frozen for deterministic interval boundaries.
- Production build passed after stopping orphaned preview frontend processes. The initial sandboxed attempt could not fetch Google Fonts; the network-enabled build passed. Existing Next middleware/static-export warnings remain.
- Changed-file lint using installed Next core-web-vitals flat configuration: zero errors; one existing Homepage testimonials/clients effect dependency warning. `git diff --check` passed.
- Two independent subagent reviews found no actionable issues in implementation or regression coverage; both independently reran all four unit tests successfully.
- Preview restarted through `/private/tmp/aiconmac-live-preview/start.mjs`. API startup gate and live browser verification passed for English, Arabic/RTL, and Russian, each with 13 published projects and a loaded source image. Verification output and screenshots remain in `/private/tmp/aiconmac-live-preview/`.

Verified preview left running: [English](http://127.0.0.1:4174/en), [Arabic](http://127.0.0.1:4174/ar), [Russian](http://127.0.0.1:4174/ru). No merge, deployment, production writes, dependency additions, public API changes, or changes to master.
