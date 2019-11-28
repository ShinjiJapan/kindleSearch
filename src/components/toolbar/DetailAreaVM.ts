import { BindableBase } from "../../BindableBase";

export default class extends BindableBase {
  public constructor() {
    super();
    this.isOpen = localStorage.getItem("IsOpenDetailArea") === "true";
  }

  public isOpen = false;
  public onClick = (): void => {
    this.isOpen = !this.isOpen;
    localStorage.setItem("IsOpenDetailArea", this.isOpen.toString());
    this.onPropertyChanged();
  };
}
