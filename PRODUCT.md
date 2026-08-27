# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Russian-speaking Last Asylum: Plague players are the primary audience. They
need to coordinate scarce resources around rotating event windows, often on a
phone while actively playing. English-speaking players require the same
complete functionality and content as a secondary audience.

## Product Purpose

The product turns verified community research into a practical bilingual field
guide and daily operations checklist. Success means a player can immediately
see the current event phase, identify the next useful action, coordinate
overlapping event windows, and distinguish sourced facts from unresolved
claims.

## Positioning

Unlike a static guide or generic event timer, the product binds researched
stable task IDs to time-aware, locally persisted daily operations while keeping
uncertainty visible and configurable instead of presenting assumptions as game
facts.

## Operating Context

Players use the site alongside the mobile game throughout the week. Alliance
Duel follows a Monday–Saturday UTC schedule with Sunday preparation. Survival
Battle uses six four-hour rounds and a published seven-day cycle, but its UTC
equivalence and Day-1 calendar anchor remain unverified and must be configured
or manually selected.

## Capabilities and Constraints

- Russian is the default language; English is fully available.
- Core routes cover overview, both event guides, weekly planning, sources and
  verification, and the highlighted Today checklist.
- Checklist state persists locally and resets at a configurable boundary.
- Static hosting and direct navigation under repository base paths must work.
- Research documents under `docs/` remain the source of truth.
- No server account, telemetry, or remote persistence is currently required.
- No copyrighted game imagery or logos may be used without a confirmed license.
- The repository license remains an explicit open decision.

## Brand Commitments

The product name is Last Asylum: Plague Research Base. The voice is concise,
operational, bilingual, and transparent about evidence. The user specified a
post-apocalyptic command-center direction: dark, atmospheric, disciplined, and
high contrast, without generic neon cyberpunk or excessive glow.

## Evidence on Hand

- Comprehensive RU/EN event guides in `docs/ru/` and `docs/en/`.
- Stable checklist seed data in `docs/research/checklist-data.json`.
- A bilingual glossary, source ledger, event-overlap plan, checklist
  specification, and verification backlog in `docs/research/`.
- No licensed game art, logo, official API, official publisher rules, user
  testimonials, or usage analytics are available and none may be fabricated.

## Product Principles

1. Put today's decision before general explanation.
2. Keep facts, conflicts, and unknowns visibly distinct.
3. Make every important workflow complete in both languages.
4. Preserve user control over unverified time and cycle assumptions.
5. Remain useful offline after the initial static load.

## Accessibility & Inclusion

Meet WCAG 2.1 AA contrast and keyboard requirements. Use semantic landmarks,
visible focus, a skip link, accessible controls and tables, non-color status
labels, mobile-first layouts, readable Cyrillic typography, and reduced-motion
support.
