import type {
  LocalizedText,
  ScoreTable,
  SourceRecord,
  VerificationRecord,
} from '../types'

const text = (ru: string, en: string): LocalizedText => ({ ru, en })
const row = (ru: string, en: string, points: string) => ({
  action: text(ru, en),
  points,
})

export interface AlliancePhase extends ScoreTable {
  day: LocalizedText
  dayNumber: number
  strategy: LocalizedText
}

export const allianceRequirements = [
  {
    id: 'AD-UNLOCK-S10',
    label: text('Святилище уровня 10 открывает событие [S3].', 'Sanctuary level 10 unlocks the event [S3].'),
    status: 'medium',
  },
  {
    id: 'AD-ELIG-TOP32',
    label: text('Альянс должен входить в топ-32 сервера до подбора [S1].', 'The alliance must be server top 32 before matchmaking [S1].'),
    status: 'high',
  },
  {
    id: 'AD-ELIG-MEMBERS',
    label: text('RU Fandom дополнительно указывает топ-32 по Мощи и более 20 участников [S5].', 'RU Fandom additionally says top 32 by Might and more than 20 members [S5].'),
    status: 'low',
  },
  {
    id: 'AD-RESEARCH-L15',
    label: text('Требование «Лаборатория ур. 15» не подтверждено.', 'The “Research Lab level 15” requirement is unsupported.'),
    status: 'low',
  },
] as const

