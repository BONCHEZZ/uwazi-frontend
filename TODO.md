# UWAZI Production Refactor — Progress Tracker

## Phase 1 — Foundation & Routing Fixes
- [x] Create i18n infrastructure (context + en/sw dictionaries)
- [x] Create Notifications page
- [x] Fix broken routes in MobileNav (/interactive-map → /map)
- [x] Register new routes in App.tsx
- [x] Add ThemeToggle to navbar

## Phase 2 — Homepage (LandingPage)
- [x] Redesign hero (headline, search bar, 3 CTAs)
- [x] Expand to 9 animated real-time stats cards

## Phase 3 — Project Cards & Explorer
- [x] Enhance ProjectCard (contractor, ministry, spent, remaining, counts, last-updated)
- [x] Add global search with autocomplete in navbar

## Phase 4 — Project Details
- [x] Add Budget Breakdown by category
- [x] Enhance MoneyFlow to show Treasury→Ministry→County→Contractor flow
- [x] Add Construction Progress section
- [x] Enhance Citizen Participation with GPS/location + report types

## Phase 5 — Interactive Map
- [x] Implement required color coding + legend (Completed/Green, Ongoing/Blue, Delayed/Yellow, Planned/Gray, High Risk/Red)
- [x] Add county filter + project preview (sidebar with project cards)

## Phase 6 — Contractor Profile & Dashboards
- [x] Expand ContractorProfile metrics (overview, contact, registration, years, completed/delayed/active, budget managed, ratings, completion rate, blacklist, court cases, inspections)
- [x] Add notification center integration (NotificationsPage + route)

## Phase 7 — Accessibility & Performance
- [ ] Focus indicators, ARIA labels, semantic HTML
- [ ] Reduced-motion, skeleton loaders, memoization

## Verification
- [ ] npm run build (tsc + vite)
- [ ] npm run lint (oxlint)
