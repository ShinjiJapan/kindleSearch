import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

declare const chrome: any;

if (chrome && chrome.tabs) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tab: any) => {
    console.log(JSON.stringify(chrome));
    if (tab[0]?.url) {
      // ポップアップで開いた場合
      chrome.tabs.create({ url: document.location.href });
    } else {
      // ポップアップから別タブで開いた後
      ReactDOM.render(<App />, document.getElementById("root"));
    }
  });
} else {
  // ローカル実行の場合
  ReactDOM.render(<App />, document.getElementById("root"));
}
serviceWorker.unregister();
