import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
  ListChecks,
  MessageCircleQuestion,
  Route,
  Settings2,
  ShieldCheck,
  UserRound,
  Workflow,
} from "lucide-react";
import {
  articleRoadmap,
  articleSeries,
  getArticleSeries,
  knowledgeBaseArticles,
  type ArticleSeriesId,
  type KnowledgeArticle,
} from "@/data/articles";
import { getArticleVisual } from "@/data/article-visuals";
import { LeadSection } from "@/components/Sections";

const baseUrl = "https://onixbit.ru";

export const metadata: Metadata = {
  title: "Карта проблем Битрикс24, CRM, сайта и 1С",
  description:
    "База знаний Ониксбит как карта рабочих проблем: заявки с сайта, CRM, задачи, роботы, права, 1С и интеграции. Симптомы, проверки и полевые записки интегратора.",
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    title: "Карта проблем Ониксбит по Битрикс24, CRM и 1С",
    description:
      "Практические разборы по участкам системы: заявки, CRM, задачи, роботы, права, сайт, 1С и интеграции.",
    url: "/articles",
    type: "website",
  },
};

const seriesIcons: Record<ArticleSeriesId, typeof BookOpen> = {
  "quick-start": BookOpen,
  "crm-sales": Route,
  communications: MessageCircleQuestion,
  tasks: ListChecks,
  automation: Workflow,
  "access-problems": ShieldCheck,
  integrations: Settings2,
  "manager-control": Lightbulb,
};

const pageHighlights = [
  "проверки для руководителя",
  "инструкции для команды",
  "разборы ошибок и интеграций",
] as const;

const systemMapStages = [
  {
    title: "Сайт и входящий поток",
    signal: "форма, источник, первый ответ",
    symptom: "заявка пришла, но в CRM нет владельца процесса",
    articleSlug: "obrabotat-zayavku-s-saita-v-bitrix24",
    icon: MessageCircleQuestion,
  },
  {
    title: "CRM и продажи",
    signal: "лид, сделка, контакт, компания",
    symptom: "клиенты и продажи смешались в случайных карточках",
    articleSlug: "lidy-sdelki-kontakty-kompanii-bitrix24",
    icon: Route,
  },
  {
    title: "Доступ и видимость",
    signal: "фильтры, роли, направления",
    symptom: "менеджер не видит сделку или видит лишнее",
    articleSlug: "menedzher-ne-vidit-sdelku-bitrix24",
    icon: ShieldCheck,
  },
  {
    title: "Задачи и ответственность",
    signal: "срок, ответственный, результат",
    symptom: "все договорились, но никто не отвечает за следующий шаг",
    articleSlug: "sozdat-zadachu-i-otvetstvennost-bitrix24",
    icon: ListChecks,
  },
  {
    title: "Роботы и регламент",
    signal: "стадия, условие, действие",
    symptom: "автоматизация шумит, но не помогает контролю",
    articleSlug: "roboty-v-sdelkah-bitrix24",
    icon: Workflow,
  },
  {
    title: "Сайт, CRM и 1С",
    signal: "клиент, заказ, товар, статус",
    symptom: "непонятно, где правда по данным и кто их меняет",
    articleSlug: "sait-crm-1c-istochnik-istiny",
    icon: Settings2,
  },
] as const;

const seriesActionLabels: Record<ArticleSeriesId, string> = {
  "quick-start": "Освоить портал",
  "crm-sales": "Разобрать продажи",
  communications: "Связать каналы",
  tasks: "Навести порядок",
  automation: "Проверить роботов",
  "access-problems": "Найти причину",
  integrations: "Собрать обмен",
  "manager-control": "Проверить управление",
};

function getSeriesThemeClass(seriesId: ArticleSeriesId) {
  return `ob-series-theme--${seriesId}`;
}

function getLevelLabel(level: "start" | "normal" | "advanced") {
  if (level === "start") return "Старт";
  if (level === "advanced") return "Сложно";
  return "Практика";
}

