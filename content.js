var output = [];
var pageReady = "not-loaded";
const eventProps = ["Job #", "Event Date", "Product", "Service Methods", "Custom Work", "Bike QTY", "Bikes", "Contact Name", "Contact Phone", "Address"];
var grabNext = false;
var seekMore = false;
var foundMore;
var moreTest = false;
var tempOutput = [];

function testfun() {
  console.log("**********TESTFUN HAS BEEN CALLED**********");
}


async function getNewFileHandle() {
  const options = {
    types: [
      {
        description: 'Text Files',
        accept: {
          'text/plain': ['.txt'],
        },
      },
    ],
  };
  const handle = await window.showSaveFilePicker(options);
  return handle;
}

async function writeFile(fileHandle, contents) {
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}

/*async function callWriteFile() {
  try {
    await console.log("WRITING TO FILE");

    var newHandle = await getNewFileHandle();
    await console.log("this is the new handle" + newHandle);
    await writeFile(newHandle, output);
  }
  catch (err) {
    console.error(err.name, err.message);
  }
}*/

async function putInListener() {
  try {
    await console.log("WRITING TO FILE");

    var newHandle = await getNewFileHandle();
    await console.log("this is the new handle" + newHandle);
    await writeFile(newHandle, output.toString());
    await undoListener()
  }
  catch (err) {
    await console.error(err.name, err.message);
  }
}

function undoListener() {
  console.log("removing listener");
  document.body.removeEventListener('click', putInListener);
}

//finds if more properties need to be loaded on newly rendered page
function moreProperties(collection) {
  var newCollection = collection.item(1).getElementsByTagName("div");

  //fix this so it only grabs each unique text once
  var temp = [];
  for(let i = 0; i < newCollection.length; i++) {
    temp.push(newCollection.item(i).innerText);
  }

  //look for hidden properties
  if(/[0-9]+\smore\sproperties/.test(newCollection.item(newCollection.length - 1).innerText)) {
    moreTest = true;
    temp = [];
    
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutationList) => {
        console.log("*****A CHANGE TO THE DIV HAS BEEN MADE*****");
        observer.disconnect();
  
        var title = collection.item(0).getElementsByClassName("notion-selectable").item(0).innerText;
        temp.push(title);
        console.log(title);
        for(let i = 0; i < newCollection.length; i++) {
          if(newCollection.item(i).getAttribute("role") == "cell") {
            temp.push(newCollection.item(i).innerText);
          }
        }
  
        resolve(temp);
      });
  
      observer.observe(document.getElementsByClassName("layout-content").item(1), {
        childList: true,
        characterData: true,
        subtree: true
      });
      newCollection.item(newCollection.length - 1).click();
    });
    
  }
  else {
    console.log("COLLECTION DID NOT HAVE MORE PROPERTIES");
    return new Promise((resolve) => {
      resolve(temp);
    });
  }
}

function changeFoundMore(newCollection) {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutationList) => {
      console.log("*****A CHANGE TO THE DIV HAS BEEN MADE*****");
      for(let i = 0; i < mutationList.length; i++) {
        console.log("MUTATION " + i);
        console.log(mutationList[i]);
      }
      observer.disconnect();

      var temp = [];
      for(let i = 0; i < newCollection.length; i++) {
        temp.push(newCollection.item(i).innerText);
      }

      resolve(temp);
    });

    observer.observe(document.getElementsByClassName("layout-content").item(1), {
      childList: true,
      characterData: true,
      subtree: true
    });
    newCollection.item(newCollection.length - 1).click();
  })
}

//pull needed info
function findProps(value) {
  var temp = Array(eventProps.length);
  //iterate through all strings grabbed
  for(let i = 0; i < value.length; i++) {
    //iterate through list of event properties
    for(let j = 0; j < eventProps.length; j++) {
      if(value[i] == eventProps[j]) {
        temp[j] = value[i+1];
      }
    }
  }

  return temp;
}

//save this to test what is being output
function printValue(value) {
  pageReady = "loaded";
  console.log("pageReady is " + pageReady);

  console.log("pageInfo being assigned");
  pageInfo = findProps(value);
  console.log("pageInfo is :");
  console.log(pageInfo);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    //creates a Promise which waits half a second then resolves if notion-peek-renderer is found
    function callWait() {
      console.log("in callWait");
      pageReady = "loading";
      const wait = new Promise((resolve, reject) => {
        setTimeout(() => {
          if(document.getElementsByClassName("notion-peek-renderer").length > 0) {
            resolve(document.getElementsByClassName("layout-content"));
          }
          else {
            reject("page not peeking");
          }
        }, 500)
      });

      return wait;
    }

    //if grabbing from a calendar
    if(document.getElementsByClassName("notion-calendar-view").length > 0) {
      console.log("this is a calendar");
      var array = document.getElementsByClassName("notion-collection-item");
      array.item(0).getElementsByTagName("a").item(0).click();


      var pageInfo;
      while(pageReady == "not-loaded") {
        
        callWait().then(moreProperties).then(printValue);
      }
    }
    else if(document.getElementsByClassName("notion-table-view-cell").length > 0) {
      var array = document.getElementsByClassName("notion-table-view-cell");
      var temp;
      var colMax = -1;
      while(colMax < array.item(colMax + 1).getAttribute("data-col-index")) {
        colMax = array.item(colMax + 1).getAttribute("data-col-index");
      }
      
      for(let i = 0; i < array.length; i = i + 3) {
        temp = [];
        
        for(let j = 0; j <= colMax; j++){
          
          if(array.item(i + j).innerText == "") {
            temp.push("\"null\"");
          }
          else {
            temp.push("\"" + array.item(i + j).innerText + "\"");
          }
        }
  
  
        output.push(temp);
      }
  
      console.log("SENDING RESPONSE: " + output);
  
      sendResponse({output: output});
  
      document.body.addEventListener('click', putInListener);
    }
});