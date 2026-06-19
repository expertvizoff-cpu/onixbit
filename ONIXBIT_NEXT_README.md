# Onixbit Next.js

Новый основной сайт собран в папке `onixbit-next` на Next.js + React.

## Как открыть превью

Сейчас dev-сервер обычно запускается на:

`http://127.0.0.1:3000`

Индекс со ссылками на страницы:

`NEXT_OPEN_PREVIEW.html`

Если сервер не запущен:

```bash
cd /home/aleksander/projects/lifephoto/onixbit-next
npm run dev -- --hostname 127.0.0.1 --port 3000
```

## Структура

- `src/app` — страницы сайта и SEO-файлы `sitemap.ts`, `robots.ts`.
- `src/components` — шапка, подвал, интерактивы, секции, формы Битрикс24.
- `src/data/site.ts` — направления, меню, кейсы, статьи, сертификаты, тарифные группы.
- `public/brand` — логотипы и OG-изображение.
- `.github/workflows` — CI и деплой на FirstVDS.
- `deploy` — bootstrap сервера и rollback.

## Проверки

```bash
cd /home/aleksander/projects/lifephoto/onixbit-next
npm run check
```

Команда выполняет lint, production audit и build.

## Боевой деплой на FirstVDS

Подготовлено:

- `Dockerfile`
- `docker-compose.yml`
- `Caddyfile`
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `deploy/bootstrap-firstvds-ubuntu.sh`
- `deploy/rollback.sh`
- `DEPLOY_FIRSTVDS.md`

Схема:

GitHub private repo -> GitHub Actions -> FirstVDS VPS в РФ -> Docker Compose -> Caddy HTTPS -> Next.js.

## Что нужно от владельца для продолжения

1. Доступ к GitHub или разрешение создать приватный репозиторий.
2. IP VPS на FirstVDS.
3. SSH-доступ root или sudo-пользователь для первичной настройки.
4. Домен или тестовый поддомен, лучше сначала `new.onixbit.ru`.
5. Доступ к DNS домена.

## Важно перед публикацией

Demo-кейсы, demo-отзывы и placeholder-сертификаты нужно заменить на реальные согласованные материалы.
