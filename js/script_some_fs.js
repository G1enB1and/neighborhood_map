let map;

// Create a new blank array for all the listing markers.
markers = [];

// These are the listings that will be shown to the user.
let coffeeShopLocations = ko.observableArray([
  {id: 1, title: 'Cafe Brazil 1', location: {lat: 32.844404, lng: -96.773435}},
  {id: 2, title: 'Cafe Brazil 2', location: {lat: 32.784975, lng: -96.783027}},
  {id: 3, title: 'Starbucks 1', location: {lat: 32.864403, lng: -96.660265}},
  {id: 4, title: 'Starbucks 2', location: {lat: 32.811152, lng: -96.623135}},
  {id: 5, title: 'Starbucks 3', location: {lat: 32.746236, lng: -96.585969}},
  {id: 6, title: 'Black Forest Coffee', location: {lat: 32.86609, lng: -96.764503}},
  {id: 7, title: 'Dennys 1', location: {lat: 32.819224, lng: -96.786784}},
  {id: 8, title: 'Dennys 2', location: {lat: 32.841681, lng: -96.593621}},
  {id: 9, title: 'Dennys 3', location: {lat: 32.789396, lng: -96.594197}},
  {id: 10, title: 'iHop 1', location: {lat: 32.857431, lng: -96.647735}},
  {id: 11, title: 'iHop 2', location: {lat: 32.859325, lng: -96.769432}},
  {id: 12, title: 'iHop 3', location: {lat: 32.768661, lng: -96.625545}},
  {id: 13, title: 'Goldmine', location: {lat: 32.876755, lng: -96.631224}},
  {id: 14, title: 'Beef House', location: {lat: 32.878382, lng: -96.647637}},
  {id: 15, title: 'Dunkin Donuts 1', location: {lat: 32.861236, lng: -96.643064}},
  {id: 16, title: 'Dunkin Donuts 2', location: {lat: 32.952197, lng: -96.769473}},
  {id: 17, title: 'White Rock Coffee', location: {lat: 32.864607, lng: -96.712334}}
]);

let selectedLocation = "";

// activate knockout.js and apply bindings for coffeeShopLocations
// when all dependant DOM elements have been loaded and are ready.
$(document).ready(function() {
  ko.applyBindings(coffeeShopLocations);
});

let fsEndpoint = 'https://api.foursquare.com/v2/venues/search';
let fsVersion = '20180323';
let fsLL = '32.776664,-96.796988';
let fsQuery = 'coffee';
let fsLimit = '17';
let fsClientID = 'E2QMBO1XOX1I3HM2TQ4BMEGVLA3ZHCHN1WG4RM40RGZJIZHH';
let fsClientSecret = 'JSOKMIPYKJW52UBZDXRT3V1NUONCMIEWTJX3VTANTHY4NUC5';
let fsParams = 'v=' + encodeURIComponent(fsVersion)
  + '&' + 'll=' + encodeURIComponent(fsLL)
  + '&' + 'query=' + encodeURIComponent(fsQuery)
  + '&' + 'limit=' + encodeURIComponent(fsLimit)
  + '&' + 'client_id=' + encodeURIComponent(fsClientID)
  + '&' + 'client_secret=' + encodeURIComponent(fsClientSecret);
let fsURL = fsEndpoint + '?' + fsParams;

let getCoffeeShopsFromFS = new XMLHttpRequest();
getCoffeeShopsFromFS.open('GET', fsURL);

getCoffeeShopsFromFS.onload = function() {
  let coffeeShopsFromFS = JSON.parse(getCoffeeShopsFromFS.responseText);
  let coffeeShopVenues = coffeeShopsFromFS.response.venues;

  //console.log(coffeeShopVenues);

  assignCoffeeShops(coffeeShopVenues, coffeeShopLocations);

}; // end of getCoffeeShopsFromFS

getCoffeeShopsFromFS.send();

function assignCoffeeShops(coffeeShopVenues, coffeeShopLocations) {

  coffeeShopLocations.push({id: 18, title: 'TEST', location: {lat: 32.809224, lng: -96.796784}});
  //setMarkers();
  //showListings();

  for (let i = 0; i < coffeeShopVenues.length; i++) {
    coffeeShopLocations()[i].title = coffeeShopVenues[i].name;
    //console.log(coffeeShopLocations()[i].title);
  } // end of for()
} // end of function assignCoffeeShops()


