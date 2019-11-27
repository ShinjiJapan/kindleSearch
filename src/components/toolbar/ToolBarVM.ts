import { BindableBase } from "../../BindableBase";
import { appVM } from "../../AppVM";
import proxy from "../../utils/Proxy";
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
  public virtualCurrentPage = 1;
  public currentPage = 0;
  public pageCount = 0;
  public hasMorePage = false;
  private books: BookItemModel[] = [];

  public isProgress = false;

  /** 検索処理 */
  public onSearchAsync = async () => {
    this.books = [];
    this.currentPage = 0;
    this.pageCount = -1;
    this.isProgress = true;

    this.virtualCurrentPage = 1;
    this.hasMorePage = false;
    appVM.onPropertyChanged();
    for (let i = 0; i < this.bulkPageCount; i++) {
      if (this.currentPage === this.pageCount) {
        this.isProgress = false;
        appVM.onPropertyChanged();
        return;
      }
      const books = await this.getPageAsync(++this.currentPage);
      this.addNewBooks(books);
      this.execFilter();
      if (i === this.bulkPageCount - 1) {
        this.isProgress = false;
      }
      appVM.onPropertyChanged();
    }

    if (this.pageCount > this.bulkPageCount) {
      this.getCacheTask = this.getCacheAsync();
      this.hasMorePage = true;
    }

    this.onPropertyChanged();
    //footerの表示を更新するため必要
    appVM.onPropertyChanged(); // ●循環参照！パラメータで受け取るとか
  };

  private get createQueryDateString(): string {
    const from = this.fromDateVM.value;
    const to = this.toDateVM.value;
    if (!from && !to) return "";
    return `,p_n_date:${this.toYYYYMMDD(from)}-${this.toYYYYMMDD(to)}`;
  }

  private toYYYYMMDD = (date?: Date): string => {
    if (!date) return "";
    return (
      date.getFullYear().toString() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2)
    );
  };

  public virtualPageCount = -1;
  /** 1ページ取得 */
  private getPageAsync = async (page: number): Promise<BookItemModel[]> => {
    const response = await proxy.fetchPageAsync(
      page,
      this.amazonSearchWordVM.value,
      this.amazonSortDropdownVM.selectedKey || "",
      this.unlimitedOnlyCheckboxVM.checked,
      this.createQueryDateString,
      this.categorySelectorVM.selectedKey,
      this.SearchAuthorVM.value,
      this.MinPriceVM.value,
      this.MaxPriceVM.value
    );
    const result = parse.exec(response);

    if (this.pageCount < 0) {
      this.pageCount = result.pageCount;
      this.virtualPageCount = Math.ceil(this.pageCount / this.bulkPageCount);
    }
    return result.books;
  };

  // 先読み分
  private cacheBooks: BookItemModel[] = [];
  /** 先読み */
  private getCacheAsync = async () => {
    this.cacheBooks = [];
    for (let i = 0; i < this.bulkPageCount; i++) {
      if (this.currentPage > this.pageCount) {
        return;
      }
      const books = await this.getPageAsync(this.currentPage++);
      this.cacheBooks = this.cacheBooks.concat(books);
    }
  };

  private getCacheTask: Promise<void>;
  /** 追加ページ取得 */
  public getMorePageAsync = async (): Promise<void> => {
    this.virtualCurrentPage++;
    this.hasMorePage = false;
    await this.getCacheTask;
    this.addNewBooks(this.cacheBooks);

    this.getCacheTask = this.getCacheAsync();

    this.hasMorePage = this.virtualCurrentPage < this.virtualPageCount;
  };

  public filteredBooks: BookItemModel[] = [];
  /** booksを一覧に追加 */
  private addNewBooks = (books: BookItemModel[]) => {
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
  private execFilter = () => {
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
