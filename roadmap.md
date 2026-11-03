# ICT Career Compass

- [x] Build profile and account settings.
- [x] Apply the dark technical palette, desktop sidebar and mobile navigation; connect dashboard cards.
- [x] Check tests and page metadata across public and authenticated routes (7/7 vitest tests pass; every route has head metadata).
- [x] Verify signed-in assessment, quiz, career, roadmap, CV, skills, projects, interviews, resources and opportunities flows (verified in browser signed in as the owner's account; one assessment attempt and one quiz attempt were recorded as test runs).
- [x] Light and dark mode: light palette in :root, navy theme under .dark, toggle in the app header and on public pages, preference applied before first paint and persisted (tests 10/10; toggle verified in browser on /auth and /, reload-persistent; signed-in page check blocked by a temporary backend sign-in error).

Signed-in verification requires an authorised account session; do not expose or request user credentials.

- [x] Fake-email signup verified end to end (auto-confirm on): made-up email signs up straight to onboarding and dashboard; unregistered email sign-in rejected with "Invalid login credentials"; password hint added to the sign-up form because known-breached passwords are rejected.