/*
function getFoursquare(){
  let self = this;

  $.ajax({
    url: fsURL,
    dataType: 'json',
    success: function(data) {
      venues = data.response.venues;

      for (let i = 0; i < venues.length; i++) {
        coffeeShopLocations()[i].title = venues[i].name;
        console.log(coffeeShopLocations()[i].title);
      } // end of for()

    } // end of success
  }); // end of $.ajax
  // coffeeShopLocations()[0].title = 'TEST'; // works outside of $.ajax
  // TODO: fix concurance or scope or async
}; //  end of function getFoursquare()

getFoursquare();
*/

/**
* @description Initialize Map
*/
function initMap() {
  let self = this;

  // Create a styles array to use with the map.
  let styles = [{
    'featureType': 'administrative',
    'elementType': 'all',
    'stylers': [{
      'saturation': '-100'
    }]
  },{
    'featureType': 'administrative.province',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'off'
    }]
  },{
    'featureType': 'landscape',
    'elementType': 'all',
    'stylers': [{
      'saturation': '-100'
    },{
      'lightness': '65'
    },{
      'visibility': 'on'
    }]
  },{
    'featureType': 'poi',
    'elementType': 'all',
    'stylers': [{
      'saturation': '-100'
    },{
      'lightness': '50'
    },{
      'visibility': 'simplified'
    }]
  },{
    'featureType': 'poi',
    'elementType': 'labels.icon',
    'stylers': [{
      'visibility': 'off'
    }]
  },{
    'featureType': 'road',
    'elementType': 'all',
    'stylers': [{
      'saturation': '-100'
    }]
  },{
    'featureType': 'road.highway',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'simplified'
    }]
  },{
    'featureType': 'road.arterial',
    'elementType': 'all',
    'stylers': [{
      'lightness': '30'
    }]
  },{
    'featureType': 'road.local',
    'elementType': 'all',
    'stylers': [{
      'lightness': '40'
    }]
  },{
    'featureType': 'transit',
    'elementType': 'all',
    'stylers': [{
      'saturation': '-100'
    },{
      'visibility': 'simplified'
    }]
  },{
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [{
      'hue': '#ffff00'
    },{
      'lightness': '-25'
    },{
      'saturation': '-97'
    }]
  },{
    'featureType': 'water',
    'elementType': 'labels',
    'stylers': [{
      'lightness': '-25'
    },{
      'saturation': '-100'
    }]
  }]; // end of map styles array

  /**
  * @description creates a new map - only center and zoom are required.
  * @constructor
  */
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.776664, lng: -96.796988},
    zoom: 11,
	  styles: styles,
	  mapTypeControl: false
  });

  largeInfowindow = new google.maps.InfoWindow();

  setMarkers();

  // Show listings at load.
  showListings();

} // end of initMap()

function setMarkers() {
  // The following group uses the location array to create an array of markers on initialize.
  for (let i = 0; i < coffeeShopLocations().length; i++) {
    // Get the position from the location array.
    let position = coffeeShopLocations()[i].location;
    let title = coffeeShopLocations()[i].title;

    //console.log(coffeeShopLocations()[i].title);

    // Create a marker per location, and put into markers array.
    marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
	    icon: 'img/coffee_marker_green.png',
      id: i
    }); // end of marker = new google.maps.Marker({})

    // Push the marker to our array of markers.
    markers.push(marker);

    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
	    let self = this;
	    selectedLocation = self;

      populateInfoWindow(this, largeInfowindow);

	    // set all marker icons back to green and remove animations
      for (let x = 0; x < markers.length; x++) {
        markers[x].setIcon('img/coffee_marker_green.png');
	      markers[x].setAnimation(null);
      } // end of for()

	    // remove locationTitleBold class from all titles elements
	    for (let x = 1; x < markers.length+1; x++) {
        let elem = document.getElementById(x);
	      elem.classList.remove('locationTitleBold');
      } // end of for()

	    // set the selected location's marker icon to teal
      self.setIcon('img/coffee_marker_teal.png');
      // set the selected location's marker animation to bounce
      self.setAnimation(google.maps.Animation.BOUNCE);
      // remove bounce animation after 1 bounce (700 ms)
      setTimeout(function(){ self.setAnimation(null); }, 700);

	    // apply locationTitleBold class to selected location's title element in list
	    let selectedLocationTitleElementById = document.getElementById(selectedLocation.id+1);
	    selectedLocationTitleElementById.classList.add('locationTitleBold');

    }); // end marker.addListener(click)

	  // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
	  marker.addListener('mouseover', function() {
	    let self = this;
      self.setIcon('img/coffee_marker_teal.png');
    }); // end marker.addListener(mouseover)
	  marker.addListener('mouseout', function() {
	    let self = this;
	    if (selectedLocation != self) {
        self.setIcon('img/coffee_marker_green.png');
	    } // end if (marker != self)
    }); // end marker.addListener(mouseout)

  } // end of for (var i = 0; i < locations.length; i++)
} // end of setMarkers()

