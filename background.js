
const site = "https://www.notion.so/*";

async function sendMessageToActiveTab(message) {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true, url: site });
  var res = await chrome.tabs.sendMessage(tab.id, message);
  return res;
}

chrome.action.onClicked.addListener(async (tab) => {
  await console.log("SENDING MESSAGE");
  var res = await sendMessageToActiveTab({});

  await console.log("RESPONSE RECEIVED: " + res.output);
});