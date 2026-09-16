// Verified from original documents and the corresponding vendor profiles on 2026-09-16.
export const partnerProof = {
  checkedOn: "16.09.2026",
  bitrix24: {
    label: "Золотой партнёр Битрикс24",
    profile: "https://www.bitrix24.ru/partners/partner/10553488/",
    image: "/media/certificates/Битрикс24 сертификаты/bitrix24-gold-partner-2026-11-01.png",
    validUntil: "01.11.2026",
  },
  bitrix: {
    label: "Сертифицированный партнёр 1С-Битрикс",
    profile: "https://www.1c-bitrix.ru/partners/10553488.php",
    image: "/media/certificates/_generated/original-94c2f2f3259d0c68.webp",
    source: "/media/certificates/1С-Битрикс сертификаты/Сертификат сертифицированного партнёра 1С-Битрикс.pdf",
    validUntil: "08.04.2027",
  },
} as const;

export const certificateFacts: Record<string, { title?: string; validityNote: string; archived: boolean }> = {
  "Битрикс24 сертификаты/bitrix24-gold-partner-2026-11-01.png": {
    title: "Золотой партнёр Битрикс24",
    validityNote: "Срок документа: 27.12.2024 — 01.11.2026. Статус проверен 16.09.2026.",
    archived: false,
  },
  "Битрикс24 сертификаты/Золотой партнёр Битрикс24.jpg": {
    title: "Золотой партнёр Битрикс24 — архив",
    validityNote: "Архивный документ: срок завершился 01.08.2026. Актуальный сертификат размещён выше.",
    archived: true,
  },
  "1С-Битрикс сертификаты/Золотой партнёр 1С-Битрикс.jpg": {
    title: "Золотой партнёр 1С-Битрикс — архив",
    validityNote: "Архивный документ: 27.03.2023 — 27.03.2024. Не подтверждает текущий статус.",
    archived: true,
  },
  "1С-Битрикс сертификаты/Сертификат сертифицированного партнёра 1С-Битрикс.pdf": {
    title: "Сертифицированный партнёр 1С-Битрикс",
    validityNote: "Срок документа: 08.04.2026 — 08.04.2027. Статус проверен 16.09.2026.",
    archived: false,
  },
  "1С-Битрикс компетенции/Компетенция интеграция с 1С.pdf": {
    validityNote: "Архивный документ: 24.03.2023 — 24.03.2024. Текущую компетенцию проверяйте у вендора.",
    archived: true,
  },
  "1С-Битрикс компетенции/Компетенция Композитный сайт.pdf": {
    validityNote: "Архивный документ: 18.04.2022 — 18.04.2023. Текущую компетенцию проверяйте у вендора.",
    archived: true,
  },
};
