import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 拡張機能ではアイコンクリック時に background.js が別タブで index.html を開く
const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
// serviceWorker.unregister();
