import { BindableBase } from "../../BindableBase";
import { IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { msg } from "../../utils/i18n";

export class AmazonSortDropdownVM extends BindableBase {
  public constructor() {
    super();
    this.options = [
      { key: "relevancerank", text: msg("sortRelevancerank") },
      { key: "date-desc-rank", text: msg("sortDateDescRank") },
      { key: "date-asc-rank", text: msg("sortDateAscRank") },
      { key: "review-rank", text: msg("sortReviewRank") },
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
