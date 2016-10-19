!function filterDataFromLinear() {

	// Option 1 = google
	// option 2 = ics

	//var oDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	//var oMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var strCSVHeadings = "Subject, Start Date, Start Time, End Date, End Time, All Day Event, Description, Location, Private";

	var strDateRange = document.getElementsByClassName('header-1-2-3')[0].innerHTML;
	console.log("Filtering timetable for " + strDateRange);

	var oDate = new Date(strDateRange.substring(0, strDateRange.indexOf("-")).replace(new RegExp(" ", "g"), '-')); // print using "toLocaleDateString()" for simplification
	console.log(oDate);
	var oworkDate; 
	
	var iTableColumns = 8; // do not change this value unless the university adds additional columsn to the timetable!
	var oCSVOutput = [];
  	var oFiltered = [];
  	var oAllTables = document.getElementsByTagName('table');
  	var iCount = 0;
  	var iSizeOfObject = 0;
  	var iWeekDay = 0;
  	var strTemp;
  	var a;
  	var strExport;
  
	
	iSizeOfObject = oAllTables.length; 

	while ( iSizeOfObject > 0 && iCount < iSizeOfObject ) {

	  if( oAllTables[iCount].className === "spreadsheet" ) { 
	    console.log("Skipping element removal: " + oAllTables[iCount].className);
	  }

	  else {
	    oFiltered.push(oAllTables[iCount]); 
	    console.log("Element with class " + (oAllTables[iCount].className == "" ? "NULL" : oAllTables[iCount].className) + " filtered");
	  } 

	  iCount++;
	}

	iCount = 0;
	iSizeOfObject = oFiltered.length;

	while ( iSizeOfObject > 0 && iCount < iSizeOfObject ) {

	    if( oFiltered[iCount].parentNode ) { 
	      oFiltered[iCount].parentNode.removeChild(oFiltered[iCount]); 
	    }

    	iCount++;
  	}

  	oAllTables = []; // empty oAllTables for reuse

  	oAllTables = document.getElementsByClassName('spreadsheet'); // reuse oAllTables -> retrieve actual timetables into it

  	// to-do --> convert into OO external function.
  	oCSVOutput.push(strCSVHeadings); // add the headers into the 

	if(option == 2) {
  		var calendar = ics();
  	}

	while (iWeekDay >= 0 && iWeekDay < 5 ) { 
			
		iCount = 1; // set to 1 to ignore title row! 
	  	iSizeOfObject = document.getElementsByClassName('spreadsheet')[iWeekDay].rows.length;
	  	oWorkDate = new Date(oDate.setTime( oDate.getTime())); // add using ms and setTime rather than setDate to avoid known issues!

		while ( iSizeOfObject > 0 && iCount < iSizeOfObject ) {

			if(option == 1) { // CSV

				strTemp = null; 
				strTemp = oAllTables[iWeekDay].rows[iCount].cells[0].innerHTML.replace(new RegExp("(&[1-z][1-z];)|<|,|>|;", "g"), ' ') + " (" +  oAllTables[iWeekDay].rows[iCount].cells[5].innerHTML + "),";
				strTemp += oWorkDate.toLocaleDateString('en-GB') + ","; // add week day (start)
				strTemp += oAllTables[iWeekDay].rows[iCount].cells[2].innerHTML + ",";// add start time (col idx 2)
				strTemp += oWorkDate.toLocaleDateString('en-GB') + ","; // add week day (end)
				strTemp += oAllTables[iWeekDay].rows[iCount].cells[3].innerHTML + ","; // add end time (col idx 3)
				strTemp += "false,"; //set all day as false!
				strTemp += oAllTables[iWeekDay].rows[iCount].cells[1].innerHTML + ","; // add description (col idx 1)!
				strTemp += "\"Brunel University London\, Kingston Lane\, UB83PH\, Greater London\",true"; // add location + event privacy state
			
				oCSVOutput.push(strTemp);
			}
			else if(option == 2) { // ics / ical 

				var subject = oAllTables[iWeekDay].rows[iCount].cells[0].innerHTML.replace(new RegExp("(&[1-z][1-z];)|<|,|>|;", "g"), '') + " (" +  oAllTables[iWeekDay].rows[iCount].cells[5].innerHTML + ")";
				var desc = oAllTables[iWeekDay].rows[iCount].cells[1].innerHTML;
				var location = "\"Brunel University London\, Kingston Lane\, UB83PH\, Greater London";
				
				// dd/mm/yyyy --> substring
				var day = oWorkDate.toLocaleDateString('en-GB').substring(6, 10) + "-" + oWorkDate.toLocaleDateString('en-GB').substring(3, 5) + "-" + oWorkDate.toLocaleDateString('en-GB').substring(0, 2);
				
				var begin = new Date(day);
				
				if(oAllTables[iWeekDay].rows[iCount].cells[2].innerHTML.length == 4) { // if the time is H:MM instead of H:MM
					
					begin.setHours(oAllTables[iWeekDay].rows[iCount].cells[2].innerHTML.substring(0, 1));
					begin.setMinutes(oAllTables[iWeekDay].rows[iCount].cells[2].innerHTML.substring(2, 4));
				}

				else if(oAllTables[iWeekDay].rows[iCount].cells[2].innerHTML.length == 5) {
					begin.setHours(oAllTables[iWeekDay].rows[iCount].cells[2].innerHTML.substring(0, 2));
					begin.setMinutes(oAllTables[iWeekDay].rows[iCount].cells[2].innerHTML.substring(3, 5));
				}

				begin.setSeconds(0);

				var end = new Date(day);

				if(oAllTables[iWeekDay].rows[iCount].cells[3].innerHTML.length == 4) { // if the time is H:MM instead of H:MM
					
					end.setHours(oAllTables[iWeekDay].rows[iCount].cells[2].innerHTML.substring(0, 1));
					end.setMinutes(oAllTables[iWeekDay].rows[iCount].cells[2].innerHTML.substring(2, 4));
				}

				else if(oAllTables[iWeekDay].rows[iCount].cells[3].innerHTML.length == 5) {
					end.setHours(oAllTables[iWeekDay].rows[iCount].cells[3].innerHTML.substring(0, 2));
					end.setMinutes(oAllTables[iWeekDay].rows[iCount].cells[3].innerHTML.substring(3, 5));
				}

				end.setSeconds(0);

				console.log(new Date(begin));
				console.log(new Date(end));
				console.log(calendar.addEvent(subject, desc, location, new Date(begin), new Date(end)));
			}

			iCount++;
		}

		iWeekDay++;
		oWorkDate = new Date(oDate.setTime( oDate.getTime() + 86400000)); //placed here due to an unknown bug that caused anything past three days to increment sporadically!

  	}
  	// console.log(oCSVOutput);

  	if(option == 1) {
		strExport = oCSVOutput.join("\n")

		a = document.createElement('a');
		a.href = 'data:attachment/csv,' +  encodeURIComponent(strExport);
		a.target = '_blank';
		a.download = 'myTimeTable ' + strDateRange + '.csv';

		document.body.appendChild(a);
		a.click();
	}
	else if(option == 2) {
		calendar.download('myTimeTable ' + strDateRange + '.ics');
	}
}();

