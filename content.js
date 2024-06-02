var output = [];
var pageReady = "not-loaded";


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

async function callWriteFile() {
  try {
    await console.log("WRITING TO FILE");

    var newHandle = await getNewFileHandle();
    await console.log("this is the new handle" + newHandle);
    await writeFile(newHandle, output);
  }
  catch (err) {
    console.error(err.name, err.message);
  }
}

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

function moreProperties(collection) {
  console.log("this is moreProperties collection: " + collection);
  const newCollection = collection.getElementsByTagName("div");
  console.log("last item in newCollection: " + newCollection.item(newCollection.length - 1).innerText);

  //look for hidden properties
  if(/[0-9]+\smore\sproperties/.test(newCollection.item(newCollection.length - 1).innerText)) {
    console.log("the collection has more properties");
    newCollection.item(newCollection.length - 1).click();
    newCollection = collection.getElementsByTagName("div");
  }

  var temp = [];
  for(let i = 0; i < newCollection.length; i++) {
    temp.push(newCollection.item(i).innerText);
  }

  return temp;
}

function printValue(value) {
  var output = [];
  console.log("this is value: " + value.item(1));

  output.push(value.item(0).innerText);
  output = output.concat(moreProperties(value.item(1)));

  /*for(let i = 0; i < value.length; i++){
    console.log(value.item(i).innerText);  
  }*/
  
  pageReady = "loaded";
  console.log("pageReady is " + pageReady);

  return output;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    var promiseTest = "promise not resolved";
    //creates a Promise which waits half a second then resolves if notion-peek-renderer is found
    function callWait() {
      console.log("in callWait");
      pageReady = "loading";
      const wait = new Promise((resolve, reject) => {
        setTimeout(() => {
          if(document.getElementsByClassName("notion-peek-renderer").length > 0) {
            promiseTest = "promise is being resolved";
            //console.log(promiseTest);
            //console.log(document.getElementsByClassName("layout-content"));
            console.log("pageReady in callWait(): " + pageReady);

            resolve(document.getElementsByClassName("layout-content"));
          }
          else {
            console.log(promiseTest);
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
        
        //console.log("entering while loop");
        console.log("before callWait");
        pageInfo = callWait().then(printValue);
        console.log("after callWait");
        //console.log("this is after wait");
      }

      while(pageReady != "loaded") {
        console.log("page not loaded");
        console.log(pageInfo);
      }

      console.log("page loaded and left while loop");
      console.log(pageInfo);
      
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
  
        /*if(i<array.length){
          console.log("i: " + i + ";array length: " + array.length);
        }*/
        
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