const PLUGIN_KEY = "onixbit-setup";

const PAGES = [
  "00 Cover",
  "01 Styles",
  "02 Site Map",
  "03 Light Pages",
  "04 Process Pages",
  "05 Key Screens",
  "06 Homepage Film",
  "07 Services",
  "08 Articles",
  "09 Components",
];

const colors = {
  graphite: "#09090b",
  graphite2: "#101014",
  cherry: "#18070a",
  red: "#e11931",
  redDeep: "#8f1021",
  amber: "#ffbd3d",
  amberSoft: "#ffd36c",
  cyan: "#61d9ff",
  blue: "#2f86ff",
  light: "#f6f7f4",
  lightPanel: "#ffffff",
  ink: "#171413",
  inkMuted: "#5f6461",
  line: "#d8d3c8",
  white: "#f6f3ee",
  muted: "#a6a0a0",
  glass: "#ffffff",
  green: "#66e3a2",
};

const sceneData = [
  {
    index: "00",
    title: "Onixbit as system architect",
    caption: "CRM, сайт и 1С в одной рабочей системе.",
    meaning: "Сразу видно: Ониксбит собирает бизнес-контур, а не отдельные блоки.",
    nodes: ["Bitrix24", "1C-Битрикс", "1C", "каналы", "аналитика", "поддержка"],
  },
  {
    index: "01",
    title: "Client signal enters the system",
    caption: "Заявки не должны жить в разных каналах.",
    meaning: "Форма, звонок, мессенджер и почта сходятся в один входящий маршрут.",
    nodes: ["форма", "телефон", "мессенджер", "email", "CRM"],
  },
  {
    index: "02",
    title: "Website and 1C-Bitrix as the client route",
    caption: "Сайт передаёт смысл заявки, а не просто сообщение.",
    meaning: "Страница, товар, источник и форма уходят в CRM как контекст заявки.",
    nodes: ["лендинг", "каталог", "форма", "источник", "CRM"],
  },
  {
    index: "03",
    title: "Bitrix24 becomes the work route",
    caption: "CRM превращает обращение в управляемую работу.",
    meaning: "Сделка получает ответственного, этап, задачу, робота и контроль.",
    nodes: ["сделка", "ответственный", "задача", "робот", "контроль"],
  },
  {
    index: "04",
    title: "1C and data exchange",
    caption: "Данные проходят по правилам, без ручного дубляжа.",
    meaning: "Заказы, остатки, цены и статусы движутся между сайтом, CRM и 1C.",
    nodes: ["1C-Битрикс", "Bitrix24", "1C", "заказы", "остатки"],
  },
];

const sitePages = [
  { group: "main", mode: "light", title: "Главная", url: "/", cta: "Обсудить систему", blocks: ["Hero: единый контур", "Направления услуг", "Маршрут заявки", "Доказательства", "Форма диагностики"] },
  { group: "services", mode: "light", title: "Внедрение Битрикс24", url: "/vnedrenie-bitrix24", cta: "Разобрать CRM", blocks: ["CRM command center", "Заявки и сделки", "Задачи и роботы", "Риски поверхностного внедрения", "Кейсы и CTA"] },
  { group: "services", mode: "light", title: "Сайты на 1С-Битрикс", url: "/razrabotka-saitov-na-1c-bitrix", cta: "Обсудить сайт", blocks: ["Сайт как часть продаж", "Структура и формы", "Передача в CRM", "Связка с 1С", "SEO и UX"] },
  { group: "services", mode: "light", title: "Работы по 1С", url: "/raboty-po-1c-predpriyatie", cta: "Проверить обмены", blocks: ["1С как источник данных", "Цены и остатки", "Документы и статусы", "Монитор обмена", "Поддержка"] },
  { group: "services", mode: "light", title: "Тарифы и лицензии", url: "/tarify-licenziy", cta: "Подобрать тариф", blocks: ["Подбор лицензии", "Сравнение сегментов", "Что уточнить", "FAQ", "Форма подбора"] },
  { group: "proof", mode: "light", title: "Кейсы", url: "/cases", cta: "Показать похожую задачу", blocks: ["Фильтры", "Проблема", "Система до", "Что сделали", "Результат"] },
  { group: "proof", mode: "light", title: "Страница кейса", url: "/cases/[slug]", cta: "Разобрать похожий процесс", blocks: ["Резюме", "До внедрения", "Решение", "Процесс после", "Вывод"] },
  { group: "proof", mode: "light", title: "Сертификаты", url: "/certificates", cta: "Проверить компетенции", blocks: ["Штаб компетенций", "Битрикс24", "1С-Битрикс", "Партнёры", "Связь с задачами"] },
  { group: "proof", mode: "light", title: "База знаний", url: "/articles", cta: "Получить диагностику", blocks: ["Записки интегратора", "Серии", "Рекомендации", "Связанные услуги", "CTA"] },
  { group: "proof", mode: "light", title: "Статья", url: "/articles/[slug]", cta: "Проверить у себя", blocks: ["Проблема", "Чек-лист", "Ошибки", "Нормальная система", "FAQ"] },
  { group: "proof", mode: "light", title: "О компании", url: "/o-kompanii", cta: "Познакомиться с подходом", blocks: ["Команда", "Принципы", "Компетенции", "Процесс проекта", "Контакты"] },
  { group: "process", mode: "dark", title: "Процессы", url: "/processy", cta: "Выбрать сценарий", blocks: ["Dark hub", "Каталог сценариев", "Действие", "Система", "Бизнес-результат"] },
  { group: "process", mode: "dark", title: "Маршрут заявки", url: "/processy/marshrut-zayavki", cta: "Разобрать маршрут", blocks: ["Chat", "CRM", "Manager", "1C", "Control"] },
  { group: "process", mode: "dark", title: "Заказ сайт + CRM + 1С", url: "/processy/zakaz-sait-1c-crm", cta: "Проверить заказ", blocks: ["Выбор на сайте", "Сделка в CRM", "Проверка в 1С", "Статус", "Контроль"] },
  { group: "process", mode: "dark", title: "Сбой обмена", url: "/processy/sboy-obmena", cta: "Проверить обмены", blocks: ["Ошибка", "Где сбой", "Задача", "Срок", "Предотвращение"] },
  { group: "process", mode: "dark", title: "Поддержка из каналов", url: "/processy/podderzhka-iz-kanalov", cta: "Собрать каналы", blocks: ["Сообщение", "История клиента", "Задача", "SLA", "Очередь"] },
  { group: "process", mode: "dark", title: "Контроль руководителя", url: "/processy/kontrol-rukovoditelya", cta: "Построить контроль", blocks: ["Панель", "Источник", "Ответственный", "SLA", "Drill-down"] },
  { group: "support", mode: "light", title: "Контакты", url: "/contacts", cta: "Написать или позвонить", blocks: ["Телефон", "Мессенджеры", "Форма", "Что дальше", "Карта"] },
  { group: "support", mode: "light", title: "Privacy", url: "/privacy", cta: "Вернуться к контакту", blocks: ["Правила", "Данные", "Формы", "Контакты"] },
];

let displayFont;
let bodyFont;
let bodyBoldFont;

