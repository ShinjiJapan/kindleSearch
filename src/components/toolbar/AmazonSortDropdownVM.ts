import { BindableBase } from "../../BindableBase";
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";

export class AmazonSortDropdownVM extends BindableBase {
  public constructor() {
    super();
    this.selectedKey = localStorage.getItem("AmazonSort") || "relevancerank";
  }

  public options: IDropdownOption[] = [
    {
      key: "relevancerank",
      text: "アマゾンおすすめ商品",
    },
    {
      key: "date-desc-rank",
      text: "出版年月が新しい順番",
    },
    {
      key: "date-asc-rank",
      text: "出版年月が古い順番",
    },
    {
      key: "review-rank",
      text: "レビューの評価順",
    },
  ];

  public selectedKey = "";
  public onChange = (
    evt?: React.FormEvent<HTMLElement | HTMLInputElement>,
    option?: IDropdownOption
  ): void => {
    this.selectedKey = option!.key.toString();
    localStorage.setItem("AmazonSort", this.selectedKey);
    this.onPropertyChanged();
  };
}
