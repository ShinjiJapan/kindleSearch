import { BindableBase } from "./BindableBase";
import ToolBarVM from "./components/toolbar/ToolBarVM";
import { BookItemModel } from "./components/bookItem/BookItemModel";

export default class AppVM extends BindableBase {
  private delay = (msec: number) =>
    new Promise(resolve => setTimeout(resolve, msec));

  public onGetMorePageClicked = async () => {
    await this.searchPanelContentVM.getMorePageAsync();
    this.onPropertyChanged();
  };

  public get pagenation(): string {
    return (
      this.searchPanelContentVM.virtualCurrentPage +
      " / " +
      this.searchPanelContentVM.virtualPageCount
    );
  }

  public get pageCount(): number {
    return this.searchPanelContentVM.pageCount;
  }

  public set pageCount(val: number) {
    this.searchPanelContentVM.pageCount = val;
  }

  public get hasMorePage(): boolean {
    return this.searchPanelContentVM.hasMorePage;
  }

  public get filteredBooks(): BookItemModel[] {
    return this.searchPanelContentVM.filteredBooks;
  }

  public get isProgress(): boolean {
    return this.searchPanelContentVM.isProgress;
  }

  public searchPanelContentVM: ToolBarVM = new ToolBarVM();
}
export const appVM: AppVM = new AppVM();
