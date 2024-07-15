let ForecastValues = {
};

const loadingIndicator = document.getElementById('loading_forecast');
const tableContainer = document.getElementById('table_container_forecast');

document.addEventListener('DOMContentLoaded', function () {
    // Display the loading_alarm_mvs indicator
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

async function populateTableCells(jsonDataFiltered, table, nws_day1_date) {
    loadingIndicator.style.display = 'block';
    let promises = [];
    jsonDataFiltered.forEach(location => {
        // Create a new row for each data object
        const row = table.insertRow();
        // console.log("Calling fetchData");

        // setup date time before calling function
        const currentDateTime = new Date();
        const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);
        const currentDateMinus30Hours = subtractHoursFromDate(currentDateTime, 30);

        promises.push(fetchData(
            location.location_id
            , location.tsid_netmiss
            , location.tsid_netmiss_observe
            , row
            , currentDateTime
            , currentDateTimePlus7Days
            , currentDateMinus30Hours
            , location.level_id_flood
            , location.level_id_effective_date_flood
            , location.level_id_unit_id_flood
            , location.tsid_forecast_location
            , location.tsid_netmiss_upstream
            , location.tsid_netmiss_downstream
            , location.tsid_netmiss_downstream_flood
            , location.tsid_netmiss_upstream_stage_rev
            , location.tsid_netmiss_downstream_stage_rev
            , location.tsid_rvf_ff
            , nws_day1_date
            , location.tsid_netmiss_forecasting_location_upstream
            , location.tsid_netmiss_forecasting_location_downstream
            , location.river_mile_hard_coded
            , location.netmiss_river_mile_hard_coded_upstream
            , location.netmiss_river_mile_hard_coded_downstream
            , location.tsid_rvf_ff_downstream
            , location.tsid_rvf_ff_dependance
            , location.tsid_netmiss_flow
            , location.tsid_rating_id_coe
            , location.tsid_rating_id_coe_upstream
            , location.tsid_netmiss_special_gage_1
        ))
    });
    Promise.all(promises).then((d) => {
        console.log("got all my data!", d)
        // do all drawing my combined data
        processAllData(d);
    })
    loadingIndicator.style.display = 'none';
}

function processAllData(data) {
    data.forEach(({
        row,
        location_id,
        convertedData,
        convertedNetmissUpstreamData,
        latest6AMValue,
        tsid,
        convertedNetmissDownstreamData,
        convertedNetmissForecastingPointUpstreamData,
        convertedNetmissForecastingPointDownstreamData,
        tsid_forecast_location,
        river_mile_hard_coded,
        netmiss_river_mile_hard_coded_upstream,
        netmiss_river_mile_hard_coded_downstream,
        isNetmissForecastArrayLengthGreaterThanSeven,
        isRvfArrayLengthGreaterThanSeven,
        isRvfDependanceArrayLengthGreaterThanSeven,
        BirdsPointForecastValue,
        latest7AMRvfValue,
        data1,
        data2,
        data3,
        data4,
        data5,
        data6,
        data7,
        data8,
        data9,
        data10,
        data11,
        data12,
        data13,
        data14,
        data15,
        data16,
        data17,
        data18
    }) => {
        // Ensure row exists and is a valid DOM element
        if (!row || !(row instanceof HTMLElement)) {
            console.error('Invalid row:', row);
            return;
        }

        // console.log("data: ", data);

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
                total = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream) - (todayDownstreamNetmiss - yesterday6AMValueDownstream)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterday6AMValueDownstream));
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
                total = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream) - (todayDownstreamNetmiss - yesterday6AMValueDownstream)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterday6AMValueDownstream));
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
                total = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream) - (todayDownstreamNetmiss - yesterday6AMValueDownstream)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterday6AMValueDownstream));
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
                total = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream) - (todayDownstreamNetmiss - yesterday6AMValueDownstream)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterday6AMValueDownstream));
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
                total = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream) - (todayDownstreamNetmiss - yesterday6AMValueDownstream)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterday6AMValueDownstream));
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
                total = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream) - (todayDownstreamNetmiss - yesterday6AMValueDownstream)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("total = ", total);

                day1 = "<div title='" + formula + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Grays Pt-Mississippi") {
                const formula = "yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue)-(todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue))";
                const yesterday6AMStageRevValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                const yesterdayUpstream6AMStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterdayDownstream6AMStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][0].value;
                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;

                // console.log("location_id = ", location_id);
                // console.log("yesterday6AMStageRevValue = ", yesterday6AMStageRevValue);
                // console.log("yesterdayUpstream6AMStageRevValue = ", yesterdayUpstream6AMStageRevValue);
                // console.log("yesterdayDownstream6AMStageRevValue = ", yesterdayDownstream6AMStageRevValue);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                let total = null;
                total = yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue) - (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue));
                // console.log("total = ", total);

                day1 = "<div title='" + formula + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Thebes-Mississippi") {
                const formula = "yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue)-(todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue))";
                const yesterday6AMStageRevValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                const yesterdayUpstream6AMStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterdayDownstream6AMStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][0].value;
                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;

                // console.log("yesterday6AMStageRevValue = ", yesterday6AMStageRevValue);
                // console.log("yesterdayUpstream6AMStageRevValue = ", yesterdayUpstream6AMStageRevValue);
                // console.log("yesterdayDownstream6AMStageRevValue = ", yesterdayDownstream6AMStageRevValue);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                let total = null;
                total = yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue) - (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue));
                // console.log("total = ", total);

                day1 = "<div title='" + formula + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Price Ldg-Mississippi") {
                const formula = "yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue)-(todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue))";
                const yesterday6AMStageRevValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                const yesterdayUpstream6AMStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterdayDownstream6AMStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][0].value;
                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;

                // console.log("yesterday6AMStageRevValue = ", yesterday6AMStageRevValue);
                // console.log("yesterdayUpstream6AMStageRevValue = ", yesterdayUpstream6AMStageRevValue);
                // console.log("yesterdayDownstream6AMStageRevValue = ", yesterdayDownstream6AMStageRevValue);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                let total = null;
                total = yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue) - (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue));
                // console.log("total = ", total);

                day1 = "<div title='" + formula + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Thompson Ldg-Mississippi") {
                const formula = "yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue)-(todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue))";
                const yesterday6AMStageRevValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                const yesterdayUpstream6AMStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterdayDownstream6AMStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][0].value;
                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;

                // console.log("yesterday6AMStageRevValue = ", yesterday6AMStageRevValue);
                // console.log("yesterdayUpstream6AMStageRevValue = ", yesterdayUpstream6AMStageRevValue);
                // console.log("yesterdayDownstream6AMStageRevValue = ", yesterdayDownstream6AMStageRevValue);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                let total = null;
                total = yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue) - (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue));
                // console.log("total = ", total);

                day1 = "<div title='" + formula + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Commerce-Mississippi") {
                const formula = "yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue)-(todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue))/(riverMileUpstream - riverMileDownstream))*(riverMile - riverMileDownstream))+(todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue))";
                const yesterday6AMStageRevValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                const yesterdayUpstream6AMStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterdayDownstream6AMStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][0].value;
                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;

                // console.log("yesterday6AMStageRevValue = ", yesterday6AMStageRevValue);
                // console.log("yesterdayUpstream6AMStageRevValue = ", yesterdayUpstream6AMStageRevValue);
                // console.log("yesterdayDownstream6AMStageRevValue = ", yesterdayDownstream6AMStageRevValue);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                let total = null;
                total = yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue) - (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue));
                // console.log("total = ", total);

                day1 = "<div title='" + formula + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "LD 22 TW-Mississippi") {
                // Process data14 - netmiss flow data
                const yesterday6AMStageRevValue = latest6AMValue.value;
                const convertedNetmissFlowValuesToCst = convertUTCtoCentralTime(data15);
                const yesterday6AMNetmissFlowValue = (convertedNetmissFlowValuesToCst.values[0][1]).toFixed(1);
                const today6AMNetmissFlowValue = (convertedNetmissFlowValuesToCst.values[1][1]).toFixed(1);
                // Process data16 - get rating table coe
                const ratingTableCoe = data16["simple-rating"][0]["rating-points"].point;
                const todayCorresponding6AMStageValue = findIndByDep(today6AMNetmissFlowValue, ratingTableCoe);
                const yesterdayCorresponding6AMStageValue = findIndByDep(yesterday6AMNetmissFlowValue, ratingTableCoe);

                const totalFormula = "yesterday6AMStageRevValue - yesterdayCorresponding6AMStageValue + todayCorresponding6AMStageValue";
                const total = yesterday6AMStageRevValue - yesterdayCorresponding6AMStageValue + todayCorresponding6AMStageValue;

                // console.log("location_id = ", location_id);
                // console.log("yesterday6AMStageRevValue = ", yesterday6AMStageRevValue);
                // console.log("convertedNetmissFlowValuesToCst @ LD 22 TW-Mississippi = ", convertedNetmissFlowValuesToCst);
                // console.log("yesterday6AMNetmissFlowValue = ", yesterday6AMNetmissFlowValue);
                // console.log("today6AMNetmissFlowValue = ", today6AMNetmissFlowValue);
                // console.log("ratingTableCoe = ", ratingTableCoe);
                // console.log("todayCorresponding6AMStageValue:", todayCorresponding6AMStageValue);
                // console.log("yesterdayCorresponding6AMStageValue:", yesterdayCorresponding6AMStageValue);
                // console.log("total = ", total);

                day1 = "<div title='" + totalFormula + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Mosier Ldg-Mississippi") {
                // Process and get today and yesterday values
                const yesterdayUpstream6AMStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterday6AMStageRevValue = latest6AMValue.value;
                const yesterdayDownstream6AMStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmissValue = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);

                // Process and get rating tables
                const ratingTableCoe = data16["simple-rating"][0]["rating-points"].point;
                const ratingTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point;

                // Process and get today corresponding flow values
                const todayCorrespondingUpstreamFlowValue = findDepByInd(todayUpstreamNetmissValue, ratingTableCoeUpstream);

                // Determine if today upstream is open river or regulated pool
                const isTodayOpenRiver = todayCorrespondingUpstreamFlowValue > 140.0;
                const isTodayRegulatedPool = todayCorrespondingUpstreamFlowValue <= 140.0;

                const yesterday6AMStageRevUpstreamValuePlusOneOverOneThousand = ((getLatest6AMValue(data7)).latest6AMValue).value + 0.001;

                // Process and get yesterday corresponding stage values
                const yesterdayCorrespondingUpstreamFlowValue = findDepByInd(yesterday6AMStageRevUpstreamValuePlusOneOverOneThousand, ratingTableCoeUpstream);

                // Determine if yesterday upstream is open river or regulated pool
                const isYesterdayOpenRiver = yesterdayCorrespondingUpstreamFlowValue > 150.0;
                const isYesterdayRegulatedPool = yesterdayCorrespondingUpstreamFlowValue <= 150.0;

                // Lookup yesterdayCorrespondingUpstreamFlowValue to Mosier Ldg-Mississippi Rating COE Table 
                const yesterdayCorrespondingUpstreamFlowValueToStageRev = findIndByDep(yesterdayCorrespondingUpstreamFlowValue, ratingTableCoe);

                // Calculate Open River forecast adjustment
                const OpenRiverForecastAdjustment = yesterdayCorrespondingUpstreamFlowValueToStageRev - latest6AMValue.value;

                // Lookup todayCorrespondingUpstreamFlowValue to Mosier Ldg-Mississippi Rating COE Table 
                const todayCorrespondingUpstreamFlowValueToStageRev = findIndByDep(todayCorrespondingUpstreamFlowValue, ratingTableCoe);

                // Open River or Regulated Pool Calculations
                let total = null;
                if (isTodayOpenRiver) {
                    total = todayCorrespondingUpstreamFlowValueToStageRev + OpenRiverForecastAdjustment;
                } else if (isTodayRegulatedPool) {
                    total = "RP";
                } else {
                    total = "--";
                }
                
                // console.log("location_id = ", location_id);
                // console.log("yesterdayUpstream6AMStageRevValue = ", yesterdayUpstream6AMStageRevValue);
                // console.log("yesterday6AMStageRevValue = ", yesterday6AMStageRevValue);
                // console.log("yesterdayDownstream6AMStageRevValue = ", yesterdayDownstream6AMStageRevValue);
                // console.log("todayUpstreamNetmissValue = ", todayUpstreamNetmissValue);
                // console.log("ratingTableCoe = ", ratingTableCoe);
                // console.log("ratingTableCoeUpstream = ", ratingTableCoeUpstream);
                // console.log("todayCorrespondingUpstreamFlowValue:", todayCorrespondingUpstreamFlowValue);
                // console.log("isTodayOpenRiver:", isTodayOpenRiver);
                // console.log("isTodayRegulatedPool:", isTodayRegulatedPool);
                // console.log("yesterday6AMStageRevUpstreamValuePlusOneOverOneThousand:", yesterday6AMStageRevUpstreamValuePlusOneOverOneThousand);
                // console.log("yesterdayCorrespondingUpstreamFlowValue:", yesterdayCorrespondingUpstreamFlowValue);
                // console.log("isYesterdayOpenRiver:", isYesterdayOpenRiver);
                // console.log("isYesterdayRegulatedPool:", isYesterdayRegulatedPool);
                // console.log("yesterdayCorrespondingUpstreamFlowValueToStageRev:", yesterdayCorrespondingUpstreamFlowValueToStageRev);
                // console.log("OpenRiverForecastAdjustment:", OpenRiverForecastAdjustment);
                // console.log("todayCorrespondingUpstreamFlowValueToStageRev:", todayCorrespondingUpstreamFlowValueToStageRev);
                // console.log("total:", total);

                day1 = "<div title='" + "--" + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Louisiana-Mississippi") {
                const convertedNetmissFlowValuesToCst = convertUTCtoCentralTime(data15);
                const yesterday6AMNetmissFlowValue = (convertedNetmissFlowValuesToCst.values[0][1]).toFixed(1);
                const today6AMNetmissFlowValue = (convertedNetmissFlowValuesToCst.values[1][1]).toFixed(1);
                const yesterdayUpstream6AMStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;

                const convertedSpecialNetmissFlowValuesToCst = convertUTCtoCentralTime(data18);
                const yesterdaySpecial6AMNetmissFlowValue = (convertedSpecialNetmissFlowValuesToCst.values[0][1]).toFixed(1);
                const todaySpecial6AMNetmissFlowValue = (convertedSpecialNetmissFlowValuesToCst.values[1][1]).toFixed(1);

                const sumTodayNetmissFlowPlusSpecialNetmissFlowValue = (parseFloat(today6AMNetmissFlowValue) + parseFloat(todaySpecial6AMNetmissFlowValue));
                const sumTodayNetmissFlowPlusSpecialNetmissFlowValueDividedOneThousand = (parseFloat(today6AMNetmissFlowValue) + parseFloat(todaySpecial6AMNetmissFlowValue))/1000;

                // Determine if yesterday upstream is open river or regulated pool
                const isTodayOpenRiver = sumTodayNetmissFlowPlusSpecialNetmissFlowValueDividedOneThousand > 150.0;
                const isTodayRegulatedPool = sumTodayNetmissFlowPlusSpecialNetmissFlowValueDividedOneThousand <= 150.0;

                // Get rating tables
                const ratingTableCoe = data16["simple-rating"][0]["rating-points"].point;
                const ratingTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point;

                // Process and get today corresponding flow values
                const todayCorrespondingYesterdayUpstreamFlowValue = findDepByInd(yesterdayUpstream6AMStageRevValue, ratingTableCoeUpstream);

                const sumYesterdayNetmissFlowPlusSpecialNetmissFlowValueDividedOneThousand = (parseFloat(yesterday6AMNetmissFlowValue) + parseFloat(yesterdaySpecial6AMNetmissFlowValue))/1000;

                // Determine if yesterday upstream is open river or regulated pool
                const isYesterdayOpenRiver = sumYesterdayNetmissFlowPlusSpecialNetmissFlowValueDividedOneThousand > 150.0;
                const isYesterdayRegulatedPool = sumYesterdayNetmissFlowPlusSpecialNetmissFlowValueDividedOneThousand <= 150.0;

                // Lookup todayCorrespondingUpstreamFlowValue to Louisiana-Mississippi Rating COE Table 
                const todayCorrespondingNetmissWithSpecialNetmissFlowValue = findIndByDep(sumTodayNetmissFlowPlusSpecialNetmissFlowValue, ratingTableCoe);

                // console.log("convertedNetmissFlowValuesToCst = ", convertedNetmissFlowValuesToCst);
                console.log("yesterday6AMNetmissFlowValue = ", yesterday6AMNetmissFlowValue);
                console.log("today6AMNetmissFlowValue = ", today6AMNetmissFlowValue);
                console.log("yesterdayUpstream6AMStageRevValue = ", yesterdayUpstream6AMStageRevValue);
                console.log("convertedSpecialNetmissFlowValuesToCst = ", convertedSpecialNetmissFlowValuesToCst);
                console.log("yesterdaySpecial6AMNetmissFlowValue = ", yesterdaySpecial6AMNetmissFlowValue);
                console.log("todaySpecial6AMNetmissFlowValue = ", todaySpecial6AMNetmissFlowValue);
                console.log("sumTodayNetmissFlowPlusSpecialNetmissFlowValueDividedOneThousand = ", sumTodayNetmissFlowPlusSpecialNetmissFlowValueDividedOneThousand);
                console.log("isTodayOpenRiver = ", isTodayOpenRiver);
                console.log("isTodayRegulatedPool = ", isTodayRegulatedPool);
                console.log("ratingTableCoeUpstream = ", ratingTableCoeUpstream);
                console.log("todayCorrespondingYesterdayUpstreamFlowValue = ", todayCorrespondingYesterdayUpstreamFlowValue);
                console.log("sumYesterdayNetmissFlowPlusSpecialNetmissFlowValueDividedOneThousand = ", sumYesterdayNetmissFlowPlusSpecialNetmissFlowValueDividedOneThousand);
                console.log("isYesterdayOpenRiver = ", isYesterdayOpenRiver);
                console.log("isYesterdayRegulatedPool = ", isYesterdayRegulatedPool);
                console.log("todayCorrespondingNetmissWithSpecialNetmissFlowValue = ", todayCorrespondingNetmissWithSpecialNetmissFlowValue);

                // Open River or Regulated Pool Calculations
                let total = null;
                if (isTodayOpenRiver) {
                    total = todayCorrespondingNetmissWithSpecialNetmissFlowValue;
                } else if (isTodayRegulatedPool) {
                    total = "RP";
                } else {
                    total = "--";
                }

                day1 = "<div title='" + "--" + "'>" + total.toFixed(1) + "</div>";
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
    });
}