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
}

export type SortKey =
  | "relevancerank"
  | "date-desc-rank"
  | "date-asc-rank"
  | "review-rank";

export interface Labels {
  sort: Record<SortKey, string>;
  price: string;
  author: string;
  search: string;
  localCondition: string;
  include: string;
  exclude: string;
  unlimitedOnly: string;
  localSort: {
    none: string;
    titleAsc: string;
    titleDesc: string;
    authorAsc: string;
    authorDesc: string;
  };
  moreResults: string;
  addMuteAuthor: string;
  priceLabel: string;
  favorites: string;
  favoritesPrompt: string;
  favoritesAdd: string;
  delete: string;
  months: string[];
}

export interface RegionConfig {
  id: string;
  site: SiteConfig;
  parse: ParseConfig;
  labels: Labels;
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
  },
  labels: {
    sort: {
      relevancerank: "アマゾンおすすめ商品",
      "date-desc-rank": "出版年月が新しい順番",
      "date-asc-rank": "出版年月が古い順番",
      "review-rank": "レビューの評価順",
    },
    price: "価格:",
    author: "著者",
    search: "検索",
    localCondition: "ローカル条件",
    include: "を含む",
    exclude: "を含まない",
    unlimitedOnly: "Unlimited対象作品のみ",
    localSort: {
      none: "並び替え無し",
      titleAsc: "作品名(昇順)",
      titleDesc: "作品名(降順)",
      authorAsc: "著者名(昇順)",
      authorDesc: "著者名(降順)",
    },
    moreResults: "結果をもっと表示",
    addMuteAuthor: "NG著者に追加",
    priceLabel: "価格",
    favorites: "お気に入り",
    favoritesPrompt: "お気に入り名を入力してください",
    favoritesAdd: "＋ 現在の検索条件を追加",
    delete: "削除",
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
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
  },
  labels: {
    sort: {
      relevancerank: "Featured",
      "date-desc-rank": "Newest arrivals",
      "date-asc-rank": "Oldest first",
      "review-rank": "Avg. customer review",
    },
    price: "Price:",
    author: "Author",
    search: "Search",
    localCondition: "Local filter",
    include: "Include",
    exclude: "Exclude",
    unlimitedOnly: "Unlimited only",
    localSort: {
      none: "No sorting",
      titleAsc: "Title (A→Z)",
      titleDesc: "Title (Z→A)",
      authorAsc: "Author (A→Z)",
      authorDesc: "Author (Z→A)",
    },
    moreResults: "Load more",
    addMuteAuthor: "Mute author",
    priceLabel: "Price",
    favorites: "Favorites",
    favoritesPrompt: "Enter favorite name",
    favoritesAdd: "+ Add current conditions",
    delete: "Delete",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
};

export const REGIONS: Record<string, RegionConfig> = { JP, US };

const REGION_STORAGE_KEY = "kindleSearch_region";
const LANG_STORAGE_KEY = "kindleSearch_language";

export function getCurrentLanguage(): string {
  return localStorage.getItem(LANG_STORAGE_KEY) || "ja";
}

export function setCurrentLanguage(lang: string): void {
  localStorage.setItem(LANG_STORAGE_KEY, lang);
}

export function getCurrentRegion(): RegionConfig {
  const regionId = localStorage.getItem(REGION_STORAGE_KEY) || "JP";
  const langId = getCurrentLanguage();
  const region = REGIONS[regionId] || REGIONS.JP;
  // labels だけ言語に連動（site, parse はリージョンに連動）
  const labelsSource = langId === "en" ? REGIONS.US : REGIONS.JP;
  return { ...region, labels: labelsSource.labels };
}

export function setCurrentRegion(id: string): void {
  localStorage.setItem(REGION_STORAGE_KEY, id);
}
