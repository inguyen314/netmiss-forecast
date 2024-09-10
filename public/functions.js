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

// Function to get lastest 6am value for stage-rev
function getLatest6AMValue(data) {
    // Check if data or data.values is null or undefined
    if (!data || !Array.isArray(data.values)) {
        return {
            latest6AMValue: null,
            tsid: null
        };
    }

    // Extract the values array from the data
    const values = data.values;

    // Extract the tsid from the data
    const tsid = data.name || null;

    // Initialize a variable to store the latest 6 AM value
    let latest6AMValue = null;

    // Initialize a variable to store the latest timestamp
    let latest6AMTimestamp = 0;

    // Define the Central Time timezone
    const centralTimeZone = 'America/Chicago';

    // Iterate through the values array
    for (let i = 0; i < values.length; i++) {
        const entry = values[i];

        // Check if the entry is null or undefined or doesn't have enough elements
        if (!entry || entry.length < 3) {
            continue;
        }

        const [timestamp, value, qualityCode] = entry;

        // Check if the timestamp is valid
        if (!timestamp) {
            continue;
        }

        // Convert the timestamp to a Date object in UTC
        const date = new Date(timestamp);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            continue;
        }

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

function yesterdayAverageOfValues(data) {
    const centralOffset = -5; // Central Time is UTC-6

    // Helper function to convert UTC timestamp to Central Time and get the hour
    function getCentralTimeHour(timestamp) {
        const date = new Date(timestamp);
        const utcHours = date.getUTCHours();
        const centralHours = (utcHours + centralOffset + 24) % 24;
        return centralHours;
    }

    // Extract values at 5 AM, 6 AM, and 7 AM Central Time
    const targetHours = [5, 6, 7];
    let valuesAtSpecificHours = [];

    data.values.forEach(([timestamp, value]) => {
        if (value !== null) {
            const centralHour = getCentralTimeHour(timestamp);
            if (targetHours.includes(centralHour)) {
                valuesAtSpecificHours.push(value);
            }
        }
    });

    // console.log("valuesAtSpecificHours", valuesAtSpecificHours);

    const yesterday = valuesAtSpecificHours.slice(0, 12);
    // console.log("yesterday", yesterday);

    // Calculate the average of the extracted values
    const sum = yesterday.reduce((acc, val) => acc + val, 0);
    const average = yesterday.length > 0 ? sum / yesterday.length : null;

    return average;
}

function todayAverageOfValues(data) {
    const centralOffset = -5; // Central Time is UTC-6

    // Helper function to convert UTC timestamp to Central Time and get the hour
    function getCentralTimeHour(timestamp) {
        const date = new Date(timestamp);
        const utcHours = date.getUTCHours();
        const centralHours = (utcHours + centralOffset + 24) % 24;
        return centralHours;
    }

    // Extract values at 5 AM, 6 AM, and 7 AM Central Time
    const targetHours = [5, 6, 7];
    let valuesAtSpecificHours = [];

    data.values.forEach(([timestamp, value]) => {
        if (value !== null) {
            const centralHour = getCentralTimeHour(timestamp);
            if (targetHours.includes(centralHour)) {
                valuesAtSpecificHours.push(value);
            }
        }
    });

    // console.log("valuesAtSpecificHours", valuesAtSpecificHours);

    const yesterday = valuesAtSpecificHours.slice(12, 24);
    // console.log("yesterday", yesterday);

    // Calculate the average of the extracted values
    const sum = yesterday.reduce((acc, val) => acc + val, 0);
    const average = yesterday.length > 0 ? sum / yesterday.length : null;

    return average;
}

function customRound(value) {
    // Define the rounding rules
    if (value % 10 >= 5) {
        // If the remainder is 5 or more, round up
        return Math.ceil(value / 10) * 10;
    } else {
        // If the remainder is less than 5, round down
        return Math.floor(value / 10) * 10;
    }
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

    // Sort the table by dep values to ensure proper interpolation
    numericTable.sort((a, b) => a.dep - b.dep);

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
        console.log("Out of bounds");
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

    // console.log("Lower Entry:", lowerEntry);
    // console.log("Upper Entry:", upperEntry);
    // console.log("Dep Value:", depValue);
    // console.log("Interpolated Ind:", interpolatedInd);

    return interpolatedInd;
}

// Function to find rating, flow based on stage
function findDepByInd(indValue, table) {
    // Convert indValue to number if it's not already
    indValue = Number(indValue);

    // Convert table entries to numbers
    const numericTable = table.map(entry => ({
        ind: Number(entry.ind),
        dep: Number(entry.dep.replace(/,/g, '')) // Removing commas and converting to number
    }));

    // Find the closest entries in the table
    let lowerEntry = null;
    let upperEntry = null;

    for (let i = 0; i < numericTable.length; i++) {
        if (numericTable[i].ind <= indValue) {
            lowerEntry = numericTable[i];
        }
        if (numericTable[i].ind >= indValue && upperEntry === null) {
            upperEntry = numericTable[i];
        }
    }

    // If indValue is out of bounds
    if (!lowerEntry || !upperEntry) {
        return null;
    }

    // Handle exact match case
    if (lowerEntry.ind === indValue) {
        return lowerEntry.dep;
    }

    // Perform linear interpolation
    const indDiff = upperEntry.ind - lowerEntry.ind;

    // Check for division by zero scenario
    if (indDiff === 0) {
        return null; // or handle as needed
    }

    const depDiff = upperEntry.dep - lowerEntry.dep;
    const ratio = (indValue - lowerEntry.ind) / indDiff;
    const interpolatedDep = lowerEntry.dep + depDiff * ratio;

    return interpolatedDep;
}

// Function to fetch and read JSON data with parameters
async function readJSON(stage, flowRate) {
    try {
        // Fetch the JSON file
        const response = await fetch('json/backwaterRatingHardin.json');

        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON data
        const data = await response.json();

        // Interpolation function
        function interpolate(x, x0, y0, x1, y1) {
            return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
        }

        // Convert stage and flowRate to numbers
        stage = parseFloat(stage);
        flowRate = parseFloat(flowRate);

        // Get flow rate keys and sort them
        const flowRates = Object.keys(data).map(Number).sort((a, b) => a - b);

        // Find surrounding flow rate values
        let flowRateLow = null, flowRateHigh = null;
        for (let i = 0; i < flowRates.length - 1; i++) {
            if (flowRate >= flowRates[i] && flowRate <= flowRates[i + 1]) {
                flowRateLow = flowRates[i];
                flowRateHigh = flowRates[i + 1];
                break;
            }
        }

        // If exact flowRate match is found
        if (flowRateLow === flowRateHigh) {
            return data[flowRateLow][stage];
        }

        // Get stage keys and sort them
        const stages = Object.keys(data[flowRates[0]]).map(Number).sort((a, b) => a - b);

        // Find surrounding stage values
        let stageLow = null, stageHigh = null;
        for (let i = 0; i < stages.length - 1; i++) {
            if (stage >= stages[i] && stage <= stages[i + 1]) {
                stageLow = stages[i];
                stageHigh = stages[i + 1];
                break;
            }
        }

        // Interpolate for the given flowRate and stage
        if (flowRateLow !== null && flowRateHigh !== null && stageLow !== null && stageHigh !== null) {
            const y0 = interpolate(stage, stageLow, parseFloat(data[flowRateLow][stageLow]), stageHigh, parseFloat(data[flowRateLow][stageHigh]));
            const y1 = interpolate(stage, stageLow, parseFloat(data[flowRateHigh][stageLow]), stageHigh, parseFloat(data[flowRateHigh][stageHigh]));
            return interpolate(flowRate, flowRateLow, y0, flowRateHigh, y1);
        }

        // No data found for the given stage and flowRate
        return null;
    } catch (error) {
        console.error('Error fetching or parsing JSON:', error);
        return null;
    }
}

// Function to fetch and read JSON data with parameters
async function readJSONTable(stage, flowRate, Table) {
    try {
        // Fetch the JSON file
        const response = await fetch('json/' + Table + '');

        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON data
        const data = await response.json();

        // Interpolation function
        function interpolate(x, x0, y0, x1, y1) {
            return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
        }

        // Convert stage and flowRate to numbers
        stage = parseFloat(stage);
        flowRate = parseFloat(flowRate);

        // console.log("Stage:", stage);
        // console.log("FlowRate:", flowRate);

        // Get flow rate keys and sort them
        const flowRates = Object.keys(data).map(Number).sort((a, b) => a - b);

        // console.log("FlowRates:", flowRates);

        // Find surrounding flow rate values
        let flowRateLow = null, flowRateHigh = null;
        for (let i = 0; i < flowRates.length - 1; i++) {
            if (flowRate >= flowRates[i] && flowRate <= flowRates[i + 1]) {
                flowRateLow = flowRates[i];
                flowRateHigh = flowRates[i + 1];
                break;
            }
        }

        // console.log("FlowRateLow:", flowRateLow);
        // console.log("FlowRateHigh:", flowRateHigh);

        // If exact flowRate match is found
        if (flowRateLow === flowRateHigh) {
            return parseFloat(data[flowRateLow][stage]);
        }

        // Get stage keys and sort them
        const stages = Object.keys(data[flowRates[0]]).map(Number).sort((a, b) => a - b);

        // console.log("Stages:", stages);

        // Find surrounding stage values
        let stageLow = null, stageHigh = null;
        for (let i = 0; i < stages.length - 1; i++) {
            if (stage >= stages[i] && stage <= stages[i + 1]) {
                stageLow = stages[i];
                stageHigh = stages[i + 1];
                break;
            }
        }

        // console.log("StageLow:", stageLow);
        // console.log("StageHigh:", stageHigh);

        // Interpolate for the given flowRate and stage
        if (flowRateLow !== null && flowRateHigh !== null && stageLow !== null && stageHigh !== null) {
            const y0 = interpolate(stage, stageLow, parseFloat(data[flowRateLow][stageLow]), stageHigh, parseFloat(data[flowRateLow][stageHigh]));
            const y1 = interpolate(stage, stageLow, parseFloat(data[flowRateHigh][stageLow]), stageHigh, parseFloat(data[flowRateHigh][stageHigh]));
            const result = interpolate(flowRate, flowRateLow, y0, flowRateHigh, y1);

            // console.log("Interpolated Result:", result);

            return result;
        }

        // No data found for the given stage and flowRate
        return null;
    } catch (error) {
        console.error('Error fetching or parsing JSON:', error);
        return null;
    }
}

// Function to fetch and read JSON data with parameters
async function readJSONTable2(stage, flowRate, Table) {
    try {
        // console.log(`Fetching JSON file from: json/${Table}`);

        // Fetch the JSON file
        const response = await fetch('json/' + Table);
        // console.log(`Fetch status: ${response.status}`);

        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON data
        const data = await response.json();
        // console.log("JSON data fetched:", data);

        // Interpolation function
        function interpolate(x, x0, y0, x1, y1) {
            if (x1 === x0) {
                console.warn(`Interpolation division by zero: x0 = ${x0}, x1 = ${x1}`);
                return y0; // Handle division by zero
            }
            return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
        }

        // Convert stage and flowRate to numbers
        stage = parseFloat(stage);
        flowRate = parseFloat(flowRate);
        // console.log(`Parsed stage: ${stage}, Parsed flowRate: ${flowRate}`);

        // Get and sort stage keys
        const stages = Object.keys(data).map(Number).sort((a, b) => a - b);
        // console.log("Sorted stages:", stages);

        // Find surrounding stage values
        let stageLow = null, stageHigh = null;
        for (let i = 0; i < stages.length - 1; i++) {
            if (stage >= stages[i] && stage <= stages[i + 1]) {
                stageLow = stages[i];
                stageHigh = stages[i + 1];
                break;
            }
        }
        // console.log(`Found stages: stageLow = ${stageLow}, stageHigh = ${stageHigh}`);

        // Check if stage values are found
        if (stageLow === null || stageHigh === null) {
            console.error("Stage out of bounds.");
            return null;
        }

        // Get and sort flow rate keys for the lower stage
        const flowRates = Object.keys(data[stageLow]).map(Number).sort((a, b) => a - b);
        // console.log("Sorted flow rates:", flowRates);

        // Find surrounding flow rate values
        let flowRateLow = null, flowRateHigh = null;
        for (let i = 0; i < flowRates.length - 1; i++) {
            if (flowRate >= flowRates[i] && flowRate <= flowRates[i + 1]) {
                flowRateLow = flowRates[i];
                flowRateHigh = flowRates[i + 1];
                break;
            }
        }
        // console.log(`Found flow rates: flowRateLow = ${flowRateLow}, flowRateHigh = ${flowRateHigh}`);

        // Check if flow rate values are found
        if (flowRateLow === null || flowRateHigh === null) {
            console.error("Flow rate out of bounds.");
            return null;
        }

        // If exact flowRate match is found
        if (stageLow === stageHigh) {
            console.log(`Exact stage match: ${stageLow}`);
            return parseFloat(data[stageLow][flowRate]);
        }

        // Interpolate for the given flowRate and stage
        // console.log(`Interpolating y0 and y1 for stageLow = ${stageLow}, stageHigh = ${stageHigh}`);
        const y0 = interpolate(
            flowRate,
            flowRateLow,
            parseFloat(data[stageLow][flowRateLow]),
            flowRateHigh,
            parseFloat(data[stageLow][flowRateHigh])
        );
        const y1 = interpolate(
            flowRate,
            flowRateLow,
            parseFloat(data[stageHigh][flowRateLow]),
            flowRateHigh,
            parseFloat(data[stageHigh][flowRateHigh])
        );
        // console.log(`Interpolated values: y0 = ${y0}, y1 = ${y1}`);

        const result = interpolate(stage, stageLow, y0, stageHigh, y1);
        // console.log("Interpolated Result:", result);

        return result;
    } catch (error) {
        console.error('Error fetching or parsing JSON:', error);
        return null;
    }
}

// Payload setup
function getDateWithTimeSet(daysToAdd, hours, minutes) {
    let date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, milliseconds to 6 AM
    return date.getTime();
}

// Function to write timeseries data
async function writeTS(payload) {
    // Log the input payload and check if it's an array
    console.log("payload =", payload);
    console.log("isPayloadAnArray =", Array.isArray(payload));
    
    // Throw an error if payload is not specified
    if (!payload) throw new Error("You must specify a payload!");

    // If the payload is not an array, convert it to an array
    if (!Array.isArray(payload)) {
        payload = [payload];
    }

    // Create an array of promises to handle multiple payloads
    let promises = payload.map(ts_payload => {
        return fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?store-rule=REPLACE%20ALL", {
            method: "POST",
            headers: {
                "accept": "*/*",
                "Content-Type": "application/json;version=2",
            },
            body: JSON.stringify(ts_payload)
        }).then(async r => {
            // Get the response message and status
            const message = await r.text();
            const status = r.status;
            return { 'message': message, 'status': status };
        }).catch(error => {
            // Handle fetch errors
            return { 'message': error.message, 'status': 'fetch_error' };
        });
    });

    // Wait for all promises to resolve
    const return_values = await Promise.all(promises);
    console.log("Return values from writeTS:", return_values);

    // Check for errors based on status and message content
    const has_errors = return_values.some(v => v.status !== 200 || v.message.includes("error") || v.message.includes("fail"));
    return has_errors;
}