main().catch((error) => {
  figma.notify(`Onixbit setup failed: ${error.message}`);
  figma.closePlugin(error.message);
});

async function main() {
  displayFont = await resolveFont([
    { family: "Montserrat", style: "SemiBold" },
    { family: "Montserrat", style: "Bold" },
    { family: "Inter", style: "Semi Bold" },
    { family: "Inter", style: "Bold" },
  ]);

  bodyFont = await resolveFont([
    { family: "Manrope", style: "Regular" },
    { family: "Inter", style: "Regular" },
  ]);

  bodyBoldFont = await resolveFont([
    { family: "Manrope", style: "SemiBold" },
    { family: "Manrope", style: "Bold" },
    { family: "Inter", style: "Semi Bold" },
    { family: "Inter", style: "Bold" },
  ]);

  const pages = ensurePages();
  for (const page of Object.values(pages)) {
    purgeGenerated(page);
  }

  createLocalStyles();
  buildCover(pages["00 Cover"]);
  buildStyles(pages["01 Styles"]);
  buildSiteMap(pages["02 Site Map"]);
  buildLightPages(pages["03 Light Pages"]);
  buildProcessPages(pages["04 Process Pages"]);
  buildKeyScreens(pages["05 Key Screens"]);
  buildHomepageFilm(pages["06 Homepage Film"]);
  buildServices(pages["07 Services"]);
  buildArticles(pages["08 Articles"]);
  buildComponents(pages["09 Components"]);

  figma.currentPage = pages["02 Site Map"];
  figma.viewport.scrollAndZoomIntoView([...pages["02 Site Map"].children]);
  figma.notify("Onixbit Figma structure is ready.");
  figma.closePlugin("Onixbit Figma structure is ready.");
}

function ensurePages() {
  const pages = {};
  const onlyDefaultPage = figma.root.children.length === 1 && figma.root.children[0].name === "Page 1";

  for (const [index, pageName] of PAGES.entries()) {
    let page = figma.root.children.find((candidate) => candidate.name === pageName);

    if (!page && index === 0 && onlyDefaultPage) {
      page = figma.root.children[0];
      page.name = pageName;
    }

    if (!page) {
      page = figma.createPage();
      page.name = pageName;
    }

    pages[pageName] = page;
  }

  return pages;
}

function purgeGenerated(page) {
  for (const child of [...page.children]) {
    if (child.getPluginData(PLUGIN_KEY) === "generated") {
      child.remove();
    }
  }
}

function createLocalStyles() {
  upsertPaintStyle("Onixbit / Graphite", colors.graphite);
  upsertPaintStyle("Onixbit / Black cherry", colors.cherry);
  upsertPaintStyle("Onixbit / Red", colors.red);
  upsertPaintStyle("Onixbit / Amber", colors.amber);
  upsertPaintStyle("Onixbit / Signal cyan", colors.cyan);
  upsertPaintStyle("Onixbit / Text primary", colors.white);
  upsertPaintStyle("Onixbit / Text muted", colors.muted);

  upsertTextStyle("Onixbit / Display / Hero", displayFont, 64, 70);
  upsertTextStyle("Onixbit / Display / Section", displayFont, 38, 46);
  upsertTextStyle("Onixbit / Body / Lead", bodyFont, 20, 30);
  upsertTextStyle("Onixbit / Body / Regular", bodyFont, 16, 24);
  upsertTextStyle("Onixbit / HUD / Caption", bodyBoldFont, 13, 18);
}

function buildCover(page) {
  const frame = createFrame(page, "Cover / Onixbit redesign system", 0, 0, 1440, 900, colors.graphite);
  addBackdrop(frame, 1440, 900);

  addText(frame, "Ониксбит", 80, 72, 520, 86, displayFont, 72, 78, colors.white);
  addText(frame, "Connected business system redesign", 84, 158, 560, 36, bodyFont, 20, 30, colors.amberSoft);
  addText(frame, "Рабочий файл для cinematic scrollytelling: CRM, сайт, 1C, каналы, аналитика и поддержка собираются в один управляемый контур.", 84, 224, 610, 108, bodyFont, 22, 34, colors.white);

  const core = addSystemCore(frame, 980, 410, 172, "Onixbit\ncore");
  addNodeCluster(frame, core.x + 86, core.y + 86, 300, ["Bitrix24", "1C-Битрикс", "1C", "каналы", "аналитика", "поддержка"]);

  addPanel(frame, "File map", 84, 592, 510, 210, [
    "00 Cover",
    "01 Styles",
    "02 Homepage Film",
    "03 Services",
    "04 Articles",
    "05 Components",
  ]);
  addHudTag(frame, "status / prepared for design work", 980, 750, 300, colors.green);
}

function buildStyles(page) {
  const frame = createFrame(page, "Styles / Color, type and motion tokens", 0, 0, 1440, 900, colors.graphite);
  addBackdrop(frame, 1440, 900);

  addText(frame, "Design tokens", 72, 64, 520, 56, displayFont, 44, 54, colors.white);
  addText(frame, "Premium dark mode: graphite and black cherry as base, red and amber as brand energy, cyan only as a secondary data signal.", 74, 128, 920, 58, bodyFont, 18, 28, colors.muted);

  const swatches = [
    ["Graphite", colors.graphite],
    ["Black cherry", colors.cherry],
    ["Onixbit red", colors.red],
    ["Amber", colors.amber],
    ["Signal cyan", colors.cyan],
    ["Text", colors.white],
  ];

  swatches.forEach(([label, color], index) => {
    const x = 72 + index * 210;
    addRect(frame, x, 240, 168, 116, color, 10, color === colors.graphite ? colors.redDeep : undefined);
    addText(frame, label, x, 374, 168, 24, bodyBoldFont, 15, 22, colors.white);
    addText(frame, color, x, 402, 168, 20, bodyFont, 13, 18, colors.muted);
  });

  addText(frame, "Typography", 72, 496, 300, 44, displayFont, 34, 42, colors.white);
  addText(frame, "CRM, сайт и 1C в одной рабочей системе", 72, 560, 720, 76, displayFont, 44, 54, colors.white);
  addText(frame, "Короткие HUD-подписи объясняют бизнес-смысл сцены, а не заменяют её длинным текстовым блоком.", 74, 646, 780, 56, bodyFont, 18, 28, colors.muted);

  addPanel(frame, "Motion grammar", 930, 500, 350, 236, [
    "Sticky fullscreen stage",
    "Camera moves through system",
    "Lines wake up on scroll",
    "HUD captions stay secondary",
    "Reduced-motion keeps sequence",
  ]);
}

function buildHomepageFilm(page) {
  sceneData.forEach((scene, index) => {
    const desktop = createFrame(page, `Desktop / Scene ${scene.index} / ${scene.title}`, index * 1520, 0, 1440, 900, colors.graphite);
    buildDesktopScene(desktop, scene);

    const mobile = createFrame(page, `Mobile / Scene ${scene.index} / ${scene.title}`, index * 450, 1020, 390, 844, colors.graphite);
    buildMobileScene(mobile, scene);
  });
}

