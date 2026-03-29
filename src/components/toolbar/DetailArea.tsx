import React from "react";
import { IconButton } from "@fluentui/react";
import styled from "styled-components";
import BasicTextField from "./BasicTextField";
import { appVM } from "../../AppVM";
import { msg } from "../../utils/i18n";

export default (): React.ReactElement => {
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
          <AdditionalLabel>{msg("author")}</AdditionalLabel>
          <BasicTextField viewModel={appVM.toolBarVM.SearchAuthorVM} />
          <AdditionalLabel>{msg("priceLabel")}</AdditionalLabel>
          <RightTextField viewModel={appVM.toolBarVM.MinPriceVM} />
          <span>～</span>
          <RightTextField viewModel={appVM.toolBarVM.MaxPriceVM} />
          <AdditionalLabel>node</AdditionalLabel>
          <BasicTextField viewModel={appVM.toolBarVM.NodeVM} />
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
  grid-template-columns: auto auto 150px auto 80px auto 80px auto 100px;
  align-items: center;
  height: 100%;
`;
const AdditionalLabel = styled.span`
  margin-left: 10px;
  margin-right: 4px;
  width: 35px;
`;
const RightTextField = styled(BasicTextField)`
  & > div > div > input {
    text-align: right;
  }
`;
