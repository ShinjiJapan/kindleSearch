chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "fetch":
      fetch(message.url)
        .then(response => response.text())
        .then(text => sendResponse(text));
      return true;
    case "log":
      console.log(message.text);
      return true;
    default:
      return true;
  }
});
