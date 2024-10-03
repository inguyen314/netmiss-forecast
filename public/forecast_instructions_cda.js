// Store Birds Point Forcasts
let ForecastValues = {
};

// Store Grafton Forcasts
let GraftonForecast = {
};

const loadingIndicatorInstructions = document.getElementById('loading_forecast_instructions');
const tableContainerInstructions = document.getElementById('table_container_forecast_instructions');

document.addEventListener('DOMContentLoaded', function () {
    // Display the loading_alarm_mvs indicator
    loadingIndicatorInstructions.style.display = 'block';

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
                    filteredGages = gages.filter(gage => gage.netmiss_instructions === true);
                } else {
                    // Filter out gages where tsid_forecast_location is true
                    filteredGages = gages.filter(gage => gage.netmiss_instructions === true);
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
            createTableInstructionsLD24(jsonDataFiltered);
            createTableInstructionsLD25(jsonDataFiltered);
            createTableInstructionsLDMP(jsonDataFiltered);
            createTableInstructionsKASKYNAV(jsonDataFiltered);

            // Hide the loading indicator when it's no longer needed
            loadingIndicatorInstructions.style.display = 'none';
        })
        .catch(error => {
            // Log any errors that occur during fetching or parsing JSON
            console.error('Error fetching data:', error);
        })
        .finally(() => {
            // Hide the loading_alarm_mvs indicator regardless of success or failure
            loadingIndicatorInstructions.style.display = 'none';
        });
});


// ***********************************************************
// LD24
// ***********************************************************
function createTableInstructionsLD24(jsonDataFiltered) {
    // Create a table element
    const table = document.createElement('table');

    table.id = 'pool_instructions';

    // Create the first header row
    const headerRowTitle = document.createElement('tr');

    // Create table header for the first column with rowspan of 3
    const thLocation = document.createElement('th');
    thLocation.textContent = "Lock Dam 24";
    headerRowTitle.appendChild(thLocation);

    // Add the header row to the table (assuming you have a table element already)
    table.appendChild(headerRowTitle);

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
    var nws_dayMinus1_date_title = "";
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
    const columns2 = [nws_dayMinus1_date_title, nws_day0_date_title, nws_day1_date_title, nws_day2_date_title, nws_day3_date_title, nws_day4_date_title, nws_day5_date_title, nws_day6_date_title];
    columns2.forEach((columnName) => {
        const th = document.createElement('th');
        th.textContent = columnName;
        headerRowDate.appendChild(th);
    });

    // Append the third header row to the table
    table.appendChild(headerRowDate);

    // Append the table to the document or a specific container
    tableContainerInstructions.appendChild(table);
    

    // get netmiss data here
    (async () => {
        try {
            const currentDateTime = new Date();
            const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);

            // Get St Louis netmiss to set the date
            const dateObjectFirstForecastDayByDayAndMonth = await fetchFirstNetmissDay("St Louis-Mississippi.Stage.Inst.~1Day.0.netmiss-fcst", currentDateTime, currentDateTimePlus7Days, cda);
            // console.log("dateObjectFirstForecastDayByDayAndMonth: ", dateObjectFirstForecastDayByDayAndMonth);
            // console.log("dateObjectFirstForecastDayByDayAndMonth.date: ", dateObjectFirstForecastDayByDayAndMonth.date);
            // console.log("dateObjectFirstForecastDayByDayAndMonth.length: ", dateObjectFirstForecastDayByDayAndMonth.length);

            // Testing - Forced to output a table
            // populateTableCells(jsonDataFiltered, table, nws_day1_date);

            if (dateObjectFirstForecastDayByDayAndMonth.date > todaysDataOnly & dateObjectFirstForecastDayByDayAndMonth.length >= 7) {
                // console.log("dateObjectFirstForecastDayByDayAndMonth is after todaysDataOnly, output data table");

                // Display netmiss data here based on time
                if (current_hour < 0 || current_hour >= 10) {  // current_hour in 24-hour format
                    // Populate netmiss data here
                    populateTableCellsInstructionsLD24(jsonDataFiltered, table, nws_day1_date);
                } else {
                    const messageInstructions = document.createElement('h1');
                    messageInstructions.innerHTML = 'Error (Out of limit) or its just Thursdays (the day after long range forecast)';
                    // Set the background color to orange
                    messageInstructions.style.backgroundColor = 'orange';
                    messageInstructions.style.color = 'black'; // Text color
                    messageInstructions.style.padding = '10px'; // Padding around the text
                    messageInstructions.style.border = '2px solid black'; // Border around the element
                    messageInstructions.style.textAlign = 'center'; // Center align the text
                    messageInstructions.style.fontFamily = 'Arial, sans-serif'; // Set font family
                    messageInstructions.style.fontSize = '1.5em'; // Increase font size
                    if (tableContainerInstructions) {
                        tableContainerInstructions.appendChild(messageInstructions);
                    }
                }
            } else if (dateObjectFirstForecastDayByDayAndMonth < todaysDataOnly) {
                console.log("dateObjectFirstForecastDayByDayAndMonth is before todaysDataOnly");
                const messageInstructions = document.createElement('h1');
                messageInstructions.innerHTML = 'Contact Water Control Office for Forecast';
                // Set the background color to orange
                messageInstructions.style.backgroundColor = 'orange';
                messageInstructions.style.color = 'black'; // Text color
                messageInstructions.style.padding = '10px'; // Padding around the text
                messageInstructions.style.border = '2px solid black'; // Border around the element
                messageInstructions.style.textAlign = 'center'; // Center align the text
                messageInstructions.style.fontFamily = 'Arial, sans-serif'; // Set font family
                messageInstructions.style.fontSize = '1.5em'; // Increase font size
                if (tableContainerInstructions) {
                    tableContainerInstructions.appendChild(messageInstructions);
                }
            } else {
                console.log("dateObjectFirstForecastDayByDayAndMonth is the same as todaysDataOnly");
                const messageInstructions = document.createElement('h1');
                messageInstructions.innerHTML = 'Run the netmiss forecasts first';
                // Set the background color to yellow and add more styles for better appearance
                messageInstructions.style.backgroundColor = 'yellow';
                messageInstructions.style.color = 'black'; // Text color
                messageInstructions.style.padding = '10px'; // Padding around the text
                messageInstructions.style.border = '2px solid black'; // Border around the element
                messageInstructions.style.textAlign = 'center'; // Center align the text
                messageInstructions.style.fontFamily = 'Arial, sans-serif'; // Set font family
                messageInstructions.style.fontSize = '1.5em'; // Increase font size
                if (tableContainerInstructions) {
                    tableContainerInstructions.appendChild(messageInstructions);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    })();
}

async function populateTableCellsInstructionsLD24(jsonDataFiltered, table, nws_day1_date) {
    loadingIndicatorInstructions.style.display = 'block';
    let promises = [];
    jsonDataFiltered.forEach(location => {
        // Create a new row for each data object
        const row = table.insertRow();
        // console.log("Calling fetchData");

        // setup date time before calling function
        const currentDateTime = new Date();
        const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);
        const currentDateMinus30Hours = subtractHoursFromDate(currentDateTime, 30);
        const currentDateMinus18Hours = subtractHoursFromDate(currentDateTime, 18);
        const currentDateMinus48Hours = subtractHoursFromDate(currentDateTime, 48);

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
            , location.tsid_special_gage_1
            , location.tsid_special_gage_2
            , location.tsid_special_gage_3
            , location.tsid_netmiss_instructions
            , currentDateMinus18Hours
            , currentDateMinus48Hours
            , location.netmiss_instructions_support_gage1
        ))
    });
    Promise.all(promises).then(async (d) => {
        console.log("got all my ld24 instructions data!", d)
        // do all drawing my combined data
        await processAllDataInstructionsLD24(d);
    })
    loadingIndicatorInstructions.style.display = 'none';
}

