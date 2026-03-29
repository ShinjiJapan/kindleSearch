import { BindableBase } from "../../BindableBase";
import { IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { msg } from "../../utils/i18n";

export class LocalSorterVM extends BindableBase {
  public constructor(private onSort: () => void) {
    super();
    this.options = [
      { key: "", text: msg("localSortNone") },
      { key: "titleAsc", text: msg("localSortTitleAsc") },
      { key: "titleDesc", text: msg("localSortTitleDesc") },
      { key: "authorAsc", text: msg("localSortAuthorAsc") },
      { key: "authorDesc", text: msg("localSortAuthorDesc") },
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
