# Survival Battle

> **Data status:** checked against two third-party sources on 2026-08-27. The
> reset timezone, seven-day cycle anchor, and soldier-point conflict remain
> unverified.

## Overview

Survival Battle is a daily individual competition. Each day, 12–20 players
with similar Sanctuary levels or ranks are randomly assigned to a group
[S2][S4]. A day contains six four-hour rounds, each using one of five themes.

RU Fandom says the new group forms **daily at 00:00:00**, but does not name a
timezone [S4]. This is therefore **00:00 server time**, not confirmed 00:00
UTC. No checked source establishes the minimum Sanctuary level or an alliance
membership requirement.

## Matchmaking and settlement

- group size: 12–20 players with similar Sanctuary levels/ranks;
- assignment: random and renewed daily at 00:00:00;
- daily ranking: total points across all six rounds;
- ranking reward: mailed when the daily total is greater than zero [S4];
- the level-range formula and tie-break rules are not published.

Fandom rule 5 says points are awarded only for diamond-containing pack
purchases, contradicting the same page's table of free scoring actions. This is
an unresolved internal source error, not a usable event rule.

## Themes and four-hour windows

| ID | Theme |
|---|---|
| `SB-BUILD` | Build Territory |
| `SB-TRAIN` | Train Soldiers |
| `SB-RESEARCH` | Technology Research |
| `SB-RAVEN` | Enhance Raven |
| `SB-HEROES` | Enhance Heroes |

The source [S2] calendar is preserved below. Windows 1–6 are consecutive
four-hour periods after the daily reset. **No source maps Day 1 to a calendar
date**, so software must not calculate the current row without a configurable
anchor date.

| Cycle day | Window 1 | Window 2 | Window 3 | Window 4 | Window 5 | Window 6 |
|---|---|---|---|---|---|---|
| Day 1 | Build | Train | Research | Raven | Heroes | Build |
| Day 2 | Heroes | Build | Train | Research | Raven | Heroes |
| Day 3 | Build | Train | Research | Raven | Heroes | Build |
| Day 4 | Train | Research | Raven | Heroes | Build | Train |
| Day 5 | Research | Raven | Heroes | Build | Train | Research |
| Day 6 | Raven | Heroes | Build | Train | Research | Raven |
| Day 7 | Heroes | Build | Train | Research | Raven | Heroes |

Day 1 equals Day 3 and Day 2 equals Day 7. This reproduces [S2] rather than
"correcting" it; the repetitions may be version behavior or a publication
error.

## Exact scoring tables

### `SB-BUILD` — Build Territory

| Action | Points |
|---|---:|
| Use 1m Construction Speedup | +10 |
| Increase Building Might by 1 | +1 |
| Buy a pack containing Diamonds, per 1 Diamond | +30 |

### `SB-TRAIN` — Train Soldiers

| Source | Action | Points |
|---|---|---:|
| [S2], EN | Train 1 Lv.9 soldier | **+28** |
| [S4], RU | Train 1 soldier, level unspecified | **+22** |
| [S2] and [S4] | Use 1m Training Speedup | +10 |
| [S2] and [S4] | Buy a pack containing Diamonds, per 1 Diamond | +30 |

**The conflict is unresolved.** Do not merge +22 and +28 or generalize either
to every soldier level. Until a current-version screenshot is available, a
checklist must expose both values with their sources and a warning.

### `SB-RESEARCH` — Technology Research

| Action | Points |
|---|---:|
| Use 1m Research Speedup | +10 |
| Increase Tech Might by 1 | +1 |
| Buy a pack containing Diamonds, per 1 Diamond | +30 |

### `SB-RAVEN` — Enhance Raven

| Action | Points |
|---|---:|
| Consume every 10 Raven Fruit | +1 |
| Consume 1 Stamina | +100 |
| Buy a pack containing Diamonds, per 1 Diamond | +30 |

### `SB-HEROES` — Enhance Heroes

| Action | Points |
|---|---:|
| Recruit heroes once | +400 |
| Consume every 1,950 Antitoxin | +1 |
| Buy a pack containing Diamonds, per 1 Diamond | +30 |

All values except soldier training agree between [S2] and [S4]'s collapsed
combined table.

## Rewards

### Stage Rewards

[S2] says each four-hour round has four score-based Stage Rewards. They are
claimable separately for each of the six rounds and award Survival Medals.
The source text does not provide the exact score thresholds or contents.

### Daily medal rewards

| Medals | Reward |
|---:|---|
| 2 | Blue Chest |
| 8 | Purple Chest |
| 18 | Orange Chest |

Only [S2] supports these thresholds and chest labels. Each milestone is
claimable once per day. [S4] says unclaimed chests and progress rewards are
mailed after settlement, **except medals**; [S4] contains no medal-threshold
table.

## Practical cycle

1. After reset, identify Day 1–7 manually from the event screen.
2. Check the active theme and remaining time in its four-hour window.
3. Spend theme resources only in the matching window.
4. During Alliance Duel, use the [weekly overlap plan](../research/synergy-weekly-plan.md).
5. Claim the four Stage Rewards and check 2/8/18-medal progress.
6. Claim available rewards before reset; medals are not covered by the stated
   mail fallback.

## Sources

- [S2 — Last Asylum Guides, Survival Battle Event](https://lastasylumguides.com/2026/07/11/survival-battle-event/)
- [S4 — Fandom RU, Survival Battle](https://last-asylum-plague.fandom.com/ru/wiki/Битва_за_выживание)
- [Full source ledger](../research/sources.md)
- [Open verification items](../research/verification-backlog.md)
