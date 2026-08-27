# Last Asylum: Plague — исследовательская база / Research Base

## Русский

Этот репозиторий содержит двуязычный полевой справочник и ежедневный чек-лист
по **Last Asylum: Plague**. Русский язык включён по умолчанию, английский
доступен через постоянный переключатель. Приложение отделяет подтверждённые
сведения от конфликтующих, версионно-зависимых и требующих проверки в игре.

### Запуск

Требуются .NET 10 SDK и актуальная LTS-версия Node.js. Пароль администратора
не хранится в репозитории. Перед первым локальным запуском задайте его через
.NET user secrets:

```powershell
npm install
dotnet user-secrets set "Admin:Password" "<временный-пароль>" --project LastAsylumWiki.csproj
npm run build
npm run dev
```

Приложение будет доступно по `http://127.0.0.1:5095`. ASP.NET Core собирает и
раздаёт React-приложение из `wwwroot/`; отдельный Vite-сервер для обычного
запуска не нужен.

Проверки:

```powershell
npm test
npm run test:server
npm run lint
npm run typecheck
npm run build
```

Операционные данные загружаются при старте из `App_Data/checklist.json` в
память. На административной странице `#/admin` действия и запасы сгруппированы
по дням Дуэли; каждая запись редактируется в отдельном окне. К действию можно
добавить упорядоченную мини-инструкцию из изображений JPG, PNG или WebP с
необязательными описаниями на двух языках. Медиа сохраняются в
`App_Data/tutorials/` и доступны только для чтения по `/tutorial-media/`.
Сервер проверяет сигнатуру файла и ограничивает общий объём медиа 200 МБ.
Каждое принятое изменение атомарно записывается обратно в JSON-файл;
устаревшая редакторская сессия не может затереть более новую ревизию.

### Возможности

- текущая фаза Дуэли и шесть стадий Битвы с обратными отсчётами;
- автоматически обновляемый чек-лист со стабильными ID и серверным JSON;
- защищённый редактор с вкладками дней, модальными формами и фотоинструкциями;
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

Use the .NET 10 SDK and a current Node.js LTS release. The administrator
password is not stored in the repository. Configure it through .NET user
secrets before the first local run:

```powershell
npm install
dotnet user-secrets set "Admin:Password" "<temporary-password>" --project LastAsylumWiki.csproj
npm run build
npm run dev
```

The application is served at `http://127.0.0.1:5095`. ASP.NET Core builds and
serves the React application from `wwwroot/`; a separate Vite server is not
needed for normal use.

Validation:

```powershell
npm test
npm run test:server
npm run lint
npm run typecheck
npm run build
```

Operational data is loaded from `App_Data/checklist.json` into memory at
startup. On `#/admin`, actions and reserves are grouped by Duel day and each
entry opens in a focused editor. An action can contain an ordered mini tutorial
made of JPG, PNG, or WebP images with optional bilingual descriptions. Media is
stored under `App_Data/tutorials/` and served read-only from
`/tutorial-media/`. The server verifies file signatures and caps total tutorial
media at 200 MB. Every accepted update is written back to the JSON file
atomically; a stale editor cannot overwrite a newer revision.

For deployment, publish the ASP.NET Core application to a writable host:

```powershell
dotnet publish LastAsylumWiki.csproj -c Release
```

Set `Admin__Password` in the deployment environment and persist the complete
`App_Data/` directory on writable storage, including tutorial media.
Static-only hosts such as GitHub Pages cannot support the admin API, JSON
writes, or image uploads.

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
