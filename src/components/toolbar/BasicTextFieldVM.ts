import { BindableBase } from "../../BindableBase";
import { ChangeEvent } from "react";

export class BasicTextFieldVM extends BindableBase {
  public constructor() {
    super();
  }
  public value = "";
  /** 検索ワードのbind用 */
  public onChange = (
    event?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    this.value = newValue || "";
    this.onPropertyChanged();
  };
}
