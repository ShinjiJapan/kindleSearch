import React from "react";
import { IconButton } from "office-ui-fabric-react";
import styled from "styled-components";
import BasicTextField from "./BasicTextField";
import { appVM } from "../../AppVM";

export default () => {
  const viewModel = appVM.toolBarVM.detailAreaVM;
  viewModel.useBind();
  return (
    <div>
      {viewModel.isOpen ? (
        <Root>
          <IconButton
            iconProps={{ iconName: "SkypeCircleMinus" }}
            onClick={viewModel.onClick}
          />
          <AdditionalLabel>著者</AdditionalLabel>
          <BasicTextField viewModel={appVM.toolBarVM.SearchAuthorVM} />
          <AdditionalLabel>価格</AdditionalLabel>
          <RightTextField viewModel={appVM.toolBarVM.MinPriceVM} />
          <span>～</span>
          <RightTextField viewModel={appVM.toolBarVM.MaxPriceVM} />
        </Root>
      ) : (
        <IconButton
          iconProps={{ iconName: "CirclePlus" }}
          onClick={viewModel.onClick}
        />
      )}
    </div>
  );
};

const Root = styled.div`
  display: grid;
  grid-template-columns: auto auto 150px auto 80px auto 80px;
  align-items: center;
  height: 100%;
`;
const AdditionalLabel = styled.span`
  margin-left: 10px;
  margin-right: 4px;
`;
const RightTextField = styled(BasicTextField)`
  & > div > div > input {
    text-align: right;
  }
`;
