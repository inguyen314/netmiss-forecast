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


    // Append the table to the document or a specific container
    if (tableContainer) {
        tableContainer.appendChild(table);
    }

    // get netmiss data here
    (async () => {
        try {
            const currentDateTime = new Date();
            const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);

           
            populateTableCells(jsonDataFiltered, table, nws_day1_date);

            
        } catch (error) {
            console.error('Error:', error);
        }
    })();
}

async function populateTableCells(jsonDataFiltered, table, nws_day1_date) {
    loadingIndicator.style.display = 'block';
    tableContainer.innerText = "Loading..."
    // console.log("jsonDataFiltered inside populateTableCells: ", jsonDataFiltered);
    let promises = [];
    jsonDataFiltered.forEach(location => {
        // Create a new row for each data object
        const row = table.insertRow();
        // console.log("Calling fetchData");

        // setup date time before calling function
        const currentDateTime = new Date();
        const currentDateTimePlus7Days = plusHoursFromDate(currentDateTime, 168);
        const currentDateMinus30Hours = subtractHoursFromDate(currentDateTime, 30);

        promises.push(fetchData(location.location_id
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
        ))
    });
    Promise.all(promises).then((d) => {
        console.log("got all my data!", d)
        // do all drawing my combined data
        processAllData(d);
    })
}

function processAllData(data) {
    const {
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
        isRvfDependanceArrayLengthGreaterThanSeven
    } = data || {};

    console.log("data: ", data);


        // LOCATION
        const locationIdCell = row.insertCell();
        locationIdCell.innerHTML = location_id;

        // OBSERVED 6AM
        const level6AmCell = row.insertCell();
        level6AmCell.innerHTML = "<div title='" + latest6AMValue.date + "'>" +
            "<a href='../../chart/public/chart.html?cwms_ts_id=" + tsid + "' target='_blank'>" +
            (tsid_forecast_location === true ? "<strong>" + parseFloat(latest6AMValue.value).toFixed(2) + "</strong>" : parseFloat(latest6AMValue.value).toFixed(2)) + "</a>" +
            "</div>";
}