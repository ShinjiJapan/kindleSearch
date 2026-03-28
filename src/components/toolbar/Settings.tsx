import React from "react";
import {
  Dialog,
  DialogType,
  DialogFooter,
} from "@fluentui/react/lib/Dialog";
import { PrimaryButton, DefaultButton, IconButton } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import styled from "styled-components";
import { appVM } from "../../AppVM";
import { categories } from "./CategorySelectorVM";

const sortOptions: IDropdownOption[] = [
  { key: "relevancerank", text: "アマゾンおすすめ商品" },
  { key: "date-desc-rank", text: "出版年月が新しい順番" },
  { key: "date-asc-rank", text: "出版年月が古い順番" },
  { key: "review-rank", text: "レビューの評価順" },
];

const Settings = (): React.ReactElement => {
  const viewModel = appVM.toolBarVM.settingsVM;
  viewModel.useBind();

  return (
    <Root>
      <GearButton
        iconProps={{ iconName: "Settings" }}
        title="設定"
        onClick={viewModel.open}
      />
      <Dialog
        hidden={!viewModel.isOpen}
        onDismiss={viewModel.close}
        dialogContentProps={{
          type: DialogType.normal,
          title: "設定",
        }}
        minWidth={460}
        modalProps={{ isBlocking: false }}
      >
        <Section>
          <TextField
            label="NGワード（1行に1つ）"
            multiline
            rows={4}
            value={viewModel.globalMuteWords}
            onChange={(_, v) => {
              viewModel.globalMuteWords = v || "";
              viewModel.onPropertyChanged();
            }}
          />
        </Section>
        <Section>
          <TextField
            label="NG著者（1行に1つ）"
            multiline
            rows={4}
            value={viewModel.globalMuteAuthors}
            onChange={(_, v) => {
              viewModel.globalMuteAuthors = v || "";
              viewModel.onPropertyChanged();
            }}
          />
        </Section>
        <Section>
          <Dropdown
            label="デフォルトソート順"
            options={sortOptions}
            selectedKey={viewModel.defaultSort}
            onChange={(_, o) => {
              viewModel.defaultSort = o!.key.toString();
              viewModel.onPropertyChanged();
            }}
          />
        </Section>
        <Section>
          <Dropdown
            label="デフォルトカテゴリ"
            options={categories}
            selectedKey={viewModel.defaultCategory}
            onChange={(_, o) => {
              viewModel.defaultCategory = o!.key.toString();
              viewModel.onPropertyChanged();
            }}
          />
        </Section>
        <DialogFooter>
          <PrimaryButton text="保存" onClick={viewModel.save} />
          <DefaultButton text="キャンセル" onClick={viewModel.close} />
        </DialogFooter>
      </Dialog>
    </Root>
  );
};

export default React.memo(Settings);

const Root = styled.div`
  display: flex;
  align-items: center;
`;

const GearButton = styled(IconButton)`
  color: #555;
  font-size: 16px;
  &:hover {
    color: #333;
  }
`;

const Section = styled.div`
  margin-bottom: 12px;
`;
