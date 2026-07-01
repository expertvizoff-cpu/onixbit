import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  ListChecks,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import {
  getArticleBySlug,
  getArticleSeries,
  knowledgeBaseArticles,
  type ArticleSeriesId,
} from "@/data/articles";
import { getArticleVisual } from "@/data/article-visuals";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const baseUrl = "https://onixbit.ru";

const articleIntentLabels: Record<ArticleSeriesId, string> = {
  "quick-start": "ориентация в портале",
  "crm-sales": "продажи и заявки",
  communications: "коммуникации",
  tasks: "задачи и ответственность",
  automation: "автоматизация",
  "access-problems": "доступ и диагностика",
  integrations: "интеграции и обмены",
  "manager-control": "управленческий контроль",
};

function getSeriesThemeClass(seriesId: ArticleSeriesId) {
  return `ob-series-theme--${seriesId}`;
}

const defaultSectionTitles = {
  shortAnswer: "Как быстро отличить рабочую CRM от витрины настроек",
  checksKicker: "Проверьте первым",
  checks: "7 признаков поверхностного внедрения",
  tocChecks: "7 проверок",
  steps: "Пошаговая диагностика",
  tocSteps: "Пошаговая диагностика",
  healthy: "Что считается здоровым поведением CRM",
  warnings: "Тревожные сигналы",
  media: "Какие медиа стоит добавить к статье",
  mistakesKicker: "Где обычно ломается",
  mistakes: "Частые ошибки при проверке внедрения",
  tocMistakes: "Ошибки",
  integratorHelp: "Когда нужна помощь интегратора",
} as const;

