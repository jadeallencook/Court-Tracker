// api info
var CLIENT_ID = '268473500892-ja8h671fqvm7nhul3ns2qufhfsbd8e4l.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCwUKfPuZQ-MboYJk7z5EKUPqeweoyqf9s';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar";

// cache dom elements 
var authorizeButton = document.getElementById('authorize-button'),
  signoutButton = document.getElementById('signout-button'),
  homicidePlugin = document.getElementById('homicide-plugin');

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    // signed in
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    homicidePlugin.style.display = 'block';
  } else {
    // signed out
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    homicidePlugin.style.display = 'none';
  }
}

// sign in
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

// sign out
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function addEventToCalendar() {
  // get all calendars
  const getCalendars = gapi.client.calendar.calendarList.list();
  getCalendars.execute((calendars) => {
    // get homicide calendar id 
    calendars = calendars.items;
    let calendarID = '';
    for (let calendar of calendars) {
      if (calendar.summary.toLowerCase().includes('deseret news court dates')) {
        calendarID = calendar.id;
      }
    }
    // info for date
    const todaysDate = new Date(),
      todaysDateFormatted = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate(),
      dateTime = {
        start: todaysDateFormatted + 'T09:00:00-18:00',
        end: todaysDateFormatted + 'T09:00:00-18:30'
      }
    // elements containing info
    const firstName = document.getElementById('first-name'),
      lastName = document.getElementById('last-name'),
      extraInfo = document.getElementById('extra-information');
    // info for event
    const event = {
      'summary': firstName.value + ' ' + lastName.value,
      'description': extraInfo.value,
      'start': {
        'dateTime': dateTime.start
      },
      'end': {
        'dateTime': dateTime.end
      }
    }
    // run tests on content
    var allValuesPresent = true;
    for (let input of [firstName, lastName]) {
      if (input.value === '') {
        input.style.borderBottom = 'solid thin #F00';
        allValuesPresent = false;
      } else {
        // add event to calendar
        input.style.borderBottom = 'solid thin #333';
      }
    }
    if (allValuesPresent) {
      // reset all inputs
      for (let input of [firstName, lastName, extraInfo]) {
        input.value = '';
      }
      // create request
      const addEvent = gapi.client.calendar.events.insert({
        'calendarId': calendarID,
        'resource': event
      });
      // execute request to google api
      addEvent.execute((event) => {
        const link = '<a href="' + event.htmlLink + '" target="_blank">clicking here</a>';
        document.getElementById('link-to-event').innerHTML = 'Your event has been added to the calendar, you can view it by ' + link + '.';
      });
    }
  });
}

// add event listeners 
document.getElementById('add-to-calendar').addEventListener('click', addEventToCalendar);