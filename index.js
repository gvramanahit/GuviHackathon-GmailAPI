
    // Client ID and API key from the Developer Console
    var CLIENT_ID = '506617947301-l12avn4jauuetvt85088uipi3hh3604j.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyD78gT6CFDvCYBu9Yz7Cot9MngzrbNozKM';

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

    var authorizeButton = document.getElementById('authorize_button');
    var signoutButton = document.getElementById('signout_button');

    /**
     *  On load, called to load the auth2 library and API client library.
     */
    function handleClientLoad() {
    gapi.load('client:auth2', initClient);
    }

    /**
        *  Initializes the API client library and sets up sign-in state
        *  listeners.
        */
    function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
    }

    /**
        *  Called when the signed in status changes, to update the UI
        *  appropriately. After a sign-in, the API is called.
        */
    function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        //Accesses the mail box from this function
        listLabels();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
    }

    /**
        *  Sign in the user upon button click.
        */
    function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
    }

    /**
        *  Sign out the user upon button click.
        */
    function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    }

    /**
        * Append a pre element to the body containing the given message
        * as its text node. Used to display the results of the API call.
        *
        * @param {string} message Text to be placed in pre element.
        */
    function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
    }

    /**
        * Print all Labels in the authorized user's inbox. If no labels
        * are found an appropriate message is printed.
        */

    const mailsGlobal = [];

    async function listLabels() {

        let responseA = await gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'labelIds': 'INBOX',
            'maxResults': 10
        })
        for(let i=0;i<responseA.result.messages.length;i++){
            let responseB = await gapi.client.gmail.users.messages.get({
                'userId': 'me',
                'id' : responseA.result.messages[i].id
            })
            mailsGlobal.push(responseB.result);
            }
        gmail();
        }
      

function gmail(){
    //To create container
    let container = document.createElement('div');
    container.setAttribute('class','container');

    //To design the parent div
    let parentDiv = document.createElement('div');
    parentDiv.setAttribute('class','row');


    //To design the label
    let labelDiv = document.createElement('div');
    labelDiv.setAttribute('class','col-2');

    let labelParent = document.createElement('div');
    labelParent.setAttribute('class','row');

    let inboxLabel = document.createElement('div');
    inboxLabel.setAttribute('class','col-12');
    inboxLabel.innerHTML = 'Inbox';
    inboxLabel.setAttribute('id','inboxLabel');

    let sentLabel = document.createElement('div');
    sentLabel.setAttribute('class','col-12');
    sentLabel.innerHTML = 'Sent';
    sentLabel.setAttribute('id','sentLabel');

    //To design the mailbox div
    let mailBoxDiv = document.createElement('div');
    mailBoxDiv.setAttribute('class','col-10');

    //To design the mail box table
    let mailTable = document.createElement('table');
    mailTable.setAttribute('class','table');

    let tableHead = document.createElement('thead');
    tableHead.setAttribute('class','thead-light');

    let tableRow1 = document.createElement('tr');
    let headVal1 = document.createElement('th');
    headVal1.setAttribute('scope','col');
    headVal1.innerHTML = '#';
    let headVal2 = document.createElement('th');
    headVal2.setAttribute('scope','col');
    headVal2.innerHTML = 'From';
    let headVal3 = document.createElement('th');
    headVal3.setAttribute('scope','col');
    headVal3.innerHTML = 'Subject';
    let headVal4 = document.createElement('th');
    headVal4.setAttribute('scope','col');
    headVal4.innerHTML = 'Date';

    let tableBody = document.createElement('tbody');


    tableRow1.append(headVal1,headVal2,headVal3,headVal4);
    tableHead.append(tableRow1);

    console.log(mailsGlobal);
    //To populate the inbox 
    for(let i=0;i<mailsGlobal.length;i++){
        let serialNoA = i+1;
        let fromA = getHeader(mailsGlobal[i].payload.headers, 'From');
        let subjectA = getHeader(mailsGlobal[i].payload.headers, 'Subject');
        let dateA = getHeader(mailsGlobal[i].payload.headers, 'Date').substring(5,16);


        //To populate the emails.
        let tableRowA = document.createElement('tr');
        tableRowA.setAttribute('class','tableRow');
        let rowValA = document.createElement('th');
        rowValA.setAttribute('scope','row');
        rowValA.innerHTML = serialNoA;
        let rowValB = document.createElement('td');
        rowValB.innerHTML = fromA;
        let rowValC = document.createElement('td');
        rowValC.innerHTML = subjectA;
        let rowValD = document.createElement('td');
        rowValD.innerHTML = dateA;

        tableRowA.append(rowValA,rowValB,rowValC,rowValD);
        tableBody.append(tableRowA);
    }

    mailTable.append(tableHead,tableBody);
    mailBoxDiv.append(mailTable);


    labelParent.append(inboxLabel,sentLabel);
    labelDiv.append(labelParent);
    parentDiv.append(labelDiv,mailBoxDiv);
    container.append(parentDiv);
    document.body.append(container);


    //var mails = getHeader(response1.result.payload.headers, 'Subject');

    //This function is used to fetch the proper header value from the message response.
    function getHeader(headers, index) {
    var value = '';

    for(let i=0;i<headers.length;i++){
        if(headers[i].name === index){
        value = headers[i].value;
        }
    }
    return value;
    }
}



