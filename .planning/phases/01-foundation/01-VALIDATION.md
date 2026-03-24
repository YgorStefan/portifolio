---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-03-24
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Note: Automated testing is explicitly out of scope for v1 per REQUIREMENTS.md. All verification is manual.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — automated testing out of scope for v1 |
| **Config file** | n/a |
| **Quick run command** | `php artisan serve` (manual visual check) |
| **Full suite command** | `npm run build` + manual browser verification |
| **Estimated runtime** | ~5 minutes (manual) |

---

## Sampling Rate

- **After every task commit:** Visual check at `php artisan serve` — confirm route renders and assets load
- **After every plan wave:** `npm run build` with no errors + manual browser check
- **Before `/gsd:verify-work`:** All 10 manual verification steps in table below must pass
- **Max feedback latency:** ~5 minutes per wave

---

## Per-Task Verification Map

| Req ID | Behavior | Test Type | Verification Method |
|--------|----------|-----------|---------------------|
| INFRA-01 | Laravel 12 project with PHP 8.2, Vite, Tailwind v4 | manual | `php artisan --version` shows Laravel 12.x; `cat package.json` shows tailwindcss ^4.x |
| INFRA-02 | `npm run build` produces `public/build/` with no errors | manual | Run `npm run build`; confirm `public/build/manifest.json` exists; no terminal errors |
| INFRA-03 | Deploy guide documents Hostinger setup | manual | Read deploy guide; verify checklist covers document root, APP_DEBUG=false, .env 403 |
| INFRA-04 | `.env.example` has all variables documented | manual | `cat .env.example` shows all required variables with comments |
| LAYOUT-01 | Blade layout renders at `GET /` | manual | `php artisan serve`, open browser, confirm header/main/footer in DevTools |
| LAYOUT-02 | Smooth-scroll nav links | manual | Click anchor links; confirm smooth scroll behavior in browser |
| LAYOUT-03 | Hamburger menu works on mobile | manual | Resize to 375px in DevTools; click hamburger; confirm open/close |
| LAYOUT-04 | Back-to-top button appears after scroll | manual | Scroll down past hero; confirm button appears; click; confirm scroll to top |
| LAYOUT-05 | Responsive at mobile/tablet/desktop | manual | DevTools device emulation at 375px, 768px, 1280px — no overflow, no broken layout |
| VIS-04 | Google Fonts load in production build | manual | `npm run build`; open `public/build/app-[hash].css`; confirm font `@import`; browser shows Inter |

---

## Wave 0 Requirements

None — no test framework infrastructure needed. All verification is manual inspection per project scope.

*Existing manual verification covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Laravel project created correctly | INFRA-01 | No automated tests in scope | Run `php artisan --version`; check `package.json` for tailwindcss ^4.x |
| Vite build produces correct output | INFRA-02 | Build tool verification | Run `npm run build`; check `public/build/manifest.json` exists |
| Deploy guide is complete | INFRA-03 | Documentation review | Read `.planning/DEPLOY.md`; verify all checklist items present |
| .env.example completeness | INFRA-04 | File content review | `cat .env.example`; confirm MAIL_* and APP_* vars present |
| Layout renders correctly | LAYOUT-01 | Browser visual | `php artisan serve`; inspect DOM in DevTools |
| Smooth scroll works | LAYOUT-02 | Browser interaction | Click nav links; observe scroll behavior |
| Mobile menu works | LAYOUT-03 | Browser interaction | DevTools 375px; click hamburger |
| Back-to-top works | LAYOUT-04 | Browser interaction | Scroll; confirm button; click |
| Responsive layout | LAYOUT-05 | Browser responsive | DevTools 375/768/1280px |
| Google Fonts in production | VIS-04 | Build output check | Inspect CSS bundle; verify font import |

---

## Validation Sign-Off

- [x] All tasks have manual verify steps
- [x] Wave 0 covers all requirements (manual-only project, no automated test gaps)
- [x] No watch-mode flags
- [ ] All 10 manual checks passed
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
