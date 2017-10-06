'use strict';
/* global google $ */

let appState = {
  _events: [
    {name:'Hillside Cleanup', date: '10-15-17', time: '10AM', address: '350 N Lemon Ave', city: 'Walnut', zipcode: 91789, detail: 'Bring your own trash bag'},
    {name:'Park Clean Up', date: '10-16-17', time: '9AM', address: '400 Pierre Road', city: 'Walnut', zipcode: 91789, detail: 'Brunch potluck after'}
  ],  
  displayResult: [],
  googlemap: {lat: 34.0544738, lng: -118.2427469},
  mapElement: null,
  searchedZip: 0,
  view: 'intro' //intro, no-event, create, result, congrats
};

const apiKeys = {
  mapEndPoint: 'https://maps.googleapis.com/maps/api/js',
  geoEndPoint: 'https://maps.googleapis.com/maps/api/geocode/json',
  appKey:'AIzaSyCrDeyFqVXRH69AXII81KCWTQGSEKTNCzY'
};

//API CALL
function getGeoCode(address, callback) {
  let {appKey, geoEndPoint, mapEndPoint} = apiKeys;
  const query = {
    address,
    key: appKey
  };
  $.getJSON(geoEndPoint, query, callback);
}

//RENDERING TO DOM
function renderPage(){
  let html = generateDisplayElement(appState.displayResult);
  $('.event-search').html(html);
}

//GENERATE DOM ELEMENT HTML (depending on app state)
function generateDisplayElement(){
  const {view} = appState;
  //DEFAULT: INTRO VIEW
  if(view === 'intro') {
    return (
      `<form action="#" class="view-intro">
      <h2>Search for an event</h2>
      <label for="zip-code-search">Input your zip code to find if there is an upcoming event near you:</label>
      <input type="text" name="zip-code-search" id="zip-code-search" class="zip-code-search js-zip-code-search" placeholder="i.e. 91789">
      <button type="submit" class="submit-search js-submit-search">Search</button>
      <p class="line-break">or</p>
      <button class="create-event js-create-event">Create an Event</button>
    </form>`);
  } if(view === 'no-event') {
    return (
      `<div class="view-no-event js-no-event">
      <h2>There is no upcoming event</h2>
      <p>But that doesn't mean you can't plan one!</p>
      <button class="create-event js-create-event">Create an Event</button>
      <button class="return js-return">Return to Search</button>
      </div>`);
  } if(view === 'create') {
    return (
      `<form action="#" class="view-create js-view-create">
      <fieldset name="create-event">
      <legend>Create an Event</legend>
      <label for="form-event-name">Name of Event</label>
      <input type="text" class="js-event-name" id="form-event-name" name="name" placeholder="i.e. Hillside Clean Up">
      </br>
      <label for="form-date">Date</label>
      <input type="date" class="js-event-date"  id="form-date" name="date" value="2017-10-06">        
      <label for="form-time">Time</label>
      <input type="time" class="js-event-time"  id="form-time" name="time">        
      </br>
      <label for="form-event-address">Meeting Address</label>
      <input type="text" class="js-event-address" id="form-event-address" name="address" placeholder="i.e. 123 Wrangler Way">
      </br>
      <label for="form-city">City</label>
      <input type="text" class="js-event-city"  id="form-city" name="city" placeholder="i.e. Los Angeles">       
      <label for="form-zip-code">Zip Code:</label>
      <input type="number" class="js-event-zip-code"  id="form-zip-code" name="zipcode" placeholder="i.e. 91789">       
      </br>
      <label for="form-event-detail">Additional Details</label>
      <textarea class="js-event-detail" id="form-event-detail" name="detail"></textarea>      
      <button type="submit" class="add-event js-add-event">Add Event</button>
      <button class="return-2 js-return">Return to Search</button>      
    </fieldset>
    </form>`);
  } if(view === 'result') {
    let resultElement = processResult();
    return (
      `
    <h2>Upcoming Events</h2> 
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
      <button class="return js-return">Return to Search</button>
      </div>`);
  }
}

//------------------------STATE EDITING FUNCTIONS-----------------------//

//Obtain new event values and assign to State
function processCreateEvent(formData){
  const newEvent = {};
  //Obtain and assign event values
  $('fieldset').find('input').each(function(index, element){
    const { name, value } = element;
    newEvent[name] = value;
  });
  //Populate State with event values
  appState._events.push(newEvent);
  console.log(appState._events);
  //Change view
  appState.view = 'congrats';
} 