// Function to delete timeseries data
async function deleteTS(payloadDelete) {
    // Log the input payloadDelete and check if it's an array
    console.log("payloadDelete =", payloadDelete);
    console.log("isPayloadAnArray =", Array.isArray(payloadDelete));
    
    // Throw an error if payloadDelete is not specified
    if (!payloadDelete) throw new Error("You must specify a payloadDelete!");

    // If the payloadDelete is not an array, convert it to an array
    if (!Array.isArray(payloadDelete)) {
        payloadDelete = [payloadDelete];
    }

    // Create an array of promises to handle multiple payloads
    let promises = payloadDelete.map(ts_payload => {
        return fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/timeseries?store-rule=REPLACE%20ALL", {
            method: "POST",
            headers: {
                "accept": "*/*",
                "Content-Type": "application/json;version=2",
            },
            body: JSON.stringify(ts_payload)
        }).then(async r => {
            // Get the response message and status
            const message = await r.text();
            const status = r.status;
            return { 'message': message, 'status': status };
        }).catch(error => {
            // Handle fetch errors
            return { 'message': error.message, 'status': 'fetch_error' };
        });
    });

    // Wait for all promises to resolve
    const return_values = await Promise.all(promises);
    console.log("Return values from deleteTS:", return_values);

    // Check for errors based on status and message content
    const has_errors = return_values.some(v => v.status !== 200 || v.message.includes("error") || v.message.includes("fail"));
    return has_errors;
}