async function processAllDataInstructionsLD24(data) {
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
        data23,
        data24,
        data25,
        data26,
        data27,
        totalGraftonForecastDay1,
        totalGraftonForecastDay2,
        totalGraftonForecastDay3,
        totalGraftonForecastDay4,
        totalGraftonForecastDay5,
        totalGraftonForecastDay6,
    }) => {
        // Ensure row exists and is a valid DOM element
        if (!row || !(row instanceof HTMLElement)) {
            console.error('Invalid row:', row);
            return;
        }



        // Starting Processing All Gages
        if (location_id === "LD 22 TW-Mississippi") {
            // console.log("data26: ", data26);
            // console.log("data27: ", data27);

            // PROCESS data26 - netmiss instructions forecast data
            const convertedDataInstructions = convertUTCtoCentralTime(data26);
            // console.log("convertedDataInstructions = ", convertedDataInstructions);

            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.innerHTML = location_id.split('-')[0] + " (Flow)";


            // DAY1
            const day1Cell = row.insertCell();
            day1Cell.innerHTML = location_id.split('-')[0];
            let day1 = null;
            // Process netmiss interpolation for each gage here
            day1 = "<div title='" + convertedDataInstructions.values[0] + "'>" + (convertedDataInstructions.values[0][1] / 1000).toFixed(1) + "</div>";
            day1Cell.innerHTML = day1;

            // DAY2
            const day2Cell = row.insertCell();
            day2Cell.innerHTML = location_id.split('-')[0];
            let day2 = null;
            // Process netmiss interpolation for each gage here
            day2 = "<div title='" + convertedDataInstructions.values[1] + "'>" + (convertedDataInstructions.values[1][1] / 1000).toFixed(0) + "</div>";
            day2Cell.innerHTML = day2;

            // DAY3
            const day3Cell = row.insertCell();
            day3Cell.innerHTML = location_id.split('-')[0];
            let day3 = null;
            // Process netmiss interpolation for each gage here
            day3 = "<div title='" + convertedDataInstructions.values[2] + "'>" + (convertedDataInstructions.values[2][1] / 1000).toFixed(0) + "</div>";
            day3Cell.innerHTML = day3;

            // DAY4
            const day4Cell = row.insertCell();
            day4Cell.innerHTML = location_id.split('-')[0];
            let day4 = null;
            // Process netmiss interpolation for each gage here
            day4 = "<div title='" + convertedDataInstructions.values[3] + "'>" + (convertedDataInstructions.values[3][1] / 1000).toFixed(0) + "</div>";
            day4Cell.innerHTML = day4;

            // DAY5
            const day5Cell = row.insertCell();
            let day5 = null;
            // Process netmiss interpolation for each gage here
            day5 = "<div title='" + convertedDataInstructions.values[4] + "'>" + (convertedDataInstructions.values[4][1] / 1000).toFixed(0) + "</div>";
            day5Cell.innerHTML = day5;

            // DAY6
            const day6Cell = row.insertCell();
            let day6 = null;
            // Process netmiss interpolation for each gage here
            day6 = "<div title='" + convertedDataInstructions.values[5] + "'>" + (convertedDataInstructions.values[5][1] / 1000).toFixed(0) + "</div>";
            day6Cell.innerHTML = day6;

            // DAY7
            const day7Cell = row.insertCell();
            let day7 = null;
            // Process netmiss interpolation for each gage here
            day7 = "<div title='" + convertedDataInstructions.values[6] + "'>" + (convertedDataInstructions.values[6][1] / 1000).toFixed(0) + "</div>";
            day7Cell.innerHTML = day7;
        }
        if (location_id === "Mark Twain Lk-Salt") {
            // console.log("data27: ", data27);

            // PROCESS data26 - netmiss instructions forecast data
            const convertedDataInstructionsSaltDailyAvg = convertUTCtoCentralTime(data27);
            // console.log("convertedDataInstructionsSaltDailyAvg = ", convertedDataInstructionsSaltDailyAvg);

            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.innerHTML = "Salt Daily Avg (kcfs)";

            // DAY1
            const day1Cell = row.insertCell();
            day1Cell.innerHTML = location_id.split('-')[0];
            let day1 = null;
            // Process netmiss interpolation for each gage here
            day1 = "<div title='" + convertedDataInstructionsSaltDailyAvg.name + convertedDataInstructionsSaltDailyAvg.values[0] + "'>" + (convertedDataInstructionsSaltDailyAvg.values[0][1] / 1000).toFixed(0) + "</div>";
            day1Cell.innerHTML = day1;

            // DAY2
            const day2Cell = row.insertCell();
            day2Cell.innerHTML = location_id.split('-')[0];
            let day2 = null;
            // Process netmiss interpolation for each gage here
            day2 = "<div title='" + convertedDataInstructionsSaltDailyAvg.name + convertedDataInstructionsSaltDailyAvg.values[1] + "'>" + (convertedDataInstructionsSaltDailyAvg.values[1][1] / 1000).toFixed(0) + "</div>";
            day2Cell.innerHTML = day2;
        }
        // if (location_id === "LD 24 Pool-Mississippi") {
        //     // Retrieve today's netmiss forecast value
        //     let todayNetmissForecast = convertedData.values[0][1];

        //     // OBSERVED 6AM
        //     const level6AmCell = row.insertCell();
        //     level6AmCell.innerHTML = "Pool Instructions";

        //     // DAY1
        //     const day1Cell = row.insertCell();
        //     day1Cell.innerHTML = location_id.split('-')[0];
        //     let day1 = null;
        //     // Process netmiss interpolation for each gage here
        //     day1 = "<div>" + "<b>" + todayNetmissForecast.toFixed(1) + " (+/-0.1)" + "</b>" + "</div>";
        //     day1Cell.innerHTML = day1;
        // }
    });
}


