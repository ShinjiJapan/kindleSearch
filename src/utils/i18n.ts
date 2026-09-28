declare const chrome: any;

// chrome.i18n が利用不可の場合のフォールバック（開発サーバー等）
import jaMessages from "../../public/_locales/ja/messages.json";
import enMessages from "../../public/_locales/en/messages.json";
import deMessages from "../../public/_locales/de/messages.json";

const lang = navigator.language;
const messages = lang.startsWith("ja")
  ? jaMessages
  : lang.startsWith("de")
    ? deMessages
    : enMessages;

const fallback: Record<string, string> = Object.fromEntries(
  Object.entries(messages).map(([k, v]) => [k, (v as any).message])
);

export function msg(key: string): string {
  const result = chrome?.i18n?.getMessage(key);
  if (result) return result;
  return fallback[key] ?? key;
}

export function getMonths(): string[] {
  return Array.from({ length: 12 }, (_, i) => msg(`month${i + 1}`));
}
