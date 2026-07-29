"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  DatabaseZap,
  Globe2,
  MessageSquareText,
  Mouse,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  Workflow,
} from "lucide-react";
import styles from "./system-tour.module.css";

const tourSteps = [
  {
    marker: "01",
    eyebrow: "сайт и виджет",
    title: "Клиент пишет в чат на сайте",
    text: "На переднем плане действие клиента. На заднем плане сразу видно, что происходит в CRM.",
    metric: "источник и контекст не теряются",
  },
  {
    marker: "02",
    eyebrow: "Битрикс24",
    title: "В CRM появляется новая сделка",
    text: "Система получает сообщение, страницу, интерес клиента и создаёт карточку в нужной воронке.",
    metric: "новая заявка за секунду",
  },
  {
    marker: "03",
    eyebrow: "менеджер и робот",
    title: "Ответственный получает задачу",
    text: "Робот назначает менеджера, ставит срок первого ответа и подсвечивает следующий шаг.",
    metric: "SLA виден руководителю",
  },
  {
    marker: "04",
    eyebrow: "1С и обмен",
    title: "Данные уходят в 1С и возвращаются в сделку",
    text: "Счёт, остаток, цена и статус заказа становятся частью маршрута, а не отдельной ручной работой.",
    metric: "меньше дублей и ошибок",
  },
  {
    marker: "05",
    eyebrow: "контроль",
    title: "Руководитель видит весь путь",
    text: "Понятно, откуда пришёл клиент, кто отвечает, что уже сделано и где система требует внимания.",
    metric: "система вместо хаоса",
  },
] as const;

const pipelineColumns = [
  { label: "Новые", count: "3", tone: "cold" },
  { label: "Квалификация", count: "5", tone: "warm" },
  { label: "КП и счёт", count: "2", tone: "hot" },
  { label: "Согласование", count: "4", tone: "calm" },
] as const;

const scenarioDemos = [
  {
    title: "Заявка из чата",
    eyebrow: "сайт -> CRM",
    text: "Посетитель пишет в виджет, а воронка сразу показывает новую сделку, источник и ответственного.",
    icon: MessageSquareText,
    action: "Отправить сообщение",
    foregroundTitle: "Виджет на сайте",
    foregroundRows: ["Страница: внедрение Битрикс24", "Сообщение: нужен сайт + CRM + 1С", "Контакт: телефон и город"],
    systemTitle: "Что меняется в системах",
    systemRows: ["CRM создаёт сделку в нужной воронке", "Робот назначает менеджера и срок ответа", "Руководитель видит источник и SLA"],
    result: "Клиент не потерян, менеджер понимает контекст до первого звонка.",
  },
  {
    title: "Заказ на сайте",
    eyebrow: "каталог -> 1С -> CRM",
    text: "Клиент выбирает услугу или лицензию, а состав заказа, цена и источник проходят в CRM и 1С без ручного копирования.",
    icon: Globe2,
    action: "Оформить демо-заказ",
    foregroundTitle: "Форма заказа",
    foregroundRows: ["Товар: лицензия + внедрение", "Сумма: передана в сделку", "Источник: тарифная страница"],
    systemTitle: "Что меняется в системах",
    systemRows: ["CRM получает сделку с составом заказа", "1С проверяет цену, остаток и счёт", "Менеджер видит следующий шаг и документы"],
    result: "Продажи, сайт и учёт говорят об одном заказе, а не спорят в трёх таблицах.",
  },
  {
    title: "Робот и задача",
    eyebrow: "CRM -> команда",
    text: "Менеджер переводит сделку на этап, а робот запускает задачу, проверку срока и понятный контроль для руководителя.",
    icon: Bot,
    action: "Перевести сделку",
    foregroundTitle: "Карточка сделки",
    foregroundRows: ["Этап: подготовить КП", "Условие: сумма больше 150 000", "Ответственный: отдел внедрения"],
    systemTitle: "Что меняется в системах",
    systemRows: ["Робот создаёт задачу и чек-лист", "CRM ставит дедлайн первого действия", "Отчёт подсвечивает риск до просрочки"],
    result: "Автоматизация становится видимой: клиент понимает, где исчезает ручной хаос.",
  },
  {
    title: "Поддержка",
    eyebrow: "канал -> задача -> контроль",
    text: "Обращение из мессенджера превращается в задачу, историю клиента и контроль реакции, а не остаётся в личной переписке.",
    icon: ShieldCheck,
    action: "Создать обращение",
    foregroundTitle: "Сообщение клиента",
    foregroundRows: ["Канал: WhatsApp/Telegram/чат", "Тема: ошибка обмена", "Клиент: найден в CRM"],
    systemTitle: "Что меняется в системах",
    systemRows: ["CRM связывает обращение с клиентом", "Задача уходит ответственному специалисту", "Руководитель видит срок реакции"],
    result: "Поддержка перестаёт быть чатом без памяти и превращается в управляемый процесс.",
  },
] as const;

const storyboardChapters = [
  {
    marker: "01",
    title: "Первый экран: не услуги, а система",
    pain: "Клиент видит список работ и не понимает, что изменится в бизнесе.",
    scene: "Показываем Onixbit как команду, которая собирает сайт, CRM, 1С и коммуникации в один управляемый контур.",
    proof: "Сразу видны направление, CTA и живая схема маршрута заявки.",
    icon: Sparkles,
  },
  {
    marker: "02",
    title: "Живой путь заявки",
    pain: "Заявки теряются между сайтом, менеджерами, мессенджерами и учётом.",
    scene: "Скролл ведёт заявку от сайта до CRM, роботов, 1С и руководительского контроля.",
    proof: "Клиент понимает пользу интеграции без технической лекции.",
    icon: Workflow,
  },
  {
    marker: "03",
    title: "Микросцены по участкам",
    pain: "Одна большая схема не объясняет нюансы работы с заказами, задачами и поддержкой.",
    scene: "Отдельные демо показывают, как действие человека сразу меняет состояние систем.",
    proof: "Можно раскрывать чат, заказ, роботов, поддержку, ошибки обмена и аналитику.",
    icon: MessageSquareText,
  },
  {
    marker: "04",
    title: "Доказательства и материалы",
    pain: "Красивой анимации мало, если нет ощущения реальной компетенции.",
    scene: "Подставляем обезличенные записи экранов, демо-данные, кейсы, сертификаты и понятные результаты.",
    proof: "Фича становится не декором, а демонстрацией настоящей работы Onixbit.",
    icon: ShieldCheck,
  },
] as const;