// Function to check if the user is logged in
async function isLoggedIn() {
    try {
        // Make a GET request to the auth/keys endpoint
        const response = await fetch("https://wm.mvs.ds.usace.army.mil/mvs-data/auth/keys", {
            method: "GET"
        });

        // If the response status is 401 (Unauthorized), return false
        if (response.status === 401) return false;

        // Log the response status for debugging
        console.log('status', response.status);
        return true; // Return true if the status is not 401

    } catch (error) {
        // Log any errors that occur during the fetch
        console.error('Error checking login status:', error);
        return false; // Return false if there's an error
    }
}

// Function to handle the login process for CDA
async function loginCDA() {
    console.log("page");

    // Check if the user is already logged in
    if (await isLoggedIn()) return true;
    
    // Log if the user is not logged in
    console.log('is false');

    // Redirect to the login page with the current URL as the OriginalLocation parameter
    window.location.href = `https://wm.mvs.ds.usace.army.mil:8243/CWMSLogin/login?OriginalLocation=${encodeURIComponent(window.location.href)}`;
}

// Function to control the login state and update the button text accordingly
async function loginStateController(cdaBtn) {
    // Check if the user is already logged in
    if (await isLoggedIn()) {
        // If logged in, set the button text to "Submit"
        // TODO: look into other ways to handle state management in JS
        // Using variables or attributes of the element/dom for state management
        cdaBtn.innerText = "Save";
    } else {
        // If not logged in, set the button text to "Login"
        cdaBtn.innerText = "Login";
    }
}

// Function to control the login state and update the button text accordingly
async function loginDeleteStateController(cdaBtnDelete) {
    // Check if the user is already logged in
    if (await isLoggedIn()) {
        // If logged in, set the button text to "Submit"
        // TODO: look into other ways to handle state management in JS
        // Using variables or attributes of the element/dom for state management
        cdaBtnDelete.innerText = "Delete";
    } else {
        // If not logged in, set the button text to "Login"
        cdaBtnDelete.innerText = "Login";
    }
}