// ***********************************************************
// LD25
// ***********************************************************
function createTableInstructionsLD25(jsonDataFiltered) {
    // Create a table element
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '25px';
    // table.setAttribute('id', 'forecast'); // Set the id to "gage_data"

    // Create the first header row
    const headerRowTitle = document.createElement('tr');

    // Create table header for the first column with rowspan of 3
    const thLocation = document.createElement('th');
    thLocation.textContent = "Lock Dam 25";
    thLocation.rowSpan = 1;
    thLocation.style.height = '25px';
    thLocation.style.backgroundColor = 'darkblue';
    thLocation.style.color = 'white'; // Set the text color to white
    thLocation.style.border = '1px solid gray'; // Add border
    thLocation.style.width = '20%';
    headerRowTitle.appendChild(thLocation);

    // Add the header row to the table (assuming you have a table element already)
    table.appendChild(headerRowTitle);

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
    var nws_dayMinus1_date_title = "";
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
    const columns2 = [nws_dayMinus1_date_title, nws_day0_date_title, nws_day1_date_title, nws_day2_date_title, nws_day3_date_title, nws_day4_date_title, nws_day5_date_title, nws_day6_date_title];
    columns2.forEach((columnName) => {
        const th = document.createElement('th');
        th.textContent = columnName;
        th.style.height = '25px';
        th.style.backgroundColor = 'darkblue';
        th.style.color = 'white'; // Set the text color to white
        th.style.border = '1px solid gray'; // Add border
        headerRowDate.appendChild(th);
    });

    // Append the third header row to the table
    table.appendChild(headerRowDate);

    // Append the table to the document or a specific container
    if (tableContainerInstructions) {
        tableContainerInstructions.appendChild(table);
    }

    // get netmiss data here
    (async () => {
        try {
            const currentDateTime = new Date();
            const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);

            // Get St Louis netmiss to set the date
            const dateObjectFirstForecastDayByDayAndMonth = await fetchFirstNetmissDay("St Louis-Mississippi.Stage.Inst.~1Day.0.netmiss-fcst", currentDateTime, currentDateTimePlus7Days, cda);
            // console.log("dateObjectFirstForecastDayByDayAndMonth: ", dateObjectFirstForecastDayByDayAndMonth);
            // console.log("dateObjectFirstForecastDayByDayAndMonth.date: ", dateObjectFirstForecastDayByDayAndMonth.date);
            // console.log("dateObjectFirstForecastDayByDayAndMonth.length: ", dateObjectFirstForecastDayByDayAndMonth.length);

            // Testing - Forced to output a table
            // populateTableCells(jsonDataFiltered, table, nws_day1_date);

            if (dateObjectFirstForecastDayByDayAndMonth.date > todaysDataOnly & dateObjectFirstForecastDayByDayAndMonth.length >= 7) {
                // console.log("dateObjectFirstForecastDayByDayAndMonth is after todaysDataOnly, output data table");

                // Display netmiss data here based on time
                if (current_hour < 0 || current_hour >= 10) {  // current_hour in 24-hour format
                    // Populate netmiss data here
                    populateTableCellsInstructionsLD25(jsonDataFiltered, table, nws_day1_date);
                } else {
                    const messageInstructions = document.createElement('h1');
                    messageInstructions.innerHTML = 'Error (Out of limit) or its just Thursdays (the day after long range forecast)';
                    // Set the background color to orange
                    messageInstructions.style.backgroundColor = 'orange';
                    messageInstructions.style.color = 'black'; // Text color
                    messageInstructions.style.padding = '10px'; // Padding around the text
                    messageInstructions.style.border = '2px solid black'; // Border around the element
                    messageInstructions.style.textAlign = 'center'; // Center align the text
                    messageInstructions.style.fontFamily = 'Arial, sans-serif'; // Set font family
                    messageInstructions.style.fontSize = '1.5em'; // Increase font size
                    if (tableContainerInstructions) {
                        tableContainerInstructions.appendChild(messageInstructions);
                    }
                }
            } else if (dateObjectFirstForecastDayByDayAndMonth < todaysDataOnly) {
                console.log("dateObjectFirstForecastDayByDayAndMonth is before todaysDataOnly");
                const messageInstructions = document.createElement('h1');
                messageInstructions.innerHTML = 'Contact Water Control Office for Forecast';
                // Set the background color to orange
                messageInstructions.style.backgroundColor = 'orange';
                messageInstructions.style.color = 'black'; // Text color
                messageInstructions.style.padding = '10px'; // Padding around the text
                messageInstructions.style.border = '2px solid black'; // Border around the element
                messageInstructions.style.textAlign = 'center'; // Center align the text
                messageInstructions.style.fontFamily = 'Arial, sans-serif'; // Set font family
                messageInstructions.style.fontSize = '1.5em'; // Increase font size
                if (tableContainerInstructions) {
                    tableContainerInstructions.appendChild(messageInstructions);
                }
            } else {
                console.log("dateObjectFirstForecastDayByDayAndMonth is the same as todaysDataOnly");
                const messageInstructions = document.createElement('h1');
                messageInstructions.innerHTML = 'Run the netmiss forecasts first';
                // Set the background color to yellow and add more styles for better appearance
                messageInstructions.style.backgroundColor = 'yellow';
                messageInstructions.style.color = 'black'; // Text color
                messageInstructions.style.padding = '10px'; // Padding around the text
                messageInstructions.style.border = '2px solid black'; // Border around the element
                messageInstructions.style.textAlign = 'center'; // Center align the text
                messageInstructions.style.fontFamily = 'Arial, sans-serif'; // Set font family
                messageInstructions.style.fontSize = '1.5em'; // Increase font size
                if (tableContainerInstructions) {
                    tableContainerInstructions.appendChild(messageInstructions);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    })();
}

async function populateTableCellsInstructionsLD25(jsonDataFiltered, table, nws_day1_date) {
    loadingIndicatorInstructions.style.display = 'block';
    let promises = [];
    jsonDataFiltered.forEach(location => {
        // Create a new row for each data object
        const row = table.insertRow();
        // console.log("Calling fetchData");

        // setup date time before calling function
        const currentDateTime = new Date();
        const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);
        const currentDateMinus30Hours = subtractHoursFromDate(currentDateTime, 30);
        const currentDateMinus18Hours = subtractHoursFromDate(currentDateTime, 18);
        const currentDateMinus48Hours = subtractHoursFromDate(currentDateTime, 48);

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
            , location.tsid_special_gage_1
            , location.tsid_special_gage_2
            , location.tsid_special_gage_3
            , location.tsid_netmiss_instructions
            , currentDateMinus18Hours
            , currentDateMinus48Hours
            , location.netmiss_instructions_support_gage1
        ))
    });
    Promise.all(promises).then(async (d) => {
        console.log("got all my ld25 instructions data!", d)
        // do all drawing my combined data
        await processAllDataInstructionsLD25(d);
    })
    loadingIndicatorInstructions.style.display = 'none';
}

