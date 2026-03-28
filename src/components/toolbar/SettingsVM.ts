import { BindableBase } from "../../BindableBase";
import { SettingsModel, defaultSettings } from "./SettingsModel";

const STORAGE_KEY = "kindleSearch_settings";

export default class SettingsVM extends BindableBase {
  public isOpen = false;

  public globalMuteWords: string;
  public globalMuteAuthors: string;
  public defaultSort: string;
  public defaultCategory: string;
  public language: string;
  public region: string;

  private onApply: (settings: SettingsModel) => void;

  public constructor(onApply: (settings: SettingsModel) => void) {
    super();
    this.onApply = onApply;
    const saved = this.load();
    this.globalMuteWords = saved.globalMuteWords;
    this.globalMuteAuthors = saved.globalMuteAuthors;
    this.defaultSort = saved.defaultSort;
    this.defaultCategory = saved.defaultCategory;
    this.language = saved.language;
    this.region = saved.region;
  }

  public open = (): void => {
    this.isOpen = true;
    this.onPropertyChanged();
  };

  public close = (): void => {
    this.isOpen = false;
    this.onPropertyChanged();
  };

  public save = (): void => {
    const settings: SettingsModel = {
      globalMuteWords: this.globalMuteWords,
      globalMuteAuthors: this.globalMuteAuthors,
      defaultSort: this.defaultSort,
      defaultCategory: this.defaultCategory,
      language: this.language,
      region: this.region,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // 各VMが参照するlocalStorageキーにも反映
    localStorage.setItem("AmazonSort", this.defaultSort);
    localStorage.setItem("AmazonCategory", this.defaultCategory);
    this.onApply(settings);
    this.isOpen = false;
    this.onPropertyChanged();
  };

  public get parsedMuteWords(): string[] {
    return this.globalMuteWords
      .split("\n")
      .map((w) => w.trim().toLocaleLowerCase())
      .filter((w) => w);
  }

  public addMuteAuthor = (authorName: string): void => {
    const existing = this.parsedMuteAuthors;
    if (existing.includes(authorName.toLocaleLowerCase())) return;
    this.globalMuteAuthors = this.globalMuteAuthors
      ? this.globalMuteAuthors + "\n" + authorName
      : authorName;
    this.save();
  };

  public get parsedMuteAuthors(): string[] {
    return this.globalMuteAuthors
      .split("\n")
      .map((w) => w.trim().toLocaleLowerCase())
      .filter((w) => w);
  }

  private load(): SettingsModel {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return defaultSettings;
    try {
      return { ...defaultSettings, ...JSON.parse(json) };
    } catch {
      return defaultSettings;
    }
  }
}
