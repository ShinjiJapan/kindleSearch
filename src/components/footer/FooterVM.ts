import { BindableBase } from "../../BindableBase";
import { appVM } from "../../AppVM";
import { msg } from "../../utils/i18n";

export default class extends BindableBase {
  public get hasMorePage(): boolean {
    return appVM.toolBarVM.hasMorePage;
  }

  public get label(): string {
    return `${msg("moreResults")} ${appVM.toolBarVM.logicalCurrentPage} / ${appVM.toolBarVM.logicalPageCount}`;
  }
}
