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
        dep: Number(entry.dep)
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