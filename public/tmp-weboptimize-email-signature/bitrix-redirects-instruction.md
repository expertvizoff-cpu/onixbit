# Редиректы коротких ссылок на сайте 1С-Битрикс

Нужно сделать короткие адреса:

```text
https://weboptimize.ru/tg
https://weboptimize.ru/vk
https://weboptimize.ru/max
```

и направить их на внешние ссылки:

```text
/tg  -> https://t.me/optimize21
/vk  -> https://vk.com/weboptimize
/max -> https://max.ru/u/f9LHodD0cOKT4xFAVkCUu_S91tUO_qw-gqUqhhSiPRzXkxoA5Fs7u8xFknk
```

## Вариант 1. Через `.htaccess`, если сайт работает на Apache

Этот вариант самый простой, если сервер WebOptimize использует Apache или Apache совместно с BitrixVM.

1. Откройте административную панель 1С-Битрикс.
2. Перейдите в `Контент` -> `Структура сайта` -> `Файлы и папки`.
3. Откройте корень сайта, обычно это `/`.
4. Найдите файл `.htaccess`.
5. Скачайте копию файла перед правкой или скопируйте его содержимое в отдельный текстовый файл.
6. Откройте `.htaccess` на редактирование.
7. Найдите строку `RewriteEngine On`.
8. Сразу после нее добавьте правила:

```apache
RewriteRule ^tg/?$ https://t.me/optimize21 [R=302,L]
RewriteRule ^vk/?$ https://vk.com/weboptimize [R=302,L]
RewriteRule ^max/?$ https://max.ru/u/f9LHodD0cOKT4xFAVkCUu_S91tUO_qw-gqUqhhSiPRzXkxoA5Fs7u8xFknk [R=302,L]
```

9. Сохраните файл.
10. Проверьте в браузере:

```text
https://weboptimize.ru/tg
https://weboptimize.ru/vk
https://weboptimize.ru/max
```

Почему `302`: это временный редирект. Его удобнее менять, если ссылка на мессенджер изменится. После окончательной проверки можно заменить `R=302` на `R=301`, если нужен постоянный редирект.

## Вариант 2. Через папки и `index.php`, если `.htaccess` трогать нельзя

Подходит, если нет доступа к настройкам сервера или правка `.htaccess` запрещена.

1. В админке откройте `Контент` -> `Структура сайта` -> `Файлы и папки`.
2. В корне сайта создайте папку `tg`.
3. В папке `tg` создайте файл `index.php`.
4. Вставьте в него код:

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
LocalRedirect("https://t.me/optimize21", false, "302 Found");
```

5. Аналогично создайте папку `vk` с файлом `index.php`:

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
LocalRedirect("https://vk.com/weboptimize", false, "302 Found");
```

6. Аналогично создайте папку `max` с файлом `index.php`:

```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
LocalRedirect("https://max.ru/u/f9LHodD0cOKT4xFAVkCUu_S91tUO_qw-gqUqhhSiPRzXkxoA5Fs7u8xFknk", false, "302 Found");
```

7. Проверьте адреса:

```text
https://weboptimize.ru/tg
https://weboptimize.ru/vk
https://weboptimize.ru/max
```

## Вариант 3. Если используется Nginx перед PHP-FPM

Этот способ делает редирект на уровне веб-сервера и работает быстрее, но нужен доступ к конфигу Nginx.

В `server`-блок сайта добавьте:

```nginx
location = /tg {
    return 302 https://t.me/optimize21;
}

location = /vk {
    return 302 https://vk.com/weboptimize;
}

location = /max {
    return 302 https://max.ru/u/f9LHodD0cOKT4xFAVkCUu_S91tUO_qw-gqUqhhSiPRzXkxoA5Fs7u8xFknk;
}
```

После изменения проверьте конфиг и перезагрузите Nginx:

```bash
nginx -t
systemctl reload nginx
```

## Проверка

Проверка через браузер:

```text
https://weboptimize.ru/tg
https://weboptimize.ru/vk
https://weboptimize.ru/max
```

Проверка через терминал:

```bash
curl -I https://weboptimize.ru/tg
curl -I https://weboptimize.ru/vk
curl -I https://weboptimize.ru/max
```

Ожидаемый результат: статус `302` и заголовок `Location` с внешней ссылкой.

## Что выбрать

Если есть доступ к `.htaccess`, выбирайте вариант 1. Он самый компактный и не создает лишние страницы в структуре сайта. Если доступ есть только через админку Битрикс, выбирайте вариант 2.
