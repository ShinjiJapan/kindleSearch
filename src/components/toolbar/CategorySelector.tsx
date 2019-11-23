import React from "react";
import { appVM } from "../../AppVM";
import { Dropdown } from "office-ui-fabric-react/lib/index";
import styled from "styled-components";

const CategorySelector = (): React.ReactElement => {
  const viewModel = appVM.toolBarVM.categorySelectorVM;
  viewModel.useBind();
  return <CategoryDropdown {...viewModel} />;
};

export default React.memo(CategorySelector);

const CategoryDropdown = styled(Dropdown)`
  width: 146px;
`;
