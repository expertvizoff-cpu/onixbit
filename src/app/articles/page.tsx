import type { Metadata } from "next";
import { ArrowRight, BookOpen, FileText, Lightbulb, MessageCircleQuestion, Route, Settings2 } from "lucide-react";
import { articles } from "@/data/site";
import { LeadSection } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Статьи Ониксбит о Битрикс24, 1С-Битрикс, 1С и интеграциях",
  description:
    "Практические статьи Ониксбит для B2B-руководителей: внедрение Битрикс24, сайты на 1С-Битрикс, обмены с 1С, лицензии, поддержка и контроль проекта.",
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    title: "Статьи Ониксбит",
    description:
      "Практические материалы о CRM, сайтах, 1С, интеграциях и управлении проектом без лишнего копирайтинга.",
    url: "/articles",
    type: "website",
  },
};

const categories = [
  { title: "CRM и продажи", text: "воронки, права, роботы, коммуникации, контроль руководителя", icon: Route },
  { title: "Сайты и e-commerce", text: "структура, формы, каталог, корзина, SEO-основа и интеграции", icon: FileText },
  { title: "1С и обмены", text: "товары, заказы, статусы, ответственные и точки отказа", icon: Settings2 },
  { title: "Управление проектом", text: "как ставить задачу, принимать результат и не терять ответственность", icon: Lightbulb },
];

export default function ArticlesPage() {
  return (
    <>
      <section className="ob-page-hero ob-section ob-page-hero--articles">
        <div className="ob-container ob-rich-hero">
          <div>
            <span className="ob-kicker">Статьи</span>
            <h1>Материалы для тех, кто выбирает систему, а не подрядчика наугад</h1>
            <p>
              Здесь будут практические материалы от Ониксбит: как готовиться к внедрению, где чаще ломаются обмены и
              какие вопросы задать до покупки лицензии или запуска разработки.
            </p>
          </div>
          <div className="ob-page-status-card">
            <strong>Редакционная база в работе</strong>
            <span>Темы уже собраны вокруг частых вопросов клиентов: CRM, сайт, 1С, лицензии, интеграции и приёмка результата.</span>
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-page-notice">
          <BookOpen size={22} aria-hidden="true" />
          <p>
            Пока это редакционный план и первые темы. Смысл раздела — помогать руководителю принимать решения до старта проекта:
            увидеть риски, подготовить вопросы и понять, какая архитектура нужна бизнесу.
          </p>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container">
          <div className="ob-page-section-head">
            <span className="ob-kicker">Редакция</span>
            <h2>Основные темы материалов</h2>
          </div>
          <div className="ob-card-grid ob-card-grid--4 ob-topic-grid">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <article className="ob-topic-card" key={item.title}>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ob-section">
        <div className="ob-container ob-articles-board">
          <div className="ob-page-section-head">
            <span className="ob-kicker">Первые материалы</span>
            <h2>Статьи, которые закроют частые вопросы клиентов</h2>
          </div>
          <div className="ob-articles-board__grid">
            {articles.map((article, index) => (
              <article className={index === 0 ? "ob-article-feature" : "ob-article-tile"} key={article.title}>
                <div>
                  <span>{article.category}</span>
                  <em>{article.minutes}</em>
                </div>
                <h3>{article.title}</h3>
                <p>{article.text}</p>
                <a href="#lead">
                  Обсудить тему <ArrowRight size={16} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-editorial-note">
          <MessageCircleQuestion size={28} aria-hidden="true" />
          <div>
            <h2>Можно предложить вопрос для разбора</h2>
            <p>
              Если у вас есть задача по Битрикс24, сайту на 1С-Битрикс или обменам с 1С, её можно разобрать как будущий материал:
              без раскрытия коммерческих деталей и с пользой для команды.
            </p>
          </div>
        </div>
      </section>

      <LeadSection />
    </>
  );
}
