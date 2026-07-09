# Email-подпись Ониксбит

Файлы:

- `aleksander-tuzhilkin-fragment.html` - вариант 1: компактная деловая подпись для обычной переписки.
- `aleksander-tuzhilkin.html` - вариант 1 для просмотра в браузере.
- `aleksander-tuzhilkin-wow-fragment.html` - вариант 2: статусная подпись для первого контакта, КП и писем, где нужны доказательства компетенций.
- `aleksander-tuzhilkin-wow.html` - вариант 2 для просмотра в браузере.
- `onixbit-email-logo.png` - PNG-логотип для почтовиков.
- `icon-telegram-mono.png`, `icon-max-mono.png`, `icon-vk-mono.png`, `icon-site-mono.png` - единый набор PNG-значков 28x28: белая плитка, графитовый знак, без hover-эффектов. Telegram/VK/сайт собраны в outline-стиле Tabler Icons; MAX нормализован из официального знака.
- `icon-telegram.png`, `icon-max.png`, `icon-vk.png`, `icon-site.png`, `icon-telegram-plane.png`, `icon-vk-letters.png`, `icon-site-pill.png` - исходные/предыдущие значки, оставлены для истории и возможных вариантов.
- `max-official-colored.png` - официальный цветной знак MAX из брендбука, источник для `icon-max.png`.
- `b24-gold-clean.png` - очищенный от тени бейдж золотого партнёра Битрикс24 для подписи.
- `b24-gold-2025.png` - исходный официальный бейдж золотого партнёра Битрикс24.
- `b24-box-origin.png`, `b24-1c-origin.png`, `b24-crm.png`, `b24-automation.png` - бейджи компетенций Битрикс24, оставлены как исходники; в текущей статусной подписи компетенции выведены текстом, чтобы не перегружать письмо.

После публикации сайта assets доступны по HTTPS, например:

```text
https://onixbit.ru/email-signature/onixbit-email-logo.png
https://onixbit.ru/email-signature/icon-telegram-mono.png
https://onixbit.ru/email-signature/b24-gold-clean.png
```

HTML-файлы используют публичные HTTPS-URL с домена `onixbit.ru`. Подпись задумана как общий шаблон для сотрудников: меняются имя, фамилия и должность, а фирменный левый блок, контакты компании, сертификаты и иконки остаются едиными. У таблиц отключены видимые линии. Реакции при наведении убраны: в почтовиках остаётся обычная надёжная кликабельность через `href` — телефон открывает звонок, почта открывает почтовую программу, сайт и мессенджеры ведут по ссылке. Preview-страницы помечены `noindex, nofollow`, чтобы они не становились отдельными SEO-страницами.
