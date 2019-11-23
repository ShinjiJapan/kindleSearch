import { chromeUtil } from "./Chrome";

const baseUrl = "/s";

class Proxy {
  /** Urlパラメータ文字列を作成 */
  private createUrlParamString = (params?: {
    [key: string]: string;
  }): string => {
    if (!params) return "";

    return (
      "?" +
      Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join("&")
    );
  };

  private getAsync = async (
    url: string,
    params?: { [key: string]: string }
  ): Promise<string> => {
    if (document.location.href.startsWith("https")) {
      // serverで実行の場合
      return await this.getAsyncServer(url, params);
    } else {
      // Chrome拡張として実行の場合
      return await this.getAsyncExtention(url, params);
    }
  };

  /** get method */
  private getAsyncServer = async (
    url: string,
    params?: { [key: string]: string }
  ): Promise<string> => {
    const paramsString = this.createUrlParamString(params);
    const response = await fetch(url + paramsString, {
      credentials: "include",
    });
    return await response.text();
  };

  private getAsyncExtention = async (
    url: string,
    params?: { [key: string]: string }
  ): Promise<string> => {
    const paramsString = this.createUrlParamString(params);
    return await chromeUtil.sendMessage<string>({
      type: "fetch",
      url: "https://www.amazon.co.jp" + url + paramsString,
    });
  };

  /** 検索ワードを元にamazonから情報を取得 */
  public fetchPageAsync = async (
    page: number,
    searchWord: string,
    sortKey: string,
    isUnlimitedOnly: boolean,
    queryDateString: string
  ): Promise<string> => {
    const params: {
      [key: string]: string;
    } = {};
    params["k"] = searchWord;
    params["rh"] = isUnlimitedOnly
      ? "n:2250738051,p_n_feature_nineteen_browse-bin:3169286051" +
        queryDateString
      : "n:2250738051" + queryDateString;

    params["i"] = "digital-text";

    params["page"] = page.toString();

    if (sortKey) {
      params["s"] = sortKey;
    }

    return await this.getAsync(baseUrl, params);
  };
}
const proxy = new Proxy();
export default proxy;
