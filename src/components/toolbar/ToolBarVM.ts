import { BindableBase } from "../../BindableBase";
import { appVM } from "../../AppVM";
import connection, { UrlParams } from "../../utils/Connection";
import { BookItemModel } from "../bookItem/BookItemModel";
import parse from "../../utils/Parse";
import { AmazonSortDropdownVM } from "./AmazonSortDropdownVM";
import { AmazonSearchWordVM } from "./AmazonSearchWordVM";
import { UnlimitedOnlyCheckboxVM } from "./UnlimitedOnlyCheckboxVM";
import { ExecFilterTextFieldVM } from "./ExecFilterTextFieldVM";
import { LocalSorterVM } from "./LocalSorterVM";
import TermVM from "./TermVM";
import CategorySelectorVM from "./CategorySelectorVM";
import { BasicTextFieldVM } from "./BasicTextFieldVM";
import DetailAreaVM from "./DetailAreaVM";
import FavoriteVM from "./FavoriteVM";
import { FavoriteModel } from "./FavoriteModel";
import SettingsVM from "./SettingsVM";
import { SettingsModel } from "./SettingsModel";
import { setCurrentLanguage, setCurrentRegion, getCurrentRegion } from "../../config/RegionConfig";

export default class ToolBarVM extends BindableBase {
  /** 設定 */
  public settingsVM = new SettingsVM((settings: SettingsModel) => {
    setCurrentLanguage(settings.language);
    setCurrentRegion(settings.region);
    const { labels } = getCurrentRegion();
    // ソート順ラベル更新
    const { sort } = labels;
    this.amazonSortDropdownVM.options = [
      { key: "relevancerank", text: sort.relevancerank },
      { key: "date-desc-rank", text: sort["date-desc-rank"] },
      { key: "date-asc-rank", text: sort["date-asc-rank"] },
      { key: "review-rank", text: sort["review-rank"] },
    ];
    if (settings.defaultSort) {
      this.amazonSortDropdownVM.selectedKey = settings.defaultSort;
      localStorage.setItem("AmazonSort", settings.defaultSort);
    }
    this.amazonSortDropdownVM.onPropertyChanged();
    // Unlimitedラベル更新
    this.unlimitedOnlyCheckboxVM.label = labels.unlimitedOnly;
    this.unlimitedOnlyCheckboxVM.onPropertyChanged();
    // ローカルソートラベル更新
    const { localSort } = labels;
    this.localSorterVM.options = [
      { key: "", text: localSort.none },
      { key: "titleAsc", text: localSort.titleAsc },
      { key: "titleDesc", text: localSort.titleDesc },
      { key: "authorAsc", text: localSort.authorAsc },
      { key: "authorDesc", text: localSort.authorDesc },
    ];
    this.localSorterVM.onPropertyChanged();
    // 日付ピッカーの月名ラベル更新
    this.fromDateVM.refreshStrings();
    this.toDateVM.refreshStrings();
    this.fromDateVM.onPropertyChanged();
    this.toDateVM.onPropertyChanged();
    // カテゴリ切替
    this.categorySelectorVM.switchRegion(settings.region);
    if (settings.defaultCategory) {
      this.categorySelectorVM.selectedKey = settings.defaultCategory;
      localStorage.setItem("AmazonCategory", settings.defaultCategory);
    }
    this.categorySelectorVM.onPropertyChanged();
    // お気に入りVM再描画
    this.favoriteVM.onPropertyChanged();
    this.execFilter();
    this.onPropertyChanged();
    appVM.onPropertyChanged();
  });

  /** amazon検索ソート順 */
  public amazonSortDropdownVM = new AmazonSortDropdownVM();

  /** 「Unlimited対象作品のみ」Checkbox */
  public unlimitedOnlyCheckboxVM = new UnlimitedOnlyCheckboxVM();