export const alliancePhases: AlliancePhase[] = [
  {
    id: 'AD-D1-RAVEN',
    dayNumber: 1,
    day: text('Понедельник', 'Monday'),
    title: text('Ворон', 'Raven'),
    strategy: text(
      'Завершите задания «Сокол» и отправьте сбор до сброса; перенос незабранного требует проверки.',
      'Finish Falcon Tasks and dispatch gathering before reset; unclaimed carry-over still needs verification.',
    ),
    rows: [
      row('Потратить 1 энергии', 'Consume 1 Stamina', '+150'),
      row('Выполнить одно задание «Сокол»', 'Complete Falcon Quest once', '+10,000'),
      row('Потратить 660 противоядия', 'Use 660 Antitoxin', '+1'),
      row('Купить набор с алмазами, за 1 алмаз', 'Buy a diamond pack, per 1 Diamond', '+30'),
      row('Собрать 100 зерна', 'Gather 100 Grain', '+5'),
      row('Собрать 100 древесины', 'Gather 100 Timber', '+5'),
      row('Собрать 60 трав', 'Gather 60 Herbs', '+5'),
      row('Потратить 1 плод Ворона', 'Consume 1 Raven Fruit', '+3'),
      row('Потратить 1 эссенцию Ворона', 'Consume 1 Raven Essence', '+2,500'),
    ],
  },
  {
    id: 'AD-D2-CONSTRUCTION',
    dayNumber: 2,
    day: text('Вторник', 'Tuesday'),
    title: text('Строительство', 'Construction'),
    strategy: text(
      'Сохраните ускорения, билеты выживших, операций и караванов; заберите готовые здания в этой фазе.',
      'Save speedups plus survivor, operation, and caravan tickets; collect completed buildings in this phase.',
    ),
    rows: [
      row('Купить набор с алмазами, за 1 алмаз', 'Buy a diamond pack, per 1 Diamond', '+30'),
      row('Использовать 1 минуту ускорения строительства', 'Use 1m Construction Speedup', '+50'),
      row('Увеличить мощь зданий на 1', 'Increase Building Might by 1', '+10'),
      row('Выполнить 1 секретную операцию UR', 'Execute 1 UR Covert Operation', '+75,000'),
      row('Отправить 1 караван UR', 'Dispatch 1 UR Caravan', '+100,000'),
      row('Нанять выжившего 1 раз', 'Recruit survivor once', '+1,500'),
    ],
  },
  {
    id: 'AD-D3-TECH',
    dayNumber: 3,
    day: text('Среда', 'Wednesday'),
    title: text('Технологии', 'Tech'),
    strategy: text(
      'Завершите исследования и откройте сохранённые сундуки снаряжения Ворона.',
      'Finish research and open saved Raven Gear Chests.',
    ),
    rows: [
      row('Выполнить одно задание «Сокол»', 'Complete Falcon Quest once', '+10,000'),
      row('Купить набор с алмазами, за 1 алмаз', 'Buy a diamond pack, per 1 Diamond', '+30'),
      row('Использовать 1 минуту ускорения исследований', 'Use 1m Research Speedup', '+50'),
      row('Потратить 1 свиток исследований', 'Consume 1 Study Scroll', '+300'),
      row('Увеличить технологическую мощь на 1', 'Increase Tech Might by 1', '+10'),
      row('Открыть сундук снаряжения Ворона ур. 1', 'Open a Lv.1 Raven Gear Chest', '+1,100'),
      row('Открыть сундук снаряжения Ворона ур. 2', 'Open a Lv.2 Raven Gear Chest', '+3,300'),
      row('Открыть сундук снаряжения Ворона ур. 3', 'Open a Lv.3 Raven Gear Chest', '+10,000'),
      row('Открыть сундук снаряжения Ворона ур. 4', 'Open a Lv.4 Raven Gear Chest', '+30,000'),
      row('Открыть сундук снаряжения Ворона ур. 5', 'Open a Lv.5 Raven Gear Chest', '+90,000'),
      row('Открыть сундук снаряжения Ворона ур. 6', 'Open a Lv.6 Raven Gear Chest', '+270,000'),
      row('Открыть сундук снаряжения Ворона ур. 7', 'Open a Lv.7 Raven Gear Chest', '+810,000'),
    ],
  },
  {
    id: 'AD-D4-HERO',
    dayNumber: 4,
    day: text('Четверг', 'Thursday'),
    title: text('Герои', 'Hero'),
    strategy: text(
      'Используйте сохранённые билеты, противоядие, осколки и знаки навыка.',
      'Use saved recruit tickets, Antitoxin, shards, and Skill Badges.',
    ),
    rows: [
      row('Потратить 660 противоядия', 'Use 660 Antitoxin', '+1'),
      row('Купить набор с алмазами, за 1 алмаз', 'Buy a diamond pack, per 1 Diamond', '+30'),
      row('Нанять героя 1 раз', 'Recruit heroes once', '+1,500'),
      row('Потратить 1 осколок героя UR', 'Consume 1 UR Hero Shard', '+10,000'),
      row('Потратить 1 осколок героя SSR', 'Consume 1 SSR Hero Shard', '+3,500'),
      row('Потратить 1 осколок героя SR', 'Consume 1 SR Hero Shard', '+1,000'),
      row('Использовать 1 знак навыка', 'Use 1 Skill Badge', '+10'),
    ],
  },
  {
    id: 'AD-D5-PREPARATION',
    dayNumber: 5,
    day: text('Пятница', 'Friday'),
    title: text('Подготовка', 'Preparation'),
    strategy: text(
      'Разделите строительство, исследования и тренировку по совпадающим окнам Битвы.',
      'Split construction, research, and training across matching Battle windows.',
    ),
    rows: [
      row('Выполнить одно задание «Сокол»', 'Complete Falcon Quest once', '+10,000'),
      row('Купить набор с алмазами, за 1 алмаз', 'Buy a diamond pack, per 1 Diamond', '+30'),
      row('Использовать 1 минуту ускорения строительства', 'Use 1m Construction Speedup', '+50'),
      row('Увеличить мощь зданий на 1', 'Increase Building Might by 1', '+10'),
      row('Использовать 1 минуту ускорения исследований', 'Use 1m Research Speedup', '+50'),
      row('Увеличить технологическую мощь на 1', 'Increase Tech Might by 1', '+10'),
      row('Использовать 1 минуту ускорения тренировки', 'Use 1m Training Boost', '+50'),
      ...Array.from({ length: 10 }, (_, index) =>
        row(
          `Обучить 1 солдата ур. ${index + 1}`,
          `Train 1 Lv.${index + 1} soldier`,
          `+${20 + index * 10}`,
        ),
      ),
    ],
  },
  {
    id: 'AD-D6-RAID',
    dayNumber: 6,
    day: text('Суббота', 'Saturday'),
    title: text('Рейд', 'Raid'),
    strategy: text(
      'Сверьте щит и план альянса. Очки за потери не делают потери выгодными.',
      'Check your shield and alliance plan. Points for losses do not make losses worthwhile.',
    ),
    rows: [
      row('Купить набор с алмазами, за 1 алмаз', 'Buy a diamond pack, per 1 Diamond', '+30'),
      row('Выполнить 1 секретную операцию UR', 'Execute 1 UR Covert Operation', '+75,000'),
      row('Отправить 1 караван UR', 'Dispatch 1 UR Caravan', '+100,000'),
      row('Использовать 1 минуту ускорения строительства', 'Use 1m Construction Speedup', '+50'),
      row('Использовать 1 минуту ускорения исследований', 'Use 1m Research Speedup', '+50'),
      row('Использовать 1 минуту ускорения тренировки', 'Use 1m Training Boost', '+50'),
      row('Использовать 1 минуту ускорения лечения', 'Use 1m Healing Speedup', '+50'),
    ],
    warning: text(
      '«Конкретный матч» трактуется как бой против сопоставленного альянса. Точные режимы требуют проверки.',
      '“Specific match” is interpreted as fighting the matched alliance. Exact combat modes need verification.',
    ),
  },
]

