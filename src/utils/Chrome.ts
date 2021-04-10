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

  public sendTabMessage = (param: Record<string, unknown>): void => {
    chrome.tabs.getSelected(null, (tab: any) => {
      chrome.tabs.sendMessage(tab.id, param);
    });
  };
}
export const chromeUtil = new ChromeUtil();