const hybridArchitecture = [
  {
    title: "Основной сайт остаётся светлым",
    theme: "доверие / SEO / заявка",
    text: "Главная, услуги, тарифы, кейсы, сертификаты, статьи и контакты должны быстро объяснять, кто мы и почему нам можно доверять.",
    points: ["быстрый первый экран", "понятные услуги", "форма и телефон рядом"],
    icon: Globe2,
  },
  {
    title: "Разборы процессов уходят в тёмный режим",
    theme: "иммерсивная демонстрация",
    text: "Отдельные страницы показывают живые сценарии: заявка, заказ, обмен с 1С, поддержка, контроль руководителя.",
    points: ["можно делать cinematic", "нет перегруза главной", "каждая сцена продаёт смысл"],
    icon: Workflow,
  },
  {
    title: "Между ними нужен понятный мост",
    theme: "навигация / CTA / возврат",
    text: "Со светлой страницы человек попадает в демонстрацию процесса, а из неё возвращается к услуге, кейсу или заявке.",
    points: ["без обязательного preloader", "CTA всегда виден", "демо ведёт к продаже"],
    icon: ShieldCheck,
  },
] as const;


const productionScenes = [
  {
    marker: "A",
    title: "Входящая заявка",
    phase: "сайт / чат / форма",
    question: "Клиент должен увидеть, что обращение не растворяется в почте или мессенджере.",
    action: "Посетитель пишет в чат или отправляет форму на странице услуги.",
    system: "CRM создаёт сделку с источником, страницей, контактом и первым сообщением.",
    outcome: "Менеджер начинает разговор уже с контекстом, а руководитель видит новую заявку.",
    collect: ["демо-форма или чат сайта", "пустая и заполненная воронка CRM", "обезличенный контакт и сообщение"],
    proof: "Показывает, что Onixbit закрывает самый понятный страх: заявку не потеряют.",
    icon: MessageSquareText,
  },
  {
    marker: "B",
    title: "Назначение менеджера",
    phase: "CRM / робот / задача",
    question: "Клиенту важно понять, кто отвечает и когда должен сделать первый шаг.",
    action: "Сделка попадает на этап квалификации или меняет статус.",
    system: "Робот назначает ответственного, ставит задачу, срок и чек-лист первого касания.",
    outcome: "Процесс становится управляемым, а не зависит от памяти конкретного менеджера.",
    collect: ["карточка сделки", "правило робота", "задача менеджера и SLA"],
    proof: "Объясняет пользу автоматизации без технических терминов.",
    icon: Bot,
  },
  {
    marker: "C",
    title: "Заказ и 1С",
    phase: "сайт / CRM / 1С",
    question: "Нужно показать, зачем соединять продажи, сайт и учёт в одну линию.",
    action: "Клиент выбирает услугу, лицензию или состав заказа.",
    system: "Состав, цена, счёт, остаток или статус проходят через CRM и 1С без ручного копирования.",
    outcome: "Менеджер видит документы и актуальные данные в одной сделке.",
    collect: ["демо-заказ", "статус обмена", "счёт или документ без реальных реквизитов"],
    proof: "Показывает экономию времени и снижение ошибок на понятном бизнес-примере.",
    icon: DatabaseZap,
  },
  {
    marker: "D",
    title: "Сбой обмена",
    phase: "контроль / поддержка",
    question: "Сильная сцена для доверия: система не только работает, но и показывает проблему.",
    action: "В обмене появляется ошибка или задержка.",
    system: "Создаётся уведомление, задача специалисту и понятный статус исправления.",
    outcome: "Клиент видит, что поддержка Onixbit не ждёт жалобы, а контролирует процесс.",
    collect: ["демо-лог обмена", "уведомление", "задача специалиста"],
    proof: "Добавляет зрелости: мы показываем не идеальную сказку, а управляемую реальность.",
    icon: ShieldCheck,
  },
  {
    marker: "E",
    title: "Контроль руководителя",
    phase: "аналитика / результат",
    question: "Финальная сцена должна отвечать на вопрос собственника: что я теперь контролирую?",
    action: "Заявка проходит путь от первого обращения до статуса заказа или поддержки.",
    system: "Дашборд собирает источник, ответственного, срок, этап, документы и результат.",
    outcome: "Руководитель видит систему целиком, а не отдельные куски в разных окнах.",
    collect: ["демо-дашборд", "статусы этапов", "метрики без финансовых секретов"],
    proof: "Закрывает главную ценность: Onixbit соединяет хаос в управляемый контур.",
    icon: BarChart3,
  },
] as const;


