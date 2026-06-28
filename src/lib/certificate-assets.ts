import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import type { CertificateAsset, CertificateDashboard, CertificateGroup, CertificateGroupId } from "@/types/certificates";

type GeneratedPreview = {
  source: string;
  preview: string;
  width: number;
  height: number;
  redactedValidity: boolean;
};

const certificateRoot = join(process.cwd(), "public/media/certificates");
const generatedManifestPath = join(certificateRoot, "_generated/manifest.json");

type RealCertificateGroup = CertificateGroup & { id: Exclude<CertificateGroupId, "all"> };

const groups: RealCertificateGroup[] = [
  {
    id: "bitrix24-status",
    area: "bitrix24",
    title: "Битрикс24: сертификаты",
    shortTitle: "Битрикс24",
    folder: "Битрикс24 сертификаты",
    description: "Партнёрские статусы, качество внедрений и базовые подтверждения работы с платформой.",
  },
  {
    id: "bitrix24-competency",
    area: "bitrix24",
    title: "Битрикс24: компетенции",
    shortTitle: "Компетенции CRM",
    folder: "Битрикс24 компетенции",
    description: "CRM, бизнес-процессы, коробочная версия и интеграции как рабочие зоны внедрения.",
  },
  {
    id: "bitrix24-extra",
    area: "bitrix24",
    title: "Дополнительно для Битрикс24",
    shortTitle: "Мессенджеры",
    folder: "Дополнительно для Битрикс24",
    description: "Wazzup и ChatApp усиливают коммуникации, открытые линии и мессенджеры внутри CRM.",
  },
  {
    id: "bitrix-status",
    area: "bitrix",
    title: "1С-Битрикс: сертификаты",
    shortTitle: "1С-Битрикс",
    folder: "1С-Битрикс сертификаты",
    description: "Партнёрский контур для сайтов, каталогов и интернет-магазинов на 1С-Битрикс.",
  },
  {
    id: "bitrix-competency",
    area: "bitrix",
    title: "1С-Битрикс: компетенции",
    shortTitle: "Компетенции сайтов",
    folder: "1С-Битрикс компетенции",
    description: "Композитный сайт и интеграция с 1С для производительных и связанных веб-проектов.",
  },
  {
    id: "bitrix-extra",
    area: "bitrix",
    title: "Дополнительно для 1С-Битрикс",
    shortTitle: "Шаблоны и решения",
    folder: "Дополнительно для 1С-Битрикс",
    description: "АСПРО и КОНЦЕПТ как партнёрские решения для быстрых и поддерживаемых сайтов.",
  },
  {
    id: "onec",
    area: "onec",
    title: "1С и облачная инфраструктура",
    shortTitle: "1С",
    folder: "1С",
    description: "Scloud усиливает 1С-направление и задачи вокруг учёта, обменов и облачной базы.",
  },
  {
    id: "training",
    area: "training",
    title: "Обучение основателя",
    shortTitle: "Обучение",
    folder: "Обучение основателя",
    description: "Курсы Битрикс24 показывают, что экспертиза регулярно пополняется практикой платформы.",
  },
];

const groupByFolder = new Map(groups.map((group) => [group.folder, group]));

function readManifest() {
  if (!existsSync(generatedManifestPath)) {
    return {} as Record<string, GeneratedPreview>;
  }

  return JSON.parse(readFileSync(generatedManifestPath, "utf8")) as Record<string, GeneratedPreview>;
}

function publicPath(file: string) {
  return `/media/certificates/${relative(certificateRoot, file).split(/[\\/]/).map(encodeURIComponent).join("/")}`;
}

