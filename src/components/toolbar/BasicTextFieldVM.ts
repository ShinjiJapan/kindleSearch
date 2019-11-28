import { BindableBase } from "../../BindableBase";

export class BasicTextFieldVM extends BindableBase {
  public constructor(private execSearch: () => void) {
    super();
  }
  public value = "";
  /** 検索ワードのbind用 */
  public onChange = (
    event?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
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
