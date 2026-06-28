export type CertificateArea = "bitrix24" | "bitrix" | "onec" | "training";

export type CertificateGroupId =
  | "all"
  | "bitrix24-status"
  | "bitrix24-competency"
  | "bitrix24-extra"
  | "bitrix-status"
  | "bitrix-competency"
  | "bitrix-extra"
  | "onec"
  | "training";

export type CertificateGroup = {
  id: CertificateGroupId;
  area: CertificateArea;
  title: string;
  shortTitle: string;
  folder: string;
  description: string;
};

export type CertificateAsset = {
  id: string;
  title: string;
  source: string;
  preview: string;
  group: Exclude<CertificateGroupId, "all">;
  area: CertificateArea;
  folder: string;
  kind: "image" | "pdf";
  type: string;
  text: string;
  width: number;
  height: number;
  redactedValidity?: boolean;
};

export type CertificateDashboard = {
  groups: CertificateGroup[];
  items: CertificateAsset[];
  stats: {
    total: number;
    bitrix24: number;
    bitrix: number;
    onec: number;
    training: number;
    maskedPreviews: number;
  };
};
