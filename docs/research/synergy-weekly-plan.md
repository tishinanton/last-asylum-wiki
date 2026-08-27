# Совмещение событий и недельный план / Event Overlap and Weekly Plan

## Русский

### Что означает «двойной зачёт»

[S1] рекомендует выполнять действия Дуэли альянсов во время подходящей темы
Битвы за выживание, чтобы одно действие независимо принесло очки и награды в
обоих событиях. Источник **не** описывает общий счётчик, множитель, синхронный
календарь или формальную связь событий. Поэтому здесь используется термин
**одновременный независимый зачёт**, а не отдельная игровая механика.

Битва за выживание меняет тему каждые четыре часа. Её опорная дата Day 1
неизвестна, а равенство 00:00 серверного времени и UTC не подтверждено.
Следовательно, точные окна нельзя привязать к дням недели заранее: перед
расходом ресурсов нужно открыть событие и проверить активную тему.

### Проверенные пересечения действий

| День Дуэли | Фаза | Подходящая тема Битвы | Общие действия |
|---|---|---|---|
| Пн | `AD-D1-RAVEN` | `SB-RAVEN` | энергия; плоды Ворона; покупка набора с алмазами |
| Вт | `AD-D2-CONSTRUCTION` | `SB-BUILD` | ускорения строительства; мощь зданий; покупка набора с алмазами |
| Ср | `AD-D3-TECH` | `SB-RESEARCH` | ускорения исследований; технологическая мощь; покупка набора с алмазами |
| Чт | `AD-D4-HERO` | `SB-HEROES` | найм героев; противоядие; покупка набора с алмазами |
| Пт | `AD-D5-PREPARATION` | `SB-BUILD` | ускорения строительства; мощь зданий; покупка набора с алмазами |
| Пт | `AD-D5-PREPARATION` | `SB-RESEARCH` | ускорения исследований; технологическая мощь; покупка набора с алмазами |
| Пт | `AD-D5-PREPARATION` | `SB-TRAIN` | ускорения тренировки; обучение солдат; покупка набора с алмазами |
| Сб | `AD-D6-RAID` | `SB-BUILD` | ускорения строительства; покупка набора с алмазами |
| Сб | `AD-D6-RAID` | `SB-RESEARCH` | ускорения исследований; покупка набора с алмазами |
| Сб | `AD-D6-RAID` | `SB-TRAIN` | ускорения тренировки; покупка набора с алмазами |

Пороговые единицы могут различаться: например, в понедельник один плод Ворона
даёт очки Дуэли, а Битва начисляет очко за каждые десять плодов. В четверг
Дуэль считает каждые 660 противоядия, Битва — каждые 1 950. Интерфейс обязан
показывать оба правила, а не обещать одинаковое число очков.

### Что не пересекается по опубликованным таблицам

- эссенция Ворона и задания «Сокол» есть в Дуэли, но не в таблице Битвы;
- караваны, секретные операции и найм выживших не указаны для Битвы;
- сундуки снаряжения Ворона и свитки исследований не указаны для Битвы;
- осколки героев и знаки навыков не указаны для Битвы;
- лечение, боевые победы и потери Рейда не указаны для Битвы.

### Недельный порядок

1. **Воскресенье:** подготовить задания «Сокол» и сбор ресурсов; проверить
   щит; не вычислять Day 1 Битвы без экрана события.
2. **Каждый сброс:** сверить фазу Дуэли, текущий Day 1–7 и активное
   четырёхчасовое окно Битвы.
3. **Перед крупным расходом:** убедиться, что действие есть в обеих таблицах.
4. **Пятница:** сохранить три пула ресурсов для отдельных окон строительства,
   исследований и тренировки; это самый широкий набор пересечений.
5. **Суббота:** совмещать только ускорения; боевые действия планировать по
   безопасности и целям альянса, а не ради неподтверждённого двойного зачёта.
6. **Перед сбросом:** забрать доступные награды обоих событий.

## English

### Meaning of "double scoring"

[S1] advises timing Alliance Duel actions with a matching Survival Battle
theme so the same underlying action independently earns points and rewards in
both events. It does **not** document a shared counter, multiplier, synchronized
calendar, or formal event link. This guide therefore calls it **simultaneous
independent scoring**.

Because the Survival Battle Day 1 anchor and UTC equivalence are unverified,
exact four-hour windows cannot safely be mapped to weekdays. Check the active
theme in game before spending resources.

### Confirmed action overlaps

| Duel day | Duel phase | Survival theme | Shared actions |
|---|---|---|---|
| Mon | `AD-D1-RAVEN` | `SB-RAVEN` | Stamina, Raven Fruit, diamond-pack purchase |
| Tue | `AD-D2-CONSTRUCTION` | `SB-BUILD` | construction speedups, Building Might, diamond-pack purchase |
| Wed | `AD-D3-TECH` | `SB-RESEARCH` | research speedups, Tech Might, diamond-pack purchase |
| Thu | `AD-D4-HERO` | `SB-HEROES` | hero recruitment, Antitoxin, diamond-pack purchase |
| Fri | `AD-D5-PREPARATION` | `SB-BUILD` | construction speedups, Building Might, diamond-pack purchase |
| Fri | `AD-D5-PREPARATION` | `SB-RESEARCH` | research speedups, Tech Might, diamond-pack purchase |
| Fri | `AD-D5-PREPARATION` | `SB-TRAIN` | training speedups, soldier training, diamond-pack purchase |
| Sat | `AD-D6-RAID` | `SB-BUILD` | construction speedups, diamond-pack purchase |
| Sat | `AD-D6-RAID` | `SB-RESEARCH` | research speedups, diamond-pack purchase |
| Sat | `AD-D6-RAID` | `SB-TRAIN` | training speedups, diamond-pack purchase |

Threshold units differ. One Raven Fruit scores in Monday's Duel, while
Survival Battle scores each ten. Duel Hero scores each 660 Antitoxin; Survival
Battle scores each 1,950. A future UI must show both formulas.

Friday offers the broadest overlap, but only when the corresponding Survival
Battle round is active. Raid combat, healing, hero shards, Raven Essence,
Falcon Tasks, Raven Gear Chests, caravans, and covert operations have no
published Survival Battle counterpart.

## Sources

- [S1 — Alliance Duel guide](https://lastasylumplague.com/events/alliance-duel/)
- [S2 — Survival Battle guide](https://lastasylumguides.com/2026/07/11/survival-battle-event/)
- [Source ledger](sources.md)
- [Verification backlog](verification-backlog.md)