export const raidSoldierRows = Array.from({ length: 10 }, (_, index) => ({
  level: index + 1,
  matched: 10 + index * 5,
  other: 2 + index,
  lost: 2 + index,
}))

export const survivalThemes: ScoreTable[] = [
  {
    id: 'SB-BUILD',
    title: text('Строительство территории', 'Build Territory'),
    rows: [
      row('Использовать 1 минуту ускорения строительства', 'Use 1m Construction Speedup', '+10'),
      row('Увеличить мощь зданий на 1', 'Increase Building Might by 1', '+1'),
      row('Купить набор с алмазами, за 1 алмаз', 'Buy a diamond pack, per 1 Diamond', '+30'),
    ],
  },
  {
    id: 'SB-TRAIN',
    title: text('Тренировка солдат', 'Train Soldiers'),
    rows: [
      {
        ...row('Обучить 1 солдата, уровень не указан [S4]', 'Train 1 soldier, level unspecified [S4]', '+22'),
        note: text('Конфликтующий RU-источник', 'Conflicting RU source'),
      },
      {
        ...row('Обучить 1 солдата ур. 9 [S2]', 'Train 1 Lv.9 soldier [S2]', '+28'),
        note: text('Конфликтующий EN-источник', 'Conflicting EN source'),
      },
      row('Использовать 1 минуту ускорения тренировки', 'Use 1m Training Speedup', '+10'),
      row('Купить набор с алмазами, за 1 алмаз', 'Buy a diamond pack, per 1 Diamond', '+30'),
    ],
    warning: text(
      'Значения +22 и +28 нельзя объединять или применять ко всем уровням.',
      'Do not merge +22 and +28 or generalize either value to every level.',
    ),
  },
  {
    id: 'SB-RESEARCH',
    title: text('Исследование технологий', 'Technology Research'),
    rows: [
      row('Использовать 1 минуту ускорения исследований', 'Use 1m Research Speedup', '+10'),
      row('Увеличить технологическую мощь на 1', 'Increase Tech Might by 1', '+1'),
      row('Купить набор с алмазами, за 1 алмаз', 'Buy a diamond pack, per 1 Diamond', '+30'),
    ],
  },
  {
    id: 'SB-RAVEN',
    title: text('Усиление Ворона', 'Enhance Raven'),
    rows: [
      row('Потратить каждые 10 плодов Ворона', 'Consume every 10 Raven Fruit', '+1'),
      row('Потратить 1 энергии', 'Consume 1 Stamina', '+100'),
      row('Купить набор с алмазами, за 1 алмаз', 'Buy a diamond pack, per 1 Diamond', '+30'),
    ],
  },
  {
    id: 'SB-HEROES',
    title: text('Усиление героев', 'Enhance Heroes'),
    rows: [
      row('Нанять героя 1 раз', 'Recruit heroes once', '+400'),
      row('Потратить каждые 1 950 противоядия', 'Consume every 1,950 Antitoxin', '+1'),
      row('Купить набор с алмазами, за 1 алмаз', 'Buy a diamond pack, per 1 Diamond', '+30'),
    ],
  },
]

