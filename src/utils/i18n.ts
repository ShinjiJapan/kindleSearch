declare const chrome: any;

// chrome.i18n が利用不可の場合のフォールバック（開発サーバー等）
import jaMessages from "../../public/_locales/ja/messages.json";

const fallback: Record<string, string> = Object.fromEntries(
  Object.entries(jaMessages).map(([k, v]) => [k, (v as any).message])
);

export function msg(key: string): string {
  const result = chrome?.i18n?.getMessage(key);
  if (result) return result;
  return fallback[key] ?? key;
}

export function getMonths(): string[] {
  return Array.from({ length: 12 }, (_, i) => msg(`month${i + 1}`));
}
