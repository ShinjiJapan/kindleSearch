export interface SiteConfig {
  domain: string;
  kindleStoreNode: string;
  kindleEbooksNode: string;
  defaultCategoryKey: string;
  unlimitedFilterId: string;
}

export interface ParseConfig {
  currency: RegExp;
  noResultTexts: [string, string];
  sellerLabel: string;
  authorPrefix: string;
  starRatingIndex: number;
  authorSeparators: string[];
}

export interface RegionConfig {
  id: string;
  site: SiteConfig;
  parse: ParseConfig;
}

const JP: RegionConfig = {
  id: "JP",
  site: {
    domain: "https://www.amazon.co.jp",
    kindleStoreNode: "2250738051",
    kindleEbooksNode: "2275256051",
    defaultCategoryKey: "2250738051",
    unlimitedFilterId: "3169286051",
  },
  parse: {
    currency: /￥+[0-9,]+/,
    noResultTexts: ["の結果は見つかりませんでした", "のすべての結果を表示します"],
    sellerLabel: "販売者:",
    authorPrefix: "",
    starRatingIndex: 1,
    authorSeparators: ["|", ",", "、"],
  },
};

const US: RegionConfig = {
  id: "US",
  site: {
    domain: "https://www.amazon.com",
    kindleStoreNode: "133140011",
    kindleEbooksNode: "154606011",
    defaultCategoryKey: "154606011",
    unlimitedFilterId: "9045887011",
  },
  parse: {
    currency: /\$[0-9,.]+/,
    noResultTexts: ["No results for", "Try checking your spelling"],
    sellerLabel: "Sold by:",
    authorPrefix: "by",
    starRatingIndex: 0,
    authorSeparators: ["|", ",", "、", "and", ", et al."],
  },
};

export const REGIONS: Record<string, RegionConfig> = { JP, US };

const REGION_STORAGE_KEY = "kindleSearch_region";

export function getCurrentRegion(): RegionConfig {
  const regionId = localStorage.getItem(REGION_STORAGE_KEY) || "JP";
  return REGIONS[regionId] || REGIONS.JP;
}

export function setCurrentRegion(id: string): void {
  localStorage.setItem(REGION_STORAGE_KEY, id);
}
