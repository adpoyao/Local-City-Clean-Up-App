'use strict';
/* global $ */

let appState = {
  _events: [
    {name:'Hillside Cleanup2', date: '10-15-17', time: '10AM', address: '350 N Lemon Ave', city: 'Walnut', zipcode: 91789, detail: 'Bring your own trash bag'}
  ],  

  displayResult: [
  ],
  googlemap: null,
  searchedZip: 0,
  view: 'intro' //intro, no-event, create, result, congrats
};

const apiKeys = {
  mapEndPoint: 'https://maps.googleapis.com/maps/api/js',
  geoEndPoint: 'https://maps.googleapis.com/maps/api/geocode/json',
  appKey:'AIzaSyCrDeyFqVXRH69AXII81KCWTQGSEKTNCzY'
};

function getGeoCode(address, callback) {
  let {appKey, geoEndPoint, mapEndPoint} = apiKeys;
  const query = {
    address,
    key: appKey
  };
  $.getJSON(geoEndPoint, query, callback);
  //   => data.results[0].geometry.location.lat
  // ));
}

getGeoCode('Los Angeles', event =>
  console.log(event)
);

function renderPage(){
  let html = generateDisplayElement(appState.displayResult);
  $('.event-search').html(html);
}

function generateDisplayElement(){
  const {view} = appState;
  if(view === 'intro') {
    return (
      `<form action="#" class="view-intro">
      <h2>Search for an event</h2>
      <label for="zip-code-search">Input your zip code to find if there is an upcoming event near you:</label>
      <input type="text" name="zip-code-search" id="zip-code-search" class="zip-code-search js-zip-code-search" placeholder="i.e. 91789">
      <button type="submit" class="submit-search js-submit-search">Search</button>
      <p>or</p>
      <button class="create-event js-create-event">Create an Event</button>
    </form>`);
  } if(view === 'no-event') {
    return (
      `<div class="no-event js-no-event">
      <h2>There is no upcoming event</h2>
      <p>But that doesn't mean you can't plan one!</p>
      <button class="create-event js-create-event">Create an Event</button>
      <button class="return js-return-">Return to Search</button>
      </div>`);
  } if(view === 'create') {
    return (
      `<form action="#" class="view-create js-view-create">
      <fieldset name="create-event">
      <legend>Create an Event</legend>
      <label for="form-event-name">Name of Event</label>
      <input type="text" class="js-event-name" id="form-event-name" name="name" placeholder="i.e. Hillside Clean Up">
      <label for="form-date">Date:</label>
      <input type="date" class="js-event-date"  id="form-date" name="date" value="2017-10-06">        
      <label for="form-time">Time:</label>
      <input type="time" class="js-event-time"  id="form-time" name="time">        
      <label for="form-event-address">Meeting Address</label>
      <input type="text" class="js-event-address" id="form-event-address" name="address" placeholder="i.e. 123 Wrangler Way">
      <label for="form-city">City::</label>
      <input type="text" class="js-event-city"  id="form-city" name="city" placeholder="i.e. Los Angeles">       
      <label for="form-zip-code">Zip Code:</label>
      <input type="number" class="js-event-zip-code"  id="form-zip-code" name="zip-code" placeholder="i.e. 91789">       
      <label for="form-event-detail">Additional Details</label>
      <input type="textbox" class="js-event-detail" id="form-event-detail" name="detail" placeholder="i.e. Rubber gloves to be provided">      
      <button type="submit" class="add-event js-add-event">Add Event</button>
    </fieldset>
    </form>`);
  } if(view === 'result') {
    let resultElement = processResult();
    return (
      `
    <h2>Upcoming Event</h2> 
    <div class="view-result">    
    <ul class="result js-result">
    ${resultElement}
    </ul>
    <button class="return js-return">Return to Search</button>
    </div>`
    );
      
  } if(view === 'congrats') {
    return (
      `<div class="view-congrats"> 
      <p>Your event has been successfully created!</p>    
      <button>Return to Results</button>
        </li>
      </ul>
    </div>`);
  }
}

//INTRO VIEW by Default
function handleSearchClick (){
  //Listen to User Click Search Event & Get value of input
  $('.event-search').on('submit', '.view-intro', event => {
    event.preventDefault();
    let searchInput = $('.js-zip-code-search').val();
    let zipCodeValue = parseInt(searchInput, 10);
    processInput(zipCodeValue);
    console.log(zipCodeValue);
    renderPage();
  });
}

function processInput(zipCodeValue) {
  //Update STATE to remember the zip code
  //2 Conditions: 
  //if there is a match, change view to 'result'
  //if there is no match, change view to 'no event'
  let {_events, searchedZip, view} = appState;
  searchedZip = zipCodeValue;
  //DO FIND method instead
  for(let key of _events) {
    if(key.zipcode === searchedZip) {
      appState.displayResult.push(appState._events[key]);
      appState.view = 'result';
    }
    else appState.view = 'no-event';
  }
}

function processResult(){
  //reset display result
  appState.displayResult = [];
  //loop through all displayResult Objects
  const elementArray = [];
  for(let event of appState._events){
    elementArray.push(
      `<li>
        ${event.name} <br/>
        Date: ${event.date} <br/>
        Time: ${event.time} <br/>
        Address: ${event.address}, ${event.city}, ${event.zipcode} <br/>
        Detail: ${event.detail} <br/>
        GoogleMap 
        <button>Google Map</button>
      </li>`);
  }
  let elementString = elementArray.join('');
  return elementString;
}

//CREATE & NO EVENT VIEW
//Listen for User click on Create Button
function handleCreateClick(){
  $('.event-search').on('click', '.js-create-event', event => {
    appState.view = 'create';
    renderPage();
  });
}

//Listen to Add Event Button
function handleAddEventButton(){
  $('.event-search').on('submit', '.js-view-create', event => {
    event.preventDefault();
    processCreateEvent(event.currentTarget);
    renderPage();
  });
}

//Obtain event values and populate STATE
//Render listing to DOM
//Change view to "RESULT"
function processCreateEvent(formData){
  const newEvent = {};
  $('fieldset').find('input').each(function(index, element){
    const { name, value } = element;
    newEvent[name] = value;
  });
  appState._events.push(newEvent);
  appState.view = 'congrats';
  console.log(appState._events, appState.view);
} 
//Listen to user click on Return to Result
function handleReturnToResultClick(){
  $('.event-search').on('click', '.view-congrats', event => {
    console.log('`handleReturnToResultClick` ran');
    appState.view = 'result';
    renderPage();
  });
}

//Listen to user click on Return to Search
function handleReturnToSearchClick(){
  $('.event-search').on('click', '.js-return', event => {
    console.log('`handleReturnToSearchClick` ran');
    appState.view = 'intro';
    renderPage();
  });
}

function listenToClicks(){
  renderPage();
  handleSearchClick();
  handleCreateClick();
  handleAddEventButton();
  handleReturnToResultClick();
  handleReturnToSearchClick();
}

$(listenToClicks);

//RESULT VIEW
//Listen to User Click on Individual event (li)
//Expands (or) Show list details w/ Google Map//Listens to User Click to return to "INTRO" view

//------
// function initMap(){
//     displaySearchBar();
// }

// function displaySearchBar(){
//   $('#search'.html(`<form></form>`));
// }

// function handleSearchSubmit() {
//   new google.maps.Map()$(`#map`)[0] //document.getElementById(`map),
//   { center: { lng, lat}}
// }