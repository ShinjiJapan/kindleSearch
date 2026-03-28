import { BindableBase } from "../../BindableBase";
import { IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { getCurrentRegion } from "../../config/RegionConfig";

export class LocalSorterVM extends BindableBase {
  public constructor(private onSort: () => void) {
    super();
    const { localSort } = getCurrentRegion().labels;
    this.options = [
      { key: "", text: localSort.none },
      { key: "titleAsc", text: localSort.titleAsc },
      { key: "titleDesc", text: localSort.titleDesc },
      { key: "authorAsc", text: localSort.authorAsc },
      { key: "authorDesc", text: localSort.authorDesc },
    ];
  }
  public options: IDropdownOption[];

  public selectedKey = "";
  public onChange = (
    evt?: React.FormEvent<HTMLElement | HTMLInputElement>,
    option?: IDropdownOption
  ): void => {
    this.selectedKey = option!.key.toString();
    this.onPropertyChanged();
    this.onSort();
  };
}
