import { BindableBase } from "../../BindableBase";
import { msg } from "../../utils/i18n";

export class UnlimitedOnlyCheckboxVM extends BindableBase {
  public constructor() {
    super();
    this.checked = localStorage.getItem("isUnlimitedOnly") === "true";
  }

  public label = msg("unlimitedOnly");
  public checked = false;

  public onChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ): void => {
    this.checked = checked === true;
    localStorage.setItem("isUnlimitedOnly", this.checked.toString());
    this.onPropertyChanged();
  };
}
