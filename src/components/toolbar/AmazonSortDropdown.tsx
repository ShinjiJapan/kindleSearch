import React from "react";
import styled from "styled-components";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { appVM } from "../../AppVM";
const AmazonSortDropdown = (): React.ReactElement => {
  const viewModel = appVM.toolBarVM.amazonSortDropdownVM;
  viewModel.useBind();
  return <SortDropDown {...viewModel} />;
};

export default React.memo(AmazonSortDropdown);

const SortDropDown = styled(Dropdown)`
  margin-right: 10px;
  margin-left: 10px;
  text-align: left;
`;
