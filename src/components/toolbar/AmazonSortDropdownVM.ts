import { BindableBase } from "../../BindableBase";
import { IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { getCurrentRegion } from "../../config/RegionConfig";

export class AmazonSortDropdownVM extends BindableBase {
  public constructor() {
    super();
    const { sort } = getCurrentRegion().labels;
    this.options = [
      { key: "relevancerank", text: sort.relevancerank },
      { key: "date-desc-rank", text: sort["date-desc-rank"] },
      { key: "date-asc-rank", text: sort["date-asc-rank"] },
      { key: "review-rank", text: sort["review-rank"] },
    ];
    this.selectedKey = localStorage.getItem("AmazonSort") || "relevancerank";
  }

  public options: IDropdownOption[];

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