function buildDesktopScene(frame, scene) {
  addBackdrop(frame, 1440, 900);
  addSceneHeader(frame, scene, 1440);

  if (scene.index === "00") {
    const core = addSystemCore(frame, 640, 288, 178, "Onixbit\ncore");
    addNodeCluster(frame, core.x + 89, core.y + 89, 325, scene.nodes);
    addGlowLine(frame, 730, 380, 1030, 210, colors.red, 0.55);
    addGlowLine(frame, 730, 380, 1060, 590, colors.amber, 0.48);
    addCaptionBlock(frame, scene, 72, 630);
    addCta(frame, "Обсудить систему", 72, 770, 228);
    addHudTag(frame, "secondary / Смотреть направления", 324, 779, 256, colors.cyan);
    return;
  }

  if (scene.index === "01") {
    const intake = addSystemCore(frame, 860, 318, 150, "единый\nвход");
    const channels = [
      ["форма сайта", 150, 230],
      ["звонок", 220, 390],
      ["мессенджер", 160, 560],
      ["email", 330, 690],
    ];
    channels.forEach(([label, x, y], i) => {
      addSignalCard(frame, label, x, y, i === 2 ? colors.amber : colors.cyan);
      addGlowLine(frame, x + 160, y + 34, intake.x + 75, intake.y + 75, i === 2 ? colors.amber : colors.cyan, 0.5);
    });
    addRect(frame, 540, 190, 180, 70, "#151217", 8, colors.redDeep, 0.38);
    addText(frame, "потерянные\nсигналы", 562, 210, 130, 40, bodyFont, 14, 18, colors.muted);
    addCaptionBlock(frame, scene, 72, 686);
    return;
  }

  if (scene.index === "02") {
    addBrowserPlane(frame, 182, 188, 630, 430);
    const crm = addSystemCore(frame, 990, 350, 142, "CRM");
    [["страница", 740, 250], ["товар", 780, 342], ["форма", 760, 434], ["источник", 805, 524]].forEach(([label, x, y], i) => {
      addHudTag(frame, label, x, y, 118, i === 2 ? colors.amber : colors.cyan);
      addGlowLine(frame, x + 120, y + 15, crm.x + 71, crm.y + 71, i === 2 ? colors.amber : colors.cyan, 0.42);
    });
    addCaptionBlock(frame, scene, 72, 676);
    return;
  }

  if (scene.index === "03") {
    addCrmBoard(frame, 170, 172, 720, 520);
    const control = addSystemCore(frame, 1030, 345, 136, "контроль");
    addGlowLine(frame, 840, 300, control.x + 68, control.y + 68, colors.red, 0.44);
    addGlowLine(frame, 840, 495, control.x + 68, control.y + 68, colors.amber, 0.46);
    addHudTag(frame, "робот / задача / срок", 930, 560, 230, colors.amber);
    addCaptionBlock(frame, scene, 72, 706);
    return;
  }

  const site = addOrbitNode(frame, 260, 380, "1C-Битрикс", colors.amber);
  const crm = addOrbitNode(frame, 1030, 380, "Bitrix24", colors.cyan);
  const core = addSystemCore(frame, 635, 320, 170, "1C");
  addGlowLine(frame, site.x + 70, site.y + 70, core.x + 85, core.y + 85, colors.amber, 0.54);
  addGlowLine(frame, core.x + 85, core.y + 85, crm.x + 70, crm.y + 70, colors.cyan, 0.54);
  addGlowLine(frame, crm.x + 70, crm.y + 42, core.x + 85, core.y + 40, colors.red, 0.4);
  addGlowLine(frame, core.x + 85, core.y + 128, site.x + 70, site.y + 104, colors.amber, 0.4);
  ["заказы", "остатки", "цены", "статусы"].forEach((label, index) => {
    addHudTag(frame, label, 530 + index * 118, 585, 92, index % 2 ? colors.cyan : colors.amber);
  });
  addCaptionBlock(frame, scene, 72, 706);
}

function buildMobileScene(frame, scene) {
  addBackdrop(frame, 390, 844);
  addText(frame, `Scene ${scene.index}`, 24, 32, 120, 24, bodyBoldFont, 13, 18, colors.amber);
  addText(frame, scene.caption, 24, 84, 310, 94, displayFont, 28, 34, colors.white);

  const core = addSystemCore(frame, 120, 272, 150, scene.index === "04" ? "1C" : "Onixbit");
  const routeLabels = scene.nodes.slice(0, 3);
  routeLabels.forEach((label, index) => {
    const y = 505 + index * 78;
    addSignalCard(frame, label, 42, y, index === 1 ? colors.amber : colors.cyan, 300);
    addGlowLine(frame, 192, y, core.x + 75, core.y + 75, index === 1 ? colors.amber : colors.cyan, 0.45);
  });

  addText(frame, scene.meaning, 24, 706, 330, 76, bodyFont, 15, 22, colors.muted);
  addCta(frame, "Обсудить систему", 24, 784, 190);
}

function buildKeyScreens(page) {
  const home = createFrame(page, "Key / 01 Homepage / light system", 0, 0, 1440, 920, colors.light);
  buildKeyHomepage(home);

  const service = createFrame(page, "Key / 02 Service / Bitrix24", 1520, 0, 1440, 920, colors.light);
  buildKeyService(service);

  const process = createFrame(page, "Key / 03 Process / request route", 3040, 0, 1440, 920, colors.graphite);
  buildKeyRequestRoute(process);

  const notes = createFrame(page, "Key / Notes / review checklist", 0, 1040, 1440, 360, colors.light);
  addLightBackdrop(notes, 1440, 360);
  addText(notes, "Что смотрим на этих трёх экранах", 72, 56, 720, 48, displayFont, 36, 44, colors.ink);
  addText(notes, "1. Светлая главная должна быстро давать доверие и вход в процессное демо. 2. Услуга должна быть понятной без технической лекции. 3. Тёмная сцена должна показывать маршрут заявки, а не просто красивый фон.", 74, 126, 910, 76, bodyFont, 18, 28, colors.inkMuted);
  addReviewChip(notes, "понятно за 5 секунд", 72, 248, colors.red);
  addReviewChip(notes, "есть путь к заявке", 312, 248, colors.amber);
  addReviewChip(notes, "процесс виден глазами", 536, 248, colors.green);
  addReviewChip(notes, "без обязательной загрузки", 790, 248, colors.blue);
}

function buildKeyHomepage(frame) {
  addLightBackdrop(frame, 1440, 920);
  addKeyLightHeader(frame, 1440);
  addText(frame, "Ониксбит соединяет сайт, CRM и 1С в управляемую систему", 74, 142, 680, 176, displayFont, 58, 66, colors.ink);
  addText(frame, "Помогаем собственнику видеть путь заявки, работу менеджера, данные 1С и точки риска без ручного контроля в десятках окон.", 78, 342, 570, 78, bodyFont, 19, 30, colors.inkMuted);
  addCta(frame, "Обсудить задачу", 78, 458, 220);
  addOutlineButton(frame, "Посмотреть путь заявки", 318, 458, 250, colors.red, false);
  addProofLine(frame, 78, 560, ["Битрикс24", "1С-Битрикс", "1С", "обмены", "поддержка"]);
  addConnectedLightSystem(frame, 770, 142, 560, 520);
  addMetricStrip(frame, 74, 760, 1250, ["заявка не теряется", "ответственный виден", "1С говорит с CRM", "руководитель видит риск"]);
}

