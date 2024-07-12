let ForecastValues = {
    birdsPointForecast: {}
};

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
        .then(jsonData => {
            // Log the fetched jsonData
            console.log('jsonData: ', jsonData);

            // Filter and sort the jsonData
            const jsonDataFiltered = jsonData.reduce((accumulator, currentValue) => {
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

            // Sort the filtered data by netmiss_forecast_sort_order from low to high
            jsonDataFiltered.sort((a, b) => a.netmiss_forecast_sort_order - b.netmiss_forecast_sort_order);

            // Log the filtered and sorted data
            console.log("jsonDataFiltered = ", jsonDataFiltered);

            // Call the function to create and populate the table
			createTable(jsonDataFiltered);

            // loading indicator set to none
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
function createTable(jsonDataFiltered) {
    // Create a table element
    const table = document.createElement('table');
    table.setAttribute('id', 'forecast'); // Set the id to "gage_data"

    // console.log("jsonDataFiltered inside createTable Function = ", jsonDataFiltered);

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
    // console.log('timestamp: ', timestamp);
    // console.log('date: ', date);

    // Extract only the date (without time)
    var todaysDataOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    // console.log('todaysDataOnly: ', todaysDataOnly);

    // Day -1
    var dayMinus1 = new Date(date);
    dayMinus1.setDate(date.getDate() - 1);
    var nws_dayMinus1_date = ('0' + (dayMinus1.getMonth() + 1)).slice(-2) + '-' + ('0' + dayMinus1.getDate()).slice(-2) + '-' + dayMinus1.getFullYear();
    var nws_dayMinus1_date_title = ('0' + (dayMinus1.getMonth() + 1)).slice(-2) + '-' + ('0' + dayMinus1.getDate()).slice(-2);
    // console.log('nws_dayMinus1_date: ', nws_dayMinus1_date);
    // console.log('nws_dayMinus1_date_title: ', nws_dayMinus1_date_title);

    // Day 0
    var day0 = new Date(date);
    // Get the current hour in 24-hour format
    var current_hour = day0.getHours();
    var nws_day0_date = ('0' + (day0.getMonth() + 1)).slice(-2) + '-' + ('0' + day0.getDate()).slice(-2) + '-' + day0.getFullYear();
    var nws_day0_date_title = ('0' + (day0.getMonth() + 1)).slice(-2) + '-' + ('0' + day0.getDate()).slice(-2);
    // console.log('current_hour: ', current_hour);
    // console.log('nws_day0_date: ', nws_day0_date);
    // console.log('nws_day0_date_title: ', nws_day0_date_title);

    // Day 1
    var day1 = new Date(date);
    day1.setDate(date.getDate() + 1);
    var nws_day1_date = ('0' + (day1.getMonth() + 1)).slice(-2) + '-' + ('0' + day1.getDate()).slice(-2) + '-' + day1.getFullYear();
    var nws_day1_date_title = ('0' + (day1.getMonth() + 1)).slice(-2) + '-' + ('0' + day1.getDate()).slice(-2);
    // console.log('nws_day1_date: ', nws_day1_date);
    // console.log('nws_day1_date_title: ', nws_day1_date_title);

    // Day 2
    var day2 = new Date(date);
    day2.setDate(date.getDate() + 2);
    var nws_day2_date = ('0' + (day2.getMonth() + 1)).slice(-2) + '-' + ('0' + day2.getDate()).slice(-2) + '-' + day2.getFullYear();
    var nws_day2_date_title = ('0' + (day2.getMonth() + 1)).slice(-2) + '-' + ('0' + day2.getDate()).slice(-2);
    // console.log('nws_day2_date: ', nws_day2_date);
    // console.log('nws_day2_date_title: ', nws_day2_date_title);

    // Day 3
    var day3 = new Date(date);
    day3.setDate(date.getDate() + 3);
    var nws_day3_date = ('0' + (day3.getMonth() + 1)).slice(-2) + '-' + ('0' + day3.getDate()).slice(-2) + '-' + day3.getFullYear();
    var nws_day3_date_title = ('0' + (day3.getMonth() + 1)).slice(-2) + '-' + ('0' + day3.getDate()).slice(-2);
    // console.log('nws_day3_date: ', nws_day3_date);
    // console.log('nws_day3_date_title: ', nws_day3_date_title);

    // Day 4
    var day4 = new Date(date);
    day4.setDate(date.getDate() + 4);
    var nws_day4_date = ('0' + (day4.getMonth() + 1)).slice(-2) + '-' + ('0' + day4.getDate()).slice(-2) + '-' + day4.getFullYear();
    var nws_day4_date_title = ('0' + (day4.getMonth() + 1)).slice(-2) + '-' + ('0' + day4.getDate()).slice(-2);
    // console.log('nws_day4_date: ', nws_day4_date);
    // console.log('nws_day4_date_title: ', nws_day4_date_title);

    // Day 5
    var day5 = new Date(date);
    day5.setDate(date.getDate() + 5);
    var nws_day5_date = ('0' + (day5.getMonth() + 1)).slice(-2) + '-' + ('0' + day5.getDate()).slice(-2) + '-' + day5.getFullYear();
    var nws_day5_date_title = ('0' + (day5.getMonth() + 1)).slice(-2) + '-' + ('0' + day5.getDate()).slice(-2);
    // console.log('nws_day5_date: ', nws_day5_date);
    // console.log('nws_day5_date_title: ', nws_day5_date_title);

    // Day 6
    var day6 = new Date(date);
    day6.setDate(date.getDate() + 6);
    var nws_day6_date = ('0' + (day6.getMonth() + 1)).slice(-2) + '-' + ('0' + day6.getDate()).slice(-2) + '-' + day6.getFullYear();
    var nws_day6_date_title = ('0' + (day6.getMonth() + 1)).slice(-2) + '-' + ('0' + day6.getDate()).slice(-2);
    // console.log('nws_day6_date: ', nws_day6_date);
    // console.log('nws_day6_date_title: ', nws_day6_date_title);

    // Day 7
    var day7 = new Date(date);
    day7.setDate(date.getDate() + 7);
    var nws_day7_date = ('0' + (day7.getMonth() + 1)).slice(-2) + '-' + ('0' + day7.getDate()).slice(-2) + '-' + day7.getFullYear();
    var nws_day7_date_title = ('0' + (day7.getMonth() + 1)).slice(-2) + '-' + ('0' + day7.getDate()).slice(-2);
    // console.log('nws_day7_date: ', nws_day7_date);
    // console.log('nws_day7_date_title: ', nws_day7_date_title);


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

    // get netmiss data here
    (async () => {
        try {
            const currentDateTime = new Date();
            const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);

            // Get St Louis netmiss to set the date
            const dateObjectFirstForecastDayByDayAndMonth = await fetchFirstNetmissDay("St Louis-Mississippi.Stage.Inst.~1Day.0.netmiss-fcst", currentDateTime, currentDateTimePlus7Days, cda);
            // console.log("dateObjectFirstForecastDayByDayAndMonth: ", dateObjectFirstForecastDayByDayAndMonth.date);
            // console.log("dateObjectFirstForecastDayByDayAndMonth: ", dateObjectFirstForecastDayByDayAndMonth.length);

            // Testing - Forced to output a table
            populateTableCells(jsonDataFiltered, table, nws_day1_date);

            if (dateObjectFirstForecastDayByDayAndMonth.date > todaysDataOnly & dateObjectFirstForecastDayByDayAndMonth.length >= 7) {
                console.log("dateObjectFirstForecastDayByDayAndMonth is after todaysDataOnly, output data table");

                // Display netmiss data here based on time
                if (current_hour < 0 || current_hour >= 10) {  // current_hour in 24-hour format
                    // Populate netmiss data here
                    populateTableCells(jsonDataFiltered, table, nws_day1_date);
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

    let urlFirstNetmissDay = null;
    if (cda === "internal") {
        urlFirstNetmissDay = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid}&begin=${begin.toISOString()}&end=${end.toISOString()}&office=MVS&timezone=CST6CDT`;
    } else if (cda === "public") {
        urlFirstNetmissDay = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid}&begin=${begin.toISOString()}&end=${end.toISOString()}&office=MVS&timezone=CST6CDT`;
    } else {
        throw new Error('Invalid value for cda');
    }

    // console.log("urlFirstNetmissDay = ", urlFirstNetmissDay);

    return fetch(urlFirstNetmissDay, {
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
        .then(FirstNetmissDayData => {
            // console.log("FirstNetmissDayData", FirstNetmissDayData);

            // Get the length of the values array
            const arrayLength = FirstNetmissDayData.values.length;

            // Extract the first entry from the values array
            const firstEntry = FirstNetmissDayData.values[0];
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

// Populate netmiss data cells
function populateTableCells(jsonDataFiltered, table, nws_day1_date) {
    // console.log("jsonDataFiltered inside populateTableCells: ", jsonDataFiltered);

    jsonDataFiltered.forEach(location => {
        // Create a new row for each data object
        const row = table.insertRow();
        // console.log("Calling fetchAndUpdateData");

        // setup date time before calling function
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
                            ,location.tsid_netmiss_upstream
                            ,location.tsid_netmiss_downstream
                            ,location.tsid_netmiss_downstream_flood
                            ,location.tsid_netmiss_upstream_stage_rev
                            ,location.tsid_netmiss_downstream_stage_rev
                            ,location.tsid_rvf_ff
                            ,nws_day1_date
                            ,location.tsid_netmiss_forecasting_location_upstream
                            ,location.tsid_netmiss_forecasting_location_downstream
                            ,location.river_mile_hard_coded
                            ,location.netmiss_river_mile_hard_coded_upstream
                            ,location.netmiss_river_mile_hard_coded_downstream
                            ,location.tsid_rvf_ff_downstream
                            ,location.tsid_rvf_ff_dependance
                            ,location.tsid_netmiss_flow
                            ,location.tsid_rating_id_coe
                        );
    });
}

// Function to fetch all data needed to run forecast
function fetchAndUpdateData(location_id
                            ,tsid_netmiss
                            ,tsid_netmiss_observe
                            ,row
                            ,begin
                            ,end1
                            ,end2
                            ,level_id_flood
                            ,level_id_effective_date_flood
                            ,level_id_unit_id_flood
                            ,tsid_forecast_location
                            ,tsid_netmiss_upstream
                            ,tsid_netmiss_downstream
                            ,tsid_netmiss_downstream_flood
                            ,tsid_netmiss_upstream_stage_rev
                            ,tsid_netmiss_downstream_stage_rev
                            ,tsid_rvf_ff
                            ,nws_day1_date
                            ,tsid_netmiss_forecasting_location_upstream
                            ,tsid_netmiss_forecasting_location_downstream
                            ,river_mile_hard_coded
                            ,netmiss_river_mile_hard_coded_upstream
                            ,netmiss_river_mile_hard_coded_downstream
                            ,tsid_rvf_ff_downstream
                            ,tsid_rvf_ff_dependance
                            ,tsid_netmiss_flow
                            ,tsid_rating_id_coe
                        ) {

    // console.log("location_id =",  location_id);
    
    // Get Netmiss Forecast
    let url1 = null;
    if (tsid_netmiss !== null) {
        if (cda === "internal") {
            url1 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_netmiss}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url1 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_netmiss}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url1 = ", url1);

    // Get Stage-Rev
    let url2 = null;
    if (tsid_netmiss_observe !== null) {
        if (cda === "internal") {
            url2 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_netmiss_observe}&begin=${end2.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url2 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_netmiss_observe}&begin=${end2.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url2 = ", url2);

    // Get Flood Stage
    let url3 = null;
    if (level_id_flood !== null) {
        if (cda === "public") {
            url3 = `https://water.usace.army.mil/cwms-data/levels/${level_id_flood}?office=MVS&effective-date=${level_id_effective_date_flood}&unit=${level_id_unit_id_flood}`;
        } else if (cda === "internal") {
            url3 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${level_id_flood}?office=MVS&effective-date=${level_id_effective_date_flood}&unit=${level_id_unit_id_flood}`;
        }
    }
    // console.log('url3 = ', url3);

    // Get Downstream Netmiss
    let url4 = null;
    if (tsid_netmiss_downstream !== null) {
        if (cda === "internal") {
            url4 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_netmiss_downstream}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url4 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_netmiss_downstream}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url4 = ", url4);

    // Get Downstream Flood Stage
    let url5 = null;
    if (tsid_netmiss_downstream_flood !== null) {
        if (cda === "public") {
            url5 = `https://water.usace.army.mil/cwms-data/levels/${tsid_netmiss_downstream_flood}?office=MVS&effective-date=${level_id_effective_date_flood}&unit=${level_id_unit_id_flood}`;
        } else if (cda === "internal") {
            url5 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/levels/${tsid_netmiss_downstream_flood}?office=MVS&effective-date=${level_id_effective_date_flood}&unit=${level_id_unit_id_flood}`;
        }
    }
    // console.log('url5 = ', url5);

    // Get Downstream Metadata
    let url6 = null;
    let netmissDownstreamLocationId = null;
    if (tsid_netmiss_downstream !== null) {
        netmissDownstreamLocationId = (tsid_netmiss_downstream.split('.'))[0];
    }
    if (netmissDownstreamLocationId !== null) {
        if (cda === "public") {
            url6 = `https://cwms-data.usace.army.mil/cwms-data/locations/${netmissDownstreamLocationId}?office=MVS`;
        } else if (cda === "internal") {
            url6 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/locations/${netmissDownstreamLocationId}?office=MVS`;
        }
    }
    // console.log('url6 = ', url6);

    // Get Upstream Stage-Rev
    let url7 = null;
    if (tsid_netmiss_upstream_stage_rev !== null) {
        if (cda === "internal") {
            url7 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_netmiss_upstream_stage_rev}&begin=${end2.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url7 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_netmiss_upstream_stage_rev}&begin=${end2.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url7 = ", url7);

    // Get Upstream Netmiss
    let url8 = null;
    if (tsid_netmiss_upstream !== null) {
        if (cda === "internal") {
            url8 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_netmiss_upstream}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url8 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_netmiss_upstream}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url8 = ", url8);

    // Get Downstream Stage-Rev
    let url9 = null;
    if (tsid_netmiss_downstream_stage_rev !== null) {
        if (cda === "internal") {
            url9 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_netmiss_downstream_stage_rev}&begin=${end2.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url9 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_netmiss_downstream_stage_rev}&begin=${end2.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url9 = ", url9);

    // Get RVF-FF Forecast
    let url10 = null;
    if (tsid_rvf_ff !== null) {
        if (cda === "internal") {
            url10 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_rvf_ff}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url10 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_rvf_ff}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url10 = ", url10);

    // Get Upstream Netmiss Forecasted Point
    let url11 = null;
    if (tsid_netmiss_forecasting_location_upstream !== null) {
        if (cda === "internal") {
            url11 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_netmiss_forecasting_location_upstream}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url11 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_netmiss_forecasting_location_upstream}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url11 = ", url11);

    // Get Downstream Netmiss Forecasted Point
    let url12 = null;
    if (tsid_netmiss_forecasting_location_downstream !== null) {
        if (cda === "internal") {
            url12 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_netmiss_forecasting_location_downstream}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url12 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_netmiss_forecasting_location_downstream}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url12 = ", url12);

    // Get Downstream RVF-FF Forecast 
    let url13 = null;
    if (tsid_rvf_ff_downstream !== null) {
        if (cda === "internal") {
            url13 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_rvf_ff_downstream}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url13 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_rvf_ff_downstream}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url13 = ", url13);

    // Get RVF-FF Dependance Forecast for Birds Points 
    let url14 = null;
    if (tsid_rvf_ff_dependance !== null) {
        if (cda === "internal") {
            url14 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_rvf_ff_dependance}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url14 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_rvf_ff_dependance}&begin=${begin.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url14 = ", url14);

    // Get Netmiss Flow Forecast 
    let url15 = null;
    if (tsid_netmiss_flow !== null) {
        if (cda === "internal") {
            url15 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_netmiss_flow}&begin=${end2.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url15 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_netmiss_flow}&begin=${end2.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url15 = ", url15);

    // Get Rating Table COE 
    let url16 = null;
    if (tsid_rating_id_coe !== null) {
        if (cda === "internal") {
            url16 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/ratings/${tsid_rating_id_coe}?office=MVS`;
        } else if (cda === "public") {
            url16 = `https://cwms-data.usace.army.mil/cwms-data/${tsid_rating_id_coe}?office=MVS`;
        }
    }
    // console.log("url16 = ", url16);

    fetchAllUrls(url1, url2, url3, url4, url5, url6, url7, url8, url9, url10, url11, url12, url13, url14, url15, url16)
        .then(({ data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12, data13, data14, data15, data16 }) => {
        // console.log("location_id =",  location_id);
        // Do something with the fetched data
        // console.log("data1 = ", data1);
        // console.log("data2 = ", data2);
        // console.log("data3 = ", data3);
        // console.log("data4 = ", data4);
        // console.log("data5 = ", data5);
        // console.log("data6 = ", data6);
        // console.log("data7 = ", data7);
        // console.log("data8 = ", data8);
        // console.log("data9 = ", data9);
        // console.log("data10 = ", data10);
        // console.log("data11 = ", data11);
        // console.log("data12 = ", data12);
        // console.log("data13 = ", data13);
        // console.log("data14 = ", data14);
        // console.log("data15 = ", data15);
        // console.log("data16 = ", data16);

        // Process data1 - netmiss forecast data
        const convertedData = convertUTCtoCentralTime(data1);
        // console.log("convertedData = ", convertedData);

        // Process data8 - upstream netmiss forecast data
        const convertedNetmissUpstreamData = convertUTCtoCentralTime(data8);
        // console.log("convertedNetmissUpstreamData = ", convertedNetmissUpstreamData);

        const isNetmissForecastArrayLengthGreaterThanSeven = checkValuesArrayLength(data1);
        // console.log("isNetmissForecastArrayLengthGreaterThanSeven:", isNetmissForecastArrayLengthGreaterThanSeven);

        // Process data2 - 6am level
        const result = getLatest6AMValue(data2);
        const latest6AMValue = result.latest6AMValue;
        const tsid = result.tsid;

        // Process data4 Downstream Netmiss for Interpolation
        const convertedNetmissDownstreamData = convertUTCtoCentralTime(data4);
        // console.log("convertedNetmissDownstreamData = ", convertedNetmissDownstreamData);

        // Process data11 - upstream netmiss forecasting point data
        const convertedNetmissForecastingPointUpstreamData = convertUTCtoCentralTime(data11);
        // console.log("convertedNetmissForecastingPointUpstreamData = ", convertedNetmissForecastingPointUpstreamData);

        // Process data12 - downstream netmiss forecasting point data
        const convertedNetmissForecastingPointDownstreamData = convertUTCtoCentralTime(data12);
        // console.log("convertedNetmissForecastingPointDownstreamData = ", convertedNetmissForecastingPointDownstreamData);

        // Process data10 - RVF-FF 7am levels
        let result10 = null;
        let latest7AMRvfValue = null;
        let isRvfArrayLengthGreaterThanSeven = null;
        if (data10 !== null) {
            result10 = get7AMValuesForWeek(data10, nws_day1_date);
            latest7AMRvfValue = result10.valuesAt7AM;
            isRvfArrayLengthGreaterThanSeven = latest7AMRvfValue.length >= 7;

            // console.log("result10 = ", result10);
            // console.log("latest7AMRvfValue = ", latest7AMRvfValue);
            // console.log("latest7AMRvfValue[0] = ", latest7AMRvfValue[0]);
            // console.log("latest7AMRvfValue[0].value = ", latest7AMRvfValue[0].value);
            // console.log("isRvfArrayLengthGreaterThanSeven:", isRvfArrayLengthGreaterThanSeven);
        }

        // Process data14 - Birds Point-Mississippi forecast based on Cairo-Ohio into an array for 7 days
        // console.log("location_id =",  location_id);
        let result14 = null;
        let latest7AMRvfDependanceValue = null;
        let isRvfDependanceArrayLengthGreaterThanSeven = null;
        let yesterday6AMValueDownstream = null;
        let BirdsPointForecastValue = [];
        ForecastValues.birdsPointForecast[location_id] = [];
        if (data14 !== null && data9 !== null) {
            result14 = get7AMValuesForWeek(data14, nws_day1_date);
            latest7AMRvfDependanceValue = result14.valuesAt7AM;
            isRvfDependanceArrayLengthGreaterThanSeven = latest7AMRvfDependanceValue.length >= 7;

            // console.log("result14 = ", result14);
            // console.log("latest7AMRvfDependanceValue = ", latest7AMRvfDependanceValue);
 
            const yesterday6AMValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
            // console.log("yesterday6AMValue = ", yesterday6AMValue);

            yesterday6AMValueDownstream = ((getLatest6AMValue(data9)).latest6AMValue).value;
            // console.log("yesterday6AMValueDownstream = ", yesterday6AMValueDownstream);

            // Calculate the initial value
            let initialValue = yesterday6AMValue + (latest7AMRvfDependanceValue[0].value - yesterday6AMValueDownstream);
            BirdsPointForecastValue.push({ "value": initialValue });
            // console.log("initialValue = ", initialValue);

            let initialValue2 = yesterday6AMValue + (latest7AMRvfDependanceValue[0].value - yesterday6AMValueDownstream);
            ForecastValues.birdsPointForecast[location_id].push({ "value": initialValue2 });
            // console.log("initialValue2 = ", initialValue2);

            // Calculate subsequent values
            for (let i = 1; i < latest7AMRvfDependanceValue.length; i++) {
                let previousValue = BirdsPointForecastValue[BirdsPointForecastValue.length - 1].value;
                let newValue = previousValue + (latest7AMRvfDependanceValue[i].value - latest7AMRvfDependanceValue[i - 1].value);
                BirdsPointForecastValue.push({ "value": newValue });
            }
            // console.log("BirdsPointForecastValue = ", BirdsPointForecastValue);

            // Calculate subsequent values
            for (let i = 1; i < latest7AMRvfDependanceValue.length; i++) {
                let previousValue = ForecastValues.birdsPointForecast[location_id][ForecastValues.birdsPointForecast[location_id].length - 1].value;
                let newValue = previousValue + (latest7AMRvfDependanceValue[i].value - latest7AMRvfDependanceValue[i - 1].value);
                ForecastValues.birdsPointForecast[location_id].push({ "value": newValue });
            }
            // console.log("ForecastValues.birdsPointForecast[location_id] = ", ForecastValues.birdsPointForecast[location_id]);

            isRvfDependanceArrayLengthGreaterThanSeven = BirdsPointForecastValue.length >= 7;
            // console.log("isRvfDependanceArrayLengthGreaterThanSeven:", isRvfDependanceArrayLengthGreaterThanSeven);
        }
        let BirdsPointForecastValue2 =  ForecastValues?.birdsPointForecast["Birds Point-Mississippi"];

        // Starting Processing All Gages
        if (isNetmissForecastArrayLengthGreaterThanSeven === true || isRvfArrayLengthGreaterThanSeven === true || isRvfDependanceArrayLengthGreaterThanSeven === true) {
            // LOCATION
            const locationIdCell = row.insertCell();
            locationIdCell.innerHTML = location_id;

            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.innerHTML = "<div title='" + latest6AMValue.date + "'>" + 
            "<a href='../../chart/public/chart.html?cwms_ts_id=" + tsid + "' target='_blank'>" +
            (tsid_forecast_location === true ? "<strong>" + parseFloat(latest6AMValue.value).toFixed(2) + "</strong>" : parseFloat(latest6AMValue.value).toFixed(2)) + "</a>" +
            "</div>";


            // DAY1
            const day1Cell = row.insertCell();
            let day1 = null;
            // Process netmiss interpolation for each gage here
            if (location_id === "Mel Price Pool-Mississippi") {
                // Compare downstream gage to determine "Open River" or Not
                if (convertedData !== null && convertedNetmissDownstreamData !== null) {
                    // Calculate downstream value to determine for "Open River"
                    let downstreamMelPricePoolValueToCompare = parseFloat(data6.elevation) + 0.5 + convertedNetmissDownstreamData.values[0][1];
                    // console.log("downstreamMelPricePoolValueToCompare: ", downstreamMelPricePoolValueToCompare);

                    // Get today netmiss forecast to compare and determine for "Open River"
                    let todayMelPricePoolNetmissForecast = convertedData.values[0][1];
                    // console.log("todayMelPricePoolNetmissForecast: ", todayMelPricePoolNetmissForecast);

                    // Determine if today is "Open River"
                    if (downstreamMelPricePoolValueToCompare > todayMelPricePoolNetmissForecast) {
                        day1 = "<div title='" + "(" + parseFloat(data6.elevation).toFixed(2) + " + 0.5 + " + (convertedNetmissDownstreamData.values[0][1]).toFixed(2) + ") (" + downstreamMelPricePoolValueToCompare.toFixed(2) + " >= " + todayMelPricePoolNetmissForecast.toFixed(2) + ") = Open River" + "'>" + (tsid_forecast_location === true ? "<strong>" + "Open River" : "-Error-") + "</div>";
                    } else {
                        day1 = "<div title='" + convertedData.values[0] + "'>" + (tsid_forecast_location === true ? "<strong>" + (convertedData.values[0][1]).toFixed(1) : (convertedData.values[0][1]).toFixed(1)) + "</div>";
                    }
                } else {
                    day1 = "<div>" + "--" + "</div>";
                }
            } else {
                if (convertedData !== null) {
                    day1 = "<div title='" + convertedData.values[0] + "'>" + 
                        (tsid_forecast_location === true ? "<strong>" + (convertedData.values[0][1]).toFixed(1) + "</strong>" : (convertedData.values[0][1]).toFixed(1)) + 
                        "</div>";
                } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                    day1 = "<div title='" + BirdsPointForecastValue[0] + "'>" + 
                        (tsid_forecast_location === true ? "<strong>" + (BirdsPointForecastValue[0].value).toFixed(1) + "</strong>" : (BirdsPointForecastValue[0].value).toFixed(1)) + 
                        "</div>";
                } else if (latest7AMRvfValue[0] !== null && latest7AMRvfValue[0] !== undefined) {
                    day1 = "<div title='" + latest7AMRvfValue[0] + "'>" + 
                        (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[0].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[0].value).toFixed(1)) + 
                        "</div>";
                } else {
                    day1 = "<div>" + "-" + "</div>";
                }
            }
            day1Cell.innerHTML = day1;

            // DAY2
            const day2Cell = row.insertCell();
            let day2 = null;
            if (convertedData !== null) {
                day2 = "<div title='" + convertedData.values[1] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (convertedData.values[1][1]).toFixed(1) + "</strong>" : (convertedData.values[1][1]).toFixed(1)) + 
                    "</div>";
            } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                day2 = "<div title='" + BirdsPointForecastValue[1] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (BirdsPointForecastValue[1].value).toFixed(1) + "</strong>" : (BirdsPointForecastValue[1].value).toFixed(1)) + 
                    "</div>";
            } else if (latest7AMRvfValue[1] !== null) {
                day2 = "<div title='" + latest7AMRvfValue[1] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[1].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[1].value).toFixed(1)) + 
                    "</div>";
            } else {
                day2 = "<div>" + "-" + "</div>";
            }
            day2Cell.innerHTML = day2;

            // DAY3
            const day3Cell = row.insertCell();
            let day3 = null;
            if (convertedData !== null) {
                day3 = "<div title='" + convertedData.values[2] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (convertedData.values[2][1]).toFixed(1) + "</strong>" : (convertedData.values[2][1]).toFixed(1)) + 
                    "</div>";
            } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                day3 = "<div title='" + BirdsPointForecastValue[2] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (BirdsPointForecastValue[2].value).toFixed(1) + "</strong>" : (BirdsPointForecastValue[2].value).toFixed(1)) + 
                    "</div>";
            } else if (latest7AMRvfValue[2] !== null) {
                day3 = "<div title='" + latest7AMRvfValue[2] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[2].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[2].value).toFixed(1)) + 
                    "</div>";
            } else {
                day3 = "<div>" + "-" + "</div>";
            }
            day3Cell.innerHTML = day3;

            // DAY4
            const day4Cell = row.insertCell();
            let day4 = null;
            if (convertedData !== null) {
                day4 = "<div title='" + convertedData.values[3] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (convertedData.values[3][1]).toFixed(1) + "</strong>" : (convertedData.values[3][1]).toFixed(1)) + 
                    "</div>";
            } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                day4 = "<div title='" + BirdsPointForecastValue[3] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (BirdsPointForecastValue[3].value).toFixed(1) + "</strong>" : (BirdsPointForecastValue[3].value).toFixed(1)) + 
                    "</div>";
            } else if (latest7AMRvfValue[3] !== null) {
                day4 = "<div title='" + latest7AMRvfValue[3] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[3].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[3].value).toFixed(1)) + 
                    "</div>";
            } else {
                day4 = "<div>" + "-" + "</div>";
            }
            day4Cell.innerHTML = day4;

            // DAY5
            const day5Cell = row.insertCell();
            let day5 = null;
            if (convertedData !== null) {
                day5 = "<div title='" + convertedData.values[4] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (convertedData.values[4][1]).toFixed(1) + "</strong>" : (convertedData.values[4][1]).toFixed(1)) + 
                    "</div>";
            } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                day5 = "<div title='" + BirdsPointForecastValue[4] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (BirdsPointForecastValue[4].value).toFixed(1) + "</strong>" : (BirdsPointForecastValue[4].value).toFixed(1)) + 
                    "</div>";
            } else if (latest7AMRvfValue[4] !== null) {
                day5 = "<div title='" + latest7AMRvfValue[4] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[4].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[4].value).toFixed(1)) + 
                    "</div>";
            } else {
                day5 = "<div>" + "-" + "</div>";
            }
            day5Cell.innerHTML = day5;

            // DAY6
            const day6Cell = row.insertCell();
            let day6 = null;
            if (convertedData !== null) {
                day6 = "<div title='" + convertedData.values[5] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (convertedData.values[5][1]).toFixed(1) + "</strong>" : (convertedData.values[5][1]).toFixed(1)) + 
                    "</div>";
            } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                day6 = "<div title='" + BirdsPointForecastValue[5] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (BirdsPointForecastValue[5].value).toFixed(1) + "</strong>" : (BirdsPointForecastValue[5].value).toFixed(1)) + 
                    "</div>";
            } else if (latest7AMRvfValue[5] !== null) {
                day6 = "<div title='" + latest7AMRvfValue[5] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[5].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[5].value).toFixed(1)) + 
                    "</div>";
            } else {
                day6 = "<div>" + "-" + "</div>";
            }
            day6Cell.innerHTML = day6;

            // DAY7
            const day7Cell = row.insertCell();
            let day7 = null;
            if (convertedData !== null && convertedData.values[6] !== null) {
                day7 = "<div title='" + convertedData.values[6] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (convertedData.values[6][1]).toFixed(1) + "</strong>" : (convertedData.values[6][1]).toFixed(1)) + 
                    "</div>";
            } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                day7 = "<div title='" + BirdsPointForecastValue[6] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (BirdsPointForecastValue[6].value).toFixed(1) + "</strong>" : (BirdsPointForecastValue[6].value).toFixed(1)) + 
                    "</div>";
            } else if (latest7AMRvfValue[6] !== null) {
                day7 = "<div title='" + latest7AMRvfValue[6] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[6].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[6].value).toFixed(1)) + 
                    "</div>";
            } else {
                day7 = "<div>" + "-" + "</div>";
            }
            day7Cell.innerHTML = day7;
        } else {
            // LOCATION
            const locationIdCell = row.insertCell();
            locationIdCell.innerHTML = location_id;

            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.innerHTML = "<div title='" + latest6AMValue.date + "'>" +
            "<a href='../../chart/public/chart.html?cwms_ts_id=" + tsid + "' target='_blank'>" +
            (tsid_forecast_location === true ? "<strong>" + parseFloat(latest6AMValue.value).toFixed(2) + "</strong>" : parseFloat(latest6AMValue.value).toFixed(2)) + "</a>" +
            "</div>";

            // DAY1
            const day1Cell = row.insertCell();
            let day1 = null;
            // Process netmiss interpolation for each gage here
            if (location_id === "LD 24 Pool-Mississippi") {
                // Compare downstream gage to determine "Open River" or Not
                if (convertedData !== null && convertedNetmissDownstreamData !== null) {
                    // Calculate downstream value to determine for "Open River"
                    let downstreamValueToCompare = parseFloat(data6.elevation) + 0.5 + convertedNetmissDownstreamData.values[0][1];
                    // console.log("downstreamValueToCompare: ", downstreamValueToCompare);

                    // Get today netmiss forecast to compare and determine for "Open River"
                    let todayNetmissForecast = convertedData.values[0][1];
                    // console.log("todayNetmissForecast: ", todayNetmissForecast);

                    // Determine if today is "Open River"
                    if (downstreamValueToCompare > todayNetmissForecast) {
                        day1 = "<div title='" + "(" + parseFloat(data6.elevation).toFixed(2) + " + 0.5 + " + (convertedNetmissDownstreamData.values[0][1]).toFixed(2) + ") (" + downstreamValueToCompare.toFixed(2) + " >= " + todayNetmissForecast.toFixed(2) + ") = Open River" + "'>" + (tsid_forecast_location === true ? "<strong>" + "Open River" : "-Error-") + "</div>";
                    } else {
                        day1 = "<div title='" + convertedData.values[0] + "'>" + (tsid_forecast_location === true ? "<strong>" + (convertedData.values[0][1]).toFixed(1) : (convertedData.values[0][1]).toFixed(1)) + "</div>";
                    }
                } else {
                    day1 = "<div>" + "--" + "</div>";
                }
            } else if (location_id === "LD 25 Pool-Mississippi") {
                // Compare downstream gage to determine "Open River" or Not
                if (convertedData !== null && convertedNetmissDownstreamData !== null) {
                    // Calculate downstream value to determine for "Open River"
                    let downstreamValueToCompare = parseFloat(data6.elevation) + 1.0 + convertedNetmissDownstreamData.values[0][1];
                    // console.log("downstreamValueToCompare: ", downstreamValueToCompare);

                    // Get today netmiss forecast to compare and determine for "Open River"
                    let todayNetmissForecast = convertedData.values[0][1];
                    // console.log("todayNetmissForecast: ", todayNetmissForecast);

                    // Determine if today is "Open River"
                    if (downstreamValueToCompare > todayNetmissForecast) {
                        day1 = "<div title='" + "(" + parseFloat(data6.elevation).toFixed(2) + " + 1.0 + " + (convertedNetmissDownstreamData.values[0][1]).toFixed(2) + ") (" + downstreamValueToCompare.toFixed(2) + " >= " + todayNetmissForecast.toFixed(2) + ") = Open River" + "'>" + (tsid_forecast_location === true ? "<strong>" + "Open River" : "-Error-") + "</div>";
                    } else {
                        day1 = "<div title='" + convertedData.values[0] + "'>" + (tsid_forecast_location === true ? "<strong>" + (convertedData.values[0][1]).toFixed(1) : (convertedData.values[0][1]).toFixed(1)) + "</div>";
                    }
                } else {
                    day1 = "<div>" + "--" + "</div>";
                }
            } else if (location_id === "LD 27 Pool-Mississippi") {
                // Process data7 - stage rev 6am level
                const result7 = getLatest6AMValue(data7);
                const latest6AMValueUpstream = result7.latest6AMValue;
                const tsid7 = result7.tsid;
                // console.log("latest6AMValue: ", latest6AMValue);

                let total = null;
                // console.log("latest6AMValue.value = ", latest6AMValue.value);
                // console.log("convertedNetmissUpstreamData.values[0][1] = ", convertedNetmissUpstreamData.values[0][1]);
                // console.log("latest6AMValueUpstream.value = ", latest6AMValueUpstream.value);
                
                total = parseFloat(latest6AMValue.value) + parseFloat(convertedNetmissUpstreamData.values[0][1]) - parseFloat(latest6AMValueUpstream.value);
                day1 = "<div title='" + (latest6AMValue.value).toFixed(2) + " + " + (convertedNetmissUpstreamData.values[0][1]).toFixed(2) + " - " + (latest6AMValueUpstream.value).toFixed(2) + " = " + total.toFixed(2) + "'>" + (tsid_forecast_location === true ? "<strong>" + total.toFixed(1) : total.toFixed(1)) + "</div>";
            } else if (location_id === "LD 27 TW-Mississippi") {
                // Process data9 - stage rev 6am level
                const result9 = getLatest6AMValue(data9);
                const latest6AMValueDownstream = result9.latest6AMValue;
                const tsid9 = result9.tsid;

                let total = null;
                // console.log("latest6AMValue.value = ", latest6AMValue.value);
                // console.log("convertedNetmissDownstreamData.values[0][1] = ", convertedNetmissDownstreamData.values[0][1]);
                // console.log("latest6AMValueDownstream.value = ", latest6AMValueDownstream.value);
                
                total = parseFloat(latest6AMValue.value) + parseFloat(convertedNetmissDownstreamData.values[0][1]) - parseFloat(latest6AMValueDownstream.value);
                day1 = "<div title='" + (latest6AMValue.value).toFixed(2) + " + " + (convertedNetmissDownstreamData.values[0][1]).toFixed(2) + " - " + (latest6AMValueDownstream.value).toFixed(2) + " = " + total.toFixed(2) + "'>" + (tsid_forecast_location === true ? "<strong>" + total.toFixed(1) : total.toFixed(1)) + "</div>";
            } else if (location_id === "Engineers Depot-Mississippi") {
                // const formula = "P27+ ((((Q26-Q27)/Q28)*Q29)+Q30)";
                const formula = "yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream)-(todayDownstreamNetmiss - yesterday6AMValueDownstream))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterday6AMValueDownstream))";
                // Get all variables to do calculation
                const yesterday6AMValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                const yesterday6AMValueUpstream = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterday6AMValueDownstream = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[0][1]);
                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;

                // console.log("yesterday6AMValue = ", yesterday6AMValue);
                // console.log("yesterday6AMValueUpstream = ", yesterday6AMValueUpstream);
                // console.log("yesterday6AMValueDownstream = ", yesterday6AMValueDownstream);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                // console.log("Q26 = ", (todayUpstreamNetmiss - yesterday6AMValueUpstream));
                // console.log("Q27 = ", (todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("Q28 = ", (riverMileUpstream - riverMileDownstream));
                // console.log("Q29 = ", (riverMile - riverMileDownstream));
                // console.log("Q30 = ", (todayDownstreamNetmiss - yesterday6AMValueDownstream));

                let total = null;
                total = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream)-(todayDownstreamNetmiss - yesterday6AMValueDownstream))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("total = ", total);

                day1 = "<div title='" + formula + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Herculaneum-Mississippi") {
                // const formula = "P27+ ((((Q26-Q27)/Q28)*Q29)+Q30)";
                const formula = "yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream)-(todayDownstreamNetmiss - yesterday6AMValueDownstream))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterday6AMValueDownstream))";
                // Get all variables to do calculation
                const yesterday6AMValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                const yesterday6AMValueUpstream = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterday6AMValueDownstream = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[0][1]);
                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;

                // console.log("yesterday6AMValue = ", yesterday6AMValue);
                // console.log("yesterday6AMValueUpstream = ", yesterday6AMValueUpstream);
                // console.log("yesterday6AMValueDownstream = ", yesterday6AMValueDownstream);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                // console.log("Q26 = ", (todayUpstreamNetmiss - yesterday6AMValueUpstream));
                // console.log("Q27 = ", (todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("Q28 = ", (riverMileUpstream - riverMileDownstream));
                // console.log("Q29 = ", (riverMile - riverMileDownstream));
                // console.log("Q30 = ", (todayDownstreamNetmiss - yesterday6AMValueDownstream));

                let total = null;
                total = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream)-(todayDownstreamNetmiss - yesterday6AMValueDownstream))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("total = ", total);

                day1 = "<div title='" + formula + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Nav TW-Kaskaskia") {
                // const formula = "P27+ ((((Q26-Q27)/Q28)*Q29)+Q30)";
                const formula = "yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream)-(todayDownstreamNetmiss - yesterday6AMValueDownstream))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterday6AMValueDownstream))";
                // Get all variables to do calculation
                const yesterday6AMValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                const yesterday6AMValueUpstream = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterday6AMValueDownstream = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[0][1]);
                // const riverMile = river_mile_hard_coded;
                const riverMile = 117.5;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;

                // console.log("yesterday6AMValue = ", yesterday6AMValue);
                // console.log("yesterday6AMValueUpstream = ", yesterday6AMValueUpstream);
                // console.log("yesterday6AMValueDownstream = ", yesterday6AMValueDownstream);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                // console.log("Q26 = ", (todayUpstreamNetmiss - yesterday6AMValueUpstream));
                // console.log("Q27 = ", (todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("Q28 = ", (riverMileUpstream - riverMileDownstream));
                // console.log("Q29 = ", (riverMile - riverMileDownstream));
                // console.log("Q30 = ", (todayDownstreamNetmiss - yesterday6AMValueDownstream));

                let total = null;
                total = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream)-(todayDownstreamNetmiss - yesterday6AMValueDownstream))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("total = ", total);

                day1 = "<div title='" + formula + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Red Rock Ldg-Mississippi") {
                // const formula = "P27+ ((((Q26-Q27)/Q28)*Q29)+Q30)";
                const formula = "yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream)-(todayDownstreamNetmiss - yesterday6AMValueDownstream))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterday6AMValueDownstream))";
                // Get all variables to do calculation
                const yesterday6AMValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                const yesterday6AMValueUpstream = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterday6AMValueDownstream = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[0][1]);
                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;

                // console.log("yesterday6AMValue = ", yesterday6AMValue);
                // console.log("yesterday6AMValueUpstream = ", yesterday6AMValueUpstream);
                // console.log("yesterday6AMValueDownstream = ", yesterday6AMValueDownstream);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                // console.log("Q26 = ", (todayUpstreamNetmiss - yesterday6AMValueUpstream));
                // console.log("Q27 = ", (todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("Q28 = ", (riverMileUpstream - riverMileDownstream));
                // console.log("Q29 = ", (riverMile - riverMileDownstream));
                // console.log("Q30 = ", (todayDownstreamNetmiss - yesterday6AMValueDownstream));

                let total = null;
                total = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream)-(todayDownstreamNetmiss - yesterday6AMValueDownstream))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("total = ", total);

                day1 = "<div title='" + formula + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Grand Tower-Mississippi") {
                // const formula = "P27+ ((((Q26-Q27)/Q28)*Q29)+Q30)";
                const formula = "yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream)-(todayDownstreamNetmiss - yesterday6AMValueDownstream))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterday6AMValueDownstream))";
                // Get all variables to do calculation
                const yesterday6AMValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                const yesterday6AMValueUpstream = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterday6AMValueDownstream = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[0][1]);
                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;

                // console.log("yesterday6AMValue = ", yesterday6AMValue);
                // console.log("yesterday6AMValueUpstream = ", yesterday6AMValueUpstream);
                // console.log("yesterday6AMValueDownstream = ", yesterday6AMValueDownstream);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                // console.log("Q26 = ", (todayUpstreamNetmiss - yesterday6AMValueUpstream));
                // console.log("Q27 = ", (todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("Q28 = ", (riverMileUpstream - riverMileDownstream));
                // console.log("Q29 = ", (riverMile - riverMileDownstream));
                // console.log("Q30 = ", (todayDownstreamNetmiss - yesterday6AMValueDownstream));

                let total = null;
                total = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream)-(todayDownstreamNetmiss - yesterday6AMValueDownstream))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("total = ", total);

                day1 = "<div title='" + formula + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Moccasin Springs-Mississippi") {
                // const formula = "P27+ ((((Q26-Q27)/Q28)*Q29)+Q30)";
                const formula = "yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream)-(todayDownstreamNetmiss - yesterday6AMValueDownstream))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterday6AMValueDownstream))";
                // Get all variables to do calculation
                const yesterday6AMValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                const yesterday6AMValueUpstream = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterday6AMValueDownstream = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[0][1]);
                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;

                // console.log("yesterday6AMValue = ", yesterday6AMValue);
                // console.log("yesterday6AMValueUpstream = ", yesterday6AMValueUpstream);
                // console.log("yesterday6AMValueDownstream = ", yesterday6AMValueDownstream);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                // console.log("Q26 = ", (todayUpstreamNetmiss - yesterday6AMValueUpstream));
                // console.log("Q27 = ", (todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("Q28 = ", (riverMileUpstream - riverMileDownstream));
                // console.log("Q29 = ", (riverMile - riverMileDownstream));
                // console.log("Q30 = ", (todayDownstreamNetmiss - yesterday6AMValueDownstream));

                let total = null;
                total = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream)-(todayDownstreamNetmiss - yesterday6AMValueDownstream))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("total = ", total);

                day1 = "<div title='" + formula + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Grays Pt-Mississippi") {
                const formula = "yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream)-(todayDownstreamNetmiss - yesterday6AMValueDownstream))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterday6AMValueDownstream))";
                const yesterday6AMValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                const yesterday6AMValueUpstream = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterday6AMValueDownstream = ((getLatest6AMValue(data9)).latest6AMValue).value;
  
                // console.log("yesterday6AMValue = ", yesterday6AMValue);
                // console.log("yesterday6AMValueUpstream = ", yesterday6AMValueUpstream);
                // console.log("yesterday6AMValueDownstream = ", yesterday6AMValueDownstream);
                // console.log("BirdsPointForecastValue @ Grays Pt-Mississippi = ", location_id, BirdsPointForecastValue);
                // console.log("ForecastValues.birdsPointForecast[location_id] @ Grays Pt-Mississippi = ", ForecastValues.birdsPointForecast[location_id]);
                // console.log("BirdsPointForecastValue2 @ Grays Pt-Mississippi = ", location_id, BirdsPointForecastValue2);

                day1 = "<div>" + "-test" + "</div>";
            } else if (location_id === "LD 22 TW-Mississippi") {
                // Process data14 - netmiss flow data
                const yesterday6AMStageRevValue = latest6AMValue.value;
                const convertedNetmissFlowValuesToCst = convertUTCtoCentralTime(data15);
                const yesterday6AMNetmissFlowValue = (convertedNetmissFlowValuesToCst.values[0][1]).toFixed(1);
                const today6AMNetmissFlowValue = (convertedNetmissFlowValuesToCst.values[1][1]).toFixed(1);
                // Process data16- get rating table coe
                const ratingTableCoe = data16["simple-rating"][0]["rating-points"].point;
                const todayCorresponding6AMStageValue = findIndByDep(today6AMNetmissFlowValue, ratingTableCoe);
                const yesterdayCorresponding6AMStageValue = findIndByDep(yesterday6AMNetmissFlowValue, ratingTableCoe);

                const totalFormula = "yesterday6AMStageRevValue - yesterdayCorresponding6AMStageValue + todayCorresponding6AMStageValue";
                const total = yesterday6AMStageRevValue - yesterdayCorresponding6AMStageValue + todayCorresponding6AMStageValue;

                console.log("location_id = ", location_id);
                console.log("yesterday6AMStageRevValue = ", yesterday6AMStageRevValue);
                console.log("convertedNetmissFlowValuesToCst @ LD 22 TW-Mississippi = ", convertedNetmissFlowValuesToCst);
                console.log("yesterday6AMNetmissFlowValue = ", yesterday6AMNetmissFlowValue);
                console.log("today6AMNetmissFlowValue = ", today6AMNetmissFlowValue);
                console.log("ratingTableCoe = ", ratingTableCoe);
                console.log("todayCorresponding6AMStageValue:", todayCorresponding6AMStageValue);
                console.log("yesterdayCorresponding6AMStageValue:", yesterdayCorresponding6AMStageValue);
                console.log("total = ", total);

                
                day1 = "<div title='" + totalFormula + "'>" + total.toFixed(1) + "</div>";
            } else {
                if (convertedData !== null) {
                    day1 = "<div title='" + convertedData.values[0] + "'>" + 
                        (tsid_forecast_location === true ? "<strong>" + (convertedData.values[0][1]).toFixed(2) + "</strong>" : (convertedData.values[0][1]).toFixed(2)) + 
                        "</div>";
                } else {
                    day1 = "<div>" + "-" + "</div>";
                }
            }
            day1Cell.innerHTML = day1;

            // DAY2
            const day2Cell = row.insertCell();
            let day2 = null;
            if (convertedData !== null) {
                day2 = "<div title='" + convertedData.values[1] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (convertedData.values[1][1]).toFixed(1) + "</strong>" : (convertedData.values[1][1]).toFixed(1)) + 
                    "</div>";
            } else {
                day2 = "<div>" + "-" + "</div>";
            }
            day2Cell.innerHTML = day2;

            // DAY3
            const day3Cell = row.insertCell();
            let day3 = null;
            if (convertedData !== null) {
                day3 = "<div title='" + convertedData.values[2] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (convertedData.values[2][1]).toFixed(1) + "</strong>" : (convertedData.values[2][1]).toFixed(1)) + 
                    "</div>";
            } else {
                day3 = "<div>" + "-" + "</div>";
            }
            day3Cell.innerHTML = day3;

            // DAY4
            const day4Cell = row.insertCell();
            let day4 = null;
            if (convertedData !== null) {
                day4 = "<div title='" + convertedData.values[3] + "'>" + 
                    (tsid_forecast_location === true ? "<strong>" + (convertedData.values[3][1]).toFixed(1) + "</strong>" : (convertedData.values[3][1]).toFixed(1)) + 
                    "</div>";
            } else {
                day4 = "<div>" + "-" + "</div>";
            }
            day4Cell.innerHTML = day4;

            // DAY5
            const day5Cell = row.insertCell();
            let day5 = null;
            if (convertedData && convertedData.values && convertedData.values[4] !== null && convertedData.values[4] !== undefined) {
                day5 = "<div title='" + convertedData.values[4] + "'>" + 
                    (tsid_forecast_location ? "<strong>" + (convertedData.values[4][1]).toFixed(1) + "</strong>" : (convertedData.values[4][1]).toFixed(1)) + 
                    "</div>";
            } else {
                day5 = "<div>" + "-" + "</div>";
            }
            day5Cell.innerHTML = day5;

            // DAY6
            const day6Cell = row.insertCell();
            let day6 = null;
            if (convertedData && convertedData.values && convertedData.values[5] !== null && convertedData.values[5] !== undefined) {
                day6 = "<div title='" + convertedData.values[5] + "'>" + 
                    (tsid_forecast_location ? "<strong>" + (convertedData.values[5][1]).toFixed(1) + "</strong>" : (convertedData.values[5][1]).toFixed(1)) + 
                    "</div>";
            } else {
                day6 = "<div>" + "-" + "</div>";
            }
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

