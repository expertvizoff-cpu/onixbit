"use client";

import Image from "next/image";
import { useState } from "react";
import type { PointerEvent } from "react";
import type { DirectionId } from "@/data/site";

type Stage = {
  tab: string;
  label: string;
  title: string;
  copy: string;
  progress: number;
};

const sceneStages: Record<DirectionId, Stage[]> = {
  bitrix24: [
    {
      tab: "Новая",
      label: "Новая заявка",
      title: "Собираем входящие сделки",
      copy: "Заявки, звонки и формы сразу попадают в нужную воронку.",
      progress: 26,
    },
    {
      tab: "Подготовка",
      label: "Подготовка",
      title: "Настраиваем рабочие этапы",
      copy: "Менеджер видит следующий шаг, срок и ответственного по сделке.",
      progress: 52,
    },
    {
      tab: "Счёт",
      label: "Счёт и КП",
      title: "Автоматизируем счёт и КП",
      copy: "Роботы помогают создать документ, напомнить и перевести сделку дальше.",
      progress: 76,
    },
    {
      tab: "В работе",
      label: "В работе",
      title: "Контролируем сделку до оплаты",
      copy: "Воронка показывает зависшие сделки, результат и план следующего касания.",
      progress: 100,
    },
  ],
  sites: [
    {
      tab: "Сайты",
      label: "Сайты",
      title: "Работаем в админке 1С-Битрикс",
      copy: "Настраиваем структуру сайта, разделы и служебные параметры.",
      progress: 25,
    },
    {
      tab: "Добавить",
      label: "Создание",
      title: "Добавляем сайт или раздел",
      copy: "Готовим настройки, домен, папку, шаблон и языковые параметры.",
      progress: 50,
    },
    {
      tab: "Таблица",
      label: "Проверка",
      title: "Проверяем записи и активность",
      copy: "Администратор видит ID, сортировку, активность и название сайта.",
      progress: 75,
    },
    {
      tab: "Действия",
      label: "Действия",
      title: "Управляем действиями записи",
      copy: "Изменение, копирование и удаление доступны из стандартного меню.",
      progress: 100,
    },
  ],
  onec: [
    {
      tab: "Рабочий стол",
      label: "Рабочий стол",
      title: "Открываем рабочее место 1С",
      copy: "Проверяем разделы, доступы и начальную навигацию пользователя.",
      progress: 25,
    },
    {
      tab: "Документы",
      label: "Документы",
      title: "Настраиваем документы и файлы",
      copy: "Формы, папки, реквизиты и маршруты приводятся к единому порядку.",
      progress: 50,
    },
    {
      tab: "Задачи",
      label: "Задачи",
      title: "Собираем процессы и задачи",
      copy: "Пользователь видит свои действия, сроки и ответственных без лишних окон.",
      progress: 75,
    },
    {
      tab: "Настройки",
      label: "Настройки",
      title: "Закрепляем права и настройки",
      copy: "Роли, регламенты и обмены фиксируются в понятной рабочей схеме.",
      progress: 100,
    },
  ],
};

const sceneMeta: Record<DirectionId, { chrome: string; label: string; aria: string }> = {
  bitrix24: {
    chrome: "CRM Битрикс24",
    label: "Интерфейс CRM Битрикс24",
    aria: "Настройка воронки продаж Битрикс24",
  },
  sites: {
    chrome: "1С-Битрикс: Управление сайтом",
    label: "Административный интерфейс 1С-Битрикс",
    aria: "Админка 1С-Битрикс Список сайтов",
  },
  onec: {
    chrome: "1С:Предприятие",
    label: "Интерфейс 1С:Предприятие",
    aria: "Окно 1С:Предприятие Документооборот",
  },
};

function setButtonState(index: number, active: number, baseClass: string) {
  return [baseClass, index <= active ? "is-active" : "", index === active ? "is-current" : ""]
    .filter(Boolean)
    .join(" ");
}

