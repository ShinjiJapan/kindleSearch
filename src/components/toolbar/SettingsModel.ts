export interface SettingsModel {
  globalMuteWords: string;
  globalMuteAuthors: string;
  defaultSort: string;
  defaultCategory: string;
}

export const defaultSettings: SettingsModel = {
  globalMuteWords: "",
  globalMuteAuthors: "",
  defaultSort: "relevancerank",
  defaultCategory: "2250738051",
};
