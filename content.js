var output = [];


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

function callPutIn() {
  putInListener();
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(document.getElementsByClassName("notion-calendar-view").length > 0) {
      console.log("this is a calendar");
      console.log(document.getElementsByClassName("notion-calendar-view"));
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
})