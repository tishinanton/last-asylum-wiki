# Last Asylum: Plague — исследовательская база / Research Base

## Русский

Этот репозиторий содержит двуязычный полевой справочник и ежедневный чек-лист
по **Last Asylum: Plague**. Русский язык включён по умолчанию, английский
доступен через постоянный переключатель. Приложение отделяет подтверждённые
сведения от конфликтующих, версионно-зависимых и требующих проверки в игре.

### Запуск

Требуется актуальная LTS-версия Node.js.

```powershell
npm install
npm run dev
```

Проверки и production-сборка:

```powershell
npm test
npm run lint
npm run typecheck
npm run build
```

Готовые статические файлы появляются в `dist/`. Приложение использует
hash-маршруты (`#/today`, `#/alliance-duel` и другие), поэтому прямые переходы
работают на статическом хостинге и под путём репозитория без серверного
SPA-fallback.

### Возможности

- текущая фаза Дуэли и шесть стадий Битвы с обратными отсчётами;
- автоматически обновляемый чек-лист со стабильными ID и локальным хранением;
- отдельные настройки неподтверждённых часов и точки отсчёта Битвы;
- полные таблицы очков, недельный план пересечений, источники и очередь
  проверок;
- адаптивный интерфейс, клавиатурная навигация и режим reduced motion.

### Материалы

- [Дуэль альянсов](docs/ru/alliance-duel.md)
- [Битва за выживание](docs/ru/survival-battle.md)
- [Глоссарий RU/EN](docs/research/glossary.md)
- [Совмещение событий и недельный план](docs/research/synergy-weekly-plan.md)
- [Спецификация ежедневного чек-листа](docs/research/checklist-spec.md)
- [Данные чек-листа](docs/research/checklist-data.json)
- [Детальный ежедневный план](docs/research/daily-playbook.json)
- [Реестр источников](docs/research/sources.md)
- [Очередь проверок](docs/research/verification-backlog.md)

## English

This repository contains a bilingual **Last Asylum: Plague** field guide and
daily checklist. Russian is the default; English is available through a
persistent language switcher. The application keeps supported information
separate from conflicting, version-dependent, and in-game verification items.

### Setup

Use a current Node.js LTS release.

```powershell
npm install
npm run dev
```

Validation and production build:

```powershell
npm test
npm run lint
npm run typecheck
npm run build
```

Static output is written to `dist/`. Hash routes (`#/today`,
`#/alliance-duel`, and others) support direct navigation on static hosts and
repository base paths without a server-side SPA fallback.

### GitHub Pages

The Vite build uses a relative base path, so `dist/` is ready for a future
GitHub Pages workflow. This repository does not enable Pages or modify
repository settings automatically. A maintainer can later publish `dist/`
through an approved Actions workflow or another static host.

### Documentation

- [Alliance Duel](docs/en/alliance-duel.md)
- [Survival Battle](docs/en/survival-battle.md)
- [RU/EN glossary](docs/research/glossary.md)
- [Event overlap and weekly plan](docs/research/synergy-weekly-plan.md)
- [Daily checklist specification](docs/research/checklist-spec.md)
- [Checklist data](docs/research/checklist-data.json)
- [Granular daily playbook](docs/research/daily-playbook.json)
- [Source ledger](docs/research/sources.md)
- [Verification backlog](docs/research/verification-backlog.md)

## Статус лицензии / License status

Лицензия ещё не выбрана. До явного решения владельца репозитория права на
материалы не предоставляются. / No license has been selected. Until the
repository owner makes an explicit choice, no rights are granted.