//Obtain and assign complete address of clicked event to String
function obtainAddress(index){
  const {displayResult} = appState;
  const clickedEvent = displayResult[index];
  const {address, city, zipcode} = clickedEvent;
  const fullAddress = `${address} ${city} ${zipcode}`;
  console.log(fullAddress);

  //Send to API to obtain Geo Code
  getGeoCode(fullAddress, fetchGeo);
}

//Process user input (zip code) and search in database
function processInput(zipCodeValue) {
  //Log zip code to state
  let {_events, searchedZip, view} = appState;
  searchedZip = zipCodeValue;  
  appState.displayResult = [];  
  for(let key of _events) {
    //conditional: if it's a match, change view to 'result'

    if(key.zipcode == searchedZip) {
      appState.displayResult.push(key);
      appState.view = 'result';
      processResult();
    }
    //conditional: if it's not a match, change view to 'no-event'
    else appState.view = 'no-event';
  }
  console.log(appState.displayResult);
}

//If there are results to display, return converted HTML elements in String
function processResult(){
  //loop through all displayResult Objects
  const elementArray = [];
  appState.displayResult.map((event, index) => {
    elementArray.push(
      `<li data-value="${index}">
        Event: <span class="js-list-name">${event.name}</span><br/>
        Date: <span class="js-list-date">${event.date}</span><br/>
        Time: <span class="js-list-time">${event.time}</span><br/>
        Address: <span class="js-list-address">${event.address}</span>, <span class="js-city">${event.city}</span>, <span class="js-zipcode">${event.zipcode}</span><br/>
        Detail: <span class="js-list-detail">${event.detail}</span><br/>
        <button class="google-map js-google-map">Google Map</button>
      </li>`);
  });
  //BONUS Feature: sort display chronologically 
  //function compare(a,b) {
  //   if (a.date < b.date)
  //     return -1;
  //   if (a.date > b.date)
  //     return 1;
  //   return 0;
  // }
  // elementArray.sort(compare);
  let elementString = elementArray.join('');
  return elementString;
}

//Obtain Geo Code from address String
function fetchGeo(data) {
  const returnedData = data.results['0'].geometry.location;
  appState.googlemap.lat = returnedData.lat;
  appState.googlemap.lng = returnedData.lng;
  console.log(appState.googlemap.lat, appState.googlemap.lng);

  const { lat, lng } = appState.googlemap;
  let uluru = {lat, lng};
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: uluru
  });
  let marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
  //Expand Map on Main Page
  $('#map').css('height', '80%');

  initMap();
}

//------------------------CLICK HANDLERS-------------------------//

//USER clicks to search for existing event with same zip code
function handleSearchClick (){
  //Listen for User click: Search Event & obtain value of input (zipcode)
  $('.event-search').on('submit', '.view-intro', event => {
    event.preventDefault();
    let searchInput = $('.js-zip-code-search').val();
    let zipCodeValue = parseInt(searchInput, 10);
    console.log(`'handleSearchClick' ran; obtained value: ${zipCodeValue}`);    
    processInput(zipCodeValue);
    renderPage();
  });
}

//USER clicks to create new event
function handleCreateClick(){
  //Listen for User click: Create Event
  $('.event-search').on('click', '.js-create-event', event => {
    console.log('`handleCreateClick` ran`]');
    appState.view = 'create';
    renderPage();
  });
}

//USER clicks to add input to event database
function handleAddEventButton(){
  //Listen to User click: Add Event
  $('.event-search').on('submit', '.js-view-create', event => {
    event.preventDefault();
    console.log('`handleAddEventButton` ran`]');    
    processCreateEvent(event.currentTarget);
    renderPage();
  });
}

//USER clicks to return to Search page
function handleReturnToSearchClick(){
  //Listen to User click: Return to Search
  $('.event-search').on('click', '.js-return', event => {
    console.log('`handleReturnToSearchClick` ran');
    appState.view = 'intro';
    //Collapse Google Map div
    $('#map').css('height', '0%');
    renderPage();
  });
}


//USER clicks to request Google Map Information
function handleGoogleMapClick(){
  $('.event-search').on('click', '.js-google-map', event => {
    //Listen to User click:Google Map
    console.log('`handleGoogleMapClick` ran');
    //Obtain event target's Index value
    let clickedListIndex = $(event.target).parent().data('value');
    obtainAddress(clickedListIndex);
  });
}

function initMap() {
  $(listenToClicks);
}

function listenToClicks(){
  renderPage();
  handleSearchClick();
  handleCreateClick();
  handleAddEventButton();
  handleReturnToSearchClick();
  handleGoogleMapClick();
}