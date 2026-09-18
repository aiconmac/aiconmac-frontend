# Redesign ready for manual review

Worktree: `/private/tmp/aiconmac-design-redesign`  
Branch: `feat/design-handoff-redesign`  
Base: `637fee6`  
Implementation and checks: 18 September 2026. No merge, push, or deployment performed.

## Preview

Open [English Home](http://localhost:4173/en), [Work](http://localhost:4173/en/projects), [Arabic](http://localhost:4173/ar), or [Russian](http://localhost:4173/ru).

The running preview uses real public projects and clients through a local, read-only proxy because the production backend rejects localhost origins. It never forwards submissions. Contact, Careers, and brochure submissions were verified by intercepting requests in automated browser tests. Email and telephone links still invoke their normal local applications.

Restart if needed:

```sh
cd /private/tmp/aiconmac-design-redesign
pnpm install --frozen-lockfile
pnpm build:preview
pnpm preview
```

`pnpm build` retains the existing production API configuration and static export. `build:preview` only changes the build-time API base to `/api` for the local proxy. Do not deploy the preview export; production movement and acceptance are separate steps.

## Verification

- Unit checks: 11 passing, including project identity/order, explicit publication filtering, image ownership/malformed images, empty/malformed collections, localization, URL updates, request deduplication and retries.
- Browser checks: 23 passing against the static preview. All three locales at 1440, 1024, 768 and 390px; RTL; touch and keyboard captions; reduced motion; mobile disclosure; focus restoration; category/detail history; query/anchor preservation on language changes; delayed/error/empty/malformed responses; unavailable drafts; broken images; visibility throttling; resized filtered grids; gallery changes after revalidation.
- Contact JSON, Careers multipart (including the resume field), brochure email JSON and catalogue download pass with intercepted requests in all locales. Nothing was submitted to the real backend.
- Both normal and local-preview production builds pass. Lint passes with zero errors and 16 warnings in retained legacy components. The new ESLint 9 flat configuration surfaces the old animation/compiler issues as warnings in the specific affected files; other compiler rules remain enabled.
- Real-data local checks rendered 13 published projects, the first five image-ready projects on Home (six photographs including the leading project's second image), and the actual client directory. No browser runtime errors were observed.
- Static Home/Work manifests contain no Framer Motion, GSAP, or Three references. The inherited animated 404 was replaced with a static localized version to remove its initial bundle cost. The catalogue code loads from its footer action.
- Local bundle observations: approximately 153 KiB gzip JavaScript for Home, 154 KiB for Work; only the current locale's self-hosted font loads. These are sums of locally gzip-compressed requested JS files, not deployed transfer measurements or Lighthouse results. See [raw observations](bundle-observations.json).

Reproduce: `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build:preview`, `pnpm test:browser`. With the preview running, `node scripts/capture-review.mjs` refreshes screenshots and bundle observations using real public data.

## Independent reviews

- GPT-5.6-sol, high: backend compatibility and performance. No redesign blockers; final proxy, responsive-image and 404 changes reviewed again.
- GPT-6-astra, high: UX/accessibility/integration. Resolved count-based grid sizing, heading/gallery keyboard order, stale gallery index on refresh, and missing skip-link destinations. Follow-up image `sizes` correction also applied and browser-tested.
- Existing backend issue outside this worktree: public `GET /projects/:id` does not enforce publication status. The redesign never calls it and resolves detail only from the published collection. Backend remediation is separate from this frontend implementation.

## Visual comparison

Compared the rendered pages with `Home v6.dc.html`, `Work v3.dc.html`, and their README in the supplied design handoff. The paper/orange palette, Archivo hierarchy, ruled collage, repeated project numerals, inline detail, studio strip and numbered client rows follow the reference. Agreed changes include category filters, actual backend order/content, accessible ink on orange, locale fonts, responsive stacking, pause control, real contact details and Industrial Area 17. Unconfirmed deadlines, NDA statements, WhatsApp links and invented project/client relationships were omitted.

Screenshots: [Home desktop](en-1440-home.jpg), [Work desktop](en-1440-work.jpg), [Arabic Home phone](ar-390-home.jpg), [Russian Work tablet](ru-768-work.jpg).

## Your manual checks

1. Review Home’s typography, photo crops and spacing at desktop and phone widths.
2. Filter Work, open a project, change photos, close it, and use Back/Forward.
3. Switch English/Arabic/Russian while a filtered project is open; check translations and RTL layout.
4. Check the client directory, Contact/Careers navigation, and catalogue dialog. Preview submission forwarding is disabled.
5. Confirm the content and design before the separate production-move step.

Deployed performance audits, production readiness gates, and project-to-client filtering remain deferred as agreed.
