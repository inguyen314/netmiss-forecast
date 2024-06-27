document.addEventListener('DOMContentLoaded', function () {
    // Display the loading_alarm_mvs indicator
    const loadingIndicator = document.getElementById('loading_forecast');
    loadingIndicator.style.display = 'block';

    // Gage control json file
    let jsonFileURL = null;
    if (cda === "public") {
        jsonFileURL = '../../../php_data_api/public/json/gage_control.json';
    } else if (cda === "internal") {
        jsonFileURL = '../../../php_data_api/public/json/gage_control.json';
    } else {
        jsonFileURL = '../../../php_data_api/public/json/gage_control.json';
    }
    console.log('jsonFileURL: ', jsonFileURL);

    // Fetch JSON data from the specified URL
    fetch(jsonFileURL)
        .then(response => {
            // Check if response is OK, if not, throw an error
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the response as JSON
            return response.json();
        })
        .then(data => {
            // Log the fetched data
            console.log('data: ', data);

            // Filter and sort the data
            const filteredData = data.reduce((accumulator, currentValue) => {
                // Extract the 'gages' array, defaulting to an empty array if not present
                const gages = currentValue.gages || [];
            
                let filteredGages = null;
                if (interpolate === "true") {
                    // Filter out gages where either tsid_forecast_location or tsid_interpolate_location is true
                    filteredGages = gages.filter(gage => gage.tsid_forecast_location === true || gage.tsid_interpolate_location === true);
                } else {
                    // Filter out gages where tsid_forecast_location is true
                    filteredGages = gages.filter(gage => gage.tsid_forecast_location === true);
                }

                // Accumulate the filtered gages into the accumulator
                accumulator.push(...filteredGages);
            
                // Return the accumulator for the next iteration
                return accumulator;
            }, []);

            // Log the filtered and sorted data
            console.log("filteredData = ", filteredData);

            // Call the function to create and populate the table
			createTable(filteredData);
            loadingIndicator.style.display = 'none';
        })
        .catch(error => {
            // Log any errors that occur during fetching or parsing JSON
            console.error('Error fetching data:', error);
        })
        .finally(() => {
            // Hide the loading_alarm_mvs indicator regardless of success or failure
            loadingIndicator.style.display = 'none';
        });
});