async function processAllDataInstructionsLD25(data) {
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
        data23,
        data24,
        data25,
        data26,
        data27,
        totalGraftonForecastDay1,
        totalGraftonForecastDay2,
        totalGraftonForecastDay3,
        totalGraftonForecastDay4,
        totalGraftonForecastDay5,
        totalGraftonForecastDay6,
    }) => {
        // Ensure row exists and is a valid DOM element
        if (!row || !(row instanceof HTMLElement)) {
            console.error('Invalid row:', row);
            return;
        }

        // console.log("location_id: ", location_id);
        // console.log("convertedData: ", convertedData);
        // console.log("convertedNetmissUpstreamData: ", convertedNetmissUpstreamData);
        // console.log("latest6AMValue: ", latest6AMValue);
        // console.log("tsid: ", tsid);
        // console.log("convertedNetmissDownstreamData: ", convertedNetmissDownstreamData);
        // console.log("convertedNetmissForecastingPointUpstreamData: ", convertedNetmissForecastingPointUpstreamData);
        // console.log("convertedNetmissForecastingPointDownstreamData: ", convertedNetmissForecastingPointDownstreamData);
        // console.log("tsid_forecast_location: ", tsid_forecast_location);
        // console.log("river_mile_hard_coded: ", river_mile_hard_coded);
        // console.log("netmiss_river_mile_hard_coded_upstream: ", netmiss_river_mile_hard_coded_upstream);
        // console.log("netmiss_river_mile_hard_coded_downstream: ", netmiss_river_mile_hard_coded_downstream);
        // console.log("isNetmissForecastArrayLengthGreaterThanSeven: ", isNetmissForecastArrayLengthGreaterThanSeven);
        // console.log("isRvfArrayLengthGreaterThanSeven: ", isRvfArrayLengthGreaterThanSeven);
        // console.log("isCairoRvfForecastValuesGreaterThanSeven: ", isCairoRvfForecastValuesGreaterThanSeven);
        // console.log("BirdsPointForecastValue: ", BirdsPointForecastValue);
        // console.log("latest7AMRvfValue: ", latest7AMRvfValue);
        // console.log("data23: ", data23);
        // console.log("data24: ", data24);
        // console.log("data25: ", data25);
        // console.log("data26: ", data26);
        // console.log("data27: ", data27);

        // Starting Processing All Gages
        if (location_id === "LD 25 Pool-Mississippi") {
            // Retrieve today's netmiss forecast value
            let todayNetmissForecast = convertedData.values[0][1];
            // console.log("todayNetmissForecast: ", todayNetmissForecast);

            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.style.textAlign = 'center';
            level6AmCell.style.border = '1px solid gray'; // Add border
            level6AmCell.innerHTML = "Pool Instructions";

            // DAY1
            const day1Cell = row.insertCell();
            day1Cell.style.textAlign = 'center';
            day1Cell.style.border = '1px solid gray'; // Add border
            day1Cell.innerHTML = location_id.split('-')[0];
            let day1 = null;
            // Process netmiss interpolation for each gage here
            day1 = "<div>" + "<b>" + todayNetmissForecast.toFixed(1) + " (+/-0.1)" + "</b>" + "</div>";
            day1Cell.innerHTML = day1;
        }
    });
}

