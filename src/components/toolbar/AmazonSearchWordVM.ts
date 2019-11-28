import { BindableBase } from "../../BindableBase";
import { ChangeEvent } from "react";

export class AmazonSearchWordVM extends BindableBase {
  public constructor(private execSearch: () => void) {
    super();
  }
  public value = "";
  /** 検索ワードのbind用 */
  public onChange = (
    event?: ChangeEvent<HTMLInputElement>,
    newValue?: string
  ): void => {
    this.value = newValue || "";
    this.onPropertyChanged();
  };
  public onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.charCode !== 13) return;
    this.execSearch();
  };
}