function buildKeyService(frame) {
  addLightBackdrop(frame, 1440, 920);
  addKeyLightHeader(frame, 1440);
  addText(frame, "/vnedrenie-bitrix24", 76, 124, 300, 20, bodyBoldFont, 12, 18, colors.red);
  addText(frame, "Внедрение Битрикс24, которое управляет продажами", 74, 166, 650, 126, displayFont, 48, 56, colors.ink);
  addText(frame, "Настраиваем воронки, задачи, роботов, права и контроль так, чтобы CRM показывала реальную работу отдела, а не была красивой таблицей.", 78, 320, 570, 82, bodyFont, 18, 29, colors.inkMuted);
  addCta(frame, "Разобрать CRM", 78, 432, 198);
  addOutlineButton(frame, "Путь заявки", 296, 432, 170, colors.red, false);
  addServiceControlPanel(frame, 760, 134, 560, 430);
  addServiceFeature(frame, "Воронки", "этапы, причины провалов, источники", 78, 610, colors.red);
  addServiceFeature(frame, "Роботы", "задачи, сроки, уведомления, контроль", 386, 610, colors.amber);
  addServiceFeature(frame, "Интеграции", "сайт, телефония, мессенджеры, 1С", 694, 610, colors.blue);
  addServiceFeature(frame, "Руководитель", "SLA, просрочки, ответственные", 1002, 610, colors.green);
}

function buildKeyRequestRoute(frame) {
  addBackdrop(frame, 1440, 920);
  addKeyDarkHeader(frame, 1440);
  addHudTag(frame, "/processy/marshrut-zayavki", 76, 116, 260, colors.amber);
  addText(frame, "Заявка проходит весь маршрут", 74, 166, 610, 112, displayFont, 54, 62, colors.white);
  addText(frame, "Клиент пишет на сайте. На экране сразу видно, как обращение становится сделкой, задачей менеджера, обменом с 1С и контрольной точкой руководителя.", 78, 306, 560, 90, bodyFont, 18, 29, colors.muted);
  addCta(frame, "Разобрать мой маршрут", 78, 432, 250);
  addOutlineButton(frame, "Вернуться к услуге", 352, 432, 218, colors.amber, true);
  addDarkRouteStage(frame, 700, 110, 630, 630);
  addDirectorStrip(frame, 76, 700, 1260);
}

function addKeyLightHeader(parent, width) {
  addRect(parent, 52, 34, width - 104, 58, colors.lightPanel, 8, colors.line, 1);
  addText(parent, "Onixbit", 76, 52, 120, 18, bodyBoldFont, 15, 20, colors.ink);
  ["Услуги", "Процессы", "Кейсы", "База знаний", "О компании"].forEach((label, index) => {
    addText(parent, label, 240 + index * 116, 53, 105, 18, bodyFont, 13, 18, colors.inkMuted);
  });
  addText(parent, "8 800 100-53-03", width - 338, 52, 150, 18, bodyBoldFont, 13, 18, colors.ink);
  addRect(parent, width - 172, 44, 100, 38, colors.red, 8, colors.red, 1);
  addText(parent, "Обсудить", width - 154, 56, 64, 14, bodyBoldFont, 11, 14, colors.white, "CENTER");
}

function addKeyDarkHeader(parent, width) {
  addRect(parent, 52, 34, width - 104, 58, "#111116", 8, colors.amber, 0.82);
  addText(parent, "Onixbit", 76, 52, 120, 18, bodyBoldFont, 15, 20, colors.white);
  ["Услуги", "Процессы", "Кейсы", "Контакты"].forEach((label, index) => {
    addText(parent, label, 250 + index * 118, 53, 104, 18, bodyFont, 13, 18, colors.muted);
  });
  addText(parent, "демо процесса", width - 290, 53, 132, 18, bodyBoldFont, 12, 18, colors.amber);
  addRect(parent, width - 150, 44, 78, 38, colors.red, 8, colors.amber, 1);
  addText(parent, "CTA", width - 128, 56, 34, 14, bodyBoldFont, 11, 14, colors.white, "CENTER");
}

function addConnectedLightSystem(parent, x, y, width, height) {
  addRect(parent, x, y, width, height, colors.lightPanel, 8, colors.line, 1);
  addText(parent, "Живой контур бизнеса", x + 32, y + 28, 260, 28, displayFont, 22, 30, colors.ink);
  addText(parent, "сайт -> CRM -> 1С -> контроль", x + 32, y + 64, 260, 20, bodyFont, 13, 18, colors.inkMuted);
  const cx = x + width * 0.52;
  const cy = y + height * 0.52;
  addEllipse(parent, cx - 74, cy - 74, 148, 148, colors.light, 999, 1, colors.red, 1);
  addText(parent, "Onixbit\ncore", cx - 48, cy - 24, 96, 48, bodyBoldFont, 16, 22, colors.ink, "CENTER");
  const nodes = [
    ["Сайт", -190, -120, colors.red],
    ["CRM", 176, -105, colors.blue],
    ["1С", 188, 118, colors.amber],
    ["Каналы", -198, 118, colors.green],
  ];
  nodes.forEach(([label, dx, dy, color]) => {
    addGlowLine(parent, cx, cy, cx + dx, cy + dy, color, 0.38);
    addLightSystemNode(parent, label, cx + dx - 56, cy + dy - 28, color);
  });
  addRect(parent, x + 34, y + height - 92, width - 68, 54, colors.light, 8, colors.amber, 1);
  addText(parent, "Демо: заявка на сайте сразу появляется в CRM и получает ответственного", x + 54, y + height - 74, width - 108, 18, bodyFont, 13, 18, colors.inkMuted);
}

function addLightSystemNode(parent, label, x, y, color) {
  addRect(parent, x, y, 112, 56, colors.lightPanel, 8, color, 1);
  addEllipse(parent, x + 14, y + 18, 18, 18, color, 0.86);
  addText(parent, label, x + 40, y + 19, 56, 18, bodyBoldFont, 12, 16, colors.ink);
}

function addMetricStrip(parent, x, y, width, labels) {
  addRect(parent, x, y, width, 88, colors.lightPanel, 8, colors.line, 1);
  labels.forEach((label, index) => {
    const itemX = x + 28 + index * (width - 56) / labels.length;
    addText(parent, String(index + 1).padStart(2, "0"), itemX, y + 24, 36, 18, bodyBoldFont, 12, 18, colors.red);
    addText(parent, label, itemX + 42, y + 22, 190, 22, bodyBoldFont, 14, 20, colors.ink);
    addText(parent, "видно в системе", itemX + 42, y + 46, 150, 18, bodyFont, 12, 16, colors.inkMuted);
  });
}

function addProofLine(parent, x, y, labels) {
  labels.forEach((label, index) => {
    addReviewChip(parent, label, x + index * 132, y, index % 2 ? colors.amber : colors.red);
  });
}