// Function to get current data time
function subtractHoursFromDate(date, hoursToSubtract) {
    return new Date(date.getTime() - (hoursToSubtract * 60 * 60 * 1000));
}

// Function to get current data time
function plusHoursFromDate(date, hoursToSubtract) {
    return new Date(date.getTime() + (hoursToSubtract * 60 * 60 * 1000));
}

// Function to check for duplicate date_time values
function checkForDuplicates(data) {
    const dateTimes = data.map(entry => entry.date_time);
    const uniqueDateTimes = new Set(dateTimes);

    return dateTimes.length === uniqueDateTimes.size;
}

// Function to fetch all urls to find all forecasts
async function fetchAllUrls(url1, url2, url3, url4, url5, url6, url7, url8, url9, url10, url11, url12, url13, url14, url15, url16) {
    const fetchOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json;version=2'
        }
    };

    try {
        const responsePromises = [
            url1 ? fetch(url1, fetchOptions) : Promise.resolve(null),
            url2 ? fetch(url2, fetchOptions) : Promise.resolve(null),
            url3 ? fetch(url3, fetchOptions) : Promise.resolve(null),
            url4 ? fetch(url4, fetchOptions) : Promise.resolve(null),
            url5 ? fetch(url5, fetchOptions) : Promise.resolve(null),
            url6 ? fetch(url6, fetchOptions) : Promise.resolve(null),
            url7 ? fetch(url7, fetchOptions) : Promise.resolve(null),
            url8 ? fetch(url8, fetchOptions) : Promise.resolve(null),
            url9 ? fetch(url9, fetchOptions) : Promise.resolve(null),
            url10 ? fetch(url10, fetchOptions) : Promise.resolve(null),
            url11 ? fetch(url11, fetchOptions) : Promise.resolve(null),
            url12 ? fetch(url12, fetchOptions) : Promise.resolve(null),
            url13 ? fetch(url13, fetchOptions) : Promise.resolve(null),
            url14 ? fetch(url14, fetchOptions) : Promise.resolve(null),
            url15 ? fetch(url15, fetchOptions) : Promise.resolve(null),
            url16 ? fetch(url16, fetchOptions) : Promise.resolve(null)
        ];

        const responses = await Promise.all(responsePromises);

        const data = await Promise.all(responses.map(async (response, index) => {
            if (response && response.ok) {
                return response.json();
            } else if (response) {
                console.log(`Fetch request to url${index + 1} failed with status ${response.status}`);
            }
            return null;
        }));

        return {
            data1: data[0],
            data2: data[1],
            data3: data[2],
            data4: data[3],
            data5: data[4],
            data6: data[5],
            data7: data[6],
            data8: data[7],
            data9: data[8],
            data10: data[9],
            data11: data[10],
            data12: data[11],
            data13: data[12],
            data14: data[13],
            data15: data[14],
            data16: data[15]
        };
    } catch (error) {
        console.error('Error fetching the URLs:', error.message);
        return {
            data1: null,
            data2: null,
            data3: null,
            data4: null,
            data5: null,
            data6: null,
            data7: null,
            data8: null,
            data9: null,
            data10: null,
            data11: null,
            data12: null,
            data13: null,
            data14: null,
            data15: null,
            data16: null
        }; // return null data if any error occurs
    }
}

