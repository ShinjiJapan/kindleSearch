import React from "react";
import styled from "styled-components";
import { Dropdown } from "office-ui-fabric-react/lib/components/Dropdown/Dropdown";
import { appVM } from "../../AppVM";
const LocalSorter = (): React.ReactElement => {
  const viewModel = appVM.searchPanelContentVM.localSorterVM;
  viewModel.useBind();
  return <SortDropDown {...viewModel} />;
};

export default React.memo(LocalSorter);

const SortDropDown = styled(Dropdown)`
  margin-right: 10px;
  width: 120px;
  text-align: left;
`;