export function generateStaticParams() {
  return knowledgeBaseArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Статья не найдена",
    };
  }

  const visual = getArticleVisual(article);
  const visualUrl = visual.src.startsWith("http") ? visual.src : `${baseUrl}${visual.src}`;

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `/articles/${article.slug}`,
      type: "article",
      publishedTime: article.lastUpdated,
      modifiedTime: article.lastUpdated,
      authors: [article.author.name],
      images: [visualUrl],
    },
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function buildArticleJsonLd(article: NonNullable<ReturnType<typeof getArticleBySlug>>) {
  const articleUrl = `${baseUrl}/articles/${article.slug}`;
  const visual = getArticleVisual(article);
  const articleImage = visual.src.startsWith("http") ? visual.src : `${baseUrl}${visual.src}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.description,
        image: articleImage,
        datePublished: article.lastUpdated,
        dateModified: article.lastUpdated,
        mainEntityOfPage: articleUrl,
        author: {
          "@type": "Person",
          name: article.author.name,
          affiliation: {
            "@type": "Organization",
            name: "Ониксбит",
            url: baseUrl,
          },
        },
        publisher: {
          "@type": "Organization",
          name: "Ониксбит",
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/brand/onixbit-logo-header.png`,
          },
        },
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
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: articleUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: article.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const series = getArticleSeries(article.seriesId);
  const seriesArticles = knowledgeBaseArticles.filter((item) => item.seriesId === article.seriesId);
  const seriesPosition = seriesArticles.findIndex((item) => item.slug === article.slug);
  const articleIndex = knowledgeBaseArticles.findIndex((item) => item.slug === article.slug);
  const previousArticle = seriesArticles[seriesPosition - 1] ?? knowledgeBaseArticles[articleIndex - 1];
  const nextArticle = seriesArticles[seriesPosition + 1] ?? knowledgeBaseArticles[articleIndex + 1];
  const articleVisual = getArticleVisual(article);
  const seriesThemeClass = getSeriesThemeClass(article.seriesId);
  const jsonLd = buildArticleJsonLd(article);
  const updatedDate = formatDate(article.lastUpdated);
  const sectionTitles = { ...defaultSectionTitles, ...article.sectionTitles };
  const firstWarning = article.warningSigns[0] ?? {
    symptom: "Симптом не указан",
    meaning: article.primaryIntent,
    firstCheck: "Начните с короткого ответа и первой проверки.",
  };
  const firstCheck = article.keyChecks[0] ?? {
    title: "Первая проверка",
    text: article.primaryIntent,
  };
  const firstStep = article.steps[0] ?? {
    title: "Первый шаг",
    text: article.primaryIntent,
    result: "Появляется понятная точка старта.",
  };

  return (
    <article className={`ob-knowledge-article ${seriesThemeClass}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="ob-page-hero ob-section ob-article-hero">
        <div className={`ob-container ob-article-hero__grid ${seriesThemeClass}`}>
          <div className="ob-article-hero__content">
            <Link className="ob-article-back" href="/articles">
              <ArrowLeft size={17} aria-hidden="true" />
              База знаний
            </Link>
            <span className="ob-kicker">{series.title}</span>
            <strong className="ob-article-context-label">{articleIntentLabels[article.seriesId]}</strong>
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <div className="ob-article-meta" aria-label="Метаданные статьи">
              <span>{article.category}</span>
              <span>{article.readingTime}</span>
              <time dateTime={article.lastUpdated}>Обновлено: {updatedDate}</time>
            </div>
            <div className="ob-article-hero__diagnostic" aria-label="Короткая диагностическая карточка статьи">
              <div>
                <span>Симптом</span>
                <strong>{firstWarning.symptom}</strong>
              </div>
              <div>
                <span>Первая проверка</span>
                <strong>{firstCheck.title}</strong>
              </div>
              <div>
                <span>Результат</span>
                <strong>{firstStep.result}</strong>
              </div>
            </div>
          </div>

          <aside className="ob-article-hero__side" aria-label="Визуальная обложка и автор статьи">
            <figure className="ob-article-visual-card">
              <Image src={articleVisual.src} alt={articleVisual.alt} width={1200} height={760} preload />
              <figcaption>{articleVisual.caption}</figcaption>
            </figure>
            <div className="ob-article-author" aria-label="Автор статьи">
              <div className="ob-article-author__image">
                <Image src={article.author.image} alt={`${article.author.name}, ${article.author.role}`} width={112} height={112} loading="lazy" />
              </div>
              <span>Разбирает</span>
              <strong>{article.author.name}</strong>
              <p>{article.author.role}</p>
              <em>{article.author.note}</em>
            </div>
          </aside>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-article-shell">
          <nav className="ob-article-toc" aria-label="Навигация по статье">
            <strong>В статье</strong>
            <a href="#diagnostic-card">Диагностическая карточка</a>
            <a href="#short-answer">Короткий ответ</a>
            <a href="#checks">{sectionTitles.tocChecks}</a>
            <a href="#steps">{sectionTitles.tocSteps}</a>
            <a href="#media">Медиа</a>
            <a href="#mistakes">{sectionTitles.tocMistakes}</a>
            <a href="#faq">FAQ</a>
            <a href="#series-next">Что дальше</a>
          </nav>

          <div className="ob-article-body">
            <div className="ob-article-main-flow" aria-label="Основная часть статьи">
              <div className="ob-article-main-flow__label">
                <span>Записка интегратора</span>
                <strong>{series.title}</strong>
              </div>
              <section className="ob-article-panel ob-article-diagnostic-card" id="diagnostic-card">
                <div className="ob-article-diagnostic-card__head">
                  <div>
                    <span>Диагностическая карточка</span>
                    <h2>С чего начать разбор</h2>
                  </div>
                  <strong>{articleIntentLabels[article.seriesId]}</strong>
                </div>
                <div className="ob-article-diagnostic-card__grid">
                  <article>
                    <AlertTriangle size={21} aria-hidden="true" />
                    <span>Что болит</span>
                    <h3>{firstWarning.symptom}</h3>
                    <p>{firstWarning.meaning}</p>
                  </article>
                  <article>
                    <ListChecks size={21} aria-hidden="true" />
                    <span>Где смотреть</span>
                    <h3>{firstCheck.title}</h3>
                    <p>{firstCheck.text}</p>
                  </article>
                  <article>
                    <CheckCircle2 size={21} aria-hidden="true" />
                    <span>Первый шаг</span>
                    <h3>{firstStep.title}</h3>
                    <p>{firstStep.text}</p>
                  </article>
                </div>
              </section>
              <section className="ob-article-panel ob-article-panel--lead" id="short-answer">
              <div className="ob-article-panel__head">
                <BookOpen size={22} aria-hidden="true" />
                <div>
                  <span>Короткий ответ</span>
                  <h2>{sectionTitles.shortAnswer}</h2>
                </div>
              </div>
              {article.shortAnswer.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <section className="ob-article-panel">
              <h2>Кому подходит</h2>
              <ul className="ob-article-tags">
                {article.audience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="ob-article-panel">
              <h2>Что нужно до начала</h2>
              <ul className="ob-article-list">
                {article.beforeStart.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="ob-article-panel" id="checks">
              <div className="ob-article-panel__head">
                <ListChecks size={22} aria-hidden="true" />
                <div>
                  <span>{sectionTitles.checksKicker}</span>
                  <h2>{sectionTitles.checks}</h2>
                </div>
              </div>
              <div className="ob-article-checks">
                {article.keyChecks.map((item, index) => (
                  <article key={item.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <aside className="ob-integrator-note">
              <span>{article.integratorNote.title}</span>
              <p>{article.integratorNote.text}</p>
            </aside>

            <section className="ob-article-panel" id="steps">
              <h2>{sectionTitles.steps}</h2>
              <ol className="ob-article-steps">
                {article.steps.map((step) => (
                  <li key={step.title}>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                    <strong>{step.result}</strong>
                  </li>
                ))}
              </ol>
            </section>

            <section className="ob-article-panel">
              <h2>{sectionTitles.healthy}</h2>
              <ul className="ob-article-list ob-article-list--compact">
                {article.healthySigns.map((item) => (
                  <li key={item}>
                    <ShieldCheck size={18} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="ob-article-panel">
              <h2>{sectionTitles.warnings}</h2>
              <div className="ob-article-table-wrap">
                <table className="ob-article-table">
                  <thead>
                    <tr>
                      <th>Симптом</th>
                      <th>Что это значит</th>
                      <th>Что проверить</th>
                    </tr>
                  </thead>
                  <tbody>
                    {article.warningSigns.map((row) => (
                      <tr key={row.symptom}>
                        <td data-label="Симптом">{row.symptom}</td>
                        <td data-label="Что это значит">{row.meaning}</td>
                        <td data-label="Что проверить">{row.firstCheck}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="ob-article-panel" id="media">
              <div className="ob-article-panel__head">
                <PlayCircle size={22} aria-hidden="true" />
                <div>
                  <span>Скриншоты, GIF и видео</span>
                  <h2>{sectionTitles.media}</h2>
                </div>
              </div>
              <p>
                Ниже показана рабочая схема ключевого шага. Она помогает понять процесс без персональных данных,
                лишних полей и привязки к конкретному клиентскому порталу.
              </p>
              <figure className="ob-article-media-shot">
                <Image src={articleVisual.src} alt={articleVisual.alt} width={1200} height={760} loading="lazy" />
                <figcaption>{articleVisual.caption}</figcaption>
              </figure>
              <div className="ob-article-media-grid">
                {article.mediaGuidance.map((item) => (
                  <article key={item.title}>
                    <span>{item.type}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="ob-article-panel" id="mistakes">
              <div className="ob-article-panel__head">
                <AlertTriangle size={22} aria-hidden="true" />
                <div>
                  <span>{sectionTitles.mistakesKicker}</span>
                  <h2>{sectionTitles.mistakes}</h2>
                </div>
              </div>
              <div className="ob-article-table-wrap">
                <table className="ob-article-table">
                  <thead>
                    <tr>
                      <th>Ошибка</th>
                      <th>Причина</th>
                      <th>Что проверить</th>
                    </tr>
                  </thead>
                  <tbody>
                    {article.mistakes.map((row) => (
                      <tr key={row.problem}>
                        <td data-label="Ошибка">{row.problem}</td>
                        <td data-label="Причина">{row.cause}</td>
                        <td data-label="Что проверить">{row.check}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="ob-article-panel">
              <h2>{sectionTitles.integratorHelp}</h2>
              <ul className="ob-article-list">
                {article.integratorHelp.map((item) => (
                  <li key={item}>
                    <ArrowRight size={18} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="ob-article-panel" id="faq">
              <div className="ob-article-panel__head">
                <HelpCircle size={22} aria-hidden="true" />
                <div>
                  <span>FAQ</span>
                  <h2>Часто задаваемые вопросы</h2>
                </div>
              </div>
              <div className="ob-article-faq">
                {article.faq.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            </div>

            <footer className="ob-article-afterword" aria-labelledby="article-afterword-heading">
              <div className="ob-article-afterword__head">
                <span>После инструкции</span>
                <h2 id="article-afterword-heading">Источники, продолжение и помощь</h2>
                <p>
                  Основная инструкция выше закончилась. Ниже — проверяемые источники, следующий материал по серии,
                  связанные разделы сайта и понятный вариант обращения в Ониксбит.
                </p>
              </div>

              <section className="ob-article-panel ob-article-panel--sources">
                <h2>Источники</h2>
                <ul className="ob-article-sources">
                {article.sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} target="_blank" rel="noreferrer">
                      {source.title}
                      <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  </li>
                ))}
                </ul>
              </section>

              <section className="ob-article-series-next" id="series-next" aria-label="Навигация между статьями">
              <div>
                <span>{series.title}</span>
                <h2>Что читать дальше</h2>
                <p>
                  Материал {seriesPosition + 1} из {seriesArticles.length} в этой рубрике. Можно вернуться к карте или перейти к соседней статье.
                </p>
              </div>
              <div className="ob-article-series-next__links">
                <Link href="/articles#series-map">
                  <ArrowLeft size={16} aria-hidden="true" />
                  К карте рубрик
                </Link>
                {previousArticle ? (
                  <Link href={`/articles/${previousArticle.slug}`}>
                    <ArrowLeft size={16} aria-hidden="true" />
                    {previousArticle.title}
                  </Link>
                ) : null}
                {nextArticle ? (
                  <Link href={`/articles/${nextArticle.slug}`}>
                    {nextArticle.title}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
              </section>

              <section className="ob-article-panel ob-article-panel--related">
                <h2>Связанные материалы и разделы</h2>
              <div className="ob-article-related">
                {article.relatedLinks.map((link) => (
                  <Link href={link.href} key={link.href}>
                    <span>{link.title}</span>
                    <p>{link.text}</p>
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ))}
              </div>
              </section>

              <section className="ob-article-cta" id="article-cta">
              <div>
                <span>Что можно сделать с Ониксбит</span>
                <h2>{article.cta.title}</h2>
                <p>{article.cta.text}</p>
              </div>
              <a className="ob-btn ob-btn--primary" href={article.cta.href} data-obx-lead-open>
                <span>{article.cta.label}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              </section>
            </footer>
          </div>
        </div>
      </section>
    </article>
  );
}
