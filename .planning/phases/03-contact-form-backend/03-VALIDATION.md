---
phase: 3
slug: contact-form-backend
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual browser + CLI verification (no automated test framework — excluded from v1 scope per REQUIREMENTS.md) |
| **Config file** | None |
| **Quick run command** | `php artisan serve` |
| **Full suite command** | `npm run build && php artisan serve` |
| **Estimated runtime** | ~60 seconds (manual flow) |

---

## Sampling Rate

- **After every task commit:** Run `php artisan serve` — confirm form renders without PHP errors; `php artisan route:list` confirms `contact.send` route exists
- **After every plan wave:** Manual browser flow: submit invalid form → errors appear; submit valid form with `MAIL_MAILER=log` → success banner + log entry
- **Before `/gsd:verify-work`:** Production email delivery verified from Hostinger host
- **Max feedback latency:** ~60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | CONTACT-01 | CLI | `grep -n "route('contact.send')" resources/views/pages/home.blade.php` | ✅ | ⬜ pending |
| 3-01-02 | 01 | 1 | CONTACT-01 | CLI | `php artisan route:list --name=contact` | ✅ | ⬜ pending |
| 3-02-01 | 02 | 1 | CONTACT-02 | Manual browser | Submit empty form → inline errors appear under each field | ✅ | ⬜ pending |
| 3-02-02 | 02 | 1 | CONTACT-02 | Manual browser | Fill name+email+subject, leave message empty → only message error; other fields retain values | ✅ | ⬜ pending |
| 3-03-01 | 03 | 2 | CONTACT-03 | Manual (log) | `MAIL_MAILER=log` submit valid form → check `storage/logs/laravel.log` for email content | ✅ | ⬜ pending |
| 3-03-02 | 03 | 2 | CONTACT-03 | Manual (prod) | Submit from production host with real Brevo SMTP → email arrives in owner inbox | ✅ | ⬜ pending |
| 3-04-01 | 03 | 2 | CONTACT-04 | Manual browser | Valid submit → page reloads at #contact with green success banner visible | ✅ | ⬜ pending |
| 3-04-02 | 03 | 2 | CONTACT-04 | Manual browser | Submit form → button shows "Enviando..." and is disabled until redirect | ✅ | ⬜ pending |
| 3-05-01 | 04 | 2 | CONTACT-05 | Manual browser | Submit form 6 times quickly from same IP → 6th returns HTTP 429 throttle error | ✅ | ⬜ pending |
| 3-06-01 | 04 | 2 | CONTACT-06 | CLI + Visual | `grep -n "wa.me\|linkedin\|github\|mailto" resources/views/pages/home.blade.php` → real URLs present; click each in browser → opens correct target | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None — no test infrastructure setup needed. All verification is manual browser + CLI inspection as per project scope (automated tests are Out of Scope for v1 per REQUIREMENTS.md).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Inline field errors on invalid submit | CONTACT-02 | No automated test framework in scope | Submit with empty fields → errors appear under each field; submit with "notanemail" → email field error appears |
| PRG pattern — no double-submit on refresh | CONTACT-02 | Browser behavior only | Submit valid form → press F5 → browser shows "resend form?" dialog, NOT duplicate email sent |
| Email delivered to owner inbox | CONTACT-03 | Requires real SMTP + production host | Submit from Hostinger host with Brevo credentials → email arrives in inbox within 60s |
| Success/error banner visibility | CONTACT-04 | Visual browser check | Valid submit → green "Mensagem enviada" banner at #contact; SMTP failure → red error banner |
| Submit button disabled in-flight | CONTACT-04 | Browser behavior only | Submit form → observe button shows "Enviando..." text and `disabled` attribute until redirect |
| Rate limit 429 after 5 req/min | CONTACT-05 | Requires 6 sequential browser submits | Submit valid form 6 times in under 60s from same IP → 6th returns throttle error page |
| Social links open correct targets | CONTACT-06 | External URL validation | Click GitHub, LinkedIn, WhatsApp, Email links → each opens correct external profile/page |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
