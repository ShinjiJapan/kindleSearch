import { BindableBase } from "../../BindableBase";

export class ExecFilterTextFieldVM extends BindableBase {
  public constructor(private execFilter: () => void) {
    super();
  }
  public splitedWords: string[] = [];

  public value: string;
  public onChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    this.value = newValue || "";
    this.splitedWords = this.value
      .split(" ")
      .filter(x => x)
      .map(x => x.toLocaleLowerCase());
    this.onPropertyChanged();
    this.execFilter();
  };
}
