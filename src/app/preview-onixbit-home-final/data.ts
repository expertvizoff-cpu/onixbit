export type RouteStepId =
  | "source"
  | "crm"
  | "owner"
  | "sla"
  | "exchange"
  | "control";

export type RouteStep = {
  id: RouteStepId;
  label: string;
  shortLabel: string;
  system: string;
  promise: string;
  risk: string;
  mockValue: string;
};

export type ScenarioId =
  | "lost-leads"
  | "crm-control"
  | "site-sales"
  | "onec-sync"
  | "bitrix-tariff";

export type Scenario = {
  id: ScenarioId;
  title: string;
  tab: string;
  pain: string;
  route: RouteStepId[];
  activeStep: RouteStepId;
  status: string;
  insight: string;
  businessMeaning: string;
  mockRows: string[];
  result: string;
};

export type StoryboardFrame = {
  time: string;
  title: string;
  activeNodes: RouteStepId[];
  businessMeaning: string;
  motionCue: string;
  reducedMotion: string;
  mobile: string;
  rejectIf: string;
};

export const heroCopy = {
  h1: "Показываем, где теряется заявка, и собираем сайт, CRM и 1С в один маршрут",
  subcopy:
    "Источник, ответственный, срок, обмен и контроль руководителя становятся видны в одной цепочке.",
  primaryCta: "Разобрать мой маршрут",
  secondaryCta: "Получить диагностику маршрута",
  h1Recommendation:
    "Оставить H1 через боль потерь и сборку маршрута: он объясняет категорию Onixbit быстрее, чем список услуг.",
  ctaRecommendation:
    "Главный CTA вести к разбору маршрута, вторичный - к диагностике; оба без отправки в CRM на preview.",
} as const;

export const routeSteps: RouteStep[] = [
  {
    id: "source",
    label: "Источник заявки",
    shortLabel: "Источник",
    system: "Сайт / чат / форма / звонок",
    promise: "видно, откуда пришёл клиент и с каким контекстом",
    risk: "заявка остаётся в почте, мессенджере или памяти менеджера",
    mockValue: "utm: bitrix24 / page: внедрение CRM",
  },
  {
    id: "crm",
    label: "Битрикс24",
    shortLabel: "CRM",
    system: "Сделка, контакт, воронка",
    promise: "создаётся карточка с источником, задачей и историей",
    risk: "данные переносят вручную, этапы спорят с реальным процессом",
    mockValue: "deal: DEMO-248 / stage: квалификация",
  },
  {
    id: "owner",
    label: "Ответственный",
    shortLabel: "Ответственный",
    system: "Роль, отдел, права",
    promise: "понятно, кто отвечает за следующий шаг",
    risk: "заявка висит без владельца или уходит не тому отделу",
    mockValue: "owner: отдел внедрения / role: pre-sale",
  },
  {
    id: "sla",
    label: "Задача и срок",
    shortLabel: "SLA",
    system: "Робот, задача, дедлайн",
    promise: "первое действие не зависит от памяти менеджера",
    risk: "просрочка всплывает только после жалобы клиента",
    mockValue: "task: первый ответ / due: 30 минут",
  },
  {
    id: "exchange",
    label: "1С и обмен",
    shortLabel: "1С",
    system: "Заказ, счёт, статус, остатки",
    promise: "продажи и учёт говорят об одном заказе",
    risk: "CRM, сайт и 1С расходятся по цене, статусу или документам",
    mockValue: "sync: ok / invoice: demo-152 / stock: актуально",
  },
  {
    id: "control",
    label: "Контроль руководителя",
    shortLabel: "Контроль",
    system: "Отчёт, уведомление, риск",
    promise: "видно, где маршрут тормозит и кто должен действовать",
    risk: "управление строится на ручных отчётах и догадках",
    mockValue: "risk: SLA green / source: visible / owner: assigned",
  },
];

