import { BindableBase } from "../../BindableBase";
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";

export class LocalSorterVM extends BindableBase {
  public constructor(private onSort: () => void) {
    super();
  }
  public options: IDropdownOption[] = [
    {
      key: "",
      text: "並び替え無し",
    },
    {
      key: "titleAsc",
      text: "作品名(昇順)",
    },
    {
      key: "titleDesc",
      text: "作品名(降順)",
    },
    {
      key: "authorAsc",
      text: "著者名(昇順)",
    },
    {
      key: "authorDesc",
      text: "著者名(降順)",
    },
  ];

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
