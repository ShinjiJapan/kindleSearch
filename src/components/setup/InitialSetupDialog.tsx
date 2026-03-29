import React, { useState } from "react";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react/lib/Dialog";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { setCurrentRegion } from "../../config/RegionConfig";
import { msg } from "../../utils/i18n";

const regionOptions: IDropdownOption[] = [
  { key: "JP", text: "Amazon.co.jp (日本 / Japan)" },
  { key: "US", text: "Amazon.com (米国 / US)" },
];

function detectDefaultRegion(): string {
  const browserLang = navigator.language || "ja";
  return browserLang.startsWith("ja") ? "JP" : "US";
}

interface Props {
  onComplete: () => void;
}

const InitialSetupDialog: React.FC<Props> = ({ onComplete }) => {
  const [region, setRegion] = useState(detectDefaultRegion);

  const handleSave = () => {
    setCurrentRegion(region);
    const settings = JSON.parse(
      localStorage.getItem("kindleSearch_settings") || "{}"
    );
    settings.region = region;
    localStorage.setItem("kindleSearch_settings", JSON.stringify(settings));
    onComplete();
  };

  return (
    <Dialog
      hidden={false}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: msg("initialSetupTitle"),
      }}
    >
      <p style={{ margin: "0 0 16px 0" }}>
        {msg("initialSetupDescription")}
      </p>
      <Dropdown
        label={msg("region")}
        options={regionOptions}
        selectedKey={region}
        onChange={(_, opt) => setRegion(opt!.key as string)}
      />
      <DialogFooter>
        <PrimaryButton text="OK" onClick={handleSave} />
      </DialogFooter>
    </Dialog>
  );
};

export default InitialSetupDialog;
