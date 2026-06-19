# Onixbit Site

Многостраничный сайт Onixbit на Next.js + React + TypeScript.

## Локальный запуск

```bash
npm install
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Локальный адрес:

```text
http://127.0.0.1:3000
```

## Проверки

```bash
npm run check
```

Команда выполняет:

- `npm run lint`
- `npm audit --omit=dev`
- `npm run build`

## Структура

- `src/app` — страницы, `sitemap.ts`, `robots.ts`, метаданные.
- `src/components` — шапка, подвал, мобильная навигация, интерактивы, секции, формы.
- `src/data/site.ts` — центральное место для контента: услуги, кейсы, отзывы, сертификаты, статьи, лицензии.
- `public/brand` — логотипы и OG-изображение.
- `.github/workflows` — CI и деплой на FirstVDS.
- `deploy` — серверные скрипты для первичной настройки и отката.

## Боевой деплой

Основная схема описана в `DEPLOY_FIRSTVDS.md`.

Коротко:

1. Код хранится в приватном GitHub-репозитории.
2. GitHub Actions проверяет проект.
3. После push в `main` релиз отправляется на FirstVDS по SSH.
4. На сервере сайт запускается через Docker Compose.
5. Caddy принимает HTTP/HTTPS и проксирует в Next.js.

## Docker локально

```bash
npm run docker:build
npm run docker:up
npm run docker:down
```

## Важно перед публикацией

- Demo-кейсы заменить на реальные.
- Demo-отзывы заменить на реальные или временно убрать.
- Placeholder-сертификаты заменить изображениями и ссылками на подтверждение.
- Проверить домен в `src/app/sitemap.ts` и `src/app/layout.tsx` перед боевым запуском.
