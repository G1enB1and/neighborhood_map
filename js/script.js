const FS_ENDPOINT = 'https://api.foursquare.com/v2/venues/search';
const FS_VERSION = '20180323';
const FS_INTENT = 'match'; // default 'checkin' if searching for more than 1
const FS_LIMIT = '1';
const FS_GROUP = 'venue';
const FS_PHOTO_LIMIT = '1';
const FS_PHOTO_SIZE = '150x150';
const FS_CLIENT_ID = 'E2QMBO1XOX1I3HM2TQ4BMEGVLA3ZHCHN1WG4RM40RGZJIZHH';
const FS_CLIENT_SECRET = 'JSOKMIPYKJW52UBZDXRT3V1NUONCMIEWTJX3VTANTHY4NUC5';
const FS_QUERY = 'coffee';
const CENTER_LL = {lat: 32.776664, lng: -96.796988}; // center of map area

window.map;

let myViewModel = {
  // Create new blank arrays
  fsVenueID: [],
  fsParams: [],
  fsURL: [],
  fsPhoto: [],
  fsPhotoEndpoint: [],
  fsPhotoRequestURL: [],
  markers: [],

  fsPhotoParams: 'v=' + encodeURIComponent(FS_VERSION)
    + '&' + 'group=' + encodeURIComponent(FS_GROUP)
    + '&' + 'limit=' + encodeURIComponent(FS_PHOTO_LIMIT)
    + '&' + 'client_id=' + encodeURIComponent(FS_CLIENT_ID)
    + '&' + 'client_secret=' + encodeURIComponent(FS_CLIENT_SECRET),
  fsPhotoPrefix: '',
  fsPhotoSuffix: '',

  // These are the listings that will be shown to the user.
  locationsKOOA: ko.observableArray([
    {id: 1, title: 'Cafe Brazil', location: {lat: 32.844404, lng: -96.773435}},
    {id: 2, title: 'Cafe Brazil', location: {lat: 32.784975, lng: -96.783027}},
    {id: 3, title: 'Starbucks', location: {lat: 32.864403, lng: -96.660265}},
    {id: 4, title: 'Starbucks', location: {lat: 32.811152, lng: -96.623135}},
    {id: 5, title: 'Starbucks', location: {lat: 32.746236, lng: -96.585969}},
    {id: 6, title: 'Black Forest Coffee', location: {lat: 32.86609, lng: -96.764503}},
    {id: 7, title: 'Dennys', location: {lat: 32.819224, lng: -96.786784}},
    {id: 8, title: 'Dennys', location: {lat: 32.841681, lng: -96.593621}},
    {id: 9, title: 'Dennys', location: {lat: 32.789396, lng: -96.594197}},
    {id: 10, title: 'iHop', location: {lat: 32.857431, lng: -96.647735}},
    {id: 11, title: 'iHop', location: {lat: 32.859325, lng: -96.769432}},
    {id: 12, title: 'iHop', location: {lat: 32.768661, lng: -96.625545}},
    {id: 13, title: 'Goldmine', location: {lat: 32.876755, lng: -96.631224}},
    {id: 14, title: 'Beef House', location: {lat: 32.878382, lng: -96.647637}},
    {id: 15, title: 'Dunkin Donuts', location: {lat: 32.861236, lng: -96.643064}},
    {id: 16, title: 'Dunkin Donuts', location: {lat: 32.952197, lng: -96.769473}},
    {id: 17, title: 'White Rock Coffee', location: {lat: 32.864607, lng: -96.712334}}
  ]), // end of myViewModel.locationsKOOA

  selectedLocationKOO: ko.observable(''),

  getLL: function(i) {
    return this.locationsKOOA()[i].location.lat + ','
      + this.locationsKOOA()[i].location.lng;
  }, // end of getLL

  getTitle: function(i) {
    return this.locationsKOOA()[i].title;
  }, // end of getTitle

  setFsURLs: function() {
    for (let i = 0; i < myViewModel.locationsKOOA().length; i++) {
      myViewModel.fsParams[i] = 'v=' + encodeURIComponent(FS_VERSION)
        + '&' + 'intent=' + encodeURIComponent(FS_INTENT)
        + '&' + 'll=' + encodeURIComponent(myViewModel.getLL(i))
        + '&' + 'name=' + encodeURIComponent(myViewModel.getTitle(i))
        //+ '&' + 'query=' + encodeURIComponent(FS_QUERY)
        //+ '&' + 'limit=' + encodeURIComponent(FS_LIMIT)
        + '&' + 'client_id=' + encodeURIComponent(FS_CLIENT_ID)
        + '&' + 'client_secret=' + encodeURIComponent(FS_CLIENT_SECRET);
      myViewModel.fsURL[i] = FS_ENDPOINT + '?' + myViewModel.fsParams[i];
    } // end of for
  }, // end of setFsURLs

  filterFunction: function() {
    // Declare variables
    let filterInput, filter, i, txtValue;
    filterInput = document.getElementById('txtFilterInput');
    filter = filterInput.value.toUpperCase();

    // get dom elements and text for each location in list
    for (let x = 1; x < myViewModel.markers.length+1; x++) {
      let elem = document.getElementById(x);
      txtValue = elem.textContent || elem.innerText;

      // compare input to text
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        // remove locationTitleHide class to show elements
        elem.parentElement.classList.remove('locationTitleHide'); //show
        // show map marker
        myViewModel.markers[x-1].setMap(map);
      } else {
        // add locationTitleHide class to hide elements
        elem.parentElement.classList.add('locationTitleHide'); //hide
        // hide map marker
        myViewModel.markers[x-1].setMap(null);
      }
    } // end of for()
  } // end of filterFunction()

}; // end of myViewModel