function cleanTitle(fileName: string) {
  return fileName
    .replace(/\.(pdf|png|jpe?g|webp)$/i, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function assetType(title: string, group: CertificateGroup) {
  if (/Wazzup/i.test(title)) return "Wazzup";
  if (/ChatApp/i.test(title)) return "ChatApp";
  if (/АСПРО|ASPRO/i.test(title)) return "ASPRO";
  if (/Концепт/i.test(title)) return "КОНЦЕПТ";
  if (/Scloud/i.test(title)) return "Scloud";
  if (/CRM/i.test(title)) return "CRM";
  if (/Бизнес-процес/i.test(title)) return "Процессы";
  if (/Интеграци/i.test(title)) return "Интеграции";
  if (/Композит/i.test(title)) return "Скорость";
  if (/Коробоч/i.test(title)) return "Коробка";
  if (/партн|сертифицирован/i.test(title)) return "Партнёр";
  if (group.id === "training") return "Курс";

  return group.shortTitle;
}

function assetText(title: string, group: CertificateGroup) {
  if (/Wazzup/i.test(title)) return "Партнёрское подтверждение для подключения мессенджеров к Битрикс24.";
  if (/ChatApp/i.test(title)) return "Сертификат по омниканальным коммуникациям и интеграциям ChatApp с CRM.";
  if (/АСПРО|ASPRO/i.test(title)) return "Партнёрство по готовым решениям и шаблонам для сайтов на 1С-Битрикс.";
  if (/Концепт/i.test(title)) return "Партнёрство по шаблонным решениям для сайта, каталога и e-commerce.";
  if (/Scloud/i.test(title)) return "Партнёрский контур для задач 1С и облачной инфраструктуры.";
  if (/обуч|курс|CRM|маркетинг|аналитик|продаж|No-code|сервис/i.test(title) && group.id === "training") {
    return "Сертификат обучения основателя: практическое знание сценариев Битрикс24.";
  }

  return group.description;
}

function listFiles(group: RealCertificateGroup, manifest: Record<string, GeneratedPreview>) {
  const dir = join(certificateRoot, group.folder);

  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((name) => /\.(pdf|png|jpe?g|webp)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, "ru"))
    .map((name) => {
      const file = join(dir, name);
      const source = publicPath(file);
      const generated = manifest[source];
      const title = cleanTitle(name);
      const kind = /\.pdf$/i.test(name) ? "pdf" : "image";

      return {
        id: `${group.id}-${name}`,
        title,
        source,
        preview: generated?.preview ?? source,
        group: group.id,
        area: group.area,
        folder: group.folder,
        kind,
        type: assetType(title, group),
        text: assetText(title, group),
        width: generated?.width ?? 1200,
        height: generated?.height ?? (group.id.includes("status") || group.id === "onec" ? 850 : 1600),
        redactedValidity: generated?.redactedValidity,
      } satisfies CertificateAsset;
    });
}

function itemWeight(item: CertificateAsset) {
  const title = item.title.toLowerCase();
  if (title.includes("золотой")) return 0;
  if (title.includes("scloud")) return 1;
  if (title.includes("wazzup")) return 2;
  if (title.includes("aspro") || title.includes("аспро")) return 3;
  if (title.includes("crm")) return 4;
  if (title.includes("интеграци")) return 5;
  if (title.includes("бизнес-процес")) return 6;
  if (title.includes("базовый курс")) return 7;
  return 20;
}

export function getCertificateDashboard(): CertificateDashboard {
  const manifest = readManifest();
  const items = groups
    .flatMap((group) => listFiles(group, manifest))
    .sort((a, b) => itemWeight(a) - itemWeight(b) || a.title.localeCompare(b.title, "ru"));

  const stats = {
    total: items.length,
    bitrix24: items.filter((item) => item.area === "bitrix24").length,
    bitrix: items.filter((item) => item.area === "bitrix").length,
    onec: items.filter((item) => item.area === "onec").length,
    training: items.filter((item) => item.area === "training").length,
    maskedPreviews: items.filter((item) => item.redactedValidity).length,
  };

  return {
    groups: [...groupByFolder.values()],
    items,
    stats,
  };
}
