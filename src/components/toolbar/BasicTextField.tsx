import React from "react";
import { TextField } from "office-ui-fabric-react";
import { BasicTextFieldVM } from "./BasicTextFieldVM";

const BasicTextField = (props: {
  viewModel: BasicTextFieldVM;
  className?: string;
}): React.ReactElement => {
  const { viewModel } = props;
  viewModel.useBind();
  return <TextField {...viewModel} className={props.className} />;
};

export default React.memo(BasicTextField);
