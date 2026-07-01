import type { KnowledgeArticle } from "./articles";

type ArticleVisual = {
  src: string;
  alt: string;
  caption: string;
};

const fallbackVisual: ArticleVisual = {
  src: "/media/articles/bitrix24-surface-audit.svg",
  alt: "Рабочая схема проверки внедрения Битрикс24: заявка, сделка, задача и отчет",
  caption: "Рабочая схема для статьи: что проверить в заявке, сделке, задаче и отчете.",
};

export const articleVisuals: Record<string, ArticleVisual> = {
  "poverhnostnoe-vnedrenie-bitrix24": {
    src: "/media/articles/bitrix24-surface-audit.svg",
    alt: "Рабочая схема аудита внедрения Битрикс24 с проверками заявок, сделок, задач и отчетов",
    caption: "Карта быстрой диагностики: где руководителю проверить, что CRM стала системой управления, а не витриной настроек.",
  },
  "lidy-sdelki-kontakty-kompanii-bitrix24": {
    src: "/media/articles/crm-entities-map.svg",
    alt: "Схема различий между лидом, сделкой, контактом и компанией в CRM Битрикс24",
    caption: "Визуальная карта сущностей CRM: что является человеком, что продажей, а что организацией.",
  },
  "obrabotat-zayavku-s-saita-v-bitrix24": {
    src: "/media/articles/website-request-route.svg",
    alt: "Маршрут заявки с сайта в Битрикс24: форма, источник, CRM-карточка, ответственный и первое действие",
    caption: "Путь заявки от формы до первого действия менеджера: источник, карточка CRM, ответственный и контроль реакции.",
  },
  "menedzher-ne-vidit-sdelku-bitrix24": {
    src: "/media/articles/crm-access-diagnostics.svg",
    alt: "Диагностика доступа к сделке в Битрикс24: фильтр, направление, ответственный и права CRM",
    caption: "Чек-лист видимости сделки: сначала фильтры и направление, потом роли и матрица доступа.",
  },
  "sozdat-zadachu-i-otvetstvennost-bitrix24": {
    src: "/media/articles/task-responsibility.svg",
    alt: "Пример управляемой задачи в Битрикс24 с ответственным, сроком, результатом и связью с CRM",
    caption: "Каркас хорошей задачи: один ответственный, срок, понятный результат и связь с клиентским процессом.",
  },
  "roboty-v-sdelkah-bitrix24": {
    src: "/media/articles/deal-robots.svg",
    alt: "Схема роботов в сделках Битрикс24: стадия, условие, действие и контроль результата",
    caption: "Как смотреть на роботов: не как на магию, а как на правило, условие, действие и проверяемый результат.",
  },
  "sait-crm-1c-istochnik-istiny": {
    src: "/media/articles/crm-1c-source-of-truth.svg",
    alt: "Карта источника истины между сайтом, CRM Битрикс24 и 1С",
    caption: "Интеграционная карта: где хранится клиент, заказ, товар, остаток, статус и кто отвечает за изменение данных.",
  },
};

export function getArticleVisual(article: Pick<KnowledgeArticle, "slug">) {
  return articleVisuals[article.slug] ?? fallbackVisual;
}
