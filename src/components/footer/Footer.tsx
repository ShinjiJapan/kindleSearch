import React from "react";
import styled from "styled-components";
import { appVM } from "../../AppVM";

const Footer = (): React.ReactElement => {
  const viewModel = appVM.footerVM;
  viewModel.useBind();
  return viewModel.hasMorePage ? (
    <Root onClick={appVM.onGetMorePageClicked}>{viewModel.label}</Root>
  ) : (
    <React.Fragment />
  );
};

export default React.memo(Footer);

const Root = styled.div`
  width: 100%;
  height: 40px;
  background-color: #eee;
  text-align: center;
  /* padding-top: 4px; */
  vertical-align: middle;
  line-height: 40px;
  min-width: 1190px;
  &:hover {
    background-color: #fff;
    cursor: pointer;
  }
`;
