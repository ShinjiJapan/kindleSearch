import { BindableBase } from "./BindableBase";
import ToolBarVM from "./components/toolbar/ToolBarVM";
import { BookItemModel } from "./components/bookItem/BookItemModel";

export default class AppVM extends BindableBase {
  private delay = (msec: number) =>
    new Promise(resolve => setTimeout(resolve, msec));

  public onGetMorePageClicked = async () => {
    await this.toolBarVM.getMorePageAsync();
    this.onPropertyChanged();
  };

  public get pagenation(): string {
    return (
      this.toolBarVM.virtualCurrentPage +
      " / " +
      this.toolBarVM.virtualPageCount
    );
  }

  public get pageCount(): number {
    return this.toolBarVM.pageCount;
  }

  public set pageCount(val: number) {
    this.toolBarVM.pageCount = val;
  }

  public get hasMorePage(): boolean {
    return this.toolBarVM.hasMorePage;
  }

  public get filteredBooks(): BookItemModel[] {
    return this.toolBarVM.filteredBooks;
  }

  public get isProgress(): boolean {
    return this.toolBarVM.isProgress;
  }

  public toolBarVM: ToolBarVM = new ToolBarVM();
}
export const appVM: AppVM = new AppVM();
