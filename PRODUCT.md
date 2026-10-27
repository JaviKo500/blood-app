# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

One person keeping a personal record of their own and their family's blood types and ID details. They open the app either to add or update someone, or, more critically, in a hurry when a relative needs care and someone asks for a blood type or cédula number.

## Product Purpose

Blood App holds the blood type and identity details of the people close to the user, so that information is on hand, correct, and readable in a stressful moment. Success means finding a person and reading their blood type and cédula within seconds, without searching through papers or messages.

## Positioning

A private family record, not a donor network or a medical system: it lives on the user's phone, needs no account, and shares nothing.

## Operating Context

- Used on the user's own phone, often one-handed, sometimes under stress (an emergency, a hospital desk, a form to fill in).
- The data is typed in by the user; there is no import or external source.
- Region: Ecuador. "DNI" means the 10-digit Ecuadorian cédula.

## Capabilities and Constraints

- Each person record: name, last name, cédula (DNI), blood type (A+, A-, B+, B-, AB+, AB-, O+, O-), optional email and phone (`src/app/person/model/person.model.ts`).
- Flows: list of people (home tab), add person, view person, edit person, settings (theme: light, dark, system; delete all data).
- Data stays on the device. No account, no backend, no sync. "Borrar todos los datos" removes everything.
- Persistence is not implemented yet: the home list is hard-coded sample data.
- Stack: Angular 22 on Angular Native (React Native Fabric) inside Expo; Tailwind v4 via `@ng-native/tailwind`; native stacks and tabs via `@ng-native/router`. iOS and Android only, no web build. iPad is enabled (`supportsTablet`).
- Copy language: Spanish (Ecuador). No other locale planned.
- Open: whether records gain more medical fields (allergies, conditions, emergency contacts); whether data can be exported or backed up.

## Brand Commitments

- Name: Blood App (working name; `app.json` still uses the template slug and package `com.anonymous.bloodapp`).
- Voice: plain Spanish, short labels ("Apariencia", "Datos y privacidad", "Borrar todos los datos").
- No binding visual identity has been confirmed. `docs/design-system-tailwind.md` describes a proposal derived from a third-party reference image; treat it as a draft, not a commitment.

## Evidence on Hand

- No real user data, testimonials, or metrics exist. Sample people in `src/app/home/screens/home.screen.ts` are placeholders.
- App icons and splash in `assets/` are the Expo template defaults.

## Product Principles

1. **Readable under stress.** Blood type and cédula must be findable and legible at a glance; everything else is secondary.
2. **Private by default.** Nothing leaves the device; the UI never implies an account, cloud, or sharing that does not exist.
3. **Correct over clever.** Entering and editing data must make mistakes hard (a wrong blood type is worse than a missing one), and destructive actions must be deliberate.
4. **Native on each platform.** Follow iOS and Android conventions rather than one custom look.

## Accessibility & Inclusion

- Support Dynamic Type / font scaling and screen readers (VoiceOver, TalkBack); blood type must be announced, not conveyed by color alone.
- Light and dark themes, following the system by default.
