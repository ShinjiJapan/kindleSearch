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

export default class ToolBarVM extends BindableBase {
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
    const result = parse.exec(response);
    console.log("pageCount : " + result.pageCount);

    return result;
  };

  // #region rhパラメータ作成

  private getRhQueryString = (is16: boolean): string => {
    const common = [
      this.autherQueryString,
      this.unlimitedQueryString,
      this.termQueryString,
      this.priceQueryString,
    ];

    if (is16) common.push(this.categoryQueryString);

    return common.filter(x => x !== "").join(",");
  };

  private get categoryQueryString(): string {
    return "n:" + this.categorySelectorVM.selectedKey;
  }

  private get autherQueryString(): string {
    return this.SearchAuthorVM.value ? "p_27:" + this.SearchAuthorVM.value : "";
  }

  private get unlimitedQueryString(): string {
    return this.unlimitedOnlyCheckboxVM.checked
      ? "p_n_feature_nineteen_browse-bin:3169286051"
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
  private cacheBooks: BookItemModel[] = [];
  /** 先読み */
  private readCacheAsync = async (): Promise<void> => {
    this.cacheBooks = [];
    for (let i = 0; i < this.bulkPageCount; i++) {
      if (this.currentPage > this.pageCount) {
        return;
      }
      const result = await this.getPageAsync(this.currentPage++);
      this.cacheBooks = this.cacheBooks.concat(result.books);
    }
  };

  private getCacheTask: Promise<void>;
  /** 追加ページ取得 */
  public readMorePageAsync = async (): Promise<void> => {
    this.logicalCurrentPage++;
    this.hasMorePage = false;
    await this.getCacheTask;
    this.addNewBooks(this.cacheBooks);

    this.getCacheTask = this.readCacheAsync();

    this.hasMorePage = this.logicalCurrentPage < this.logicalPageCount;
    appVM.footerVM.onPropertyChanged();
  };

  public filteredBooks: BookItemModel[] = [];
  /** booksを一覧に追加 */
  private addNewBooks = (books: BookItemModel[]): void => {
    books.forEach(book => {
      if (
        (book.isUnlimited || !this.unlimitedOnlyCheckboxVM.checked) && // unlimitedの検索結果に非対象商品が混ざるようになったため
        !this.books.some(
          x =>
            //重複は除外
            x.title === book.title && x.authors[0].name === book.authors[0].name
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
  public localSearchWrodVM = new ExecFilterTextFieldVM(() => {
    this.execFilter();
    appVM.onPropertyChanged();
  });

  public localSorterVM = new LocalSorterVM(() => {
    this.execFilter();
    appVM.onPropertyChanged();
  });

  /** 「ローカル条件」を反映 */
  private execFilter = (): void => {
    this.filteredBooks = this.books
      .filter(
        book =>
          (!this.localSearchWrodVM.value ||
            this.isMatch(book, this.localSearchWrodVM.splitedWords)) &&
          !this.isMatch(book, this.localMuteWordVM.splitedWords)
      )
      .sort((a, b) => {
        switch (this.localSorterVM.selectedKey) {
          case "titleAsc":
            return a.title > b.title ? 1 : -1;
          case "titleDesc":
            return a.title < b.title ? 1 : -1;
          case "authorAsc":
            return a.authors.map(x => x.name).join(",") >
              b.authors.map(x => x.name).join(",")
              ? 1
              : -1;
          case "authorDesc":
            return a.authors.map(x => x.name).join(",") <
              b.authors.map(x => x.name).join(",")
              ? 1
              : -1;
          default:
            return 1;
        }
      });
  };

  private isMatch = (book: BookItemModel, words: string[]): boolean => {
    return (
      words.some(word => book.title.toLocaleLowerCase().includes(word)) ||
      words.some(word =>
        book.authors.some(author =>
          author.name.toLocaleLowerCase().includes(word)
        )
      )
    );
  };

  /** amazon検索ワード */
  public amazonSearchWordVM = new AmazonSearchWordVM(this.onSearchAsync);
  public fromDateVM = new TermVM();
  public toDateVM = new TermVM();
  public categorySelectorVM = new CategorySelectorVM();

  public SearchAuthorVM = new BasicTextFieldVM(this.onSearchAsync);
  public MinPriceVM = new BasicTextFieldVM(this.onSearchAsync);
  public MaxPriceVM = new BasicTextFieldVM(this.onSearchAsync);

  public detailAreaVM = new DetailAreaVM();
  // public FreeQueryVM = new BasicTextFieldVM(this.onSearchAsync);
}