export const weeklyOverlaps = [
  ['AD-D1-RAVEN', 'SB-RAVEN', text('Энергия, плоды Ворона, наборы с алмазами', 'Stamina, Raven Fruit, diamond packs')],
  ['AD-D2-CONSTRUCTION', 'SB-BUILD', text('Строительные ускорения, мощь зданий, наборы', 'Construction speedups, Building Might, packs')],
  ['AD-D3-TECH', 'SB-RESEARCH', text('Исследовательские ускорения, технологическая мощь, наборы', 'Research speedups, Tech Might, packs')],
  ['AD-D4-HERO', 'SB-HEROES', text('Найм героев, противоядие, наборы', 'Hero recruitment, Antitoxin, packs')],
  ['AD-D5-PREPARATION', 'SB-BUILD', text('Строительство и мощь зданий', 'Construction and Building Might')],
  ['AD-D5-PREPARATION', 'SB-RESEARCH', text('Исследования и технологическая мощь', 'Research and Tech Might')],
  ['AD-D5-PREPARATION', 'SB-TRAIN', text('Тренировочные ускорения и обучение солдат', 'Training speedups and soldier training')],
  ['AD-D6-RAID', 'SB-BUILD', text('Строительные ускорения и наборы', 'Construction speedups and packs')],
  ['AD-D6-RAID', 'SB-RESEARCH', text('Исследовательские ускорения и наборы', 'Research speedups and packs')],
  ['AD-D6-RAID', 'SB-TRAIN', text('Тренировочные ускорения и наборы', 'Training speedups and packs')],
] as const

export const sources: SourceRecord[] = [
  {
    id: 'S1',
    name: 'Last Asylum Plague — Alliance Duel',
    url: 'https://lastasylumplague.com/events/alliance-duel/',
    type: text('Сторонний тематический гайд', 'Third-party event guide'),
    supports: text('Фазы, 00:00 UTC, топ-32, таблицы очков, категории наград и совет по совмещению.', 'Phases, 00:00 UTC, top 32, scoring tables, reward categories, and overlap advice.'),
    confidence: 'high',
  },
  {
    id: 'S2',
    name: 'Last Asylum Guides — Survival Battle',
    url: 'https://lastasylumguides.com/2026/07/11/survival-battle-event/',
    type: text('Сторонний гайд со снимками', 'Third-party guide with screenshots'),
    supports: text('12–20 игроков, 6×4 часа, семидневный цикл, EN-очки и пороги медалей.', '12–20 players, 6×4 hours, seven-day cycle, EN scoring, and medal thresholds.'),
    confidence: 'high',
  },
  {
    id: 'S3',
    name: 'Last Asylum Wiki — Sanctuary Details',
    url: 'https://lastasylumwiki.com/docs/sanctuary-details/',
    type: text('Сторонняя community wiki', 'Third-party community wiki'),
    supports: text('Святилище уровня 10 открывает Дуэль альянсов.', 'Sanctuary level 10 unlocks Alliance Duel.'),
    confidence: 'medium',
  },
  {
    id: 'S4',
    name: 'Fandom RU — Битва за выживание',
    url: 'https://last-asylum-plague.fandom.com/ru/wiki/Битва_за_выживание',
    type: text('Fandom community wiki', 'Fandom community wiki'),
    supports: text('00:00:00 без зоны, подбор 12–20, почта и RU-очки, включая спорные +22.', '00:00:00 without zone, 12–20 matching, mail rules, and RU scoring including disputed +22.'),
    confidence: 'medium',
  },
  {
    id: 'S5',
    name: 'Fandom RU — Дуэль альянсов',
    url: 'https://last-asylum-plague.fandom.com/ru/wiki/Дуэль_альянсов',
    type: text('Fandom metadata; тело недоступно', 'Fandom metadata; body inaccessible'),
    supports: text('Более 20 участников, топ-32 по Мощи к воскресенью, шесть фаз.', 'More than 20 members, top 32 by Might by Sunday, six phases.'),
    confidence: 'low',
  },
  {
    id: 'S6',
    name: 'LootBar EN — Alliance Duel Guide',
    url: 'https://www.lootbar.com/blog/en/last-asylum-plague-alliance-duel-guide.html',
    type: text('Коммерческий гайд', 'Commercial guide'),
    supports: text('EN-терминология и общая стратегия накопления.', 'EN terminology and general stockpiling strategy.'),
    confidence: 'medium',
  },
  {
    id: 'S7',
    name: 'LootBar RU — Руководство по Дуэли',
    url: 'https://www.lootbar.com/blog/ru/last-asylum-plague-alliance-duel-guide.html',
    type: text('Коммерческий перевод', 'Commercial translation'),
    supports: text('RU-варианты названий фаз и заданий.', 'RU variants for phase and task names.'),
    confidence: 'medium',
  },
]

