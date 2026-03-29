import { BookItemModel, Author } from "../components/bookItem/BookItemModel";
import { getCurrentRegion } from "../config/RegionConfig";
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
    // テキストベースの判定（メイン）
    const html = div.innerHTML;
    const texts = getCurrentRegion().parse.noResultTexts;
    if (html.includes(texts[0]) && html.includes(texts[1])) return true;

    // クラスベースの判定（補助: 「すべての結果を表示します」的なリダイレクト検知）
    // 実際の検索結果アイテムが存在する場合はfalse（誤検知防止）
    const noResultEl = div.getElementsByClassName(
      "a-size-base a-spacing-base a-color-base a-text-normal"
    );
    if (noResultEl.length > 0) {
      const hasRealResults =
        div.getElementsByClassName("s-asin").length > 0 ||
        div.getElementsByClassName("s-image").length > 0;
      if (!hasRealResults) return true;
    }

    return false;
  };

  /** 検索結果の総ページ数を取得 */
  private getPageCount = (elm: Element): number => {
    let pagination = elm.getElementsByClassName("a-pagination")[0];

    // 一部ユーザーでs-pagination-stripに変わっている。戻ることも?
    if (!pagination) {
      pagination = elm.getElementsByClassName("s-pagination-strip")[0];
    }

    if (!pagination) return 1;

    //pagination.childrenだったがpagination.children[0].childrenに変更されたので両対応
    const children0 = pagination.children[0]?.children
      ? Array.from(pagination.children[0].children)
      : [];
    const elements = Array.from(pagination.children).concat(
      children0
    ) as HTMLElement[];

    const pages = elements
      .map((child) => +(child.innerText || child.textContent || ""))
      .filter((x) => x);
    return pages.length > 0 ? Math.max(...pages) : 1;
  };

  /** responseのrootNodeからbooksを取得 */
  private getBookElements(div: HTMLHtmlElement): HTMLCollection | undefined {
    const results = div.getElementsByClassName("s-result-list");
    if (!results || results.length === 0) return undefined;
    const root = results[0].innerHTML.includes("image")
      ? results[0]
      : results.length > 1
        ? results[1]
        : undefined;
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
      (bookElement.getElementsByClassName("a-offscreen")[0].textContent || "") +
      this.getAltPrice(bookElement)
    );
  };

  /** 「または、￥301で購入」みたいなやつから本来の価格を抽出 */
  private getAltPrice = (bookElement: Element): string => {
    try {
      const innerHTML = bookElement.getElementsByClassName(
        "a-section a-spacing-none a-spacing-top-mini"
      )[0].children[0].children[0].innerHTML;

      const matches = innerHTML.match(getCurrentRegion().parse.currency);
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
      const idx = getCurrentRegion().parse.starRatingIndex;
      return +starRoot.innerHTML.match(/[0-9.]+/g)![idx];
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

    const { sellerLabel, authorPrefix, authorSeparators } = getCurrentRegion().parse;
    let foundPrefix = !authorPrefix; // JPではprefixなし→最初から収集開始

    // 1件目はタイトルが入ってたりするのでスキップ
    for (let i = 1; i < authorRoot.children.length; i++) {
      const child = authorRoot.children[i];
      const val = this.escapeHTML(child.innerHTML).trim();

      if (!val || authorSeparators.includes(val)) continue;
      if (val === sellerLabel) break;

      // USでは "by" の後から著者を収集
      if (authorPrefix && val === authorPrefix) {
        foundPrefix = true;
        continue;
      }
      if (!foundPrefix) continue;

      authors.push({
        name: val,
        url: this.getHrefUrl(child) ? getCurrentRegion().site.domain + this.getHrefUrl(child) : null,
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
    // クラス名が変わることがあるので複数パターン対応
    const titleEl =
      bookElement.getElementsByClassName(
        "a-size-medium a-color-base a-text-normal"
      )[0] ||
      bookElement.getElementsByClassName(
        "a-size-base-plus a-color-base a-text-normal"
      )[0];

    if (!titleEl) throw new Error("title element not found");

    // 1階層深くなっていたので両対応（firstChildがElementの場合とTextNodeの場合）
    const firstChild = titleEl.firstChild as HTMLElement | null;
    const title =
      firstChild?.innerHTML || titleEl.textContent || titleEl.innerHTML;

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
    // クラス名が変わることがあるので複数パターン対応
    const bookLinkElement =
      bookElement.getElementsByClassName(
        "a-link-normal a-text-normal"
      )[0] ||
      bookElement.querySelector(
        "a.a-link-normal[href*='/dp/']"
      );
    if (!bookLinkElement) throw new Error("book link not found");
    return getCurrentRegion().site.domain + this.getHrefUrl(bookLinkElement);
  }
}

const parse = new Parse();
export default parse;
