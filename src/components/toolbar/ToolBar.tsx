import React from "react";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import styled from "styled-components";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { appVM } from "../../AppVM";
import AmazonSortDropdown from "./AmazonSortDropdown";
import AmazonSearchWord from "./AmazonSearchWord";
import LocalMuteWord from "./LocalMuteWord";
import UnlimitedOnlyCheckbox from "./UnlimitedOnlyCheckbox";
import LocalSearchWord from "./LocalSearchWord";
import LocalSorter from "./LocalSorter";

initializeIcons(/* optional base url */);

const ToolBar = (): React.ReactElement => {
  const viewModel = appVM.searchPanelContentVM;
  viewModel.useBind();

  return (
    <Root>
      <Wrapper>
        <AmazonCondition>
          <AmazonSearchWord />
          <AmazonSortDropdown />
          <UnlimitedOnlyCheckbox />
          <SearchButton text="検索" onClick={() => viewModel.onSearchAsync()} />
        </AmazonCondition>
      </Wrapper>
      <Wrapper>
        <LocalCondition>
          <Label>ローカル条件</Label>
          <LocalSearchWord />
          <span>を含む</span>
          <LocalMuteWord />
          <span>を含まない</span>
          <LocalSorter />
        </LocalCondition>
      </Wrapper>
    </Root>
  );
};

const AmazonCondition = styled.div`
  display: grid;
  grid-template-columns: 310px 200px 170px 100px;
  align-items: center;
  height: 100%;
`;

const LocalCondition = styled.div`
  display: grid;
  grid-template-columns: 130px 200px 50px 200px 100px 1fr;
  align-items: center;
  height: 100%;
`;

export default React.memo(ToolBar);

const SearchButton = styled(PrimaryButton)`
  margin-left: 10px;
  margin-right: 10px;
`;

const Label = styled.span`
  margin-left: 10px;
`;

const Wrapper = styled.div`
  margin-right: 40px;
  height: 40px;
`;

const Root = styled.div`
  display: flex;
  background-color: #dde5ff;
  flex-direction: row;
  flex-wrap: wrap;
`;
