document.addEventListener('DOMContentLoaded', () => {
    // Show the loading indicator
    const loadingIndicator = document.getElementById('loading_forecast');
    loadingIndicator.style.display = 'block';

    // Define the path to the JSON file
    const jsonFilePath = 'https://wm.mvs.ds.usace.army.mil/php_data_api/public/json/gage_control.json';
    
    // Fetch the initial gage control data
    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async gageControlData => {
            console.log('Gage Control JSON Data:', gageControlData);

            // Create an array of promises for the second fetch based on basin data
            const fetchPromises = gageControlData.map(async item => {
                const basin = item.basin;
                const secondFetchUrl = `https://wm.mvs.ds.usace.army.mil/php_data_api/public/get_gage_control_by_basin.php?basin=${basin}`;
                console.log('secondFetchUrl:', secondFetchUrl);

                // Return the fetch promise for each basin
                return fetch(secondFetchUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    });
            });

            // Wait for all fetch operations to complete
            return Promise.all(fetchPromises)
                .then(secondDataArray => {
                    console.log('Second Fetch Data:', secondDataArray);

                    // Merge the initial gage control data with the second fetch data
                    const mergedData = mergeData(gageControlData, secondDataArray);
                    console.log('mergedData: ', mergedData);

                    // Remove basins that you dont need
                    const basinsToRemove = ["Castor", "Salt", "Cuivre", "Meramec", "Big Muddy", "St Francis"]; 
                    //const basinsToRemove = ["Castor", "Salt", "St Francis"];
                    const filteredBasins = mergedData.filter(basin => !basinsToRemove.includes(basin.basin));
                    console.log("filteredBasins: ", filteredBasins);

                    // Define a custom order array
                    const customOrder = ["Mississippi", "Illinois", "Missouri", "Kaskaskia", "Ohio"];

                    // Sort the array by the custom order
                    filteredBasins.sort((a, b) => customOrder.indexOf(a.basin) - customOrder.indexOf(b.basin));
                    console.log('filteredBasins: ', filteredBasins);

                    const combinedGages = combineGages(filteredBasins);
                    console.log("combinedGages: ", combinedGages);

                    function extractPrecipReportTrue(data) {
                        return data.filter(item => item.tsid_forecast_location || item.tsid_interpolate_location);
                    }                    

                    const result = extractPrecipReportTrue(combinedGages);
                    console.log("result: ", result);

                    // Call the function to create and populate the table
			        createTable(result);

                    // Hide the loading indicator after data processing
                    loadingIndicator.style.display = 'none';
                });
        })
        .catch(error => {
            console.error('Error fetching data:', error);

            // Hide the loading indicator in case of an error
            loadingIndicator.style.display = 'none';
        });
});

// Function to conbine gages from basins
function combineGages(basins) {
    let combinedGages = [];

    basins.forEach(basin => {
        combinedGages = combinedGages.concat(basin.gages);
    });

    return combinedGages;
}

// Function to merge two jsons based on basin and location
function mergeData(data, secondDataArray) {
    if (Array.isArray(data) && data.length > 0) {
        // Iterate through each basin in data
        data.forEach(basin => {
            console.log('Processing basin:', basin);
            // Check if basin has gages and gages is an array
            if (Array.isArray(basin.gages) && basin.gages.length > 0) {
                // Iterate through each gage in the current basin's gages
                basin.gages.forEach(gage => {
                    // Find the matching data in secondDataArray based on location_id
                    secondDataArray.forEach(dataArr => {
                        const matchedObj = dataArr.find(obj => obj.location_id === gage.location_id);
                        if (matchedObj) {
                            // Merge the matched data into the corresponding location object
                            Object.assign(gage, matchedObj);
                        }
                    });
                })
            }
        })
    }
    return data;
}

