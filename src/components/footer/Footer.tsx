import React from "react";
import styled from "styled-components";
import { appVM } from "../../AppVM";
export default (): React.ReactElement => {
  return appVM.hasMorePage ? (
    <Root onClick={appVM.onGetMorePageClicked}>
      {"結果をもっと表示 " + appVM.pagenation}
    </Root>
  ) : (
    <React.Fragment />
  );
};

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