export function ProductScene({ type }: { type: DirectionId }) {
  const [active, setActive] = useState(0);
  const stages = sceneStages[type];
  const safeActive = Math.min(active, stages.length - 1);
  const stage = stages[safeActive];
  const meta = sceneMeta[type];

  function setSceneStage(index: number) {
    setActive(Math.max(0, Math.min(index, stages.length - 1)));
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--ob-product-x", (x * 20).toFixed(2) + "px");
    event.currentTarget.style.setProperty("--ob-product-y", (y * 16).toFixed(2) + "px");
  }

  function resetPointer(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--ob-product-x", "0px");
    event.currentTarget.style.setProperty("--ob-product-y", "0px");
  }

  return (
    <div
      className={"ob-product-scene ob-product-scene--" + type}
      aria-label={meta.label}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="ob-product-desk">
        <div className="ob-product-chrome">
          <span />
          <span />
          <span />
          <strong>{meta.chrome}</strong>
        </div>
        <div className="ob-product-canvas">
          <div className="ob-product-frame" aria-label={meta.aria}>
            {type === "bitrix24" && (
              <Bitrix24Workspace active={safeActive} setActive={setSceneStage} />
            )}
            {type === "sites" && (
              <BitrixWorkspace active={safeActive} setActive={setSceneStage} />
            )}
            {type === "onec" && (
              <OneCWorkspace active={safeActive} setActive={setSceneStage} />
            )}
          </div>
        </div>
      </div>

      <div className="ob-product-status" aria-live="polite">
        <span>{stage.label}</span>
        <strong>{stage.title}</strong>
        <p>{stage.copy}</p>
        <div className="ob-product-progress">
          <i style={{ width: stage.progress + "%" }} />
        </div>
      </div>

      <div className="ob-product-controls" role="tablist" aria-label="Состояния интерактива">
        {stages.map((item, index) => (
          <button
            className={index === safeActive ? "is-active" : ""}
            key={item.tab}
            onClick={() => setSceneStage(index)}
            onFocus={() => setSceneStage(index)}
            onMouseEnter={() => setSceneStage(index)}
            role="tab"
            aria-selected={index === safeActive}
            type="button"
          >
            {item.tab}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bitrix24Workspace({ active, setActive }: { active: number; setActive: (index: number) => void }) {
  return (
    <div className="obc-product-ui obc-product-ui--b24">
      <div className="obc-product-topbar obc-b24-topbar">
        <Image src="/media/logos/bitrix24-logo.svg" alt="Битрикс24" width={118} height={22} style={{ height: "auto" }} />
        <strong>CRM</strong>
        <span>Сделки</span>
        <button type="button">Расширения</button>
      </div>
      <div className="obc-b24-page">
        <div className="obc-b24-title">
          <strong>Воронки продаж: Сделки</strong>
          <span>Настройки стадий</span>
        </div>
        <div className="obc-b24-funnels">
          <div className="obc-b24-row obc-b24-row--muted">
            <span>Общая</span><i>Новая</i><i>Подготовка</i><i>Счёт</i><i>В работе</i><i>Финал</i><em>Успех</em>
          </div>
          <div className="obc-b24-row">
            <span>Продажи</span>
            {["Новая", "Подготовка", "Счёт на пред.", "В работе"].map((label, index) => (
              <button
                className={setButtonState(index, active, index === 2 ? "obc-b24-stage obc-b24-stage--cyan" : index === 3 ? "obc-b24-stage obc-b24-stage--green" : "obc-b24-stage")}
                key={label}
                onClick={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
                type="button"
              >
                {label}
              </button>
            ))}
            <i className="obc-b24-stage--orange">Финал</i><em>Успех</em>
          </div>
          <div className="obc-b24-row obc-b24-row--muted">
            <span>Сервис</span><i>Обращение</i><i>Диагностика</i><i>КП</i><i>Оплата</i><i>Закрыто</i><em>Успех</em>
          </div>
        </div>
        <div className="obc-b24-card">
          <strong>Карточка сделки</strong>
          <span>дело, комментарий, задача, история</span>
          <button type="button">что нужно сделать</button>
        </div>
      </div>
    </div>
  );
}

function BitrixWorkspace({ active, setActive }: { active: number; setActive: (index: number) => void }) {
  return (
    <div className="obc-product-ui obc-product-ui--cms">
      <div className="obc-cms-topbar">
        <strong>Администрирование</strong>
        <label>поиск...</label>
        <span>Администратор сайта</span>
        <Image src="/media/logos/1c-bitrix-logo.svg" alt="1С-Битрикс" width={84} height={17} style={{ height: "auto" }} />
      </div>
      <div className="obc-cms-body">
        <aside className="obc-cms-sidebar">
          <span>Избранное</span>
          <button className={setButtonState(0, active, "")} onClick={() => setActive(0)} onMouseEnter={() => setActive(0)} type="button">Сайты</button>
          <span>Пользователи</span><span>Поиск</span><span>Проактивная защита</span><span>Настройка HTTPS</span><span>Локализация</span>
        </aside>
        <div className="obc-cms-main">
          <div className="obc-cms-crumbs">Рабочий стол › Настройки › Настройки продукта › Сайты</div>
          <div className="obc-cms-title"><strong>Список сайтов</strong><i aria-hidden="true" /></div>
          <button className={setButtonState(1, active, "obc-cms-add")} onClick={() => setActive(1)} onMouseEnter={() => setActive(1)} type="button">+ Добавить сайт</button>
          <div className="obc-cms-table">
            <div className="obc-cms-head"><span /><span>ID</span><span>Акт.</span><span>Сортировка</span><span>Название</span></div>
            <button className={setButtonState(2, active, "obc-cms-row is-active")} onClick={() => setActive(2)} onMouseEnter={() => setActive(2)} type="button"><span aria-hidden="true" /><strong>s1</strong><em>Да</em><b>1</b><i>Корпоративный сайт</i></button>
            <button className="obc-cms-row" type="button"><span aria-hidden="true" /><strong>ct</strong><em>Да</em><b>100</b><i>Каталог услуг</i></button>
          </div>
          <button className={setButtonState(3, active, "obc-cms-menu")} onClick={() => setActive(3)} onMouseEnter={() => setActive(3)} type="button"><span>Изменить</span><span>Копировать</span><strong>Удалить</strong></button>
        </div>
      </div>
    </div>
  );
}

function OneCWorkspace({ active, setActive }: { active: number; setActive: (index: number) => void }) {
  const ribbon = ["Рабочий стол", "Документы и файлы", "Задачи и процессы", "Настройки"];
  return (
    <div className="obc-product-ui obc-product-ui--onec">
      <div className="obc-onec-titlebar">
        <Image src="/media/logos/1c-logo-small.svg" alt="1С" width={22} height={11} style={{ height: "auto" }} />
        <strong>Рабочая база / Администратор</strong>
        <span>1С:Предприятие</span>
      </div>
      <div className="obc-onec-ribbon">
        {ribbon.map((item, index) => (
          <button className={setButtonState(index, active, "")} key={item} onClick={() => setActive(index)} onMouseEnter={() => setActive(index)} type="button"><b aria-hidden="true" /><span>{item}</span></button>
        ))}
      </div>
      <div className="obc-onec-workspace">
        <aside className="obc-onec-left"><strong>Документы</strong><span>Входящие документы</span><span>Исходящие документы</span><em>Внутренние документы</em><span>Файлы</span><span>Мои задачи</span><span>Списки рассылки</span></aside>
        <div className="obc-onec-main"><div className="obc-onec-tabs"><span>Внутренние документы</span><span>Регистрация</span><span>Резолюции</span><span>Связи</span></div><div className="obc-onec-tools"><button>Создать</button><button>Найти</button><button>Печать</button></div><div className="obc-onec-content"><div className="obc-onec-tree"><strong>Папки</strong><span>Бухгалтерия</span><span>Информационно-справочные</span><em>Секретариат</em><span>Производство</span></div><div className="obc-onec-list"><strong>Наименование</strong><span>Порядок регистрации телефонных звонков</span><span>Договор поставки материалов</span><span>Акт оказания услуг</span></div></div></div>
      </div>
    </div>
  );
}
