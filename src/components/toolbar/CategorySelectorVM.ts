import { BindableBase } from "../../BindableBase";
import {
  DropdownMenuItemType,
  IDropdownOption,
  IDropdownStyles,
} from "office-ui-fabric-react/lib/components/Dropdown/Dropdown.types";

const categories: IDropdownOption[] = [
  {
    key: "2250738051",
    text: "指定なし",
  },
  {
    key: "2275256051header",
    text: "Kindle和書",
    itemType: DropdownMenuItemType.Header,
  },
  {
    key: "2275256051",
    text: "Kindle和書(ALL)",
  },
  { key: "2292699051", text: "文学・評論" },
  { key: "2292095051", text: "人文・思想" },
  { key: "2293149051", text: "社会・政治" },
  { key: "2291791051", text: "ノンフィクション" },
  { key: "2293076051", text: "歴史・地理" },
  { key: "2291905051", text: "ビジネス・経済" },
  { key: "2292576051", text: "投資・金融・会社経営" },
  { key: "2293263051", text: "科学・テクノロジー" },
  { key: "2292340051", text: "医学・薬学" },
  { key: "2291657051", text: "コンピュータ・IT" },
  { key: "2291481051", text: "アート・建築・デザイン" },
  { key: "2292479051", text: "趣味・実用" },
  { key: "2292480051", text: "スポーツ・アウトドア" },
  { key: "2293536051", text: "資格・検定・就職" },
  { key: "2292803051", text: "暮らし・健康・子育て" },
  { key: "2292799051", text: "旅行ガイド・マップ" },
  { key: "2293396051", text: "語学・辞事典・年鑑" },
  { key: "2292600051", text: "教育・学参・受験" },
  { key: "2293363051", text: "絵本・児童書" },
  { key: "2410280051", text: "ライトノベル" },
  { key: "2450063051", text: "ボーイズラブ" },
  { key: "3432431051", text: "ティーンズラブ" },
  { key: "2291790051", text: "タレント写真集" },
  { key: "2291568051", text: "エンターテイメント" },
  { key: "2293031051", text: "楽譜・スコア・音楽書" },
  { key: "2275257051", text: "雑誌" },
  { key: "2291476051", text: "アダルト" },
  {
    key: "2293143051header",
    text: "コミック",
    itemType: DropdownMenuItemType.Header,
  },
  {
    key: "2293143051",
    text: "コミック(ALL)",
  },
  { key: "2430812051", text: "少年コミック" },
  { key: "2430869051", text: "青年コミック" },
  { key: "2430765051", text: "少女コミック" },
  { key: "2430737051", text: "女性コミック" },
  { key: "2430727051", text: "4コマまんが" },
  { key: "2293144051", text: "イラスト集・オフィシャルブック" },
  { key: "3418785051", text: "コミック雑誌" },
  { key: "3686132051", text: "ファンタジー" },
  { key: "3686134051", text: "歴史" },
  { key: "3686135051", text: "ホラー" },
  { key: "3686137051", text: "格闘技" },
  { key: "3686138051", text: "メディアミックス" },
  { key: "3686139051", text: "ミステリー" },
  { key: "3686140051", text: "ノンフィクション" },
  { key: "3686141051", text: "ロマンス" },
  { key: "3686142051", text: "SF" },
  { key: "3686143051", text: "スポーツ" },
  { key: "2291478051", text: "アダルト" },

  {
    key: "2275259051header",
    text: "Kindle洋書",
    itemType: DropdownMenuItemType.Header,
  },
  {
    key: "2275259051",
    text: "Kindle洋書(ALL)",
  },
  { key: "2311970051", text: "Arts" },
  { key: "2312098051", text: "Biographies" },
  { key: "2312113051", text: "Business" },
  { key: "2312168051", text: "Children's" },
  { key: "2312223051", text: "Comics" },
  { key: "2312243051", text: "Computers" },
  { key: "2312310051", text: "Cooking," },
  { key: "2312353051", text: "Entertainment" },
  { key: "2312411051", text: "Gay" },
  { key: "2312425051", text: "Health," },
  { key: "2312454051", text: "History" },
  { key: "2312486051", text: "Home" },
  { key: "2312594051", text: "Horror" },
  { key: "2312604051", text: "Literature" },
  { key: "2312636051", text: "Medical" },
  { key: "2312663051", text: "Mystery" },
  { key: "2312678051", text: "Nonfiction" },
  { key: "2312724051", text: "Outdoors" },
  { key: "2312754051", text: "Parenting" },
  { key: "2312759051", text: "Professional" },
  { key: "2312846051", text: "Reference" },
  { key: "2312904051", text: "Religion" },
  { key: "2312932051", text: "Romance" },
  { key: "2312965051", text: "Science" },
  { key: "2312966051", text: "Science" },
  { key: "2313097051", text: "Sports" },
  { key: "2313134051", text: "Teens" },
  { key: "2313166051", text: "Travel" },
];

export default class extends BindableBase {
  public constructor() {
    super();
    this.selectedKey = localStorage.getItem("AmazonCategory") || "2250738051";
  }
  public readonly options = categories;
  public selectedKey = "";

  public readonly styles: Partial<IDropdownStyles> = {
    dropdownItemHeader: { backgroundColor: "#cdf", color: "#333" },
  };

  public readonly onChange = (
    _: any,
    option?: IDropdownOption,
    __?: number,
    value?: string
  ): void => {
    this.selectedKey = option!.key.toString();
    localStorage.setItem("AmazonCategory", this.selectedKey);
    this.onPropertyChanged();
  };
}
