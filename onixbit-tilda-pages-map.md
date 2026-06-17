# Onixbit Tilda Pages Map

## Глобальные страницы Tilda

В Tilda созданы две служебные страницы, которые показываются на всех страницах сайта.

### Шапка

Вставлен блок:

1. `onixbit-tilda-header.html`

### Подвал

Вставлены блоки:

1. `onixbit-tilda-contacts-footer.html` — контакты, форма Битрикс24 и подвал
2. `onixbit-tilda-privacy-modal.html`

Важно: эти три блока больше не нужно вставлять вручную на обычные страницы, иначе на сайте появятся дубли шапки, контактов, футера, cookie и политики.

## Общие файлы

Единый файл стилей для всех страниц:

- `onixbit-tilda-site-styles.css`

Общий ассет:

- `logo_jumtp.png`

Логотип уже подставлен в HTML как:

- `https://onixbit.su/upload/onixbitru/logo/logo_jumtp.png`

## Основное меню

Пункты меню в `onixbit-tilda-header.html`:

1. Внедрение — `/vnedrenie-bitrix24`
2. Интеграции — `/integratsii-bitrix24`
3. Тарифы — `/tarify-bitrix24`
4. Кейсы — `/cases`
5. Контакты — `/contacts`

Отдельный пункт `CRM` не используется, пока для него нет самостоятельной страницы. CRM-сценарии раскрываются на главной, странице внедрения и странице интеграций.

## Нижнее меню

Ссылки в `onixbit-tilda-contacts-footer.html`:

1. Внедрение — `/vnedrenie-bitrix24`
2. Услуги — `/#services`
3. Сертификаты — `/cases#certificates`
4. Партнёры — `/integratsii-bitrix24#platforms`
5. Кейсы — `/cases`
6. Тарифы — `/tarify-bitrix24`
7. Реквизиты — `/contacts#requisites`
8. Контакты — `/contacts`
9. Политика конфиденциальности — `#privacy`

## Главная

URL: `/`

Задача страницы: быстро объяснить, чем занимается Ониксбит, для кого подходит проектное внедрение Битрикс24 и куда идти дальше.

На саму страницу вставить только эти контентные блоки:

1. `onixbit-tilda-hero-home.html`
2. `onixbit-tilda-problems.html`
3. `onixbit-tilda-audience.html`
4. `onixbit-tilda-services-home.html`
5. `onixbit-tilda-process-home.html`
6. `onixbit-tilda-tariffs-home.html`
7. `onixbit-tilda-trust-home.html`
8. `onixbit-tilda-cases.html`

## Внедрение Битрикс24

URL: `/vnedrenie-bitrix24`

Задача страницы: подробно показать проектный подход к внедрению, этапы, контроль и результат.

На саму страницу вставить только эти контентные блоки:

1. `onixbit-tilda-hero-implementation.html`
2. `onixbit-tilda-implementation-scope.html`
3. `onixbit-tilda-problems.html`
4. `onixbit-tilda-process.html`
5. `onixbit-tilda-why.html`
6. `onixbit-tilda-trust.html`
7. `onixbit-tilda-cases.html`
8. `onixbit-tilda-faq.html`

## Интеграции Битрикс24

URL: `/integratsii-bitrix24`

Задача страницы: показать, как Битрикс24 связывается с сайтом, телефонией, 1С, почтой, мессенджерами и отчётами.

На саму страницу вставить только эти контентные блоки:

1. `onixbit-tilda-hero-integrations.html`
2. `onixbit-tilda-integrations.html`
3. `onixbit-tilda-integration-scenarios.html`
4. `onixbit-tilda-platforms.html`
5. `onixbit-tilda-services.html`
6. `onixbit-tilda-process.html`
7. `onixbit-tilda-certificates.html`
8. `onixbit-tilda-faq.html`

## Тарифы Битрикс24

URL: `/tarify-bitrix24`

Задача страницы: помочь выбрать модель лицензии и показать тарифную линейку без превращения главной в длинный прайс.

На саму страницу вставить только эти контентные блоки:

1. `onixbit-tilda-hero-tariffs.html`
2. `onixbit-tilda-tariffs.html`
3. `onixbit-tilda-tariff-decision.html`
4. `onixbit-tilda-price-line.html`
5. `onixbit-tilda-faq.html`

## Кейсы

URL: `/cases`

Задача страницы: показать типовые сценарии внедрения и подтвердить подход через понятные проектные ситуации.

На саму страницу вставить только эти контентные блоки:

1. `onixbit-tilda-hero-cases.html`
2. `onixbit-tilda-cases-method.html`
3. `onixbit-tilda-cases.html`
4. `onixbit-tilda-audience.html`
5. `onixbit-tilda-trust.html`
6. `onixbit-tilda-certificates.html`

## Контакты

URL: `/contacts`

Задача страницы: дать контактный вход, юридическую информацию и реквизиты. Контактный блок и подвал придут с глобальной страницы Подвал.

На саму страницу вставить только эти контентные блоки:

1. `onixbit-tilda-hero-contacts.html`
2. `onixbit-tilda-contact-start.html`
3. `onixbit-tilda-requisites.html`

## Отдельные служебные блоки

Эти файлы пока не входят в основную карту страниц:

- `onixbit-tilda-hero.html` — старая версия первого экрана.
- `onixbit-tilda-hero-v2.html` — старая общая версия первого экрана внедрения, заменена на страничные hero-блоки.
- `onixbit-tilda-global-polish.html` — вспомогательный/исторический файл полировки.
- `onixbit-tilda-mobile-polish.html` — вспомогательный/исторический файл мобильной полировки.
