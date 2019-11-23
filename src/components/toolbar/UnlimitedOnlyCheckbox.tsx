import React from "react";
import { appVM } from "../../AppVM";
import { Checkbox } from "office-ui-fabric-react/lib/components/Checkbox/Checkbox";
const UnlimitedOnlyCheckbox = (): React.ReactElement => {
  const viewModel = appVM.toolBarVM.unlimitedOnlyCheckboxVM;
  viewModel.useBind();
  return <Checkbox {...viewModel} />;
};

export default React.memo(UnlimitedOnlyCheckbox);
