'use strict';
/* global google $ */

let appState = {
  _events: [
    // {name:'Hillside Cleanup', date: '10-15-17', time: '10AM', address: '350 N Lemon Ave', city: 'Walnut', zipcode: 91789, detail: 'Bring your own trash bag'},
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

function getGeoCode(address, callback) {
  let {appKey, geoEndPoint, mapEndPoint} = apiKeys;
  const query = {
    address,
    key: appKey
  };
  $.getJSON(geoEndPoint, query, callback);
}

//RENDERING & HTML ELEMENTS
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
      <button class="return js-return">Return to Search</button>
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
    <div class="js-list-map"></div>    
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

//INTRO VIEW (by Default)
function handleSearchClick (){
  //Listen to User Click Search Event & obtain value of input (zip)
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
  //Log zipcode to state
  //conditional: if it's a match, change view to 'result'
  //conditional: if it's not a match, change view to 'no-event'
  let {_events, searchedZip, view} = appState;
  searchedZip = zipCodeValue;  
  appState.displayResult = [];  
  for(let key of _events) {
    console.log(key);
    if(key.zipcode === searchedZip) {
      appState.displayResult.push(key);
      appState.view = 'result';
    }
    else appState.view = 'no-event';
  }
  console.log(appState.displayResult);
}

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
  // function compare(a,b) {
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
  console.log(appState._events);
  appState.view = 'congrats';
} 

//Listen to user click on Return to Search
function handleReturnToSearchClick(){
  $('.event-search').on('click', '.js-return', event => {
    console.log('`handleReturnToSearchClick` ran');
    appState.view = 'intro';
    $('#map').css('height', '0%');
    renderPage();
  });
}

//Listen to user click on Google Map
//Find index from clicked position on displayed list
//Search stateApp.displayResult with index and get address
//Feed to Google Map API
function handleGoogleMapClick(){
  $('.event-search').on('click', '.js-google-map', event => {
    const mapElement = $(event.target).siblings('.js-list-map')[0];
    console.log('`handleGoogleMapClick` ran');
    let clickedListIndex = $(event.target).parent().data('value');
    obtainAddress(clickedListIndex);
    const { lat, lng } = appState.googlemap;
    appState.mapElement = new google.maps.Map(document.getElementById('map'), {
      center: {lat: lat, lng: lng},
      zoom: 13
    });
    $('#map').css('height', '100%');
  });
}

function obtainAddress(index){
  const {displayResult} = appState;
  const clickedEvent = displayResult[index];
  const {address, city, zipcode} = clickedEvent;
  const fullAddress = `${address} ${city} ${zipcode}`;
  console.log(fullAddress);

  getGeoCode(fullAddress, fetchGeo);
}

//Fetch Geos (lat & long) -- callback function
function fetchGeo(data) {
  const returnedData = data.results['0'].geometry.location;
  appState.googlemap.lat = returnedData.lat;
  appState.googlemap.lng = returnedData.lng;
  console.log(appState.googlemap.lat, appState.googlemap.lng);

  initMap();
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

//BUG
//After Creating New Event, all results aren't displaying