const liveCutScenes = [
  {
    title: "Заявка не потеряна",
    eyebrow: "сайт -> CRM -> менеджер",
    icon: MessageSquareText,
    lead: "Клиент пишет в виджет. На фоне сразу появляется новая сделка, источник и ответственный.",
    foreground: ["Сообщение: нужен сайт + CRM + 1С", "Страница: внедрение Битрикс24", "Контакт: телефон и город"],
    systems: ["CRM создаёт сделку", "Робот назначает менеджера", "SLA первого ответа запущен"],
    route: ["Сайт", "CRM", "Менеджер"],
    metrics: ["0 ручных копирований", "15 минут SLA", "источник сохранён"],
    result: "Главная мысль сцены: обращение не потеряется и попадёт к ответственному с контекстом.",
  },
  {
    title: "Заказ проходит через 1С",
    eyebrow: "каталог -> CRM -> 1С",
    icon: DatabaseZap,
    lead: "Клиент выбирает состав заказа. Сайт, CRM и 1С начинают говорить об одном наборе данных.",
    foreground: ["Состав: лицензия + внедрение", "Сумма: попала в сделку", "Источник: тарифная страница"],
    systems: ["CRM получила заказ", "1С проверила счёт и статус", "Менеджер видит документы"],
    route: ["Каталог", "CRM", "1С"],
    metrics: ["один состав заказа", "счёт без дублей", "статус в сделке"],
    result: "Главная мысль сцены: продажи и учёт не расходятся по разным таблицам.",
  },
  {
    title: "Сбой виден до жалобы",
    eyebrow: "обмен -> задача -> контроль",
    icon: ShieldCheck,
    lead: "В обмене появляется ошибка. Сайт показывает не панику, а управляемую реакцию поддержки.",
    foreground: ["Ошибка: задержка обмена", "Клиент: найден в CRM", "Приоритет: влияет на заказ"],
    systems: ["Создано уведомление", "Задача ушла специалисту", "Руководитель видит статус"],
    route: ["Обмен", "Задача", "Контроль"],
    metrics: ["ошибка замечена", "ответственный есть", "статус прозрачен"],
    result: "Главная мысль сцены: Onixbit показывает не идеальную сказку, а контролируемую реальность.",
  },
] as const;


const requestFocusSteps = [
  {
    marker: "01",
    label: "Чат",
    title: "Клиент отправил сообщение",
    copy: "Сцена начинается с человеческого действия: посетитель пишет в виджет, а сайт сразу запускает маршрут заявки.",
    liveTag: "новое сообщение на сайте",
    human: "Посетитель не заполняет сложную анкету, а пишет обычное сообщение в виджет.",
    automation: "Onixbit забирает текст, страницу, контакт и готовит карточку для CRM.",
    control: "Уже видно, откуда пришёл запрос и какой контекст нужен менеджеру.",
    siteRows: ["Нужен сайт, CRM и обмен с 1С", "Страница: внедрение Битрикс24", "Контакт: телефон и город"],
    crmCard: "Новая сделка: CRM + сайт + 1С",
    crmMeta: "источник, страница и первое сообщение сохранены",
    systems: ["Контакт зафиксирован", "Источник не потерян", "Страница интереса видна менеджеру"],
    proof: [
      { label: "Источник", value: "страница услуги" },
      { label: "Контекст", value: "первое сообщение" },
      { label: "Риск", value: "заявка не ушла в личный чат" },
    ],
    result: "Клиент не исчез в переписке: система уже знает, откуда он пришёл и что ему нужно.",
  },
  {
    marker: "02",
    label: "CRM",
    title: "CRM создала сделку",
    copy: "Фон меняется сразу: заявка появляется в нужной воронке, а не ждёт ручного копирования.",
    liveTag: "карточка появилась в CRM",
    human: "Клиент всё ещё на сайте, но обращение уже стало рабочей сущностью в CRM.",
    automation: "CRM создаёт сделку, сохраняет контакт, тип запроса и страницу, с которой пришёл клиент.",
    control: "Руководитель видит не просто сообщение, а новую точку продаж в воронке.",
    siteRows: ["Сообщение принято", "Сделка создана", "Источник: сайт Onixbit"],
    crmCard: "Сделка в колонке Новые",
    crmMeta: "тип запроса, контакт и страница уже внутри карточки",
    systems: ["Воронка обновлена", "Карточка получила контекст", "Повторный ввод не нужен"],
    proof: [
      { label: "Воронка", value: "Новые" },
      { label: "Карточка", value: "контакт + задача" },
      { label: "Потери", value: "нет ручного переноса" },
    ],
    result: "Клиент видит ключевую пользу: CRM становится рабочей памятью бизнеса, а не пустой доской.",
  },
  {
    marker: "03",
    label: "Менеджер",
    title: "Ответственный назначен",
    copy: "Робот выбирает ответственного, ставит срок первого касания и делает следующий шаг видимым.",
    liveTag: "ответственный назначен",
    human: "Менеджер получает не голую заявку, а понятный запрос с источником и ожиданием клиента.",
    automation: "Робот назначает владельца, создаёт задачу и фиксирует срок первого ответа.",
    control: "Теперь у заявки есть владелец, дедлайн и понятная зона ответственности.",
    siteRows: ["Заявка обработана", "Ответственный: отдел внедрения", "SLA: первый ответ до 15 минут"],
    crmCard: "Марина, отдел внедрения",
    crmMeta: "задача и дедлайн появились в сделке",
    systems: ["Робот назначил менеджера", "Создана задача", "SLA виден руководителю"],
    proof: [
      { label: "Владелец", value: "отдел внедрения" },
      { label: "SLA", value: "до 15 минут" },
      { label: "Контроль", value: "просрочка видна заранее" },
    ],
    result: "Процесс не зависит от памяти человека: у заявки есть владелец и срок реакции.",
  },
  {
    marker: "04",
    label: "1С",
    title: "Данные проверены в 1С",
    copy: "Если в заявке есть заказ, лицензия или счёт, данные проходят через учёт без отдельной таблицы.",
    liveTag: "учёт вернул данные",
    human: "Клиент обсуждает заказ, а менеджер уже видит актуальные данные из учётной системы.",
    automation: "1С проверяет цену, документ, статус и возвращает данные обратно в сделку.",
    control: "Продажа и учёт сходятся в одном маршруте, без споров между таблицами.",
    siteRows: ["Состав: лицензия + внедрение", "Цена проверена", "Документы готовы к обсуждению"],
    crmCard: "1С вернула счёт и статус",
    crmMeta: "цена, документ и статус доступны менеджеру",
    systems: ["1С проверила данные", "Документ привязан к сделке", "Менеджер видит актуальный статус"],
    proof: [
      { label: "Документ", value: "счёт в сделке" },
      { label: "Цена", value: "из 1С" },
      { label: "Дубли", value: "меньше ручного ввода" },
    ],
    result: "Сайт, CRM и учёт говорят об одном заказе: меньше дублей, меньше ошибок, быстрее ответ клиенту.",
  },
  {
    marker: "05",
    label: "Контроль",
    title: "Руководитель видит маршрут",
    copy: "Финальная картинка показывает не отдельные окна, а весь путь обращения и точки контроля.",
    liveTag: "маршрут собран",
    human: "Клиент получает ответ быстрее, потому что команда работает с одной историей обращения.",
    automation: "Сайт, CRM, менеджер, робот и 1С оставили понятные следы в одном процессе.",
    control: "Руководитель видит источник, ответственного, SLA, документы, статус и риск.",
    siteRows: ["Источник: сайт", "Ответственный: назначен", "Статус: в работе"],
    crmCard: "Путь заявки собран",
    crmMeta: "источник, ответственный, SLA, документы и статус в одном контуре",
    systems: ["Контроль обновлён", "Риски видны заранее", "История не распалась по чатам"],
    proof: [
      { label: "Маршрут", value: "сайт -> CRM -> 1С" },
      { label: "Ответственный", value: "назначен" },
      { label: "Результат", value: "система управляется" },
    ],
    result: "Итоговая продажная мысль: Onixbit соединяет разрозненные действия в управляемую систему.",
  },
] as const;


