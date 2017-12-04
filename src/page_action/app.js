// cache page elemements
const addBtnElem = document.getElementById('add-btn'),
  firstNameElem = document.getElementById('first-name'),
  lastNameElem = document.getElementById('last-name'),
  addInfoElem = document.getElementById('info-input');

// add button event listener
addBtnElem.addEventListener('click', () => {
  // get current tab data
  chrome.tabs.getSelected(null, (tab) => {
    // sync data
    chrome.storage.sync.set({
      'first': firstNameElem.value,
      'last': lastNameElem.value,
      'info': addInfoElem.value,
      'return': tab.url
    });
    // move to new tab
    const fullName = firstNameElem.value + ' ' + lastNameElem.value;
    chrome.tabs.update(tab.id, {
      url: 'https://calendar.google.com/calendar/r/eventedit?text=' + fullName + '#/courttracker'
    });
  });
});