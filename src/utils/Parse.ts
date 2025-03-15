import { BookItemModel, Author } from "../components/bookItem/BookItemModel";
const amazonURL = "https://www.amazon.co.jp";
class Parse {
  /** responseをパース */
  public exec = (
    val: string
  ): { books: BookItemModel[]; pageCount: number } => {
    try {
      console.log(1);
      const div = document.createElement("html");
      div.innerHTML = val;

      console.log(2);
      // 指定されたカテゴリーで1件も見つからなかった場合、勝手に「すべての結果を表示します」とかやられるのでなかったことにする
      if (this.hasNoResult(div)) return { books: [], pageCount: 0 };

      console.log(3);
      const children = this.getBookElements(div);
      console.log(children);

      const books = children
        ? (Array.prototype.map
            .call(children, this.createBookFromElement)
            .filter((x) => x) as BookItemModel[])
        : [];

      console.log(4);
      return { books: books, pageCount: this.getPageCount(div) };
    } catch (ex) {
      throw ex;
    }
  };

  private hasNoResult = (div: HTMLHtmlElement): boolean => {
    if (
      div.getElementsByClassName(
        "a-size-base a-spacing-base a-color-base a-text-normal"
      ).length > 0
    )
      return true;

    return (
      div.innerHTML.includes("の結果は見つかりませんでした") &&
      div.innerHTML.includes("のすべての結果を表示します")
    );
  };

  /** 検索結果の総ページ数を取得 */
  private getPageCount = (elm: Element): number => {
    let pagenation = elm.getElementsByClassName("a-pagination")[0];

    // 一部ユーザーでs-pagination-stripに変わっている。戻ることも?
    if (!pagenation) {
      pagenation = elm.getElementsByClassName("s-pagination-strip")[0];
    }

    if (!pagenation) return 1;

    //pagenation.childrenだったがpagenation.children[0].childrenに変更されたので両対応
    const elemets = Array.from(pagenation.children).concat(
      Array.from(pagenation.children[0].children)
    ) as HTMLElement[];

    return Math.max(
      ...(elemets.map((child) => +child.innerText).filter((x) => x) as any)
    );
  };

  /** responseのrootNodeからbooksを取得 */
  private getBookElements(div: HTMLHtmlElement): HTMLCollection | undefined {
    const results = div.getElementsByClassName("s-result-list");
    if (!results || results.length === 0) return undefined;
    const root = results[0].innerHTML.includes("image")
      ? results[0]
      : results[1];
    return root ? root.children : undefined;
  }

  /** 1件ごとのnodeからBookItemVMを返す */
  private createBookFromElement = (
    bookElement: Element
  ): BookItemModel | undefined => {
    try {
      return {
        title: this.getTitle(bookElement),
        src: this.getImgSrc(bookElement),
        url: this.getBookURL(bookElement),
        authors: this.getAuthors(bookElement),
        star: this.getStar(bookElement),
        price: this.getPrice(bookElement),
        isUnlimited: this.getIsUnlimited(bookElement),
      };
    } catch {
      return undefined;
    }
  };

  /** Unlimited対象作品であるか */
  private getIsUnlimited = (bookElement: Element): boolean => {
    return (
      bookElement.getElementsByClassName("a-icon-kindle-unlimited").length >
        0 ||
      bookElement.getElementsByClassName("apex-kindle-unlimited-badge").length >
        0 ||
      bookElement.getElementsByClassName("apex-kindle-program-badge").length > 0
    );
  };

  /** bookElementから価格を取得 */
  private getPrice = (bookElement: Element): string => {
    return (
      bookElement.getElementsByClassName("a-offscreen")[0].innerHTML +
      this.getAltPrice(bookElement)
    );
  };

  /** 「または、￥301で購入」みたいなやつから本来の価格を抽出 */
  private getAltPrice = (bookElement: Element): string => {
    try {
      const innerHTML = bookElement.getElementsByClassName(
        "a-section a-spacing-none a-spacing-top-mini"
      )[0].children[0].children[0].innerHTML;

      const matches = innerHTML.match(/￥+[0-9\,]+/);
      const match = matches && matches[0] ? matches[0] : "";
      return match ? "(" + match + ")" : "";
    } catch {
      return "";
    }
  };

  /** bookElementから評価を取得 */
  private getStar = (bookElement: Element): number => {
    try {
      const starRoot = bookElement.getElementsByClassName("a-icon-alt")[0];
      return +starRoot.innerHTML.match(/[0-9.]+/g)![1];
    } catch {
      return 0;
    }
  };

  /**
   * 文字列をHTMLエスケープ
   * aタグのinnerHTMLにエスケープせず突っ込むとaタグが表示されないケースがあるので
   */
  private escapeHTML = (val: string): string => {
    const elem = document.createElement("div");
    elem.appendChild(document.createTextNode(val));
    return elem.innerHTML;
  };

  /**
   * bookElementから著者名と著者URLを取得
   */
  private getAuthors(bookElement: Element): Author[] {
    let authorRoot = bookElement.getElementsByClassName(
      "a-row a-size-base a-color-secondary"
    )[0];

    const authors: Author[] = [];

    // 階層が変わっていた場合の対応 2021/04/10時点ではこちらの挙動。
    // ちょくちょく戻ったりするので両対応とする
    if (authorRoot.children.length === 1) {
      authorRoot = authorRoot.children[0];
    }

    // 1件目はタイトルが入ってたりするのでスキップ
    for (let i = 1; i < authorRoot.children.length; i++) {
      const child = authorRoot.children[i];
      const val = this.escapeHTML(child.innerHTML).trim();

      if ("|,、".includes(val)) continue;
      if (val === "販売者:") break;

      authors.push({
        name: val,
        url: this.getHrefUrl(child) ? amazonURL + this.getHrefUrl(child) : null,
      });
    }
    return authors;
  }

  /** aタグ等からhref属性値を取得 */
  private getHrefUrl = (elm: Element): string | null => {
    return elm.attributes.getNamedItem("href")
      ? elm.attributes.getNamedItem("href")!.nodeValue
      : null;
  };

  /** bookElementからタイトルを取得 */
  private getTitle(bookElement: Element): string {
    // 1階層深くなっていたので両対応
    const title =
      (
        bookElement.getElementsByClassName(
          "a-size-medium a-color-base a-text-normal"
        )[0].firstChild as HTMLElement
      ).innerHTML ||
      bookElement.getElementsByClassName(
        "a-size-medium a-color-base a-text-normal"
      )[0].innerHTML;

    return this.escapeHTML(title);
  }

  /** bookElementからサムネイルの画像URLを取得 */
  private getImgSrc(bookElement: Element): string {
    return (
      bookElement
        .getElementsByClassName("s-image")[0]
        .attributes.getNamedItem("src")!.nodeValue || ""
    );
  }

  /** bookElementから本購入ページのURLを取得 */
  private getBookURL(bookElement: Element): string {
    const bookLinkElement = bookElement.getElementsByClassName(
      "a-link-normal a-text-normal"
    )[0];
    return amazonURL + this.getHrefUrl(bookLinkElement);
  }
}

const parse = new Parse();
export default parse;
