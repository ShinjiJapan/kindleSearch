declare const chrome: any;
class ChromeUtil {
  public sendMessage = <T = any>(
    param: Record<string, unknown>
  ): Promise<T> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(param, (result: T) => {
        resolve(result);
      });
    });
  };
}
export const chromeUtil = new ChromeUtil();
