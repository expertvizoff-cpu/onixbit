export const previewBasePath = "/preview-onixbit-site";

export const previewSlugs = [
  "vnedrenie-bitrix24",
  "razrabotka-saitov-na-1c-bitrix",
  "raboty-po-1c-predpriyatie",
  "tarify-licenziy",
  "cases",
  "certificates",
  "articles",
  "o-kompanii",
  "contacts",
  "privacy",
] as const;

export type PreviewSlug = (typeof previewSlugs)[number];
export type PreviewPageKey = "home" | PreviewSlug;
export type PreviewPageKind = "service" | "proof" | "content" | "company" | "contact" | "legal" | "pricing" | "cases";

export type PreviewPage = {
  key: PreviewPageKey;
  slug?: PreviewSlug;
  kind: PreviewPageKind;
  title: string;
  eyebrow: string;
  description: string;
  caption: string;
  cta: string;
  secondary?: string;
  visual: "system" | "site" | "crm" | "exchange" | "proof" | "article" | "company" | "contact" | "legal" | "pricing";
  highlights: string[];
  sections: Array<{
    title: string;
    text: string;
    points: string[];
  }>;
};

export const previewNav = [
  { label: "Главная", href: previewBasePath },
  { label: "Битрикс24", href: `${previewBasePath}/vnedrenie-bitrix24` },
  { label: "1С-Битрикс", href: `${previewBasePath}/razrabotka-saitov-na-1c-bitrix` },
  { label: "1С", href: `${previewBasePath}/raboty-po-1c-predpriyatie` },
  { label: "Сертификаты", href: `${previewBasePath}/certificates` },
  { label: "О компании", href: `${previewBasePath}/o-kompanii` },
  { label: "Контакты", href: `${previewBasePath}/contacts` },
] as const;

export const previewServiceCards = [
  {
    title: "Битрикс24",
    href: `${previewBasePath}/vnedrenie-bitrix24`,
    label: "CRM-командный центр",
    text: "Заявки, сделки, задачи, роботы, коммуникации и контроль руководителя.",
    icon: "workflow",
  },
  {
    title: "1С-Битрикс",
    href: `${previewBasePath}/razrabotka-saitov-na-1c-bitrix`,
    label: "Сайт как маршрут клиента",
    text: "Структура, каталог, формы, заявки, SEO-основа и передача контекста в CRM.",
    icon: "globe",
  },
  {
    title: "1С и обмены",
    href: `${previewBasePath}/raboty-po-1c-predpriyatie`,
    label: "Данные без ручного дубляжа",
    text: "Заказы, остатки, цены, статусы и границы ответственности между системами.",
    icon: "database",
  },
] as const;

export const previewScenes = [
  {
    marker: "00",
    title: "Ониксбит как архитектор системы",
    text: "В центре не услуга, а управляемая связка: CRM, сайт, 1С, коммуникации, контроль и поддержка.",
  },
  {
    marker: "01",
    title: "Клиентский сигнал входит в контур",
    text: "Форма, звонок, мессенджер или письмо не теряются, а получают маршрут, ответственного и срок.",
  },
  {
    marker: "02",
    title: "Сайт передаёт смысл заявки",
    text: "1С-Битрикс показывает путь клиента: страница, товар, форма, источник и контекст для CRM.",
  },
  {
    marker: "03",
    title: "CRM превращает обращение в работу",
    text: "Битрикс24 собирает сделку, задачу, коммуникацию, робота и контрольный маркер.",
  },
  {
    marker: "04",
    title: "1С синхронизирует данные",
    text: "Заказы, остатки, цены и статусы проходят через понятные правила обмена.",
  },
] as const;

export const previewProof = [
  {
    title: "14 лет",
    text: "в разработке и интеграциях",
  },
  {
    title: "Партнёрства",
    text: "Битрикс24, 1С-Битрикс, ASPRO, Wazzup, ChatApp, Scloud",
  },
  {
    title: "Связка",
    text: "CRM, сайт, 1С и коммуникации в одной логике",
  },
] as const;