function buildKnowledgeBaseJsonLd() {
  const articlesListId = `${baseUrl}/articles#articles-list`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/articles#collection`,
        url: `${baseUrl}/articles`,
        name: "Карта проблем Ониксбит по Битрикс24, CRM, сайту и 1С",
        description:
          "База знаний для руководителей, маркетологов, менеджеров и администраторов: симптомы, проверки и разборы по CRM, заявкам, задачам, роботам, правам и интеграциям.",
        inLanguage: "ru-RU",
        isPartOf: {
          "@type": "WebSite",
          name: "Ониксбит",
          url: baseUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "Ониксбит",
          url: baseUrl,
        },
        mainEntity: {
          "@id": articlesListId,
        },
      },
      {
        "@type": "ItemList",
        "@id": articlesListId,
        name: "Опубликованные статьи Ониксбит",
        numberOfItems: knowledgeBaseArticles.length,
        itemListElement: knowledgeBaseArticles.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Article",
            headline: article.title,
            description: article.description,
            url: `${baseUrl}/articles/${article.slug}`,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Ониксбит",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "База знаний",
            item: `${baseUrl}/articles`,
          },
        ],
      },
    ],
  };
}

export default function ArticlesPage() {
  const featuredArticle = knowledgeBaseArticles[0];
  const jsonLd = buildKnowledgeBaseJsonLd();
  const seriesGroups = articleSeries.map((series) => ({
    series,
    articles: knowledgeBaseArticles.filter((article) => article.seriesId === series.id),
    planned: articleRoadmap.filter((article) => article.seriesId === series.id),
  }));
  const systemStages: Array<(typeof systemMapStages)[number] & { article: KnowledgeArticle }> = systemMapStages.flatMap((stage) => {
    const article = knowledgeBaseArticles.find((item) => item.slug === stage.articleSlug);
    return article ? [{ ...stage, article }] : [];
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="ob-page-hero ob-section ob-page-hero--articles">
        <div className="ob-container ob-kb-hero ob-kb-hero--live">
          <div className="ob-kb-hero__copy">
            <span className="ob-kicker">База знаний</span>
            <h1>Карта проблем Битрикс24, сайта, задач и 1С</h1>
            <p>
              Материалы собраны не по датам публикации, а по рабочим участкам вашей системы: где появляется заявка,
              кто отвечает за следующий шаг и где расходятся данные. Откройте узел и получите полевую записку интегратора.
            </p>
            <div className="ob-kb-hero__actions" aria-label="Основные действия">
              <Link className="ob-btn ob-btn--primary" href={`/articles/${featuredArticle.slug}`}>
                <span>Начать с руководительской проверки</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link className="ob-btn ob-btn--secondary" href="#series-map">
                <span>Открыть карту системы</span>
              </Link>
            </div>
            <dl className="ob-kb-hero__proof" aria-label="Что уже есть в базе знаний">
              <div>
                <dt>{knowledgeBaseArticles.length}</dt>
                <dd>готовых разборов</dd>
              </div>
              <div>
                <dt>{articleSeries.length}</dt>
                <dd>рабочих рубрик</dd>
              </div>
              <div>
                <dt>CRM + 1С</dt>
                <dd>в одном контуре</dd>
              </div>
            </dl>
          </div>

          <div className="ob-kb-hero__motion" aria-label="Анимированная схема: заявка проходит через CRM, задачи, интеграции и контроль руководителя">
            <div className="ob-kb-hero__motion-head">
              <span>Карта системы</span>
              <strong>где теряется заявка, ответственность или данные</strong>
            </div>
            <div className="ob-kb-flow" aria-hidden="true">
              <span className="ob-kb-flow__track ob-kb-flow__track--main" />
              <span className="ob-kb-flow__track ob-kb-flow__track--side" />
              <span className="ob-kb-flow__pulse ob-kb-flow__pulse--one" />
              <span className="ob-kb-flow__pulse ob-kb-flow__pulse--two" />
              <span className="ob-kb-flow__pulse ob-kb-flow__pulse--three" />
              <div className="ob-kb-flow__node ob-kb-flow__node--request">
                <MessageCircleQuestion size={22} />
                <span>Заявка</span>
                <strong>источник, контакт, первый ответ</strong>
              </div>
              <div className="ob-kb-flow__node ob-kb-flow__node--crm">
                <Route size={22} />
                <span>CRM</span>
                <strong>лид, сделка, стадия, ответственный</strong>
              </div>
              <div className="ob-kb-flow__node ob-kb-flow__node--task">
                <ListChecks size={22} />
                <span>Задача</span>
                <strong>срок, результат, наблюдатели</strong>
              </div>
              <div className="ob-kb-flow__node ob-kb-flow__node--integration">
                <Settings2 size={22} />
                <span>Интеграции</span>
                <strong>сайт, 1С, телефония, чаты</strong>
              </div>
              <div className="ob-kb-flow__node ob-kb-flow__node--control">
                <Lightbulb size={22} />
                <span>Контроль</span>
                <strong>что видит руководитель</strong>
              </div>
            </div>
            <Link className="ob-kb-hero__diagnostic" href={`/articles/${featuredArticle.slug}`} aria-label={`Открыть статью: ${featuredArticle.title}`}>
              <span>Первый разбор</span>
              <strong>{featuredArticle.title}</strong>
              <em>
                {featuredArticle.readingTime} · {getArticleSeries(featuredArticle.seriesId).title}
              </em>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-page-notice ob-article-hub-notice">
          <UserRound size={22} aria-hidden="true" />
          <div>
            <p>
              Схемы в статьях показывают логику рабочих процессов: где возникает заявка, кто отвечает за следующий шаг,
              какие данные должны попасть в CRM и где обычно теряется контроль.
            </p>
            <ul>
              {pageHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight" id="series-map" aria-labelledby="series-heading">
        <div className="ob-container ob-kb-system-map">
          <div className="ob-page-section-head">
            <span className="ob-kicker">Карта системы клиента</span>
            <h2 id="series-heading">Выберите место, где процесс начинает сыпаться</h2>
            <p>
              Обычно сначала виден симптом: заявки зависают, менеджеры спорят за ответственного, робот создаёт шум,
              1С и CRM показывают разную картину. Поэтому навигация начинается с процесса, а не с рубрики.
            </p>
          </div>
          <div className="ob-kb-system-board" aria-label="Карта рабочих участков: сайт, CRM, доступ, задачи, роботы и 1С">
            <span className="ob-kb-system-board__line" aria-hidden="true" />
            {systemStages.map((stage, index) => {
              const Icon = stage.icon;
              const visual = getArticleVisual(stage.article);

              return (
                <Link
                  className={`ob-kb-system-stage ${getSeriesThemeClass(stage.article.seriesId)}`}
                  href={`/articles/${stage.article.slug}`}
                  key={stage.article.slug}
                >
                  <span className="ob-kb-system-stage__number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="ob-kb-system-stage__icon">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <span className="ob-kb-system-stage__copy">
                    <small>{stage.signal}</small>
                    <strong>{stage.title}</strong>
                    <em>{stage.symptom}</em>
                    <b>{stage.article.title}</b>
                  </span>
                  <span className="ob-kb-system-stage__media" aria-hidden="true">
                    <Image src={visual.src} alt="" width={280} height={178} loading="lazy" />
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
          <nav className="ob-kb-series-rail" aria-label="Рубрики базы знаний">
            {seriesGroups.map(({ series, articles }) => {
              const Icon = seriesIcons[series.id];
              const hasArticles = articles.length > 0;

              return (
                <a
                  href={`#series-${series.id}`}
                  className={[hasArticles ? "is-published" : "", getSeriesThemeClass(series.id)].filter(Boolean).join(" ")}
                  key={series.id}
                >
                  <Icon size={22} aria-hidden="true" />
                  <span>
                    <strong>{series.title}</strong>
                    <small>{hasArticles ? `${articles.length} опубликовано` : "Готовится"}</small>
                  </span>
                </a>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="ob-section" id="published" aria-labelledby="published-heading">
        <div className="ob-container ob-kb-library">
          <div className="ob-page-section-head">
            <span className="ob-kicker">Полевые записки интегратора</span>
            <h2 id="published-heading">Разборы, которые начинаются с рабочей боли</h2>
            <p>
              Внутри не теория ради теории, а диагностическая логика: что болит, где проверить первым, что считается
              нормой и когда уже нужна настройка, а не очередное обсуждение в чате.
            </p>
          </div>

          <div className="ob-kb-library__groups">
            {seriesGroups.map(({ series, articles, planned }) => {
              const Icon = seriesIcons[series.id];

              return (
                <section
                  className={`ob-kb-series-block ${getSeriesThemeClass(series.id)}`}
                  id={`series-${series.id}`}
                  key={series.id}
                  aria-labelledby={`${series.id}-heading`}
                >
                  <div className="ob-kb-series-block__head">
                    <Icon size={24} aria-hidden="true" />
                    <div>
                      <span>{articles.length ? `${articles.length} материалов` : "Готовим"}</span>
                      <h3 id={`${series.id}-heading`}>{series.title}</h3>
                      <strong>{seriesActionLabels[series.id]}</strong>
                      <p>{series.purpose}</p>
                    </div>
                  </div>

                  {articles.length ? (
                    <div className="ob-kb-article-grid">
                      {articles.map((article) => {
                        const visual = getArticleVisual(article);

                        return (
                          <Link
                            className={`ob-kb-article-card ${getSeriesThemeClass(article.seriesId)}`}
                            href={`/articles/${article.slug}`}
                            key={article.slug}
                          >
                            <span className="ob-kb-article-card__media">
                              <Image src={visual.src} alt={visual.alt} width={1200} height={760} loading="lazy" />
                            </span>
                            <span className="ob-kb-article-card__meta">
                              <span>{article.category}</span>
                              <span>{getLevelLabel(article.level)}</span>
                              <span>{article.readingTime}</span>
                            </span>
                            <strong>{article.title}</strong>
                            <em>{article.summary}</em>
                            <span className="ob-kb-article-card__intent">
                              <span>Ситуация</span>
                              <b>{article.primaryIntent}</b>
                            </span>
                            <span className="ob-kb-article-card__action">
                              {seriesActionLabels[article.seriesId]} <ArrowRight size={16} aria-hidden="true" />
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="ob-kb-planned-list">
                      {(planned.length ? planned : series.examples.map((example) => ({ title: example, summary: series.purpose, readingTime: "готовится" }))).map((item) => (
                        <article key={item.title}>
                          <span>Готовится</span>
                          <strong>{item.title}</strong>
                          <p>{item.summary}</p>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight" id="roadmap" aria-labelledby="roadmap-heading">
        <div className="ob-container ob-article-roadmap">
          <div className="ob-page-section-head">
            <span className="ob-kicker">Очередь разборов</span>
            <h2 id="roadmap-heading">Какие участки системы закроем следующими</h2>
            <p>
              Следующие материалы закроют участки, где часто теряется управление: открытые линии, права CRM,
              задачи, шаблоны ответов и подготовка обменов с 1С.
            </p>
          </div>
          <div className="ob-article-roadmap__grid">
            {articleRoadmap.map((article) => {
              const series = getArticleSeries(article.seriesId);
              const Icon = seriesIcons[article.seriesId];
              return (
                <article className="ob-article-roadmap__item" key={article.title}>
                  <Icon size={22} aria-hidden="true" />
                  <span>{series.title}</span>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <em>{article.readingTime}</em>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-editorial-note">
          <HelpCircle size={28} aria-hidden="true" />
          <div>
            <h2>Не нашли свою ситуацию?</h2>
            <p>
              Опишите задачу по Битрикс24, сайту на 1С-Битрикс или обменам с 1С. Подскажем, где искать причину и какой
              следующий шаг будет разумным.
            </p>
          </div>
          <Link className="ob-editorial-note__link" href="#lead">
            Описать задачу <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <LeadSection />
    </>
  );
}
