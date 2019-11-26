import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

declare const chrome: any;

if (chrome && chrome.tabs) {
  chrome.tabs.getSelected(null, (tab: any) => {
    if (tab.url) {
      // ポップアップで開いた場合
      chrome.tabs.create({ url: document.location.href });
    } else {
      // ポップアップから全画面で開いた後
      ReactDOM.render(<App />, document.getElementById("root"));
    }
  });
} else {
  // ローカル実行の場合
  ReactDOM.render(<App />, document.getElementById("root"));
}
serviceWorker.unregister();