// Function to create table
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
    thLocation.style.backgroundColor = 'darkblue';
    headerRowTitle.appendChild(thLocation);

    // Create table headers for the remaining columns in the first row
    const columns02 = ["Observed", "Forecast"];
    columns02.forEach((columnName) => {
        const th = document.createElement('th');
        th.textContent = columnName;
        th.style.height = '50px';
        th.style.backgroundColor = 'darkblue';

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
        th.style.backgroundColor = 'darkblue';
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
    var todaysDataOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    console.log('todaysDataOnly: ', todaysDataOnly);

    // Day -1
    var dayMinus1 = new Date(date);
    dayMinus1.setDate(date.getDate() - 1);
    var nws_dayMinus1_date = ('0' + (dayMinus1.getMonth() + 1)).slice(-2) + '-' + ('0' + dayMinus1.getDate()).slice(-2) + '-' + dayMinus1.getFullYear();
    var nws_dayMinus1_date_title = ('0' + (dayMinus1.getMonth() + 1)).slice(-2) + '-' + ('0' + dayMinus1.getDate()).slice(-2);
    console.log('nws_dayMinus1_date: ', nws_dayMinus1_date);
    console.log('nws_dayMinus1_date_title: ', nws_dayMinus1_date_title);

    // Day 0
    var day0 = new Date(date);
    // Get the current hour in 24-hour format
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
        th.style.backgroundColor = 'darkblue';
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
            const currentDateTime = new Date();
            const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);
            const dateObjectFirstForecastDayByDayAndMonth = await fetchFirstNetmissDay("St Louis-Mississippi.Stage.Inst.~1Day.0.netmiss-fcst", currentDateTime, currentDateTimePlus7Days, cda);
            console.log("dateObjectFirstForecastDayByDayAndMonth Date", dateObjectFirstForecastDayByDayAndMonth.date);
            console.log("dateObjectFirstForecastDayByDayAndMonth Length", dateObjectFirstForecastDayByDayAndMonth.length);

            if (dateObjectFirstForecastDayByDayAndMonth.date > todaysDataOnly & dateObjectFirstForecastDayByDayAndMonth.length >= 7) {
                console.log("dateObjectFirstForecastDayByDayAndMonth is after todaysDataOnly, output the data table");
                if (current_hour < 0 || current_hour >= 10) {  // current_hour in 24-hour format
                    populateTableCells(filteredData, table);
                    const message = document.createElement('div');
                    message.innerHTML = "<img src='https://www.wpc.ncep.noaa.gov/medr/97ewbg.gif'";
                    if (tableContainer) {
                        tableContainer.appendChild(message);
                    }
                } else {
                    const message = document.createElement('h1');
                    message.innerHTML = 'Error, Out of limit';
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
                }
            } else if (dateObjectFirstForecastDayByDayAndMonth < todaysDataOnly) {
                console.log("dateObjectFirstForecastDayByDayAndMonth is before todaysDataOnly");
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
                console.log("dateObjectFirstForecastDayByDayAndMonth is the same as todaysDataOnly");
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

// Function to fetch ld summary data
function fetchFirstNetmissDay(tsid, begin, end, cda) {
    if (!tsid) {
        throw new Error('tsid cannot be null or undefined');
    }

    let url = null;
    if (cda === "internal") {
        url = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid}&begin=${begin.toISOString()}&end=${end.toISOString()}&office=MVS&timezone=CST6CDT`;
    } else if (cda === "public") {
        url = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid}&begin=${begin.toISOString()}&end=${end.toISOString()}&office=MVS&timezone=CST6CDT`;
    } else {
        throw new Error('Invalid value for cda');
    }

    console.log("url = ", url);

    return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;version=2'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(datax => {
            console.log("datax", datax);

            // Get the length of the values array
            const arrayLength = datax.values.length;

            // Extract the first entry from the values array
            const firstEntry = datax.values[0];
            if (!firstEntry) {
                throw new Error('No data available');
            }

            const timestampMs = firstEntry[0];
            const value = firstEntry[1];
            const qualityCode = firstEntry[2];

            // Convert timestamp from milliseconds to a Date object
            const dateObject = new Date(timestampMs);

            // Extract year, month, and day
            const year = dateObject.getUTCFullYear();
            const month = dateObject.getUTCMonth(); // Months are zero-based in JavaScript
            const day = dateObject.getUTCDate();

            // Create a new Date object with only year, month, and day components
            const dateObjectFirstForecastDayByDayAndMonth = new Date(year, month, day);

            // Return the date object and the length of the array
            return {
                date: dateObjectFirstForecastDayByDayAndMonth,
                length: arrayLength
            };
        })
        .catch(error => {
            console.error('Error:', error);
            throw error; // Rethrow the error to be caught by the caller
        });
}


// Function to get current data time
function subtractHoursFromDate(date, hoursToSubtract) {
    return new Date(date.getTime() - (hoursToSubtract * 60 * 60 * 1000));
}

// Function to get current data time
function plusHoursFromDate(date, hoursToSubtract) {
    return new Date(date.getTime() + (hoursToSubtract * 60 * 60 * 1000));
}

function populateTableCells(filteredData, table) {
    console.log("filteredData @ populateTableCells", filteredData);
    filteredData.forEach(location => {
        // Create a new row for each data object
        const row = table.insertRow();
        console.log("Calling fetchAndUpdateData");
        const currentDateTime = new Date();
        const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);
        const currentDateMinus30Hours = subtractHoursFromDate(currentDateTime, 30);
        fetchAndUpdateData(location.location_id
                            ,location.tsid_netmiss
                            ,location.tsid_netmiss_observe
                            ,row
                            ,currentDateTime
                            ,currentDateTimePlus7Days
                            ,currentDateMinus30Hours
                            ,location.level_id_flood
                            ,location.level_id_effective_date_flood
                            ,location.level_id_unit_id_flood
                            ,location.tsid_forecast_location
                        );
    });
}

