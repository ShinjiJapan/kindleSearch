import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

declare const chrome: any;

try {
  if (chrome) {
    chrome.tabs.getSelected(null, (tab: any) => {
      if (tab.url === document.location.href) {
        ReactDOM.render(<App />, document.getElementById("root"));
      } else {
        chrome.tabs.create({ url: document.location.href });
      }
    });
  }
} catch {
  ReactDOM.render(<App />, document.getElementById("root"));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
