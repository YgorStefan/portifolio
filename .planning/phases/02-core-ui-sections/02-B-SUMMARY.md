---
phase: 02-core-ui-sections
plan: B
subsystem: hero-and-about-sections
tags: [blade, hero, about, aos, tailwind-v4, profile-photo, cv-download]
dependency_graph:
  requires: [02-A (swiper-runtime, aos-runtime, placeholder-profile-photo, placeholder-cv-pdf)]
  provides: [hero-section-content, about-section-content]
  affects: [02-E (visual-checkpoint — hero and about will be visible during browser verification)]
tech_stack:
  added: []
  patterns:
    - AOS data-aos attributes on individual elements with staggered delays (100ms increments)
    - Tailwind v4 theme tokens only — bg-bg-primary, text-accent, bg-accent, border-accent, border-accent/30, shadow-accent/10
    - asset() Blade helper for all public/ file references (profile.jpg, curriculo.pdf)
    - download attribute on CV anchor for forced file download behavior
key_files:
  created: []
  modified:
    - resources/views/pages/home.blade.php (Hero and About sections — 107 lines added, 4 stubs removed)
decisions:
  - Bio text is a placeholder in Portuguese — user must replace with real personal text before Phase 4 deployment
  - Profile photo uses asset() helper pointing to placeholder JPEG from Plan A — user must replace with real photo
metrics:
  duration_minutes: 1
  completed_date: "2026-03-25"
  tasks_completed: 2
  tasks_total: 2
  files_created: 0
  files_modified: 1
---

# Phase 2 Plan B: Hero and About Sections Summary

**One-liner:** Hero section with name, role, profile photo, AOS-animated entrance, and dual CTA buttons; About section with 3-paragraph bio, two-column layout with profile photo and CV download button — all using Tailwind v4 theme tokens.

## What Was Built

### Task 1: Hero Section

**resources/views/pages/home.blade.php** — Replaced `#hero` stub with full section:

- Profile photo: `w-36 h-36 rounded-full border-4 border-accent` with `data-aos="fade-down"` (top-entry animation)
- Name: `h1` "Ygor Stefankowski da Silva" with `data-aos="fade-up" data-aos-delay="100"`
- Role: "Desenvolvedor Full Stack" in `text-accent` with `data-aos-delay="200"`
- Tagline paragraph with `data-aos-delay="300"`
- CTA buttons: primary `bg-accent` to `#contact`, secondary `border-accent` to `#projects` — both with `transition-all duration-300 hover:-translate-y-0.5`
- Scroll indicator SVG with `animate-bounce` and `data-aos-delay="600"`
- Section background: `bg-bg-primary` with `relative overflow-hidden pt-16` for nav clearance

All image/file references use `{{ asset('...') }}` — never hardcoded paths.

### Task 2: About Section

**resources/views/pages/home.blade.php** — Replaced `#about` stub with full section:

- Section heading "Sobre Mim" with accent underline bar (`w-16 h-1 bg-accent`)
- Two-column responsive layout (`flex-col lg:flex-row`) with `gap-12`
- Text column (`data-aos="fade-right"`): 3 bio paragraphs in Portuguese + CV download button
- CV download button: `{{ asset('files/curriculo.pdf') }}` with `download="Curriculo-Ygor-Stefankowski.pdf"` attribute and download SVG icon
- Photo column (`data-aos="fade-left"`): `w-64 h-64 rounded-2xl` with decorative offset border (`border-accent/20`)
- Sections #skills, #projects, #contact stubs remain untouched per plan scope

## Verification Results

All 7 plan checks passed:

| Check | Command | Result |
|-------|---------|--------|
| HERO-01 role text | `grep "Desenvolvedor Full Stack"` | match |
| HERO-03 CTA link | `grep 'href="#contact"'` | match |
| HERO-04 + ABOUT-04 AOS count | `grep -c "data-aos"` | 9 (required >= 6) |
| ABOUT-03 download attr | `grep "download="` | match |
| ABOUT-03 CV asset | `grep "curriculo.pdf"` | match |
| HERO-02 + ABOUT-02 photo | `grep "asset('images/profile.jpg')"` | 2 matches |
| Remaining stubs intact | `grep "Skills\|Projetos\|Contato — Phase 2"` | 3 matches |

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Bio text is Portuguese placeholder | User must personalize before deployment; English was not appropriate for a PT-BR portfolio |
| `download="Curriculo-Ygor-Stefankowski.pdf"` | Without this attribute, browsers open the PDF in a new tab instead of triggering a download |
| `pt-16` on hero section | Prevents content from being hidden behind the sticky nav bar |
| `relative overflow-hidden` on hero | Enables the `absolute bottom-8` scroll indicator to be positioned relative to the section |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

| File | Content | Reason |
|------|---------|--------|
| `resources/views/pages/home.blade.php` (About bio) | Placeholder Portuguese bio text (3 paragraphs) | User must replace with real personal biography before Phase 4 deployment |
| `public/images/profile.jpg` | 148-byte JPEG placeholder (from Plan A) | User must replace with real profile photo before deployment |
| `public/files/curriculo.pdf` | Text placeholder file (from Plan A) | User must replace with real CV PDF before deployment |

The bio text and placeholder assets are intentional stubs. The Hero and About sections render correctly with the placeholders, enabling visual verification in Plan E.

## Self-Check: PASSED
