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
} from "@/data/articles";
import { getArticleVisual } from "@/data/article-visuals";
import { LeadSection } from "@/components/Sections";

export const metadata: Metadata = {
  title: "База знаний Ониксбит по Битрикс24, CRM и интеграциям",
  description:
    "Практическая база знаний Ониксбит: руководительские разборы, инструкции и серии статей по Битрикс24, CRM, задачам, автоматизации, коммуникациям и интеграциям.",
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    title: "База знаний Ониксбит",
    description:
      "Статьи в формате практической книги интегратора: как проверять CRM, запускать процессы и не терять заявки, сроки и ответственность.",
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
  "серии вместо разрозненного блога",
  "обложки и схемы без чужих клиентских данных",
  "следующий шаг внутри каждой статьи",
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

export default function ArticlesPage() {
  const featuredArticle = knowledgeBaseArticles[0];
  const featuredVisual = getArticleVisual(featuredArticle);
  const seriesGroups = articleSeries.map((series) => ({
    series,
    articles: knowledgeBaseArticles.filter((article) => article.seriesId === series.id),
    planned: articleRoadmap.filter((article) => article.seriesId === series.id),
  }));

  return (
    <>
      <section className="ob-page-hero ob-section ob-page-hero--articles">
        <div className="ob-container ob-kb-hero">
          <div className="ob-kb-hero__copy">
            <span className="ob-kicker">База знаний</span>
            <h1>Практическая книга Ониксбит по Битрикс24, CRM и интеграциям</h1>
            <p>
              Здесь статьи собраны как обучающие серии: выбираете тему, открываете конкретный сценарий и сразу видите,
              что нажать дальше. Без разрозненного блога и без скриншотов с чужими данными.
            </p>
            <div className="ob-kb-hero__actions" aria-label="Основные действия">
              <Link className="ob-btn ob-btn--primary" href={`/articles/${featuredArticle.slug}`}>
                <span>Начать с первой статьи</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link className="ob-btn ob-btn--secondary" href="#series-map">
                <span>Выбрать рубрику</span>
              </Link>
            </div>
          </div>

          <Link className="ob-kb-hero__featured" href={`/articles/${featuredArticle.slug}`} aria-label={`Открыть статью: ${featuredArticle.title}`}>
            <span className="ob-kb-hero__featured-media">
              <Image
                src={featuredVisual.src}
                alt={featuredVisual.alt}
                width={1200}
                height={760}
                preload
              />
            </span>
            <span className="ob-kb-hero__featured-meta">Рекомендуем начать</span>
            <strong>{featuredArticle.title}</strong>
            <small>
              {featuredArticle.readingTime} · {getArticleSeries(featuredArticle.seriesId).title}
            </small>
          </Link>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-page-notice ob-article-hub-notice">
          <UserRound size={22} aria-hidden="true" />
          <div>
            <p>
              Иллюстрации в статьях сделаны как редакционные рабочие схемы: они показывают логику процесса без персональных
              данных, лишних полей и клиентских карточек.
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
        <div className="ob-container ob-kb-map">
          <div className="ob-page-section-head">
            <span className="ob-kicker">Навигация</span>
            <h2 id="series-heading">Выберите рубрику</h2>
            <p>
              Рубрики работают как серии обучающих материалов. У опубликованных серий есть кнопка перехода к статьям, у будущих -
              понятная очередь тем.
            </p>
          </div>
          <nav className="ob-kb-series-rail" aria-label="Рубрики базы знаний">
            {seriesGroups.map(({ series, articles, planned }) => {
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
                    <small>{hasArticles ? `${articles.length} опубликовано` : `${planned.length || series.examples.length} в плане`}</small>
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
            <span className="ob-kicker">Статьи</span>
            <h2 id="published-heading">Материалы по рубрикам</h2>
            <p>
              Карточка целиком кликабельна: обложка, заголовок и кнопка ведут в статью. Так быстрее сканировать базу и не думать,
              где именно нажимать.
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
                      <span>{articles.length ? `${articles.length} материалов` : "Скоро"}</span>
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
                            <span className="ob-kb-article-card__action">
                              {seriesActionLabels[article.seriesId]} <ArrowRight size={16} aria-hidden="true" />
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="ob-kb-planned-list">
                      {(planned.length ? planned : series.examples.map((example) => ({ title: example, summary: series.purpose, readingTime: "в плане" }))).map((item) => (
                        <article key={item.title}>
                          <span>В плане</span>
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
            <span className="ob-kicker">Следующие выпуски</span>
            <h2 id="roadmap-heading">Что писать дальше</h2>
            <p>
              Очередь следующих статей оставил на странице, но перенёс ее ниже опубликованных материалов, чтобы она не мешала
              читателю выбирать уже готовые инструкции.
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
            <h2>Можно предложить вопрос для разбора</h2>
            <p>
              Если есть задача по Битрикс24, сайту на 1С-Битрикс или обменам с 1С, ее можно превратить в будущую статью:
              без раскрытия коммерческих деталей и с пользой для команды.
            </p>
          </div>
          <Link className="ob-editorial-note__link" href="#lead">
            Предложить тему <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <LeadSection />
    </>
  );
}