  public bulkPageCount = 3;
  public logicalCurrentPage = 1;
  public currentPage = 0;
  public pageCount = 0;
  public hasMorePage = false;
  private books: BookItemModel[] = [];

  public get logicalPageCount(): number {
    return Math.ceil(this.pageCount / this.bulkPageCount);
  }

  public isProgress = false;

  /** 検索ボタンまたはenterが押された時の処理 */
  public onSearchAsync = async (): Promise<void> => {
    this.books = [];
    this.currentPage = 0;
    this.pageCount = -1;
    this.isProgress = true;

    this.logicalCurrentPage = 1;
    this.hasMorePage = false;
    appVM.footerVM.onPropertyChanged();
    appVM.onPropertyChanged();

    this.params = {
      k: this.amazonSearchWordVM.value,
      rh: this.getRhQueryString(true),
      bbn: this.categorySelectorVM.selectedKey,
      s: this.amazonSortDropdownVM.selectedKey,
      node: this.NodeVM.value,
    };

    for (let i = 0; i < this.bulkPageCount; i++) {
      const result = await this.getPageAsync(++this.currentPage);
      if (i === 0) {
        this.pageCount = result.pageCount;
      }
      this.addNewBooks(result.books);
      this.execFilter();
      if (i === this.bulkPageCount - 1) {
        this.isProgress = false;
      }
      appVM.onPropertyChanged();

      if (this.currentPage > this.pageCount) {
        this.isProgress = false;
        appVM.onPropertyChanged();
        return;
      }
    }

    // 先があるなら先のページをキャッシュ
    if (this.pageCount > this.bulkPageCount) {
      this.getCacheTask = this.readCacheAsync();
      this.hasMorePage = true;
      appVM.footerVM.onPropertyChanged();
    }
  };

  private params: UrlParams;

  /** 1ページ取得 */
  private getPageAsync = async (
    page: number
  ): Promise<{
    books: BookItemModel[];
    pageCount: number;
  }> => {
    const response = await connection.fetchPageAsync(
      this.params,
      page.toString()
    );
    console.log(response);
    const result = parse.exec(response);
    // console.log("pageCount : " + result.pageCount);

    return result;
  };

  // #region rhパラメータ作成

  private getRhQueryString = (is16: boolean): string => {
    const common = [
      this.authorQueryString,
      this.unlimitedQueryString,
      this.termQueryString,
      this.priceQueryString,
    ];

    if (is16) common.push(this.categoryQueryString);

    return common.filter((x) => x !== "").join(",");
  };

  private get categoryQueryString(): string {
    return "n:" + this.categorySelectorVM.selectedKey;
  }

  private get authorQueryString(): string {
    return this.SearchAuthorVM.value ? "p_27:" + this.SearchAuthorVM.value : "";
  }

  private get unlimitedQueryString(): string {
    return this.unlimitedOnlyCheckboxVM.checked
      ? "p_n_feature_nineteen_browse-bin:" + getCurrentRegion().site.unlimitedFilterId
      : "";
  }

  private get termQueryString(): string {
    const from = this.fromDateVM.value;
    const to = this.toDateVM.value;
    if (!from && !to) return "";
    return `p_n_date:${this.toYYYYMMDD(from)}-${this.toYYYYMMDD(to)}`;
  }

