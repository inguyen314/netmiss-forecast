function findLocationsWithTrueFlags(data) {
    const result = {};

    function searchNested(obj) {
        for (const key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
                if (obj[key].netmiss) {
                    const { tsid_forecast_location, tsid_interpolate_location } = obj[key].netmiss;
                    if (tsid_forecast_location === true || tsid_interpolate_location === true) {
                        result[key] = obj[key];
                    }
                }
                searchNested(obj[key]);
            }
        }
    }

    searchNested(data);
    return result;
}