// Function to get lastest 6am value for stage-rev
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

// Function to get lastest 7am value
function get7AMValueForDate(data, date) {
    // Extract the values array from the data
    const values = data.values;

    // Extract the tsid from the data
    const tsid = data.name;

    // Initialize a variable to store the 7 AM value for the given date
    let valueAt7AM = null;

    // Define the Central Time timezone
    const centralTimeZone = 'America/Chicago';

    // Parse the input date to create a Date object
    const [month, day, year] = date.split('-');
    const targetDate = new Date(`${year}-${month}-${day}T07:00:00`);

    // Convert the target date to Central Time
    const targetCentralDate = new Date(targetDate.toLocaleString('en-US', { timeZone: centralTimeZone }));

    // Iterate through the values array
    for (let i = 0; i < values.length; i++) {
        const [timestamp, value, qualityCode] = values[i];

        // Convert the timestamp to a Date object in UTC
        const date = new Date(timestamp);

        // Convert the UTC date to Central Time
        const centralDate = new Date(date.toLocaleString('en-US', { timeZone: centralTimeZone }));

        // Check if the date and time match the target 7 AM
        if (centralDate.getFullYear() === targetCentralDate.getFullYear() &&
            centralDate.getMonth() === targetCentralDate.getMonth() &&
            centralDate.getDate() === targetCentralDate.getDate() &&
            centralDate.getHours() === 7 && centralDate.getMinutes() === 0 && centralDate.getSeconds() === 0) {
            valueAt7AM = { date: centralDate.toISOString(), value, qualityCode };
            break;
        }
    }

    // Return the 7 AM value found and tsid
    return {
        valueAt7AM,
        tsid
    };
}

