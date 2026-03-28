import { BindableBase } from "../../BindableBase";
import {
  IDropdownOption,
  IDropdownStyles,
} from "@fluentui/react/lib/Dropdown";
import { getCurrentRegion, REGIONS } from "../../config/RegionConfig";
import { jpCategories } from "../../config/JPCategories";
import { usCategories } from "../../config/USCategories";

function getCategoriesForRegion(regionId: string): IDropdownOption[] {
  switch (regionId) {
    case "US":
      return usCategories;
    case "JP":
    default:
      return jpCategories;
  }
}

export default class extends BindableBase {
  public constructor() {
    super();
    const region = getCurrentRegion();
    this.options = getCategoriesForRegion(region.id);
    this.selectedKey =
      localStorage.getItem("AmazonCategory") || region.site.defaultCategoryKey;
  }
  public options: IDropdownOption[];
  public selectedKey = "";

  public readonly styles: Partial<IDropdownStyles> = {
    dropdownItemHeader: { backgroundColor: "#cdf", color: "#333" },
  };

  public readonly onChange = (_: any, option?: IDropdownOption): void => {
    this.selectedKey = option!.key.toString();
    localStorage.setItem("AmazonCategory", this.selectedKey);
    this.onPropertyChanged();
  };

  public switchRegion(regionId: string): void {
    this.options = getCategoriesForRegion(regionId);
    this.selectedKey = REGIONS[regionId].site.defaultCategoryKey;
    localStorage.setItem("AmazonCategory", this.selectedKey);
    this.onPropertyChanged();
  }
}
