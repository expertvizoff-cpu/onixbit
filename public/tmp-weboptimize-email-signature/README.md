# Подпись Веб Оптимайз

Папку `public/tmp-weboptimize-email-signature` можно удалить целиком после переноса подписи.

## Файлы

- `index.html` - временный предпросмотр в браузере.
- `weboptimize-signature-fragment.html` - HTML-фрагмент для вставки в почтовую подпись.
- `weboptimize-signature-images.zip` - архив изображений для размещения на сервере.
- `bitrix-redirects-instruction.md` - подробная инструкция по редиректам для сайта на 1С-Битрикс.

## Что заменить в HTML

В `weboptimize-signature-fragment.html` помечены блоки:

- `CONTACTS_TO_REPLACE` - имя, должность, телефоны, email.
- `IMAGE_URLS_TO_HOST` - ссылки на картинки, которые должны лежать на сервере WebOptimize.

Текущие контактные значения взяты с сайта WebOptimize как стартовые:

- `+7 800 350-91-63`
- `+7 495 984-16-34`
- `order@weboptimize.ru`
- `weboptimize.ru/tg`
- `weboptimize.ru/vk`
- `weboptimize.ru/max`

## Куда положить картинки

Разместить файлы из `weboptimize-signature-images.zip` на сервере в папке:

```text
https://weboptimize.ru/email-signature/
```

Тогда актуальные ссылки в подписи:

```text
https://weboptimize.ru/email-signature/icon-phone-emboss.png
https://weboptimize.ru/email-signature/icon-mail-emboss.png
https://weboptimize.ru/email-signature/icon-telegram-emboss.png
https://weboptimize.ru/email-signature/icon-vk-emboss.png
https://weboptimize.ru/email-signature/icon-max-emboss.png
https://weboptimize.ru/email-signature/weboptimize-email-logo.png
```

SVG-логотип `weboptimize-email-logo.svg` оставлен в архиве как исходник, но HTML использует PNG-версию.

## Редиректы как у onixbit.ru/tg

На Onixbit короткие ссылки сделаны в `next.config.ts` через `async redirects()`: `/tg`, `/vk`, `/max` отдают временный HTTP-редирект на внешние соцсети.

Для WebOptimize нужны такие направления:

```text
/tg -> https://t.me/optimize21
/vk -> https://vk.com/weboptimize
/max -> https://max.ru/u/f9LHodD0cOKT4xFAVkCUu_S91tUO_qw-gqUqhhSiPRzXkxoA5Fs7u8xFknk
```

Если сайт WebOptimize на Next.js:

```ts
async redirects() {
  return [
    {
      source: "/tg",
      destination: "https://t.me/optimize21",
      permanent: false,
    },
    {
      source: "/vk",
      destination: "https://vk.com/weboptimize",
      permanent: false,
    },
    {
      source: "/max",
      destination:
        "https://max.ru/u/f9LHodD0cOKT4xFAVkCUu_S91tUO_qw-gqUqhhSiPRzXkxoA5Fs7u8xFknk",
      permanent: false,
    },
  ];
}
```

Если сайт на Nginx:

```nginx
location = /tg { return 302 https://t.me/optimize21; }
location = /vk { return 302 https://vk.com/weboptimize; }
location = /max { return 302 https://max.ru/u/f9LHodD0cOKT4xFAVkCUu_S91tUO_qw-gqUqhhSiPRzXkxoA5Fs7u8xFknk; }
```

Если сайт на Apache:

```apache
Redirect 302 /tg https://t.me/optimize21
Redirect 302 /vk https://vk.com/weboptimize
Redirect 302 /max https://max.ru/u/f9LHodD0cOKT4xFAVkCUu_S91tUO_qw-gqUqhhSiPRzXkxoA5Fs7u8xFknk
```

Подробная отдельная инструкция для сайта на 1С-Битрикс: `bitrix-redirects-instruction.md`.
