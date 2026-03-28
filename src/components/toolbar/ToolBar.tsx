import React from "react";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import styled from "styled-components";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { appVM } from "../../AppVM";
import AmazonSortDropdown from "./AmazonSortDropdown";
import AmazonSearchWord from "./AmazonSearchWord";
import LocalMuteWord from "./LocalMuteWord";
import UnlimitedOnlyCheckbox from "./UnlimitedOnlyCheckbox";
import LocalSearchWord from "./LocalSearchWord";
import LocalSorter from "./LocalSorter";
import Term from "./Term";
import CategorySelector from "./CategorySelector";
import DetailArea from "./DetailArea";
import Favorite from "./Favorite";
import Settings from "./Settings";

initializeIcons(/* optional base url */);

const ToolBar = (): React.ReactElement => {
  const viewModel = appVM.toolBarVM;
  viewModel.useBind();

  return (
    <Root>
      <ConditionsArea>
        <Wrapper>
          <AmazonCondition>
            <AmazonSearchWord />
            <AmazonSortDropdown />
            <UnlimitedOnlyCheckbox />
            <CategorySelector />
            <Term fromTo="from" />
            <span>～</span>
            <Term fromTo="to" />

            <DetailArea />

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
      </ConditionsArea>
      <IconsArea>
        <Favorite />
        <Settings />
      </IconsArea>
    </Root>
  );
};

export default React.memo(ToolBar);

const AmazonCondition = styled.div`
  display: grid;
  grid-template-columns: 200px 190px 180px 150px 110px auto 110px auto 100px;
  align-items: center;
  height: 100%;
`;

const LocalCondition = styled.div`
  display: grid;
  grid-template-columns: 110px 170px 50px 170px 90px 76px;
  align-items: center;
  height: 100%;
`;
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
  align-items: flex-start;
`;

const ConditionsArea = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
`;

const IconsArea = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding-right: 4px;
`;
