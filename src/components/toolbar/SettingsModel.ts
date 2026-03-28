export interface SettingsModel {
  globalMuteWords: string;
  globalMuteAuthors: string;
  defaultSort: string;
  defaultCategory: string;
  language: string;
  region: string;
}

export const defaultSettings: SettingsModel = {
  globalMuteWords: "",
  globalMuteAuthors: "",
  defaultSort: "",
  defaultCategory: "",
  language: "ja",
  region: "JP",
};
