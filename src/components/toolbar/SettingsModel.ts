export interface SettingsModel {
  globalMuteWords: string;
  globalMuteAuthors: string;
  defaultSort: string;
  defaultCategory: string;
  region: string;
}

export const defaultSettings: SettingsModel = {
  globalMuteWords: "",
  globalMuteAuthors: "",
  defaultSort: "",
  defaultCategory: "",
  region: "JP",
};
