import { BindableBase } from "../../BindableBase";
import { getCurrentRegion } from "../../config/RegionConfig";

export class UnlimitedOnlyCheckboxVM extends BindableBase {
  public constructor() {
    super();
    this.checked = localStorage.getItem("isUnlimitedOnly") === "true";
  }

  public label = getCurrentRegion().labels.unlimitedOnly;
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
