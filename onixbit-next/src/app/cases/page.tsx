import type { Metadata } from "next";
import { ArrowRight, BarChart3, CheckCircle2, MessageSquareText, Network, ShoppingCart, Workflow } from "lucide-react";
import { LeadSection } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Кейсы",
  description: "Кейсы Ониксбит по Битрикс24, 1С-Битрикс, 1С и интеграциям для B2B-команд.",
};

const caseCards = [
  {
    label: "Битрикс24",
    title: "CRM и коммуникации в одном контуре продаж",
    text: "Как переводим обращения из мессенджеров, телефонии и сайта в управляемые сделки с ответственными, задачами и отчётами.",
    result: "меньше ручного контроля",
    icon: MessageSquareText,
  },
  {
    label: "1С-Битрикс",
    title: "Сайт становится частью CRM, а не отдельной витриной",
    text: "Проектируем формы, каталог, корзину и заявки так, чтобы менеджер видел источник, контекст и следующий шаг клиента.",
    result: "понятный маршрут заявки",
    icon: ShoppingCart,
  },
  {
    label: "1С",
    title: "Обмен заказами, товарами и статусами без дублей",
    text: "Фиксируем, какие данные живут в 1С, какие уходят в CRM и что должно вернуться на сайт после обработки заказа.",
    result: "аккуратный обмен данными",
    icon: Network,
  },
];

const caseFlow = [
  "задача и ограничения",
  "архитектура решения",
  "этапы внедрения",
  "результат для бизнеса",
];

export default function CasesPage() {
  return (
    <>
      <section className="ob-page-hero ob-section ob-page-hero--cases">
        <div className="ob-container ob-rich-hero">
          <div>
            <span className="ob-kicker">Кейсы</span>
            <h1>Разборы проектов, где CRM, сайт и 1С работают как система</h1>
            <p>
              Страница оформлена как будущий портфель: без выдуманных клиентов и логотипов, но уже с понятной структурой,
              по которой будут публиковаться реальные согласованные кейсы.
            </p>
          </div>
          <div className="ob-page-status-card">
            <strong>Раздел наполняется</strong>
            <span>Публичные кейсы появятся после согласования с клиентами. Формат уже готов: задача, решение, ограничения, результат.</span>
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-page-notice">
          <CheckCircle2 size={22} aria-hidden="true" />
          <p>
            Мы не ставим случайные названия компаний для красоты. Сейчас показываем реальные направления работ и формат раскрытия,
            чтобы позже заменить карточки согласованными проектами без перестройки страницы.
          </p>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-case-showcase">
          <div className="ob-case-showcase__head">
            <span className="ob-kicker">Формат кейса</span>
            <h2>Каждый разбор будет отвечать на вопросы руководителя</h2>
            <p>Что было сломано, что изменили, где были ограничения и как понять, что проект дал управляемый результат.</p>
          </div>
          <div className="ob-card-grid ob-card-grid--4 ob-case-flow">
            {caseFlow.map((item, index) => (
              <article key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ob-section">
        <div className="ob-container">
          <div className="ob-page-section-head">
            <span className="ob-kicker">Направления</span>
            <h2>Какие кейсы появятся первыми</h2>
          </div>
          <div className="ob-card-grid ob-card-grid--3 ob-story-grid">
            {caseCards.map((item) => {
              const Icon = item.icon;
              return (
                <article className="ob-story-card" key={item.title}>
                  <Icon size={28} aria-hidden="true" />
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <em>{item.result} <ArrowRight size={16} aria-hidden="true" /></em>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ob-section ob-section--tight">
        <div className="ob-container ob-case-architecture">
          <div>
            <Workflow size={30} aria-hidden="true" />
            <h2>Кейс будет полезен, только если видна архитектура</h2>
            <p>
              Поэтому в каждом материале будут схема движения заявки, границы ответственности, состав интеграций и критерии приёмки.
            </p>
          </div>
          <div>
            <BarChart3 size={30} aria-hidden="true" />
            <h2>Результат описываем в управленческих терминах</h2>
            <p>
              Не «настроили CRM», а что стало проще контролировать: заявки, сроки, источники, статусы, обмены и работу команды.
            </p>
          </div>
        </div>
      </section>

      <LeadSection />
    </>
  );
}
