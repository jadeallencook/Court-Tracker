// start chrome extension
chrome.extension.sendMessage({}, function (response) {
	// wait for document to load
	var readyStateCheckInterval = setInterval(() => {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			// check to see if calendar is open
			if (window.location.hash === '#/courttracker') {
				// click calendar drop down
				document.querySelector('.jZ0DTb.jNfAwc > div > div > div').click();
				// choose the right calendar
				let calendarSelected = false,
					openCalendars = setInterval(() => {
						// wait for dropdown menu 
						if (document.querySelector('.jZ0DTb.jNfAwc > div').getAttribute('aria-expanded') === 'true') {
							// clear wait for menu
							clearInterval(openCalendars);
							// look for correct calendar
							do {
								// get all calendars in dropdown
								const calendars = document.getElementsByClassName('jT5e9');
								// loop over all calendars
								for (let calendar of calendars) {
									// look for 'court dates' calendar
									if (calendar.innerText.toLowerCase() === 'deseret news court dates') {
										// select calendar
										calendarSelected = true;
										calendar.click();
									}
								}
							} while (!calendarSelected);
							// set date/time
							document.getElementById('xAlDaCbx').click();
							document.querySelector('div#c1 > div > div[data-value="8pm"').click();
							document.querySelector('div#c2 > div > div[data-value="8:30pm"').click();
							// get additional info from chrome storage
							chrome.storage.sync.get('info', (data) => {
								// clear placeholder
								document.querySelector('.iSSROb.snByac').innerText = '';
								// insert additional info
								document.getElementById('CghhOe0').innerText = data.info;
							});
						}
					}, 100);
			}
			// event listener to add new person
			chrome.storage.onChanged.addListener((changes, namespace) => {
				const fullName = changes.first.newValue + ' ' + changes.last.newValue;
				window.location = 'https://calendar.google.com/calendar/r/eventedit?text=' + fullName + '#/courttracker';
			});
		}
	}, 10);
});