// ***********************************************************
// LDMP
// ***********************************************************
function createTableInstructionsLDMP(jsonDataFiltered) {
    // Create a table element
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '25px';
    // table.setAttribute('id', 'forecast'); // Set the id to "gage_data"

    // Create the first header row
    const headerRowTitle = document.createElement('tr');

    // Create table header for the first column with rowspan of 3
    const thLocation = document.createElement('th');
    thLocation.textContent = "Mel Price Lock Dam";
    thLocation.rowSpan = 1;
    thLocation.style.height = '25px';
    thLocation.style.backgroundColor = 'darkblue';
    thLocation.style.color = 'white'; // Set the text color to white
    thLocation.style.border = '1px solid gray'; // Add border
    thLocation.style.width = '20%';
    headerRowTitle.appendChild(thLocation);

    // Add the header row to the table (assuming you have a table element already)
    table.appendChild(headerRowTitle);

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
    var nws_dayMinus1_date_title = "";
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
    const columns2 = [nws_dayMinus1_date_title, nws_day0_date_title, nws_day1_date_title, nws_day2_date_title, nws_day3_date_title, nws_day4_date_title, nws_day5_date_title, nws_day6_date_title];
    columns2.forEach((columnName) => {
        const th = document.createElement('th');
        th.textContent = columnName;
        th.style.height = '25px';
        th.style.backgroundColor = 'darkblue';
        th.style.color = 'white'; // Set the text color to white
        th.style.border = '1px solid gray'; // Add border
        headerRowDate.appendChild(th);
    });

    // Append the third header row to the table
    table.appendChild(headerRowDate);

    // Append the table to the document or a specific container
    if (tableContainerInstructions) {
        tableContainerInstructions.appendChild(table);
    }

    // get netmiss data here
    (async () => {
        try {
            const currentDateTime = new Date();
            const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);

            // Get St Louis netmiss to set the date
            const dateObjectFirstForecastDayByDayAndMonth = await fetchFirstNetmissDay("St Louis-Mississippi.Stage.Inst.~1Day.0.netmiss-fcst", currentDateTime, currentDateTimePlus7Days, cda);
            // console.log("dateObjectFirstForecastDayByDayAndMonth: ", dateObjectFirstForecastDayByDayAndMonth);
            // console.log("dateObjectFirstForecastDayByDayAndMonth.date: ", dateObjectFirstForecastDayByDayAndMonth.date);
            // console.log("dateObjectFirstForecastDayByDayAndMonth.length: ", dateObjectFirstForecastDayByDayAndMonth.length);

            // Testing - Forced to output a table
            // populateTableCells(jsonDataFiltered, table, nws_day1_date);

            if (dateObjectFirstForecastDayByDayAndMonth.date > todaysDataOnly & dateObjectFirstForecastDayByDayAndMonth.length >= 7) {
                // console.log("dateObjectFirstForecastDayByDayAndMonth is after todaysDataOnly, output data table");

                // Display netmiss data here based on time
                if (current_hour < 0 || current_hour >= 10) {  // current_hour in 24-hour format
                    // Populate netmiss data here
                    populateTableCellsInstructionsLDMP(jsonDataFiltered, table, nws_day1_date);
                } else {
                    const messageInstructions = document.createElement('h1');
                    messageInstructions.innerHTML = 'Error (Out of limit) or its just Thursdays (the day after long range forecast)';
                    // Set the background color to orange
                    messageInstructions.style.backgroundColor = 'orange';
                    messageInstructions.style.color = 'black'; // Text color
                    messageInstructions.style.padding = '10px'; // Padding around the text
                    messageInstructions.style.border = '2px solid black'; // Border around the element
                    messageInstructions.style.textAlign = 'center'; // Center align the text
                    messageInstructions.style.fontFamily = 'Arial, sans-serif'; // Set font family
                    messageInstructions.style.fontSize = '1.5em'; // Increase font size
                    if (tableContainerInstructions) {
                        tableContainerInstructions.appendChild(messageInstructions);
                    }
                }
            } else if (dateObjectFirstForecastDayByDayAndMonth < todaysDataOnly) {
                console.log("dateObjectFirstForecastDayByDayAndMonth is before todaysDataOnly");
                const messageInstructions = document.createElement('h1');
                messageInstructions.innerHTML = 'Contact Water Control Office for Forecast';
                // Set the background color to orange
                messageInstructions.style.backgroundColor = 'orange';
                messageInstructions.style.color = 'black'; // Text color
                messageInstructions.style.padding = '10px'; // Padding around the text
                messageInstructions.style.border = '2px solid black'; // Border around the element
                messageInstructions.style.textAlign = 'center'; // Center align the text
                messageInstructions.style.fontFamily = 'Arial, sans-serif'; // Set font family
                messageInstructions.style.fontSize = '1.5em'; // Increase font size
                if (tableContainerInstructions) {
                    tableContainerInstructions.appendChild(messageInstructions);
                }
            } else {
                console.log("dateObjectFirstForecastDayByDayAndMonth is the same as todaysDataOnly");
                const messageInstructions = document.createElement('h1');
                messageInstructions.innerHTML = 'Run the netmiss forecasts first';
                // Set the background color to yellow and add more styles for better appearance
                messageInstructions.style.backgroundColor = 'yellow';
                messageInstructions.style.color = 'black'; // Text color
                messageInstructions.style.padding = '10px'; // Padding around the text
                messageInstructions.style.border = '2px solid black'; // Border around the element
                messageInstructions.style.textAlign = 'center'; // Center align the text
                messageInstructions.style.fontFamily = 'Arial, sans-serif'; // Set font family
                messageInstructions.style.fontSize = '1.5em'; // Increase font size
                if (tableContainerInstructions) {
                    tableContainerInstructions.appendChild(messageInstructions);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    })();
}

async function populateTableCellsInstructionsLDMP(jsonDataFiltered, table, nws_day1_date) {
    loadingIndicatorInstructions.style.display = 'block';
    let promises = [];
    jsonDataFiltered.forEach(location => {
        // Create a new row for each data object
        const row = table.insertRow();
        // console.log("Calling fetchData");

        // setup date time before calling function
        const currentDateTime = new Date();
        const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);
        const currentDateMinus30Hours = subtractHoursFromDate(currentDateTime, 30);
        const currentDateMinus18Hours = subtractHoursFromDate(currentDateTime, 18);
        const currentDateMinus48Hours = subtractHoursFromDate(currentDateTime, 48);

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
            , location.tsid_special_gage_1
            , location.tsid_special_gage_2
            , location.tsid_special_gage_3
            , location.tsid_netmiss_instructions
            , currentDateMinus18Hours
            , currentDateMinus48Hours
            , location.netmiss_instructions_support_gage1
        ))
    });
    Promise.all(promises).then(async (d) => {
        console.log("got all my ld mp instructions data!", d)
        // do all drawing my combined data
        await processAllDataInstructionsLDMP(d);
    })
    loadingIndicatorInstructions.style.display = 'none';
}