// Function to create ld summary table
function createTable(filteredData) {
    // Create a table element
    const table = document.createElement('table');
    table.setAttribute('id', 'forecast'); // Set the id to "gage_data"

    console.log("filteredData inside createTable = ", filteredData);

    // Create the first header row with rowspan for the first column
    const headerRowTitle = document.createElement('tr');

    // Create table header for the first column with rowspan of 3
    const thLocation = document.createElement('th');
    thLocation.textContent = "Locations";
    thLocation.rowSpan = 3;
    thLocation.style.height = '50px';
    headerRowTitle.appendChild(thLocation);

    // Create table headers for the remaining columns in the first row
    const columns02 = ["Observed", "Forecast"];
    columns02.forEach((columnName) => {
        const th = document.createElement('th');
        th.textContent = columnName;
        th.style.height = '50px';

        // If the column is "Forecast", set colspan to 7
        if (columnName === "Forecast") {
            th.colSpan = 7;
        }

        headerRowTitle.appendChild(th);
    });

    // Append the first header row to the table
    table.appendChild(headerRowTitle);

    // Create a table header row for the second header row
    const headerRowDay = document.createElement('tr');

    // Create table headers for the desired columns
    const columns = ["6am", "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
    columns.forEach((columnName) => {
        const th = document.createElement('th');
        th.textContent = columnName;
        th.style.height = '50px';
        headerRowDay.appendChild(th);
    });

    // Append the second header row to the table
    table.appendChild(headerRowDay);

    // Create a table header row for the third header row
    const headerRowDate = document.createElement('tr');


    // =================================================================== // 
    // ========================== GET DATE TIME ========================== // 
    // =================================================================== //  
    // Assuming timestamp is defined
    var timestamp = new Date().getTime(); // Replace this with your actual timestamp
    var date = new Date(timestamp);
    console.log('timestamp: ', timestamp);
    console.log('date: ', date);

    // Extract only the date (without time)
    var dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    console.log('dateOnly: ', dateOnly);

    // Day -1
    var dayMinus1 = new Date(date);
    dayMinus1.setDate(date.getDate() - 1);
    var nws_dayMinus1_date = ('0' + (dayMinus1.getMonth() + 1)).slice(-2) + '-' + ('0' + dayMinus1.getDate()).slice(-2) + '-' + dayMinus1.getFullYear();
    var nws_dayMinus1_date_title = ('0' + (dayMinus1.getMonth() + 1)).slice(-2) + '-' + ('0' + dayMinus1.getDate()).slice(-2);
    console.log('nws_dayMinus1_date: ', nws_dayMinus1_date);
    console.log('nws_dayMinus1_date_title: ', nws_dayMinus1_date_title);

    // Day 0
    var day0 = new Date(date);
    // Get the current hour
    var current_hour = day0.getHours();
    var nws_day0_date = ('0' + (day0.getMonth() + 1)).slice(-2) + '-' + ('0' + day0.getDate()).slice(-2) + '-' + day0.getFullYear();
    var nws_day0_date_title = ('0' + (day0.getMonth() + 1)).slice(-2) + '-' + ('0' + day0.getDate()).slice(-2);
    console.log('current_hour: ', current_hour);
    console.log('nws_day0_date: ', nws_day0_date);
    console.log('nws_day0_date_title: ', nws_day0_date_title);

    // Day 1
    var day1 = new Date(date);
    day1.setDate(date.getDate() + 1);
    var nws_day1_date = ('0' + (day1.getMonth() + 1)).slice(-2) + '-' + ('0' + day1.getDate()).slice(-2) + '-' + day1.getFullYear();
    var nws_day1_date_title = ('0' + (day1.getMonth() + 1)).slice(-2) + '-' + ('0' + day1.getDate()).slice(-2);
    console.log('nws_day1_date: ', nws_day1_date);
    console.log('nws_day1_date_title: ', nws_day1_date_title);

    // Day 2
    var day2 = new Date(date);
    day2.setDate(date.getDate() + 2);
    var nws_day2_date = ('0' + (day2.getMonth() + 1)).slice(-2) + '-' + ('0' + day2.getDate()).slice(-2) + '-' + day2.getFullYear();
    var nws_day2_date_title = ('0' + (day2.getMonth() + 1)).slice(-2) + '-' + ('0' + day2.getDate()).slice(-2);
    console.log('nws_day2_date: ', nws_day2_date);
    console.log('nws_day2_date_title: ', nws_day2_date_title);

    // Day 3
    var day3 = new Date(date);
    day3.setDate(date.getDate() + 3);
    var nws_day3_date = ('0' + (day3.getMonth() + 1)).slice(-2) + '-' + ('0' + day3.getDate()).slice(-2) + '-' + day3.getFullYear();
    var nws_day3_date_title = ('0' + (day3.getMonth() + 1)).slice(-2) + '-' + ('0' + day3.getDate()).slice(-2);
    console.log('nws_day3_date: ', nws_day3_date);
    console.log('nws_day3_date_title: ', nws_day3_date_title);

    // Day 4
    var day4 = new Date(date);
    day4.setDate(date.getDate() + 4);
    var nws_day4_date = ('0' + (day4.getMonth() + 1)).slice(-2) + '-' + ('0' + day4.getDate()).slice(-2) + '-' + day4.getFullYear();
    var nws_day4_date_title = ('0' + (day4.getMonth() + 1)).slice(-2) + '-' + ('0' + day4.getDate()).slice(-2);
    console.log('nws_day4_date: ', nws_day4_date);
    console.log('nws_day4_date_title: ', nws_day4_date_title);

    // Day 5
    var day5 = new Date(date);
    day5.setDate(date.getDate() + 5);
    var nws_day5_date = ('0' + (day5.getMonth() + 1)).slice(-2) + '-' + ('0' + day5.getDate()).slice(-2) + '-' + day5.getFullYear();
    var nws_day5_date_title = ('0' + (day5.getMonth() + 1)).slice(-2) + '-' + ('0' + day5.getDate()).slice(-2);
    console.log('nws_day5_date: ', nws_day5_date);
    console.log('nws_day5_date_title: ', nws_day5_date_title);

    // Day 6
    var day6 = new Date(date);
    day6.setDate(date.getDate() + 6);
    var nws_day6_date = ('0' + (day6.getMonth() + 1)).slice(-2) + '-' + ('0' + day6.getDate()).slice(-2) + '-' + day6.getFullYear();
    var nws_day6_date_title = ('0' + (day6.getMonth() + 1)).slice(-2) + '-' + ('0' + day6.getDate()).slice(-2);
    console.log('nws_day6_date: ', nws_day6_date);
    console.log('nws_day6_date_title: ', nws_day6_date_title);

    // Day 7
    var day7 = new Date(date);
    day7.setDate(date.getDate() + 7);
    var nws_day7_date = ('0' + (day7.getMonth() + 1)).slice(-2) + '-' + ('0' + day7.getDate()).slice(-2) + '-' + day7.getFullYear();
    var nws_day7_date_title = ('0' + (day7.getMonth() + 1)).slice(-2) + '-' + ('0' + day7.getDate()).slice(-2);
    console.log('nws_day7_date: ', nws_day7_date);
    console.log('nws_day7_date_title: ', nws_day7_date_title);


    // Create table headers for the desired columns
    const columns2 = [nws_day0_date, nws_day1_date, nws_day2_date, nws_day3_date, nws_day4_date, nws_day5_date, nws_day6_date, nws_day7_date];
    columns2.forEach((columnName) => {
        const th = document.createElement('th');
        th.textContent = columnName;
        th.style.height = '50px';
        headerRowDate.appendChild(th);
    });

    // Append the third header row to the table
    table.appendChild(headerRowDate);

    // Append the table to the document or a specific container
    const tableContainer = document.getElementById('table_container_forecast');
    if (tableContainer) {
        tableContainer.appendChild(table);
    }

    (async () => {
        try {
            const dateObjectFirstForecastDayByDayAndMonth = await fetchFirstNetmissDay("St Louis-Mississippi.Stage.Inst.~1Day.0.netmiss-fcst");
            console.log("dateObjectFirstForecastDayByDayAndMonth", dateObjectFirstForecastDayByDayAndMonth);

            if (dateObjectFirstForecastDayByDayAndMonth > dateOnly) {
                console.log("dateObjectFirstForecastDayByDayAndMonth is after dateOnly");
                if (current_hour < 0 || current_hour >= 10) { 
                    // Populate table cells asynchronously
                    populateTableCells(filteredData, table, nws_day0_date);
                    const message = document.createElement('div');
                    message.innerHTML = "<img src='https://www.wpc.ncep.noaa.gov/medr/97ewbg.gif'";
                    if (tableContainer) {
                        tableContainer.appendChild(message);
                    }
                } else  {
                    // Display message when the hour is between 0 and 12
                    const message = document.createElement('h1');
                    message.innerHTML = 'Daily forecasts are updated around noon.';
                    // Set the background color to yellow and add more styles for better appearance
                    message.style.backgroundColor = 'yellow';
                    message.style.color = 'black'; // Text color
                    message.style.padding = '10px'; // Padding around the text
                    message.style.border = '2px solid black'; // Border around the element
                    message.style.textAlign = 'center'; // Center align the text
                    message.style.fontFamily = 'Arial, sans-serif'; // Set font family
                    message.style.fontSize = '1.5em'; // Increase font size
                    if (tableContainer) {
                        tableContainer.appendChild(message);
                    }
                }
            } else if (dateObjectFirstForecastDayByDayAndMonth < dateOnly) {
                console.log("dateObjectFirstForecastDayByDayAndMonth is before dateOnly");
                const message = document.createElement('h1');
                message.innerHTML = 'Contact Water Control Office for Forecast';
                // Set the background color to orange
                message.style.backgroundColor = 'orange';
                message.style.color = 'black'; // Text color
                message.style.padding = '10px'; // Padding around the text
                message.style.border = '2px solid black'; // Border around the element
                message.style.textAlign = 'center'; // Center align the text
                message.style.fontFamily = 'Arial, sans-serif'; // Set font family
                message.style.fontSize = '1.5em'; // Increase font size
                if (tableContainer) {
                    tableContainer.appendChild(message);
                }
            } else {
                console.log("dateObjectFirstForecastDayByDayAndMonth is the same as dateOnly");
                // Display message when the hour is between 0 and 12
                const message = document.createElement('h1');
                message.innerHTML = 'Daily forecasts are updated around noon.';
                // Set the background color to yellow and add more styles for better appearance
                message.style.backgroundColor = 'yellow';
                message.style.color = 'black'; // Text color
                message.style.padding = '10px'; // Padding around the text
                message.style.border = '2px solid black'; // Border around the element
                message.style.textAlign = 'center'; // Center align the text
                message.style.fontFamily = 'Arial, sans-serif'; // Set font family
                message.style.fontSize = '1.5em'; // Increase font size
                if (tableContainer) {
                    tableContainer.appendChild(message);
                }
            }

        } catch (error) {
            console.error('Error:', error);
        }
    })();  
}

function populateTableCells(filteredData, table, nws_day0_date) {
    filteredData.forEach(location => {
        console.log("Location ID:", location.location_id);
        console.log("Public Name:", location.public_name);
        console.log("Netmiss:", location.tsid_netmiss);
        console.log("Netmiss Observe:", location.tsid_netmiss_observe);
        // Create a new row for each data object
        const row = table.insertRow();
        console.log("Calling fetchAndUpdateData");
        fetchAndUpdateData(location.public_name, location.tsid_netmiss, location.tsid_netmiss_observe, row, nws_day0_date);
    });
}

// Function to fetch ld summary data
function fetchAndUpdateData(location_id, tsid_netmiss, tsid_netmiss_observe, row, nws_day0_date) {
    // Create an object to hold all the properties you want to pass
    const dataToSend = {
        tsid_netmiss: tsid_netmiss,
        tsid_netmiss_observe: tsid_netmiss_observe,
        nws_day0_date: nws_day0_date,
    };
    console.log('dataToSend:', dataToSend);

    // Convert the object into a query string
    const queryString = Object.keys(dataToSend).map(key => key + '=' + dataToSend[key]).join('&');
    console.log('queryString:', queryString);

    // Make an AJAX request to the PHP script, passing all the variables
    const url = `https://wm.mvs.ds.usace.army.mil/php-data-api/public/get_netmiss_forecast.php?${queryString}`;
    console.log('url:', url);

    fetch(url)
        .then(response => response.json())
        .then(data1 => {
            console.log('location_id :', location_id);
            console.log('data1 :', data1);

            const data = data1.slice(0, 8);
            console.log('data :', data);

            // Check if there is data, array is 8 or more (obs and forecast data total), and obs is not the same as the first forecast point (old forecast)
            if (data !== null && data.length >= 8 && checkForDuplicates(data)) {

                // LOCATION
                const rivermileCell = row.insertCell();
                if (tsid_netmiss !== null) {
                    rivermileCell.innerHTML = "<b>" + location_id + "</b>";
                } else {
                    rivermileCell.innerHTML = location_id;
                }

                // OBSERVED
                const locationCell = row.insertCell();
                locationCell.innerHTML = "<div title='" + data[0].cwms_ts_id + " " + data[0].date_time + "'>" + (parseFloat(data[0].value).toFixed(2)) + "</div>";

                // DAY1
                const day1Cell = row.insertCell();
                const delta6 = "<div title='" + data[1].cwms_ts_id + " " + data[1].date_time + "'>" + (parseFloat(data[1].value).toFixed(2)) + "</div>";
                day1Cell.innerHTML = delta6;

                // DAY2
                const day2Cell = row.insertCell();
                const delta12 = "<div title='" + data[2].cwms_ts_id + " " + data[2].date_time + "'>" + (parseFloat(data[2].value).toFixed(2)) + "</div>";
                day2Cell.innerHTML = delta12;


                // DAY3
                const day3Cell = row.insertCell();
                const delta24 = "<div title='" + data[3].cwms_ts_id + " " + data[3].date_time + "'>" + (parseFloat(data[3].value).toFixed(2)) + "</div>";
                day3Cell.innerHTML = delta24;


                // DAY4
                const day4Cell = row.insertCell();
                const delta48 = "<div title='" + data[4].cwms_ts_id + " " + data[4].date_time + "'>" + (parseFloat(data[4].value).toFixed(2)) + "</div>";
                day4Cell.innerHTML = delta48;


                // DAY5
                const day5Cell = row.insertCell();
                const delta72 = "<div title='" + data[5].cwms_ts_id + " " + data[5].date_time + "'>" + (parseFloat(data[5].value).toFixed(2)) + "</div>";
                day5Cell.innerHTML = delta72;

                // DAY6
                const day6Cell = row.insertCell();
                day6Cell.innerHTML = "<div title='" + data[6].cwms_ts_id + " " + data[6].date_time + "'>" + (parseFloat(data[6].value).toFixed(2)) + "</div>";
                
                // DAY7
                const day7Cell = row.insertCell();
                day7Cell.innerHTML = "<div title='" + data[7].cwms_ts_id + " " + data[7].date_time + "'>" + (parseFloat(data[7].value).toFixed(2)) + "</div>";

            // Check if there is data, array is 7 or more (obs and forecast data total only for LD 24 Pool, LD 24 TW, LD 25 Pool, LD 25 TW), and obs is not the same as the first forecast point (old forecast)    
            } else if (data !== null && data.length >= 7 && checkForDuplicates(data)) {
                // LOCATION
                const rivermileCell = row.insertCell();
                rivermileCell.innerHTML = location_id;

                // OBSERVED
                const locationCell = row.insertCell();
                locationCell.innerHTML = "<div title='" + data[0].cwms_ts_id + " " + data[0].date_time + "'>" + (parseFloat(data[0].value).toFixed(2)) + "</div>";

                // DAY1
                const day1Cell = row.insertCell();
                const delta6 = "<div title='" + data[1].cwms_ts_id + " " + data[1].date_time + "'>" + (parseFloat(data[1].value).toFixed(2)) + "</div>";
                day1Cell.innerHTML = delta6;

                // DAY2
                const day2Cell = row.insertCell();
                const delta12 = "<div title='" + data[2].cwms_ts_id + " " + data[2].date_time + "'>" + (parseFloat(data[2].value).toFixed(2)) + "</div>";
                day2Cell.innerHTML = delta12;


                // DAY3
                const day3Cell = row.insertCell();
                const delta24 = "<div title='" + data[3].cwms_ts_id + " " + data[3].date_time + "'>" + (parseFloat(data[3].value).toFixed(2)) + "</div>";
                day3Cell.innerHTML = delta24;


                // DAY4
                const day4Cell = row.insertCell();
                const delta48 = "<div title='" + data[4].cwms_ts_id + " " + data[4].date_time + "'>" + (parseFloat(data[4].value).toFixed(2)) + "</div>";
                day4Cell.innerHTML = delta48;


                // DAY5
                const day5Cell = row.insertCell();
                const delta72 = "<div title='" + data[5].cwms_ts_id + " " + data[5].date_time + "'>" + (parseFloat(data[5].value).toFixed(2)) + "</div>";
                day5Cell.innerHTML = delta72;

                // DAY6
                const day6Cell = row.insertCell();
                day6Cell.innerHTML = "<div title='" + data[6].cwms_ts_id + " " + data[6].date_time + "'>" + (parseFloat(data[6].value).toFixed(2)) + "</div>";
                
                // DAY7
                const day7Cell = row.insertCell();
                day7Cell.innerHTML = "<div>" + "" + "</div>";
            } else {
                // RIVER MILE
                const rivermileCell = row.insertCell();
                rivermileCell.innerHTML = location_id;

                // LOCATION
                const locationCell = row.insertCell();
                locationCell.innerHTML = "-M-";

                // DAY1
                const day1Cell = row.insertCell();
                day1Cell.innerHTML = "-M-";

                // DAY2
                const day2Cell = row.insertCell();
                day2Cell.innerHTML = "-M-";


                // DAY3
                const day3Cell = row.insertCell();
                day3Cell.innerHTML = "-M-";


                // DAY4
                const day4Cell = row.insertCell();
                day4Cell.innerHTML = "-M-";


                // DAY5
                const day5Cell = row.insertCell();
                day5Cell.innerHTML = "-M-";

                // DAY6
                const day6Cell = row.insertCell();
                day6Cell.innerHTML = "-M-";

                // DAY7
                const day7Cell = row.insertCell();
                day7Cell.innerHTML = "-M-";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors here
        });
}

// Function to subtract hours from data
function subtractHoursFromDate(date, hoursToSubtract) {
    return new Date(date.getTime() - (hoursToSubtract * 60 * 60 * 1000));
}

// Function to check for duplicate date_time values
function checkForDuplicates(data) {
    const dateTimes = data.map(entry => entry.date_time);
    const uniqueDateTimes = new Set(dateTimes);

    return dateTimes.length === uniqueDateTimes.size;
}

// Function to fetch first netmiss day
function fetchFirstNetmissDay(tsid_netmiss) {
    const dataToSend = {
        tsid_netmiss: tsid_netmiss,
    };

    const queryString = Object.keys(dataToSend).map(key => key + '=' + dataToSend[key]).join('&');
    const url = `https://wm.mvs.ds.usace.army.mil/php-data-api/public/get_netmiss.php?${queryString}`;
    console.log('url :', url);

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(datax => {
            const firstForecastDay = datax[0].date_time;
        
            const dateTimeParts = firstForecastDay.split(' ');
            const dateParts = dateTimeParts[0].split('-');
            const year = parseInt(dateParts[2], 10); // Adjust index to get the year
        
            // Other parsing logic remains the same
            const month = parseInt(dateParts[0], 10) - 1; // Months are zero-based in JavaScript
            const day = parseInt(dateParts[1], 10);
        
            // Create a new Date object with only year, month, and day components
            const dateObjectFirstForecastDayByDayAndMonth = new Date(year, month, day);
        
            return dateObjectFirstForecastDayByDayAndMonth;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; // Rethrow the error to be caught by the caller
        });    
}