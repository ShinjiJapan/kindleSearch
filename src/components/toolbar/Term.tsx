import * as React from "react";
import { DatePicker } from "office-ui-fabric-react";
import { appVM } from "../../AppVM";

const Term = (props: { fromTo: "from" | "to" }) => {
  const viewModel =
    props.fromTo === "from"
      ? appVM.toolBarVM.fromDateVM
      : appVM.toolBarVM.toDateVM;
  viewModel.useBind();
  return <DatePicker {...viewModel} />;
};

export default React.memo(Term);