async function processAllDataInstructionsLDMP(data) {
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
        data23,
        data24,
        data25,
        data26,
        data27,
        totalGraftonForecastDay1,
        totalGraftonForecastDay2,
        totalGraftonForecastDay3,
        totalGraftonForecastDay4,
        totalGraftonForecastDay5,
        totalGraftonForecastDay6,
    }) => {
        // Ensure row exists and is a valid DOM element
        if (!row || !(row instanceof HTMLElement)) {
            console.error('Invalid row:', row);
            return;
        }

        // console.log("location_id: ", location_id);
        // console.log("convertedData: ", convertedData);
        // console.log("convertedNetmissUpstreamData: ", convertedNetmissUpstreamData);
        // console.log("latest6AMValue: ", latest6AMValue);
        // console.log("tsid: ", tsid);
        // console.log("convertedNetmissDownstreamData: ", convertedNetmissDownstreamData);
        // console.log("convertedNetmissForecastingPointUpstreamData: ", convertedNetmissForecastingPointUpstreamData);
        // console.log("convertedNetmissForecastingPointDownstreamData: ", convertedNetmissForecastingPointDownstreamData);
        // console.log("tsid_forecast_location: ", tsid_forecast_location);
        // console.log("river_mile_hard_coded: ", river_mile_hard_coded);
        // console.log("netmiss_river_mile_hard_coded_upstream: ", netmiss_river_mile_hard_coded_upstream);
        // console.log("netmiss_river_mile_hard_coded_downstream: ", netmiss_river_mile_hard_coded_downstream);
        // console.log("isNetmissForecastArrayLengthGreaterThanSeven: ", isNetmissForecastArrayLengthGreaterThanSeven);
        // console.log("isRvfArrayLengthGreaterThanSeven: ", isRvfArrayLengthGreaterThanSeven);
        // console.log("isCairoRvfForecastValuesGreaterThanSeven: ", isCairoRvfForecastValuesGreaterThanSeven);
        // console.log("BirdsPointForecastValue: ", BirdsPointForecastValue);
        // console.log("latest7AMRvfValue: ", latest7AMRvfValue);
        // console.log("data23: ", data23);
        // console.log("data24: ", data24);
        // console.log("data25: ", data25);
        // console.log("data26: ", data26);
        // console.log("data27: ", data27);

        // Starting Processing All Gages
        if (location_id === "Grafton-Mississippi") {
            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.style.textAlign = 'center';
            level6AmCell.style.border = '1px solid gray'; // Add border
            level6AmCell.innerHTML = location_id.split('-')[0] + " (06:00)";

            // DAY1
            const day1Cell = row.insertCell();
            day1Cell.style.textAlign = 'center';
            day1Cell.style.border = '1px solid gray'; // Add border
            let day1 = null;
            // Process netmiss interpolation for each gage here
            day1 = "<div title='" + latest6AMValue + "'>" + (latest6AMValue.value).toFixed(2) + "</div>";
            day1Cell.innerHTML = day1;
        }
        if (location_id === "St Louis-Mississippi") {
            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.style.textAlign = 'center';
            level6AmCell.style.border = '1px solid gray'; // Add border
            level6AmCell.innerHTML = location_id.split('-')[0] + " (06:00)";

            // DAY1
            const day1Cell = row.insertCell();
            day1Cell.style.textAlign = 'center';
            day1Cell.style.border = '1px solid gray'; // Add border
            let day1 = null;
            // Process netmiss interpolation for each gage here
            day1 = "<div title='" + latest6AMValue + "'>" + (latest6AMValue.value).toFixed(2) + "</div>";
            day1Cell.innerHTML = day1;
        }
        if (location_id === "Mel Price Pool-Mississippi") {
            // Retrieve today's netmiss forecast value
            let todayNetmissForecast = convertedData.values[0][1];
            // console.log("todayNetmissForecast: ", todayNetmissForecast);

            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.style.textAlign = 'center';
            level6AmCell.style.border = '1px solid gray'; // Add border
            level6AmCell.innerHTML = "Pool Instructions";

            // DAY1
            const day1Cell = row.insertCell();
            day1Cell.style.textAlign = 'center';
            day1Cell.style.border = '1px solid gray'; // Add border
            day1Cell.innerHTML = location_id.split('-')[0];
            let day1 = null;
            // Process netmiss interpolation for each gage here
            day1 = "<div>" + "<b>" + todayNetmissForecast.toFixed(1) + " (+/-0.1)" + "</b>" + "</div>";
            day1Cell.innerHTML = day1;
        }
    });
}