function addReviewChip(parent, label, x, y, color) {
  addRect(parent, x, y, 210, 42, colors.lightPanel, 8, color, 1);
  addEllipse(parent, x + 14, y + 13, 16, 16, color, 0.84);
  addText(parent, label, x + 40, y + 13, 150, 16, bodyBoldFont, 12, 16, colors.ink);
}

function addOutlineButton(parent, label, x, y, width, color, dark) {
  addRect(parent, x, y, width, 48, dark ? "#111116" : colors.lightPanel, 8, color, 1);
  addText(parent, label, x + 18, y + 14, width - 36, 20, bodyBoldFont, 14, 20, dark ? colors.white : color, "CENTER");
}

function addServiceControlPanel(parent, x, y, width, height) {
  addRect(parent, x, y, width, height, colors.lightPanel, 8, colors.line, 1);
  addText(parent, "CRM command center", x + 28, y + 24, 260, 28, displayFont, 22, 30, colors.ink);
  addText(parent, "воронка, задачи, роботы, контроль", x + 28, y + 58, 300, 18, bodyFont, 13, 18, colors.inkMuted);
  const columns = ["Новые", "В работе", "КП", "Контроль"];
  columns.forEach((column, index) => {
    const colX = x + 28 + index * 126;
    addText(parent, column, colX, y + 108, 100, 18, bodyBoldFont, 12, 16, colors.inkMuted, "CENTER");
    for (let row = 0; row < 3; row += 1) {
      const cardY = y + 142 + row * 70;
      const tone = row === 1 && index === 2 ? colors.amber : index === 3 ? colors.green : colors.blue;
      addRect(parent, colX, cardY, 104, 48, colors.light, 8, tone, 1);
      addText(parent, row === 1 ? "задача" : "сделка", colX + 12, cardY + 10, 78, 14, bodyBoldFont, 11, 14, colors.ink);
      addText(parent, "срок / ответ", colX + 12, cardY + 28, 78, 12, bodyFont, 9, 12, colors.inkMuted);
    }
  });
}

function addServiceFeature(parent, title, text, x, y, color) {
  addRect(parent, x, y, 270, 138, colors.lightPanel, 8, colors.line, 1);
  addEllipse(parent, x + 22, y + 24, 28, 28, color, 0.9);
  addText(parent, title, x + 64, y + 24, 170, 24, displayFont, 20, 26, colors.ink);
  addText(parent, text, x + 24, y + 72, 216, 42, bodyFont, 14, 22, colors.inkMuted);
}

function addDarkRouteStage(parent, x, y, width, height) {
  addRect(parent, x, y, width, height, "#0d0b0e", 8, colors.amber, 0.82);
  addText(parent, "Live system stage", x + 28, y + 24, 250, 28, displayFont, 22, 30, colors.white);
  addText(parent, "действие клиента меняет состояние систем", x + 28, y + 58, 360, 18, bodyFont, 13, 18, colors.muted);
  const steps = [["Chat", colors.red], ["CRM", colors.blue], ["Manager", colors.amber], ["1C", colors.green], ["Control", colors.cyan]];
  steps.forEach(([label, color], index) => {
    const stepX = x + 64 + index * 122;
    addEllipse(parent, stepX, y + 120, 42, 42, color, 0.9);
    addText(parent, String(index + 1), stepX + 14, y + 133, 14, 14, bodyBoldFont, 11, 14, colors.graphite, "CENTER");
    addText(parent, label, stepX - 22, y + 176, 86, 18, bodyBoldFont, 12, 16, colors.white, "CENTER");
    if (index < steps.length - 1) addGlowLine(parent, stepX + 44, y + 141, stepX + 118, y + 141, colors.amber, 0.46);
  });
  addRect(parent, x + 44, y + 250, 220, 250, "#151217", 8, colors.red, 0.72);
  addText(parent, "Чат на сайте", x + 66, y + 274, 160, 24, displayFont, 19, 26, colors.white);
  addSignalCard(parent, "Нужна CRM + 1С", x + 66, y + 328, colors.amber, 170);
  addCta(parent, "Отправить", x + 66, y + 424, 150);
  addCrmBoard(parent, x + 306, y + 250, 280, 250);
  addGlowLine(parent, x + 264, y + 374, x + 306, y + 374, colors.amber, 0.58);
  addRect(parent, x + 44, y + 532, width - 88, 56, "#151217", 8, colors.green, 0.52);
  addText(parent, "Результат: источник, ответственный, срок и статус обмена видны в одном маршруте", x + 68, y + 550, width - 136, 18, bodyFont, 13, 18, colors.muted);
}

function addDirectorStrip(parent, x, y, width) {
  const items = [
    ["Клиент", "пишет в чат или форму"],
    ["Система", "создаёт сделку и задачу"],
    ["1С", "передаёт цену или статус"],
    ["Руководитель", "видит риск до просрочки"],
  ];
  items.forEach(([title, text], index) => {
    const itemX = x + index * (width / items.length);
    addRect(parent, itemX, y, width / items.length - 18, 112, "#111116", 8, index === 1 ? colors.amber : colors.redDeep, 0.78);
    addText(parent, title, itemX + 22, y + 24, 210, 22, displayFont, 18, 24, colors.white);
    addText(parent, text, itemX + 22, y + 58, 220, 34, bodyFont, 13, 19, colors.muted);
  });
}


function buildSiteMap(page) {
  const frame = createFrame(page, "Sitemap / Hybrid site architecture", 0, 0, 1440, 1060, colors.light);
  addLightBackdrop(frame, 1440, 1060);
  addText(frame, "Onixbit site map", 72, 58, 520, 58, displayFont, 46, 56, colors.ink);
  addText(frame, "Светлый основной сайт объясняет услуги и собирает заявки. Тёмные страницы процессов показывают, как реально работает связка сайт + CRM + 1С.", 74, 126, 980, 56, bodyFont, 18, 28, colors.inkMuted);

  const groups = [
    { title: "Основной сайт", mode: "light", items: sitePages.filter((item) => item.group === "main" || item.group === "services") },
    { title: "Доказательства", mode: "light", items: sitePages.filter((item) => item.group === "proof") },
    { title: "Тёмные процессы", mode: "dark", items: sitePages.filter((item) => item.group === "process") },
    { title: "Контакт", mode: "light", items: sitePages.filter((item) => item.group === "support") },
  ];

  groups.forEach((group, index) => {
    addMapGroup(frame, group.title, group.items, 72 + index * 330, 245, 288, group.mode === "dark");
  });

  addRouteLane(frame, "Navigation bridge", "светлая услуга -> тёмное демо -> кейс/форма", 88, 850, 1080, colors.amber);
  addText(frame, "Главный CTA", 1190, 844, 190, 18, bodyBoldFont, 12, 18, colors.red, "CENTER");
  addCta(frame, "Обсудить задачу", 1190, 880, 190);
}

function buildLightPages(page) {
  sitePages.filter((item) => item.mode === "light").forEach((config, index) => {
    buildPageWireframe(page, config, index, false);
  });
}

function buildProcessPages(page) {
  sitePages.filter((item) => item.mode === "dark").forEach((config, index) => {
    buildPageWireframe(page, config, index, true);
  });
}

