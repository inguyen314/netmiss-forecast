async function fetchFirstNetmissDay(tsid, begin, end, cda) {
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

async function fetchData(location_id
    , tsid_netmiss
    , tsid_netmiss_observe
    , row
    , begin
    , end1
    , end2
    , level_id_flood
    , level_id_effective_date_flood
    , level_id_unit_id_flood
    , tsid_forecast_location
    , tsid_netmiss_upstream
    , tsid_netmiss_downstream
    , tsid_netmiss_downstream_flood
    , tsid_netmiss_upstream_stage_rev
    , tsid_netmiss_downstream_stage_rev
    , tsid_rvf_ff
    , nws_day1_date
    , tsid_netmiss_forecasting_location_upstream
    , tsid_netmiss_forecasting_location_downstream
    , river_mile_hard_coded
    , netmiss_river_mile_hard_coded_upstream
    , netmiss_river_mile_hard_coded_downstream
    , tsid_rvf_ff_downstream
    , tsid_rvf_ff_dependance
    , tsid_netmiss_flow
    , tsid_rating_id_coe
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

    return fetchAllUrls(url1, url2, url3, url4, url5, url6, url7, url8, url9, url10, url11, url12, url13, url14, url15, url16)
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
            ForecastValues[location_id] = [];
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
                ForecastValues[location_id].push({ "value": initialValue2 });
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
                    let previousValue = ForecastValues[location_id][ForecastValues[location_id].length - 1].value;
                    let newValue = previousValue + (latest7AMRvfDependanceValue[i].value - latest7AMRvfDependanceValue[i - 1].value);
                    ForecastValues[location_id].push({ "value": newValue });
                }
                console.log("actually set birdspoint data")
                // console.log("ForecastValues[location_id] = ", ForecastValues[location_id]);

                isRvfDependanceArrayLengthGreaterThanSeven = BirdsPointForecastValue.length >= 7;
                // console.log("isRvfDependanceArrayLengthGreaterThanSeven:", isRvfDependanceArrayLengthGreaterThanSeven);
            }

            return { 
                location_id,
                convertedData,
                row,
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
                data16
            }

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

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