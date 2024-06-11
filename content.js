var output = [];
var pageReady = "not-loaded";
const eventProps = ["Job #", "Event Date", "Product", "Service Methods", "Custom Work", "Bike QTY", "Bikes", "Contact Name", "Contact Phone", "Address"];
const monthCheck = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var grabNext = false;
var seekMore = false;
var foundMore;
var moreTest = false;
var tempOutput = [];
var temp = [];
var eventsToGrab = [];
var eventCount = 0;
var currentEvent = 0;

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

//creates a Promise which waits 2 second then resolves if notion-peek-renderer is found
function callWait() {
  console.log("called callWait");
  console.log(output);
  pageReady = "loading";

  return new Promise((resolve) => {
    function pageTimeout() {
      console.log("called pageTimeout");
      setTimeout(() => {
        if(document.getElementsByClassName("notion-peek-renderer").length > 0) {
          resolve(document.getElementsByClassName("layout-content"));
        }
        else {
          pageTimeout();
        }
      }, 2000)
    }

    pageTimeout();
  });
}

//finds if more properties need to be loaded on newly rendered page
function moreProperties(collection) {
  console.log("called moreProperties");
  console.log(output);
  var newCollection;
  newCollection = collection.item(1).getElementsByTagName("div");

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
        observer.takeRecords();
        observer.disconnect();
  
        var title = collection.item(0).getElementsByClassName("notion-selectable").item(0).innerText;
        temp = []
        temp.push(title);
        console.log(title);
        for(let i = 0; i < newCollection.length; i++) {
          if(newCollection.item(i).getAttribute("role") == "cell") {
            //console.log(newCollection.item(i).innerText);
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
  console.log("called findProps");
  console.log(output);
  const title = value[0];
  var temp = [];
  temp = Array(eventProps.length + 1);
  temp[0] = title;
  //iterate through all strings grabbed
  for(let i = 0; i < value.length; i++) {
    //iterate through list of event properties
    for(let j = 0; j < eventProps.length; j++) {
      if(value[i] == eventProps[j]) {
        temp[j+1] = value[i+1];
      }
    }
  }

  return temp;
}

//save this to test what is being output
function printValue(value) {
  console.log("called printvalue");
  console.log(output);
  pageReady = "loaded";
  var propFound = findProps(value);
  output.push(propFound);

  currentEvent += 1;
  if(currentEvent < eventCount) {
    if(currentEvent - 1 == 0) {
      console.log("first output");
      console.log(output);
    }
    else if(currentEvent - 1 == 1){
      console.log("second output");
      console.log(output);
    }
    startCallLoop();
  }
  else {
    cleanPrintValueOutput();
    console.log("printValue iteration has completed, here is all events recorded");
    console.log(output);
    document.body.addEventListener('click', putInListener);
  }
}

function startCallLoop() {
  console.log("called startCallLoop")
  console.log(output);
  eventsToGrab[currentEvent].getElementsByTagName("a").item(0).click();
  return callWait().then(moreProperties).then(printValue);
}

function cleanPrintValueOutput() {
  for(let i = 0; i < output.length; i++) {
    temp = [];
    for(let j = 0; j < output[i].length; j++) {
      if(output[i][j] == ("" || "Empty")) {
        if(j == 0) {
          output[i][j] = "[\"null\"";
        }
        else if (j == output[i].length - 1) {
          output[i][j] = "\"null\"]\n";
        }
        else {
          output[i][j] = "\"null\"";
        }
      }
      else if(j == 0) {
        output[i][j] = "[\"" + output[i][j].replaceAll("\n", " ") + "\"";
      }
      else if(j == output[i].length - 1) {
        output[i][j] = "\"" + output[i][j].replaceAll("\n", " ") + "\"]\n";
      }
      else {
        output[i][j] = "\"" + output[i][j].replaceAll("\n", " ") + "\"";
      }
    }
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //if grabbing from a calendar
    if(document.getElementsByClassName("notion-calendar-view").length > 0) {
      console.log("this is a calendar");
      //htmlcollection of all events
      var array = document.getElementsByClassName("notion-collection-item");

      //grab list of all dates in view
      var testDay = document.getElementsByClassName("notion-calendar-view").item(0).getElementsByClassName("notion-calendar-view-day");
      var firstMonth = "";
      var firstWeek;
      var date = new Date();
      for(let i = 0; i < testDay.length; i++) {
        
        if(testDay.item(i).innerText.match(/[A-Z][a-z][a-z]/) && (firstMonth == "")) {
          firstMonth = testDay.item(i).innerText;
        }

        //find row with today's date and set that row as first week
        if(testDay.item(i).innerText == date.getDate() && (!firstWeek)) {
          firstWeek = testDay.item(i).parentNode.parentNode;
        }
      }
      
      //puts all singular rows into an array, then declares which week to start counting from
      var allWeeks = firstWeek.parentNode;
      var allWeeksColl = allWeeks.getElementsByTagName("div");
      var allWeeksArr = [];
      for(let i = 0; i < allWeeksColl.length; i++) {
        if(allWeeksColl.item(i).firstElementChild && allWeeksColl.item(i).firstElementChild.getAttribute("class")) {
          if(allWeeksColl.item(i).firstElementChild.getAttribute("class").search("notion-collection_view_page-block") > -1) {
            allWeeksArr.push(allWeeksColl.item(i));
          }
        }
      }
      var start;
      for(let i = 0; i < allWeeksArr.length; i++) {
        if(allWeeksArr[i] == firstWeek) {
          start = i;
        }
      }

      //specifies which 3 weeks to look at
      var weeksToGrab = [];
      for(let i = start; i < start+3; i++) {
        weeksToGrab.push(allWeeksArr[i]);
      }

      //finds all events in the 3 weeks specified
      for(let i = 0; i < array.length; i++) {
        for(let j = 0; j < weeksToGrab.length; j++) {
          if(array.item(i).parentNode.parentNode == weeksToGrab[j]) {
            eventsToGrab.push(array.item(i));
          }
        }
      }
      eventCount = eventsToGrab.length;

      //bring all this back when done testing how to iterate through calendar
      if(currentEvent < eventCount) {
        startCallLoop();
      }
    }
    //if grabbing from table
    else if(document.getElementsByClassName("notion-table-view-cell").length > 0) {
      var array = document.getElementsByClassName("notion-table-view-cell");
      var temp;
      var colMax = -1;
      //get number of columns
      while(colMax < array.item(colMax + 1).getAttribute("data-col-index")) {
        colMax = array.item(colMax + 1).getAttribute("data-col-index");
      }
      
      //make this outupt look like event output
      //pull each cell into arrays separated by row and push each array into final output
      for(let i = 0; i < array.length; i = i + 3) {
        temp = [];
        for(let j = 0; j <= colMax; j++) {
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
      
      //security prevents saving file from anywhere but body of page, clicking in body opens savefile dalog box
      document.body.addEventListener('click', putInListener);
    }
});