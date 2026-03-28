import React, { useState } from "react";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react/lib/Dialog";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { setCurrentLanguage, setCurrentRegion } from "../../config/RegionConfig";

const languageOptions: IDropdownOption[] = [
  { key: "ja", text: "日本語 / Japanese" },
  { key: "en", text: "English / 英語" },
];

const regionOptions: IDropdownOption[] = [
  { key: "JP", text: "Amazon.co.jp (日本 / Japan)" },
  { key: "US", text: "Amazon.com (米国 / US)" },
];

function detectDefaults(): { language: string; region: string } {
  const browserLang = navigator.language || "ja";
  const isJa = browserLang.startsWith("ja");
  return {
    language: isJa ? "ja" : "en",
    region: isJa ? "JP" : "US",
  };
}

interface Props {
  onComplete: () => void;
}

const InitialSetupDialog: React.FC<Props> = ({ onComplete }) => {
  const defaults = detectDefaults();
  const [language, setLanguage] = useState(defaults.language);
  const [region, setRegion] = useState(defaults.region);

  const handleSave = () => {
    setCurrentLanguage(language);
    setCurrentRegion(region);
    const settings = JSON.parse(
      localStorage.getItem("kindleSearch_settings") || "{}"
    );
    settings.language = language;
    settings.region = region;
    localStorage.setItem("kindleSearch_settings", JSON.stringify(settings));
    onComplete();
  };

  return (
    <Dialog
      hidden={false}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: "初期設定 / Initial Setup",
      }}
    >
      <p style={{ margin: "0 0 16px 0" }}>
        言語とリージョンを選択してください
        <br />
        Select your language and region
      </p>
      <Dropdown
        label="言語 / Language"
        options={languageOptions}
        selectedKey={language}
        onChange={(_, opt) => setLanguage(opt!.key as string)}
      />
      <Dropdown
        label="リージョン / Region"
        options={regionOptions}
        selectedKey={region}
        onChange={(_, opt) => setRegion(opt!.key as string)}
        styles={{ root: { marginTop: 12 } }}
      />
      <DialogFooter>
        <PrimaryButton text="OK" onClick={handleSave} />
      </DialogFooter>
    </Dialog>
  );
};

export default InitialSetupDialog;
