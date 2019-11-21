import React from "react";

const useOnPropertyChanged = (): { onPropertyChanged: () => void } => {
  const [toggle, changeToggle] = React.useState(false);
  const onPropertyChanged = (): void => {
    changeToggle(!toggle);
  };
  return { onPropertyChanged: onPropertyChanged };
};

export class BindableBase {
  public effect: { onPropertyChanged: () => void };

  public onPropertyChanged(): void {
    if (!this.effect) {
      return;
    }
    this.effect.onPropertyChanged();
  }

  public useBind = () => {
    this.effect = useOnPropertyChanged();
  };
}
