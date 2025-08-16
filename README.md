## Echo Lab — Next.js

Минималистичный сайт-портфолио с анимациями GSAP, маршрутизацией на базе `app/` и поддержкой статической сборки для GitHub Pages.

### Технологии

- Next.js 15 (app router), React 19
- GSAP + ScrollTrigger + @gsap/react
- next-view-transitions для плавных переходов

### Структура

- `src/app` — страницы и лэйауты (`work`, `studio`, `contact`, `archive`)
- `src/components` — переиспользуемые компоненты: `Menu`, `Copy`, `BtnLink`, `Footer`, `DynamicBackground`, `WhoWeAre`, `ProcessCards`
- `public/images` — изображения, организованы по папкам (`work`, `studio`, `contact`, и т.д.)

### Запуск локально

```bash
npm i
npm run dev
# http://localhost:3000
```

### Сборка и предпросмотр статики

Проект конфигурирован под статический экспорт (Next `output: "export"`).

```bash
npm run build
npm run start   # локальный preview может не обслуживать export; используйте любой статик-сервер для ./out
# пример: npx serve out
```

После `npm run build` статика будет в `./out`.

### Базовый путь (GitHub Pages)

GitHub Pages размещает сайт по адресу `https://<user>.github.io/<repo>/` — поэтому нужен префикс путей.

- В `next.config.js` используется `basePath` и `assetPrefix`, читающие `NEXT_PUBLIC_BASE_PATH`.
- Для ассетов используется утилита `prefixPath(path)` в `src/lib/asset.js`.

Как установить базовый путь:

1. Если репозиторий называется `echo-lab`, задайте переменную окружения при сборке:
   - Linux/macOS:
     ```bash
     export NEXT_PUBLIC_BASE_PATH=/echo-lab
     npm run build
     ```
   - Windows PowerShell:
     ```powershell
     $env:NEXT_PUBLIC_BASE_PATH="/echo-lab"; npm run build
     ```
2. Если деплой на корень (`<user>.github.io`), оставьте переменную пустой.

### Обработка путей к изображениям

Все абсолютные пути вида `/images/...` были приведены к `prefixPath('/images/...')`. В компонентах и страницах используйте:

```jsx
import { prefixPath } from "@/lib/asset";
<img src={prefixPath("/images/work/work_001.jpeg")} alt="" />;
```

### Динамические страницы проектов

`/work/[projectId]` — статически экспортируется. Убедитесь, что данные `src/app/work/portfolio.js` содержат валидные `id` и абсолютные пути внутри проекта (`/images/...`).

### Деплой на GitHub Pages

Вариант через Actions:

1. Добавьте workflow `.github/workflows/gh-pages.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: ["master", "main"]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: NEXT_PUBLIC_BASE_PATH=/${{ github.event.repository.name }} npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./out }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

2. В настройках репо включите Pages: Deploy from GitHub Actions.
3. Опционально добавьте пустой файл `.nojekyll` в корень `out` (Actions сделают это автоматически).

Альтернатива вручную:

```bash
NEXT_PUBLIC_BASE_PATH=/echo-lab npm run build
npx gh-pages -d out
```

### Полезные скрипты

- `npm run dev` — dev сервер
- `npm run build` — статическая сборка (`out/`)

### Примечания

- Для изображений и шрифтов используйте `prefixPath` при обращении к `public/`.
- В `next.config.js` включены: `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`.
