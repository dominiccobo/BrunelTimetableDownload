document.addEventListener('DOMContentLoaded', function () {
      document.getElementById('openTimetable').addEventListener('click', OpenTimetableSite); 
      document.getElementById('download').addEventListener('click', TriggerDownload);
});

function OpenTimetableSite() {
  chrome.tabs.create({url: "https://teaching.brunel.ac.uk/SWS-1617/login.aspx"});
}

function TriggerDownload() {

	var selected = document.getElementById("format").value

	if(selected == 1) {
		chrome.tabs.executeScript(null, {code: 'var option = 1'}) // if is google calendar format
	}
	else if(selected == 2) {
		chrome.tabs.executeScript(null, {code: 'var option = 2'}) // if is apple calendar format
	}

	chrome.tabs.executeScript(null, {file: "js/FileSaver.js"});
	chrome.tabs.executeScript(null, {file: "js/blob.js"});
	chrome.tabs.executeScript(null, {file: "js/ics.js"});
	chrome.tabs.executeScript(null, {file: "js/runFilter.js"});
	chrome.tabs.reload();
}