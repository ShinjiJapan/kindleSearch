import { BindableBase } from "../../BindableBase";

export default class extends BindableBase {
  public isOpen = false;
  public onClick = () => {
    this.isOpen = !this.isOpen;
    this.onPropertyChanged();
  };
}