export const scenarios: Scenario[] = [
  {
    id: "lost-leads",
    title: "Заявки теряются",
    tab: "Потери заявок",
    pain: "Не ясно, какая форма, чат или звонок реально дошли до CRM.",
    route: ["source", "crm", "owner", "sla", "control"],
    activeStep: "source",
    status: "ищем разрыв между источником, CRM и первым действием",
    insight: "Сначала фиксируем вход, затем проверяем карточку, владельца и срок.",
    businessMeaning:
      "Собственник видит не красивую интеграцию, а точку, где деньги выпадают из процесса.",
    mockRows: [
      "form_id: demo-main-consultation",
      "source_page: /vnedrenie-bitrix24",
      "crm_stage: новая заявка",
      "first_action_due: 30 минут",
    ],
    result: "карта потерь по источникам и первому касанию",
  },
  {
    id: "crm-control",
    title: "CRM не управляется",
    tab: "CRM-контроль",
    pain: "Воронки есть, но руководитель не понимает, кто и что должен сделать.",
    route: ["crm", "owner", "sla", "control"],
    activeStep: "owner",
    status: "проверяем роли, этапы, задачи и отчёты",
    insight: "CRM должна показывать следующий шаг, а не просто хранить сделки.",
    businessMeaning:
      "Автоматизация перестаёт быть набором роботов и превращается в управляемый регламент.",
    mockRows: [
      "pipeline: внедрение CRM",
      "role_matrix: manager / lead / implementer",
      "task_rule: created_on_stage_change",
      "control_report: overdue_by_stage",
    ],
    result: "карта ролей, задач, SLA и контрольных отчётов",
  },
  {
    id: "site-sales",
    title: "Сайт отдельно от продаж",
    tab: "Сайт и продажи",
    pain: "Сайт собирает обращения, но продажи не видят контекст страницы и интерес клиента.",
    route: ["source", "crm", "owner", "control"],
    activeStep: "crm",
    status: "связываем форму, страницу, UTM и CRM-карточку",
    insight: "Форма должна передавать не только контакт, но и смысл обращения.",
    businessMeaning:
      "Сайт становится частью продаж, а не витриной, из которой данные копируют вручную.",
    mockRows: [
      "page_type: service",
      "intent: CRM + site + 1C",
      "utm_campaign: demo_route",
      "deal_fields: source / page / service",
    ],
    result: "схема передачи контекста сайта в CRM",
  },
  {
    id: "onec-sync",
    title: "1С и CRM расходятся",
    tab: "1С и обмен",
    pain: "Менеджеры видят один статус, бухгалтерия - другой, документы живут отдельно.",
    route: ["crm", "exchange", "control"],
    activeStep: "exchange",
    status: "отделяем источник истины и точки проверки обмена",
    insight: "Интеграцию нужно проверять на сценариях заказа, счёта и статуса.",
    businessMeaning:
      "Ошибки обмена становятся управляемым событием, а не ручным расследованием.",
    mockRows: [
      "order_id: demo-152",
      "price_source: 1C",
      "invoice_status: created",
      "sync_health: last_success_12m",
    ],
    result: "границы обмена, тестовые сценарии и контроль ошибок",
  },
  {
    id: "bitrix-tariff",
    title: "Нужен тариф Битрикс24",
    tab: "Тариф",
    pain: "Команда выбирает тариф по таблице функций, а не по процессам и ограничениям.",
    route: ["crm", "owner", "sla", "exchange"],
    activeStep: "crm",
    status: "сопоставляем тариф с ролями, интеграциями и нагрузкой",
    insight: "Тариф должен закрывать рабочий маршрут, а не выглядеть дешевле на старте.",
    businessMeaning:
      "Покупка лицензии становится частью проекта внедрения, а не отдельным риском.",
    mockRows: [
      "users: demo_18",
      "pipelines: sales / support",
      "automation: robots + tasks",
      "integrations: site / 1C / telephony",
    ],
    result: "рекомендация по тарифу и ограничениям до покупки",
  },
];

export const storyboardFrames: StoryboardFrame[] = [
  {
    time: "0.0-1.2s",
    title: "На экране сразу Onixbit и маршрут",
    activeNodes: ["source"],
    businessMeaning: "Пользователь понимает, что Onixbit работает с процессом продаж, а не просто с сайтом.",
    motionCue: "мягкое появление логотипа, H1, первого узла источника",
    reducedMotion: "статичная схема с активным первым узлом",
    mobile: "логотип, H1, CTA и первый узел идут вертикально",
    rejectIf: "бренд виден только в маленькой шапке или H1 выглядит как абстрактный слоган",
  },
  {
    time: "1.2-2.6s",
    title: "Источник превращается в CRM-карточку",
    activeNodes: ["source", "crm"],
    businessMeaning: "Показываем, что заявка не растворяется между формой, чатом и менеджером.",
    motionCue: "линия маршрута подсвечивает переход сайт -> Битрикс24",
    reducedMotion: "одновременно подсвечены source и CRM",
    mobile: "узлы становятся компактными карточками по одной колонке",
    rejectIf: "непонятно, какой бизнес-объект двигается по экрану",
  },
  {
    time: "2.6-4.0s",
    title: "Появляется ответственный",
    activeNodes: ["crm", "owner"],
    businessMeaning: "Клиент видит управляемость: у заявки есть владелец и роль.",
    motionCue: "бейдж ответственного появляется рядом со сделкой",
    reducedMotion: "бейдж уже раскрыт",
    mobile: "ответственный показывается как статус внутри CRM-карточки",
    rejectIf: "сцена обещает назначение людей без объяснения правил",
  },
  {
    time: "4.0-5.6s",
    title: "Задача и SLA фиксируют первый шаг",
    activeNodes: ["owner", "sla"],
    businessMeaning: "Автоматизация продаётся как контроль сроков, а не как набор роботов.",
    motionCue: "таймер SLA меняет статус на green",
    reducedMotion: "статичный SLA green",
    mobile: "SLA находится сразу под ответственным",
    rejectIf: "анимация похожа на декоративный dashboard без связи с продажами",
  },
  {
    time: "5.6-7.2s",
    title: "1С входит в тот же маршрут",
    activeNodes: ["crm", "exchange"],
    businessMeaning: "Сайт, CRM и учёт становятся одной цепочкой заказа.",
    motionCue: "статус обмена появляется после CRM без резких скачков",
    reducedMotion: "узел 1С раскрыт с mock-статусом",
    mobile: "1С карточка не уходит за горизонтальный край",
    rejectIf: "1С выглядит как отдельный блок без связи с заявкой",
  },
  {
    time: "7.2-8.8s",
    title: "Контроль руководителя замыкает цепочку",
    activeNodes: ["sla", "exchange", "control"],
    businessMeaning: "Главный результат - видимость риска и следующего действия.",
    motionCue: "карта маршрута собирается в целую линию",
    reducedMotion: "показана полная цепочка без движения",
    mobile: "контроль находится в конце вертикального сценария",
    rejectIf: "экран обещает контроль, но не показывает, что именно контролируется",
  },
  {
    time: "8.8-10.0s",
    title: "CTA возвращает к диагностике маршрута",
    activeNodes: ["source", "crm", "owner", "sla", "exchange", "control"],
    businessMeaning: "Пользователь понимает следующий шаг: разобрать собственную цепочку.",
    motionCue: "акцент переходит на CTA и выбранный сценарий",
    reducedMotion: "активна вся схема и CTA",
    mobile: "CTA закреплён рядом с результатом, без перекрытия текста",
    rejectIf: "CTA ведёт в обычную заявку без объяснения, что получит клиент",
  },
];

