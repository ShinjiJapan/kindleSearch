import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

declare const chrome: any;

if (chrome && chrome.tabs) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tab: any) => {
    console.log(JSON.stringify(chrome));
    if (tab[0]?.url) {
      // ポップアップで開いた場合
      chrome.tabs.create({ url: document.location.href });
    } else {
      // ポップアップから別タブで開いた後
      const container = document.getElementById("root");
      const root = createRoot(container!);
      root.render(<App />);
    }
  });
} else {
  // ローカル実行の場合
  const container = document.getElementById("root");
  const root = createRoot(container!);
  root.render(<App />);
}
// serviceWorker.unregister();
