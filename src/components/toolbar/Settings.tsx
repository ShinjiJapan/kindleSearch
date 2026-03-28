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
import { REGIONS } from "../../config/RegionConfig";
import { jpCategories } from "../../config/JPCategories";
import { usCategories } from "../../config/USCategories";

const Settings = (): React.ReactElement => {
  const viewModel = appVM.toolBarVM.settingsVM;
  viewModel.useBind();

  const isJa = viewModel.language === "ja";
  const labels = isJa ? REGIONS.JP.labels : REGIONS.US.labels;

  const keepLabel = isJa ? "前回の値を保持" : "Keep last used";

  const sortOptions: IDropdownOption[] = [
    { key: "", text: keepLabel },
    { key: "relevancerank", text: labels.sort.relevancerank },
    { key: "date-desc-rank", text: labels.sort["date-desc-rank"] },
    { key: "date-asc-rank", text: labels.sort["date-asc-rank"] },
    { key: "review-rank", text: labels.sort["review-rank"] },
  ];

  const baseCategoryOptions =
    viewModel.region === "US" ? usCategories : jpCategories;
  const categoryOptions: IDropdownOption[] = [
    { key: "", text: keepLabel },
    ...baseCategoryOptions,
  ];

  return (
    <Root>
      <GearButton
        iconProps={{ iconName: "Settings" }}
        title={isJa ? "設定" : "Settings"}
        onClick={viewModel.open}
      />
      <Dialog
        hidden={!viewModel.isOpen}
        onDismiss={viewModel.close}
        dialogContentProps={{
          type: DialogType.normal,
          title: isJa ? "設定" : "Settings",
        }}
        minWidth={460}
        modalProps={{ isBlocking: false }}
      >
        <Section>
          <Dropdown
            label={isJa ? "言語" : "Language"}
            options={[
              { key: "ja", text: "日本語" },
              { key: "en", text: "English" },
            ]}
            selectedKey={viewModel.language}
            onChange={(_, opt) => {
              viewModel.language = opt!.key as string;
              viewModel.onPropertyChanged();
            }}
          />
        </Section>
        <Section>
          <Dropdown
            label={isJa ? "リージョン" : "Region"}
            options={[
              { key: "JP", text: "Amazon.co.jp (日本)" },
              { key: "US", text: "Amazon.com (US)" },
            ]}
            selectedKey={viewModel.region}
            onChange={(_, opt) => {
              viewModel.region = opt!.key as string;
              viewModel.onPropertyChanged();
            }}
          />
        </Section>
        <Section>
          <TextField
            label={isJa ? "NGワード（1行に1つ）" : "Mute words (one per line)"}
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
            label={isJa ? "NG著者（1行に1つ）" : "Mute authors (one per line)"}
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
            label={isJa ? "デフォルトソート順" : "Default sort"}
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
            label={isJa ? "デフォルトカテゴリ" : "Default category"}
            options={categoryOptions}
            selectedKey={viewModel.defaultCategory}
            onChange={(_, o) => {
              viewModel.defaultCategory = o!.key.toString();
              viewModel.onPropertyChanged();
            }}
          />
        </Section>
        <DialogFooter>
          <PrimaryButton
            text={isJa ? "保存" : "Save"}
            onClick={viewModel.save}
          />
          <DefaultButton
            text={isJa ? "キャンセル" : "Cancel"}
            onClick={viewModel.close}
          />
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
