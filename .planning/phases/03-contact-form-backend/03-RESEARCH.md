# Phase 3: Contact Form Backend — Research

**Researched:** 2026-03-24
**Domain:** Laravel 13 Mail (Mailable), server-side validation, POST/Redirect/GET, rate limiting, transactional SMTP (Brevo vs Resend), Alpine.js submit loading state
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONTACT-01 | Formulário com campos: nome, e-mail, assunto e mensagem | HTML structure already built in Phase 2 (home.blade.php #contact section) — Phase 3 wires action, method, @csrf |
| CONTACT-02 | Validação server-side com feedback de erro inline | Laravel $request->validate() + @error Blade directive + old() repopulation — full POST/Redirect/GET pattern |
| CONTACT-03 | Envio via Laravel Mail (SMTP) com mensagem chegando ao e-mail do proprietário | Laravel Mailable class + Mail::to()->send() — Brevo SMTP (300/day) or Resend API (100/day) as transport |
| CONTACT-04 | Feedback visual de sucesso/erro após envio | session()->flash() + Blade @if($errors->any()) / @if(session('success')) banners wired in Blade |
| CONTACT-05 | Rate limiting no endpoint de contato (máximo 5 envios/minuto por IP) | Laravel RateLimiter::for('contact') in AppServiceProvider + Route::middleware('throttle:contact') |
| CONTACT-06 | Links sociais visíveis: GitHub, LinkedIn, WhatsApp, E-mail | Already implemented in Phase 2 Blade — Phase 3 replaces placeholder URLs with real ones and verifies opening correctly |
</phase_requirements>

---

## Summary

Phase 3 is a pure backend wiring phase — the UI structure is already complete. Phase 2 deliberately left the contact form with an empty `action=""`, no `@csrf`, and no `method="POST"` to avoid CSRF errors during UI development. Phase 3's job is to add the POST route, `ContactController`, `ContactMailable`, server-side validation, email dispatch, rate limiting, and success/error feedback — then finalize the social link placeholder URLs.

The two critical decisions are: (1) **which transactional email provider to use**, and (2) **how to structure the success/error UX**. For the provider, Brevo (via SMTP relay) and Resend (via native Laravel API driver) are both compatible with Laravel 13 and shared hosting. Brevo offers 300 emails/day free vs Resend's 100/day. Resend requires zero additional composer packages (its services.php entry is already present in `config/services.php`). Brevo SMTP requires `symfony/brevo-mailer:^7.4` and `symfony/http-client:^7.4` — both verified compatible with this project's PHP 8.3 and symfony/mailer v7.4.6. **Recommendation: use Brevo SMTP** — higher free tier (3x more headroom) and SMTP approach works identically on shared hosting without requiring outbound HTTP to a separate API endpoint.

The success/error UX follows the standard Laravel PRG (Post-Redirect-Get) pattern: on success, redirect to `/#contact` with `session()->flash('success', ...)` and display a green banner; on validation failure, `$request->validate()` auto-redirects back with `$errors` and `old()` input preserved. The Alpine.js submit button disable pattern prevents double submission during the in-flight request.

**Primary recommendation:** Create `ContactController`, `ContactMailable`, define a named rate limiter `contact` (5/min per IP), add `POST /contact` route with `throttle:contact`, implement PRG flow, wire Brevo SMTP credentials. Phase 3 requires zero new npm packages — only composer packages and PHP/Blade changes.

---

## Standard Stack

### Core (already installed — no new npm packages needed)

| Library | Version | Purpose | Note |
|---------|---------|---------|------|
| laravel/framework | 13.2.0 | Mail, Validation, Rate Limiting, Routing | Already installed — all Phase 3 features are built-in |
| alpinejs | 3.15.8 | Submit button disable/loading state | Already installed — reuse x-data pattern |

### New Composer Packages (choose Brevo OR Resend path)

**Option A — Brevo SMTP (recommended):**

| Package | Version | Purpose | Why |
|---------|---------|---------|-----|
| symfony/brevo-mailer | ^7.4 (resolves to 7.4.0) | Brevo transport for Symfony Mailer | 300 emails/day free; SMTP relay works on all shared hosting |
| symfony/http-client | ^7.4 (resolves to 7.4.7) | HTTP client required by brevo-mailer | Dependency of brevo-mailer |

**Option B — Resend API (zero packages):**

| Package | Version | Purpose | Why |
|---------|---------|---------|-----|
| resend/resend-php | ^1.1 (resolves to 1.1.1) | Resend API driver | 100 emails/day free; `config/services.php` already has resend key; native Laravel 13 driver |

**Decision rationale:**
- Brevo free tier: 300 emails/day — significantly more headroom for a portfolio
- Resend free tier: 100 emails/day — sufficient for a portfolio but tighter
- Brevo: SMTP relay transport — works on any shared hosting without outbound HTTPS API restrictions
- Resend: API-based transport — requires the host to allow outbound HTTPS to api.resend.com
- Hostinger shared hosting allows outbound HTTPS (standard), so both work
- `config/services.php` already has a `resend` entry — zero config changes for Resend
- **Use Brevo** unless Resend's developer experience is preferred over free tier volume

**Installation (Brevo path — recommended):**
```bash
composer require "symfony/brevo-mailer:^7.4" "symfony/http-client:^7.4" --ignore-platform-req=ext-fileinfo
```

**Installation (Resend path — alternative):**
```bash
composer require resend/resend-php --ignore-platform-req=ext-fileinfo
```

Note: `--ignore-platform-req=ext-fileinfo` is required on this Windows dev machine because `ext-fileinfo` is not enabled in the local PHP CLI. It is enabled on Hostinger — this flag is dev-only.

**Version verification (confirmed 2026-03-24 via `composer show` + dry-run):**
```
symfony/brevo-mailer    v7.4.0   (PHP 8.2+ compatible, works with symfony/mailer v7.4.6 in project)
symfony/http-client     v7.4.7
resend/resend-php       v1.1.1
```

---

## Architecture Patterns

### Recommended Project Structure (additions to Phase 2)

```
app/
├── Http/Controllers/
│   ├── PortfolioController.php    # existing — unchanged
│   └── ContactController.php      # NEW: store() method, validation, Mail dispatch
├── Mail/
│   └── ContactFormMail.php        # NEW: Mailable for owner notification email
├── Providers/
│   └── AppServiceProvider.php     # EDIT: add RateLimiter::for('contact', ...) in boot()
resources/
├── views/
│   ├── pages/
│   │   └── home.blade.php         # EDIT: add action, method, @csrf, @error, old(), banners, Alpine loading state
│   └── mail/
│       └── contact.blade.php      # NEW: email template for owner notification
routes/
└── web.php                        # EDIT: add POST /contact route with throttle:contact middleware
.env                               # EDIT: add MAIL_MAILER, MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD, MAIL_OWNER_ADDRESS
.env.example                       # EDIT: uncomment and document mail variables
```

### Pattern 1: POST /contact Route with Rate Limiting

**What:** Named rate limiter defined in AppServiceProvider, applied to the POST route.

**When to use:** Any form submission endpoint that should be protected against abuse.

**Example:**
```php
// app/Providers/AppServiceProvider.php
// Source: https://laravel.com/docs/13.x/routing#rate-limiting

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

public function boot(): void
{
    RateLimiter::for('contact', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip());
    });
}
```

```php
// routes/web.php
use App\Http\Controllers\ContactController;

Route::get('/', [PortfolioController::class, 'index'])->name('home');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:contact')
    ->name('contact.send');
```

**Note:** When the rate limit is exceeded, Laravel automatically returns HTTP 429 Too Many Requests. For a traditional form (not XHR), this means the user sees the Laravel default 429 page unless a custom `429.blade.php` is added. For a portfolio contact form, the default 429 page is acceptable; a custom one is a bonus.

### Pattern 2: ContactController — Validate + Mail + PRG

**What:** Standard Laravel PRG (Post/Redirect/Get) with `$request->validate()`. On failure, auto-redirect back preserves input and puts errors in `$errors`. On success, mail is sent, then redirect to `/#contact` with flashed success message.

**When to use:** Any traditional HTML form in a Laravel app (not JSON/XHR).

**Example:**
```php
// app/Http/Controllers/ContactController.php
// Source: https://laravel.com/docs/13.x/validation

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        // CONTACT-02: server-side validation
        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:100'],
            'email'   => ['required', 'email', 'max:100'],
            'subject' => ['required', 'string', 'max:150'],
            'message' => ['required', 'string', 'max:3000'],
        ]);

        // CONTACT-03: send email to owner
        try {
            Mail::to(config('mail.owner_address'))
                ->send(new ContactFormMail($validated));

            // CONTACT-04: success feedback
            return redirect('/#contact')
                ->with('success', 'Mensagem enviada com sucesso! Responderei em breve.');
        } catch (\Throwable $e) {
            // CONTACT-04: failure feedback
            return redirect('/#contact')
                ->withInput()
                ->with('error', 'Erro ao enviar mensagem. Tente novamente mais tarde.');
        }
    }
}
```

**Key details:**
- `$request->validate()` throws `ValidationException` on failure — Laravel auto-redirects back with `$errors` and flashed old input. No manual handling needed.
- `config('mail.owner_address')` reads from a `MAIL_OWNER_ADDRESS` env variable — added to `config/mail.php`.
- The `try/catch` wraps only the mail dispatch, not the validation. Validation exceptions are handled by Laravel's exception handler.
- On success, redirect to `/#contact` (home page, scrolled to contact section) rather than a separate `/contact/success` URL — keeps the single-page feel.

### Pattern 3: ContactFormMail Mailable

**What:** Laravel 13 Mailable with `envelope()`, `content()`, `attachments()` methods. Public constructor properties are auto-available in the Blade view.

**When to use:** Any email notification in Laravel.

**Example:**
```php
// app/Mail/ContactFormMail.php
// Source: https://laravel.com/docs/13.x/mail

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly array $formData,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [\Illuminate\Mail\Mailables\Address::make($this->formData['email'], $this->formData['name'])],
            subject: '[Portfólio] ' . $this->formData['subject'],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.contact',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
```

**Key details:**
- `replyTo` on the `Envelope` means the owner can hit "Reply" in their email client and the reply goes directly to the sender — critical UX for a contact form.
- The `from` address comes from the global `config/mail.php` `from` setting (which reads `MAIL_FROM_ADDRESS`). Do NOT override `from` on the Envelope — use the global setting.
- `$this->formData` is a public property — available in `mail/contact.blade.php` as `$formData`.
- `[Portfólio]` prefix on subject helps the owner identify portfolio contacts in their inbox.

### Pattern 4: Mail Blade Template

**What:** Minimal plain-HTML email template. No framework CSS — email clients do not support it.

**When to use:** All email templates in Laravel.

**Example:**
```blade
{{-- resources/views/mail/contact.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR">
<body style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #3b82f6;">Nova mensagem do portfólio</h2>

    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px; font-weight: bold; width: 100px;">Nome:</td>
            <td style="padding: 8px;">{{ $formData['name'] }}</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold;">E-mail:</td>
            <td style="padding: 8px;">{{ $formData['email'] }}</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Assunto:</td>
            <td style="padding: 8px;">{{ $formData['subject'] }}</td>
        </tr>
        <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; vertical-align: top;">Mensagem:</td>
            <td style="padding: 8px;">{{ nl2br(e($formData['message'])) }}</td>
        </tr>
    </table>

    <hr style="margin: 20px 0; border: 1px solid #eee;">
    <p style="color: #888; font-size: 12px;">
        Enviado através do formulário em {{ config('app.url') }}
    </p>
</body>
</html>
```

**Key detail:** `nl2br(e($formData['message']))` — `e()` HTML-encodes to prevent XSS, `nl2br()` converts newlines to `<br>` for readability. Order matters: escape before converting newlines.

### Pattern 5: Blade Inline Error Display with old() Repopulation

**What:** Laravel's `@error` directive and `old()` helper implement inline validation feedback without losing valid field values.

**When to use:** Every form input in a Laravel traditional form.

**Example:**
```blade
{{-- resources/views/pages/home.blade.php (contact form section) --}}

{{-- Add to form tag: --}}
<form action="{{ route('contact.send') }}"
      method="POST"
      class="space-y-6"
      id="contact-form"
      x-data="{ submitting: false }"
      @submit="submitting = true">
    @csrf

    {{-- Success banner -- CONTACT-04 --}}
    @if(session('success'))
        <div class="bg-green-900/30 border border-green-500/30 text-green-400 rounded-lg px-4 py-3 text-sm">
            {{ session('success') }}
        </div>
    @endif

    {{-- Error banner (mail dispatch failure) -- CONTACT-04 --}}
    @if(session('error'))
        <div class="bg-red-900/30 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
            {{ session('error') }}
        </div>
    @endif

    {{-- General validation error summary (optional but good for a11y) --}}
    @if($errors->any())
        <div class="bg-red-900/30 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
            Por favor, corrija os erros abaixo.
        </div>
    @endif

    {{-- Name field --}}
    <div>
        <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nome</label>
        <input type="text"
               id="name"
               name="name"
               value="{{ old('name') }}"
               placeholder="Seu nome completo"
               class="w-full bg-bg-primary border rounded-lg px-4 py-3 text-white placeholder-gray-500
                      focus:outline-none focus:ring-1 transition-colors duration-300
                      @error('name') border-red-500 focus:border-red-500 focus:ring-red-500
                      @else border-gray-700 focus:border-accent focus:ring-accent @enderror">
        @error('name')
            <p class="mt-1 text-sm text-red-400">{{ $message }}</p>
        @enderror
    </div>

    {{-- Submit button with Alpine loading state -- CONTACT-04 --}}
    <button type="submit"
            :disabled="submitting"
            class="w-full bg-accent hover:bg-accent/90 text-white font-semibold
                   py-3 px-6 rounded-lg transition-all duration-300 hover:-translate-y-0.5
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            x-text="submitting ? 'Enviando...' : 'Enviar Mensagem'">
        Enviar Mensagem
    </button>
</form>
```

**Key details:**
- `value="{{ old('name') }}"` repopulates text inputs — prevents losing valid data on validation failure (CONTACT-02).
- For `<textarea>`, use `{{ old('message') }}` as the element content (not a `value` attribute): `<textarea ...>{{ old('message') }}</textarea>`.
- `@error('name') border-red-500 @else border-gray-700 @enderror` — Tailwind conditional class using Blade. No JS needed.
- Alpine `x-data="{ submitting: false }" @submit="submitting = true"` on the `<form>` tag disables the button on first submit — prevents double submission.
- `x-text="submitting ? 'Enviando...' : 'Enviar Mensagem'"` provides visual feedback (CONTACT-03 success criteria: "button is disabled while the request is in flight").
- `disabled:opacity-50` and `disabled:cursor-not-allowed` are Tailwind v4 variant classes for disabled state styling.

### Pattern 6: Brevo SMTP Config (recommended provider)

**What:** Configure Laravel's SMTP mailer to use Brevo's relay. Install Symfony Brevo Mailer bridge. Add config/mail.php `owner_address` key.

**When to use:** Production mail sending via Brevo free tier (300/day).

**.env additions (Brevo path):**
```dotenv
MAIL_MAILER=brevo
MAIL_FROM_ADDRESS=contato@yourdomain.com
MAIL_FROM_NAME="Portfólio Ygor"
MAIL_OWNER_ADDRESS=ygor@youremail.com

BREVO_KEY=xsmtp-your-api-key-here
```

**config/mail.php additions:**
```php
// In the 'mailers' array, add:
'brevo' => [
    'transport' => 'brevo',
],

// After the 'mailers' array, add:
'owner_address' => env('MAIL_OWNER_ADDRESS', ''),
```

**Note:** Brevo uses its API key as the SMTP password. The Symfony Brevo Mailer bridge reads `BREVO_KEY` and handles authentication automatically — no `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` needed when using the `brevo` transport (unlike raw SMTP).

**Alternative: Brevo as raw SMTP (no extra packages):**
If you prefer not to install `symfony/brevo-mailer`, Brevo also works as a plain SMTP relay:
```dotenv
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your-brevo-login@email.com
MAIL_PASSWORD=your-brevo-smtp-api-key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=contato@yourdomain.com
MAIL_FROM_NAME="Portfólio Ygor"
MAIL_OWNER_ADDRESS=ygor@youremail.com
```
This approach uses the built-in `smtp` mailer — no composer package needed. `MAIL_USERNAME` is your Brevo account login email; `MAIL_PASSWORD` is the SMTP API key (not your account password) — found in Brevo dashboard under SMTP & API > SMTP.

**Recommendation: use the plain SMTP approach with Brevo** — zero additional composer packages, works with the SMTP mailer already in `config/mail.php`, and is the most portable approach for shared hosting.

### Pattern 7: Resend Config (alternative provider)

**What:** Laravel 13 has native Resend driver support. `config/services.php` already has the `resend` entry.

**When to use:** If 100 emails/day is sufficient and developer simplicity is preferred.

**.env additions (Resend path):**
```dotenv
MAIL_MAILER=resend
MAIL_FROM_ADDRESS=contato@yourdomain.com
MAIL_FROM_NAME="Portfólio Ygor"
MAIL_OWNER_ADDRESS=ygor@youremail.com
RESEND_API_KEY=re_your_key_here
```

**Note:** `config/services.php` already has `'resend' => ['key' => env('RESEND_API_KEY')]`. No config file changes required.

**Requirement:** The domain used in `MAIL_FROM_ADDRESS` must be verified in the Resend dashboard — Resend cannot send from unverified domains. Free accounts can only send from `onboarding@resend.dev` until a domain is added. This is a setup step that requires DNS record changes.

### Anti-Patterns to Avoid

- **No `@csrf` in the form:** Laravel rejects POST requests without a valid CSRF token with HTTP 419. Phase 2 left `@csrf` out deliberately — Phase 3 MUST add it.
- **Forgetting to add `method="POST"` to the form:** Phase 2 left `method="POST"` as a note. Must be confirmed in the actual HTML.
- **Using `$request->input()` after `$request->validate()` fails:** Validation throws an exception on failure; code after `$request->validate()` never runs. `old()` in Blade reads from the session flash, not the request.
- **`old()` without `value=` on textarea:** Textarea repopulation uses the element body: `<textarea>{{ old('message') }}</textarea>`. Using `value=` attribute on textarea is invalid HTML and does nothing.
- **Sending from an unverified domain with Resend:** Resend blocks sends from domains that haven't been DNS-verified. On free tier, only `onboarding@resend.dev` works out of the box. Use Brevo SMTP to avoid this DNS verification requirement for initial testing.
- **Redirect to `'/'` without fragment:** After a successful send, redirect to `redirect('/#contact')` — using the fragment anchor keeps the user at the contact section. `redirect()->route('home')` goes to the top of the page, which is disorienting after form submission.
- **Queuing the mail:** The project explicitly forbids queues (`REQUIREMENTS.md`: "Sistema de filas — Shared hosting sem worker daemon"). `Mail::to()->send()` (synchronous) is the correct approach.
- **Disabling the button with `@click` instead of `@submit`:** Disabling on `@click` can prevent form submission in some browsers (the click disables before submit fires). Use `@submit="submitting = true"` on the `<form>` tag — the form submits before Alpine processes the event.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email transport | Custom SMTP socket code | `MAIL_MAILER=smtp` + Brevo relay | TLS handshake, authentication, retry logic already handled |
| Validation with error messages | Manual `if(empty($field))` checks | `$request->validate()` | Auto-redirects on failure, flashes errors + old input, integrates with `@error` and `old()` |
| CSRF protection | Custom token generation | Laravel `@csrf` + middleware | Built-in, tied to session, automatic 419 on mismatch |
| Rate limiting | IP tracking in database/cache | `RateLimiter::for()` + `throttle` middleware | Built-in, file-cache backed, automatic 429 response, no extra packages |
| PRG pattern | Manual session flash + form re-render | `$request->validate()` auto-redirect + `redirect()->with()` | Laravel handles the entire flow automatically — validation exceptions redirect with errors |
| Double-submit prevention | Vanilla JS click handler | Alpine `@submit="submitting = true"` | Two lines of Blade, no separate JS file, already in the Alpine bundle |

**Key insight:** Every CONTACT requirement maps to a built-in Laravel feature. Phase 3 writes almost no logic — it wires existing framework features together.

---

## Runtime State Inventory

Step 2.5 SKIPPED — Phase 3 is not a rename/refactor/migration phase. It adds new routes, controllers, and mail config. No existing runtime state is renamed or migrated.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| PHP | Laravel backend | Yes | 8.3.30 (local) / 8.2.x (Hostinger) | — |
| Composer | Package management | Yes | 2.9.5 | — |
| php.ini ext-fileinfo | composer install | NOT enabled (local Windows CLI) | — | `--ignore-platform-req=ext-fileinfo` on dev machine; enabled on Hostinger |
| Brevo account | SMTP relay (Option A) | Not yet created | — | Sign up at brevo.com (free) |
| Resend account | API driver (Option B) | Not yet created | — | Sign up at resend.com (free) |
| MAIL_OWNER_ADDRESS email | Owner notification | Configured in .env | — | User must set real email before testing |
| Custom domain DNS | Resend from-address verification | Not verified | — | Use Brevo SMTP to avoid this requirement |

**Missing dependencies with no fallback:**
- An email account (Brevo or Resend) must be created and credentials added to `.env` before CONTACT-03 can be verified in production. For local development, `MAIL_MAILER=log` works immediately — emails are written to `storage/logs/laravel.log`.

**Missing dependencies with fallback:**
- `ext-fileinfo` not enabled locally — use `--ignore-platform-req=ext-fileinfo` flag. This is a local Windows dev environment quirk; Hostinger has `ext-fileinfo` enabled.
- Transactional provider not yet chosen — use `MAIL_MAILER=log` for local development (zero setup).

---

## Common Pitfalls

### Pitfall 1: Form Submits to Wrong URL / 405 Method Not Allowed

**What goes wrong:** After adding the route, the form sends a GET request or gets a 405 error.
**Why it happens:** Phase 2 left `action=""` and did not include `method="POST"`. If the form is not updated to add `action="{{ route('contact.send') }}"` and `method="POST"`, the browser submits a GET to the current URL.
**How to avoid:** In Phase 3, the home.blade.php form MUST receive: `action="{{ route('contact.send') }}"`, `method="POST"`, and `@csrf`.
**Warning signs:** Network tab shows a GET request to `/` after form submit; or 405 Method Not Allowed if `method="POST"` is present but the route is GET.

### Pitfall 2: 419 Page Expired (CSRF Token Mismatch)

**What goes wrong:** Form submission returns "419 Page Expired" error.
**Why it happens:** Missing `@csrf` in the form. Laravel's `VerifyCsrfToken` middleware rejects the request.
**How to avoid:** `@csrf` must appear inside the `<form>` tag, before any input fields. The `@csrf` directive renders a hidden `<input type="hidden" name="_token" value="...">` element.
**Warning signs:** HTTP 419 response in browser dev tools; "Page Expired" page.

### Pitfall 3: Rate Limiter Not Registered Before Route Is Resolved

**What goes wrong:** `throttle:contact` middleware throws "Rate limiter [contact] is not defined."
**Why it happens:** `RateLimiter::for('contact', ...)` must be called in `AppServiceProvider::boot()` before any request hits the throttle middleware. If registered elsewhere (e.g., in a Controller constructor), the order of execution may miss the registration.
**How to avoid:** Always define named rate limiters in `AppServiceProvider::boot()`.
**Warning signs:** `RuntimeException: Rate limiter [contact] is not defined` in logs.

### Pitfall 4: `replyTo` Omitted on ContactFormMail Envelope

**What goes wrong:** Owner receives the email but cannot reply to the sender — "Reply" goes to the `MAIL_FROM_ADDRESS` (the app's sending address) instead of the contact form submitter.
**Why it happens:** The `from` address is the app's SMTP account. The `replyTo` must be explicitly set to the contact form submitter's email.
**How to avoid:** Set `replyTo` on the `Envelope` to the submitter's email and name: `new Address($this->formData['email'], $this->formData['name'])`. This is documented in Pattern 3 above.
**Warning signs:** Clicking "Reply" in the owner's email client opens a reply to the app's SMTP address, not the contact form submitter.

### Pitfall 5: Mail Sending Fails Silently Without try/catch

**What goes wrong:** SMTP credentials are wrong or Brevo is unreachable. `Mail::to()->send()` throws an exception. Without a `try/catch`, Laravel's exception handler returns a 500 error page instead of showing a user-friendly error.
**Why it happens:** `Mail::to()->send()` is synchronous and can throw `\Throwable` on SMTP failure. Laravel does not auto-redirect on mail exceptions the way it does on validation exceptions.
**How to avoid:** Wrap the mail send in `try/catch (\Throwable $e)` and redirect back with `session()->flash('error', ...)` on failure. See Pattern 2.
**Warning signs:** User sees a Laravel error page (or blank page in production) instead of an error banner after form submission.

### Pitfall 6: `textarea` Repopulation With Value Attribute

**What goes wrong:** After validation failure, the message field is empty even though the user had typed something.
**Why it happens:** `<textarea value="{{ old('message') }}">` is invalid HTML — textarea does not support the `value` attribute. The content goes between the tags.
**How to avoid:** `<textarea name="message" ...>{{ old('message') }}</textarea>`.
**Warning signs:** Message field is empty after validation redirect while name/email/subject fields retain their values.

### Pitfall 7: Alpine `@click` on Submit Button Blocks Submission

**What goes wrong:** Clicking "Enviar Mensagem" does nothing — the form never submits.
**Why it happens:** If `@click="submitting = true"` is on the button (not the form), setting `submitting = true` may disable the button before the click event fully propagates, preventing the native form submission.
**How to avoid:** Put `@submit="submitting = true"` on the `<form>` tag. The `submit` event fires after the native form submission begins — no conflict with Alpine.
**Warning signs:** Button shows "Enviando..." but no network request appears in DevTools; or clicking the button has no visible effect.

### Pitfall 8: Brevo SMTP Raw Password vs API Key

**What goes wrong:** SMTP authentication fails when using raw account password.
**Why it happens:** Brevo's SMTP relay uses a dedicated SMTP API key as the password (found in Brevo dashboard under SMTP & API > SMTP), not the account login password.
**How to avoid:** `MAIL_PASSWORD` must be set to the SMTP API key from Brevo dashboard, not the Brevo account password. `MAIL_USERNAME` is the Brevo account login email.
**Warning signs:** `535 Authentication failed` error in logs; `storage/logs/laravel.log` shows SMTP error.

---

## Code Examples

### ContactController (complete)

```php
// app/Http/Controllers/ContactController.php
// Source: https://laravel.com/docs/13.x/validation + https://laravel.com/docs/13.x/mail

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:100'],
            'email'   => ['required', 'email', 'max:100'],
            'subject' => ['required', 'string', 'max:150'],
            'message' => ['required', 'string', 'max:3000'],
        ]);

        try {
            Mail::to(config('mail.owner_address'))
                ->send(new ContactFormMail($validated));

            return redirect('/#contact')
                ->with('success', 'Mensagem enviada com sucesso! Responderei em breve.');
        } catch (\Throwable $e) {
            return redirect('/#contact')
                ->withInput()
                ->with('error', 'Erro ao enviar mensagem. Tente novamente mais tarde.');
        }
    }
}
```

### Rate Limiter in AppServiceProvider

```php
// app/Providers/AppServiceProvider.php
// Source: https://laravel.com/docs/13.x/routing#rate-limiting

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

public function boot(): void
{
    RateLimiter::for('contact', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip());
    });
}
```

### routes/web.php (final state)

```php
// routes/web.php
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PortfolioController::class, 'index'])->name('home');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:contact')
    ->name('contact.send');
```

### .env additions for Brevo raw SMTP (recommended zero-package approach)

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your-brevo-login@email.com
MAIL_PASSWORD=your-brevo-smtp-api-key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=contato@yourdomain.com
MAIL_FROM_NAME="Portfólio Ygor"
MAIL_OWNER_ADDRESS=ygor@youremail.com
```

### config/mail.php — add owner_address key

```php
// Add AFTER the 'from' array in config/mail.php:
'owner_address' => env('MAIL_OWNER_ADDRESS', ''),
```

### Local dev .env override (test without real credentials)

```dotenv
MAIL_MAILER=log
```
With `MAIL_MAILER=log`, all emails are written to `storage/logs/laravel.log` instead of being sent. Zero setup required to verify the PRG flow, validation, and error messages during development.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Queued mail jobs | Synchronous `Mail::to()->send()` | Project decision (shared hosting) | No queue worker needed; slight latency on form submit acceptable |
| `$mailer->send()` with closures | Mailable class with `envelope()`, `content()` | Laravel 9+ | Clean OOP structure; no closure-based mail |
| `->withErrors($validator)` manual | `$request->validate()` auto-throws + redirect | Laravel 5+ standard | Framework handles redirect, error flash, and old input automatically |
| Custom CSRF token logic | `@csrf` Blade directive | Laravel 5+ standard | One directive; auto-rotates token |
| `Route::get('/contact/throttle')` with manual counter | `RateLimiter::for()` + `throttle` middleware | Laravel 8+ | Cache-backed, per-IP, zero application code |
| Sendinblue (old name) | Brevo (renamed 2023) | 2023 | Same service, new name — `smtp-relay.brevo.com` is the current hostname |

**Deprecated / outdated:**
- `MAIL_DRIVER=smtp` (old key): Laravel now uses `MAIL_MAILER`. `MAIL_DRIVER` still works as a fallback but is not documented in Laravel 10+.
- `Mail::send(new ContactMail())` without `Mail::to()`: Valid in old versions but the fluent `Mail::to($address)->send(new Mailable())` is the current documented pattern.
- `$request->get('field')` before validate: Do not use request input before validating it — use only the `$validated` array after `$request->validate()` returns.

---

## Open Questions

1. **Which transactional provider to use: Brevo SMTP or Resend API?**
   - What we know: Brevo 300/day free vs Resend 100/day; Brevo raw SMTP requires zero composer packages; Resend `config/services.php` already has its key entry; Resend requires domain DNS verification before sending from a custom domain
   - What's unclear: Whether the user already has a Brevo or Resend account; whether the deployment domain is set up
   - Recommendation: Use Brevo raw SMTP — higher free tier limit, no extra packages, works without domain DNS verification (Brevo verifies the sender domain through SPF/DKIM but allows sending before full verification), simpler `.env` setup for shared hosting

2. **Custom 429 error page for rate limit exceeded?**
   - What we know: When `throttle:contact` fires (>5 requests/minute), Laravel returns HTTP 429 with the default Laravel error page
   - What's unclear: Whether a custom `resources/views/errors/429.blade.php` should be created
   - Recommendation: Not required for Phase 3. The rate limit protects against abuse; real users will never hit it. Add as Phase 4 polish if desired.

3. **CONTACT-06: Social link placeholder URLs**
   - What we know: Phase 2 hard-coded placeholder URLs (`https://github.com/ygor-stefankowski`, `https://linkedin.com/in/ygor-stefankowski`, `https://wa.me/55XXXXXXXXXXX`, `mailto:ygor@example.com`) and placeholder phone/email display text
   - What's unclear: The user's real GitHub username, LinkedIn handle, WhatsApp number, and contact email
   - Recommendation: Phase 3 plan should include a task that lists all four URLs and prompts the user to supply their real values. The planner should make this a concrete task, not a vague "update URLs" note.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual browser + CLI verification (no automated test framework — excluded from v1 scope per REQUIREMENTS.md) |
| Config file | None |
| Quick run command | `php artisan serve` then manual browser check |
| Full suite command | `npm run build && php artisan serve` |

**Note:** REQUIREMENTS.md explicitly lists "Testes automatizados" as Out of Scope for v1.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Verification Method |
|--------|----------|-----------|---------------------|
| CONTACT-01 | Form has name, email, subject, message fields; action, method, @csrf wired | CLI + Visual | `grep -n "route('contact.send')" resources/views/pages/home.blade.php` — match found; browser submit visible |
| CONTACT-02 | Empty submit shows inline errors; valid fields remain populated | Manual browser | Submit with empty fields → errors appear under each field; fill name+email+subject, leave message empty → only message error appears; name/email/subject retain values |
| CONTACT-02 | Malformed email shows email error | Manual browser | Enter "notanemail" in email field → email field error appears |
| CONTACT-03 | Valid form delivers email to owner inbox | Manual (production) | Submit from production host with real Brevo credentials → email arrives in owner inbox. Local: `MAIL_MAILER=log` then check `storage/logs/laravel.log` for email content |
| CONTACT-04 | Success banner appears after valid submit | Manual browser | Submit valid form → page reloads at #contact with green "Mensagem enviada" banner |
| CONTACT-04 | Button disabled during submission | Manual browser | Submit form → button shows "Enviando..." and is unclickable until redirect |
| CONTACT-05 | 6th request in 1 minute returns throttle error | Manual browser | Submit form 6 times quickly → 6th request returns HTTP 429 |
| CONTACT-06 | Social links visible and open correctly | Visual + CLI | `grep -n "wa.me\|linkedin\|github\|mailto" resources/views/pages/home.blade.php` → real URLs; click each in browser → opens correct target |

### Sampling Rate

- **Per task commit:** `php artisan serve` — confirm form renders without PHP errors; `php artisan route:list` confirms `contact.send` route exists
- **Per wave merge:** Manual browser flow: submit invalid form → errors appear; submit valid form with `MAIL_MAILER=log` → success banner + log entry
- **Phase gate:** Production email delivery verified from Hostinger host before `/gsd:verify-work`

### Wave 0 Gaps

None — no test infrastructure setup needed. All verification is manual browser + CLI inspection as per project scope.

---

## Sources

### Primary (HIGH confidence)

- [Laravel 13.x Validation](https://laravel.com/docs/13.x/validation) — `$request->validate()`, `@error` directive, `old()` helper, POST/Redirect/GET auto-behavior
- [Laravel 13.x Mail](https://laravel.com/docs/13.x/mail) — Mailable structure, `envelope()` / `content()`, `Mail::to()->send()`, public constructor properties, Resend driver
- [Laravel 13.x Rate Limiting](https://laravel.com/docs/13.x/routing#rate-limiting) — `RateLimiter::for()`, `Limit::perMinute()->by($ip)`, `throttle` middleware
- `php artisan about` (2026-03-24) — Laravel 13.2.0 confirmed, mail driver `log`, session driver `file`
- `composer show symfony/mailer` (2026-03-24) — v7.4.6 installed; compatible with `symfony/brevo-mailer ^7.4`
- `composer require --dry-run --ignore-platform-req=ext-fileinfo` (2026-03-24) — both `symfony/brevo-mailer:^7.4` and `resend/resend-php:^1.1` verified installable
- `config/services.php` inspection (2026-03-24) — `resend.key` entry already present

### Secondary (MEDIUM confidence)

- [Brevo SMTP configuration for Laravel](https://www.laravelsmtp.com/blog/how-to-configure-brevo-sendinblue-smtp-with-laravel) — host `smtp-relay.brevo.com`, port 587, TLS; username = Brevo login email, password = SMTP API key
- [Resend free tier limits](https://resend.com/docs/knowledge-base/account-quotas-and-limits) — 3,000/month, 100/day confirmed
- [Brevo free tier](https://www.brevo.com/blog/free-smtp-servers/) — 300 emails/day confirmed
- [Laravel Daily: prevent double-click submit with Alpine.js](https://laraveldaily.com/post/how-to-prevent-double-click-submit-js-alpine-vue-inertia-livewire) — `@submit="submitting = true"` on `<form>` pattern confirmed

### Tertiary (LOW confidence — verify before use)

- Brevo requires domain verification for deliverability (SPF/DKIM) but does not hard-block sending before it — unverified at time of research

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Laravel 13 built-ins; composer dry-run verified both provider packages; existing config/services.php entry for Resend confirmed by file inspection
- Architecture: HIGH — POST/Redirect/GET is a stable, version-independent Laravel pattern; Mailable structure from official docs
- Pitfalls: HIGH — all documented pitfalls come from official Laravel behavior (419, validation exception auto-redirect) or project-specific decisions (no queues, synchronous mail, Phase 2 intentional empty action)
- Provider choice: MEDIUM — Brevo free tier volume confirmed from Brevo blog; raw SMTP approach vs API-based trade-off is well-understood; exact Hostinger outbound HTTPS policy not verified independently

**Research date:** 2026-03-24
**Valid until:** 2026-06-24 (90 days — stable Laravel 13 APIs; Brevo/Resend free tier limits may change but not likely to decrease)
