import { chromeUtil } from "./Chrome";

const baseUrl = "/s";

class Connection {
  /** Urlパラメータ文字列を作成 */
  private createUrlParamString = (params?: {
    [key: string]: string;
  }): string => {
    if (!params) return "";

    return (
      "?" +
      Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
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
    params: UrlParams,
    page: string
  ): Promise<string> => {
    return await this.getAsync(baseUrl, { ...params, page: page });
  };
}

export type UrlParams = {
  k: string;
  rh: string;
  bbn: string;
  s: string;
  node: string;
};

const connection = new Connection();
export default connection;