// activate knockout.js and apply bindings for myViewModel
// when all dependant DOM elements have been loaded and are ready.
$(document).ready(function() {
  ko.applyBindings(myViewModel);
});


myViewModel.setFsURLs();


async function populateVenueIDsAsync() {
  let populateVenueIDs = new Promise(function(resolve, reject) {
    let promisesA = [];

    for (let y = 0; y < myViewModel.locationsKOOA().length; y++) {
      promisesA.push(new Promise(function (resolve, reject) {
        let getVenueIDFromFS = new XMLHttpRequest();
        getVenueIDFromFS.open('GET', myViewModel.fsURL[y]);
        try {
          getVenueIDFromFS.onload = function() {
            let responseFromFS = JSON.parse(getVenueIDFromFS.responseText);
            myViewModel.fsVenueID[y] = responseFromFS.response.venues[0].id;
            resolve(console.log('venue ' + y + ' id: ' + myViewModel.fsVenueID[y]));
          }; // end of getVenueIDFromFS.onload
        } catch(error) {
          alert('Failed to get venue id from Foursquare.');
          reject(console.log('venue '+ y +
            ' failed to get vanue id from foursquare. Error: '
            + error.description));
        }
        getVenueIDFromFS.send();
      })); // end of promises
    } // end of for

    return Promise.all(promisesA)
      .then(function () {
        resolve(console.log('Done getting Venue IDs'));
        populateFsPhotoRequestURLsAsync();
      }) // end of .then

  }); // end of populateVenueIDs
} // end of async function populateVenueIDsAsync()


async function populateFsPhotoRequestURLsAsync() {
  let populateFsPhotoRequestURLs = new Promise(function(resolve, reject) {
    let promisesB = [];

    for (let y = 0; y < myViewModel.locationsKOOA().length; y++) {
      promisesB.push(new Promise(function (resolve) {
        myViewModel.fsPhotoEndpoint[y] = 'https://api.foursquare.com/v2/venues/'
          + myViewModel.fsVenueID[y] + '/photos';
        myViewModel.fsPhotoRequestURL[y] = myViewModel.fsPhotoEndpoint[y] + '?'
          + myViewModel.fsPhotoParams;
        resolve();
      })); // end of promises
    } // end of for

    return Promise.all(promisesB)
      .then(function () {
        resolve(console.log('Done populating Photo Request URLs'));
        getPhotosWrapperFunction();
      }) // end of .then

  }); // end of populateFsPhotoRequestURLs
} // end of async function populateFsPhotoRequestURLsAsync()