// ***********************************************************
// LDKASKY
// ***********************************************************
function createTableInstructionsKASKYNAV(jsonDataFiltered) {
    // Create a table element
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '25px';
    // table.setAttribute('id', 'forecast'); // Set the id to "gage_data"

    // Create the first header row
    const headerRowTitle = document.createElement('tr');

    // Create table header for the first column with rowspan of 3
    const thLocation = document.createElement('th');
    thLocation.textContent = "Kaskaskia Nav";
    thLocation.rowSpan = 1;
    thLocation.style.height = '25px';
    thLocation.style.backgroundColor = 'darkblue';
    thLocation.style.color = 'white'; // Set the text color to white
    thLocation.style.border = '1px solid gray'; // Add border
    thLocation.style.width = '20%';
    headerRowTitle.appendChild(thLocation);

    // Add the header row to the table (assuming you have a table element already)
    table.appendChild(headerRowTitle);

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
    var nws_dayMinus1_date_title = "";
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
    const columns2 = [nws_dayMinus1_date_title, nws_day0_date_title, nws_day1_date_title, nws_day2_date_title, nws_day3_date_title, nws_day4_date_title, nws_day5_date_title, nws_day6_date_title];
    columns2.forEach((columnName) => {
        const th = document.createElement('th');
        th.textContent = columnName;
        th.style.height = '25px';
        th.style.backgroundColor = 'darkblue';
        th.style.color = 'white'; // Set the text color to white
        th.style.border = '1px solid gray'; // Add border
        headerRowDate.appendChild(th);
    });

    // Append the third header row to the table
    table.appendChild(headerRowDate);

    // Append the table to the document or a specific container
    if (tableContainerInstructions) {
        tableContainerInstructions.appendChild(table);
    }

    // get netmiss data here
    (async () => {
        try {
            const currentDateTime = new Date();
            const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);

            // Get St Louis netmiss to set the date
            const dateObjectFirstForecastDayByDayAndMonth = await fetchFirstNetmissDay("St Louis-Mississippi.Stage.Inst.~1Day.0.netmiss-fcst", currentDateTime, currentDateTimePlus7Days, cda);
            // console.log("dateObjectFirstForecastDayByDayAndMonth: ", dateObjectFirstForecastDayByDayAndMonth);
            // console.log("dateObjectFirstForecastDayByDayAndMonth.date: ", dateObjectFirstForecastDayByDayAndMonth.date);
            // console.log("dateObjectFirstForecastDayByDayAndMonth.length: ", dateObjectFirstForecastDayByDayAndMonth.length);

            // Testing - Forced to output a table
            // populateTableCells(jsonDataFiltered, table, nws_day1_date);

            if (dateObjectFirstForecastDayByDayAndMonth.date > todaysDataOnly & dateObjectFirstForecastDayByDayAndMonth.length >= 7) {
                // console.log("dateObjectFirstForecastDayByDayAndMonth is after todaysDataOnly, output data table");

                // Display netmiss data here based on time
                if (current_hour < 0 || current_hour >= 10) {  // current_hour in 24-hour format
                    // Populate netmiss data here
                    populateTableCellsInstructionsKASKYNAV(jsonDataFiltered, table, nws_day1_date);
                } else {
                    const messageInstructions = document.createElement('h1');
                    messageInstructions.innerHTML = 'Error (Out of limit) or its just Thursdays (the day after long range forecast)';
                    // Set the background color to orange
                    messageInstructions.style.backgroundColor = 'orange';
                    messageInstructions.style.color = 'black'; // Text color
                    messageInstructions.style.padding = '10px'; // Padding around the text
                    messageInstructions.style.border = '2px solid black'; // Border around the element
                    messageInstructions.style.textAlign = 'center'; // Center align the text
                    messageInstructions.style.fontFamily = 'Arial, sans-serif'; // Set font family
                    messageInstructions.style.fontSize = '1.5em'; // Increase font size
                    if (tableContainerInstructions) {
                        tableContainerInstructions.appendChild(messageInstructions);
                    }
                }
            } else if (dateObjectFirstForecastDayByDayAndMonth < todaysDataOnly) {
                console.log("dateObjectFirstForecastDayByDayAndMonth is before todaysDataOnly");
                const messageInstructions = document.createElement('h1');
                messageInstructions.innerHTML = 'Contact Water Control Office for Forecast';
                // Set the background color to orange
                messageInstructions.style.backgroundColor = 'orange';
                messageInstructions.style.color = 'black'; // Text color
                messageInstructions.style.padding = '10px'; // Padding around the text
                messageInstructions.style.border = '2px solid black'; // Border around the element
                messageInstructions.style.textAlign = 'center'; // Center align the text
                messageInstructions.style.fontFamily = 'Arial, sans-serif'; // Set font family
                messageInstructions.style.fontSize = '1.5em'; // Increase font size
                if (tableContainerInstructions) {
                    tableContainerInstructions.appendChild(messageInstructions);
                }
            } else {
                console.log("dateObjectFirstForecastDayByDayAndMonth is the same as todaysDataOnly");
                const messageInstructions = document.createElement('h1');
                messageInstructions.innerHTML = 'Run the netmiss forecasts first';
                // Set the background color to yellow and add more styles for better appearance
                messageInstructions.style.backgroundColor = 'yellow';
                messageInstructions.style.color = 'black'; // Text color
                messageInstructions.style.padding = '10px'; // Padding around the text
                messageInstructions.style.border = '2px solid black'; // Border around the element
                messageInstructions.style.textAlign = 'center'; // Center align the text
                messageInstructions.style.fontFamily = 'Arial, sans-serif'; // Set font family
                messageInstructions.style.fontSize = '1.5em'; // Increase font size
                if (tableContainerInstructions) {
                    tableContainerInstructions.appendChild(messageInstructions);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    })();
}

async function populateTableCellsInstructionsKASKYNAV(jsonDataFiltered, table, nws_day1_date) {
    loadingIndicatorInstructions.style.display = 'block';
    let promises = [];
    jsonDataFiltered.forEach(location => {
        // Create a new row for each data object
        const row = table.insertRow();
        // console.log("Calling fetchData");

        // setup date time before calling function
        const currentDateTime = new Date();
        const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);
        const currentDateMinus30Hours = subtractHoursFromDate(currentDateTime, 30);
        const currentDateMinus18Hours = subtractHoursFromDate(currentDateTime, 18);
        const currentDateMinus48Hours = subtractHoursFromDate(currentDateTime, 48);

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
            , location.tsid_special_gage_1
            , location.tsid_special_gage_2
            , location.tsid_special_gage_3
            , location.tsid_netmiss_instructions
            , currentDateMinus18Hours
            , currentDateMinus48Hours
            , location.netmiss_instructions_support_gage1
        ))
    });
    Promise.all(promises).then(async (d) => {
        console.log("got all my nav pool instructions data!", d)
        // do all drawing my combined data
        await processAllDataInstructionsKASKYNAV(d);
    })
    loadingIndicatorInstructions.style.display = 'none';
}

