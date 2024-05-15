console.log("here1");

/*chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: "OFF",
    });
  });
*/

/*window.onload = function() {
    var array = document.getElementsByClassName("notion-table-view-cell");
    console.log("printing onload info: " + array.item(0).innerText);
};*/

window.onmouseup = function() {
    var array = document.getElementsByClassName("notion-table-view-cell");
    console.log("printing onmouseup info: " + array.item(0).innerText);
};

window.addEventListener('load', function() {
    var array = document.getElementsByClassName("notion-table-view-cell");
    console.log("printing onload info: " + array.item(0).innerText);
})

setTimeout(() => {
    var array = document.getElementsByClassName("notion-table-view-cell")
    console.log("printing timeout info: " + array.item(0).innerText);
}, 10000);

console.log(document.getElementsByClassName("notion-table-view-cell"));

console.log(document.getElementsByTagName('meta'));
document.getElementsByTagName('head')[0].innerHTML += '<meta http-equiv="Content-Security-Policy" content="default-src gap://ready file://* *; style-src \'self\' http://* https://* \'unsafe-inline\'; script-src \'self\' http://* https://* \'unsafe-inline\' \'unsafe-eval\'">';
const site = "https://www.notion.so";
//var script = document.createElement('script');
//script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";

//document.getElementsByTagName('head')[0].appendChild(script);

console.log("here2");

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(site)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    await $(document).ready(function () {
        console.log("here3");
        if (nextState == 'ON') {
            window.location = "ADD LOCAL PATH\\test.html";
        }
    });

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });
  }
});