populateVenueIDsAsync();


async function getPhotosWrapperFunction() {
  let populatePhotos = new Promise(function(resolve, reject) {
    let promisesC = [];

    for (let y = 0; y < myViewModel.locationsKOOA().length; y++) {
      promisesC.push(new Promise(function (resolve) {
        let getPhotoFromFS = new XMLHttpRequest();
        let localFsPhotoRequestURL = myViewModel.fsPhotoRequestURL[y];
        getPhotoFromFS.open('GET', localFsPhotoRequestURL);
        getPhotoFromFS.onreadystatechange = function (oEvent) {
          if (getPhotoFromFS.readyState === 4) {
            if (getPhotoFromFS.status === 200) {
              let responseFromPhotoFS = JSON.parse(getPhotoFromFS.responseText);
              try {
                myViewModel.fsPhotoPrefix = responseFromPhotoFS.response.photos.items[0].prefix;
                myViewModel.fsPhotoSuffix = responseFromPhotoFS.response.photos.items[0].suffix;
                myViewModel.fsPhoto[y] = myViewModel.fsPhotoPrefix + FS_PHOTO_SIZE + myViewModel.fsPhotoSuffix;
                resolve();
              } catch(err) {
                myViewModel.fsPhoto[y] = 'undefined'; // this will alert user gracefully (see below)
                console.log('venue ' + y +
                  ' responseFromPhotoFS.response.photos.items[0] ' +
                  err.description);
                // alert('Foursquare failed to send photo for venue ' + y);
                // no need to alert user with a popup when I have infoWindow
                // programmed to inform the user that no image is available if
                // myViewModel.fsPhoto[y] = 'undefined'. -- see code for populateInfoWindow.
                // I intentionally picked 4 locations without Photos to easily showcase this.
              }
            } else {
              myViewModel.fsPhoto[y] = 'undefined'; // this will alert user gracefully (see below)
              console.log('Error ', getPhotoFromFS.statusText);
              reject(console.log('venue ' + y + ' failed to get photo from foursquare'));
              // alert('Foursquare failed to send photo for venue ' + y);
              // no need to alert user with a popup when I have infoWindow
              // programmed to inform the user that no image is available if
              // myViewModel.fsPhoto[y] = 'undefined'. -- see code for populateInfoWindow.
              // I intentionally picked 4 locations without Photos to easily showcase this.
            } // end if
          } //  end if
        } // end of function getPhotoFromFS.onload
        getPhotoFromFS.send();
      })); // end of promises
    } // end of for

    return Promise.all(promisesC)
    .then(function () {
      resolve(console.log('Done populating Photos'));
    }) // end of .then

  }); // end of populatePhotos
} // end of async function getPhotosWrapperFunction


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
  window.map = new google.maps.Map(document.getElementById('map'), {
    center: CENTER_LL,
    zoom: 11,
	styles: styles,
	mapTypeControl: false
  });

  window.largeInfowindow = new google.maps.InfoWindow();

  setMarkers();

  // Show listings at load.
  showListings();

} // end of initMap()

