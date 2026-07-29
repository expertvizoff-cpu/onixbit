# Zvukogram Voice Helper

Локальный инструмент для генерации голосовых файлов через API Zvukogram.

## Правила доступа

- Генерация разрешена только в проектах `onixbit` и `onixbit-b24`.
- Скрипт запускается только под локальным пользователем владельца проекта.
- API-токен хранится только в `.env.local` и не должен попадать в git, чат или документацию.

## 1. Настрой доступ

Создай или дополни .env.local:

~~~env
ZVUKOGRAM_EMAIL=you@example.com
ZVUKOGRAM_TOKEN=
ZVUKOGRAM_VOICE=название выбранного женского голоса
ZVUKOGRAM_SPEED=0.92
ZVUKOGRAM_PITCH=-1
ZVUKOGRAM_PAUSE_SENTENCE=350
ZVUKOGRAM_PAUSE_PARAGRAPH=650
ZVUKOGRAM_VOLUME=100
~~~

Токен берется в личном кабинете Zvukogram. Голос лучше сначала выбрать на сайте на слух, потом скопировать его название.

## 2. Проверь настройки без списания токенов

~~~bash
npm run voice:zvukogram -- --text voice/zvukogram/texts/after-hours.txt --name after-hours --phone --dry-run
~~~

## 3. Сгенерируй аудио

~~~bash
npm run voice:zvukogram -- --text voice/zvukogram/texts/after-hours.txt --name after-hours --phone
~~~

Результаты появятся в voice/zvukogram/output/:

- after-hours.mp3 — обычная качественная версия.
- after-hours-phone.wav — версия 8000 Hz mono для телефонии.
- after-hours.json — служебная информация: длительность, стоимость, id озвучки.

Важно: флаг --phone делает второй запрос в Zvukogram и списывает токены еще раз.

## Частые настройки

~~~bash
npm run voice:zvukogram -- --text voice/zvukogram/texts/after-hours.txt --name after-hours-slower --speed 0.88 --pause-sentence 450
~~~

~~~bash
npm run voice:zvukogram -- --inline "Здравствуйте. Компания Ониксбит." --name test --dry-run
~~~

~~~bash
npm run voice:zvukogram -- --balance
~~~

## Рабочий процесс

1. Пишем текст обычным языком.
2. Добавляем паузы и ударения в тексте, если голос ошибается.
3. Запускаем --dry-run.
4. Генерируем MP3 и WAV.
5. Если нужно, доводим готовый файл через аудио-монтаж.

## Вздохи между предложениями

Zvukogram надежно управляет паузами через `<break time="..."/>` и параметры `pause_sentence`/`pause_paragraph`. Настоящий слышимый вдох нейросеть не гарантирует: в одной генерации он может появиться естественно, а при повторной генерации исчезнуть.

Надежный способ для финального файла — вставлять короткий breath-аудиофрагмент при монтаже между нужными предложениями. Так результат будет повторяемым и не будет зависеть от случайного поведения голоса.