function buildPageWireframe(parent, config, index, dark) {
  const width = dark ? 720 : 640;
  const height = dark ? 920 : 860;
  const columns = dark ? 2 : 3;
  const gapX = dark ? 80 : 58;
  const gapY = 88;
  const x = (index % columns) * (width + gapX);
  const y = Math.floor(index / columns) * (height + gapY);
  const frame = createFrame(parent, (dark ? "Dark process" : "Light page") + " / " + config.title, x, y, width, height, dark ? colors.graphite : colors.light);

  if (dark) {
    addBackdrop(frame, width, height);
    addHudTag(frame, config.url, 34, 34, Math.min(330, width - 68), colors.amber);
    addText(frame, config.title, 42, 92, width - 84, 72, displayFont, 42, 50, colors.white);
    addText(frame, config.cta, 44, 170, width - 88, 30, bodyBoldFont, 16, 24, colors.amberSoft);
    addProcessRoute(frame, config, 70, 255, width - 140);
    addPanel(frame, "Business meaning", 46, 610, width - 92, 210, config.blocks.slice(0, 5));
    addCta(frame, config.cta, 46, 840, Math.min(290, width - 92));
    return;
  }

  addLightBackdrop(frame, width, height);
  addLightHeader(frame, width);
  addText(frame, config.url, 42, 92, width - 84, 22, bodyBoldFont, 12, 18, colors.red);
  addText(frame, config.title, 42, 130, width - 84, 74, displayFont, 38, 46, colors.ink);
  addText(frame, config.cta, 44, 212, width - 88, 28, bodyBoldFont, 16, 24, colors.red);
  addLightHero(frame, config, 42, 274, width - 84);
  config.blocks.slice(0, 5).forEach((block, blockIndex) => {
    addWireBlock(frame, block, 42, 490 + blockIndex * 58, width - 84, blockIndex);
  });
  addCta(frame, config.cta, 42, 790, Math.min(260, width - 84));
}

function addMapGroup(parent, title, items, x, y, width, dark) {
  const height = 520;
  addRect(parent, x, y, width, height, dark ? colors.graphite : colors.lightPanel, 8, dark ? colors.amber : colors.line, 1);
  addText(parent, title, x + 18, y + 18, width - 36, 28, displayFont, 22, 30, dark ? colors.white : colors.ink);
  items.forEach((item, index) => {
    const rowY = y + 70 + index * 62;
    const stroke = item.mode === "dark" ? colors.amber : colors.red;
    addRect(parent, x + 18, rowY, width - 36, 48, dark ? "#151217" : colors.light, 8, stroke, dark ? 0.9 : 1);
    addText(parent, item.title, x + 32, rowY + 9, width - 64, 18, bodyBoldFont, 12, 16, dark ? colors.white : colors.ink);
    addText(parent, item.url, x + 32, rowY + 27, width - 64, 14, bodyFont, 10, 14, dark ? colors.muted : colors.inkMuted);
  });
}

function addLightBackdrop(parent, width, height) {
  addRect(parent, 0, 0, width, height, colors.light, 0);
  addRect(parent, 0, 0, width, 1, colors.red, 0, undefined, 0.24);
  addEllipse(parent, width - 170, -120, 290, 290, colors.amber, 0.12);
  addEllipse(parent, -130, height - 190, 310, 310, colors.red, 0.08);
}

function addLightHeader(parent, width) {
  addRect(parent, 28, 28, width - 56, 44, colors.lightPanel, 8, colors.line, 1);
  addText(parent, "Onixbit", 44, 40, 120, 18, bodyBoldFont, 13, 18, colors.ink);
  ["Услуги", "Процессы", "Кейсы", "Статьи"].forEach((label, index) => {
    addText(parent, label, 180 + index * 82, 40, 80, 18, bodyFont, 12, 18, colors.inkMuted);
  });
  addRect(parent, width - 170, 34, 124, 32, colors.red, 8, colors.red, 1);
  addText(parent, "Обсудить", width - 146, 43, 76, 14, bodyBoldFont, 11, 14, colors.white, "CENTER");
}

function addLightHero(parent, config, x, y, width) {
  addRect(parent, x, y, width, 168, colors.lightPanel, 8, colors.line, 1);
  addText(parent, "First viewport", x + 22, y + 22, 170, 18, bodyBoldFont, 12, 18, colors.red);
  addText(parent, config.blocks[0], x + 22, y + 52, width * 0.48, 44, displayFont, 23, 30, colors.ink);
  addRect(parent, x + width - 190, y + 34, 145, 88, colors.light, 8, colors.amber, 1);
  addGlowLine(parent, x + width - 174, y + 78, x + width - 58, y + 78, colors.amber, 0.42);
  addText(parent, "site -> CRM -> 1C", x + width - 174, y + 96, 120, 18, bodyFont, 11, 15, colors.inkMuted);
}

function addWireBlock(parent, label, x, y, width, index) {
  addRect(parent, x, y, width, 46, colors.lightPanel, 8, colors.line, 1);
  addEllipse(parent, x + 18, y + 15, 14, 14, index % 2 ? colors.amber : colors.red, 0.84);
  addText(parent, label, x + 44, y + 14, width - 66, 18, bodyFont, 13, 18, colors.inkMuted);
}

function addProcessRoute(parent, config, x, y, width) {
  const steps = config.blocks.slice(0, 5);
  const stepGap = width / Math.max(1, steps.length - 1);
  steps.forEach((step, index) => {
    const cx = x + index * stepGap;
    addEllipse(parent, cx - 22, y, 44, 44, index === 0 ? colors.red : colors.amber, 0.88);
    addText(parent, String(index + 1).padStart(2, "0"), cx - 16, y + 13, 32, 14, bodyBoldFont, 11, 14, colors.graphite, "CENTER");
    addText(parent, step, cx - 54, y + 60, 108, 36, bodyBoldFont, 12, 16, colors.white, "CENTER");
    if (index < steps.length - 1) addGlowLine(parent, cx + 24, y + 22, cx + stepGap - 24, y + 22, colors.amber, 0.42);
  });
  addRect(parent, x + 26, y + 150, width - 52, 130, "#111116", 8, colors.cyan, 0.72);
  addText(parent, "foreground action -> background system update", x + 50, y + 178, width - 100, 26, displayFont, 20, 28, colors.white, "CENTER");
  addText(parent, config.url, x + 50, y + 220, width - 100, 18, bodyFont, 12, 18, colors.muted, "CENTER");
}

function buildServices(page) {
  const frame = createFrame(page, "Services / Three system routes", 0, 0, 1440, 900, colors.graphite);
  addBackdrop(frame, 1440, 900);
  addText(frame, "Направления как маршруты системы", 72, 72, 780, 58, displayFont, 42, 52, colors.white);
  addText(frame, "Каждая услуга объясняется через рабочий путь клиента: от сигнала до управляемого результата.", 74, 140, 760, 54, bodyFont, 18, 28, colors.muted);

  const routes = [
    ["Bitrix24", "заявка -> сделка -> задача -> робот -> контроль", colors.cyan],
    ["1C-Битрикс", "страница -> каталог -> форма -> заявка -> CRM", colors.amber],
    ["1C", "заказ -> остатки -> цена -> статус -> отчет", colors.red],
  ];

  routes.forEach(([title, route, color], index) => {
    const y = 270 + index * 160;
    addRouteLane(frame, title, route, 110, y, 980, color);
    addCta(frame, index === 0 ? "Внедрение Bitrix24" : index === 1 ? "Сайт на 1C-Битрикс" : "Работы по 1C", 1120, y + 42, 220);
  });
}

