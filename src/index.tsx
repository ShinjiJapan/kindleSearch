import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

declare const chrome: any;

try {
  if (chrome) {
    chrome.tabs.getSelected(null, (tab: any) => {
      if (!tab.url || tab.url === document.location.href) {
        ReactDOM.render(<App />, document.getElementById("root"));
      } else {
        chrome.tabs.create({ url: document.location.href });
      }
    });
  }
} catch {
  ReactDOM.render(<App />, document.getElementById("root"));
}
serviceWorker.unregister();
