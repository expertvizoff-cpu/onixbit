# Деплой Onixbit на FirstVDS

Целевая схема: GitHub хранит историю, GitHub Actions проверяет и отправляет релиз на VPS, FirstVDS запускает сайт через Docker Compose и Caddy.

## Что нужно от владельца

1. VPS на FirstVDS в российской локации.
2. Ubuntu 24.04 LTS или 22.04 LTS.
3. IP сервера.
4. Домен или тестовый поддомен, например `new.onixbit.ru`.
5. Доступ к DNS домена.
6. SSH-доступ root для первичной настройки или отдельный sudo-пользователь.

## Рекомендуемый VPS

- 2 vCPU минимум.
- 2 GB RAM минимум, комфортнее 4 GB.
- SSD/NVMe от 30 GB.
- Российская локация.

## Первичная настройка сервера

Скрипт:

```bash
sudo DEPLOY_USER=deploy APP_DIR=/opt/onixbit-site bash deploy/bootstrap-firstvds-ubuntu.sh
```

Он устанавливает Docker, Docker Compose plugin, открывает 22/80/443 и готовит папку `/opt/onixbit-site`.

## GitHub Secrets

В приватном репозитории GitHub нужно добавить:

- `VPS_HOST` — IP сервера.
- `VPS_USER` — пользователь для деплоя, обычно `deploy`.
- `VPS_PORT` — SSH-порт, обычно `22`.
- `VPS_SSH_KEY` — приватный SSH-ключ для подключения GitHub Actions к серверу.
- `VPS_APP_DIR` — папка приложения, обычно `/opt/onixbit-site`.
- `PRODUCTION_DOMAIN` — домен, например `new.onixbit.ru`.
- `NEXT_PUBLIC_SENTRY_DSN` — необязательно, DSN для включения Sentry-мониторинга.

## DNS

У домена или поддомена должна быть A-запись на IP сервера:

```text
new.onixbit.ru -> A -> <IP FirstVDS>
```

Для боевого домена:

```text
onixbit.ru -> A -> <IP FirstVDS>
www.onixbit.ru -> CNAME -> onixbit.ru
```

## Как работает деплой

1. Push в `main`.
2. GitHub Actions запускает `npm ci`, `npm run lint`, `npm audit --omit=dev`, `npm run build`, `npm run test:e2e:built`.
3. Код упаковывается в архив.
4. Архив отправляется на VPS по SSH.
5. На сервере создаётся релиз `/opt/onixbit-site/releases/<commit_sha>`.
6. Симлинк `/opt/onixbit-site/current` переключается на новый релиз.
7. Выполняется `docker compose up -d --build --remove-orphans`.
8. Caddy выдаёт HTTPS и проксирует запросы в Next.js.

## Откат

На сервере:

```bash
APP_DIR=/opt/onixbit-site APP_NAME=onixbit-site bash /opt/onixbit-site/current/deploy/rollback.sh <commit_sha>
```

Список последних релизов:

```bash
ls -1 /opt/onixbit-site/releases
```

## Важно

- Первую публикацию лучше делать на тестовый поддомен `new.onixbit.ru`.
- После проверки переключаем боевой домен.
- Demo-кейсы, отзывы и placeholder-сертификаты заменить до публичного запуска.