function setMarkers() {
  // The following group uses the location array to create an array of markers on initialize.
  for (let i = 0; i < myViewModel.locationsKOOA().length; i++) {
    // Get the position from the location array.
    let position = myViewModel.locationsKOOA()[i].location;
    let title = myViewModel.locationsKOOA()[i].title;

    // Create a marker per location, and put into markers array.
    window.marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
	    icon: 'img/coffee_marker_green.png',
      id: i
    }); // end of marker = new google.maps.Marker({})

    // Push the marker to our array of markers.
    myViewModel.markers.push(marker);

    // Create an onclick event to open an infowindow at each marker.
    window.marker.addListener('click', function() {
	    let self = this;
	    myViewModel.selectedLocationKOO = self;

      populateInfoWindow(this, largeInfowindow);

	    // set all marker icons back to green and remove animations
      for (let x = 0; x < myViewModel.markers.length; x++) {
        myViewModel.markers[x].setIcon('img/coffee_marker_green.png');
	      myViewModel.markers[x].setAnimation(null);
      } // end of for()

	    // remove locationTitleBold class from all titles elements
	    for (let x = 1; x < myViewModel.markers.length+1; x++) {
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
	    let selectedLocationTitleElementById = document.getElementById(myViewModel.selectedLocationKOO.id + 1);
	    selectedLocationTitleElementById.classList.add('locationTitleBold');

    }); // end marker.addListener(click)

	  // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
	  window.marker.addListener('mouseover', function() {
	    let self = this;
      self.setIcon('img/coffee_marker_teal.png');
    }); // end marker.addListener(mouseover)

    window.marker.addListener('mouseout', function() {
	    let self = this;
	    if (myViewModel.selectedLocationKOO != self) {
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
  let locationIndex = myViewModel.locationsKOOA().indexOf(coffeeShopLocation);
  myViewModel.selectedLocationKOO = this;

  // set all marker icons back to green and remove animations
  for (let i = 0; i < myViewModel.markers.length; i++) {
    myViewModel.markers[i].setIcon('img/coffee_marker_green.png');
	  myViewModel.markers[i].setAnimation(null);
  }

  // remove locationTitleBold class from all titles elements
  for (let x = 1; x < myViewModel.markers.length+1; x++) {
    let elem = document.getElementById(x);
	  elem.classList.remove('locationTitleBold');
  } // end of for()

  // set the selected location's marker icon to teal
  myViewModel.markers[locationIndex].setIcon('img/coffee_marker_teal.png');
  // set the selected location's marker animation to bounce
  myViewModel.markers[locationIndex].setAnimation(google.maps.Animation.BOUNCE);
  // remove bounce animation after 1 bounce (700 ms)
  setTimeout(function(){ myViewModel.markers[locationIndex].setAnimation(null); }, 700);

  // apply locationTitleBold class to selected location's title element in list
  let selectedLocationTitleElementById = document.getElementById(myViewModel.selectedLocationKOO.id);
  selectedLocationTitleElementById.classList.add('locationTitleBold');

  // Open InfoWindow at the marker for the location clicked
  populateInfoWindow(myViewModel.markers[locationIndex], largeInfowindow);

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

    console.log('Clicked venue id: ' + marker.id);

    // I set a flag called 'undefined' to show if there was an error getting
    // Photos from Foursquare. This checks for the presence of that flag to
    // either show the Photo or show 'No Image Available'.
    // This is my gracefull alternative to an alert.
    // I intentionally picked 4 locations without Photos to easily showcase this.
    if (myViewModel.fsPhoto[marker.id] != 'undefined') {
      // set the content for the infowindow
      infowindow.setContent('<div class="infowindow"><h3>' +
        marker.title +
        '</h3><img src="' +
        myViewModel.fsPhoto[marker.id] +
        '">' + '</br></br>Provided by</br>' +
        '<img src="img/Foursquare-logo.png">' + '</div>');
    } else { // show 'No Image Available' in infowindow
        infowindow.setContent('<div class="infowindow"><h3>' +
          marker.title +
          '</h3>' + 'No Image Available' + '</br></br>Provided by</br>' +
          '<img src="img/Foursquare-logo.png">' + '</div>');
    }

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
      for (let y = 0; y < myViewModel.markers.length; y++) {
        myViewModel.markers[y].setIcon('img/coffee_marker_green.png');
	      myViewModel.markers[y].setAnimation(null);
      } // end of for()

	    // remove locationTitleBold class from all titles elements
      for (let x = 1; x < myViewModel.markers.length + 1; x++) {
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
  for (let i = 0; i < myViewModel.markers.length; i++) {
    myViewModel.markers[i].setMap(window.map);
    bounds.extend(myViewModel.markers[i].position);
  }
  window.map.fitBounds(bounds);
} // end of showListings()


/**
* @description This function will loop through the listings and hide them all.
*/
function hideListings() {
  for (let i = 0; i < myViewModel.markers.length; i++) {
    myViewModel.markers[i].setMap(null);
  }
} // end of hideListings
