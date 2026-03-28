import { BindableBase } from "../../BindableBase";
import { appVM } from "../../AppVM";
import { getCurrentRegion } from "../../config/RegionConfig";

export default class extends BindableBase {
  public get hasMorePage(): boolean {
    return appVM.toolBarVM.hasMorePage;
  }

  public get label(): string {
    return `${getCurrentRegion().labels.moreResults} ${appVM.toolBarVM.logicalCurrentPage} / ${appVM.toolBarVM.logicalPageCount}`;
  }
}