async function processAllDataInstructionsKASKYNAV(data) {
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
        data23,
        data24,
        data25,
        data26,
        data27,
        totalGraftonForecastDay1,
        totalGraftonForecastDay2,
        totalGraftonForecastDay3,
        totalGraftonForecastDay4,
        totalGraftonForecastDay5,
        totalGraftonForecastDay6,
    }) => {
        // Ensure row exists and is a valid DOM element
        if (!row || !(row instanceof HTMLElement)) {
            console.error('Invalid row:', row);
            return;
        }

        // Starting Processing All Gages
        if (location_id === "Red Bud-Kaskaskia") {
            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.style.textAlign = 'center';
            level6AmCell.style.border = '1px solid gray'; // Add border
            level6AmCell.innerHTML = location_id.split('-')[0] + " (06:00)";

            // DAY1
            const day1Cell = row.insertCell();
            day1Cell.style.textAlign = 'center';
            day1Cell.style.border = '1px solid gray'; // Add border
            let day1 = null;
            // Process netmiss interpolation for each gage here
            day1 = "<div title='" + latest6AMValue + "'>" + (latest6AMValue.value).toFixed(2) + "</div>";
            day1Cell.innerHTML = day1;
        }
        if (location_id === "Fayetteville-Kaskaskia") {
            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.style.textAlign = 'center';
            level6AmCell.style.border = '1px solid gray'; // Add border
            level6AmCell.innerHTML = location_id.split('-')[0] + " (06:00)";

            // DAY1
            const day1Cell = row.insertCell();
            day1Cell.style.textAlign = 'center';
            day1Cell.style.border = '1px solid gray'; // Add border
            let day1 = null;
            // Process netmiss interpolation for each gage here
            day1 = "<div title='" + latest6AMValue + "'>" + (latest6AMValue.value).toFixed(2) + "</div>";
            day1Cell.innerHTML = day1;
        }
        if (location_id === "Nav Pool-Kaskaskia") {
            // Retrieve today's netmiss forecast value
            let todayNetmissForecast = convertedData.values[0][1];
            // console.log("todayNetmissForecast: ", todayNetmissForecast);

            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.style.textAlign = 'center';
            level6AmCell.style.border = '1px solid gray'; // Add border
            level6AmCell.innerHTML = "Pool Instructions";

            // DAY1
            const day1Cell = row.insertCell();
            day1Cell.style.textAlign = 'center';
            day1Cell.style.border = '1px solid gray'; // Add border
            let day1 = null;
            // Process netmiss interpolation for each gage here
            day1 = "<div>" + "<b>" + todayNetmissForecast + " (+/-0.2)" + "</b>" + "</div>";
            day1Cell.innerHTML = day1;
        }
        if (location_id === "Nav TW-Kaskaskia") {
            // console.log("data26: ", data26);
            // console.log("data27: ", data27);

            // PROCESS data26 - netmiss instructions forecast data
            const convertedDataInstructions = convertUTCtoCentralTime(data26);
            // console.log("convertedDataInstructions = ", convertedDataInstructions);

            // OBSERVED 6AM
            const level6AmCell = row.insertCell();
            level6AmCell.style.textAlign = 'center';
            level6AmCell.style.border = '1px solid gray'; // Add border
            level6AmCell.innerHTML = location_id.split('-')[0];


            // DAY1
            const day1Cell = row.insertCell();
            day1Cell.style.textAlign = 'center';
            day1Cell.style.border = '1px solid gray'; // Add border
            let day1 = null;
            // Process netmiss interpolation for each gage here
            day1 = "<div>" + (convertedDataInstructions.values[0][1]).toFixed(1) + "</div>";
            day1Cell.innerHTML = day1;

            // DAY2
            const day2Cell = row.insertCell();
            day2Cell.style.textAlign = 'center';
            day2Cell.style.border = '1px solid gray'; // Add border
            day2Cell.innerHTML = location_id.split('-')[0];
            let day2 = null;
            // Process netmiss interpolation for each gage here
            day2 = "<div>" + (convertedDataInstructions.values[1][1]).toFixed(1) + "</div>";
            day2Cell.innerHTML = day2;

            // DAY3
            const day3Cell = row.insertCell();
            day3Cell.style.textAlign = 'center';
            day3Cell.style.border = '1px solid gray'; // Add border
            day3Cell.innerHTML = location_id.split('-')[0];
            let day3 = null;
            // Process netmiss interpolation for each gage here
            day3 = "<div>" + (convertedDataInstructions.values[2][1]).toFixed(1) + "</div>";
            day3Cell.innerHTML = day3;

            // DAY4
            const day4Cell = row.insertCell();
            day4Cell.style.textAlign = 'center';
            day4Cell.style.border = '1px solid gray'; // Add border
            day4Cell.innerHTML = location_id.split('-')[0];
            let day4 = null;
            // Process netmiss interpolation for each gage here
            day4 = "<div>" + (convertedDataInstructions.values[3][1]).toFixed(1) + "</div>";
            day4Cell.innerHTML = day4;

            // DAY5
            const day5Cell = row.insertCell();
            day5Cell.style.textAlign = 'center';
            day5Cell.style.border = '1px solid gray'; // Add border
            let day5 = null;
            // Process netmiss interpolation for each gage here
            day5 = "<div>" + (convertedDataInstructions.values[4][1]).toFixed(1) + "</div>";
            day5Cell.innerHTML = day5;

            // DAY6
            const day6Cell = row.insertCell();
            day6Cell.style.textAlign = 'center';
            day6Cell.style.border = '1px solid gray'; // Add border
            let day6 = null;
            // Process netmiss interpolation for each gage here
            day6 = "<div>" + (convertedDataInstructions.values[5][1]).toFixed(1) + "</div>";
            day6Cell.innerHTML = day6;

            // DAY7
            const day7Cell = row.insertCell();
            day7Cell.style.textAlign = 'center';
            day7Cell.style.border = '1px solid gray'; // Add border
            let day7 = null;
            // Process netmiss interpolation for each gage here
            day7 = "<div>" + (convertedDataInstructions.values[6][1]).toFixed(1) + "</div>";
            day7Cell.innerHTML = day7;
        }
    });
}