// Function to get lastest 7am value for a week
function get7AMValuesForWeek(data, date) {
    // Extract the values array from the data
    const values = data.values;

    // Extract the tsid from the data
    const tsid = data.name;

    // Initialize an array to store the 7 AM values for the given week
    const valuesAt7AM = [];

    // Define the Central Time timezone
    const centralTimeZone = 'America/Chicago';

    // Parse the input date to create a Date object
    const [month, day, year] = date.split('-');
    let targetDate = new Date(`${year}-${month}-${day}T07:00:00`);

    // Iterate through the next 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        // Adjust the target date by the day offset
        const currentDate = new Date(targetDate);
        currentDate.setDate(targetDate.getDate() + dayOffset);

        // Convert the target date to Central Time
        const targetCentralDate = new Date(currentDate.toLocaleString('en-US', { timeZone: centralTimeZone }));

        // Initialize a variable to store the 7 AM value for the current date
        let valueAt7AM = null;

        // Iterate through the values array to find the 7 AM value for the current date
        for (let i = 0; i < values.length; i++) {
            const [timestamp, value, qualityCode] = values[i];

            // Convert the timestamp to a Date object in UTC
            const date = new Date(timestamp);

            // Convert the UTC date to Central Time
            const centralDate = new Date(date.toLocaleString('en-US', { timeZone: centralTimeZone }));

            // Check if the date and time match the target 7 AM
            if (centralDate.getFullYear() === targetCentralDate.getFullYear() &&
                centralDate.getMonth() === targetCentralDate.getMonth() &&
                centralDate.getDate() === targetCentralDate.getDate() &&
                centralDate.getHours() === 7 && centralDate.getMinutes() === 0 && centralDate.getSeconds() === 0) {
                valueAt7AM = { date: centralDate.toISOString(), value, qualityCode };
                break;
            }
        }

        // Store the 7 AM value for the current date
        valuesAt7AM.push(valueAt7AM);
    }

    // Return the 7 AM values found and tsid
    return {
        valuesAt7AM,
        tsid
    };
}

