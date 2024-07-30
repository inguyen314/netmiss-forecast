const loadingIndicator = document.getElementById('loading_forecast');
const tableContainer = document.getElementById('table_container_forecast');

document.addEventListener('DOMContentLoaded', function () {
    // Display the loading_alarm_mvs indicator
    loadingIndicator.style.display = 'block';

    // Gage control json file
    let jsonFileURL = null;
    if (cda === "public") {
        jsonFileURL = '../../../php_data_api/public/json/gage_control_official.json';
    } else if (cda === "internal") {
        jsonFileURL = '../../../php_data_api/public/json/gage_control_official.json';
    } else {
        jsonFileURL = '../../../php_data_api/public/json/gage_control_official.json';
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

            const netmissLocations = findLocationsWithTrueFlags(jsonData);
            console.log("netmissLocations: ", netmissLocations);

            // Convert the data object to an array of entries (key-value pairs)
            const entries = Object.entries(netmissLocations);

            // Sort entries by the netmiss_forecast_sort_order
            const sortedEntries = entries.sort((a, b) => {
                const aSortOrder = a[1].netmiss.netmiss_forecast_sort_order;
                const bSortOrder = b[1].netmiss.netmiss_forecast_sort_order;
                return aSortOrder - bSortOrder;
            });
            console.log("sortedEntries: ", sortedEntries);

            // Convert sorted entries back to an object (if needed) or use the sorted array
            const sortedData = Object.fromEntries(sortedEntries);
            console.log("sortedData: ", sortedData);

            // Print the sorted location names
            sortedEntries.forEach(([key, value]) => {
                console.log(`${key}: ${value.netmiss.netmiss_forecast_sort_order}`);
            });

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