import React from "react";
import styled from "styled-components";
import { appVM } from "../../AppVM";
import { SearchBox } from "office-ui-fabric-react/lib/components/SearchBox/SearchBox";
const AmazonSortDropdown = (): React.ReactElement => {
  const viewModel = appVM.searchPanelContentVM.amazonSearchWordVM;
  viewModel.useBind();
  return (
    <SearcBoxWrapper>
      <SearchBox {...viewModel} />
    </SearcBoxWrapper>
  );
};

export default React.memo(AmazonSortDropdown);

const SearcBoxWrapper = styled.div`
  padding-left: 4px;
`;