export const diagnosisDeliverables = [
  "Карта текущего маршрута заявки: источник, CRM, ответственный, срок, обмен, контроль.",
  "Список точек риска без доступа к боевым токенам и без публикации персональных данных.",
  "Рекомендация ближайшего этапа: аудит, быстрый запуск, внедрение, интеграция или тариф.",
  "Границы ответственности Onixbit, клиента и внешних 1С/инфраструктурных специалистов.",
] as const;

export const diagnosisBoundaries = [
  "Preview-форма ничего не отправляет в CRM и не вызывает Bitrix webhook.",
  "Для диагностики нельзя вставлять реальные телефоны клиентов, токены, пароли, webhook URL и коммерческие тайны.",
  "Обещаем карту маршрута и следующий шаг, а не гарантированный рост продаж без аудита.",
  "Сложная 1С-методология и инфраструктура выделяются отдельной зоной до оценки сроков.",
] as const;

export const mockDataDictionary = [
  {
    key: "lead_source",
    safeExample: "demo_form_main",
    note: "обезличенный источник обращения",
  },
  {
    key: "source_page",
    safeExample: "/vnedrenie-bitrix24",
    note: "тип страницы, без данных посетителя",
  },
  {
    key: "deal_id",
    safeExample: "DEMO-248",
    note: "тестовый номер сделки, не из CRM",
  },
  {
    key: "owner_role",
    safeExample: "pre-sale / implementer",
    note: "роль вместо ФИО сотрудника",
  },
  {
    key: "sync_status",
    safeExample: "ok / delayed / needs_log",
    note: "статус обмена без реквизитов и документов",
  },
  {
    key: "sla_state",
    safeExample: "green / warning / overdue",
    note: "контроль срока без персональных данных",
  },
] as const;

export const sectionDecisionMap = [
  {
    section: "Hero",
    decision: "Начинаем с маршрута заявки, а не с перечня услуг.",
    why: "Показывает категорию Onixbit: интегратор процессов между сайтом, CRM и 1С.",
  },
  {
    section: "Process stand",
    decision: "Интерактивные сценарии управляют подсветкой узлов.",
    why: "Пользователь узнаёт свою боль и видит, где будет диагностика.",
  },
  {
    section: "Diagnosis",
    decision: "Offer строится вокруг карты маршрута и границ ответственности.",
    why: "Снижает риск ожиданий вроде бесплатного внедрения или аудита с секретами.",
  },
  {
    section: "Services map",
    decision: "Услуги привязаны к узлам маршрута, а не вынесены в абстрактную сетку.",
    why: "Сайт, Битрикс24, 1С и тарифы выглядят как части одной бизнес-системы.",
  },
  {
    section: "QA and safety",
    decision: "Preview noindex, без CRM scripts, с reduced-motion и keyboard flow.",
    why: "Можно безопасно согласовывать страницу до публикации.",
  },
] as const;

export const serviceMap = [
  {
    title: "Битрикс24",
    nodes: ["crm", "owner", "sla", "control"] satisfies RouteStepId[],
    text: "Воронки, роли, роботы, задачи, отчёты и коммуникации под реальный процесс продаж.",
  },
  {
    title: "Сайт на 1С-Битрикс",
    nodes: ["source", "crm"] satisfies RouteStepId[],
    text: "Структура, формы, каталог и передача контекста в CRM без ручного копирования.",
  },
  {
    title: "1С и интеграции",
    nodes: ["crm", "exchange", "control"] satisfies RouteStepId[],
    text: "Заказы, счета, статусы, остатки и контроль обменов на понятных тестовых сценариях.",
  },
  {
    title: "Тарифы и лицензии",
    nodes: ["crm", "owner", "sla", "exchange"] satisfies RouteStepId[],
    text: "Подбор тарифа по ролям, автоматизации, интеграциям и ограничениям проекта.",
  },
] as const;