/**
* @description This function changes the marker icon of the selected location.
* @param {object} coffeeShopLocation
*/
selectLocation = function(coffeeShopLocation) {
  let self = this;
  let locationIndex = coffeeShopLocations().indexOf(coffeeShopLocation);
  selectedLocation = this;

  // set all marker icons back to green and remove animations
  for (let i = 0; i < markers.length; i++) {
    markers[i].setIcon('img/coffee_marker_green.png');
	  markers[i].setAnimation(null);
  }

  // remove locationTitleBold class from all titles elements
  for (let x = 1; x < markers.length+1; x++) {
    let elem = document.getElementById(x);
	  elem.classList.remove('locationTitleBold');
  } // end of for()

  // set the selected location's marker icon to teal
  markers[locationIndex].setIcon('img/coffee_marker_teal.png');
  // set the selected location's marker animation to bounce
  markers[locationIndex].setAnimation(google.maps.Animation.BOUNCE);
  // remove bounce animation after 1 bounce (700 ms)
  setTimeout(function(){ markers[locationIndex].setAnimation(null); }, 700);

  // apply locationTitleBold class to selected location's title element in list
  let selectedLocationTitleElementById = document.getElementById(selectedLocation.id);
  selectedLocationTitleElementById.classList.add('locationTitleBold');

  // Open InfoWindow at the marker for the location clicked
  populateInfoWindow(markers[locationIndex], largeInfowindow);

} // end of SelectLocation

/**
* @description This function populates the infowindow when the marker is clicked.
* @param {object} marker
* @param {object} inforwindow
*/
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);

    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });

	// Close infowindow if empty map area is clicked
	google.maps.event.addListener(map, "click", function(event) {
      infowindow.close();
	  infowindow.marker = null;

	  // set all marker icons back to green and remove animations
      for (let y = 0; y < markers.length; y++) {
        markers[y].setIcon('img/coffee_marker_green.png');
	    markers[y].setAnimation(null);
      } // end of for()

	  // remove locationTitleBold class from all titles elements
      for (let x = 1; x < markers.length+1; x++) {
        let elem = document.getElementById(x);
	    elem.classList.remove('locationTitleBold');
      } // end of for()

    }); // end of google.maps.event.addListener(map, "click", function(event)

  } // end of if(infowindow.marker != marker)
} // end of populateInfoWindow()

/**
* @description This function will loop through the markers array and display them all.
*/
function showListings() {
  let bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
} // end of showListings()

/**
* @description This function will loop through the listings and hide them all.
*/
function hideListings() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
} // end of hideListings

function filterFunction() {
  // Declare variables
  let filterInput, filter, i, txtValue;
  filterInput = document.getElementById('txtFilterInput');
  filter = filterInput.value.toUpperCase();

  // get dom elements and text for each location in list
  for (let x = 1; x < markers.length+1; x++) {
    let elem = document.getElementById(x);
    txtValue = elem.textContent || elem.innerText;

    // compare input to text
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      // remove locationTitleHide class to show elements
      elem.parentElement.classList.remove('locationTitleHide'); //show
      // show map marker
      markers[x-1].setMap(map);
    } else {
      // add locationTitleHide class to hide elements
      elem.parentElement.classList.add('locationTitleHide'); //hide
      // hide map marker
      markers[x-1].setMap(null);
    }
  } // end of for()
} // end of filterFunction()
