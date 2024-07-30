// Store Birds Point Forcasts
let ForecastValues = {
};

// Store Grafton Forcasts
let GraftonForecast = {
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
    console.log('todaysDataOnly: ', todaysDataOnly);

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
            console.log("dateObjectFirstForecastDayByDayAndMonth: ", dateObjectFirstForecastDayByDayAndMonth);
            console.log("dateObjectFirstForecastDayByDayAndMonth.date: ", dateObjectFirstForecastDayByDayAndMonth.date);
            console.log("dateObjectFirstForecastDayByDayAndMonth.length: ", dateObjectFirstForecastDayByDayAndMonth.length);

            // Testing - Forced to output a table
            // populateTableCells(jsonDataFiltered, table, nws_day1_date);

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
                    message.innerHTML = 'Error (Out of limit) or its just Thursdays (the day after long range forecast)';
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
            , location.tsid_rating_id_coe_downstream
            , location.tsid_netmiss_special_gage_2
            , location.tsid_rating_id_special_1
            , location.tsid_netmiss_downstream_stage_rev_2
        ))
    });
    Promise.all(promises).then((d) => {
        console.log("got all my data!", d)
        // do all drawing my combined data
        processAllData(d);
    })
    loadingIndicator.style.display = 'none';
}

async function processAllData(data) {
    data.forEach(async ({
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
        isCairoRvfForecastValuesGreaterThanSeven,
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
        data18,
        data19,
        data20,
        data21,
        data22,
        totalGraftonForecastDay1
    }) => {
        // Ensure row exists and is a valid DOM element
        if (!row || !(row instanceof HTMLElement)) {
            console.error('Invalid row:', row);
            return;
        }

        // console.log("latest7AMRvfValue: ", latest7AMRvfValue);
        // console.log("data: ", data);
        // console.log("BirdsPointForecastValue: ", BirdsPointForecastValue);
        // console.log("BirdsPointForecastValue for Birds Point-Mississippi: ", BirdsPointForecastValue["Birds Point-Mississippi"]);

        // console.log("totalGraftonForecastDay1: ", totalGraftonForecastDay1);
        // console.log("totalGraftonForecastDay1 for Grafton: ", totalGraftonForecastDay1["Grafton-Mississippi"]);

        // Starting Processing All Gages
        if (1 === 1) {
            // LOCATION
            const locationIdCell = row.insertCell();
            locationIdCell.innerHTML = location_id;

            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            if (latest6AMValue.value) {
                level6AmCell.innerHTML = "<div title='" + latest6AMValue.date + " " + latest6AMValue.value + "'>" +
                    "<a href='../../chart/public/chart.html?cwms_ts_id=" + tsid + "' target='_blank'>" +
                    (tsid_forecast_location === true ? "<strong>" + (Math.round((latest6AMValue.value) * 100) / 100).toFixed(2) + "</strong>" : (Math.round((latest6AMValue.value) * 100) / 100).toFixed(2)) + "</a>" +
                    "</div>";
            } else {
                level6AmCell.innerHTML = "<div title='" + latest6AMValue.date + " " + latest6AMValue.value + "'>" +
                    "<a href='../../chart/public/chart.html?cwms_ts_id=" + tsid + "' target='_blank'>" +
                    (tsid_forecast_location === true ? "<strong>" + "No Data" + "</strong>" : "No Data") + "</a>" +
                    "</div>";
            }

            // DAY1
            const day1Cell = row.insertCell();
            let day1 = null;
            let totalGraysPtDay1 = null;
            let totalThebesDay1 = null;
            let totalCommerceDay1 = null;
            let totalPriceLdgDay1 = null;
            let totalThompsonLdgDay1 = null;
            let totalHerculaneumDay1 = null;
            let totalEngineersDepotDay1 = null;
            let totalNavTWDay1 = null;
            let totalRedRockLdgDay1 = null;
            let totalGrandTowerDay1 = null;
            let totalMoccasinSpringsDay1 = null;
            let totalLD27PoolDay1 = null;
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
                // Process data
                // console.log("latest6AMValue: ", latest6AMValue);
                // console.log("latest6AMValue.value = ", latest6AMValue.value);
                // console.log("convertedNetmissUpstreamData.values[0][1] = ", convertedNetmissUpstreamData.values[0][1]);
                // console.log("((getLatest6AMValue(data7)).latest6AMValue).value = ", ((getLatest6AMValue(data7)).latest6AMValue).value);

                totalLD27PoolDay1 = parseFloat(latest6AMValue.value) + parseFloat(convertedNetmissUpstreamData.values[0][1]) - parseFloat(((getLatest6AMValue(data7)).latest6AMValue).value);
                day1 = "<div title='" + "--" + "'>" + (tsid_forecast_location === true ? "<strong>" + totalLD27PoolDay1.toFixed(1) : totalLD27PoolDay1.toFixed(1)) + "</div>";
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
            } else if (location_id === "Mel Price Pool-Mississippi") {
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
                // console.log("ForecastValues at Birds Point-Mississippi: ", ForecastValues["Birds Point-Mississippi"][0].value);

                totalGraysPtDay1 = null;
                totalGraysPtDay1 = yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue) - (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue));
                // console.log("totalGraysPtDay1 = ", totalGraysPtDay1);

                day1 = "<div title='" + formula + "'>" + totalGraysPtDay1.toFixed(1) + "</div>";
            } else if (location_id === "Engineers Depot-Mississippi") {
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

                totalEngineersDepotDay1 = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream) - (todayDownstreamNetmiss - yesterday6AMValueDownstream)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("totalEngineersDepotDay1 = ", totalEngineersDepotDay1);

                day1 = "<div title='" + "--" + "'>" + totalEngineersDepotDay1.toFixed(1) + "</div>";
            } else if (location_id === "Herculaneum-Mississippi") {
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

                totalHerculaneumDay1 = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream) - (todayDownstreamNetmiss - yesterday6AMValueDownstream)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("totalHerculaneumDay1 = ", totalHerculaneumDay1);

                day1 = "<div title='" + "--" + "'>" + totalHerculaneumDay1.toFixed(1) + "</div>";
            } else if (location_id === "Nav TW-Kaskaskia") {
                // Get all variables to do calculation
                const yesterday6AMValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                const yesterday6AMValueUpstream = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterday6AMValueDownstream = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[0][1]);
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

                totalNavTWDay1 = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream) - (todayDownstreamNetmiss - yesterday6AMValueDownstream)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("totalNavTWDay1 = ", totalNavTWDay1);

                day1 = "<div title='" + "--" + "'>" + totalNavTWDay1.toFixed(1) + "</div>";
            } else if (location_id === "Red Rock Ldg-Mississippi") {
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

                totalRedRockLdgDay1 = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream) - (todayDownstreamNetmiss - yesterday6AMValueDownstream)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("totalRedRockLdgDay1 = ", totalRedRockLdgDay1);

                day1 = "<div title='" + "--" + "'>" + totalRedRockLdgDay1.toFixed(1) + "</div>";
            } else if (location_id === "Grand Tower-Mississippi") {
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

                totalGrandTowerDay1 = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream) - (todayDownstreamNetmiss - yesterday6AMValueDownstream)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("totalGrandTowerDay1 = ", totalGrandTowerDay1);

                day1 = "<div title='" + "--" + "'>" + totalGrandTowerDay1.toFixed(1) + "</div>";
            } else if (location_id === "Moccasin Springs-Mississippi") {
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

                totalMoccasinSpringsDay1 = yesterday6AMValue + (((((todayUpstreamNetmiss - yesterday6AMValueUpstream) - (todayDownstreamNetmiss - yesterday6AMValueDownstream)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterday6AMValueDownstream));
                // console.log("totalMoccasinSpringsDay1 = ", totalMoccasinSpringsDay1);

                day1 = "<div title='" + "--" + "'>" + totalMoccasinSpringsDay1.toFixed(1) + "</div>";
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

                totalThebesDay1 = yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue) - (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue));
                // console.log("totalThebesDay1 = ", totalThebesDay1);

                day1 = "<div title='" + formula + "'>" + totalThebesDay1.toFixed(1) + "</div>";
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

                totalPriceLdgDay1 = yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue) - (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue));
                // console.log("totalPriceLdgDay1 = ", totalPriceLdgDay1);

                day1 = "<div title='" + formula + "'>" + totalPriceLdgDay1.toFixed(1) + "</div>";
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

                totalThompsonLdgDay1 = yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue) - (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue));
                // console.log("totalThompsonLdgDay1 = ", totalThompsonLdgDay1);

                day1 = "<div title='" + formula + "'>" + totalThompsonLdgDay1.toFixed(1) + "</div>";
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

                totalCommerceDay1 = yesterday6AMStageRevValue + (((((todayUpstreamNetmiss - yesterdayUpstream6AMStageRevValue) - (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstream6AMStageRevValue));
                // console.log("totalCommerceDay1 = ", totalCommerceDay1);

                day1 = "<div title='" + formula + "'>" + totalCommerceDay1.toFixed(1) + "</div>";
            } else if (location_id === "LD 22 TW-Mississippi") {
                // Process data14 - netmiss flow data
                const yesterdayStageRevValue = latest6AMValue.value;
                const NetmissForecastFlowValuesCst = convertUTCtoCentralTime(data15);
                const yesterdayNetmissForecastFlowValueCst = (NetmissForecastFlowValuesCst.values[0][1]).toFixed(1);
                const todayNetmissForecastFlowValueCst = (NetmissForecastFlowValuesCst.values[1][1]).toFixed(1);

                // Process data16 - get rating table coe
                const ratingTableCoe = data16["simple-rating"][0]["rating-points"].point;
                const todayCorrespondingStageValue = findIndByDep(todayNetmissForecastFlowValueCst, ratingTableCoe);
                const yesterdayCorrespondingStageValue = findIndByDep(yesterdayNetmissForecastFlowValueCst, ratingTableCoe);

                let total = null;
                total = yesterdayStageRevValue - yesterdayCorrespondingStageValue + todayCorrespondingStageValue;

                // console.log("location_id = ", location_id);

                // console.log("yesterdayStageRevValue = ", yesterdayStageRevValue);
                // console.log("NetmissForecastFlowValuesCst @ LD 22 TW-Mississippi = ", NetmissForecastFlowValuesCst);
                // console.log("yesterdayNetmissForecastFlowValueCst = ", yesterdayNetmissForecastFlowValueCst);
                // console.log("todayNetmissForecastFlowValueCst = ", todayNetmissForecastFlowValueCst);

                // console.log("data16 = ", data16);
                // console.log("ratingTableCoe = ", ratingTableCoe);
                // console.log("todayCorrespondingStageValue:", todayCorrespondingStageValue);
                // console.log("yesterdayCorrespondingStageValue:", yesterdayCorrespondingStageValue);


                // console.log("total = ", total); // total is different because rating table is off

                day1 = "<div title='" + "total is different because rating table is off" + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Mosier Ldg-Mississippi") {
                // Get today and yesterday values
                const yesterdayUpstreamStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                const yesterdayStageRevValue = latest6AMValue.value;
                const yesterdayDownstreamStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                const todayUpstreamNetmissStageValue = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);

                // Process and get rating tables
                const ratingTableCoe = data16["simple-rating"][0]["rating-points"].point;
                const ratingTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point;

                // Process and get today upstream corresponding flow values
                const todayCorrespondingUpstreamFlowValue = findDepByInd(todayUpstreamNetmissStageValue, ratingTableCoeUpstream);

                // Determine if today upstream is open river or regulated pool
                const isTodayOpenRiver = todayCorrespondingUpstreamFlowValue > 140.0;
                const isTodayRegulatedPool = todayCorrespondingUpstreamFlowValue <= 140.0;

                // Add 0.001 to yesterdayUpstreamStageRevValue
                const todayUpstreamStageRevValuePlusOneOverOneThousand = todayUpstreamNetmissStageValue + 0.001;

                // Add 0.001 to yesterdayUpstreamStageRevValue
                const yesterdayUpstreamStageRevValuePlusOneOverOneThousand = yesterdayUpstreamStageRevValue + 0.001;

                // Process and get yesterday corresponding stage values
                const yesterdayCorrespondingUpstreamFlowValue = findDepByInd(yesterdayUpstreamStageRevValuePlusOneOverOneThousand, ratingTableCoeUpstream);

                // Determine if yesterday upstream is open river or regulated pool
                const isYesterdayOpenRiver = yesterdayCorrespondingUpstreamFlowValue > 150.0;
                const isYesterdayRegulatedPool = yesterdayCorrespondingUpstreamFlowValue <= 150.0;

                // Lookup yesterdayCorrespondingUpstreamFlowValue to Mosier Ldg-Mississippi Rating COE Table 
                const yesterdayCorrespondingUpstreamFlowValueToStageRev = findIndByDep(yesterdayCorrespondingUpstreamFlowValue, ratingTableCoe);

                // Calculate Open River forecast adjustment
                const OpenRiverForecastAdjustment = yesterdayCorrespondingUpstreamFlowValueToStageRev - yesterdayStageRevValue;

                // Lookup todayCorrespondingUpstreamFlowValue to Mosier Ldg-Mississippi Rating COE Table 
                const todayCorrespondingUpstreamFlowValueToStageRev = findIndByDep(todayCorrespondingUpstreamFlowValue, ratingTableCoe);

                const yesterdayStageRevValueMinusCorrespondingUpstreamFlowValueToStageRev = yesterdayStageRevValue - yesterdayCorrespondingUpstreamFlowValueToStageRev;
                // console.log("yesterdayStageRevValueMinusCorrespondingUpstreamFlowValueToStageRev:", yesterdayStageRevValueMinusCorrespondingUpstreamFlowValueToStageRev);

                // Open River or Regulated Pool Calculations
                let total = null;
                if (isTodayOpenRiver) {
                    total = todayCorrespondingUpstreamFlowValueToStageRev + yesterdayStageRevValueMinusCorrespondingUpstreamFlowValueToStageRev;
                } else if (isTodayRegulatedPool) {
                    total = "RP";
                } else {
                    total = "--";
                }

                // console.log("location_id = ", location_id);

                // console.log("yesterdayUpstreamStageRevValue = ", yesterdayUpstreamStageRevValue);
                // console.log("yesterdayStageRevValue = ", yesterdayStageRevValue);
                // console.log("yesterdayDownstreamStageRevValue = ", yesterdayDownstreamStageRevValue);
                // console.log("todayUpstreamNetmissStageValue = ", todayUpstreamNetmissStageValue);

                // console.log("ratingTableCoe = ", ratingTableCoe);
                // console.log("ratingTableCoeUpstream = ", ratingTableCoeUpstream);

                // console.log("todayCorrespondingUpstreamFlowValue:", todayCorrespondingUpstreamFlowValue);

                // console.log("isTodayOpenRiver:", isTodayOpenRiver);
                // console.log("isTodayRegulatedPool:", isTodayRegulatedPool);

                // console.log("todayUpstreamStageRevValuePlusOneOverOneThousand:", todayUpstreamStageRevValuePlusOneOverOneThousand);

                // console.log("yesterdayUpstreamStageRevValuePlusOneOverOneThousand:", yesterdayUpstreamStageRevValuePlusOneOverOneThousand);

                // console.log("yesterdayCorrespondingUpstreamFlowValue:", yesterdayCorrespondingUpstreamFlowValue);

                // console.log("isYesterdayOpenRiver:", isYesterdayOpenRiver);
                // console.log("isYesterdayRegulatedPool:", isYesterdayRegulatedPool);

                // console.log("yesterdayCorrespondingUpstreamFlowValueToStageRev:", yesterdayCorrespondingUpstreamFlowValueToStageRev);

                // console.log("OpenRiverForecastAdjustment:", OpenRiverForecastAdjustment);

                // console.log("todayCorrespondingUpstreamFlowValueToStageRev:", todayCorrespondingUpstreamFlowValueToStageRev);

                // console.log("total:", total);

                day1 = "<div title='" + "only work for open river condition" + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Louisiana-Mississippi") {
                // Get current and yesterday data
                const yesterdayStageRevValue = ((getLatest6AMValue(data2)).latest6AMValue).value;

                const yesterdayDownstreamStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;

                const convertedNetmissFlowValuesToCst = convertUTCtoCentralTime(data15);
                const yesterdayNetmissFlowValue = (convertedNetmissFlowValuesToCst.values[0][1]);
                const todayNetmissFlowValue = (convertedNetmissFlowValuesToCst.values[1][1]);
                const yesterdayUpstreamStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;

                // Get special gages flow data
                const convertedSpecialGage1NetmissFlowValuesToCst = convertUTCtoCentralTime(data18);
                const yesterdaySpecialGage1NetmissFlowValue = (convertedSpecialGage1NetmissFlowValuesToCst.values[0][1]);
                const todaySpecialGage1NetmissFlowValue = (convertedSpecialGage1NetmissFlowValuesToCst.values[1][1]);

                const convertedSpecialGage2NetmissFlowValuesToCst = convertUTCtoCentralTime(data20);
                const yesterdaySpecialGage2NetmissFlowValue = (convertedSpecialGage2NetmissFlowValuesToCst.values[0][1]);
                const todaySpecialGage2NetmissFlowValue = (convertedSpecialGage2NetmissFlowValuesToCst.values[1][1]);

                // Get the sum
                const sumYesterdayNetmissFlowPlusSpecialNetmissFlowValue = (parseFloat(yesterdayNetmissFlowValue) + parseFloat(yesterdaySpecialGage1NetmissFlowValue));
                const sumYesterdayNetmissFlowPlusOneThousandDividedOneThousand = ((parseFloat(yesterdayNetmissFlowValue) + 1000)) / 1000;

                const sumTodayNetmissFlowPlusSpecialNetmissFlowValue = (parseFloat(todayNetmissFlowValue) + parseFloat(todaySpecialGage1NetmissFlowValue));
                const sumTodayNetmissFlowPlusOneThousandDividedOneThousand = ((parseFloat(todayNetmissFlowValue) + 1000)) / 1000;

                // Determine if yesterday upstream is open river or regulated pool
                const isTodayOpenRiver = sumTodayNetmissFlowPlusOneThousandDividedOneThousand > 150.0;
                const isTodayRegulatedPool = sumTodayNetmissFlowPlusOneThousandDividedOneThousand <= 150.0;

                // Get rating tables
                const ratingTableCoe = data16["simple-rating"][0]["rating-points"].point;
                const ratingTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point;

                // Process and get today corresponding flow values
                const yesterdayCorrespondingUpstreamFlowValue = findDepByInd(yesterdayUpstreamStageRevValue, ratingTableCoeUpstream);
                const yesterdayCorrespondingSumNetmissFlowPlusSpecialNetmissFlowValue = findIndByDep(sumYesterdayNetmissFlowPlusSpecialNetmissFlowValue, ratingTableCoeUpstream);

                // const sumYesterdayNetmissFlowValuePlusSpecialNetmissFlowValueDividedOneThousand = (parseFloat(yesterdayNetmissFlowValue) + parseFloat(yesterdaySpecialGage1NetmissFlowValue))/1000;

                // Determine if yesterday upstream is open river or regulated pool
                const isYesterdayOpenRiver = sumYesterdayNetmissFlowPlusOneThousandDividedOneThousand > 150.0;
                const isYesterdayRegulatedPool = sumYesterdayNetmissFlowPlusOneThousandDividedOneThousand <= 150.0;

                let yesterdayCorrespondingNetmissWithSpecialNetmissFlowValue = null;
                let tDelta = null;
                if (isYesterdayOpenRiver) {
                    // Lookup yesterdayCorrespondingUpstreamFlowValue to Louisiana-Mississippi Rating COE Table 
                    yesterdayCorrespondingNetmissWithSpecialNetmissFlowValue = findIndByDep(sumYesterdayNetmissFlowPlusSpecialNetmissFlowValue, ratingTableCoe);
                    tDelta = 0 + (yesterdayStageRevValue - yesterdayCorrespondingNetmissWithSpecialNetmissFlowValue);
                } else {
                    // Lookup yesterdayCorrespondingUpstreamFlowValue to Louisiana-Mississippi Rating COE Table 
                    yesterdayCorrespondingNetmissWithSpecialNetmissFlowValue = findIndByDep(sumYesterdayNetmissFlowPlusSpecialNetmissFlowValue, ratingTableCoe);
                    tDelta = yesterdayStageRevValue - yesterdayCorrespondingNetmissWithSpecialNetmissFlowValue;
                }

                // Lookup todayCorrespondingUpstreamFlowValue to Louisiana-Mississippi Rating COE Table 
                const todayCorrespondingNetmissWithSpecialNetmissFlowValue = findIndByDep(sumTodayNetmissFlowPlusSpecialNetmissFlowValue, ratingTableCoe);

                const all = todayCorrespondingNetmissWithSpecialNetmissFlowValue + tDelta;

                // console.log("location_id: ", location_id);

                // console.log("yesterdayStageRevValue = ", yesterdayStageRevValue);

                // console.log("yesterdayDownstreamStageRevValue = ", yesterdayDownstreamStageRevValue);

                // console.log("convertedNetmissFlowValuesToCst = ", convertedNetmissFlowValuesToCst);
                // console.log("yesterdayNetmissFlowValue = ", yesterdayNetmissFlowValue);
                // console.log("todayNetmissFlowValue = ", todayNetmissFlowValue);
                // console.log("yesterdayUpstreamStageRevValue = ", yesterdayUpstreamStageRevValue);

                // console.log("convertedSpecialGage1NetmissFlowValuesToCst = ", convertedSpecialGage1NetmissFlowValuesToCst);
                // console.log("yesterdaySpecialGage1NetmissFlowValue = ", yesterdaySpecialGage1NetmissFlowValue);
                // console.log("todaySpecialGage1NetmissFlowValue = ", todaySpecialGage1NetmissFlowValue);

                // console.log("convertedSpecialGage2NetmissFlowValuesToCst = ", convertedSpecialGage2NetmissFlowValuesToCst);
                // console.log("yesterdaySpecialGage2NetmissFlowValue = ", yesterdaySpecialGage2NetmissFlowValue);
                // console.log("todaySpecialGage2NetmissFlowValue = ", todaySpecialGage2NetmissFlowValue);

                // console.log("sumYesterdayNetmissFlowPlusSpecialNetmissFlowValue = ", sumYesterdayNetmissFlowPlusSpecialNetmissFlowValue);
                // console.log("sumYesterdayNetmissFlowPlusOneThousandDividedOneThousand = ", sumYesterdayNetmissFlowPlusOneThousandDividedOneThousand);

                // console.log("sumTodayNetmissFlowPlusSpecialNetmissFlowValue = ", sumTodayNetmissFlowPlusSpecialNetmissFlowValue);
                // console.log("sumTodayNetmissFlowPlusOneThousandDividedOneThousand = ", sumTodayNetmissFlowPlusOneThousandDividedOneThousand);

                // console.log("isTodayOpenRiver = ", isTodayOpenRiver);
                // console.log("isTodayRegulatedPool = ", isTodayRegulatedPool);

                // console.log("ratingTableCoe = ", ratingTableCoe);
                // console.log("ratingTableCoeUpstream = ", ratingTableCoeUpstream);

                // console.log("yesterdayCorrespondingUpstreamFlowValue = ", yesterdayCorrespondingUpstreamFlowValue);
                // console.log("yesterdayCorrespondingSumNetmissFlowPlusSpecialNetmissFlowValue = ", yesterdayCorrespondingSumNetmissFlowPlusSpecialNetmissFlowValue);

                // console.log("isYesterdayOpenRiver = ", isYesterdayOpenRiver);
                // console.log("isYesterdayRegulatedPool = ", isYesterdayRegulatedPool);

                // console.log("yesterdayCorrespondingNetmissWithSpecialNetmissFlowValue = ", yesterdayCorrespondingNetmissWithSpecialNetmissFlowValue);

                // console.log("tDelta = ", tDelta);

                // console.log("todayCorrespondingNetmissWithSpecialNetmissFlowValue = ", todayCorrespondingNetmissWithSpecialNetmissFlowValue);

                // console.log("all = ", all);

                // Call the function and log the result for rating
                // let jsonFileName = "ratingLouisiana.json";
                // let stage = yesterdayDownstreamStageRevValue;
                // let flowRate = sumTodayNetmissFlowPlusSpecialNetmissFlowValue/1000;
                // console.log("stage, flowRate, jsonFileName: ", stage, flowRate, jsonFileName);
                // let value = await readJSONTable(stage, flowRate, jsonFileName);
                // console.log("value: ", value);
                // if (value !== null) {
                //     console.log(`Interpolated reading for flow rate ${flowRate} and stage ${stage} at table ${jsonFileName}: ${value}`);
                // } else {
                //     console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                // }

                // Open River or Regulated Pool Calculations
                let total = null;
                if (isTodayOpenRiver) {
                    // console.log("isTodayOpenRiver: ", isTodayOpenRiver);
                    total = all;
                    // console.log("total: ", total);
                } else if (isTodayRegulatedPool) {
                    // console.log("isTodayRegulatedPool: ", isTodayRegulatedPool);
                    total = "--";
                } else {
                    total = "--";
                }

                day1 = "<div title='" + "isTodayOpenRiver = " + isTodayOpenRiver + ", " + "--" + "'>" + total.toFixed(1) + "</div>";
            } else if (location_id === "Grafton-Mississippi") {
                // Grafton data process is in fetch.js
                // TODO: value does not match between excel and email

                day1 = "<div title='" + "Rating LD 25 TW is off between database and excel" + "'>" + (Math.round(GraftonForecast["Grafton-Mississippi"][0].value * 100) / 100).toFixed(1) + "</div>";
            } else if (location_id === "Hardin-Illinois") {
                // console.log("location_id: ", location_id);
                // YESYERDAY
                const yesterdayCurrentGageStageRevValue = latest6AMValue.value;
                // console.log("yesterdayCurrentGageStageRevValue: ", yesterdayCurrentGageStageRevValue);
                const yesterdayCurrentGageStageRevValuePlusGageZero = parseFloat(yesterdayCurrentGageStageRevValue) + 400;
                // console.log("yesterdayCurrentGageStageRevValuePlusGageZero: ", yesterdayCurrentGageStageRevValuePlusGageZero);
                const yesterdayDownstreamStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                // console.log("yesterdayDownstreamStageRevValue: ", yesterdayDownstreamStageRevValue);
                const yesterdayDownstreamStageRevValuePlusGageZero = parseFloat(yesterdayDownstreamStageRevValue) + 403.79;
                // console.log("yesterdayDownstreamStageRevValuePlusGageZero: ", yesterdayDownstreamStageRevValuePlusGageZero);

                // SPECIAL RATING
                const convertedSpecialNetmissGage1FlowValuesToCst = convertUTCtoCentralTime(data18);
                const todaySpecialGage1NetmissFlowValue = convertedSpecialNetmissGage1FlowValuesToCst.values[1][1];
                // console.log("todaySpecialGage1NetmissFlowValue: ", todaySpecialGage1NetmissFlowValue);
                const yesterdaySpecialGage1NetmissFlowValue = convertedSpecialNetmissGage1FlowValuesToCst.values[0][1];
                // console.log("yesterdaySpecialGage1NetmissFlowValue: ", yesterdaySpecialGage1NetmissFlowValue);

                const convertedSpecialNetmissGage2FlowValuesToCst = convertUTCtoCentralTime(data20);
                const todaySpecialGage2NetmissFlowValue = convertedSpecialNetmissGage2FlowValuesToCst.values[1][1];
                // console.log("todaySpecialGage2NetmissFlowValue: ", todaySpecialGage2NetmissFlowValue);
                const yesterdaySpecialGage2NetmissFlowValue = convertedSpecialNetmissGage2FlowValuesToCst.values[0][1];
                // console.log("yesterdaySpecialGage2NetmissFlowValue: ", yesterdaySpecialGage2NetmissFlowValue);

                // BACKWATER RATING HARDIN
                let jsonFileName = "backwaterRatingHardin.json";
                let total = null;
                let total1 = null;
                const stage1 = yesterdayDownstreamStageRevValuePlusGageZero;
                const flowRate1 = yesterdaySpecialGage1NetmissFlowValue;
                // console.log(stage1, flowRate1, jsonFileName);
                let deltaYesterdayStageRev = null;
                let value1 = await readJSONTable(stage1, flowRate1, jsonFileName);
                // console.log("value1: ", value1);
                if (value1 !== null) {
                    // console.log(`Interpolated reading for flow rate ${flowRate1} and stage ${stage1} at table ${jsonFileName}: ${value1}`);

                    deltaYesterdayStageRev = yesterdayCurrentGageStageRevValuePlusGageZero - value1;
                    // console.log("deltaYesterdayStageRev: ", deltaYesterdayStageRev);

                    // console.log("total in readJSON: ", total1);
                } else {
                    // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                }
                // console.log("total1: ", total1);

                const graftonDay1 = GraftonForecast["Grafton-Mississippi"][0].value;
                // console.log("graftonDay1: ", graftonDay1);

                // TODAY 
                const todayDownstreamNetmissValuePlusGageZero = graftonDay1 + 403.79; // Test Here, graftonDay1 + 403.79;
                // console.log("todayDownstreamNetmissValuePlusGageZero: ", todayDownstreamNetmissValuePlusGageZero);

                let total2 = null;
                let stage2 = todayDownstreamNetmissValuePlusGageZero; // if test, use value of 425.0
                let flowRate2 = todaySpecialGage1NetmissFlowValue;
                // console.log(stage2, flowRate2, jsonFileName);
                let value2 = await readJSONTable(stage2, flowRate2, jsonFileName)
                // console.log("value2: ", value2);
                if (value2 !== null) {
                    // console.log(`Interpolated reading for flow rate ${flowRate2} and stage ${stage2} at table ${jsonFileName}: ${value2}`);
                    total2 = deltaYesterdayStageRev + value2 - 400;
                    // console.log("total2 in readJSON: ", total2, deltaYesterdayStageRev, value2, "400");
                } else {
                    // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                }
                // console.log("total2: ", total2);

                total = total2;

                if (total) {
                    day1 = "<div title='" + "Grafton day1 is off due to LD 25 TW rating table" + "'>" + total.toFixed(1) + "</div>";
                } else {
                    day1 = "<div title='" + "--" + "'>" + "total is null" + "</div>";
                }
            } else if (location_id === "Valley City-Illinois") {
                // TODAY

                // YESYERDAY
                // console.log("location_id: ", location_id);
                const yesterdayStageRevValue = latest6AMValue.value;
                // console.log("yesterdayStageRevValue: ", yesterdayStageRevValue);

                const yesterdayStageRevValuePlusGageZero = parseFloat(yesterdayStageRevValue) + 418.0;
                // console.log("yesterdayStageRevValuePlusGageZero: ", yesterdayStageRevValuePlusGageZero);

                const yesterdayDownstreamStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                // console.log("yesterdayDownstreamStageRevValue: ", yesterdayDownstreamStageRevValue);
                const yesterdayDownstreamStageRevValuePlusGageZero = parseFloat(yesterdayDownstreamStageRevValue) + 403.79;
                // console.log("yesterdayDownstreamStageRevValuePlusGageZero: ", yesterdayDownstreamStageRevValuePlusGageZero);

                // console.log("convertedNetmissUpstreamData: ", convertedNetmissUpstreamData);
                const yesterdayNetmissUpstreamFlowValue = convertedNetmissUpstreamData.values[0][1];
                // console.log("yesterdayNetmissUpstreamFlowValue: ", yesterdayNetmissUpstreamFlowValue);
                const todayNetmissUpstreamFlowValue = convertedNetmissUpstreamData.values[1][1];
                // console.log("todayNetmissUpstreamFlowValue: ", todayNetmissUpstreamFlowValue);

                // Call the function and log the result for rating
                let jsonFileName = "backwaterRatingValleyCity.json";
                let total = null;
                let stage1 = yesterdayDownstreamStageRevValuePlusGageZero;
                let flowRate1 = yesterdayNetmissUpstreamFlowValue;
                let value1 = await readJSONTable(stage1, flowRate1, jsonFileName);
                // console.log("value1: ", value1);
                if (value1 !== null) {
                    // console.log(`Interpolated reading for flow rate ${flowRate1} and stage ${stage1} at table ${jsonFileName}: ${value1}`);
                } else {
                    // console.log(`No data found for flow rate ${flowRate1} and stage ${stage1}`);
                }

                const delta = yesterdayStageRevValuePlusGageZero - value1;
                // console.log("delta: ", delta);

                const graftonDay1PlusGageZero = (parseFloat(GraftonForecast["Grafton-Mississippi"][0].value)) + 403.79;
                // console.log("graftonDay1PlusGageZero: ", graftonDay1PlusGageZero);

                let stage2 = graftonDay1PlusGageZero;
                let flowRate2 = todayNetmissUpstreamFlowValue;
                let value2 = await readJSONTable(stage2, flowRate2, jsonFileName);
                // console.log("value2: ", value2);
                if (value2 !== null) {
                    // console.log(`Interpolated reading for flow rate ${flowRate2} and stage ${stage2} at table ${jsonFileName}: ${value2}`);
                } else {
                    // console.log(`No data found for flow rate ${flowRate2} and stage ${stage2}`);
                }

                total = parseFloat(delta) + parseFloat(value2) - 418.00;
                // console.log("total: ", total);

                valleyCityDay1 = total;

                if (total) {
                    day1 = "<div title='" + "All depends on Grafton Day1" + "'>" + total.toFixed(1) + "</div>";
                } else {
                    day1 = "<div title='" + "--" + "'>" + "total is null" + "</div>";
                }

            } else if (location_id === "Meredosia-Illinois") {
                // YESYERDAY
                // console.log("location_id: ", location_id);
                const yesterdayStageRevValue = latest6AMValue.value;
                // console.log("yesterdayStageRevValue: ", yesterdayStageRevValue);

                const yesterdayStageRevValuePlusGageZero = parseFloat(yesterdayStageRevValue) + 418.00;
                // console.log("yesterdayStageRevValuePlusGageZero: ", yesterdayStageRevValuePlusGageZero);

                const yesterdayDownstreamStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                // console.log("yesterdayDownstreamStageRevValue: ", yesterdayDownstreamStageRevValue);

                const yesterdayDownstreamStageRevValuePlusGageZero = parseFloat(yesterdayDownstreamStageRevValue) + 403.79;
                // console.log("yesterdayDownstreamStageRevValuePlusGageZero: ", yesterdayDownstreamStageRevValuePlusGageZero);

                const convertedNetmissFlowValuesToCst = convertUTCtoCentralTime(data15);
                const yesterdayNetmissFlowValue = (convertedNetmissFlowValuesToCst.values[0][1]);
                // console.log("yesterdayNetmissFlowValue: ", yesterdayNetmissFlowValue);
                const todayNetmissFlowValue = (convertedNetmissFlowValuesToCst.values[1][1]);
                // console.log("todayNetmissFlowValue: ", todayNetmissFlowValue);

                // BACKWATER RATING HARDIN
                let jsonFileName = "backwaterRatingMeredosia.json";
                let total = null;
                const stage1 = yesterdayDownstreamStageRevValuePlusGageZero;
                const flowRate1 = yesterdayNetmissFlowValue;
                // console.log(stage1, flowRate1, jsonFileName);
                let deltaYesterdayStageRev = null;
                let value1 = await readJSONTable(stage1, flowRate1, jsonFileName);
                // console.log("value1: ", value1);
                if (value1 !== null) {
                    // console.log(`Interpolated reading for flow rate ${flowRate1} and stage ${stage1} at table ${jsonFileName}: ${value1}`);
                    deltaYesterdayStageRev = yesterdayStageRevValuePlusGageZero - value1;
                    // console.log("deltaYesterdayStageRev: ", deltaYesterdayStageRev);
                } else {
                    // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                }

                const graftonDay1 = GraftonForecast["Grafton-Mississippi"][0].value;
                // console.log("graftonDay1: ", graftonDay1);

                const graftonDay1PlusGageZero = graftonDay1 + 403.79;
                // console.log("graftonDay1PlusGageZero: ", graftonDay1PlusGageZero);

                const stage2 = graftonDay1PlusGageZero;
                const flowRate2 = todayNetmissFlowValue;
                // console.log(stage2, flowRate2, jsonFileName);
                let deltaTodayStageRev = null;
                let value2 = await readJSONTable(stage2, flowRate2, jsonFileName);
                // console.log("value2: ", value2);
                if (value2 !== null) {
                    // console.log(`Interpolated reading for flow rate ${flowRate2} and stage ${stage2} at table ${jsonFileName}: ${value2}`);
                    deltaTodayStageRev = value2 - 418.0;
                    // console.log("deltaTodayStageRev: ", deltaTodayStageRev);
                } else {
                    // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                }

                total = deltaTodayStageRev + deltaYesterdayStageRev;
                // console.log("total: ", total);

                if (total) {
                    day1 = "<div title='" + "--" + "'>" + total.toFixed(1) + "</div>";
                } else {
                    day1 = "<div title='" + "--" + "'>" + "--" + "</div>";
                }

            } else if (location_id === "Cairo-Ohio") {
                if (latest7AMRvfValue[0] !== null) {
                    day1 = "<div title='" + latest7AMRvfValue[0].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[0].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[0].value).toFixed(1)) +
                        "</div>";
                }
            } else {
                if (convertedData !== null) {
                    day1 = "<div title='" + convertedData.values[0] + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (convertedData.values[0][1]).toFixed(1) + "</strong>" : (Math.round((convertedData.values[0][1]) * 10) / 10).toFixed(1)) +
                        "</div>";
                } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                    let roundedValue = Math.round(BirdsPointForecastValue[0].value * 100) / 100; // Round to one decimal place
                    let roundedValueOnePlace = Math.round(roundedValue * 10) / 10;
                    day1 = "<div title='" + BirdsPointForecastValue[0].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + roundedValueOnePlace.toFixed(1) + "</strong>" : roundedValueOnePlace.toFixed(1)) +
                        "</div>";
                } else {
                    day1 = "<div>" + "-" + "</div>";
                }
            }
            day1Cell.innerHTML = day1;

            // DAY2
            const day2Cell = row.insertCell();
            let day2 = null;
            let totalGraysPtDay2 = null;
            let totalThebesDay2 = null;
            let totalCommerceDay2 = null;
            let totalPriceLdgDay2 = null;
            let totalThompsonLdgDay2 = null;
            let totalHerculaneumDay2 = null;
            let totalEngineersDepotDay2 = null;
            let totalNavTWDay2 = null;
            let totalRedRockLdgDay2 = null;
            let totalGrandTowerDay2 = null;
            let totalMoccasinSpringsDay2 = null;
            let totalLD27PoolDay2 = null;
            // Process netmiss interpolation for each gage here
            if (location_id === "Grays Pt-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][1].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][0].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalGraysPtDay2 = totalGraysPtDay1 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day2 = "<div>" + totalGraysPtDay2.toFixed(1) + "</div>";
            } else if (location_id === "Cairo-Ohio") {
                if (latest7AMRvfValue[1] !== null) {
                    day2 = "<div title='" + latest7AMRvfValue[1].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[1].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[1].value).toFixed(1)) +
                        "</div>";
                }
            } else if (location_id === "Thebes-Mississippi") {
                // console.log("totalThebesDay1 = ", totalThebesDay1);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][1].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][0].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalThebesDay2 = totalThebesDay1 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day2 = "<div>" + totalThebesDay2.toFixed(1) + "</div>";
            } else if (location_id === "Commerce-Mississippi") {
                // console.log("totalThebesDay1 = ", totalThebesDay1);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][1].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][0].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalCommerceDay2 = totalCommerceDay1 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day2 = "<div>" + totalCommerceDay2.toFixed(1) + "</div>";
            } else if (location_id === "Price Ldg-Mississippi") {
                // console.log("totalThebesDay1 = ", totalThebesDay1);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][1].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][0].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalPriceLdgDay2 = totalPriceLdgDay1 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day2 = "<div>" + totalPriceLdgDay2.toFixed(1) + "</div>";
            } else if (location_id === "Thompson Ldg-Mississippi") {
                // console.log("totalThebesDay1 = ", totalThebesDay1);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][1].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][0].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalThompsonLdgDay2 = totalThompsonLdgDay1 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day2 = "<div>" + totalThompsonLdgDay2.toFixed(1) + "</div>";
            } else if (location_id === "Herculaneum-Mississippi") {
                // console.log("totalThebesDay1 = ", totalThebesDay1);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[1][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[0][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalHerculaneumDay2 = totalHerculaneumDay1 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day2 = "<div>" + totalHerculaneumDay2.toFixed(1) + "</div>";
            } else if (location_id === "Engineers Depot-Mississippi") {
                // console.log("totalEngineersDepotDay1 = ", totalEngineersDepotDay1);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[1][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[0][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalEngineersDepotDay2 = totalEngineersDepotDay1 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day2 = "<div>" + totalEngineersDepotDay2.toFixed(1) + "</div>";
            } else if (location_id === "Nav TW-Kaskaskia") {
                // console.log("totalNavTWDay1 = ", totalNavTWDay1);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[1][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[0][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = 117.5;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalNavTWDay2 = totalNavTWDay1 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day2 = "<div>" + totalNavTWDay2.toFixed(1) + "</div>";
            } else if (location_id === "Red Rock Ldg-Mississippi") {
                // console.log("totalRedRockLdgDay1 = ", totalRedRockLdgDay1);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[1][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[0][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalRedRockLdgDay2 = totalRedRockLdgDay1 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day2 = "<div>" + totalRedRockLdgDay2.toFixed(1) + "</div>";
            } else if (location_id === "Grand Tower-Mississippi") {
                // console.log("totalGrandTowerDay1 = ", totalGrandTowerDay1);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[1][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[0][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalGrandTowerDay2 = totalGrandTowerDay1 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day2 = "<div>" + totalGrandTowerDay2.toFixed(1) + "</div>";
            } else if (location_id === "Moccasin Springs-Mississippi") {
                // console.log("totalMoccasinSpringsDay1 = ", totalMoccasinSpringsDay1);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[1][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[0][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalMoccasinSpringsDay2 = totalMoccasinSpringsDay1 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day2 = "<div>" + totalMoccasinSpringsDay2.toFixed(1) + "</div>";
            } else if (location_id === "LD 27 Pool-Mississippi") {
                // Process data
                // console.log("totalLD27PoolDay1: ", totalLD27PoolDay1);
                // console.log("convertedNetmissUpstreamData.values[0][1] = ", convertedNetmissUpstreamData.values[0][1]);
                // console.log("convertedNetmissUpstreamData.values[1][1] = ", convertedNetmissUpstreamData.values[1][1]);

                totalLD27PoolDay2 = parseFloat(totalLD27PoolDay1) + parseFloat(convertedNetmissUpstreamData.values[1][1]) - parseFloat(convertedNetmissUpstreamData.values[0][1]);
                day2 = "<div title='" + "--" + "'>" + (tsid_forecast_location === true ? "<strong>" + totalLD27PoolDay2.toFixed(1) : totalLD27PoolDay2.toFixed(1)) + "</div>";
            } else {
                if (convertedData !== null) {
                    day2 = "<div title='" + convertedData.values[1] + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (convertedData.values[1][1]).toFixed(1) + "</strong>" : (convertedData.values[1][1]).toFixed(1)) +
                        "</div>";
                } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                    let roundedValue = Math.round(BirdsPointForecastValue[1].value * 100) / 100; // Round to one decimal place
                    let roundedValueOnePlace = Math.round(roundedValue * 10) / 10;
                    day2 = "<div title='" + BirdsPointForecastValue[0].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + roundedValueOnePlace.toFixed(1) + "</strong>" : roundedValueOnePlace.toFixed(1)) +
                        "</div>";
                } else {
                    day2 = "<div>" + "-" + "</div>";
                }
            }
            day2Cell.innerHTML = day2;

            // DAY3
            const day3Cell = row.insertCell();
            let day3 = null;
            let totalGraysPtDay3 = null;
            let totalThebesDay3 = null;
            let totalCommerceDay3 = null;
            let totalPriceLdgDay3 = null;
            let totalThompsonLdgDay3 = null;
            let totalHerculaneumDay3 = null;
            let totalEngineersDepotDay3 = null;
            let totalNavTWDay3 = null;
            let totalRedRockLdgDay3 = null;
            let totalGrandTowerDay3 = null;
            let totalMoccasinSpringsDay3 = null;
            let totalLD27PoolDay3 = null;
            if (location_id === "Grays Pt-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][2].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][1].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalGraysPtDay3 = totalGraysPtDay2 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day3 = "<div>" + totalGraysPtDay3.toFixed(1) + "</div>";
            } else if (location_id === "Cairo-Ohio") {
                if (latest7AMRvfValue[2] !== null) {
                    day3 = "<div title='" + latest7AMRvfValue[2].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[2].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[2].value).toFixed(1)) +
                        "</div>";
                }
            } else if (location_id === "Thebes-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][2].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][1].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalThebesDay3 = totalThebesDay2 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day3 = "<div>" + totalThebesDay3.toFixed(1) + "</div>";
            } else if (location_id === "Commerce-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][2].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][1].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalCommerceDay3 = totalCommerceDay2 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day3 = "<div>" + totalCommerceDay3.toFixed(1) + "</div>";
            } else if (location_id === "Price Ldg-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][2].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][1].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalPriceLdgDay3 = totalPriceLdgDay2 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day3 = "<div>" + totalPriceLdgDay3.toFixed(1) + "</div>";
            } else if (location_id === "Thompson Ldg-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][2].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][1].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalThompsonLdgDay3 = totalThompsonLdgDay2 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day3 = "<div>" + totalThompsonLdgDay3.toFixed(1) + "</div>";
            } else if (location_id === "Herculaneum-Mississippi") {
                // console.log("totalHerculaneumDay2 = ", totalHerculaneumDay2);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[2][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[1][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalHerculaneumDay3 = totalHerculaneumDay2 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day3 = "<div>" + totalHerculaneumDay3.toFixed(1) + "</div>";
            } else if (location_id === "Engineers Depot-Mississippi") {
                // console.log("totalEngineersDepotDay2 = ", totalEngineersDepotDay2);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[2][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[1][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalEngineersDepotDay3 = totalEngineersDepotDay2 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day3 = "<div>" + totalEngineersDepotDay3.toFixed(1) + "</div>";
            } else if (location_id === "Nav TW-Kaskaskia") {
                // console.log("totalNavTWDay2 = ", totalNavTWDay2);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[2][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[1][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = 117.5;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalNavTWDay3 = totalNavTWDay2 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day3 = "<div>" + totalNavTWDay3.toFixed(1) + "</div>";
            } else if (location_id === "Red Rock Ldg-Mississippi") {
                // console.log("totalRedRockLdgDay2 = ", totalRedRockLdgDay2);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[2][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[1][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalRedRockLdgDay3 = totalRedRockLdgDay2 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day3 = "<div>" + totalRedRockLdgDay3.toFixed(1) + "</div>";
            } else if (location_id === "Grand Tower-Mississippi") {
                // console.log("totalGrandTowerDay2 = ", totalGrandTowerDay2);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[2][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[1][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalGrandTowerDay3 = totalGrandTowerDay2 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day3 = "<div>" + totalGrandTowerDay3.toFixed(1) + "</div>";
            } else if (location_id === "Moccasin Springs-Mississippi") {
                // console.log("totalMoccasinSpringsDay2 = ", totalMoccasinSpringsDay2);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[2][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[1][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalMoccasinSpringsDay3 = totalMoccasinSpringsDay2 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day3 = "<div>" + totalMoccasinSpringsDay3.toFixed(1) + "</div>";
            } else if (location_id === "LD 27 Pool-Mississippi") {
                // Process data
                // console.log("totalLD27PoolDay2: ", totalLD27PoolDay2);
                // console.log("convertedNetmissUpstreamData.values[2][1] = ", convertedNetmissUpstreamData.values[2][1]);
                // console.log("convertedNetmissUpstreamData.values[1][1] = ", convertedNetmissUpstreamData.values[1][1]);

                totalLD27PoolDay3 = parseFloat(totalLD27PoolDay2) + parseFloat(convertedNetmissUpstreamData.values[2][1]) - parseFloat(convertedNetmissUpstreamData.values[1][1]);
                day3 = "<div title='" + "--" + "'>" + (tsid_forecast_location === true ? "<strong>" + totalLD27PoolDay3.toFixed(1) : totalLD27PoolDay3.toFixed(1)) + "</div>";
            } else {
                if (convertedData !== null) {
                    day3 = "<div title='" + convertedData.values[2] + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (convertedData.values[2][1]).toFixed(1) + "</strong>" : (convertedData.values[2][1]).toFixed(1)) +
                        "</div>";
                } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                    let roundedValue = Math.round(BirdsPointForecastValue[2].value * 100) / 100; // Round to one decimal place
                    let roundedValueOnePlace = Math.round(roundedValue * 10) / 10;
                    day3 = "<div title='" + BirdsPointForecastValue[0].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + roundedValueOnePlace.toFixed(1) + "</strong>" : roundedValueOnePlace.toFixed(1)) +
                        "</div>";
                } else {
                    day3 = "<div>" + "-" + "</div>";
                }
            }
            day3Cell.innerHTML = day3;

            // DAY4
            const day4Cell = row.insertCell();
            let day4 = null;
            let totalGraysPtDay4 = null;
            let totalThebesDay4 = null;
            let totalCommerceDay4 = null;
            let totalPriceLdgDay4 = null;
            let totalThompsonLdgDay4 = null;
            let totalHerculaneumDay4 = null;
            let totalEngineersDepotDay4 = null;
            let totalNavTWDay4 = null;
            let totalRedRockLdgDay4 = null;
            let totalGrandTowerDay4 = null;
            let totalMoccasinSpringsDay4 = null;
            let totalLD27PoolDay4 = null;
            if (location_id === "Grays Pt-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][3].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][2].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalGraysPtDay4 = totalGraysPtDay3 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day4 = "<div>" + totalGraysPtDay4.toFixed(1) + "</div>";
            } else if (location_id === "Cairo-Ohio") {
                if (latest7AMRvfValue[3] !== null) {
                    day4 = "<div title='" + latest7AMRvfValue[3].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[3].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[3].value).toFixed(1)) +
                        "</div>";
                }
            } else if (location_id === "Thebes-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][3].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][2].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalThebesDay4 = totalThebesDay3 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day4 = "<div>" + totalThebesDay4.toFixed(1) + "</div>";
            } else if (location_id === "Commerce-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][3].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][2].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalCommerceDay4 = totalCommerceDay3 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day4 = "<div>" + totalCommerceDay4.toFixed(1) + "</div>";
            } else if (location_id === "Price Ldg-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][3].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][2].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalPriceLdgDay4 = totalPriceLdgDay3 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day4 = "<div>" + totalPriceLdgDay4.toFixed(1) + "</div>";
            } else if (location_id === "Thompson Ldg-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][3].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][2].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalThompsonLdgDay4 = totalThompsonLdgDay3 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day4 = "<div>" + totalThompsonLdgDay4.toFixed(1) + "</div>";
            } else if (location_id === "Herculaneum-Mississippi") {
                // console.log("totalHerculaneumDay3 = ", totalHerculaneumDay3);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[3][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[2][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalHerculaneumDay4 = totalHerculaneumDay3 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day4 = "<div>" + totalHerculaneumDay4.toFixed(1) + "</div>";
            } else if (location_id === "Engineers Depot-Mississippi") {
                // console.log("totalEngineersDepotDay3 = ", totalEngineersDepotDay3);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[3][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[2][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalEngineersDepotDay4 = totalEngineersDepotDay3 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day4 = "<div>" + totalEngineersDepotDay4.toFixed(1) + "</div>";
            } else if (location_id === "Nav TW-Kaskaskia") {
                // console.log("totalNavTWDay3 = ", totalNavTWDay3);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[3][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[2][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = 117.5;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalNavTWDay4 = totalNavTWDay3 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day4 = "<div>" + totalNavTWDay4.toFixed(1) + "</div>";
            } else if (location_id === "Red Rock Ldg-Mississippi") {
                // console.log("totalRedRockLdgDay3 = ", totalRedRockLdgDay3);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[3][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[2][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalRedRockLdgDay4 = totalRedRockLdgDay3 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day4 = "<div>" + totalRedRockLdgDay4.toFixed(1) + "</div>";
            } else if (location_id === "Grand Tower-Mississippi") {
                // console.log("totalGrandTowerDay3 = ", totalGrandTowerDay3);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[3][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[2][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalGrandTowerDay4 = totalGrandTowerDay3 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day4 = "<div>" + totalGrandTowerDay4.toFixed(1) + "</div>";
            } else if (location_id === "Moccasin Springs-Mississippi") {
                // console.log("totalMoccasinSpringsDay3 = ", totalMoccasinSpringsDay3);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[3][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[2][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalMoccasinSpringsDay4 = totalMoccasinSpringsDay3 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day4 = "<div>" + totalMoccasinSpringsDay4.toFixed(1) + "</div>";
            } else if (location_id === "LD 27 Pool-Mississippi") {
                // Process data
                // console.log("totalLD27PoolDay3: ", totalLD27PoolDay3);
                // console.log("convertedNetmissUpstreamData.values[2][1] = ", convertedNetmissUpstreamData.values[2][1]);
                // console.log("convertedNetmissUpstreamData.values[3][1] = ", convertedNetmissUpstreamData.values[3][1]);

                totalLD27PoolDay4 = parseFloat(totalLD27PoolDay3) + parseFloat(convertedNetmissUpstreamData.values[3][1]) - parseFloat(convertedNetmissUpstreamData.values[2][1]);
                day4 = "<div title='" + "--" + "'>" + (tsid_forecast_location === true ? "<strong>" + totalLD27PoolDay4.toFixed(1) : totalLD27PoolDay4.toFixed(1)) + "</div>";
            } else {
                if (convertedData !== null) {
                    day4 = "<div title='" + convertedData.values[3] + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (convertedData.values[3][1]).toFixed(1) + "</strong>" : (convertedData.values[3][1]).toFixed(1)) +
                        "</div>";
                } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                    let roundedValue = Math.round(BirdsPointForecastValue[3].value * 100) / 100; // Round to one decimal place
                    let roundedValueOnePlace = Math.round(roundedValue * 10) / 10;
                    day4 = "<div title='" + BirdsPointForecastValue[0].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + roundedValueOnePlace.toFixed(1) + "</strong>" : roundedValueOnePlace.toFixed(1)) +
                        "</div>";
                } else {
                    day4 = "<div>" + "-" + "</div>";
                }
            }
            day4Cell.innerHTML = day4;

            // DAY5
            const day5Cell = row.insertCell();
            let day5 = null;
            let totalGraysPtDay5 = null;
            let totalThebesDay5 = null;
            let totalCommerceDay5 = null;
            let totalPriceLdgDay5 = null;
            let totalThompsonLdgDay5 = null;
            let totalHerculaneumDay5 = null;
            let totalEngineersDepotDay5 = null;
            let totalNavTWDay5 = null;
            let totalRedRockLdgDay5 = null;
            let totalGrandTowerDay5 = null;
            let totalMoccasinSpringsDay5 = null;
            let totalLD27PoolDay5 = null;
            if (location_id === "Grays Pt-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][4].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][3].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalGraysPtDay5 = totalGraysPtDay4 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day5 = "<div>" + totalGraysPtDay5.toFixed(1) + "</div>";
            } else if (location_id === "Cairo-Ohio") {
                if (latest7AMRvfValue[4] !== null) {
                    day5 = "<div title='" + latest7AMRvfValue[4].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[4].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[4].value).toFixed(1)) +
                        "</div>";
                }
            } else if (location_id === "Thebes-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][4].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][3].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalThebesDay5 = totalThebesDay4 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day5 = "<div>" + totalThebesDay5.toFixed(1) + "</div>";
            } else if (location_id === "Commerce-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][4].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][3].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalCommerceDay5 = totalCommerceDay4 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day5 = "<div>" + totalCommerceDay5.toFixed(1) + "</div>";
            } else if (location_id === "Price Ldg-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][4].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][3].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalPriceLdgDay5 = totalPriceLdgDay4 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day5 = "<div>" + totalPriceLdgDay5.toFixed(1) + "</div>";
            } else if (location_id === "Thompson Ldg-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][4].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][3].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalThompsonLdgDay5 = totalThompsonLdgDay4 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day5 = "<div>" + totalThompsonLdgDay5.toFixed(1) + "</div>";
            } else if (location_id === "Herculaneum-Mississippi") {
                // console.log("totalHerculaneumDay4 = ", totalHerculaneumDay4);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[4][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[3][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalHerculaneumDay5 = totalHerculaneumDay4 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day5 = "<div>" + totalHerculaneumDay5.toFixed(1) + "</div>";
            } else if (location_id === "Engineers Depot-Mississippi") {
                // console.log("totalEngineersDepotDay4 = ", totalEngineersDepotDay4);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[4][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[3][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalEngineersDepotDay5 = totalEngineersDepotDay4 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day5 = "<div>" + totalEngineersDepotDay5.toFixed(1) + "</div>";
            } else if (location_id === "Nav TW-Kaskaskia") {
                // console.log("totalNavTWDay4 = ", totalNavTWDay4);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[4][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[3][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = 117.5;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalNavTWDay5 = totalNavTWDay4 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day5 = "<div>" + totalNavTWDay5.toFixed(1) + "</div>";
            } else if (location_id === "Red Rock Ldg-Mississippi") {
                // console.log("totalRedRockLdgDay4 = ", totalRedRockLdgDay4);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[4][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[3][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalRedRockLdgDay5 = totalRedRockLdgDay4 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day5 = "<div>" + totalRedRockLdgDay5.toFixed(1) + "</div>";
            } else if (location_id === "Grand Tower-Mississippi") {
                // console.log("totalGrandTowerDay4 = ", totalGrandTowerDay4);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[4][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[3][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalGrandTowerDay5 = totalGrandTowerDay4 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day5 = "<div>" + totalGrandTowerDay5.toFixed(1) + "</div>";
            } else if (location_id === "Moccasin Springs-Mississippi") {
                // console.log("totalMoccasinSpringsDay4 = ", totalMoccasinSpringsDay4);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[4][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[3][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalMoccasinSpringsDay5 = totalMoccasinSpringsDay4 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day5 = "<div>" + totalMoccasinSpringsDay5.toFixed(1) + "</div>";
            } else if (location_id === "LD 27 Pool-Mississippi") {
                // Process data
                // console.log("totalLD27PoolDay4: ", totalLD27PoolDay4);
                // console.log("convertedNetmissUpstreamData.values[4][1] = ", convertedNetmissUpstreamData.values[4][1]);
                // console.log("convertedNetmissUpstreamData.values[3][1] = ", convertedNetmissUpstreamData.values[3][1]);

                totalLD27PoolDay5 = parseFloat(totalLD27PoolDay4) + parseFloat(convertedNetmissUpstreamData.values[4][1]) - parseFloat(convertedNetmissUpstreamData.values[3][1]);
                day5 = "<div title='" + "--" + "'>" + (tsid_forecast_location === true ? "<strong>" + totalLD27PoolDay5.toFixed(1) : totalLD27PoolDay5.toFixed(1)) + "</div>";
            } else {
                if (convertedData !== null) {
                    day5 = "<div title='" + convertedData.values[4] + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (convertedData.values[4][1]).toFixed(1) + "</strong>" : (convertedData.values[4][1]).toFixed(1)) +
                        "</div>";
                } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                    let roundedValue = Math.round(BirdsPointForecastValue[4].value * 100) / 100; // Round to one decimal place
                    let roundedValueOnePlace = Math.round(roundedValue * 10) / 10;
                    day5 = "<div title='" + BirdsPointForecastValue[0].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + roundedValueOnePlace.toFixed(1) + "</strong>" : roundedValueOnePlace.toFixed(1)) +
                        "</div>";
                } else {
                    day5 = "<div>" + "-" + "</div>";
                }
            }
            day5Cell.innerHTML = day5;

            // DAY6
            const day6Cell = row.insertCell();
            let day6 = null;
            let totalGraysPtDay6 = null;
            let totalThebesDay6 = null;
            let totalCommerceDay6 = null;
            let totalPriceLdgDay6 = null;
            let totalThompsonLdgDay6 = null;
            let totalHerculaneumDay6 = null;
            let totalEngineersDepotDay6 = null;
            let totalNavTWDay6 = null;
            let totalRedRockLdgDay6 = null;
            let totalGrandTowerDay6 = null;
            let totalMoccasinSpringsDay6 = null;
            let totalLD27PoolDay6 = null;
            if (location_id === "Grays Pt-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][5].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][4].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalGraysPtDay6 = totalGraysPtDay5 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day6 = "<div>" + totalGraysPtDay6.toFixed(1) + "</div>";
            } else if (location_id === "Cairo-Ohio") {
                if (latest7AMRvfValue[5] !== null) {
                    day6 = "<div title='" + latest7AMRvfValue[5].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[5].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[5].value).toFixed(1)) +
                        "</div>";
                }
            } else if (location_id === "Thebes-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][5].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][4].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalThebesDay6 = totalThebesDay5 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day6 = "<div>" + totalThebesDay6.toFixed(1) + "</div>";
            } else if (location_id === "Commerce-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][5].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][4].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalCommerceDay6 = totalCommerceDay5 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day6 = "<div>" + totalCommerceDay6.toFixed(1) + "</div>";
            } else if (location_id === "Price Ldg-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][5].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][4].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalPriceLdgDay6 = totalPriceLdgDay5 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day6 = "<div>" + totalPriceLdgDay6.toFixed(1) + "</div>";
            } else if (location_id === "Thompson Ldg-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][5].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][4].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalThompsonLdgDay6 = totalThompsonLdgDay5 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day6 = "<div>" + totalThompsonLdgDay6.toFixed(1) + "</div>";
            } else if (location_id === "Herculaneum-Mississippi") {
                // console.log("totalHerculaneumDay5 = ", totalHerculaneumDay5);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[5][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[4][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalHerculaneumDay6 = totalHerculaneumDay5 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day6 = "<div>" + totalHerculaneumDay6.toFixed(1) + "</div>";
            } else if (location_id === "Engineers Depot-Mississippi") {
                // console.log("totalEngineersDepotDay5 = ", totalEngineersDepotDay5);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[5][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[4][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalEngineersDepotDay6 = totalEngineersDepotDay5 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day6 = "<div>" + totalEngineersDepotDay6.toFixed(1) + "</div>";
            } else if (location_id === "Nav TW-Kaskaskia") {
                // console.log("totalNavTWDay5 = ", totalNavTWDay5);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[5][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[4][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = 117.5;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalNavTWDay6 = totalNavTWDay5 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day6 = "<div>" + totalNavTWDay6.toFixed(1) + "</div>";
            } else if (location_id === "Red Rock Ldg-Mississippi") {
                // console.log("totalRedRockLdgDay5 = ", totalRedRockLdgDay5);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[5][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[4][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalRedRockLdgDay6 = totalRedRockLdgDay5 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day6 = "<div>" + totalRedRockLdgDay6.toFixed(1) + "</div>";
            } else if (location_id === "Grand Tower-Mississippi") {
                // console.log("totalGrandTowerDay5 = ", totalGrandTowerDay5);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[5][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[4][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalGrandTowerDay6 = totalGrandTowerDay5 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day6 = "<div>" + totalGrandTowerDay6.toFixed(1) + "</div>";
            } else if (location_id === "Moccasin Springs-Mississippi") {
                // console.log("totalMoccasinSpringsDay5 = ", totalMoccasinSpringsDay5);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[5][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[4][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalMoccasinSpringsDay6 = totalMoccasinSpringsDay5 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day6 = "<div>" + totalMoccasinSpringsDay6.toFixed(1) + "</div>";
            } else if (location_id === "LD 27 Pool-Mississippi") {
                // Process data
                // console.log("totalLD27PoolDay5: ", totalLD27PoolDay5);
                // console.log("convertedNetmissUpstreamData.values[4][1] = ", convertedNetmissUpstreamData.values[4][1]);
                // console.log("convertedNetmissUpstreamData.values[5][1] = ", convertedNetmissUpstreamData.values[5][1]);

                totalLD27PoolDay6 = parseFloat(totalLD27PoolDay5) + parseFloat(convertedNetmissUpstreamData.values[5][1]) - parseFloat(convertedNetmissUpstreamData.values[4][1]);
                day6 = "<div title='" + "--" + "'>" + (tsid_forecast_location === true ? "<strong>" + totalLD27PoolDay6.toFixed(1) : totalLD27PoolDay6.toFixed(1)) + "</div>";
            } else {
                if (convertedData !== null) {
                    day6 = "<div title='" + convertedData.values[5] + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (convertedData.values[5][1]).toFixed(1) + "</strong>" : (convertedData.values[5][1]).toFixed(1)) +
                        "</div>";
                } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                    let roundedValue = Math.round(BirdsPointForecastValue[5].value * 100) / 100; // Round to one decimal place
                    let roundedValueOnePlace = Math.round(roundedValue * 10) / 10;
                    day6 = "<div title='" + BirdsPointForecastValue[0].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + roundedValueOnePlace.toFixed(1) + "</strong>" : roundedValueOnePlace.toFixed(1)) +
                        "</div>";
                } else {
                    day6 = "<div>" + "-" + "</div>";
                }
            }
            day6Cell.innerHTML = day6;

            // DAY7
            const day7Cell = row.insertCell();
            let day7 = null;
            let totalGraysPtDay7 = null;
            let totalThebesDay7 = null;
            let totalCommerceDay7 = null;
            let totalPriceLdgDay7 = null;
            let totalThompsonLdgDay7 = null;
            let totalHerculaneumDay7 = null;
            let totalEngineersDepotDay7 = null;
            let totalNavTWDay7 = null;
            let totalRedRockLdgDay7 = null;
            let totalGrandTowerDay7 = null;
            let totalMoccasinSpringsDay7 = null;
            let totalLD27PoolDay7 = null;
            if (location_id === "Grays Pt-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[6][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][6].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][5].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalGraysPtDay7 = totalGraysPtDay6 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day7 = "<div>" + totalGraysPtDay7.toFixed(1) + "</div>";
            } else if (location_id === "LD 24 Pool-Mississippi" || location_id === "LD 24 TW-Mississippi" || location_id === "LD 25 Pool-Mississippi" || location_id === "LD 25 TW-Mississippi") {
                day7 = "<div>" + "-" + "</div>";
            } else if (location_id === "Cairo-Ohio") {
                if (latest7AMRvfValue[6] !== null) {
                    day7 = "<div title='" + latest7AMRvfValue[6].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (latest7AMRvfValue[6].value).toFixed(1) + "</strong>" : (latest7AMRvfValue[6].value).toFixed(1)) +
                        "</div>";
                }
            } else if (location_id === "Thebes-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[6][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][6].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][5].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalThebesDay7 = totalThebesDay6 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day7 = "<div>" + totalThebesDay7.toFixed(1) + "</div>";
            } else if (location_id === "Commerce-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[6][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][6].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][5].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalCommerceDay7 = totalCommerceDay6 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day7 = "<div>" + totalCommerceDay7.toFixed(1) + "</div>";
            } else if (location_id === "Price Ldg-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[6][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][6].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][5].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalPriceLdgDay7 = totalPriceLdgDay6 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day7 = "<div>" + totalPriceLdgDay7.toFixed(1) + "</div>";
            } else if (location_id === "Thompson Ldg-Mississippi") {
                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[6][1]);
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][6].value;
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = ForecastValues["Birds Point-Mississippi"][5].value;
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalThompsonLdgDay7 = totalThompsonLdgDay6 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day7 = "<div>" + totalThompsonLdgDay7.toFixed(1) + "</div>";
            } else if (location_id === "Herculaneum-Mississippi") {
                // console.log("totalHerculaneumDay6 = ", totalHerculaneumDay6);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[6][1]);6
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[6][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[5][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalHerculaneumDay7 = totalHerculaneumDay6 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day7 = "<div>" + totalHerculaneumDay7.toFixed(1) + "</div>";
            } else if (location_id === "Engineers Depot-Mississippi") {
                // console.log("totalEngineersDepotDay6 = ", totalEngineersDepotDay6);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[6][1]);6
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[6][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[5][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalEngineersDepotDay7 = totalEngineersDepotDay6 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day7 = "<div>" + totalEngineersDepotDay7.toFixed(1) + "</div>";
            } else if (location_id === "Nav TW-Kaskaskia") {
                // console.log("totalNavTWDay6 = ", totalNavTWDay6);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[6][1]);6
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[6][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[5][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = 117.5;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalNavTWDay7 = totalNavTWDay6 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day7 = "<div>" + totalNavTWDay7.toFixed(1) + "</div>";
            } else if (location_id === "Red Rock Ldg-Mississippi") {
                // console.log("totalRedRockLdgDay6 = ", totalRedRockLdgDay6);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[6][1]);6
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[6][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[5][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalRedRockLdgDay7 = totalRedRockLdgDay6 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day7 = "<div>" + totalRedRockLdgDay7.toFixed(1) + "</div>";
            } else if (location_id === "Grand Tower-Mississippi") {
                // console.log("totalGrandTowerDay6 = ", totalGrandTowerDay6);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[6][1]);6
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[6][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[5][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalGrandTowerDay7 = totalGrandTowerDay6 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day7 = "<div>" + totalGrandTowerDay7.toFixed(1) + "</div>";
            } else if (location_id === "Moccasin Springs-Mississippi") {
                // console.log("totalMoccasinSpringsDay6 = ", totalMoccasinSpringsDay6);

                const yesterdayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]);
                // console.log("yesterdayUpstreamNetmiss = ", yesterdayUpstreamNetmiss);

                const todayUpstreamNetmiss = parseFloat(convertedNetmissForecastingPointUpstreamData.values[6][1]);6
                // console.log("todayUpstreamNetmiss = ", todayUpstreamNetmiss);

                const todayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[6][1]);
                // console.log("todayDownstreamNetmiss = ", todayDownstreamNetmiss);

                const yesterdayDownstreamNetmiss = parseFloat(convertedNetmissForecastingPointDownstreamData.values[5][1]);
                // console.log("yesterdayDownstreamNetmiss = ", yesterdayDownstreamNetmiss);

                const riverMile = river_mile_hard_coded;
                const riverMileUpstream = netmiss_river_mile_hard_coded_upstream;
                const riverMileDownstream = netmiss_river_mile_hard_coded_downstream;
                // console.log("riverMile = ", riverMile);
                // console.log("riverMileUpstream = ", riverMileUpstream);
                // console.log("riverMileDownstream = ", riverMileDownstream);

                totalMoccasinSpringsDay7 = totalMoccasinSpringsDay6 + (((((todayUpstreamNetmiss - yesterdayUpstreamNetmiss) - (todayDownstreamNetmiss - yesterdayDownstreamNetmiss)) / (riverMileUpstream - riverMileDownstream)) * (riverMile - riverMileDownstream)) + (todayDownstreamNetmiss - yesterdayDownstreamNetmiss));

                day7 = "<div>" + totalMoccasinSpringsDay7.toFixed(1) + "</div>";
            } else if (location_id === "LD 27 Pool-Mississippi") {
                // Process data
                // console.log("totalLD27PoolDay6: ", totalLD27PoolDay6);
                // console.log("convertedNetmissUpstreamData.values[6][1] = ", convertedNetmissUpstreamData.values[6][1]);
                // console.log("convertedNetmissUpstreamData.values[5][1] = ", convertedNetmissUpstreamData.values[5][1]);

                totalLD27PoolDay7 = parseFloat(totalLD27PoolDay6) + parseFloat(convertedNetmissUpstreamData.values[6][1]) - parseFloat(convertedNetmissUpstreamData.values[5][1]);
                day7 = "<div title='" + "--" + "'>" + (tsid_forecast_location === true ? "<strong>" + totalLD27PoolDay7.toFixed(1) : totalLD27PoolDay7.toFixed(1)) + "</div>";
            } else {
                if (convertedData !== null && convertedData.values[6] !== null) {
                    day7 = "<div title='" + convertedData.values[6] + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + (convertedData.values[6][1]).toFixed(1) + "</strong>" : (convertedData.values[6][1]).toFixed(1)) +
                        "</div>";
                } else if (BirdsPointForecastValue !== null && location_id === "Birds Point-Mississippi") {
                    let roundedValue = Math.round(BirdsPointForecastValue[6].value * 100) / 100; // Round to one decimal place
                    let roundedValueOnePlace = Math.round(roundedValue * 10) / 10;
                    day7 = "<div title='" + BirdsPointForecastValue[0].value + "'>" +
                        (tsid_forecast_location === true ? "<strong>" + roundedValueOnePlace.toFixed(1) + "</strong>" : roundedValueOnePlace.toFixed(1)) +
                        "</div>";
                } else {
                    day7 = "<div>" + "-" + "</div>";
                }
            }
            day7Cell.innerHTML = day7;
        }
    });
}