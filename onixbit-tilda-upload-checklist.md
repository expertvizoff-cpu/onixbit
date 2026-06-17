# Onixbit Tilda Upload Checklist

## 0. Продолжение работы в новом чате

Если текущий чат закончился, в новом чате сначала читать:

- onixbit-codex-handoff.md


## 1. Общие файлы

Загрузить/подключить один общий CSS-файл на все страницы:

- onixbit-tilda-site-styles.css

Логотип уже загружен и подставлен в HTML:

- https://onixbit.su/upload/onixbitru/logo/logo_jumtp.png

## 2. Глобальные страницы Tilda

Ты сделал правильно: в Tilda есть две служебные страницы, которые показываются всегда.

### Страница Шапка

Вставить один HTML-блок:

- onixbit-tilda-header.html

### Страница Подвал

Вставить два HTML-блока в таком порядке:

1. onixbit-tilda-contacts-footer.html
2. onixbit-tilda-privacy-modal.html

Важно: эти блоки не вставлять повторно на обычные страницы.

## 3. Обычные страницы и URL

Создать страницы:

- Главная: /
- Внедрение Битрикс24: /vnedrenie-bitrix24
- Интеграции Битрикс24: /integratsii-bitrix24
- Тарифы Битрикс24: /tarify-bitrix24
- Кейсы: /cases
- Контакты: /contacts

На эти страницы вставлять только контентные блоки из:

- onixbit-tilda-pages-map.md
- onixbit-tilda-insert-links.md

Важно: первые экраны теперь страничные: hero-home, hero-implementation, hero-integrations, hero-tariffs, hero-cases и hero-contacts. Старый общий onixbit-tilda-hero-v2.html на страницы не вставлять.
Важно для главной: использовать короткие home-блоки `services-home`, `process-home`, `tariffs-home` и `trust-home`; подробные `services`, `process`, `tariffs`, `price-line`, `why`, `trust` остаются для внутренних страниц.

## 4. Главное меню

В шапке сейчас используются ссылки:

- /vnedrenie-bitrix24
- /integratsii-bitrix24
- /tarify-bitrix24
- /cases
- /contacts

Пункт CRM намеренно убран, пока нет отдельной CRM-страницы.

## 5. Нижнее меню

В подвале сейчас используются ссылки:

- /vnedrenie-bitrix24
- /#services
- /cases#certificates
- /integratsii-bitrix24#platforms
- /cases
- /tarify-bitrix24
- /contacts#requisites
- /contacts
- #privacy

## 6. Что проверить после загрузки

На каждой странице проверить:

- глобальная шапка отображается один раз;
- глобальный подвал отображается один раз;
- логотип виден в шапке и подвале;
- нет горизонтального скролла на мобильном;
- CTA ведут к контактам;
- cookie-плашка закрывается;
- политика конфиденциальности открывается из подвала и cookie-плашки;
- FAQ раскрывается;
- на странице тарифов переключаются тарифы;
- на странице интеграций переключается технологический контур;
- сертификаты открываются в модальном окне;
- внешние сертификаты грузятся с onixbit.su.

## 7. Локальные проверки перед публикацией

Запустить:

```bash
npx playwright test onixbit-home-first-pass.spec.js onixbit-pages-smoke.spec.js --reporter=line
```

Ожидаемый результат:

- 14 passed

После публикации на Tilda нужен отдельный live-прогон по реальным URL.
