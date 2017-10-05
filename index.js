'use strict';
/* global $ */

let appState = {
  _events: [
    {zipcode: 91789, name:'Hillside Cleanup', date: 10-15-17, time: '10AM', address: '350 N Lemon Ave'}
  ],
  displayResult: [],
  googlemap: null,
  searchedZip: 0,
  view: 'intro' //intro, no-event, create, result
};

const apiKeys = {
  mapEndPoint: 'https://maps.googleapis.com/maps/api/js',
  geoEndPoint: 'https://maps.googleapis.com/maps/api/geocode/json',
  appKey:'AIzaSyCrDeyFqVXRH69AXII81KCWTQGSEKTNCzY'
};
// const geoAppKey = 'AIzaSyDdSL1rMniEVUbwR1FWumnK44KI-vMP6B4';

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
  const {view} = appState;
  let html;
  if(view === 'intro') {
    html = (
      `<div class="view-intro">
      <h2>Search for an event</h2>
      <label for="zip-code-search">Input your zip code to find if there is an upcoming event near you:</label>
      <input type="text" name="zip-code-search" id="zip-code-search" class="zip-code-search js-zip-code-search" placeholder="i.e. 91789">
      <button type="submit" class="submit-search js-submit-search">Search</button>
      <p>or</p>
      <button class="create-event js-create-event">Create an Event</button>
    </div>`
    );
  } if(view === 'no-event') {
    html = (
      `<div class="no-event js-no-event">
      <h2>There is no upcoming event</h2>
      <p>But that doesn't mean you can't plan one!</p>
      <button class="create-event js-create-event">Create an Event</button>
    </div>`
    );
  } if(view === 'create') {
    html = (
      `<div class="view-create js-view-create">
      <fieldset name="create-event">
      <legend>Create an Event</legend>
      <label for="form-event-name">Name of Event</label>
      <input type="text" id="form-event-name" name="form-event-name" placeholder="i.e. Hillside Clean Up">
      <label for="form-date">Date:</label>
      <input type="date" id="form-date" name="form-date">        
      <label for="form-time">Time:</label>
      <input type="time" id="form-time" name="form-time">        
      <label for="zip-code">Zip Code:</label>
      <input type="number" id="form-zip-code" name="form-zip-code" placeholder="i.e. 91789">        
      <button class="add-event js-add-event">Add Event</button>
    </fieldset>
    </div>`
    );
  } if(view === 'result') {
    html = (
      `<div class="view-result"> 
      <h2>Upcoming Event</h2>    
      <ul class="result js-result">
        <li>
          Hillside Clean Up <br/>
          Date: 10/15/2017 <br/>
          Time: 10:00AM <br/>
          Address: 123 Street, Los Angeles CA 91789 <br/>
          GoogleMap <br/>
          <button>Click here for Street View/Directions</button>
        </li>
      </ul>
    </div>`
    );
  }
  $('#event-search').html(html);
}

//INTRO VIEW by Default
function handleSearchClick (){
  //Listen to User Click Search Event & Get value of input
  $('#event-search').submit(event => {
    event.preventDefault();
    let searchInput = $('.js-zip-code-search').val();
    let zipCodeValue = parseInt(searchInput, 10);
    processInput(zipCodeValue);
    renderPage();
  });
}

function processInput(zipCodeValue) {
  //Update STATE to remember the zip code
  //Condition: 
  //if there is a match, change view to 'result'
  //if there is no match, change view to 'no event'
  let {_events, searchedZip, view} = appState;
  searchedZip = zipCodeValue;
  for(let key of _events) {
    if(key.zipcode === searchedZip) {
      view = 'result';
      break;
    } else {
      view = 'no event';
    }
  }
}

//CREATE & NO EVENT VIEW
//Listen for User click on Create Button
function handleCreateClick(){
  $('#event-search').on('click', '.js-create-event', event => {
    appState.view = 'create';
    renderPage();
  });
}

// //Listen to Add Event Button
// function handleAddEventButton(){
//   $('#event-search').on()
// }
  //Obtain event values and populate STATE
  //Render listing to DOM
  //Change view to "RESULT"
// function processCreateEvent(){

// }




function listenToClicks(){
  renderPage();
  handleSearchClick();
  handleCreateClick();
}

$(listenToClicks);

//If there is at least one event: Change view to "RESULT"
  //User may see all results listing
  //User click on each listing to access detailed result

//RESULT VIEW
  //Listen to User Click on Individual event (li)
  //Expands (or) Show list details w/ Google Map
  //Listens to User Click to return to "INTRO" view


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