  private toYYYYMMDD = (date?: Date): string => {
    if (!date) return "";
    return (
      date.getFullYear().toString() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2)
    );
  };
  private getAmazonPriceString = (val: string): string => {
    if (!val) return "";
    return (Number(val) * 100).toString();
  };

  private get priceQueryString(): string {
    const min = this.getAmazonPriceString(this.MinPriceVM.value);
    const max = this.getAmazonPriceString(this.MaxPriceVM.value);

    if (!min && !max) return "";
    return `p_36:${min}-${max}`;
  }
  // #endregion rhパラメータ作成

  // 先読み分

  /** 先読み */
  private readCacheAsync = async (): Promise<BookItemModel[]> => {
    let books: BookItemModel[] = [];
    for (let i = 0; i < this.bulkPageCount; i++) {
      if (this.currentPage > this.pageCount) {
        break;
      }
      const result = await this.getPageAsync(this.currentPage++);
      books = books.concat(result.books);
    }

    return books;
  };

  private getCacheTask: Promise<BookItemModel[]>;
  /** 追加ページ取得 */
  public readMorePageAsync = async (): Promise<void> => {
    this.logicalCurrentPage++;
    this.hasMorePage = false;
    this.addNewBooks(await this.getCacheTask);

    this.getCacheTask = this.readCacheAsync();

    this.hasMorePage = this.logicalCurrentPage < this.logicalPageCount;
    appVM.footerVM.onPropertyChanged();
  };

  public filteredBooks: BookItemModel[] = [];
  /** booksを一覧に追加 */
  private addNewBooks = (books: BookItemModel[]): void => {
    books.forEach((book) => {
      if (
        (book.isUnlimited || !this.unlimitedOnlyCheckboxVM.checked) && // unlimitedの検索結果に非対象商品が混ざるようになったため
        !this.books.some(
          (x) =>
            //重複は除外
            x.authors[0] && // スポンサープロダクト商品が混ざることがあり、その場合x.authorsが取得できない
            x.title === book.title &&
            x.authors[0].name === book.authors[0].name
        )
      ) {
        this.books.push(book);
      }
    });
    this.execFilter();
  };

  /** 「以下の語句を含まない」 */
  public localMuteWordVM = new ExecFilterTextFieldVM(() => {
    this.execFilter();
    appVM.onPropertyChanged();
  });

  /** 「以下の語句を含む」 */
  public localSearchWordVM = new ExecFilterTextFieldVM(() => {
    this.execFilter();
    appVM.onPropertyChanged();
  });

  public localSorterVM = new LocalSorterVM(() => {
    this.execFilter();
    appVM.onPropertyChanged();
  });

  /** 「ローカル条件」を反映 */
  private execFilter = (): void => {
    const globalMuteWords = this.settingsVM.parsedMuteWords;
    const globalMuteAuthors = this.settingsVM.parsedMuteAuthors;
    this.filteredBooks = this.books
      .filter(
        (book) =>
          (!this.localSearchWordVM.value ||
            this.isMatch(book, this.localSearchWordVM.splitedWords)) &&
          !this.isMatch(book, this.localMuteWordVM.splitedWords) &&
          !this.isTitleMatch(book, globalMuteWords) &&
          !this.isAuthorMatch(book, globalMuteAuthors)
      )
      .sort((a, b) => {
        switch (this.localSorterVM.selectedKey) {
          case "titleAsc":
            return a.title > b.title ? 1 : -1;
          case "titleDesc":
            return a.title < b.title ? 1 : -1;
          case "authorAsc":
            return a.authors.map((x) => x.name).join(",") >
              b.authors.map((x) => x.name).join(",")
              ? 1
              : -1;
          case "authorDesc":
            return a.authors.map((x) => x.name).join(",") <
              b.authors.map((x) => x.name).join(",")
              ? 1
              : -1;
          default:
            return 1;
        }
      });
  };

  private isMatch = (book: BookItemModel, words: string[]): boolean => {
    return (
      words.some((word) => book.title.toLocaleLowerCase().includes(word)) ||
      words.some((word) =>
        book.authors.some((author) =>
          author.name.toLocaleLowerCase().includes(word)
        )
      )
    );
  };

  private isTitleMatch = (book: BookItemModel, words: string[]): boolean => {
    return words.some((word) => book.title.toLocaleLowerCase().includes(word));
  };

  private isAuthorMatch = (book: BookItemModel, authors: string[]): boolean => {
    return authors.some((a) =>
      book.authors.some((author) =>
        author.name.toLocaleLowerCase() === a
      )
    );
  };

  /** amazon検索ワード */
  public amazonSearchWordVM = new AmazonSearchWordVM(this.onSearchAsync);
  public fromDateVM = new TermVM();
  public toDateVM = new TermVM();
  public categorySelectorVM = new CategorySelectorVM();

  public SearchAuthorVM = new BasicTextFieldVM(this.onSearchAsync);
  public NodeVM = new BasicTextFieldVM(this.onSearchAsync);
  public MinPriceVM = new BasicTextFieldVM(this.onSearchAsync);
  public MaxPriceVM = new BasicTextFieldVM(this.onSearchAsync);

  public detailAreaVM = new DetailAreaVM();
  // public FreeQueryVM = new BasicTextFieldVM(this.onSearchAsync);

  private saveCurrent = (): FavoriteModel => {
    return {
      name: "",
      amazonSearchWord: this.amazonSearchWordVM.value,
      amazonSort: this.amazonSortDropdownVM.selectedKey,
      unlimitedOnly: this.unlimitedOnlyCheckboxVM.checked,
      category: this.categorySelectorVM.selectedKey,
      fromDate: this.fromDateVM.value ? this.fromDateVM.value.toISOString() : null,
      toDate: this.toDateVM.value ? this.toDateVM.value.toISOString() : null,
      author: this.SearchAuthorVM.value,
      minPrice: this.MinPriceVM.value,
      maxPrice: this.MaxPriceVM.value,
      node: this.NodeVM.value,
      localSearchWord: this.localSearchWordVM.value || "",
      localMuteWord: this.localMuteWordVM.value || "",
      localSort: this.localSorterVM.selectedKey,
    };
  };

  private restoreFavorite = (fav: FavoriteModel): void => {
    this.amazonSearchWordVM.value = fav.amazonSearchWord;
    this.amazonSortDropdownVM.selectedKey = fav.amazonSort;
    this.unlimitedOnlyCheckboxVM.checked = fav.unlimitedOnly;
    this.categorySelectorVM.selectedKey = fav.category;
    this.fromDateVM.value = fav.fromDate ? new Date(fav.fromDate) : undefined;
    this.toDateVM.value = fav.toDate ? new Date(fav.toDate) : undefined;
    this.SearchAuthorVM.value = fav.author;
    this.MinPriceVM.value = fav.minPrice;
    this.MaxPriceVM.value = fav.maxPrice;
    this.NodeVM.value = fav.node;
    this.localSearchWordVM.value = fav.localSearchWord;
    this.localSearchWordVM.splitedWords = fav.localSearchWord
      .split(" ")
      .filter((x) => x)
      .map((x) => x.toLocaleLowerCase());
    this.localMuteWordVM.value = fav.localMuteWord;
    this.localMuteWordVM.splitedWords = fav.localMuteWord
      .split(" ")
      .filter((x) => x)
      .map((x) => x.toLocaleLowerCase());
    this.localSorterVM.selectedKey = fav.localSort;

    // 各コンポーネントのUIを更新
    this.amazonSearchWordVM.onPropertyChanged();
    this.amazonSortDropdownVM.onPropertyChanged();
    this.unlimitedOnlyCheckboxVM.onPropertyChanged();
    this.categorySelectorVM.onPropertyChanged();
    this.fromDateVM.onPropertyChanged();
    this.toDateVM.onPropertyChanged();
    this.SearchAuthorVM.onPropertyChanged();
    this.MinPriceVM.onPropertyChanged();
    this.MaxPriceVM.onPropertyChanged();
    this.NodeVM.onPropertyChanged();
    this.localSearchWordVM.onPropertyChanged();
    this.localMuteWordVM.onPropertyChanged();
    this.localSorterVM.onPropertyChanged();
  };

  public favoriteVM = new FavoriteVM(
    this.saveCurrent,
    this.restoreFavorite,
    this.onSearchAsync
  );
}
