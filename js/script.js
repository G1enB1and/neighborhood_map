let map;

// Create a new blank array for all the listing markers.
let markers = [];

/**
* @description Initialize Map
*/
function initMap() {
	
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
  
  // These are the listings that will be shown to the user.
  // Normally we'd have these in a database instead.
  let locations = [
    {title: 'Cafe Brazil', location: {lat: 32.844404, lng: -96.773435}},
	{title: 'Cafe Brazil', location: {lat: 32.784975, lng: -96.783027}},
    {title: 'Starbucks', location: {lat: 32.864403, lng: -96.660265}},
	{title: 'Starbucks', location: {lat: 32.811152, lng: -96.623135}},
	{title: 'Starbucks', location: {lat: 32.746236, lng: -96.585969}},
	{title: 'Starbucks', location: {lat: 32.866008, lng: -96.763481}},
	{title: 'Black Forest Coffee', location: {lat: 32.86609, lng: -96.764503}},
    {title: 'Dennys', location: {lat: 32.864872, lng: -96.660885}},
	{title: 'Dennys', location: {lat: 32.819224, lng: -96.786784}},
	{title: 'Dennys', location: {lat: 32.841681, lng: -96.593621}},
	{title: 'Dennys', location: {lat: 32.789396, lng: -96.594197}},
    {title: 'iHop', location: {lat: 32.857431, lng: -96.647735}},
	{title: 'iHop', location: {lat: 32.859325, lng: -96.769432}},
	{title: 'iHop', location: {lat: 32.768661, lng: -96.625545}},
    {title: 'Goldmine', location: {lat: 32.876755, lng: -96.631224}},
	{title: 'Beef House', location: {lat: 32.878382, lng: -96.647637}},
	{title: 'Dunkin Donuts', location: {lat: 32.861236, lng: -96.643064}},
	{title: 'Dunkin Donuts', location: {lat: 32.952197, lng: -96.769473}},
	{title: 'White Rock Coffee', location: {lat: 32.864607, lng: -96.712334}}
  ];
  
  let largeInfowindow = new google.maps.InfoWindow();

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    let position = locations[i].location;
    let title = locations[i].title;
	
    // Create a marker per location, and put into markers array.
    let marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
	  icon: 'img/coffee_marker_green.png',
      id: i
    }); // end of let marker = new google.maps.Marker({})
	
    // Push the marker to our array of markers.
    markers.push(marker);
	
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
	
	// Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon('img/coffee_marker_teal.png');
    });
    marker.addListener('mouseout', function() {
      this.setIcon('img/coffee_marker_green.png');
    });
	
  } // end of for (var i = 0; i < locations.length; i++)
  
  // Show listings at load.
  showListings(); 
  
} // end of initMap()

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
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
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