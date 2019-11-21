declare const chrome: any;
class ChromeUtil {
  public sendMessage = <T = any>(param: object): Promise<T> => {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(param, (result: T) => {
        resolve(result);
      });
    });
  };

  public sendTabMessage = (param: object) => {
    chrome.tabs.getSelected(null, (tab: any) => {
      chrome.tabs.sendMessage(tab.id, param);
    });
  };
}
export const chromeUtil = new ChromeUtil();