// Function to check for values length
function checkValuesArrayLength(data) {
    // Check if data is null or undefined
    if (!data) {
        // console.log('Data is null or undefined.');
        return false;
    }

    // Check if data.values is null or undefined
    if (!data.values) {
        // console.log('Data.values is null or undefined.');
        return false;
    }

    const valuesArray = data.values;
    const expectedLength = 7;

    if (valuesArray.length === expectedLength) {
        // console.log(`The values array contains exactly ${expectedLength} items.`);
        return true;
    } else {
        // console.log(`The values array does not contain ${expectedLength} items. It contains ${valuesArray.length} items.`);
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

// Function to find rating, stage based on flow
function findIndByDep(depValue, table) {
    // Convert depValue to number if it's not already
    depValue = Number(depValue);

    // Convert table entries to numbers
    const numericTable = table.map(entry => ({
        ind: Number(entry.ind),
        dep: Number(entry.dep)
    }));

    // Find the closest entries in the table
    let lowerEntry = null;
    let upperEntry = null;

    for (let i = 0; i < numericTable.length; i++) {
        if (numericTable[i].dep <= depValue) {
            lowerEntry = numericTable[i];
        }
        if (numericTable[i].dep >= depValue && upperEntry === null) {
            upperEntry = numericTable[i];
        }
    }

    // If depValue is out of bounds
    if (!lowerEntry || !upperEntry) {
        return null;
    }

    // Handle exact match case
    if (lowerEntry.dep === depValue) {
        return lowerEntry.ind;
    }

    // Perform linear interpolation
    const depDiff = upperEntry.dep - lowerEntry.dep;
    
    // Check for division by zero scenario
    if (depDiff === 0) {
        return null; // or handle as needed
    }
    
    const indDiff = upperEntry.ind - lowerEntry.ind;
    const ratio = (depValue - lowerEntry.dep) / depDiff;
    const interpolatedInd = lowerEntry.ind + indDiff * ratio;

    return interpolatedInd;
}