function buildArticles(page) {
  const frame = createFrame(page, "Articles / Diagnostic reading experience", 0, 0, 1440, 900, colors.graphite);
  addBackdrop(frame, 1440, 900);
  addText(frame, "Записки интегратора", 72, 70, 620, 60, displayFont, 48, 58, colors.white);
  addText(frame, "Статьи должны ощущаться как диагностика системы: что сломано, где теряется управление, какой следующий практичный шаг.", 74, 144, 850, 58, bodyFont, 18, 28, colors.muted);

  addPanel(frame, "Диагностическая карточка", 82, 260, 500, 390, [
    "симптом: заявки теряются",
    "причина: каналы не сведены в CRM",
    "проверка: ответственный, срок, история",
    "шаг: карта входящих маршрутов",
  ]);
  addCrmBoard(frame, 690, 230, 560, 380);
  addGlowLine(frame, 570, 410, 700, 365, colors.amber, 0.45);
  addCta(frame, "Разобрать свою ситуацию", 84, 704, 268);
}

function buildComponents(page) {
  const frame = createFrame(page, "Components / HUD kit", 0, 0, 1440, 900, colors.graphite);
  addBackdrop(frame, 1440, 900);
  addText(frame, "Component kit", 72, 64, 420, 56, displayFont, 44, 54, colors.white);
  addText(frame, "Базовые элементы для сборки сцен: CTA, HUD label, system node, signal card, route lane.", 74, 128, 760, 34, bodyFont, 18, 28, colors.muted);

  addCta(frame, "Обсудить систему", 86, 230, 226);
  addHudTag(frame, "HUD / data signal", 86, 324, 220, colors.cyan);
  addSignalCard(frame, "заявка с сайта", 86, 410, colors.amber, 260);
  addSystemCore(frame, 430, 250, 150, "system\ncore");
  addRouteLane(frame, "Route lane", "сигнал -> CRM -> задача -> контроль", 680, 250, 610, colors.amber);
  addPanel(frame, "Glass proof panel", 680, 430, 420, 220, [
    "партнерство",
    "сертификаты",
    "кейсы",
    "поддержка",
  ]);
}

function addSceneHeader(parent, scene, width) {
  addText(parent, `ONIXBIT / HOMEPAGE FILM / SCENE ${scene.index}`, 72, 48, 460, 22, bodyBoldFont, 13, 18, colors.amber);
  addText(parent, scene.title, 72, 80, 640, 36, displayFont, 26, 34, colors.white);
  addRect(parent, width - 286, 52, 214, 34, "#160b0e", 7, colors.redDeep, 0.68);
  addText(parent, "sticky scroll state", width - 264, 61, 170, 18, bodyBoldFont, 12, 16, colors.muted);
}

function addCaptionBlock(parent, scene, x, y) {
  addText(parent, scene.caption, x, y, 650, 70, displayFont, 34, 42, colors.white);
  addText(parent, scene.meaning, x + 2, y + 86, 620, 52, bodyFont, 17, 26, colors.muted);
}

function addBackdrop(parent, width, height) {
  addRect(parent, 0, 0, width, height, colors.graphite, 0);
  addRect(parent, 0, 0, width, height, colors.cherry, 0, undefined, 0.7);
  addEllipse(parent, width * 0.58, -height * 0.28, width * 0.6, width * 0.6, colors.redDeep, 0.18);
  addEllipse(parent, -width * 0.16, height * 0.52, width * 0.5, width * 0.5, colors.amber, 0.08);
  addRect(parent, 0, height - 190, width, 190, "#050507", 0, undefined, 0.56);
}

function addSystemCore(parent, x, y, size, label) {
  addEllipse(parent, x - 58, y - 58, size + 116, size + 116, colors.red, 0.08);
  addEllipse(parent, x - 24, y - 24, size + 48, size + 48, colors.amber, 0.08);
  const core = addEllipse(parent, x, y, size, size, "#151217", 999, 1, colors.red, 0.96);
  core.effects = [
    glowEffect(colors.red, 0.5, 34),
    glowEffect(colors.amber, 0.22, 64),
  ];
  addText(parent, label, x + size * 0.18, y + size * 0.35, size * 0.64, size * 0.3, bodyBoldFont, size > 160 ? 20 : 17, 23, colors.white, "CENTER");
  return core;
}

function addNodeCluster(parent, cx, cy, radius, labels) {
  labels.forEach((label, index) => {
    const angle = (-90 + index * (360 / labels.length)) * (Math.PI / 180);
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    const node = addOrbitNode(parent, x - 70, y - 38, label, index % 2 ? colors.cyan : colors.amber);
    addGlowLine(parent, cx, cy, node.x + 70, node.y + 38, index % 2 ? colors.cyan : colors.amber, 0.28);
  });
}

function addOrbitNode(parent, x, y, label, color) {
  const node = addRect(parent, x, y, 140, 76, "#121116", 10, color, 0.76);
  node.effects = [glowEffect(color, 0.24, 28)];
  addText(parent, label, x + 16, y + 26, 108, 20, bodyBoldFont, 13, 18, colors.white, "CENTER");
  return node;
}

function addSignalCard(parent, label, x, y, color, width = 170) {
  const card = addRect(parent, x, y, width, 56, "#141319", 9, color, 0.82);
  card.effects = [glowEffect(color, 0.22, 20)];
  addEllipse(parent, x + 18, y + 18, 20, 20, color, 0.82);
  addText(parent, label, x + 52, y + 18, width - 70, 20, bodyBoldFont, 13, 18, colors.white);
  return card;
}

function addBrowserPlane(parent, x, y, width, height) {
  const browser = addRect(parent, x, y, width, height, "#111116", 14, colors.amber, 0.72);
  browser.effects = [glowEffect(colors.amber, 0.15, 32)];
  addRect(parent, x, y, width, 54, "#1a1519", 14, undefined, 0.9);
  ["", "", ""].forEach((_, index) => addEllipse(parent, x + 22 + index * 24, y + 20, 10, 10, index === 0 ? colors.red : colors.amber, 0.76));
  addText(parent, "1C-Битрикс storefront", x + 310, y + 18, 190, 18, bodyBoldFont, 12, 16, colors.muted, "CENTER");
  addRect(parent, x + 36, y + 96, 250, 230, "#18161c", 10, colors.redDeep, 0.92);
  addRect(parent, x + 320, y + 96, 250, 84, "#17151b", 8, colors.amber, 0.52);
  addRect(parent, x + 320, y + 210, 250, 116, "#17151b", 8, colors.cyan, 0.32);
  addRect(parent, x + 36, y + 354, 534, 44, "#1b171b", 8, colors.red, 0.42);
  addText(parent, "catalog / product / form / analytics", x + 74, y + 365, 420, 18, bodyFont, 13, 18, colors.muted);
  return browser;
}

