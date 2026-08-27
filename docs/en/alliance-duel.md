# Alliance Duel

> **Data status:** checked against third-party sources on 2026-08-27. The
> scoring values below reproduce source [S1] exactly, but have not been
> confirmed by publisher documentation and may change between game versions.

## Overview

Alliance Duel is a six-day competition between two matched alliances. One
phase runs each day from Monday through Saturday: Raven, Construction, Tech,
Hero, Preparation, and Raid. Each phase awards points for a different action
set. Source [S1] explicitly sets the daily reset at **00:00 UTC**.

The weekly result is not fully specified. [S1] says the higher-scoring alliance
receives more "Total Points" each day, phases award different winning-point
amounts, and the alliance with the most winning points wins the week. No source
provides the exact weights or tie-breaker, so this guide does not reduce the
system to "one trophy per daily win."

## Access and matchmaking

| Requirement | Supported claim | Status |
|---|---|---|
| `AD-UNLOCK-S10` | Sanctuary level 10 unlocks Alliance Duel [S3] | One third-party source |
| `AD-ELIG-TOP32` | The alliance must be server top 32 before matchmaking [S1] | Supported by [S1] |
| `AD-ELIG-MIGHT` | RU Fandom specifies top 32 **by Might** by Sunday [S5] | Recoverable only from page metadata |
| `AD-ELIG-MEMBERS` | RU Fandom also says **more than 20 members** [S5] | Completeness conflict: absent from [S1] |
| `AD-RESEARCH-L15` | "Research Lab level 15" requirement | **Unsupported by every checked source** |

The level-15 claim is excluded: [S3] associates Sanctuary level 15 with
different features, not an Alliance Duel research tree. Sources do not explain
whether matchmaking uses Might, rank, or another metric beyond eligibility.

## Schedule

| ID | Day | Phase |
|---|---|---|
| `AD-D1-RAVEN` | Monday | Raven |
| `AD-D2-CONSTRUCTION` | Tuesday | Construction |
| `AD-D3-TECH` | Wednesday | Tech |
| `AD-D4-HERO` | Thursday | Hero |
| `AD-D5-PREPARATION` | Friday | Preparation |
| `AD-D6-RAID` | Saturday | Raid |

Each phase lasts one day and daily points reset at 00:00 UTC [S1]. The sources
do not document a separate Sunday scoring phase.

## Exact scoring tables

### `AD-D1-RAVEN` — Raven

| Action | Points |
|---|---:|
| Consume 1 Stamina | +150 |
| Complete Falcon Quest once | +10,000 |
| Use 660 Antitoxin | +1 |
| Buy a pack containing Diamonds, per 1 Diamond | +30 |
| Gather 100 Grain | +5 |
| Gather 100 Timber | +5 |
| Gather 60 Herbs | +5 |
| Consume 1 Raven Fruit | +3 |
| Consume 1 Raven Essence | +2,500 |

[S1] suggests completing Falcon Tasks and dispatching gathering marches before
the phase, then collecting after reset. Carry-over of unclaimed tasks should be
verified in the current game version.

### `AD-D2-CONSTRUCTION` — Construction

| Action | Points |
|---|---:|
| Buy a pack containing Diamonds, per 1 Diamond | +30 |
| Use 1m Construction Speedup | +50 |
| Increase Building Might by 1 | +10 |
| Execute 1 UR Covert Operation | +75,000 |
| Dispatch 1 UR Caravan | +100,000 |
| Recruit survivor once | +1,500 |

### `AD-D3-TECH` — Tech

| Action | Points |
|---|---:|
| Complete Falcon Quest once | +10,000 |
| Buy a pack containing Diamonds, per 1 Diamond | +30 |
| Use 1m Research Speedup | +50 |
| Consume 1 Study Scroll | +300 |
| Increase Tech Might by 1 | +10 |
| Open a Lv.1 Raven Gear Chest | +1,100 |
| Open a Lv.2 Raven Gear Chest | +3,300 |
| Open a Lv.3 Raven Gear Chest | +10,000 |
| Open a Lv.4 Raven Gear Chest | +30,000 |
| Open a Lv.5 Raven Gear Chest | +90,000 |
| Open a Lv.6 Raven Gear Chest | +270,000 |
| Open a Lv.7 Raven Gear Chest | +810,000 |

### `AD-D4-HERO` — Hero