export const verificationBacklog: VerificationRecord[] = [
  { id: 'VB-SB-001', priority: 'P0', claim: text('UTC-эквивалент сброса Битвы', 'Survival Battle reset UTC equivalence'), reason: text('Источник называет 00:00:00 без часового пояса.', 'The source states 00:00:00 without a timezone.') },
  { id: 'VB-SB-002', priority: 'P0', claim: text('Календарная дата первого дня', 'Calendar date for Day 1'), reason: text('Опорная дата семидневного цикла не опубликована.', 'The seven-day cycle anchor is not published.') },
  { id: 'VB-SB-003', priority: 'P0', claim: text('Очки солдата: +22 или +28', 'Soldier points: +22 or +28'), reason: text('RU и EN источники прямо конфликтуют.', 'RU and EN sources directly conflict.') },
  { id: 'VB-AD-001', priority: 'P0', claim: text('Актуальность всех таблиц Дуэли', 'Current Alliance Duel scoring'), reason: text('Точные числа полностью даёт только один сторонний источник.', 'Only one third-party source provides every exact value.') },
  { id: 'VB-AD-002', priority: 'P0', claim: text('Формула победных очков недели', 'Weekly winning-point formula'), reason: text('Вес фаз и правило ничьей не опубликованы.', 'Phase weights and tie-break rules are unpublished.') },
  { id: 'VB-AD-003', priority: 'P1', claim: text('Полные требования к альянсу', 'Complete alliance requirements'), reason: text('Источники дают разные части: ур. 10, топ-32, Мощь, >20 участников.', 'Sources provide different pieces: level 10, top 32, Might, >20 members.') },
  { id: 'VB-AD-004', priority: 'P1', claim: text('Пороги и состав наград Дуэли', 'Duel reward thresholds and contents'), reason: text('Доступны только категории и изображения.', 'Only categories and images are available.') },
  { id: 'VB-AD-005', priority: 'P1', claim: text('Открытие дерева исследований', 'Research tree unlock'), reason: text('Заявленный уровень Лаборатории 15 не подтверждён.', 'The claimed Research Lab level 15 is unsupported.') },
  { id: 'VB-AD-006', priority: 'P1', claim: text('Перенос незабранных действий через сброс', 'Unclaimed-action carry-over'), reason: text('Это стратегия источника, не формальное правило.', 'This is source strategy, not a formal rule.') },
  { id: 'VB-SB-004', priority: 'P1', claim: text('Пороги Stage Rewards и сундуков', 'Stage Reward and chest thresholds'), reason: text('Часть наград описана только одним источником.', 'Some reward data is single-sourced.') },
  { id: 'VB-SB-005', priority: 'P1', claim: text('Минимальный уровень и требование альянса', 'Minimum level and alliance requirement'), reason: text('Проверенные источники этого не устанавливают.', 'Checked sources do not establish either requirement.') },
  { id: 'VB-SB-007', priority: 'P1', claim: text('Повторы дней 1=3 и 2=7', 'Repeated Day 1=3 and Day 2=7'), reason: text('Необычная таблица опубликована только в S2.', 'The unusual calendar is published only by S2.') },
  { id: 'VB-REL-001', priority: 'P2', claim: text('Формальная связь событий', 'Formal event relationship'), reason: text('Подтверждён только стратегический совет по времени.', 'Only timing strategy advice is supported.') },
  { id: 'VB-TERM-001', priority: 'P2', claim: text('Точные строки русской локализации', 'Exact Russian localization strings'), reason: text('Несколько терминов доступны только в переводах сообщества.', 'Several terms are available only in community translations.') },
]
