# Email-подпись Ониксбит

Файлы:

- `aleksander-tuzhilkin-fragment.html` - основной фрагмент для вставки в настройки почты.
- `aleksander-tuzhilkin.html` - основной HTML-файл для просмотра подписи в браузере.
- `aleksander-tuzhilkin-wow-fragment.html` - второй, более современный вариант фрагмента.
- `aleksander-tuzhilkin-wow.html` - второй, более современный вариант для просмотра в браузере.
- `onixbit-email-logo.png` - PNG-логотип для почтовиков.
- `icon-telegram.png`, `icon-max.png`, `icon-vk.png`, `icon-site.png` - прозрачные PNG-значки без фоновых кнопок. Telegram и VK собраны из glyphs Simple Icons; MAX - из официального брендбука.
- `max-official-colored.png` - официальный цветной знак MAX из брендбука, источник для `icon-max.png`.
- `b24-gold-clean.png` - очищенный от тени бейдж золотого партнёра Битрикс24 для подписи.
- `b24-gold-2025.png` - исходный официальный бейдж золотого партнёра Битрикс24.
- `b24-box-origin.png`, `b24-1c-origin.png`, `b24-crm.png`, `b24-automation.png` - бейджи компетенций Битрикс24.

После публикации сайта assets доступны по HTTPS, например:

```text
https://onixbit.ru/email-signature/onixbit-email-logo.png
https://onixbit.ru/email-signature/icon-telegram.png
https://onixbit.ru/email-signature/b24-gold-clean.png
```

HTML-файлы используют публичные HTTPS-URL с домена `onixbit.ru`. У таблиц отключены видимые линии. Hover-эффекты добавлены через CSS для клиентов, которые их поддерживают; базовая кликабельность работает через обычные `href`: телефон открывает звонок, почта - почтовую программу, сайт и мессенджеры - ссылку.