export const previewPages: Record<PreviewPageKey, PreviewPage> = {
  home: {
    key: "home",
    kind: "content",
    title: "CRM, сайт и 1С как одна рабочая система",
    eyebrow: "Демо редизайна Ониксбит",
    description:
      "Черновая версия нового сайта: тёмная фирменная палитра, системная метафора, меньше текста и больше визуального объяснения.",
    caption: "Главная сцена показывает, как клиентский сигнал проходит через сайт, CRM, 1С и контроль.",
    cta: "Обсудить систему",
    secondary: "Смотреть услуги",
    visual: "system",
    highlights: ["Битрикс24", "1С-Битрикс", "1С", "интеграции", "контроль"],
    sections: [],
  },
  "vnedrenie-bitrix24": {
    key: "vnedrenie-bitrix24",
    slug: "vnedrenie-bitrix24",
    kind: "service",
    title: "Битрикс24 под реальный процесс продаж",
    eyebrow: "CRM, коммуникации, автоматизация",
    description:
      "Настраиваем воронки, права, роботов, задачи, коммуникации и отчёты так, чтобы CRM стала рабочим маршрутом, а не красивой витриной.",
    caption: "Заявка получает ответственного, следующий шаг и контроль срока.",
    cta: "Обсудить внедрение",
    secondary: "Посмотреть тарифы",
    visual: "crm",
    highlights: ["воронки", "роботы", "права", "отчёты", "коммуникации"],
    sections: [
      {
        title: "Что показываем в демо",
        text: "CRM-сцена работает как командный центр: входящие обращения, сделки, задачи и автоматизация появляются не карточками, а как связанный маршрут.",
        points: ["источники заявок", "воронки и этапы", "ответственные", "роботы и SLA"],
      },
      {
        title: "Что получает клиент",
        text: "Понятную карту работы отдела продаж и систему, которую можно контролировать после запуска.",
        points: ["регламент работы", "сценарии тестирования", "обучение команды", "план развития"],
      },
    ],
  },
  "razrabotka-saitov-na-1c-bitrix": {
    key: "razrabotka-saitov-na-1c-bitrix",
    slug: "razrabotka-saitov-na-1c-bitrix",
    kind: "service",
    title: "Сайт на 1С-Битрикс как часть продаж",
    eyebrow: "Сайты, каталоги, интернет-магазины",
    description:
      "Проектируем структуру, каталог, формы и интеграции так, чтобы сайт передавал в CRM не просто заявку, а полезный контекст.",
    caption: "Страница, товар, форма и источник становятся частью маршрута клиента.",
    cta: "Обсудить сайт",
    secondary: "Смотреть кейсы",
    visual: "site",
    highlights: ["структура", "каталог", "формы", "заказы", "SEO"],
    sections: [
      {
        title: "Сайт не отдельная витрина",
        text: "В демо сайт показан как стеклянная рабочая плоскость: каталог, форма, заказ и аналитика передают смысл дальше.",
        points: ["корпоративный сайт", "каталог", "интернет-магазин", "личный кабинет"],
      },
      {
        title: "Интеграции заранее в архитектуре",
        text: "Формы, заказы, товары и статусы проектируются с учётом Битрикс24 и 1С.",
        points: ["CRM", "1С", "платежи", "доставка"],
      },
    ],
  },
  "raboty-po-1c-predpriyatie": {
    key: "raboty-po-1c-predpriyatie",
    slug: "raboty-po-1c-predpriyatie",
    kind: "service",
    title: "1С и обмены без ручного дубляжа",
    eyebrow: "1С, сайт, CRM, статусы",
    description:
      "Разбираем правила обмена между 1С, сайтом и Битрикс24: заказы, остатки, цены, статусы, ошибки и зоны ответственности.",
    caption: "Данные идут по тонким световым маршрутам через понятный источник истины.",
    cta: "Обсудить обмены",
    secondary: "Посмотреть сертификаты",
    visual: "exchange",
    highlights: ["заказы", "остатки", "цены", "статусы", "ошибки"],
    sections: [
      {
        title: "Сцена обменов",
        text: "В центре 1С, по краям Битрикс24 и 1С-Битрикс. Верхние и нижние потоки показывают синхронизацию туда и обратно.",
        points: ["1С-Битрикс -> 1С", "1С -> Битрикс24", "Битрикс24 -> 1С", "1С -> 1С-Битрикс"],
      },
      {
        title: "Границы ответственности",
        text: "Отдельно показываем, где зона Ониксбит, где типовые настройки, а где нужна глубокая 1С-экспертиза.",
        points: ["логи обмена", "регламент ошибок", "Scloud", "поддержка"],
      },
    ],
  },
  "tarify-licenziy": {
    key: "tarify-licenziy",
    slug: "tarify-licenziy",
    kind: "pricing",
    title: "Лицензии и бюджет без туманной суммы",
    eyebrow: "Тарифы, внедрение, интеграции",
    description:
      "Демо-страница показывает бюджет как систему слоёв: лицензии, внедрение, интеграции, обучение и поддержка.",
    caption: "КП собирается из понятных частей, а не из одной общей цифры.",
    cta: "Получить расчёт",
    secondary: "Открыть контакты",
    visual: "pricing",
    highlights: ["лицензии", "внедрение", "интеграции", "обучение", "поддержка"],
    sections: [
      {
        title: "Что влияет на стоимость",
        text: "Количество пользователей, тарифы, объём настроек, интеграции, обучение и поддержка после запуска.",
        points: ["Битрикс24", "1С-Битрикс", "сервисы связи", "1С"],
      },
    ],
  },
  cases: {
    key: "cases",
    slug: "cases",
    kind: "cases",
    title: "Кейсы как честные сценарии, а не декоративные логотипы",
    eyebrow: "Задача, ограничение, решение",
    description:
      "В демо кейсы показываются как рабочие маршруты: что было сломано, как собрали систему, где были ограничения и что проверять.",
    caption: "Кейс должен помогать понять подход, а не просто украшать страницу.",
    cta: "Обсудить похожую задачу",
    secondary: "Читать статьи",
    visual: "proof",
    highlights: ["CRM", "сайт", "обмены", "контроль", "ограничения"],
    sections: [
      {
        title: "Формат будущих кейсов",
        text: "Публикуем только согласованные материалы: задача, ограничения, решение и польза для бизнеса.",
        points: ["без вымышленных цифр", "без чужих логотипов", "с понятным контекстом", "с ограничениями"],
      },
    ],
  },
  certificates: {
    key: "certificates",
    slug: "certificates",
    kind: "proof",
    title: "Сертификаты как экосистема компетенций",
    eyebrow: "Партнёрства и подтверждения",
    description:
      "Битрикс24, 1С-Битрикс, ASPRO, Wazzup, ChatApp и Scloud показаны не списком документов, а как зоны экспертизы вокруг системы.",
    caption: "Компетенции можно проверить до старта работ.",
    cta: "Обсудить проект",
    secondary: "О компании",
    visual: "proof",
    highlights: ["Битрикс24", "1С-Битрикс", "ASPRO", "Wazzup", "Scloud"],
    sections: [
      {
        title: "Как это должно работать в демо",
        text: "Документы становятся proof-nodes: по клику можно открыть сертификат, а рядом видно, за какую часть системы отвечает компетенция.",
        points: ["CRM", "сайты", "интеграции", "коммуникации"],
      },
    ],
  },
  articles: {
    key: "articles",
    slug: "articles",
    kind: "content",
    title: "Статьи как диагностический помощник",
    eyebrow: "Записки интегратора",
    description:
      "База знаний должна помогать руководителю увидеть проблему: заявки, CRM, задачи, роботы, доступы и обмены.",
    caption: "Здесь ассистент-метафора уместна: он ведёт по диагностике и показывает следующий шаг.",
    cta: "Открыть диагностику",
    secondary: "Обсудить вопрос",
    visual: "article",
    highlights: ["CRM", "заявки", "роботы", "доступы", "1С"],
    sections: [
      {
        title: "Как подать статьи",
        text: "Не блог ради блога, а серия диагностических маршрутов: ситуация, симптомы, проверка, ошибки, следующий шаг.",
        points: ["рубрики", "схемы", "FAQ", "CTA к аудиту"],
      },
    ],
  },
  "o-kompanii": {
    key: "o-kompanii",
    slug: "o-kompanii",
    kind: "company",
    title: "Ониксбит: архитектор связки CRM, сайта и 1С",
    eyebrow: "О компании",
    description:
      "Страница должна показать живую команду, опыт, аккуратный подход и способность держать всю систему целиком.",
    caption: "Профессионально, спокойно, с доказательствами и без лишнего пафоса.",
    cta: "Познакомиться на созвоне",
    secondary: "Сертификаты",
    visual: "company",
    highlights: ["14 лет", "B2B", "архитектура", "поддержка", "Тула"],
    sections: [
      {
        title: "Что важно показать",
        text: "Не сухую историю компании, а уверенность: кто отвечает, как думаем, как фиксируем границы работ и что будет после запуска.",
        points: ["опыт", "подход", "документы", "контакты"],
      },
    ],
  },
  contacts: {
    key: "contacts",
    slug: "contacts",
    kind: "contact",
    title: "Контакты и первый разбор системы",
    eyebrow: "Связаться с Ониксбит",
    description:
      "Контактная страница должна быть короткой: телефон, мессенджеры, почта, форма, реквизиты и понятное ожидание первого разговора.",
    caption: "Первый шаг - короткая диагностика, а не продажа непонятного пакета.",
    cta: "Оставить заявку",
    secondary: "Написать в Telegram",
    visual: "contact",
    highlights: ["8 800 100-53-03", "info@onixbit.ru", "Telegram", "MAX", "ВКонтакте"],
    sections: [
      {
        title: "Что спросим на первом контакте",
        text: "Какие системы уже есть, где теряются заявки или данные, кто отвечает за процесс и какой результат нужен бизнесу.",
        points: ["системы", "боли", "ограничения", "следующий шаг"],
      },
    ],
  },
  privacy: {
    key: "privacy",
    slug: "privacy",
    kind: "legal",
    title: "Политика конфиденциальности",
    eyebrow: "Юридическая страница",
    description:
      "Даже privacy в демо должна выглядеть частью сайта: спокойно, понятно, без визуального выпадения из общей системы.",
    caption: "Формы, аналитика и cookies объясняются человеческим языком.",
    cta: "Вернуться к контактам",
    secondary: "На главную",
    visual: "legal",
    highlights: ["заявки", "cookies", "аналитика", "хранение", "права пользователя"],
    sections: [
      {
        title: "Какие данные используются",
        text: "Имя, телефон, email, содержание обращения, технические cookies и обезличенная аналитика посещений.",
        points: ["ответ на заявку", "улучшение сайта", "без продажи данных", "по запросу пользователя"],
      },
      {
        title: "Что важно в демо",
        text: "Политика должна быть читабельной и связанной с cookie-плашкой, формой и контактами.",
        points: ["согласие", "обязательные cookies", "аналитика", "контакт для запроса"],
      },
    ],
  },
};

export function getPreviewPage(key: string): PreviewPage | null {
  if (key === "home") return previewPages.home;
  return Object.prototype.hasOwnProperty.call(previewPages, key) ? previewPages[key as PreviewPageKey] : null;
}
