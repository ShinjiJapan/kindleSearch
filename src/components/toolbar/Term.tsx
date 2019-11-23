import * as React from "react";
import { DatePicker } from "office-ui-fabric-react";
import { appVM } from "../../AppVM";

export default (props: { fromTo: "from" | "to" }) => {
  const viewModel =
    props.fromTo === "from"
      ? appVM.searchPanelContentVM.fromDateVM
      : appVM.searchPanelContentVM.toDateVM;
  viewModel.useBind();
  return <DatePicker {...viewModel} />;
};
