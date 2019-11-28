import { BindableBase } from "./BindableBase";
import ToolBarVM from "./components/toolbar/ToolBarVM";
import { BookItemModel } from "./components/bookItem/BookItemModel";
import FooterVM from "./components/footer/FooterVM";

export default class AppVM extends BindableBase {
  public onGetMorePageClicked = async (): Promise<void> => {
    await this.toolBarVM.readMorePageAsync();
    this.onPropertyChanged();
  };

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
  public footerVM: FooterVM = new FooterVM();
}
export const appVM: AppVM = new AppVM();
