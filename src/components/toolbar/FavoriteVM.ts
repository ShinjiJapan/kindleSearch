import { BindableBase } from "../../BindableBase";
import { FavoriteModel } from "./FavoriteModel";

const STORAGE_KEY = "kindleSearch_favorites";

export default class FavoriteVM extends BindableBase {
  public isOpen = false;
  public favorites: FavoriteModel[] = [];

  public constructor(
    private saveCurrent: () => FavoriteModel,
    private restore: (fav: FavoriteModel) => void,
    private execSearch: () => void
  ) {
    super();
    this.favorites = this.load();
  }

  public toggleOpen = (): void => {
    this.isOpen = !this.isOpen;
    this.onPropertyChanged();
  };

  public close = (): void => {
    this.isOpen = false;
    this.onPropertyChanged();
  };

  public add = (name: string): void => {
    const fav = this.saveCurrent();
    fav.name = name;
    this.favorites.push(fav);
    this.save();
    this.onPropertyChanged();
  };

  public select = (index: number): void => {
    const fav = this.favorites[index];
    if (!fav) return;
    this.restore(fav);
    this.isOpen = false;
    this.onPropertyChanged();
    this.execSearch();
  };

  public remove = (index: number): void => {
    this.favorites.splice(index, 1);
    this.save();
    this.onPropertyChanged();
  };

  private load(): FavoriteModel[] {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.favorites));
  }
}
