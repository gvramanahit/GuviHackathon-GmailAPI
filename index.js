
    // Client ID and API key from the Developer Console
    var CLIENT_ID = '506617947301-l12avn4jauuetvt85088uipi3hh3604j.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyD78gT6CFDvCYBu9Yz7Cot9MngzrbNozKM';

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = 'https://www.googleapis.com/auth/gmail.modify ' +
                    'https://www.googleapis.com/auth/gmail.send' ;

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
        signoutButton.style.display = 'none';
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
    document.getElementById('container').innerHTML = ''
    mailsGlobal.length = 0;
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
        
        //To display the inbox layout
        gmail();
        let responseA = await gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'labelIds': 'INBOX',
            'maxResults': 20
        })
        for(let i=0;i<responseA.result.messages.length;i++){
            let responseB = await gapi.client.gmail.users.messages.get({
                'userId': 'me',
                'id' : responseA.result.messages[i].id
            })
            mailsGlobal.push(responseB.result);
            }
        addEmails();
        }
      

function gmail(){
    
    //To create container
    let container = document.createElement('div');
    container.setAttribute('class','container');
    container.setAttribute('id','container');

    //To design header div
    let headerDiv = document.createElement('div');
    headerDiv.setAttribute('class','row');

    let headerLogo = document.createElement('div');
    headerLogo.setAttribute('class','col-3');

    let logo = document.createElement('img');
    logo.setAttribute('class','logo');
    logo.setAttribute('src','gmail-logo.png');
    headerLogo.append(logo);

    welcomeDiv = document.createElement('div');
    welcomeDiv.setAttribute('class','col-6 divWelcome');
    welcomeDiv.setAttribute('id','welcomeDiv');
    welcomeDiv.innerHTML = 'Welcome, ';

    headerButton = document.createElement('div');
    headerButton.setAttribute('class','col-3 divPadding');

    let buttonA = document.createElement('button');
    buttonA.setAttribute('class','btn btn-primary');
    buttonA.setAttribute('id','buttonA');
    buttonA.innerHTML = 'Sign Out';
    buttonA.onclick = handleSignoutClick;
    headerButton.append(buttonA);

    let headerTwo = document.createElement('div');
    headerTwo.setAttribute('class','row');

    let composeDiv = document.createElement('div');
    composeDiv.setAttribute('class','col-1 divInbox');

    let composeLogo = document.createElement('img');
    composeLogo.setAttribute('class','logo1');
    composeLogo.setAttribute('src','compose-logo.png');

    let composeLink = document.createElement('a')
    composeLink.setAttribute('href','#compose-modal');
    composeLink.setAttribute('data-toggle','modal');

    composeLink.append(composeLogo);
    composeDiv.append(composeLink);

    let headerTitle = document.createElement('div');
    headerTitle.setAttribute('class','col-2 divInbox');
    headerTitle.innerHTML = 'Inbox';

    headerTwo.append(composeDiv,headerTitle);

    headerDiv.append(headerLogo,welcomeDiv,headerButton);
    container.append(headerDiv,headerTwo);
    document.body.append(container);


    //To design the parent div
    let parentDiv = document.createElement('div');
    parentDiv.setAttribute('class','row');

    //To design the mailbox div
    let mailBoxDiv = document.createElement('div');
    mailBoxDiv.setAttribute('class','col-12 mt-2');

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
    tableBody.setAttribute('id','tableBody')


    tableRow1.append(headVal1,headVal2,headVal3,headVal4);
    tableHead.append(tableRow1);

    console.log(mailsGlobal);
    
    mailTable.append(tableHead,tableBody);
    mailBoxDiv.append(mailTable);

    parentDiv.append(mailBoxDiv);
    container.append(parentDiv);
    
}

    //To populate the inbox 
function addEmails(){

    let state = {
        'querySet' : mailsGlobal,
        'page' : 1,
        'rows' : 10
    }

    buildTable();

    function pagination(querySet,page,rows){
        let trimStart = (page - 1) * rows;
        let trimEnd = trimStart + rows;

        let trimmedData = querySet.slice(trimStart,trimEnd);

        let pages = Math.ceil(querySet.length / rows);
        
        return {
            'querySet' : trimmedData,
            'pages' : pages
        }
    }

    function clickA(currentPage) {
        document.getElementById('tableBody').innerHTML = '';
        state.page = currentPage;
        buildTable();
    }

    function pageButtons(pages){
        let container1 = document.createElement('div');
        container1.setAttribute('class','container');

        container1.innerHTML = '';

        for(let page=1;page<= pages;page++){
            container1.innerHTML += `<button value=${page} onclick="clickA(${page})" class="btn btn-sm btn-info">${page}</button>`
        }
        document.body.append(container1);
    }

    function buildTable(){

        document.getElementById('tableBody').innerHTML = '';
        let me = getHeader(mailsGlobal[0].payload.headers, 'To');
        document.getElementById('welcomeDiv').innerHTML = 'Welcome, ' + me;

        let data = pagination(state.querySet,state.page,state.rows);

        for(let i=0;i<data.querySet.length;i++){

            let serialNoA = (state.page - 1) * state.rows + i + 1;
            let fromA = getHeader(data.querySet[i].payload.headers, 'From');
            let subjectA = getHeader(data.querySet[i].payload.headers, 'Subject');
            let dateA = getHeader(data.querySet[i].payload.headers, 'Date').substring(5,16);


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
            document.getElementById('tableBody').append(tableRowA);
        }
        pageButtons(data.pages)
    }

}


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


function sendEmail(){
    let composeTo = document.getElementById('compose-to').value;
    let composeSubject = document.getElementById('compose-subject').value;
    let composeMessage = document.getElementById('compose-message').value;

    const message =
        "From: gvramanahit@gmail.com\r\n" + 
        "To: " + composeTo +  "\r\n" +
        "Subject: " + composeSubject + "\r\n\r\n" + composeMessage;


// The body needs to be base64url encoded.
const encodedMessage = btoa(message)

const reallyEncodedMessage = encodedMessage.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

gapi.client.gmail.users.messages.send({
    userId: 'me',
    resource: {
        'raw': reallyEncodedMessage
    }
}).then(function () { console.log("done!")});
}