// Function to fetch all data needed to run forecast
function fetchAndUpdateData(location_id
                            ,tsid1
                            ,tsid2
                            ,row
                            ,begin
                            ,end1
                            ,end2
                            ,level_id_flood
                            ,level_id_effective_date_flood
                            ,level_id_unit_id_flood
                            ,tsid_forecast_location
                        ) {
    let url1 = null;
    if (cda === "internal") {
        url1 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid1}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
    } else if (cda === "public") {
        url1 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid1}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
    } else {
        url1 = null;
    }
    console.log("url1 = ",  url1);

    let url2 = null;
    if (cda === "internal") {
        url2 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid2}&begin=${end2.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
    } else if (cda === "public") {
        url2 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid2}&begin=${end2.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
    } else {
        url2 = null;
    }
    console.log("url2 = ",  url2);

    let url3 = null;
    if (cda === "public") {
        url3 = `https://water.usace.army.mil/cwms-data/levels/${level_id_flood}?office=MVS&effective-date=${level_id_effective_date_flood}&unit=${level_id_unit_id_flood}`;
    } else if (cda === "internal") {
        url3 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${level_id_flood}?office=MVS&effective-date=${level_id_effective_date_flood}&unit=${level_id_unit_id_flood}`;
    }
    console.log('url3: ', url3);
    

    console.log("location_id = ",  location_id);

    fetchThreeUrls(url1, url2, url3)
        .then(({ data1, data2, data3 }) => {
        // Do something with the fetched data
        console.log("data1 = ", data1);
        console.log("data2 = ", data2);
        console.log("data3 = ", data3);

        // Process data1 - netmiss forecast data
        const convertedData = convertUTCtoCentralTime(data1);
        console.log("convertedData = ", convertedData);

        const isArrayLengthGreaterThanSeven = checkValuesArrayLength(data1);
        console.log("isArrayLengthGreaterThanSeven:", isArrayLengthGreaterThanSeven);

        // Process data2 - 6am level
        const result = getLatest6AMValue(data2);
        const latest6AMValue = result.latest6AMValue;
        const tsid = result.tsid;

        if (isArrayLengthGreaterThanSeven === true) {
            // LOCATION
            const locationIdCell = row.insertCell();
            locationIdCell.innerHTML = location_id;

            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.innerHTML = "<div title='" + latest6AMValue.date + "'>" +
            "<a href='../../chart/public/chart.html?cwms_ts_id=" + tsid + "' target='_blank'>" +
            (tsid_forecast_location !== null ? "<strong>" + parseFloat(latest6AMValue.value).toFixed(2) + "</strong>" : parseFloat(latest6AMValue.value).toFixed(2)) + "</a>" +
            "</div>";


            // DAY1
            const day1Cell = row.insertCell();
            const day1 = "<div title='" + convertedData.values[0] + "'>" + (convertedData.values[0][1]).toFixed(2) + "</div>";
            day1Cell.innerHTML = day1;

            // DAY2
            const day2Cell = row.insertCell();
            const day2 = "<div title='" + convertedData.values[1] + "'>" + (convertedData.values[1][1]).toFixed(2) + "</div>";
            day2Cell.innerHTML = day2;

            // DAY3
            const day3Cell = row.insertCell();
            const day3 = "<div title='" + convertedData.values[2] + "'>" + (convertedData.values[2][1]).toFixed(2) + "</div>";
            day3Cell.innerHTML = day3;

            // DAY4
            const day4Cell = row.insertCell();
            const day4 = "<div title='" + convertedData.values[3] + "'>" + (convertedData.values[3][1]).toFixed(2) + "</div>";
            day4Cell.innerHTML = day4;

            // DAY5
            const day5Cell = row.insertCell();
            const day5 = "<div title='" + convertedData.values[4] + "'>" + (convertedData.values[4][1]).toFixed(2) + "</div>";
            day5Cell.innerHTML = day5;

            // DAY6
            const day6Cell = row.insertCell();
            const day6 = "<div title='" + convertedData.values[5] + "'>" + (convertedData.values[5][1]).toFixed(2) + "</div>";
            day6Cell.innerHTML = day6;

            // DAY7
            const day7Cell = row.insertCell();
            const day7 = "<div title='" + convertedData.values[6] + "'>" + (convertedData.values[6][1]).toFixed(2) + "</div>";
            day7Cell.innerHTML = day7;
        } else {
            // LOCATION
            const locationIdCell = row.insertCell();
            locationIdCell.innerHTML = location_id;

            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.innerHTML = "<div title='" + latest6AMValue.date + "'>" +
            "<a href='../../chart/public/chart.html?cwms_ts_id=" + tsid + "' target='_blank'>" +
            (parseFloat(latest6AMValue.value).toFixed(2)) + "</a>" +
            "</div>";

            // DAY1
            const day1Cell = row.insertCell();
            const day1 = "<div title='" + convertedData.values[0] + "'>" + (convertedData.values[0][1]).toFixed(2) + "</div>";
            day1Cell.innerHTML = day1;

            // DAY2
            const day2Cell = row.insertCell();
            const day2 = "<div title='" + convertedData.values[1] + "'>" + (convertedData.values[1][1]).toFixed(2) + "</div>";
            day2Cell.innerHTML = day2;

            // DAY3
            const day3Cell = row.insertCell();
            const day3 = "<div title='" + convertedData.values[2] + "'>" + (convertedData.values[2][1]).toFixed(2) + "</div>";
            day3Cell.innerHTML = day3;

            // DAY4
            const day4Cell = row.insertCell();
            const day4 = "<div title='" + convertedData.values[3] + "'>" + (convertedData.values[3][1]).toFixed(2) + "</div>";
            day4Cell.innerHTML = day4;

            // DAY5
            const day5Cell = row.insertCell();
            const day5 = "<div title='" + convertedData.values[4] + "'>" + (convertedData.values[4][1]).toFixed(2) + "</div>";
            day5Cell.innerHTML = day5;

            // DAY6
            const day6Cell = row.insertCell();
            const day6 = "<div title='" + convertedData.values[5] + "'>" + (convertedData.values[5][1]).toFixed(2) + "</div>";
            day6Cell.innerHTML = day6;

            // DAY7
            const day7Cell = row.insertCell();
            const day7 = "<div title='" + "" + "'>" + "" + "</div>";
            day7Cell.innerHTML = day7;
        }
        
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

// Function to check for duplicate date_time values
function checkForDuplicates(data) {
    const dateTimes = data.map(entry => entry.date_time);
    const uniqueDateTimes = new Set(dateTimes);

    return dateTimes.length === uniqueDateTimes.size;
}

// Function to fetch two urls, netmiss and stagerev
async function fetchThreeUrls(url1, url2, url3) {
    const fetchOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json;version=2'
        }
    };

    try {
        const response1Promise = fetch(url1, fetchOptions);
        const response2Promise = fetch(url2, fetchOptions);
        const response3Promise = fetch(url3, fetchOptions);

        const [response1, response2, response3] = await Promise.all([response1Promise, response2Promise, response3Promise]);

        let data1 = null;
        let data2 = null;
        let data3 = null;

        if (response1.ok) {
            data1 = await response1.json();
        } else {
            console.error(`Fetch request to ${url1} failed with status ${response1.status}`);
        }

        if (response2.ok) {
            data2 = await response2.json();
        } else {
            console.error(`Fetch request to ${url2} failed with status ${response2.status}`);
        }

        if (response3.ok) {
            data3 = await response3.json();
        } else {
            console.error(`Fetch request to ${url3} failed with status ${response3.status}`);
        }

        return { data1, data2, data3 };
    } catch (error) {
        console.error('Error fetching the URLs:', error.message);
        return { data1: null, data2: null, data3: null }; // return null data if any error occurs
    }
}

// Function to get lastest 6am value
function getLatest6AMValue(data) {
    // Extract the values array from the data
    const values = data.values;

    // Extract the tsid from the data
    const tsid = data.name;

    // Initialize a variable to store the latest 6 AM value
    let latest6AMValue = null;

    // Initialize a variable to store the latest timestamp
    let latest6AMTimestamp = 0;

    // Define the Central Time timezone
    const centralTimeZone = 'America/Chicago';

    // Iterate through the values array
    for (let i = 0; i < values.length; i++) {
        const [timestamp, value, qualityCode] = values[i];

        // Convert the timestamp to a Date object in UTC
        const date = new Date(timestamp);

        // Convert the UTC date to Central Time
        const centralDate = new Date(date.toLocaleString('en-US', { timeZone: centralTimeZone }));

        // Check if the time is 6 AM (6:00:00) in Central Time
        if (centralDate.getHours() === 6 && centralDate.getMinutes() === 0 && centralDate.getSeconds() === 0) {
            // If the current timestamp is later than the previously stored one, update the latest value
            if (timestamp > latest6AMTimestamp) {
                latest6AMValue = { date: centralDate.toISOString(), value, qualityCode };
                latest6AMTimestamp = timestamp;
            }
        }
    }

    // Return the latest 6 AM value found and tsid
    return {
        latest6AMValue,
        tsid
    };
}

// Function to check for values length
function checkValuesArrayLength(data) {
    // Check if data is null or undefined
    if (!data) {
        console.log('Data is null or undefined.');
        return false;
    }

    // Check if data.values is null or undefined
    if (!data.values) {
        console.log('Data.values is null or undefined.');
        return false;
    }

    const valuesArray = data.values;
    const expectedLength = 7;

    if (valuesArray.length === expectedLength) {
        console.log(`The values array contains exactly ${expectedLength} items.`);
        return true;
    } else {
        console.log(`The values array does not contain ${expectedLength} items. It contains ${valuesArray.length} items.`);
        return false;
    }
}

// Function to get first netmiss value 
function getFirstNetmissValue(data) {
    // Extract the values array from the data
    const values = data.values;

    if (!values || values.length === 0) {
        throw new Error('No values found in the data');
    }

    // Extract the first netmiss value array
    const firstNetmissValue = values[0];

    // Convert the timestamp to a Date object
    const timestamp = firstNetmissValue[0];
    const date = new Date(timestamp);

    // Extract day and month only
    const todaysDataOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Replace the timestamp with the day and month only
    firstNetmissValue[0] = todaysDataOnly;

    return firstNetmissValue;
}

// Function to convert UTC to Central
function convertUTCtoCentralTime(data) {
    // Return null if data is null
    if (data === null) {
        return null;
    }

    // Define the Central Time timezone
    const centralTimeZone = 'America/Chicago';

    // Helper function to convert a UTC timestamp to Central Time
    function convertTimestampToCentralTime(timestamp) {
        // Create a Date object from the UTC timestamp
        const utcDate = new Date(timestamp);

        // Convert the UTC date to Central Time
        const centralDate = new Date(utcDate.toLocaleString('en-US', { timeZone: centralTimeZone }));

        return centralDate;
    }

    // Create a copy of the data object to avoid mutating the original
    const convertedData = JSON.parse(JSON.stringify(data));

    // Iterate over the values array and convert each timestamp
    convertedData.values = convertedData.values.map(valueArray => {
        const [timestamp, ...rest] = valueArray;
        const centralDate = convertTimestampToCentralTime(timestamp);
        return [centralDate, ...rest];
    });

    return convertedData;
}