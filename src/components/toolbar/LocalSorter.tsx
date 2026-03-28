import React from "react";
import styled from "styled-components";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { appVM } from "../../AppVM";
const LocalSorter = (): React.ReactElement => {
  const viewModel = appVM.toolBarVM.localSorterVM;
  viewModel.useBind();
  return <SortDropDown {...viewModel} />;
};

export default React.memo(LocalSorter);

const SortDropDown = styled(Dropdown)`
  margin-right: 10px;
  width: 120px;
  text-align: left;
`;
