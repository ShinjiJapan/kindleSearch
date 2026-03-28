import React from "react";
import { appVM } from "../../AppVM";
import { Checkbox } from "@fluentui/react/lib/Checkbox";
const UnlimitedOnlyCheckbox = (): React.ReactElement => {
  const viewModel = appVM.toolBarVM.unlimitedOnlyCheckboxVM;
  viewModel.useBind();
  return <Checkbox {...viewModel} />;
};

export default React.memo(UnlimitedOnlyCheckbox);