function addCrmBoard(parent, x, y, width, height) {
  addRect(parent, x, y, width, height, "#111116", 14, colors.cyan, 0.55);
  const columns = ["новая", "в работе", "робот", "контроль"];
  columns.forEach((column, index) => {
    const colX = x + 28 + index * ((width - 72) / 4);
    const colW = (width - 104) / 4;
    addText(parent, column, colX, y + 28, colW, 18, bodyBoldFont, 12, 16, colors.muted, "CENTER");
    for (let row = 0; row < 3; row += 1) {
      const cardY = y + 68 + row * 104;
      const color = row === 1 && index === 2 ? colors.amber : index === 3 ? colors.green : colors.cyan;
      addRect(parent, colX, cardY, colW, 72, "#18171d", 8, color, 0.48);
      addText(parent, row === 1 ? "заявка + задача" : "сделка", colX + 14, cardY + 17, colW - 28, 18, bodyBoldFont, 12, 16, colors.white);
      addText(parent, "ответственный / срок", colX + 14, cardY + 39, colW - 28, 16, bodyFont, 11, 15, colors.muted);
    }
  });
}

function addRouteLane(parent, title, route, x, y, width, color) {
  addRect(parent, x, y, width, 108, "#111116", 12, color, 0.66);
  addText(parent, title, x + 28, y + 24, 210, 26, displayFont, 22, 28, colors.white);
  addText(parent, route, x + 268, y + 28, width - 320, 20, bodyFont, 15, 22, colors.muted);
  const steps = route.split(" -> ");
  steps.forEach((step, index) => {
    const stepX = x + 270 + index * 126;
    addEllipse(parent, stepX, y + 68, 16, 16, color, 0.9);
    if (index < steps.length - 1) addGlowLine(parent, stepX + 16, y + 76, stepX + 108, y + 76, color, 0.5);
  });
}

function addPanel(parent, title, x, y, width, height, lines) {
  addRect(parent, x, y, width, height, "#111116", 14, colors.amber, 0.42);
  addText(parent, title, x + 28, y + 26, width - 56, 28, displayFont, 22, 30, colors.white);
  lines.forEach((line, index) => {
    addEllipse(parent, x + 32, y + 82 + index * 28, 9, 9, index % 2 ? colors.cyan : colors.amber, 0.82);
    addText(parent, line, x + 52, y + 75 + index * 28, width - 80, 20, bodyFont, 14, 20, colors.muted);
  });
}

function addCta(parent, label, x, y, width) {
  const button = addRect(parent, x, y, width, 48, colors.red, 8, colors.amber, 0.98);
  button.effects = [glowEffect(colors.red, 0.28, 22)];
  addText(parent, label, x + 18, y + 14, width - 36, 20, bodyBoldFont, 14, 20, colors.white, "CENTER");
  return button;
}

function addHudTag(parent, label, x, y, width, color) {
  addRect(parent, x, y, width, 30, "#121116", 7, color, 0.72);
  addText(parent, label, x + 14, y + 8, width - 28, 14, bodyBoldFont, 11, 14, color, "CENTER");
}

function createFrame(parent, name, x, y, width, height, fill) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.x = x;
  frame.y = y;
  frame.resize(width, height);
  frame.fills = [solid(fill)];
  frame.clipsContent = true;
  mark(frame);
  parent.appendChild(frame);
  return frame;
}

function addRect(parent, x, y, width, height, fill, radius = 0, stroke, opacity = 1) {
  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.fills = [solid(fill, opacity)];
  rect.cornerRadius = radius;
  if (stroke) {
    rect.strokes = [solid(stroke, 0.72)];
    rect.strokeWeight = 1;
  }
  mark(rect);
  parent.appendChild(rect);
  return rect;
}

function addEllipse(parent, x, y, width, height, fill, radiusOrOpacity, strokeWeight, stroke, opacity) {
  const ellipse = figma.createEllipse();
  ellipse.x = x;
  ellipse.y = y;
  ellipse.resize(width, height);
  const actualOpacity = typeof opacity === "number" ? opacity : typeof radiusOrOpacity === "number" && radiusOrOpacity <= 1 ? radiusOrOpacity : 1;
  ellipse.fills = [solid(fill, actualOpacity)];
  if (stroke) {
    ellipse.strokes = [solid(stroke, 0.85)];
    ellipse.strokeWeight = strokeWeight || 1;
  }
  mark(ellipse);
  parent.appendChild(ellipse);
  return ellipse;
}

function addGlowLine(parent, x1, y1, x2, y2, color, opacity) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const line = addRect(parent, x1, y1 - 1, length, 2, color, 999, undefined, opacity);
  line.rotation = Math.atan2(dy, dx) * (180 / Math.PI);
  line.effects = [glowEffect(color, Math.min(opacity, 0.45), 16)];
  return line;
}

function addText(parent, characters, x, y, width, height, font, fontSize, lineHeight, fill, align = "LEFT") {
  const node = figma.createText();
  node.x = x;
  node.y = y;
  node.resize(width, height);
  node.fontName = font;
  node.fontSize = fontSize;
  node.lineHeight = { unit: "PIXELS", value: lineHeight };
  node.letterSpacing = { unit: "PIXELS", value: 0 };
  node.textAlignHorizontal = align;
  node.textAutoResize = "HEIGHT";
  node.fills = [solid(fill)];
  node.characters = characters;
  mark(node);
  parent.appendChild(node);
  return node;
}

function mark(node) {
  node.setPluginData(PLUGIN_KEY, "generated");
  return node;
}

function solid(hex, opacity = 1) {
  return {
    type: "SOLID",
    color: hexToRgb(hex),
    opacity,
  };
}

function glowEffect(hex, opacity, radius) {
  return {
    type: "DROP_SHADOW",
    color: { ...hexToRgb(hex), a: opacity },
    offset: { x: 0, y: 0 },
    radius,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  };
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const number = parseInt(normalized, 16);
  return {
    r: ((number >> 16) & 255) / 255,
    g: ((number >> 8) & 255) / 255,
    b: (number & 255) / 255,
  };
}

async function resolveFont(fonts) {
  for (const font of fonts) {
    try {
      await figma.loadFontAsync(font);
      return font;
    } catch {
      // Try the next available family/style pair.
    }
  }
  const fallback = { family: "Inter", style: "Regular" };
  await figma.loadFontAsync(fallback);
  return fallback;
}

function upsertPaintStyle(name, color) {
  let style = figma.getLocalPaintStyles().find((candidate) => candidate.name === name);
  if (!style) style = figma.createPaintStyle();
  style.name = name;
  style.paints = [solid(color)];
}

function upsertTextStyle(name, font, fontSize, lineHeight) {
  let style = figma.getLocalTextStyles().find((candidate) => candidate.name === name);
  if (!style) style = figma.createTextStyle();
  style.name = name;
  style.fontName = font;
  style.fontSize = fontSize;
  style.lineHeight = { unit: "PIXELS", value: lineHeight };
  style.letterSpacing = { unit: "PIXELS", value: 0 };
}
