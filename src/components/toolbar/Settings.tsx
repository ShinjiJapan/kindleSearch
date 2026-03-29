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
import { jpCategories } from "../../config/JPCategories";
import { usCategories } from "../../config/USCategories";
import { msg } from "../../utils/i18n";

const Settings = (): React.ReactElement => {
  const viewModel = appVM.toolBarVM.settingsVM;
  viewModel.useBind();

  const sortOptions: IDropdownOption[] = [
    { key: "", text: msg("keepLastUsed") },
    { key: "relevancerank", text: msg("sortRelevancerank") },
    { key: "date-desc-rank", text: msg("sortDateDescRank") },
    { key: "date-asc-rank", text: msg("sortDateAscRank") },
    { key: "review-rank", text: msg("sortReviewRank") },
  ];

  const baseCategoryOptions =
    viewModel.region === "US" ? usCategories : jpCategories;
  const categoryOptions: IDropdownOption[] = [
    { key: "", text: msg("keepLastUsed") },
    ...baseCategoryOptions,
  ];

  return (
    <Root>
      <GearButton
        iconProps={{ iconName: "Settings" }}
        title={msg("settings")}
        onClick={viewModel.open}
      />
      <Dialog
        hidden={!viewModel.isOpen}
        onDismiss={viewModel.close}
        dialogContentProps={{
          type: DialogType.normal,
          title: msg("settings"),
        }}
        minWidth={460}
        modalProps={{ isBlocking: false }}
      >
        <Section>
          <Dropdown
            label={msg("region")}
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
            label={msg("muteWords")}
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
            label={msg("muteAuthors")}
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
            label={msg("defaultSort")}
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
            label={msg("defaultCategory")}
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
            text={msg("save")}
            onClick={viewModel.save}
          />
          <DefaultButton
            text={msg("cancel")}
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