| Action | Points |
|---|---:|
| Use 660 Antitoxin | +1 |
| Buy a pack containing Diamonds, per 1 Diamond | +30 |
| Recruit heroes once | +1,500 |
| Consume 1 UR Hero Shard | +10,000 |
| Consume 1 SSR Hero Shard | +3,500 |
| Consume 1 SR Hero Shard | +1,000 |
| Use 1 Skill Badge | +10 |

### `AD-D5-PREPARATION` — Preparation

| Action | Points |
|---|---:|
| Complete Falcon Quest once | +10,000 |
| Buy a pack containing Diamonds, per 1 Diamond | +30 |
| Use 1m Construction Speedup | +50 |
| Increase Building Might by 1 | +10 |
| Use 1m Research Speedup | +50 |
| Increase Tech Might by 1 | +10 |
| Use 1m Training Boost | +50 |
| Train 1 Lv.1 soldier | +20 |
| Train 1 Lv.2 soldier | +30 |
| Train 1 Lv.3 soldier | +40 |
| Train 1 Lv.4 soldier | +50 |
| Train 1 Lv.5 soldier | +60 |
| Train 1 Lv.6 soldier | +70 |
| Train 1 Lv.7 soldier | +80 |
| Train 1 Lv.8 soldier | +90 |
| Train 1 Lv.9 soldier | +100 |
| Train 1 Lv.10 soldier | +110 |

[S1] recommends promoting existing lower-level soldiers. This is source
strategy, not a separately documented scoring rule.

### `AD-D6-RAID` — Raid

| Action | Points |
|---|---:|
| Buy a pack containing Diamonds, per 1 Diamond | +30 |
| Execute 1 UR Covert Operation | +75,000 |
| Dispatch 1 UR Caravan | +100,000 |
| Use 1m Construction Speedup | +50 |
| Use 1m Research Speedup | +50 |
| Use 1m Training Boost | +50 |
| Use 1m Healing Speedup | +50 |

#### Raid soldier points

| Soldier level | Defeated in specific match | Defeated outside it | Lost |
|---:|---:|---:|---:|
| 1 | +10 | +2 | +2 |
| 2 | +15 | +3 | +3 |
| 3 | +20 | +4 | +4 |
| 4 | +25 | +5 | +5 |
| 5 | +30 | +6 | +6 |
| 6 | +35 | +7 | +7 |
| 7 | +40 | +8 | +8 |
| 8 | +45 | +9 | +9 |
| 9 | +50 | +10 | +10 |
| 10 | +55 | +11 | +11 |

[S1] later identifies the "specific match" as fighting the matched opposing
alliance. The precise combat modes in which losses count remain an in-game
verification item. A shield may be strategically safer; points for losses do
not make losses inherently worthwhile.

## Rewards

[S1] lists five categories: Daily Milestone, Daily Ranking, Daily Victory,
Weekly Alliance Victory, and Weekly Alliance Defeat Rewards. Text sources do
not provide exact thresholds, contents, delivery rules, or research-based tier
unlocks. Images alone are insufficient for a durable exact table.

## Stockpiling plan

| Phase | Save beforehand |
|---|---|
| Raven | Stamina, Raven Essence/Fruit, unclaimed Falcon Tasks |
| Construction | construction speedups; survivor, UR caravan, and UR operation tickets |
| Tech | research speedups, scrolls, Raven Gear Chests |
| Hero | recruit tickets, Antitoxin, hero shards, Skill Badges |
| Preparation | construction/research/training speedups; promotable soldiers |
| Raid | healing speedups, a shield, and an alliance-coordinated plan |

See the [weekly overlap plan](../research/synergy-weekly-plan.md) for timing
actions with Survival Battle. It describes one action qualifying independently
in two suitable windows, not a special multiplier or linked-event mechanic.

## Sources

- [S1 — Last Asylum Plague, Alliance Duel](https://lastasylumplague.com/events/alliance-duel/)
- [S3 — Last Asylum Wiki, Sanctuary Details](https://lastasylumwiki.com/docs/sanctuary-details/)
- [S5 — Fandom RU, Alliance Duel](https://last-asylum-plague.fandom.com/ru/wiki/Дуэль_альянсов)
- [S6 — LootBar EN guide](https://www.lootbar.com/blog/en/last-asylum-plague-alliance-duel-guide.html)
- [Full source ledger](../research/sources.md)
- [Open verification items](../research/verification-backlog.md)