function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
}

function progressStyle(progress: number, sent: boolean): CSSProperties {
  const lead = sent ? 1 : smoothstep(0.12, 0.26, progress);
  const manager = smoothstep(0.34, 0.48, progress);
  const robot = smoothstep(0.48, 0.62, progress);
  const onec = smoothstep(0.62, 0.78, progress);
  const control = smoothstep(0.78, 0.94, progress);

  return {
    "--tour-progress": progress,
    "--lead": lead,
    "--manager": manager,
    "--robot": robot,
    "--onec": onec,
    "--control": control,
  } as CSSProperties;
}

export function SystemTourPreview() {
  const railRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);
  const [scenarioRun, setScenarioRun] = useState({ count: 0, index: -1 });
  const [activeProduction, setActiveProduction] = useState(0);
  const [activeLiveCut, setActiveLiveCut] = useState(0);
  const [requestFocusStep, setRequestFocusStep] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      if (!railRef.current) return;

      const rect = railRef.current.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const next = clamp(-rect.top / scrollable);

      setProgress((current) => (Math.abs(current - next) > 0.003 ? next : current));
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeIndex = Math.min(tourSteps.length - 1, Math.round(progress * (tourSteps.length - 1)));
  const activeStep = tourSteps[activeIndex] ?? tourSteps[0];
  const scenario = scenarioDemos[activeScenario] ?? scenarioDemos[0];
  const ScenarioIcon = scenario.icon;
  const productionScene = productionScenes[activeProduction] ?? productionScenes[0];
  const ProductionIcon = productionScene.icon;
  const liveCutScene = liveCutScenes[activeLiveCut] ?? liveCutScenes[0];
  const LiveCutIcon = liveCutScene.icon;
  const requestFocus = requestFocusSteps[requestFocusStep] ?? requestFocusSteps[0];
  const requestFocusProgress = requestFocusStep / Math.max(1, requestFocusSteps.length - 1);
  const scenarioWasRun = scenarioRun.index === activeScenario && scenarioRun.count > 0;
  const sceneStyle = useMemo(() => progressStyle(progress, sent), [progress, sent]);
  const leadVisible = sent || progress > 0.18;

  return (
    <div className={styles.tour}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.hero} aria-labelledby="system-tour-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>
            <Sparkles size={17} aria-hidden="true" />
            интерактивная фишка сайта
          </span>
          <h1 id="system-tour-title">Показываем клиенту не услугу, а живой путь заявки</h1>
          <p>
            Первый прототип проверяет идею: действие клиента происходит на переднем плане, а CRM,
            менеджер, робот и 1С меняются на фоне сразу, без абстрактных схем.
          </p>
          <div className={styles.heroActions}>
            <a href="#request-route" className={styles.primaryAction}>
              <span>Смотреть сцену</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <span className={styles.safetyNote}>
              Демо-данные, собственные UI-макеты, без чужих скриншотов.
            </span>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.previewBrowser}>
            <div className={styles.browserTop}>
              <span />
              <span />
              <span />
              <b>onixbit.ru/request</b>
            </div>
            <div className={styles.previewGrid}>
              <div className={styles.previewWidget}>
                <MessageSquareText size={19} />
                <strong>Чат сайта</strong>
                <p>Нужна CRM + сайт + 1С</p>
              </div>
              <div className={styles.previewArrow} />
              <div className={styles.previewCrm}>
                <Workflow size={20} />
                <strong>CRM</strong>
                <p>Новая сделка</p>
              </div>
              <div className={styles.previewArrow} />
              <div className={styles.previewCrm}>
                <DatabaseZap size={20} />
                <strong>1С</strong>
                <p>Счёт и статус</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.storyRail} id="request-route" ref={railRef}>
        <div className={styles.stage} style={sceneStyle} data-step={activeIndex}>
          <aside className={styles.storyCopy} aria-live="polite">
            <span>{activeStep.eyebrow}</span>
            <strong>{activeStep.marker}</strong>
            <h2>{activeStep.title}</h2>
            <p>{activeStep.text}</p>
            <em>{activeStep.metric}</em>
            <div className={styles.progressDots} aria-label="Прогресс сцены">
              {tourSteps.map((step, index) => (
                <button
                  aria-label={`Сцена ${step.marker}: ${step.title}`}
                  className={index === activeIndex ? styles.activeDot : ""}
                  key={step.marker}
                  type="button"
                  onClick={() => {
                    if (!railRef.current) return;
                    const top = railRef.current.offsetTop;
                    const distance = railRef.current.offsetHeight - window.innerHeight;
                    window.scrollTo({ top: top + distance * (index / (tourSteps.length - 1)), behavior: "smooth" });
                  }}
                />
              ))}
            </div>
          </aside>

          <div className={styles.systemScene}>
            <div className={styles.sceneGrid} aria-hidden="true" />
            <div className={styles.crmBoard} aria-label="Демо CRM-воронка">
              <div className={styles.boardHeader}>
                <div>
                  <span>Битрикс24 / демо-воронка</span>
                  <strong>Заявки с сайта</strong>
                </div>
                <div className={styles.boardStatus}>
                  <ShieldCheck size={16} aria-hidden="true" />
                  SLA 15 минут
                </div>
              </div>

              <div className={styles.columns}>
                {pipelineColumns.map((column, index) => (
                  <section className={styles.column} data-tone={column.tone} key={column.label}>
                    <header>
                      <span>{column.label}</span>
                      <b>{column.count}</b>
                    </header>

                    {index === 0 ? (
                      <>
                        <article className={styles.dealCard}>
                          <span>Сайт / тарифы</span>
                          <strong>Запрос консультации</strong>
                          <small>ответственный не назначен</small>
                        </article>
                        <article className={styles.newDeal} data-visible={leadVisible}>
                          <span>Чат сайта / новая</span>
                          <strong>CRM + сайт + 1С</strong>
                          <small>источник, страница, сообщение</small>
                        </article>
                      </>
                    ) : null}

                    {index === 1 ? (
                      <article className={styles.dealCard} data-boosted={progress > 0.34 || sent}>
                        <span>Робот назначил</span>
                        <strong>Марина, отдел внедрения</strong>
                        <small>перезвонить до 11:45</small>
                      </article>
                    ) : null}

                    {index === 2 ? (
                      <article className={styles.dealCard} data-boosted={progress > 0.62}>
                        <span>1С проверка</span>
                        <strong>Счёт и остаток готовы</strong>
                        <small>данные вернулись в сделку</small>
                      </article>
                    ) : null}

                    {index === 3 ? (
                      <article className={styles.dealCard} data-boosted={progress > 0.78}>
                        <span>Контроль</span>
                        <strong>Путь заявки завершён</strong>
                        <small>руководитель видит статус</small>
                      </article>
                    ) : null}
                  </section>
                ))}
              </div>
            </div>

            <div className={styles.chatWidget}>
              <div className={styles.chatHeader}>
                <MessageSquareText size={18} aria-hidden="true" />
                <div>
                  <strong>Виджет сайта</strong>
                  <span>передний план</span>
                </div>
              </div>
              <div className={styles.chatBody}>
                <p>Здравствуйте! Нужен сайт, CRM и обмен с 1С. Можно обсудить?</p>
                <p data-agent="true">Да, покажем маршрут заявки и точки контроля.</p>
              </div>
              <button className={styles.sendButton} type="button" onClick={() => setSent(true)}>
                <Send size={16} aria-hidden="true" />
                {leadVisible ? "Заявка в CRM" : "Отправить демо-заявку"}
              </button>
            </div>

            <div className={styles.actionRail}>
              <div className={styles.actionItem} data-lit={progress > 0.34 || sent}>
                <UserRound size={18} aria-hidden="true" />
                <span>Менеджер</span>
                <strong>назначен</strong>
              </div>
              <div className={styles.actionItem} data-lit={progress > 0.48}>
                <Bot size={18} aria-hidden="true" />
                <span>Робот</span>
                <strong>создал задачу</strong>
              </div>
              <div className={styles.actionItem} data-lit={progress > 0.62}>
                <DatabaseZap size={18} aria-hidden="true" />
                <span>1С</span>
                <strong>вернула данные</strong>
              </div>
              <div className={styles.actionItem} data-lit={progress > 0.78}>
                <BarChart3 size={18} aria-hidden="true" />
                <span>Контроль</span>
                <strong>обновлён</strong>
              </div>
            </div>

            <svg className={styles.routeLines} viewBox="0 0 1200 720" preserveAspectRatio="none" aria-hidden="true">
              <path className={styles.routeBase} d="M190 510 C318 365 452 335 590 370 S815 498 1018 286" />
              <path className={styles.routeLive} d="M190 510 C318 365 452 335 590 370 S815 498 1018 286" />
              <path className={styles.routeBase} d="M256 255 C390 187 535 214 645 302 S780 432 982 490" />
              <path className={styles.routeLiveSecondary} d="M256 255 C390 187 535 214 645 302 S780 432 982 490" />
            </svg>
          </div>

          <div className={styles.scrollHint} aria-hidden="true">
            <Mouse size={17} />
            <span>скролл двигает сценарий</span>
          </div>
        </div>
      </section>

      <section className={styles.nextBlock} aria-labelledby="next-scenes">
        <div className={styles.nextHead}>
          <span>лаборатория микросцен</span>
          <h2 id="next-scenes">Один принцип, разные участки системы</h2>
          <p>
            Здесь мы проверяем формат будущих блоков сайта: слева действие клиента или менеджера,
            справа моментальная реакция CRM, 1С, роботов, задач и контроля.
          </p>
        </div>

        <div className={styles.scenarioLab}>
          <div className={styles.scenarioTabs} aria-label="Сценарии демонстрации">
            {scenarioDemos.map((item, index) => {
              const Icon = item.icon;

              return (
                <button
                  aria-pressed={index === activeScenario}
                  className={styles.scenarioTab}
                  key={item.title}
                  onClick={() => setActiveScenario(index)}
                  type="button"
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.scenarioStage} key={scenario.title}>
            <div className={styles.scenarioIntro}>
              <span>{scenario.eyebrow}</span>
              <h3>{scenario.title}</h3>
              <p>{scenario.text}</p>
            </div>

            <div
              className={styles.scenarioWorkspace}
              data-run={scenarioWasRun}
              key={scenario.title + "-" + scenarioRun.count}
            >
              <section className={styles.scenarioPanel} aria-label={scenario.foregroundTitle}>
                <div className={styles.panelTop}>
                  <ScenarioIcon size={20} aria-hidden="true" />
                  <div>
                    <span>передний план</span>
                    <strong>{scenario.foregroundTitle}</strong>
                  </div>
                </div>
                <div className={styles.scenarioRows}>
                  {scenario.foregroundRows.map((row) => (
                    <div className={styles.scenarioRow} key={row}>
                      <span />
                      <p>{row}</p>
                    </div>
                  ))}
                </div>
                <button
                  aria-label={scenario.action + ": запустить демо-сценарий"}
                  className={styles.scenarioAction}
                  data-run={scenarioWasRun}
                  type="button"
                  onClick={() => setScenarioRun((current) => ({ count: current.count + 1, index: activeScenario }))}
                >
                  {scenarioWasRun ? <CheckCircle2 size={16} aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
                  {scenarioWasRun ? "Действие ушло в системы" : scenario.action}
                </button>
              </section>

              <div className={styles.scenarioConnector} aria-hidden="true">
                <span />
                <b />
                <span />
              </div>

              <section className={styles.scenarioPanel} aria-label={scenario.systemTitle}>
                <div className={styles.panelTop}>
                  <Workflow size={20} aria-hidden="true" />
                  <div>
                    <span>фоновые системы</span>
                    <strong>{scenario.systemTitle}</strong>
                  </div>
                </div>
                <div className={styles.systemRows}>
                  {scenario.systemRows.map((row, index) => (
                    <div
                      className={styles.systemUpdate}
                      data-run={scenarioWasRun}
                      key={row}
                      style={{ "--row": index } as CSSProperties}
                    >
                      <CheckCircle2 size={16} aria-hidden="true" />
                      <p>{row}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className={styles.scenarioResult} aria-live="polite" data-run={scenarioWasRun}>
              <BarChart3 size={18} aria-hidden="true" />
              <p>{scenarioWasRun ? "Демо-событие принято: " + scenario.result : scenario.result}</p>
            </div>
          </div>
        </div>

        <div className={styles.nextGrid}>
          {scenarioDemos.slice(1).map((scene) => (
            <article className={styles.nextCard} key={scene.title}>
              <h3>{scene.title}</h3>
              <p>{scene.result}</p>
              <span>
                <CheckCircle2 size={16} aria-hidden="true" />
                {"готово к отдельной scroll-сцене"}
              </span>
            </article>
          ))}
        </div>

        <section className={styles.storyboardBlock} aria-labelledby="storyboard-title">
          <div className={styles.storyboardHeader}>
            <span>сценарий будущего сайта</span>
            <h2 id="storyboard-title">Из прототипа собираем страницы, которые понимает клиент</h2>
            <p>
              Это рабочая дорожка: что остаётся на светлом основном сайте, какие сцены уходят
              на тёмные страницы процессов и чем будем доказывать, что Onixbit соединяет системы.
            </p>
          </div>

          <div className={styles.storyboardLayout}>
            <ol className={styles.storyboardTimeline}>
              {storyboardChapters.map((chapter) => {
                const Icon = chapter.icon;

                return (
                  <li className={styles.storyboardItem} key={chapter.marker}>
                    <div className={styles.storyboardMarker}>
                      <Icon size={18} aria-hidden="true" />
                      <span>{chapter.marker}</span>
                    </div>
                    <div>
                      <h3>{chapter.title}</h3>
                      <p><strong>Боль:</strong> {chapter.pain}</p>
                      <p><strong>Сцена:</strong> {chapter.scene}</p>
                      <em>{chapter.proof}</em>
                    </div>
                  </li>
                );
              })}
            </ol>

            <aside className={styles.productionPanel} aria-label="Материалы для следующей версии">
              <span>что собирать дальше</span>
              <h3>Следующая версия станет ближе к настоящему сайту</h3>
              <ul>
                <li>реальные демо-сценарии без клиентских данных;</li>
                <li>экранные состояния Bitrix24, 1С, сайта и поддержки;</li>
                <li>короткие тексты для собственника, менеджера и IT-руководителя;</li>
                <li>proof-блоки: кейсы, компетенции, сертификаты, понятный процесс работы.</li>
              </ul>
              <div className={styles.productionSignal}>
                <DatabaseZap size={18} aria-hidden="true" />
                <p>Цвет и финальную графику решим после того, как утвердим смысловую механику.</p>
              </div>
            </aside>
          </div>

          <section className={styles.hybridArchitectureBlock} aria-labelledby="hybrid-title">
            <div className={styles.hybridArchitectureHeader}>
              <span>гибридная архитектура</span>
              <h2 id="hybrid-title">Светлый сайт продаёт доверие, тёмные страницы показывают процессы</h2>
              <p>
                Это не два разных проекта, а один маршрут клиента: сначала понятный основной сайт,
                затем отдельная тёмная демонстрация процесса, после неё возврат к услуге и заявке.
              </p>
            </div>

            <div className={styles.hybridArchitectureGrid}>
              {hybridArchitecture.map((item) => {
                const Icon = item.icon;

                return (
                  <article className={styles.hybridArchitectureCard} key={item.title}>
                    <div className={styles.hybridArchitectureIcon}>
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <span>{item.theme}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <ul>
                      {item.points.map((point) => (
                        <li key={point}>
                          <CheckCircle2 size={15} aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>

            <div className={styles.hybridRouteMap} aria-label="Как связать светлый сайт и тёмные страницы процессов">
              <div>
                <span>светлая зона</span>
                <strong>/ + услуги</strong>
                <p>Главная, услуги, кейсы, тарифы, статьи и контакты.</p>
              </div>
              <i aria-hidden="true">-&gt;</i>
              <div data-dark="true">
                <span>тёмные разборы</span>
                <strong>/processy/marshrut-zayavki</strong>
                <p>Заявка, заказ, обмен с 1С, поддержка и контроль.</p>
              </div>
              <i aria-hidden="true">-&gt;</i>
              <div>
                <span>возврат к продаже</span>
                <strong>услуга + форма</strong>
                <p>После демонстрации человек возвращается к понятному действию.</p>
              </div>
            </div>
          </section>

          <section className={styles.liveCutBlock} aria-labelledby="live-cut-title">
            <div className={styles.liveCutHeader}>
              <span>первые сцены оживляем</span>
              <h2 id="live-cut-title">Три фрагмента, которые могут стать главным вау-эффектом</h2>
              <p>
                Это уже не список материалов, а черновой монтаж будущих экранов: действие человека,
                маршрут между системами и понятный результат для бизнеса в одной сцене.
              </p>
            </div>



            <section
              className={styles.requestFocusBlock}
              aria-labelledby="request-focus-title"
              data-step={requestFocusStep}
              style={{ "--request-focus": requestFocusProgress } as CSSProperties}
            >
              <div className={styles.requestFocusHead}>
                <div>
                  <span>фокусная сцена</span>
                  <h3 id="request-focus-title">Заявка с сайта проходит весь маршрут</h3>
                  <p>{requestFocus.copy}</p>
                </div>
                <button
                  className={styles.requestFocusRun}
                  type="button"
                  onClick={() => setRequestFocusStep((current) => (current + 1) % requestFocusSteps.length)}
                >
                  <Send size={16} aria-hidden="true" />
                  {requestFocusStep === requestFocusSteps.length - 1 ? "Повторить маршрут" : "Показать следующий шаг"}
                </button>
              </div>

              <div className={styles.requestFocusStepper} aria-label="Шаги маршрута заявки">
                {requestFocusSteps.map((step, index) => (
                  <button
                    aria-pressed={index === requestFocusStep}
                    className={styles.requestFocusStep}
                    data-current={index === requestFocusStep}
                    data-lit={requestFocusStep >= index}
                    key={step.marker}
                    onClick={() => setRequestFocusStep(index)}
                    type="button"
                  >
                    <span>{step.marker}</span>
                    <strong>{step.label}</strong>
                  </button>
                ))}
              </div>

              <div className={styles.requestJourneyMap} aria-label="Движение заявки между системами">
                <div className={styles.requestJourneyRail} aria-hidden="true">
                  <span className={styles.requestJourneyFill} />
                  <span className={styles.requestJourneyPulse} />
                </div>
                <div className={styles.requestJourneyNodes}>
                  {requestFocusSteps.map((step, index) => (
                    <div
                      className={styles.requestJourneyNode}
                      data-current={index === requestFocusStep}
                      data-lit={requestFocusStep >= index}
                      key={step.marker}
                    >
                      <i>{step.marker}</i>
                      <strong>{step.label}</strong>
                      <span>{index === requestFocusStep ? requestFocus.liveTag : step.title}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.requestJourneyCaption}>
                  Заявка не прыгает между разными окнами: она проходит один понятный маршрут с видимым следом.
                </p>
              </div>

              <div className={styles.requestDirectorStrip} aria-label="Что понятно на этом шаге">
                <article className={styles.requestDirectorCard}>
                  <Mouse size={17} aria-hidden="true" />
                  <span>действие клиента</span>
                  <strong>{requestFocus.human}</strong>
                </article>
                <article className={styles.requestDirectorCard}>
                  <DatabaseZap size={17} aria-hidden="true" />
                  <span>автоматизация</span>
                  <strong>{requestFocus.automation}</strong>
                </article>
                <article className={styles.requestDirectorCard}>
                  <ShieldCheck size={17} aria-hidden="true" />
                  <span>контроль</span>
                  <strong>{requestFocus.control}</strong>
                </article>
              </div>

              <div className={styles.requestFocusScene}>
                <section className={styles.requestWebsitePanel} aria-label="Сайт и виджет заявки">
                  <div className={styles.requestPanelTop}>
                    <MessageSquareText size={18} aria-hidden="true" />
                    <div>
                      <span>сайт Onixbit</span>
                      <strong>Виджет заявки</strong>
                    </div>
                  </div>
                  <div className={styles.requestPhoneMock}>
                    <div className={styles.requestLiveTag}>
                      <span aria-hidden="true" />
                      {requestFocus.liveTag}
                    </div>
                    <p>Здравствуйте! Хочу связать сайт, CRM и 1С.</p>
                    <p data-agent="true">Заявка принята, маршрут уже запущен.</p>
                  </div>
                  <div className={styles.requestRows}>
                    {requestFocus.siteRows.map((row) => (
                      <p key={row}>{row}</p>
                    ))}
                  </div>
                </section>

                <div className={styles.requestFocusSignal} aria-hidden="true">
                  <span />
                  <b>{requestFocus.label}</b>
                  <span />
                </div>

                <section className={styles.requestSystemPanel} aria-label="CRM, 1С и контроль">
                  <div className={styles.requestPanelTop}>
                    <Workflow size={18} aria-hidden="true" />
                    <div>
                      <span>единый контур</span>
                      <strong>{requestFocus.title}</strong>
                    </div>
                  </div>

                  <div className={styles.requestMiniBoard}>
                    {requestFocusSteps.map((step, index) => (
                      <article
                        className={styles.requestBoardCard}
                        data-current={index === requestFocusStep}
                        data-lit={requestFocusStep >= index}
                        key={step.marker}
                      >
                        <span>{step.label}</span>
                        <strong>{index === requestFocusStep ? requestFocus.crmCard : step.title}</strong>
                        <small>{index === requestFocusStep ? requestFocus.crmMeta : "ожидает свой шаг"}</small>
                      </article>
                    ))}
                  </div>

                  <div className={styles.requestSystemUpdates} aria-live="polite">
                    {requestFocus.systems.map((row, index) => (
                      <p key={row} style={{ "--row": index } as CSSProperties}>
                        <CheckCircle2 size={15} aria-hidden="true" />
                        {row}
                      </p>
                    ))}
                  </div>
                </section>
              </div>

              <div className={styles.requestFocusOutcome}>
                <BarChart3 size={18} aria-hidden="true" />
                <p>{requestFocus.result}</p>
              </div>

              <div className={styles.requestProofBar} aria-label="Проверяемые доказательства шага">
                {requestFocus.proof.map((item) => (
                  <article className={styles.requestProofItem} key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </article>
                ))}
              </div>
            </section>

            <div className={styles.liveCutGrid}>
              <div className={styles.liveCutTabs} aria-label="Живые фрагменты будущей анимации">
                {liveCutScenes.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <button
                      aria-pressed={index === activeLiveCut}
                      className={styles.liveCutTab}
                      key={item.title}
                      onClick={() => setActiveLiveCut(index)}
                      type="button"
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{item.eyebrow}</span>
                      <strong>{item.title}</strong>
                    </button>
                  );
                })}
              </div>

              <article className={styles.liveCutStage} key={liveCutScene.title}>
                <div className={styles.liveCutStageTop}>
                  <div className={styles.liveCutIcon}>
                    <LiveCutIcon size={23} aria-hidden="true" />
                  </div>
                  <div>
                    <span>{liveCutScene.eyebrow}</span>
                    <h3>{liveCutScene.title}</h3>
                    <p>{liveCutScene.lead}</p>
                  </div>
                </div>

                <div className={styles.liveCutCanvas} aria-label="Черновой монтаж сцены">
                  <section className={styles.liveForeground} aria-label="Действие человека">
                    <span>передний план</span>
                    <strong>Действие клиента</strong>
                    <div>
                      {liveCutScene.foreground.map((row) => (
                        <p key={row}>{row}</p>
                      ))}
                    </div>
                  </section>

                  <div className={styles.liveRoute} aria-hidden="true">
                    {liveCutScene.route.map((node, index) => (
                      <span key={node} style={{ "--route-index": index } as CSSProperties}>
                        {node}
                      </span>
                    ))}
                  </div>

                  <section className={styles.liveSystems} aria-label="Реакция систем">
                    <span>фоновые системы</span>
                    <strong>Что меняется сразу</strong>
                    <div>
                      {liveCutScene.systems.map((row, index) => (
                        <p key={row} style={{ "--row": index } as CSSProperties}>
                          <CheckCircle2 size={15} aria-hidden="true" />
                          {row}
                        </p>
                      ))}
                    </div>
                  </section>
                </div>

                <div className={styles.liveMetrics} aria-label="Короткие показатели сцены">
                  {liveCutScene.metrics.map((metric) => (
                    <span key={metric}>{metric}</span>
                  ))}
                </div>

                <div className={styles.liveResult}>
                  <Sparkles size={17} aria-hidden="true" />
                  <p>{liveCutScene.result}</p>
                </div>
              </article>
            </div>
          </section>

          <section className={styles.productionStudio} aria-labelledby="production-studio-title">
            <div className={styles.productionStudioHeader}>
              <span>режиссура реальных материалов</span>
              <h2 id="production-studio-title">Вот из чего потом соберём серьёзную анимацию</h2>
              <p>
                Чтобы не рисовать пустую красоту, фиксируем набор сцен: что делает человек, что
                меняется в системах, какой материал нужен и какую продажную мысль сцена доказывает.
              </p>
            </div>

            <div className={styles.productionStudioGrid}>
              <div className={styles.productionSceneTabs} aria-label="Реальные сцены для будущей анимации">
                {productionScenes.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <button
                      aria-pressed={index === activeProduction}
                      className={styles.productionSceneTab}
                      key={item.marker}
                      onClick={() => setActiveProduction(index)}
                      type="button"
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{item.marker}</span>
                      <strong>{item.title}</strong>
                      <em>{item.phase}</em>
                    </button>
                  );
                })}
              </div>

              <article className={styles.productionPreview} key={productionScene.marker}>
                <div className={styles.productionPreviewTop}>
                  <div className={styles.productionPreviewIcon}>
                    <ProductionIcon size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <span>{productionScene.phase}</span>
                    <h3>{productionScene.title}</h3>
                    <p>{productionScene.question}</p>
                  </div>
                </div>

                <div className={styles.productionFlow} aria-label="Сценарий материала">
                  <div>
                    <span>действие</span>
                    <p>{productionScene.action}</p>
                  </div>
                  <div>
                    <span>системы</span>
                    <p>{productionScene.system}</p>
                  </div>
                  <div>
                    <span>результат</span>
                    <p>{productionScene.outcome}</p>
                  </div>
                </div>

                <div className={styles.productionBottom}>
                  <div className={styles.materialList}>
                    <strong>Нужные материалы</strong>
                    <ul>
                      {productionScene.collect.map((item) => (
                        <li key={item}>
                          <CheckCircle2 size={15} aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.proofNote}>
                    <strong>Что доказывает</strong>
                    <p>{productionScene.proof}</p>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </section>
      </section>
    </div>
  );
}
