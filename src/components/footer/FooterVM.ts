import { BindableBase } from "../../BindableBase";
import { appVM } from "../../AppVM";

export default class extends BindableBase {
  public get hasMorePage(): boolean {
    return appVM.toolBarVM.hasMorePage;
  }

  public get label(): string {
    return `結果をもっと表示 ${appVM.toolBarVM.logicalCurrentPage} / ${appVM.toolBarVM.logicalPageCount}`;
  }
}
