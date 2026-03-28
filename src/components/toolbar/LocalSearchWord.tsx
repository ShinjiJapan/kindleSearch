import React from "react";
import styled from "styled-components";
import { appVM } from "../../AppVM";
import { TextField } from "@fluentui/react/lib/TextField";
const LocalSearchWord = (): React.ReactElement => {
  const viewModel = appVM.toolBarVM.localSearchWordVM;
  viewModel.useBind();
  return <SearchTextField {...viewModel} />;
};

export default React.memo(LocalSearchWord);

const SearchTextField = styled(TextField)`
  margin-left: 10px;
  margin-right: 4px;
`;
