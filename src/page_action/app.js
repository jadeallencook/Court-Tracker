// cache page elemements
const addBtnElem = document.getElementById('add-btn'),
  firstNameElem = document.getElementById('first-name'),
  lastNameElem = document.getElementById('last-name'),
  addInfoElem = document.getElementById('info-input');

// event listeners
addBtnElem.addEventListener('click', () => {
  chrome.storage.sync.set({
    'first': firstNameElem.value,
    'last': lastNameElem.value,
    'info': addInfoElem.value
  });
});