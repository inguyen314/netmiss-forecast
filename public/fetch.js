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
    , tsid_netmiss // url01
    , tsid_netmiss_observe // url02
    , row
    , begin // currentDateTime
    , end1 // currentDateTimePlus7Days
    , end2 // currentDateMinus30Hours
    , level_id_flood // url03
    , level_id_effective_date_flood
    , level_id_unit_id_flood
    , tsid_forecast_location
    , tsid_netmiss_upstream
    , tsid_netmiss_downstream // url04 and url06
    , tsid_netmiss_downstream_flood // url05
    , tsid_netmiss_upstream_stage_rev // url07
    , tsid_netmiss_downstream_stage_rev // url09
    , tsid_rvf_ff // url10
    , nws_day1_date
    , tsid_netmiss_forecasting_location_upstream // url11
    , tsid_netmiss_forecasting_location_downstream // url12
    , river_mile_hard_coded
    , netmiss_river_mile_hard_coded_upstream
    , netmiss_river_mile_hard_coded_downstream
    , tsid_rvf_ff_downstream // url13
    , tsid_rvf_ff_dependance // url14
    , tsid_netmiss_flow // url15
    , tsid_rating_id_coe // url16
    , tsid_rating_id_coe_upstream // url17
    , tsid_netmiss_special_gage_1 // url18
    , tsid_rating_id_coe_downstream // url19
    , tsid_netmiss_special_gage_2 // url20
    , tsid_rating_id_special_1 // url21
    , tsid_netmiss_downstream_stage_rev_2 // url22
    , tsid_special_gage_1 // url23
    , tsid_special_gage_2 // url24
    , tsid_special_gage_3 // url25
    , tsid_netmiss_instructions // url26
    , currentDateMinus18Hours
    , currentDateMinus48Hours
    , netmiss_instructions_support_gage1
) {

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

    // Get Rating Table Upstreamstream COE 
    let url17 = null;
    if (tsid_rating_id_coe_upstream !== null) {
        if (cda === "internal") {
            url17 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/ratings/${tsid_rating_id_coe_upstream}?office=MVS`;
        } else if (cda === "public") {
            url17 = `https://cwms-data.usace.army.mil/cwms-data/${tsid_rating_id_coe_upstream}?office=MVS`;
        }
    }
    // console.log("url17 = ", url17);

    // Get Netmiss Special Gage 1 Forecast 
    let url18 = null;
    if (tsid_netmiss_special_gage_1 !== null) {
        if (cda === "internal") {
            url18 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_netmiss_special_gage_1}&begin=${end2.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url18 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_netmiss_special_gage_1}&begin=${end2.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url18 = ", url18);

    // Get Rating Table Downstream COE 
    let url19 = null;
    if (tsid_rating_id_coe_downstream !== null) {
        if (cda === "internal") {
            url19 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/ratings/${tsid_rating_id_coe_downstream}?office=MVS`;
        } else if (cda === "public") {
            url19 = `https://cwms-data.usace.army.mil/cwms-data/${tsid_rating_id_coe_downstream}?office=MVS`;
        }
    }
    // console.log("url19 = ", url19);

    // Get Netmiss Special Gage 2 Forecast 
    let url20 = null;
    if (tsid_netmiss_special_gage_2 !== null) {
        if (cda === "internal") {
            url20 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_netmiss_special_gage_2}&begin=${end2.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url20 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_netmiss_special_gage_2}&begin=${end2.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url20 = ", url20);

    // Get Rating Special 1 
    let url21 = null;
    if (tsid_rating_id_special_1 !== null) {
        if (cda === "internal") {
            url21 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/ratings/${tsid_rating_id_special_1}?office=MVS`;
        } else if (cda === "public") {
            url21 = `https://cwms-data.usace.army.mil/cwms-data/${tsid_rating_id_special_1}?office=MVS`;
        }
    }
    // console.log("url21 = ", url21);

    // Get Upstream Stage-Rev
    let url22 = null;
    if (tsid_netmiss_downstream_stage_rev_2 !== null) {
        if (cda === "internal") {
            url22 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_netmiss_downstream_stage_rev_2}&begin=${end2.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url22 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_netmiss_downstream_stage_rev_2}&begin=${end2.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url22 = ", url22);

    // Get Special Gage 1
    let url23 = null;
    if (tsid_special_gage_1 !== null) {
        if (cda === "internal") {
            url23 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_special_gage_1}&begin=${currentDateMinus48Hours.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url23 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_special_gage_1}&begin=${currentDateMinus48Hours.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url23 = ", url23);

    // Get Special Gage 2
    let url24 = null;
    if (tsid_special_gage_2 !== null) {
        if (cda === "internal") {
            url24 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_special_gage_2}&begin=${currentDateMinus48Hours.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url24 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_special_gage_2}&begin=${currentDateMinus48Hours.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url24 = ", url24);

    // Get Special Gage 3
    let url25 = null;
    if (tsid_special_gage_3 !== null) {
        if (cda === "internal") {
            url25 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_special_gage_3}&begin=${currentDateMinus48Hours.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url25 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_special_gage_3}&begin=${currentDateMinus48Hours.toISOString()}&end=${begin.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url25 = ", url25);

    // Get Netmiss Forecast
    let url26 = null;
    if (tsid_netmiss_instructions !== null) {
        if (cda === "internal") {
            url26 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${tsid_netmiss_instructions}&begin=${end2.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url26 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${tsid_netmiss_instructions}&begin=${end2.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url26 = ", url26);

    // Get Netmiss Instruction Support Gage1
    let url27 = null;
    if (netmiss_instructions_support_gage1 !== null) {
        if (cda === "internal") {
            url27 = `https://coe-mvsuwa04mvs.mvs.usace.army.mil:8243/mvs-data/timeseries?name=${netmiss_instructions_support_gage1}&begin=${currentDateMinus48Hours.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        } else if (cda === "public") {
            url27 = `https://cwms-data.usace.army.mil/cwms-data/timeseries?name=${netmiss_instructions_support_gage1}&begin=${currentDateMinus48Hours.toISOString()}&end=${end1.toISOString()}&office=MVS&timezone=CST6CDT`;
        }
    }
    // console.log("url27 = ", url27);

    return fetchAllUrls(url1, url2, url3, url4, url5, url6, url7, url8, url9, url10, url11, url12, url13, url14, url15, url16, url17, url18, url19, url20, url21, url22, url23, url24, url25, url26, url27)
        .then(({data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12, data13, data14, data15, data16, data17, data18, data19, data20, data21, data22, data23, data24, data25, data26, data27}) => {
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
            // console.log("data17 = ", data17);
            // console.log("data18 = ", data18);
            // console.log("data19 = ", data19);
            // console.log("data20 = ", data20);
            // console.log("data21 = ", data21);
            // console.log("data22 = ", data22);
            // console.log("data23 = ", data23);
            // console.log("data24 = ", data24);
            // console.log("data25 = ", data25);
            // console.log("data26 = ", data26);
            // console.log("data27 = ", data27);

            // PROCESS data1 - netmiss forecast data
            const convertedData = convertUTCtoCentralTime(data1);
            // console.log("convertedData = ", convertedData);

            // PROCESS data8 - upstream netmiss forecast data
            const convertedNetmissUpstreamData = convertUTCtoCentralTime(data8);
            // console.log("convertedNetmissUpstreamData = ", convertedNetmissUpstreamData);

            // CHECK array length
            const isNetmissForecastArrayLengthGreaterThanSeven = checkValuesArrayLength(data1);
            // console.log("isNetmissForecastArrayLengthGreaterThanSeven:", isNetmissForecastArrayLengthGreaterThanSeven);

            // PROCESS data2 - 6am level
            const result = getLatest6AMValue(data2);
            const latest6AMValue = result.latest6AMValue;
            const tsid = result.tsid;

            // PROCESS data4 Downstream Netmiss for Interpolation
            const convertedNetmissDownstreamData = convertUTCtoCentralTime(data4);
            // console.log("convertedNetmissDownstreamData = ", convertedNetmissDownstreamData);

            // PROCESS data11 - upstream netmiss forecasting point data
            const convertedNetmissForecastingPointUpstreamData = convertUTCtoCentralTime(data11);
            // console.log("convertedNetmissForecastingPointUpstreamData = ", convertedNetmissForecastingPointUpstreamData);

            // PROCESS data12 - downstream netmiss forecasting point data
            const convertedNetmissForecastingPointDownstreamData = convertUTCtoCentralTime(data12);
            // console.log("convertedNetmissForecastingPointDownstreamData = ", convertedNetmissForecastingPointDownstreamData);

            // PROCESS data10 - Cairo-Ohio RVF-FF 7am levels
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

            // PROCESS data14 - Birds Point-Mississippi forecast based on Cairo-Ohio into an array for 7 days
            let result14 = null;
            let yesterday6AMStageRevValue = null;
            let cairoRvfForecastValues = null;
            let isCairoRvfForecastValuesGreaterThanSeven = null;
            let yesterdayDownstream6AMStageRevValue = null;
            let BirdsPointForecastValue = [];
            ForecastValues[location_id] = [];
            let initialValue = null;
            let initialValueLocationId = null;
            if (data14 !== null && data9 !== null) {
                // get birds point rvf forecast values for processing and check number length
                result14 = get7AMValuesForWeek(data14, nws_day1_date);
                cairoRvfForecastValues = result14.valuesAt7AM;
                isCairoRvfForecastValuesGreaterThanSeven = cairoRvfForecastValues.length >= 7;
                // console.log("cairoRvfForecastValues = ", cairoRvfForecastValues);
                // console.log("isCairoRvfForecastValuesGreaterThanSeven = ", isCairoRvfForecastValuesGreaterThanSeven);
                // get today and yesterday values for processing
                yesterday6AMStageRevValue = ((getLatest6AMValue(data2)).latest6AMValue).value;
                // console.log("yesterday6AMStageRevValue = ", yesterday6AMStageRevValue);
                yesterdayDownstream6AMStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                // console.log("yesterdayDownstream6AMStageRevValue = ", yesterdayDownstream6AMStageRevValue);

                // Calculate the initial value
                initialValue = yesterday6AMStageRevValue + (cairoRvfForecastValues[0].value - yesterdayDownstream6AMStageRevValue);
                BirdsPointForecastValue.push({ "value": initialValue });
                // console.log("initialValue = ", initialValue);

                // Calculate the initial value for birds point location
                initialValueLocationId = yesterday6AMStageRevValue + (cairoRvfForecastValues[0].value - yesterdayDownstream6AMStageRevValue);
                ForecastValues[location_id].push({ "value": initialValueLocationId });
                // console.log("initialValueLocationId = ", initialValueLocationId);

                // Calculate subsequent values
                for (let i = 1; i < cairoRvfForecastValues.length; i++) {
                    let previousValue = BirdsPointForecastValue[BirdsPointForecastValue.length - 1].value;
                    let newValue = previousValue + (cairoRvfForecastValues[i].value - cairoRvfForecastValues[i - 1].value);
                    BirdsPointForecastValue.push({ "value": newValue });
                }
                // console.log("BirdsPointForecastValue = ", BirdsPointForecastValue);

                // Calculate subsequent values
                for (let i = 1; i < cairoRvfForecastValues.length; i++) {
                    let previousValue = ForecastValues[location_id][ForecastValues[location_id].length - 1].value;
                    let newValue = previousValue + (cairoRvfForecastValues[i].value - cairoRvfForecastValues[i - 1].value);
                    ForecastValues[location_id].push({ "value": newValue });
                }
                // console.log("ForecastValues[location_id] = ", ForecastValues[location_id]);
            }

            // PROCESS Grafton-Mississippi Day 1 - Illinois River uses this gage to interpolate
            let totalGraftonForecastDay1 = [];
            let totalGraftonForecastDay2 = [];
            let totalGraftonForecastDay3 = [];
            let totalGraftonForecastDay4 = [];
            let totalGraftonForecastDay5 = [];
            let totalGraftonForecastDay6 = [];
            GraftonForecast[location_id] = [];

            if (totalGraftonForecastDay1 === totalGraftonForecastDay1) {
                if (location_id === "Grafton-Mississippi") {
                    // Get today upstream day1 forecast (LD 25 TW)
                    const todayGraftonUpstreamNetmissValue = parseFloat(convertedNetmissForecastingPointUpstreamData.values[0][1]);
                    const todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                    // console.log("todayGraftonUpstreamNetmissValue: ", todayGraftonUpstreamNetmissValue);
                    // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);

                    // Get upstream day1 forecast cooresponding flow
                    const todayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(todayGraftonUpstreamNetmissValuePlus001, ratingStageFlowLd25Tw); // for database rating table use ratingGraftonTableCoeUpstream
                    // console.log("todayGraftonCorrespondingUpstreamNetmissFlowValue: (rating.js) ", todayGraftonCorrespondingUpstreamNetmissFlowValue);

                    // Get today special gage 2 cooresponding flow
                    const convertedGraftonSpecialNetmissGage2FlowValuesToCst = convertUTCtoCentralTime(data20);
                    const todayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[1][1];
                    // console.log("convertedGraftonSpecialNetmissGage2FlowValuesToCst: ", convertedGraftonSpecialNetmissGage2FlowValuesToCst);
                    // console.log("todayGraftonSpecialGage2NetmissFlowValue: ", todayGraftonSpecialGage2NetmissFlowValue);

                    // Sum "upstream day1 forecast cooresponding flow" and "special gage 2 cooresponding flow"
                    const sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = (parseFloat(todayGraftonSpecialGage2NetmissFlowValue) + parseFloat(todayGraftonCorrespondingUpstreamNetmissFlowValue)) / 1000;
                    // console.log("sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand: ", sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand);

                    // Check forecast day1 is based upon what conditions
                    const isGraftonForecastBasedUponLd25MPTw = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) > 300;
                    // console.log("isGraftonForecastBasedUponLd25MPTw: (True if > 300) ", isGraftonForecastBasedUponLd25MPTw);
                    const isGraftonForecastBasedUponOpenRiver = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) <= 300;
                    // console.log("isGraftonForecastBasedUponOpenRiver: (True if <= 300) ", isGraftonForecastBasedUponOpenRiver);

                    // Condition 1 - isGraftonForecastBasedUponOpenRiver
                    if (isGraftonForecastBasedUponOpenRiver) {
                        // console.log("isGraftonForecastBasedUponOpenRiver");

                        // Check upstream forecasting point is open river (Mel Price Pool)
                        const todayGraftonDownstreamNetmissStageValue = data12.values[0][1];
                        // console.log("todayGraftonDownstreamNetmissStageValue: ", todayGraftonDownstreamNetmissStageValue);
                        const todayGraftonNetmissDownstreamData = convertUTCtoCentralTime(data4).values[0][1];
                        // console.log("todayGraftonNetmissDownstreamData: ", todayGraftonNetmissDownstreamData);
                        const isMelPricePoolOpenRiver = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 > todayGraftonNetmissDownstreamData;
                        // console.log("isMelPricePoolOpenRiver: ", isMelPricePoolOpenRiver);
                        const isMelPricePoolRegulatedPool = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 <= todayGraftonNetmissDownstreamData;
                        // console.log("isMelPricePoolRegulatedPool: ", isMelPricePoolRegulatedPool);

                        // Condition 1 - Sub 1 - isMelPricePoolRegulatedPool
                        if (isMelPricePoolRegulatedPool) {
                            // console.log("isMelPricePoolRegulatedPool");

                            // Get grafton yesterday stagerev value
                            const yesterdayGraftonStageRevValue = latest6AMValue.value;
                            // console.log("yesterdayGraftonStageRevValue: ", yesterdayGraftonStageRevValue);

                            // Get yesterday upstream stagerev value
                            const yesterdayGraftonUpstreamStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                            const yesterdayGraftonUpstreamStageRevValuePlus0001 = yesterdayGraftonUpstreamStageRevValue + 0.001;
                            // console.log("yesterdayGraftonUpstreamStageRevValue: ", yesterdayGraftonUpstreamStageRevValue);
                            // console.log("yesterdayGraftonUpstreamStageRevValuePlus0001: ", yesterdayGraftonUpstreamStageRevValuePlus0001);

                            // Get cooresponding flow for yesterday upstream stagerev
                            const yesterdayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(yesterdayGraftonUpstreamStageRevValuePlus0001, ratingStageFlowLd25Tw); // for database rating table use ratingGraftonTableCoeUpstream
                            // console.log("yesterdayGraftonCorrespondingUpstreamNetmissFlowValue: ", yesterdayGraftonCorrespondingUpstreamNetmissFlowValue);

                            // Get yesterday special gage 2 cooresponding flow
                            const convertedGraftonSpecialNetmissGage2FlowValuesToCst = convertUTCtoCentralTime(data20);
                            const yesterdayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[0][1];
                            // console.log("convertedGraftonSpecialNetmissGage2FlowValuesToCst: ", convertedGraftonSpecialNetmissGage2FlowValuesToCst);
                            // console.log("yesterdayGraftonSpecialGage2NetmissFlowValue: ", yesterdayGraftonSpecialGage2NetmissFlowValue);

                            // Sum 
                            const valueCompareOpenRiver = ((yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + yesterdayGraftonSpecialGage2NetmissFlowValue) / 1000);
                            // console.log("valueCompareOpenRiver: ", valueCompareOpenRiver);

                            // Check which method to use (StageFlowRating or BackWater)
                            const isOpenRiverUseStageFlowRating = valueCompareOpenRiver > 300;
                            // console.log("isOpenRiverUseStageFlowRating : ", isOpenRiverUseStageFlowRating);

                            const isOpenRiverUseBackWater = valueCompareOpenRiver <= 300;
                            // console.log("isOpenRiverUseBackWater : ", isOpenRiverUseBackWater);

                            // Condition 1 - Sub 1 - Method 1 - isOpenRiverUseBackWater
                            if (isOpenRiverUseBackWater) {
                                // console.log("isOpenRiverUseBackWater");

                                // Need these values
                                // console.log("yesterdayGraftonUpstreamStageRevValuePlus0001 : ", yesterdayGraftonUpstreamStageRevValuePlus0001);
                                // console.log("yesterdayGraftonCorrespondingUpstreamNetmissFlowValue : ", yesterdayGraftonCorrespondingUpstreamNetmissFlowValue);
                                // console.log("yesterdayGraftonSpecialGage2NetmissFlowValue : ", yesterdayGraftonSpecialGage2NetmissFlowValue);

                                // Get yesterday downstream project stage
                                const yesterdayGraftonDownstreamStageRevValue2 = ((getLatest6AMValue(data22)).latest6AMValue).value;
                                // console.log("yesterdayGraftonDownstreamStageRevValue2: ", yesterdayGraftonDownstreamStageRevValue2);

                                const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                                // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                                let jsonFileName = "ratingGrafton.json"; //"ratingGrafton.json";

                                // Call the function and log the result
                                const stage = yesterdayGraftonDownstreamStageRevValue2; // yesterdayGraftonDownstreamStageRevValue2
                                const flowRate = valueCompareOpenRiver; // valueCompareOpenRiver
                                // console.log("stage, flowRate, jsonFileName: ", stage, flowRate, jsonFileName);
                                readJSONTable2(stage, flowRate, jsonFileName).then(value => {
                                    if (value !== null) {
                                        // console.log(`Interpolated reading for flow rate ${flowRate} and stage ${stage} at table ${jsonFileName}: ${value}`);

                                        deltaYesterdayStage = yesterdayGraftonStageRevValue - value;
                                        // console.log("deltaYesterdayStage: ", deltaYesterdayStage);
                                    } else {
                                        // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                                    }
                                });

                                // Need these values
                                // console.log("todayGraftonUpstreamNetmissValuePlus001 : ", todayGraftonUpstreamNetmissValuePlus001);
                                // console.log("todayGraftonCorrespondingUpstreamNetmissFlowValue : ", todayGraftonCorrespondingUpstreamNetmissFlowValue);
                                // console.log("todayGraftonSpecialGage2NetmissFlowValue : ", todayGraftonSpecialGage2NetmissFlowValue);
                                // console.log("sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand : ", sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand);

                                // Call the function and log the result
                                const stage2 = todayGraftonNetmissDownstreamData // todayGraftonDownstreamNetmissStageValue + 395.48 + 0.5; // yesterdayGraftonDownstreamStageRevValue2
                                const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand; // valueCompareOpenRiver
                                // console.log("stage2, flowRate2, jsonFileName: ", stage2, flowRate2, jsonFileName);
                                readJSONTable2(stage2, flowRate2, jsonFileName).then(value => {
                                    if (value !== null) {
                                        // console.log(`Interpolated reading for flow rate 2 ${flowRate2} and stage 2 ${stage2} at table ${jsonFileName}: ${value}`);

                                        totalGrafton = value + deltaYesterdayStage;
                                        // console.log("totalGrafton: ", totalGrafton);

                                        // push data to GraftonForecast
                                        totalGraftonForecastDay1.push({ "value": totalGrafton });
                                        GraftonForecast[location_id].push({ "value": totalGrafton });
                                    } else {
                                        // console.log(`No data found for flow rate 2 ${flowRate} and stage 2 ${stage}`);
                                    }
                                });
                            }

                            // Condition 1 - Sub 1 - Method 1 - isOpenRiverUseStageFlowRating
                            if (isOpenRiverUseStageFlowRating) {

                            }
                        }

                        // Condition 1 - Sub 2 - isMelPricePoolOpenRiver
                        if (isMelPricePoolOpenRiver) {
                            // console.log("isMelPricePoolOpenRiver");
                        }

                    }

                    // Condition 2 - isGraftonForecastBasedUponLd25MPTw
                    if (isGraftonForecastBasedUponLd25MPTw) {

                    }
                }

                // // special gage 1
                // let yesterdayGraftonSpecialNetmissFlowValue = null;
                // let todayGraftonSpecialNetmissFlowValue = null;
                // if (data18 !== null && location_id === "Grafton-Mississippi") {
                //     const convertedGraftonSpecialNetmissFlowValuesToCst = convertUTCtoCentralTime(data18);
                //     yesterdayGraftonSpecialNetmissFlowValue = (convertedGraftonSpecialNetmissFlowValuesToCst.values[0][1]);
                //     todayGraftonSpecialNetmissFlowValue = (convertedGraftonSpecialNetmissFlowValuesToCst.values[1][1]);
                //     // console.log("convertedGraftonSpecialNetmissFlowValuesToCst: ", convertedGraftonSpecialNetmissFlowValuesToCst);
                //     // console.log("yesterdayGraftonSpecialNetmissFlowValue: ", yesterdayGraftonSpecialNetmissFlowValue);
                //     // console.log("todayGraftonSpecialNetmissFlowValue: ", todayGraftonSpecialNetmissFlowValue);
                // }
                // // Get rating tables
                // let ratingGraftonTableCoe = null;
                // let ratingGraftonTableCoeUpstream = null;
                // let ratingGraftonTableCoeDownstream = null;
                // let todayGraftonCorrespondingDownstreamNetmissFlowValue = null;
                // let sumGraftonTodayHermannFlowPlusLd25TwFlow = null;
                // let sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = null;
                // if (data16 !== null && data17 !== null && data19 !== null && location_id === "Grafton-Mississippi") {
                //     ratingGraftonTableCoe = data16["simple-rating"]["rating-points"].point; // Grafton-Mississippi
                //     ratingGraftonTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point; // LD 25 TW-Mississippi
                //     ratingGraftonTableCoeDownstream = data19["simple-rating"]["rating-points"].point; // Mel Price TW-Mississippi

                //     // console.log("data16: ", data16);
                //     // console.log("data17: ", data17);
                //     // console.log("data19: ", data19);
                //     // console.log("ratingGraftonTableCoe: ", ratingGraftonTableCoe);
                //     // console.log("ratingGraftonTableCoeUpstream: ", ratingGraftonTableCoeUpstream);
                //     // console.log("ratingGraftonTableCoeDownstream: ", ratingGraftonTableCoeDownstream);


                //     // get rating tables from ratings.js
                //     // console.log("ratingStageFlowGrafton: ", ratingStageFlowGrafton);
                //     // console.log("ratingStageFlowLouisiana: ", ratingStageFlowLouisiana);
                //     // console.log("ratingStageFlowLd25Tw: ", ratingStageFlowLd25Tw);
                //     // console.log("ratingStageFlowMelPriceTw: ", ratingStageFlowMelPriceTw);


                //     todayGraftonCorrespondingDownstreamNetmissFlowValue = findDepByInd(todayGraftonDownstreamNetmissStageValue, ratingStageFlowMelPriceTw); // for database rating table use ratingGraftonTableCoeDownstream

                //     // console.log("todayGraftonCorrespondingDownstreamNetmissFlowValue: ", todayGraftonCorrespondingDownstreamNetmissFlowValue);
                // }
                // let totalGrafton = null;
                // if (location_id === "Grafton-Mississippi") {
                //     // Determine Grafton Forecast Based on Conditions
                //     if (isGraftonForecastBasedUponOpenRiver) {
                //         if (isMelPricePoolOpenRiver) {
                //             let deltaYesterdayStage = null;

                //             if (isOpenRiverUseStageFlowRating) {
                //                 const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                //                 // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                //                 const flowToSend = (yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + yesterdayGraftonSpecialGage2NetmissFlowValue);
                //                 // console.log("flowToSend: ", flowToSend);

                //                 const t = findIndByDep(flowToSend, ratingTableSpecial1);
                //                 // console.log("t: ", t);

                //                 deltaYesterdayStage = yesterdayGraftonStageRevValue - t;
                //                 // console.log("deltaYesterdayStage: ", deltaYesterdayStage);

                //                 const todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                //                 // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);

                //                 const todayFlowSum = todayGraftonCorrespondingUpstreamNetmissFlowValue + todayGraftonSpecialGage2NetmissFlowValue;
                //                 // console.log("todayFlowSum: ", todayFlowSum);

                //                 const x = todayGraftonDownstreamNetmissStageValue + 395.48 + 0.5;
                //                 console.log("x: ", x);
                //             } else if (isOpenRiverUseBackWater) {

                //             }
                //         } else {
                //             // Regulated Pool
                //             if (isOpenRiverUseStageFlowRating) {

                //             } else if (isOpenRiverUseBackWater) {
                //                 // console.log("********************** total is based upon isGraftonForecastBasedUponOpenRiver, !isMelPricePoolOpenRiver, isOpenRiverUseBackWater **********************");

                //                 // Interpolating Grafton Rating Table
                //                 function interpolateValue(rating, point) {
                //                     const keys = Object.keys(ratingGrafton).map(Number);

                //                     // Find the two closest keys
                //                     let lowerKey = null, upperKey = null;

                //                     for (let i = 0; i < keys.length; i++) {
                //                         if (keys[i] <= rating) lowerKey = keys[i];
                //                         if (keys[i] > rating && upperKey === null) upperKey = keys[i];
                //                     }

                //                     if (lowerKey === null || upperKey === null) {
                //                         throw new Error('Rating out of bounds.');
                //                     }

                //                     const lowerValues = ratingGrafton[lowerKey];
                //                     const upperValues = ratingGrafton[upperKey];

                //                     // Find the two closest values within these ranges
                //                     const lowerPoints = Object.keys(lowerValues).map(Number);
                //                     const upperPoints = Object.keys(upperValues).map(Number);

                //                     let lowerPoint = null, upperPoint = null;

                //                     for (let i = 0; i < lowerPoints.length; i++) {
                //                         if (lowerPoints[i] <= point) lowerPoint = lowerPoints[i];
                //                         if (lowerPoints[i] > point && upperPoint === null) upperPoint = lowerPoints[i];
                //                     }

                //                     if (lowerPoint === null || upperPoint === null) {
                //                         throw new Error('Point out of bounds.');
                //                     }

                //                     const lowerValue = lowerValues[lowerPoint];
                //                     const upperValue = upperValues[upperPoint];

                //                     // Perform interpolation
                //                     const interpolatedValue = lowerValue + ((point - lowerPoint) / (upperPoint - lowerPoint)) * (upperValue - lowerValue);

                //                     return interpolatedValue;
                //                 }

                //                 // deltaFirst
                //                 const stage = yesterdayGraftonDownstreamStageRevValue2;
                //                 const flowRate = valueCompareOpenRiver;
                //                 const interpolatedValue = interpolateValue(stage, flowRate);

                //                 // console.log(`Interpolated value for stage ${stage} and flowRate ${flowRate}: ${interpolatedValue}`);

                //                 const deltaFirst = yesterdayGraftonStageRevValue - interpolatedValue;
                //                 // console.log("deltaFirst: ", deltaFirst);

                //                 // deltaSecond
                //                 const stage2 = todayGraftonNetmissDownstreamData;
                //                 const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand;
                //                 const interpolatedValue2 = interpolateValue(stage2, flowRate2);

                //                 // console.log(`Interpolated value for stage ${stage2} and flowRate ${flowRate2}: ${interpolatedValue2}`);

                //                 totalGrafton = deltaFirst + interpolatedValue2;
                //                 // console.log("totalGrafton: ", totalGrafton);

                //                 // push data to GraftonForecast
                //                 totalGraftonForecastDay1.push({ "value": totalGrafton });
                //                 GraftonForecast[location_id].push({ "value": totalGrafton });
                //             } else {
                //                 totalGrafton = 999;
                //                 // console.log("totalGrafton: ", totalGrafton);
                //             }
                //             // push data to GraftonForecast
                //             totalGraftonForecastDay1.push({ "value": totalGrafton });
                //             GraftonForecast[location_id].push({ "value": totalGrafton });
                //         }
                //     } else if (isGraftonForecastBasedUponLd25MPTw) {
                //         totalGrafton = yesterdayGraftonStageRevValue + (((todayGraftonUpstreamNetmissValue - yesterdayGraftonUpstreamStageRevValue) + (todayGraftonDownstreamNetmissStageValue - yesterdayGraftonDownstreamStageRevValue)) / 2);
                //         // console.log("totalGrafton: ", totalGrafton);

                //         // push data to GraftonForecast
                //         totalGraftonForecastDay1.push({ "value": totalGrafton });
                //         GraftonForecast[location_id].push({ "value": totalGrafton });
                //     } else {
                //         totalGrafton = 909;
                //         // console.log("totalGrafton: ", totalGrafton);

                //         // push data to GraftonForecast
                //         totalGraftonForecastDay1.push({ "value": totalGrafton });
                //         GraftonForecast[location_id].push({ "value": totalGrafton });
                //     }
                // }
            }

            if (totalGraftonForecastDay2 === totalGraftonForecastDay2) {
                if (location_id === "Grafton-Mississippi") {
                    // Get today grafton upstream netmiss value
                    const todayGraftonUpstreamNetmissValue = parseFloat(convertedNetmissForecastingPointUpstreamData.values[1][1]); // ************** change here
                    const todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                    // console.log("todayGraftonUpstreamNetmissValue: ", todayGraftonUpstreamNetmissValue);
                    // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);

                    // Get upstream grafton rating table and cooresponding today flow value 
                    const ratingGraftonTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point;
                    const todayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(todayGraftonUpstreamNetmissValuePlus001, ratingGraftonTableCoeUpstream);
                    // console.log("todayGraftonCorrespondingUpstreamNetmissFlowValue: (database rating is off from excel) ", todayGraftonCorrespondingUpstreamNetmissFlowValue);

                    // Get special gage 2 flow value
                    const convertedGraftonSpecialNetmissGage2FlowValuesToCst = convertUTCtoCentralTime(data20);
                    // console.log("convertedGraftonSpecialNetmissGage2FlowValuesToCst: ", convertedGraftonSpecialNetmissGage2FlowValuesToCst);
                    const todayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[2][1]; // ************** change here
                    // console.log("todayGraftonSpecialGage2NetmissFlowValue: ", todayGraftonSpecialGage2NetmissFlowValue);
                    const firstDayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[0][1]; // ************** change here (keep the same)
                    // console.log("firstDayGraftonSpecialGage2NetmissFlowValue: ", firstDayGraftonSpecialGage2NetmissFlowValue);

                    // Sum today grafton plus ld25tw
                    const sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = (parseFloat(todayGraftonSpecialGage2NetmissFlowValue) + parseFloat(todayGraftonCorrespondingUpstreamNetmissFlowValue)) / 1000;
                    // console.log("sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand: ", sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand);

                    const isGraftonForecastBasedUponLd25MPTw = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) > 300;
                    // console.log("isGraftonForecastBasedUponLd25MPTw: (True if > 300) ", isGraftonForecastBasedUponLd25MPTw);
                    const isGraftonForecastBasedUponOpenRiver = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) <= 300;
                    // console.log("isGraftonForecastBasedUponOpenRiver: (True if <= 300) ", isGraftonForecastBasedUponOpenRiver);

                    // Condition 1 - isGraftonForecastBasedUponOpenRiver
                    if (isGraftonForecastBasedUponOpenRiver) {
                        // console.log("isGraftonForecastBasedUponOpenRiver");

                        // Get downstream netmiss day1
                        const todayGraftonNetmissDownstreamData = convertUTCtoCentralTime(data4).values[1][1]; // ************** change here
                        // console.log("todayGraftonNetmissDownstreamData: ", todayGraftonNetmissDownstreamData);

                        // Get downstream netmiss stagerev
                        const todayGraftonDownstreamNetmissStageValue = data12.values[1][1]; // ************** change here
                        // console.log("todayGraftonDownstreamNetmissStageValue: ", todayGraftonDownstreamNetmissStageValue);

                        // Check mel price open river
                        const isMelPricePoolOpenRiver = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 > todayGraftonNetmissDownstreamData;
                        // console.log("isMelPricePoolOpenRiver: ", isMelPricePoolOpenRiver);

                        // Check mel price regulated pool
                        const isMelPricePoolRegulatedPool = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 <= todayGraftonNetmissDownstreamData;
                        // console.log("isMelPricePoolRegulatedPool: ", isMelPricePoolRegulatedPool);

                        // Condition 1 - Sub 1 - isMelPricePoolOpenRiver
                        if (isMelPricePoolOpenRiver) {
                            // console.log("isMelPricePoolOpenRiver");
                        }

                        // Condition 1 - Sub 1 - isMelPricePoolRegulatedPool
                        if (isMelPricePoolRegulatedPool) {
                            // console.log("isMelPricePoolRegulatedPool");

                            const yesterdayGraftonStageRevValue = latest6AMValue.value;
                            // console.log("yesterdayGraftonStageRevValue: ", yesterdayGraftonStageRevValue);

                            // Get upstream grafton stage rev
                            const yesterdayGraftonUpstreamStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                            // console.log("yesterdayGraftonUpstreamStageRevValue: ", yesterdayGraftonUpstreamStageRevValue);
                            const yesterdayGraftonUpstreamStageRevValuePlus0001 = yesterdayGraftonUpstreamStageRevValue + 0.001;
                            // console.log("yesterdayGraftonUpstreamStageRevValuePlus0001: ", yesterdayGraftonUpstreamStageRevValuePlus0001);

                            const yesterdayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(yesterdayGraftonUpstreamStageRevValuePlus0001, ratingGraftonTableCoeUpstream);
                            // console.log("yesterdayGraftonCorrespondingUpstreamNetmissFlowValue: ", yesterdayGraftonCorrespondingUpstreamNetmissFlowValue);

                            const valueCompareOpenRiver = ((yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + firstDayGraftonSpecialGage2NetmissFlowValue) / 1000);
                            // console.log("valueCompareOpenRiver: ", valueCompareOpenRiver);

                            const isOpenRiverUseStageFlowRating = valueCompareOpenRiver > 300;
                            // console.log("isOpenRiverUseStageFlowRating : ", isOpenRiverUseStageFlowRating);

                            const isOpenRiverUseBackWater = valueCompareOpenRiver <= 300;
                            // console.log("isOpenRiverUseBackWater : ", isOpenRiverUseBackWater);

                            if (isOpenRiverUseBackWater) {
                                // console.log("isOpenRiverUseBackWater");

                                const yesterdayGraftonDownstreamStageRevValue2 = ((getLatest6AMValue(data22)).latest6AMValue).value;
                                // console.log("yesterdayGraftonDownstreamStageRevValue2: ", yesterdayGraftonDownstreamStageRevValue2);

                                const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                                // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                                let jsonFileName = "ratingGrafton.json";

                                // Call the function and log the result
                                const stage = yesterdayGraftonDownstreamStageRevValue2;
                                const flowRate = valueCompareOpenRiver;
                                // console.log("stage, flowRate, jsonFileName: ", stage, flowRate, jsonFileName);
                                readJSONTable2(stage, flowRate, jsonFileName).then(value => {
                                    if (value !== null) {
                                        // console.log(`Interpolated reading for flow rate ${flowRate} and stage ${stage} at table ${jsonFileName}: ${value}`);

                                        deltaYesterdayStage = yesterdayGraftonStageRevValue - value;
                                        // console.log("deltaYesterdayStage: ", deltaYesterdayStage);
                                    } else {
                                        // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                                    }
                                });

                                // Call the function and log the result
                                const stage2 = todayGraftonNetmissDownstreamData;
                                const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand;
                                // console.log("stage2, flowRate2, jsonFileName: ", stage2, flowRate2, jsonFileName);
                                readJSONTable2(stage2, flowRate2, jsonFileName).then(value => {
                                    if (value !== null) {
                                        // console.log(`Interpolated reading for flow rate ${flowRate2} and stage ${stage2} at table ${jsonFileName}: ${value}`);

                                        totalGrafton = value + deltaYesterdayStage;
                                        // console.log("totalGrafton: ", totalGrafton);

                                        // push data to GraftonForecast
                                        totalGraftonForecastDay2.push({ "value": totalGrafton });
                                        GraftonForecast[location_id].push({ "value": totalGrafton });
                                    } else {
                                        // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                                    }
                                });
                            }
                        }
                    }
                }

                // // yesterday
                // let yesterdayGraftonStageRevValue = null;
                // if (data2 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonStageRevValue = latest6AMValue.value;
                //     // console.log("yesterdayGraftonStageRevValue: ", yesterdayGraftonStageRevValue);
                // }
                // let yesterdayGraftonDownstreamStageRevValue = null;
                // if (data9 !== null && data22 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonDownstreamStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;

                //     console.log("yesterdayGraftonDownstreamStageRevValue: ", yesterdayGraftonDownstreamStageRevValue);

                // }
                // // special gage 1
                // let yesterdayGraftonSpecialNetmissFlowValue = null;
                // let todayGraftonSpecialNetmissFlowValue = null;
                // if (data18 !== null && location_id === "Grafton-Mississippi") {
                //     const convertedGraftonSpecialNetmissFlowValuesToCst = convertUTCtoCentralTime(data18);
                //     yesterdayGraftonSpecialNetmissFlowValue = (convertedGraftonSpecialNetmissFlowValuesToCst.values[1][1]);
                //     todayGraftonSpecialNetmissFlowValue = (convertedGraftonSpecialNetmissFlowValuesToCst.values[2][1]);
                //     // console.log("convertedGraftonSpecialNetmissFlowValuesToCst: ", convertedGraftonSpecialNetmissFlowValuesToCst);
                //     // console.log("yesterdayGraftonSpecialNetmissFlowValue: ", yesterdayGraftonSpecialNetmissFlowValue);
                //     // console.log("todayGraftonSpecialNetmissFlowValue: ", todayGraftonSpecialNetmissFlowValue);
                // }
                // // Get rating tables
                // let ratingGraftonTableCoe = null;
                // let ratingGraftonTableCoeDownstream = null;
                // let todayGraftonCorrespondingDownstreamNetmissFlowValue = null;
                // let sumGraftonTodayHermannFlowPlusLd25TwFlow = null;
                // let sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = null;
                // if (data16 !== null && data17 !== null && data19 !== null && location_id === "Grafton-Mississippi") {
                //     ratingGraftonTableCoe = data16["simple-rating"]["rating-points"].point; // Grafton-Mississippi

                //     ratingGraftonTableCoeDownstream = data19["simple-rating"]["rating-points"].point; // Mel Price TW-Mississippi

                //     // console.log("data16: ", data16);
                //     // console.log("data17: ", data17);
                //     // console.log("data19: ", data19);
                //     // console.log("ratingGraftonTableCoe: ", ratingGraftonTableCoe);
                //     // console.log("ratingGraftonTableCoeUpstream: ", ratingGraftonTableCoeUpstream);
                //     // console.log("ratingGraftonTableCoeDownstream: ", ratingGraftonTableCoeDownstream);


                //     // get rating tables from ratings.js
                //     // console.log("ratingStageFlowGrafton: ", ratingStageFlowGrafton);
                //     // console.log("ratingStageFlowLouisiana: ", ratingStageFlowLouisiana);
                //     // console.log("ratingStageFlowLd25Tw: ", ratingStageFlowLd25Tw);
                //     // console.log("ratingStageFlowMelPriceTw: ", ratingStageFlowMelPriceTw);


                //     todayGraftonCorrespondingDownstreamNetmissFlowValue = findDepByInd(todayGraftonDownstreamNetmissStageValue, ratingGraftonTableCoeDownstream);

                //     // console.log("todayGraftonCorrespondingDownstreamNetmissFlowValue: ", todayGraftonCorrespondingDownstreamNetmissFlowValue);


                // }
                // let totalGrafton = null;
                // if (location_id === "Grafton-Mississippi") {
                //     // Determine Grafton Forecast Based on Conditions
                //     if (isGraftonForecastBasedUponOpenRiver) {
                //         if (isMelPricePoolOpenRiver) {
                //             let deltaYesterdayStage = null;

                //             if (isOpenRiverUseStageFlowRating) {
                //                 const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                //                 // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                //                 const flowToSend = (yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + yesterdayGraftonSpecialGage2NetmissFlowValue);
                //                 // console.log("flowToSend: ", flowToSend);

                //                 const t = findIndByDep(flowToSend, ratingTableSpecial1);
                //                 // console.log("t: ", t);

                //                 deltaYesterdayStage = yesterdayGraftonStageRevValue - t;
                //                 // console.log("deltaYesterdayStage: ", deltaYesterdayStage);

                //                 const todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                //                 // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);

                //                 const todayFlowSum = todayGraftonCorrespondingUpstreamNetmissFlowValue + todayGraftonSpecialGage2NetmissFlowValue;
                //                 // console.log("todayFlowSum: ", todayFlowSum);

                //                 const x = todayGraftonDownstreamNetmissStageValue + 395.48 + 0.5;
                //                 // console.log("x: ", x);
                //             } else if (isOpenRiverUseBackWater) {

                //             }
                //         } else {
                //             // Regulated Pool
                //             if (isOpenRiverUseStageFlowRating) {

                //             } else if (isOpenRiverUseBackWater) {
                //                 // Grafton Rating Table
                //                 const ratingGrafton = {
                //                     "412": {
                //                         "0": 8.21,
                //                         "10": 8.56,
                //                         "20": 8.91,
                //                         "30": 9.27,
                //                         "40": 9.62,
                //                         "50": 9.98,
                //                         "60": 10.35,
                //                         "70": 10.71,
                //                         "80": 11.08,
                //                         "90": 11.45,
                //                         "100": 11.83,
                //                         "110": 12.20,
                //                         "120": 12.58,
                //                         "130": 12.96,
                //                         "140": 13.35,
                //                         "150": 13.73,
                //                         "160": 14.12,
                //                         "170": 14.52,
                //                         "180": 14.91,
                //                         "190": 15.31,
                //                         "200": 15.71,
                //                         "210": 16.11,
                //                         "220": 16.51,
                //                         "230": 16.91,
                //                         "240": 17.34,
                //                         "250": 17.82,
                //                         "260": 18.41,
                //                         "270": 19.12,
                //                         "280": 19.87,
                //                         "290": 20.80,
                //                         "300": 21.85
                //                     },
                //                     "413": {
                //                         "0": 9.21,
                //                         "10": 9.49,
                //                         "20": 9.78,
                //                         "30": 10.07,
                //                         "40": 10.37,
                //                         "50": 10.68,
                //                         "60": 10.99,
                //                         "70": 11.31,
                //                         "80": 11.64,
                //                         "90": 11.97,
                //                         "100": 12.31,
                //                         "110": 12.65,
                //                         "120": 13.00,
                //                         "130": 13.36,
                //                         "140": 13.72,
                //                         "150": 14.09,
                //                         "160": 14.47,
                //                         "170": 14.85,
                //                         "180": 15.24,
                //                         "190": 15.63,
                //                         "200": 16.03,
                //                         "210": 16.43,
                //                         "220": 16.83,
                //                         "230": 17.23,
                //                         "240": 17.66,
                //                         "250": 18.14,
                //                         "260": 18.73,
                //                         "270": 19.44,
                //                         "280": 20.19,
                //                         "290": 21.00,
                //                         "300": 21.85
                //                     },
                //                     "414": {
                //                         "0": 10.21,
                //                         "10": 10.42,
                //                         "20": 10.65,
                //                         "30": 10.88,
                //                         "40": 11.13,
                //                         "50": 11.38,
                //                         "60": 11.64,
                //                         "70": 11.91,
                //                         "80": 12.20,
                //                         "90": 12.49,
                //                         "100": 12.79,
                //                         "110": 13.10,
                //                         "120": 13.43,
                //                         "130": 13.76,
                //                         "140": 14.10,
                //                         "150": 14.45,
                //                         "160": 14.81,
                //                         "170": 15.18,
                //                         "180": 15.56,
                //                         "190": 15.95,
                //                         "200": 16.35,
                //                         "210": 16.75,
                //                         "220": 17.15,
                //                         "230": 17.55,
                //                         "240": 17.95,
                //                         "250": 18.42,
                //                         "260": 19.00,
                //                         "270": 19.68,
                //                         "280": 20.41,
                //                         "290": 21.13,
                //                         "300": 21.85
                //                     },
                //                     "415": {
                //                         "0": 11.21,
                //                         "10": 11.35,
                //                         "20": 11.51,
                //                         "30": 11.68,
                //                         "40": 11.87,
                //                         "50": 12.06,
                //                         "60": 12.28,
                //                         "70": 12.50,
                //                         "80": 12.74,
                //                         "90": 12.99,
                //                         "100": 13.25,
                //                         "110": 13.53,
                //                         "120": 13.82,
                //                         "130": 14.12,
                //                         "140": 14.44,
                //                         "150": 14.77,
                //                         "160": 15.11,
                //                         "170": 15.47,
                //                         "180": 15.84,
                //                         "190": 16.22,
                //                         "200": 16.60,
                //                         "210": 16.99,
                //                         "220": 17.39,
                //                         "230": 17.82,
                //                         "240": 18.20,
                //                         "250": 18.66,
                //                         "260": 19.21,
                //                         "270": 19.84,
                //                         "280": 20.51,
                //                         "290": 21.18,
                //                         "300": 21.85
                //                     },
                //                     "416": {
                //                         "0": 12.21,
                //                         "10": 12.28,
                //                         "20": 12.37,
                //                         "30": 12.48,
                //                         "40": 12.60,
                //                         "50": 12.74,
                //                         "60": 12.90,
                //                         "70": 13.07,
                //                         "80": 13.26,
                //                         "90": 13.47,
                //                         "100": 13.69,
                //                         "110": 13.94,
                //                         "120": 14.19,
                //                         "130": 14.47,
                //                         "140": 14.76,
                //                         "150": 15.07,
                //                         "160": 15.40,
                //                         "170": 15.74,
                //                         "180": 16.10,
                //                         "190": 16.46,
                //                         "200": 16.82,
                //                         "210": 17.20,
                //                         "220": 17.60,
                //                         "230": 18.00,
                //                         "240": 18.45,
                //                         "250": 18.90,
                //                         "260": 19.42,
                //                         "270": 20.00,
                //                         "280": 20.62,
                //                         "290": 21.23,
                //                         "300": 21.85
                //                     },
                //                     "417": {
                //                         "0": 13.21,
                //                         "10": 13.24,
                //                         "20": 13.28,
                //                         "30": 13.34,
                //                         "40": 13.42,
                //                         "50": 13.51,
                //                         "60": 13.62,
                //                         "70": 13.74,
                //                         "80": 13.88,
                //                         "90": 14.04,
                //                         "100": 14.21,
                //                         "110": 14.40,
                //                         "120": 14.63,
                //                         "130": 14.88,
                //                         "140": 15.16,
                //                         "150": 15.45,
                //                         "160": 15.76,
                //                         "170": 16.09,
                //                         "180": 16.44,
                //                         "190": 16.79,
                //                         "200": 17.16,
                //                         "210": 17.55,
                //                         "220": 17.94,
                //                         "230": 18.34,
                //                         "240": 18.78,
                //                         "250": 19.23,
                //                         "260": 19.73,
                //                         "270": 20.23,
                //                         "280": 20.73,
                //                         "290": 21.25,
                //                         "300": 21.85
                //                     },
                //                     "418": {
                //                         "0": 14.21,
                //                         "10": 14.24,
                //                         "20": 14.27,
                //                         "30": 14.32,
                //                         "40": 14.37,
                //                         "50": 14.44,
                //                         "60": 14.51,
                //                         "70": 14.60,
                //                         "80": 14.69,
                //                         "90": 14.79,
                //                         "100": 14.90,
                //                         "110": 15.02,
                //                         "120": 15.22,
                //                         "130": 15.45,
                //                         "140": 15.72,
                //                         "150": 16.00,
                //                         "160": 16.29,
                //                         "170": 16.60,
                //                         "180": 16.92,
                //                         "190": 17.25,
                //                         "200": 17.59,
                //                         "210": 17.95,
                //                         "220": 18.33,
                //                         "230": 18.72,
                //                         "240": 19.13,
                //                         "250": 19.55,
                //                         "260": 19.98,
                //                         "270": 20.40,
                //                         "280": 20.84,
                //                         "290": 21.29,
                //                         "300": 21.85
                //                     },
                //                     "419": {
                //                         "0": 15.21,
                //                         "10": 15.24,
                //                         "20": 15.27,
                //                         "30": 15.31,
                //                         "40": 15.36,
                //                         "50": 15.41,
                //                         "60": 15.47,
                //                         "70": 15.54,
                //                         "80": 15.62,
                //                         "90": 15.71,
                //                         "100": 15.82,
                //                         "110": 15.93,
                //                         "120": 16.04,
                //                         "130": 16.18,
                //                         "140": 16.36,
                //                         "150": 16.56,
                //                         "160": 16.79,
                //                         "170": 17.05,
                //                         "180": 17.34,
                //                         "190": 17.64,
                //                         "200": 17.95,
                //                         "210": 18.28,
                //                         "220": 18.65,
                //                         "230": 19.03,
                //                         "240": 19.42,
                //                         "250": 19.80,
                //                         "260": 20.19,
                //                         "270": 20.58,
                //                         "280": 20.98,
                //                         "290": 21.38,
                //                         "300": 21.85
                //                     },
                //                     "420": {
                //                         "0": 16.21,
                //                         "10": 16.24,
                //                         "20": 16.28,
                //                         "30": 16.32,
                //                         "40": 16.37,
                //                         "50": 16.42,
                //                         "60": 16.47,
                //                         "70": 16.53,
                //                         "80": 16.61,
                //                         "90": 16.69,
                //                         "100": 16.77,
                //                         "110": 16.83,
                //                         "120": 16.87,
                //                         "130": 16.94,
                //                         "140": 17.07,
                //                         "150": 17.25,
                //                         "160": 17.47,
                //                         "170": 17.71,
                //                         "180": 17.97,
                //                         "190": 18.25,
                //                         "200": 18.50,
                //                         "210": 18.79,
                //                         "220": 19.10,
                //                         "230": 19.43,
                //                         "240": 19.76,
                //                         "250": 20.09,
                //                         "260": 20.42,
                //                         "270": 20.76,
                //                         "280": 21.10,
                //                         "290": 21.45,
                //                         "300": 21.85
                //                     },
                //                     "421": {
                //                         "0": 17.21,
                //                         "10": 17.24,
                //                         "20": 17.27,
                //                         "30": 17.31,
                //                         "40": 17.35,
                //                         "50": 17.40,
                //                         "60": 17.44,
                //                         "70": 17.50,
                //                         "80": 17.56,
                //                         "90": 17.63,
                //                         "100": 17.70,
                //                         "110": 17.75,
                //                         "120": 17.79,
                //                         "130": 17.85,
                //                         "140": 17.96,
                //                         "150": 18.10,
                //                         "160": 18.28,
                //                         "170": 18.48,
                //                         "180": 18.70,
                //                         "190": 18.92,
                //                         "200": 19.13,
                //                         "210": 19.36,
                //                         "220": 19.62,
                //                         "230": 19.88,
                //                         "240": 20.15,
                //                         "250": 20.42,
                //                         "260": 20.69,
                //                         "270": 20.96,
                //                         "280": 21.24,
                //                         "290": 21.52,
                //                         "300": 21.85
                //                     },
                //                     "422": {
                //                         "0": 18.21,
                //                         "10": 18.24,
                //                         "20": 18.27,
                //                         "30": 18.30,
                //                         "40": 18.34,
                //                         "50": 18.38,
                //                         "60": 18.42,
                //                         "70": 18.46,
                //                         "80": 18.52,
                //                         "90": 18.58,
                //                         "100": 18.63,
                //                         "110": 18.68,
                //                         "120": 18.71,
                //                         "130": 18.76,
                //                         "140": 18.85,
                //                         "150": 18.96,
                //                         "160": 19.10,
                //                         "170": 19.25,
                //                         "180": 19.42,
                //                         "190": 19.59,
                //                         "200": 19.76,
                //                         "210": 19.94,
                //                         "220": 20.13,
                //                         "230": 20.34,
                //                         "240": 20.54,
                //                         "250": 20.75,
                //                         "260": 20.96,
                //                         "270": 21.17,
                //                         "280": 21.38,
                //                         "290": 21.60,
                //                         "300": 21.85
                //                     },
                //                     "423": {
                //                         "0": 19.21,
                //                         "10": 19.24,
                //                         "20": 19.26,
                //                         "30": 19.29,
                //                         "40": 19.32,
                //                         "50": 19.36,
                //                         "60": 19.39,
                //                         "70": 19.43,
                //                         "80": 19.47,
                //                         "90": 19.52,
                //                         "100": 19.56,
                //                         "110": 19.60,
                //                         "120": 19.63,
                //                         "130": 19.67,
                //                         "140": 19.73,
                //                         "150": 19.82,
                //                         "160": 19.92,
                //                         "170": 20.03,
                //                         "180": 20.14,
                //                         "190": 20.27,
                //                         "200": 20.38,
                //                         "210": 20.51,
                //                         "220": 20.65,
                //                         "230": 20.79,
                //                         "240": 20.94,
                //                         "250": 21.08,
                //                         "260": 21.23,
                //                         "270": 21.37,
                //                         "280": 21.52,
                //                         "290": 21.68,
                //                         "300": 21.85
                //                     },
                //                     "424": {
                //                         "0": 20.21,
                //                         "10": 20.23,
                //                         "20": 20.26,
                //                         "30": 20.28,
                //                         "40": 20.31,
                //                         "50": 20.34,
                //                         "60": 20.36,
                //                         "70": 20.39,
                //                         "80": 20.43,
                //                         "90": 20.46,
                //                         "100": 20.49,
                //                         "110": 20.52,
                //                         "120": 20.55,
                //                         "130": 20.58,
                //                         "140": 20.62,
                //                         "150": 20.67,
                //                         "160": 20.73,
                //                         "170": 20.80,
                //                         "180": 20.87,
                //                         "190": 20.94,
                //                         "200": 21.01,
                //                         "210": 21.08,
                //                         "220": 21.16,
                //                         "230": 21.25,
                //                         "240": 21.33,
                //                         "250": 21.41,
                //                         "260": 21.49,
                //                         "270": 21.58,
                //                         "280": 21.66,
                //                         "290": 21.75,
                //                         "300": 21.85
                //                     },
                //                     "425": {
                //                         "0": 21.21,
                //                         "10": 21.23,
                //                         "20": 21.25,
                //                         "30": 21.27,
                //                         "40": 21.30,
                //                         "50": 21.32,
                //                         "60": 21.34,
                //                         "70": 21.36,
                //                         "80": 21.38,
                //                         "90": 21.40,
                //                         "100": 21.42,
                //                         "110": 21.44,
                //                         "120": 21.47,
                //                         "130": 21.49,
                //                         "140": 21.51,
                //                         "150": 21.53,
                //                         "160": 21.55,
                //                         "170": 21.57,
                //                         "180": 21.59,
                //                         "190": 21.61,
                //                         "200": 21.64,
                //                         "210": 21.66,
                //                         "220": 21.68,
                //                         "230": 21.70,
                //                         "240": 21.72,
                //                         "250": 21.74,
                //                         "260": 21.76,
                //                         "270": 21.78,
                //                         "280": 21.81,
                //                         "290": 21.83,
                //                         "300": 21.85
                //                     }
                //                 }

                //                 // Interpolating Grafton Rating Table
                //                 function interpolateValue(rating, point) {
                //                     const keys = Object.keys(ratingGrafton).map(Number);

                //                     // Find the two closest keys
                //                     let lowerKey = null, upperKey = null;

                //                     for (let i = 0; i < keys.length; i++) {
                //                         if (keys[i] <= rating) lowerKey = keys[i];
                //                         if (keys[i] > rating && upperKey === null) upperKey = keys[i];
                //                     }

                //                     if (lowerKey === null || upperKey === null) {
                //                         throw new Error('Rating out of bounds.');
                //                     }

                //                     const lowerValues = ratingGrafton[lowerKey];
                //                     const upperValues = ratingGrafton[upperKey];

                //                     // Find the two closest values within these ranges
                //                     const lowerPoints = Object.keys(lowerValues).map(Number);
                //                     const upperPoints = Object.keys(upperValues).map(Number);

                //                     let lowerPoint = null, upperPoint = null;

                //                     for (let i = 0; i < lowerPoints.length; i++) {
                //                         if (lowerPoints[i] <= point) lowerPoint = lowerPoints[i];
                //                         if (lowerPoints[i] > point && upperPoint === null) upperPoint = lowerPoints[i];
                //                     }

                //                     if (lowerPoint === null || upperPoint === null) {
                //                         throw new Error('Point out of bounds.');
                //                     }

                //                     const lowerValue = lowerValues[lowerPoint];
                //                     const upperValue = upperValues[upperPoint];

                //                     // Perform interpolation
                //                     const interpolatedValue = lowerValue + ((point - lowerPoint) / (upperPoint - lowerPoint)) * (upperValue - lowerValue);

                //                     return interpolatedValue;
                //                 }

                //                 // deltaFirst
                //                 const stage = yesterdayGraftonDownstreamStageRevValue2;
                //                 const flowRate = valueCompareOpenRiver;
                //                 const interpolatedValue = interpolateValue(stage, flowRate);

                //                 // console.log(`Interpolated value for stage ${stage} and flowRate ${flowRate}: ${interpolatedValue}`);

                //                 const deltaFirst = yesterdayGraftonStageRevValue - interpolatedValue;
                //                 // console.log("deltaFirst: ", deltaFirst);

                //                 // deltaSecond
                //                 const stage2 = todayGraftonNetmissDownstreamData;
                //                 const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand;
                //                 const interpolatedValue2 = interpolateValue(stage2, flowRate2);

                //                 // console.log(`Interpolated value for stage ${stage2} and flowRate ${flowRate2}: ${interpolatedValue2}`);

                //                 totalGrafton = deltaFirst + interpolatedValue2;
                //                 // console.log("totalGrafton: ", totalGrafton);

                //                 // push data to GraftonForecast
                //                 totalGraftonForecastDay2.push({ "value": totalGrafton });
                //                 GraftonForecast[location_id].push({ "value": totalGrafton });
                //             } else {
                //                 totalGrafton = 999;
                //                 // console.log("totalGrafton: ", totalGrafton);
                //             }
                //             // push data to GraftonForecast
                //             totalGraftonForecastDay2.push({ "value": totalGrafton });
                //             GraftonForecast[location_id].push({ "value": totalGrafton });
                //         }
                //     } else if (isGraftonForecastBasedUponLd25MPTw) {
                //         totalGrafton = yesterdayGraftonStageRevValue + (((todayGraftonUpstreamNetmissValue - yesterdayGraftonUpstreamStageRevValue) + (todayGraftonDownstreamNetmissStageValue - yesterdayGraftonDownstreamStageRevValue)) / 2);
                //         // console.log("totalGrafton: ", totalGrafton);

                //         // push data to GraftonForecast
                //         totalGraftonForecastDay2.push({ "value": totalGrafton });
                //         GraftonForecast[location_id].push({ "value": totalGrafton });
                //     } else {
                //         totalGrafton = 909;
                //         // console.log("totalGrafton: ", totalGrafton);

                //         // push data to GraftonForecast
                //         totalGraftonForecastDay2.push({ "value": totalGrafton });
                //         GraftonForecast[location_id].push({ "value": totalGrafton });
                //     }
                // }
            }

            if (totalGraftonForecastDay3 === totalGraftonForecastDay3) {
                if (location_id === "Grafton-Mississippi") {
                    // Get today grafton upstream netmiss value
                    const todayGraftonUpstreamNetmissValue = parseFloat(convertedNetmissForecastingPointUpstreamData.values[2][1]); // ************** change here
                    // console.log("todayGraftonUpstreamNetmissValue: ", todayGraftonUpstreamNetmissValue);
                    const todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                    // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);

                    // Get upstream grafton rating table and cooresponding today flow value 
                    const ratingGraftonTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point;
                    const todayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(todayGraftonUpstreamNetmissValuePlus001, ratingGraftonTableCoeUpstream);
                    // console.log("todayGraftonCorrespondingUpstreamNetmissFlowValue: (database rating is off from excel) ", todayGraftonCorrespondingUpstreamNetmissFlowValue);

                    // Get special gage 2 flow value
                    const convertedGraftonSpecialNetmissGage2FlowValuesToCst = convertUTCtoCentralTime(data20);
                    // console.log("convertedGraftonSpecialNetmissGage2FlowValuesToCst: ", convertedGraftonSpecialNetmissGage2FlowValuesToCst);
                    const todayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[3][1]; // ************** change here
                    // console.log("todayGraftonSpecialGage2NetmissFlowValue: ", todayGraftonSpecialGage2NetmissFlowValue);
                    const firstDayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[0][1]; // ************** change here (keep the same)
                    // console.log("firstDayGraftonSpecialGage2NetmissFlowValue: ", firstDayGraftonSpecialGage2NetmissFlowValue);

                    // Sum today grafton plus ld25tw
                    const sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = (parseFloat(todayGraftonSpecialGage2NetmissFlowValue) + parseFloat(todayGraftonCorrespondingUpstreamNetmissFlowValue)) / 1000;
                    // console.log("sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand: ", sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand);

                    const isGraftonForecastBasedUponLd25MPTw = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) > 300;
                    // console.log("isGraftonForecastBasedUponLd25MPTw: (True if > 300) ", isGraftonForecastBasedUponLd25MPTw);
                    const isGraftonForecastBasedUponOpenRiver = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) <= 300;
                    // console.log("isGraftonForecastBasedUponOpenRiver: (True if <= 300) ", isGraftonForecastBasedUponOpenRiver);

                    if (isGraftonForecastBasedUponOpenRiver) {
                        // console.log("isGraftonForecastBasedUponOpenRiver");

                        // Get downstream netmiss day1
                        const todayGraftonNetmissDownstreamData = convertUTCtoCentralTime(data4).values[2][1]; // ************** change here
                        // console.log("todayGraftonNetmissDownstreamData: ", todayGraftonNetmissDownstreamData);

                        // Get downstream netmiss stagerev
                        const todayGraftonDownstreamNetmissStageValue = data12.values[2][1]; // ************** change here
                        // console.log("todayGraftonDownstreamNetmissStageValue: ", todayGraftonDownstreamNetmissStageValue);

                        // Check mel price open river
                        const isMelPricePoolOpenRiver = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 > todayGraftonNetmissDownstreamData;
                        // console.log("isMelPricePoolOpenRiver: ", isMelPricePoolOpenRiver);

                        // Check mel price regulated pool
                        const isMelPricePoolRegulatedPool = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 <= todayGraftonNetmissDownstreamData;
                        // console.log("isMelPricePoolRegulatedPool: ", isMelPricePoolRegulatedPool);

                        // Condition 1 - Sub 1 - isMelPricePoolOpenRiver
                        if (isMelPricePoolOpenRiver) {
                            // // console.log("isMelPricePoolOpenRiver");
                        }

                        // Condition 1 - Sub 1 - isMelPricePoolRegulatedPool
                        if (isMelPricePoolRegulatedPool) {
                            // console.log("isMelPricePoolRegulatedPool");

                            // Get grafton yesterday stagerev value
                            const yesterdayGraftonStageRevValue = latest6AMValue.value;
                            // console.log("yesterdayGraftonStageRevValue: ", yesterdayGraftonStageRevValue);

                            // Get upstream grafton stage rev
                            const yesterdayGraftonUpstreamStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                            // console.log("yesterdayGraftonUpstreamStageRevValue: ", yesterdayGraftonUpstreamStageRevValue);
                            const yesterdayGraftonUpstreamStageRevValuePlus0001 = yesterdayGraftonUpstreamStageRevValue + 0.001;
                            // console.log("yesterdayGraftonUpstreamStageRevValuePlus0001: ", yesterdayGraftonUpstreamStageRevValuePlus0001);

                            const yesterdayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(yesterdayGraftonUpstreamStageRevValuePlus0001, ratingGraftonTableCoeUpstream);
                            // console.log("yesterdayGraftonCorrespondingUpstreamNetmissFlowValue: ", yesterdayGraftonCorrespondingUpstreamNetmissFlowValue);

                            const valueCompareOpenRiver = ((yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + firstDayGraftonSpecialGage2NetmissFlowValue) / 1000);
                            // console.log("valueCompareOpenRiver: ", valueCompareOpenRiver);

                            const isOpenRiverUseStageFlowRating = valueCompareOpenRiver > 300;
                            // console.log("isOpenRiverUseStageFlowRating : ", isOpenRiverUseStageFlowRating);

                            const isOpenRiverUseBackWater = valueCompareOpenRiver <= 300;
                            // console.log("isOpenRiverUseBackWater : ", isOpenRiverUseBackWater);

                            if (isOpenRiverUseBackWater) {
                                // console.log("isOpenRiverUseBackWater");

                                const yesterdayGraftonDownstreamStageRevValue2 = ((getLatest6AMValue(data22)).latest6AMValue).value;
                                // console.log("yesterdayGraftonDownstreamStageRevValue2: ", yesterdayGraftonDownstreamStageRevValue2);

                                const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                                // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                                let jsonFileName = "ratingGrafton.json";

                                // Call the function and log the result
                                const stage = yesterdayGraftonDownstreamStageRevValue2;
                                const flowRate = valueCompareOpenRiver;
                                // console.log("stage, flowRate, jsonFileName: ", stage, flowRate, jsonFileName);
                                readJSONTable2(stage, flowRate, jsonFileName).then(value => {
                                    if (value !== null) {
                                        // console.log(`Interpolated reading for flow rate ${flowRate} and stage ${stage} at table ${jsonFileName}: ${value}`);

                                        deltaYesterdayStage = yesterdayGraftonStageRevValue - value;
                                        // console.log("deltaYesterdayStage: ", deltaYesterdayStage);
                                    } else {
                                        // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                                    }
                                });

                                // Call the function and log the result
                                const stage2 = todayGraftonNetmissDownstreamData;
                                const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand;
                                // console.log("stage2, flowRate2, jsonFileName: ", stage2, flowRate2, jsonFileName);
                                readJSONTable2(stage2, flowRate2, jsonFileName).then(value => {
                                    if (value !== null) {
                                        // console.log(`Interpolated reading for flow rate ${flowRate2} and stage ${stage2} at table ${jsonFileName}: ${value}`);

                                        totalGrafton = value + deltaYesterdayStage;
                                        // console.log("totalGrafton: ", totalGrafton);

                                        // push data to GraftonForecast
                                        totalGraftonForecastDay3.push({ "value": totalGrafton }); // ************** change here
                                        GraftonForecast[location_id].push({ "value": totalGrafton });
                                    } else {
                                        // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                                    }
                                });
                            }
                        }

                    }
                }

                // // today
                // let todayGraftonDownstreamNetmissStageValue = null;
                // if (data12 !== null && location_id === "Grafton-Mississippi") {
                //     todayGraftonDownstreamNetmissStageValue = data12.values[1][1];
                //     // console.log("todayGraftonDownstreamNetmissStageValue: ", todayGraftonDownstreamNetmissStageValue);
                // }

                // let todayGraftonNetmissDownstreamData = null;
                // let isMelPricePoolOpenRiver = null;
                // if (data4 !== null && location_id === "Grafton-Mississippi") {
                //     todayGraftonNetmissDownstreamData = convertUTCtoCentralTime(data4).values[2][1]; // ************** change here
                //     isMelPricePoolOpenRiver = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 > todayGraftonNetmissDownstreamData;
                //     // console.log("todayGraftonNetmissDownstreamData: ", todayGraftonNetmissDownstreamData);
                //     // console.log("isMelPricePoolOpenRiver: ", isMelPricePoolOpenRiver);
                // }

                // // yesterday
                // let yesterdayGraftonStageRevValue = null;
                // if (data2 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonStageRevValue = latest6AMValue.value;
                //     // console.log("yesterdayGraftonStageRevValue: ", yesterdayGraftonStageRevValue);
                // }
                // let yesterdayGraftonUpstreamStageRevValue = null;
                // let yesterdayGraftonUpstreamStageRevValuePlus0001 = null;
                // if (data7 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonUpstreamStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                //     yesterdayGraftonUpstreamStageRevValuePlus0001 = yesterdayGraftonUpstreamStageRevValue + 0.001;
                //     // console.log("yesterdayGraftonUpstreamStageRevValue: ", yesterdayGraftonUpstreamStageRevValue);
                //     // console.log("yesterdayGraftonUpstreamStageRevValuePlus0001: ", yesterdayGraftonUpstreamStageRevValuePlus0001);
                // }
                // let yesterdayGraftonDownstreamStageRevValue = null;
                // if (data9 !== null && data22 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonDownstreamStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                //     yesterdayGraftonDownstreamStageRevValue2 = ((getLatest6AMValue(data22)).latest6AMValue).value;
                //     // console.log("yesterdayGraftonDownstreamStageRevValue: ", yesterdayGraftonDownstreamStageRevValue);
                //     // console.log("yesterdayGraftonDownstreamStageRevValue2: ", yesterdayGraftonDownstreamStageRevValue2);
                // }

                // // special gage 1
                // let yesterdayGraftonSpecialNetmissFlowValue = null;
                // let todayGraftonSpecialNetmissFlowValue = null;
                // if (data18 !== null && location_id === "Grafton-Mississippi") {
                //     const convertedGraftonSpecialNetmissFlowValuesToCst = convertUTCtoCentralTime(data18);
                //     yesterdayGraftonSpecialNetmissFlowValue = (convertedGraftonSpecialNetmissFlowValuesToCst.values[2][1]); // ************** change here
                //     todayGraftonSpecialNetmissFlowValue = (convertedGraftonSpecialNetmissFlowValuesToCst.values[3][1]); // ************** change here
                //     // console.log("convertedGraftonSpecialNetmissFlowValuesToCst: ", convertedGraftonSpecialNetmissFlowValuesToCst);
                //     // console.log("yesterdayGraftonSpecialNetmissFlowValue: ", yesterdayGraftonSpecialNetmissFlowValue);
                //     // console.log("todayGraftonSpecialNetmissFlowValue: ", todayGraftonSpecialNetmissFlowValue);
                // }
                // // Get rating tables
                // let ratingGraftonTableCoe = null;
                // let ratingGraftonTableCoeUpstream = null;
                // let ratingGraftonTableCoeDownstream = null;
                // let todayGraftonCorrespondingUpstreamNetmissFlowValue = null;
                // let todayGraftonCorrespondingDownstreamNetmissFlowValue = null;
                // let sumGraftonTodayHermannFlowPlusLd25TwFlow = null;
                // let sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = null;
                // if (data16 !== null && data17 !== null && data19 !== null && location_id === "Grafton-Mississippi") {
                //     ratingGraftonTableCoe = data16["simple-rating"]["rating-points"].point; // Grafton-Mississippi
                //     ratingGraftonTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point; // LD 25 TW-Mississippi // [0] because active[0] and inactive[1]
                //     ratingGraftonTableCoeDownstream = data19["simple-rating"]["rating-points"].point; // Mel Price TW-Mississippi

                //     // console.log("data16: ", data16);
                //     // console.log("data17: ", data17);
                //     // console.log("data19: ", data19);
                //     // console.log("ratingGraftonTableCoe: ", ratingGraftonTableCoe);
                //     // console.log("ratingGraftonTableCoeUpstream: ", ratingGraftonTableCoeUpstream);
                //     // console.log("ratingGraftonTableCoeDownstream: ", ratingGraftonTableCoeDownstream);


                //     // get rating tables from ratings.js
                //     // console.log("ratingStageFlowGrafton: ", ratingStageFlowGrafton);
                //     // console.log("ratingStageFlowLouisiana: ", ratingStageFlowLouisiana);
                //     // console.log("ratingStageFlowLd25Tw: ", ratingStageFlowLd25Tw);
                //     // console.log("ratingStageFlowMelPriceTw: ", ratingStageFlowMelPriceTw);

                //     todayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(todayGraftonUpstreamNetmissValuePlus001, ratingGraftonTableCoeUpstream);
                //     todayGraftonCorrespondingDownstreamNetmissFlowValue = findDepByInd(todayGraftonDownstreamNetmissStageValue, ratingGraftonTableCoeDownstream);
                //     // console.log("todayGraftonCorrespondingUpstreamNetmissFlowValue: (database rating is off from excel) ", todayGraftonCorrespondingUpstreamNetmissFlowValue);
                //     // console.log("todayGraftonCorrespondingDownstreamNetmissFlowValue: ", todayGraftonCorrespondingDownstreamNetmissFlowValue);

                //     // sum
                //     sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = (parseFloat(todayGraftonSpecialGage2NetmissFlowValue) + parseFloat(todayGraftonCorrespondingUpstreamNetmissFlowValue)) / 1000;
                //     // console.log("sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand: ", sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand);
                // }
                // let totalGrafton = null;
                // if (location_id === "Grafton-Mississippi") {
                //     const isGraftonForecastBasedUponLd25MPTw = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) > 300;
                //     // console.log("isGraftonForecastBasedUponLd25MPTw: (True if > 300) ", isGraftonForecastBasedUponLd25MPTw);

                //     const isGraftonForecastBasedUponOpenRiver = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) <= 300;
                //     // console.log("isGraftonForecastBasedUponOpenRiver: (True if <= 300) ", isGraftonForecastBasedUponOpenRiver);

                //     const yesterdayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(yesterdayGraftonUpstreamStageRevValuePlus0001, ratingGraftonTableCoeUpstream);
                //     // console.log("yesterdayGraftonCorrespondingUpstreamNetmissFlowValue: ", yesterdayGraftonCorrespondingUpstreamNetmissFlowValue);

                //     const valueCompareOpenRiver = ((yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + yesterdayGraftonSpecialGage2NetmissFlowValue) / 1000);
                //     // console.log("valueCompareOpenRiver: ", valueCompareOpenRiver);

                //     const isOpenRiverUseStageFlowRating = valueCompareOpenRiver > 300;
                //     // console.log("isOpenRiverUseStageFlowRating : ", isOpenRiverUseStageFlowRating);

                //     const isOpenRiverUseBackWater = valueCompareOpenRiver <= 300;
                //     // console.log("isOpenRiverUseBackWater : ", isOpenRiverUseBackWater);

                //     // Determine Grafton Forecast Based on Conditions
                //     if (isGraftonForecastBasedUponOpenRiver) {
                //         if (isMelPricePoolOpenRiver) {
                //             let deltaYesterdayStage = null;

                //             if (isOpenRiverUseStageFlowRating) {
                //                 const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                //                 // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                //                 const flowToSend = (yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + yesterdayGraftonSpecialGage2NetmissFlowValue);
                //                 // console.log("flowToSend: ", flowToSend);

                //                 const t = findIndByDep(flowToSend, ratingTableSpecial1);
                //                 // console.log("t: ", t);

                //                 deltaYesterdayStage = yesterdayGraftonStageRevValue - t;
                //                 // console.log("deltaYesterdayStage: ", deltaYesterdayStage);

                //                 const todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                //                 // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);

                //                 const todayFlowSum = todayGraftonCorrespondingUpstreamNetmissFlowValue + todayGraftonSpecialGage2NetmissFlowValue;
                //                 // console.log("todayFlowSum: ", todayFlowSum);

                //                 const x = todayGraftonDownstreamNetmissStageValue + 395.48 + 0.5;
                //                 // console.log("x: ", x);
                //             } else if (isOpenRiverUseBackWater) {
                //                 const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                //                 // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                //                 let jsonFileName = "ratingGrafton.json"; //"ratingGrafton.json";

                //                 // Call the function and log the result
                //                 const stage = yesterdayGraftonDownstreamStageRevValue2; // yesterdayGraftonDownstreamStageRevValue2
                //                 const flowRate = valueCompareOpenRiver; // valueCompareOpenRiver
                //                 // console.log("stage, flowRate, jsonFileName: ", stage, flowRate, jsonFileName);
                //                 readJSONTable2(stage, flowRate, jsonFileName).then(value => {
                //                     if (value !== null) {
                //                         // console.log(`Interpolated reading for flow rate ${flowRate} and stage ${stage} at table ${jsonFileName}: ${value}`);

                //                         deltaYesterdayStage = yesterdayGraftonStageRevValue - value;
                //                         // console.log("deltaYesterdayStage: ", deltaYesterdayStage);
                //                     } else {
                //                         // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                //                     }
                //                 });

                //                 // Call the function and log the result
                //                 const stage2 = todayGraftonDownstreamNetmissStageValue + 395.48 + 0.5; // yesterdayGraftonDownstreamStageRevValue2
                //                 const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand; // valueCompareOpenRiver
                //                 // console.log("stage2, flowRate2, jsonFileName: ", stage2, flowRate2, jsonFileName);
                //                 readJSONTable2(stage2, flowRate2, jsonFileName).then(value => {
                //                     if (value !== null) {
                //                         // console.log(`Interpolated reading for flow rate ${flowRate2} and stage ${stage2} at table ${jsonFileName}: ${value}`);

                //                         totalGrafton = value + deltaYesterdayStage;
                //                         // console.log("totalGrafton: ", totalGrafton);

                //                         // push data to GraftonForecast
                //                         totalGraftonForecastDay3.push({ "value": totalGrafton });
                //                         GraftonForecast[location_id].push({ "value": totalGrafton });
                //                     } else {
                //                         // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                //                     }
                //                 });
                //             }
                //         } else {
                //             // Regulated Pool
                //             if (isOpenRiverUseStageFlowRating) {

                //             } else if (isOpenRiverUseBackWater) {
                //                 // Grafton Rating Table
                //                 const ratingGrafton = {
                //                     "412": {
                //                         "0": 8.21,
                //                         "10": 8.56,
                //                         "20": 8.91,
                //                         "30": 9.27,
                //                         "40": 9.62,
                //                         "50": 9.98,
                //                         "60": 10.35,
                //                         "70": 10.71,
                //                         "80": 11.08,
                //                         "90": 11.45,
                //                         "100": 11.83,
                //                         "110": 12.20,
                //                         "120": 12.58,
                //                         "130": 12.96,
                //                         "140": 13.35,
                //                         "150": 13.73,
                //                         "160": 14.12,
                //                         "170": 14.52,
                //                         "180": 14.91,
                //                         "190": 15.31,
                //                         "200": 15.71,
                //                         "210": 16.11,
                //                         "220": 16.51,
                //                         "230": 16.91,
                //                         "240": 17.34,
                //                         "250": 17.82,
                //                         "260": 18.41,
                //                         "270": 19.12,
                //                         "280": 19.87,
                //                         "290": 20.80,
                //                         "300": 21.85
                //                     },
                //                     "413": {
                //                         "0": 9.21,
                //                         "10": 9.49,
                //                         "20": 9.78,
                //                         "30": 10.07,
                //                         "40": 10.37,
                //                         "50": 10.68,
                //                         "60": 10.99,
                //                         "70": 11.31,
                //                         "80": 11.64,
                //                         "90": 11.97,
                //                         "100": 12.31,
                //                         "110": 12.65,
                //                         "120": 13.00,
                //                         "130": 13.36,
                //                         "140": 13.72,
                //                         "150": 14.09,
                //                         "160": 14.47,
                //                         "170": 14.85,
                //                         "180": 15.24,
                //                         "190": 15.63,
                //                         "200": 16.03,
                //                         "210": 16.43,
                //                         "220": 16.83,
                //                         "230": 17.23,
                //                         "240": 17.66,
                //                         "250": 18.14,
                //                         "260": 18.73,
                //                         "270": 19.44,
                //                         "280": 20.19,
                //                         "290": 21.00,
                //                         "300": 21.85
                //                     },
                //                     "414": {
                //                         "0": 10.21,
                //                         "10": 10.42,
                //                         "20": 10.65,
                //                         "30": 10.88,
                //                         "40": 11.13,
                //                         "50": 11.38,
                //                         "60": 11.64,
                //                         "70": 11.91,
                //                         "80": 12.20,
                //                         "90": 12.49,
                //                         "100": 12.79,
                //                         "110": 13.10,
                //                         "120": 13.43,
                //                         "130": 13.76,
                //                         "140": 14.10,
                //                         "150": 14.45,
                //                         "160": 14.81,
                //                         "170": 15.18,
                //                         "180": 15.56,
                //                         "190": 15.95,
                //                         "200": 16.35,
                //                         "210": 16.75,
                //                         "220": 17.15,
                //                         "230": 17.55,
                //                         "240": 17.95,
                //                         "250": 18.42,
                //                         "260": 19.00,
                //                         "270": 19.68,
                //                         "280": 20.41,
                //                         "290": 21.13,
                //                         "300": 21.85
                //                     },
                //                     "415": {
                //                         "0": 11.21,
                //                         "10": 11.35,
                //                         "20": 11.51,
                //                         "30": 11.68,
                //                         "40": 11.87,
                //                         "50": 12.06,
                //                         "60": 12.28,
                //                         "70": 12.50,
                //                         "80": 12.74,
                //                         "90": 12.99,
                //                         "100": 13.25,
                //                         "110": 13.53,
                //                         "120": 13.82,
                //                         "130": 14.12,
                //                         "140": 14.44,
                //                         "150": 14.77,
                //                         "160": 15.11,
                //                         "170": 15.47,
                //                         "180": 15.84,
                //                         "190": 16.22,
                //                         "200": 16.60,
                //                         "210": 16.99,
                //                         "220": 17.39,
                //                         "230": 17.82,
                //                         "240": 18.20,
                //                         "250": 18.66,
                //                         "260": 19.21,
                //                         "270": 19.84,
                //                         "280": 20.51,
                //                         "290": 21.18,
                //                         "300": 21.85
                //                     },
                //                     "416": {
                //                         "0": 12.21,
                //                         "10": 12.28,
                //                         "20": 12.37,
                //                         "30": 12.48,
                //                         "40": 12.60,
                //                         "50": 12.74,
                //                         "60": 12.90,
                //                         "70": 13.07,
                //                         "80": 13.26,
                //                         "90": 13.47,
                //                         "100": 13.69,
                //                         "110": 13.94,
                //                         "120": 14.19,
                //                         "130": 14.47,
                //                         "140": 14.76,
                //                         "150": 15.07,
                //                         "160": 15.40,
                //                         "170": 15.74,
                //                         "180": 16.10,
                //                         "190": 16.46,
                //                         "200": 16.82,
                //                         "210": 17.20,
                //                         "220": 17.60,
                //                         "230": 18.00,
                //                         "240": 18.45,
                //                         "250": 18.90,
                //                         "260": 19.42,
                //                         "270": 20.00,
                //                         "280": 20.62,
                //                         "290": 21.23,
                //                         "300": 21.85
                //                     },
                //                     "417": {
                //                         "0": 13.21,
                //                         "10": 13.24,
                //                         "20": 13.28,
                //                         "30": 13.34,
                //                         "40": 13.42,
                //                         "50": 13.51,
                //                         "60": 13.62,
                //                         "70": 13.74,
                //                         "80": 13.88,
                //                         "90": 14.04,
                //                         "100": 14.21,
                //                         "110": 14.40,
                //                         "120": 14.63,
                //                         "130": 14.88,
                //                         "140": 15.16,
                //                         "150": 15.45,
                //                         "160": 15.76,
                //                         "170": 16.09,
                //                         "180": 16.44,
                //                         "190": 16.79,
                //                         "200": 17.16,
                //                         "210": 17.55,
                //                         "220": 17.94,
                //                         "230": 18.34,
                //                         "240": 18.78,
                //                         "250": 19.23,
                //                         "260": 19.73,
                //                         "270": 20.23,
                //                         "280": 20.73,
                //                         "290": 21.25,
                //                         "300": 21.85
                //                     },
                //                     "418": {
                //                         "0": 14.21,
                //                         "10": 14.24,
                //                         "20": 14.27,
                //                         "30": 14.32,
                //                         "40": 14.37,
                //                         "50": 14.44,
                //                         "60": 14.51,
                //                         "70": 14.60,
                //                         "80": 14.69,
                //                         "90": 14.79,
                //                         "100": 14.90,
                //                         "110": 15.02,
                //                         "120": 15.22,
                //                         "130": 15.45,
                //                         "140": 15.72,
                //                         "150": 16.00,
                //                         "160": 16.29,
                //                         "170": 16.60,
                //                         "180": 16.92,
                //                         "190": 17.25,
                //                         "200": 17.59,
                //                         "210": 17.95,
                //                         "220": 18.33,
                //                         "230": 18.72,
                //                         "240": 19.13,
                //                         "250": 19.55,
                //                         "260": 19.98,
                //                         "270": 20.40,
                //                         "280": 20.84,
                //                         "290": 21.29,
                //                         "300": 21.85
                //                     },
                //                     "419": {
                //                         "0": 15.21,
                //                         "10": 15.24,
                //                         "20": 15.27,
                //                         "30": 15.31,
                //                         "40": 15.36,
                //                         "50": 15.41,
                //                         "60": 15.47,
                //                         "70": 15.54,
                //                         "80": 15.62,
                //                         "90": 15.71,
                //                         "100": 15.82,
                //                         "110": 15.93,
                //                         "120": 16.04,
                //                         "130": 16.18,
                //                         "140": 16.36,
                //                         "150": 16.56,
                //                         "160": 16.79,
                //                         "170": 17.05,
                //                         "180": 17.34,
                //                         "190": 17.64,
                //                         "200": 17.95,
                //                         "210": 18.28,
                //                         "220": 18.65,
                //                         "230": 19.03,
                //                         "240": 19.42,
                //                         "250": 19.80,
                //                         "260": 20.19,
                //                         "270": 20.58,
                //                         "280": 20.98,
                //                         "290": 21.38,
                //                         "300": 21.85
                //                     },
                //                     "420": {
                //                         "0": 16.21,
                //                         "10": 16.24,
                //                         "20": 16.28,
                //                         "30": 16.32,
                //                         "40": 16.37,
                //                         "50": 16.42,
                //                         "60": 16.47,
                //                         "70": 16.53,
                //                         "80": 16.61,
                //                         "90": 16.69,
                //                         "100": 16.77,
                //                         "110": 16.83,
                //                         "120": 16.87,
                //                         "130": 16.94,
                //                         "140": 17.07,
                //                         "150": 17.25,
                //                         "160": 17.47,
                //                         "170": 17.71,
                //                         "180": 17.97,
                //                         "190": 18.25,
                //                         "200": 18.50,
                //                         "210": 18.79,
                //                         "220": 19.10,
                //                         "230": 19.43,
                //                         "240": 19.76,
                //                         "250": 20.09,
                //                         "260": 20.42,
                //                         "270": 20.76,
                //                         "280": 21.10,
                //                         "290": 21.45,
                //                         "300": 21.85
                //                     },
                //                     "421": {
                //                         "0": 17.21,
                //                         "10": 17.24,
                //                         "20": 17.27,
                //                         "30": 17.31,
                //                         "40": 17.35,
                //                         "50": 17.40,
                //                         "60": 17.44,
                //                         "70": 17.50,
                //                         "80": 17.56,
                //                         "90": 17.63,
                //                         "100": 17.70,
                //                         "110": 17.75,
                //                         "120": 17.79,
                //                         "130": 17.85,
                //                         "140": 17.96,
                //                         "150": 18.10,
                //                         "160": 18.28,
                //                         "170": 18.48,
                //                         "180": 18.70,
                //                         "190": 18.92,
                //                         "200": 19.13,
                //                         "210": 19.36,
                //                         "220": 19.62,
                //                         "230": 19.88,
                //                         "240": 20.15,
                //                         "250": 20.42,
                //                         "260": 20.69,
                //                         "270": 20.96,
                //                         "280": 21.24,
                //                         "290": 21.52,
                //                         "300": 21.85
                //                     },
                //                     "422": {
                //                         "0": 18.21,
                //                         "10": 18.24,
                //                         "20": 18.27,
                //                         "30": 18.30,
                //                         "40": 18.34,
                //                         "50": 18.38,
                //                         "60": 18.42,
                //                         "70": 18.46,
                //                         "80": 18.52,
                //                         "90": 18.58,
                //                         "100": 18.63,
                //                         "110": 18.68,
                //                         "120": 18.71,
                //                         "130": 18.76,
                //                         "140": 18.85,
                //                         "150": 18.96,
                //                         "160": 19.10,
                //                         "170": 19.25,
                //                         "180": 19.42,
                //                         "190": 19.59,
                //                         "200": 19.76,
                //                         "210": 19.94,
                //                         "220": 20.13,
                //                         "230": 20.34,
                //                         "240": 20.54,
                //                         "250": 20.75,
                //                         "260": 20.96,
                //                         "270": 21.17,
                //                         "280": 21.38,
                //                         "290": 21.60,
                //                         "300": 21.85
                //                     },
                //                     "423": {
                //                         "0": 19.21,
                //                         "10": 19.24,
                //                         "20": 19.26,
                //                         "30": 19.29,
                //                         "40": 19.32,
                //                         "50": 19.36,
                //                         "60": 19.39,
                //                         "70": 19.43,
                //                         "80": 19.47,
                //                         "90": 19.52,
                //                         "100": 19.56,
                //                         "110": 19.60,
                //                         "120": 19.63,
                //                         "130": 19.67,
                //                         "140": 19.73,
                //                         "150": 19.82,
                //                         "160": 19.92,
                //                         "170": 20.03,
                //                         "180": 20.14,
                //                         "190": 20.27,
                //                         "200": 20.38,
                //                         "210": 20.51,
                //                         "220": 20.65,
                //                         "230": 20.79,
                //                         "240": 20.94,
                //                         "250": 21.08,
                //                         "260": 21.23,
                //                         "270": 21.37,
                //                         "280": 21.52,
                //                         "290": 21.68,
                //                         "300": 21.85
                //                     },
                //                     "424": {
                //                         "0": 20.21,
                //                         "10": 20.23,
                //                         "20": 20.26,
                //                         "30": 20.28,
                //                         "40": 20.31,
                //                         "50": 20.34,
                //                         "60": 20.36,
                //                         "70": 20.39,
                //                         "80": 20.43,
                //                         "90": 20.46,
                //                         "100": 20.49,
                //                         "110": 20.52,
                //                         "120": 20.55,
                //                         "130": 20.58,
                //                         "140": 20.62,
                //                         "150": 20.67,
                //                         "160": 20.73,
                //                         "170": 20.80,
                //                         "180": 20.87,
                //                         "190": 20.94,
                //                         "200": 21.01,
                //                         "210": 21.08,
                //                         "220": 21.16,
                //                         "230": 21.25,
                //                         "240": 21.33,
                //                         "250": 21.41,
                //                         "260": 21.49,
                //                         "270": 21.58,
                //                         "280": 21.66,
                //                         "290": 21.75,
                //                         "300": 21.85
                //                     },
                //                     "425": {
                //                         "0": 21.21,
                //                         "10": 21.23,
                //                         "20": 21.25,
                //                         "30": 21.27,
                //                         "40": 21.30,
                //                         "50": 21.32,
                //                         "60": 21.34,
                //                         "70": 21.36,
                //                         "80": 21.38,
                //                         "90": 21.40,
                //                         "100": 21.42,
                //                         "110": 21.44,
                //                         "120": 21.47,
                //                         "130": 21.49,
                //                         "140": 21.51,
                //                         "150": 21.53,
                //                         "160": 21.55,
                //                         "170": 21.57,
                //                         "180": 21.59,
                //                         "190": 21.61,
                //                         "200": 21.64,
                //                         "210": 21.66,
                //                         "220": 21.68,
                //                         "230": 21.70,
                //                         "240": 21.72,
                //                         "250": 21.74,
                //                         "260": 21.76,
                //                         "270": 21.78,
                //                         "280": 21.81,
                //                         "290": 21.83,
                //                         "300": 21.85
                //                     }
                //                 }

                //                 // Interpolating Grafton Rating Table
                //                 function interpolateValue(rating, point) {
                //                     const keys = Object.keys(ratingGrafton).map(Number);

                //                     // Find the two closest keys
                //                     let lowerKey = null, upperKey = null;

                //                     for (let i = 0; i < keys.length; i++) {
                //                         if (keys[i] <= rating) lowerKey = keys[i];
                //                         if (keys[i] > rating && upperKey === null) upperKey = keys[i];
                //                     }

                //                     if (lowerKey === null || upperKey === null) {
                //                         throw new Error('Rating out of bounds.');
                //                     }

                //                     const lowerValues = ratingGrafton[lowerKey];
                //                     const upperValues = ratingGrafton[upperKey];

                //                     // Find the two closest values within these ranges
                //                     const lowerPoints = Object.keys(lowerValues).map(Number);
                //                     const upperPoints = Object.keys(upperValues).map(Number);

                //                     let lowerPoint = null, upperPoint = null;

                //                     for (let i = 0; i < lowerPoints.length; i++) {
                //                         if (lowerPoints[i] <= point) lowerPoint = lowerPoints[i];
                //                         if (lowerPoints[i] > point && upperPoint === null) upperPoint = lowerPoints[i];
                //                     }

                //                     if (lowerPoint === null || upperPoint === null) {
                //                         throw new Error('Point out of bounds.');
                //                     }

                //                     const lowerValue = lowerValues[lowerPoint];
                //                     const upperValue = upperValues[upperPoint];

                //                     // Perform interpolation
                //                     const interpolatedValue = lowerValue + ((point - lowerPoint) / (upperPoint - lowerPoint)) * (upperValue - lowerValue);

                //                     return interpolatedValue;
                //                 }

                //                 // deltaFirst
                //                 const stage = yesterdayGraftonDownstreamStageRevValue2;
                //                 const flowRate = valueCompareOpenRiver;
                //                 const interpolatedValue = interpolateValue(stage, flowRate);

                //                 // console.log(`Interpolated value for stage ${stage} and flowRate ${flowRate}: ${interpolatedValue}`);

                //                 const deltaFirst = yesterdayGraftonStageRevValue - interpolatedValue;
                //                 // console.log("deltaFirst: ", deltaFirst);

                //                 // deltaSecond
                //                 const stage2 = todayGraftonNetmissDownstreamData;
                //                 const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand;
                //                 const interpolatedValue2 = interpolateValue(stage2, flowRate2);

                //                 // console.log(`Interpolated value for stage ${stage2} and flowRate ${flowRate2}: ${interpolatedValue2}`);

                //                 totalGrafton = deltaFirst + interpolatedValue2;
                //                 // console.log("totalGrafton: ", totalGrafton);

                //                 // push data to GraftonForecast
                //                 totalGraftonForecastDay3.push({ "value": totalGrafton });
                //                 GraftonForecast[location_id].push({ "value": totalGrafton });
                //             } else {
                //                 totalGrafton = 999;
                //                 // console.log("totalGrafton: ", totalGrafton);
                //             }
                //             // push data to GraftonForecast
                //             totalGraftonForecastDay3.push({ "value": totalGrafton });
                //             GraftonForecast[location_id].push({ "value": totalGrafton });
                //         }
                //     } else if (isGraftonForecastBasedUponLd25MPTw) {
                //         totalGrafton = yesterdayGraftonStageRevValue + (((todayGraftonUpstreamNetmissValue - yesterdayGraftonUpstreamStageRevValue) + (todayGraftonDownstreamNetmissStageValue - yesterdayGraftonDownstreamStageRevValue)) / 2);
                //         // console.log("totalGrafton: ", totalGrafton);

                //         // push data to GraftonForecast
                //         totalGraftonForecastDay3.push({ "value": totalGrafton });
                //         GraftonForecast[location_id].push({ "value": totalGrafton });
                //     } else {
                //         totalGrafton = 909;
                //         // console.log("totalGrafton: ", totalGrafton);

                //         // push data to GraftonForecast
                //         totalGraftonForecastDay3.push({ "value": totalGrafton });
                //         GraftonForecast[location_id].push({ "value": totalGrafton });
                //     }
                // }
            }

            if (totalGraftonForecastDay4 === totalGraftonForecastDay4) {
                if (location_id === "Grafton-Mississippi") {
                    // Get today grafton upstream netmiss value
                    const todayGraftonUpstreamNetmissValue = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]); // ************** change here
                    // console.log("todayGraftonUpstreamNetmissValue: ", todayGraftonUpstreamNetmissValue);
                    const todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                    // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);

                    // Get upstream grafton rating table and cooresponding today flow value 
                    const ratingGraftonTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point;
                    const todayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(todayGraftonUpstreamNetmissValuePlus001, ratingGraftonTableCoeUpstream);
                    // console.log("todayGraftonCorrespondingUpstreamNetmissFlowValue: (database rating is off from excel) ", todayGraftonCorrespondingUpstreamNetmissFlowValue);

                    // Get special gage 2 flow value
                    const convertedGraftonSpecialNetmissGage2FlowValuesToCst = convertUTCtoCentralTime(data20);
                    // console.log("convertedGraftonSpecialNetmissGage2FlowValuesToCst: ", convertedGraftonSpecialNetmissGage2FlowValuesToCst);
                    const todayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[4][1]; // ************** change here
                    // console.log("todayGraftonSpecialGage2NetmissFlowValue: ", todayGraftonSpecialGage2NetmissFlowValue);
                    const firstDayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[0][1]; // ************** change here (keep the same)
                    // console.log("firstDayGraftonSpecialGage2NetmissFlowValue: ", firstDayGraftonSpecialGage2NetmissFlowValue);

                    // Sum today grafton plus ld25tw
                    const sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = (parseFloat(todayGraftonSpecialGage2NetmissFlowValue) + parseFloat(todayGraftonCorrespondingUpstreamNetmissFlowValue)) / 1000;
                    // console.log("sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand: ", sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand);

                    const isGraftonForecastBasedUponLd25MPTw = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) > 300;
                    // console.log("isGraftonForecastBasedUponLd25MPTw: (True if > 300) ", isGraftonForecastBasedUponLd25MPTw);
                    const isGraftonForecastBasedUponOpenRiver = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) <= 300;
                    // console.log("isGraftonForecastBasedUponOpenRiver: (True if <= 300) ", isGraftonForecastBasedUponOpenRiver);

                    if (isGraftonForecastBasedUponOpenRiver) {
                        // console.log("isGraftonForecastBasedUponOpenRiver");

                        // Get downstream netmiss day1
                        const todayGraftonNetmissDownstreamData = convertUTCtoCentralTime(data4).values[3][1]; // ************** change here
                        // console.log("todayGraftonNetmissDownstreamData: ", todayGraftonNetmissDownstreamData);

                        // Get downstream netmiss stagerev
                        const todayGraftonDownstreamNetmissStageValue = data12.values[3][1]; // ************** change here
                        // console.log("todayGraftonDownstreamNetmissStageValue: ", todayGraftonDownstreamNetmissStageValue);

                        // Check mel price open river
                        const isMelPricePoolOpenRiver = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 > todayGraftonNetmissDownstreamData;
                        // console.log("isMelPricePoolOpenRiver: ", isMelPricePoolOpenRiver);

                        // Check mel price regulated pool
                        const isMelPricePoolRegulatedPool = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 <= todayGraftonNetmissDownstreamData;
                        // console.log("isMelPricePoolRegulatedPool: ", isMelPricePoolRegulatedPool);

                        // Condition 1 - Sub 1 - isMelPricePoolOpenRiver
                        if (isMelPricePoolOpenRiver) {
                            // console.log("isMelPricePoolOpenRiver");
                        }

                        // Condition 1 - Sub 1 - isMelPricePoolRegulatedPool
                        if (isMelPricePoolRegulatedPool) {
                            // console.log("isMelPricePoolRegulatedPool");

                            // Get grafton yesterday stagerev value
                            const yesterdayGraftonStageRevValue = latest6AMValue.value;
                            // console.log("yesterdayGraftonStageRevValue: ", yesterdayGraftonStageRevValue);

                            // Get upstream grafton stage rev
                            const yesterdayGraftonUpstreamStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                            // console.log("yesterdayGraftonUpstreamStageRevValue: ", yesterdayGraftonUpstreamStageRevValue);
                            const yesterdayGraftonUpstreamStageRevValuePlus0001 = yesterdayGraftonUpstreamStageRevValue + 0.001;
                            // console.log("yesterdayGraftonUpstreamStageRevValuePlus0001: ", yesterdayGraftonUpstreamStageRevValuePlus0001);

                            const yesterdayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(yesterdayGraftonUpstreamStageRevValuePlus0001, ratingGraftonTableCoeUpstream);
                            // console.log("yesterdayGraftonCorrespondingUpstreamNetmissFlowValue: ", yesterdayGraftonCorrespondingUpstreamNetmissFlowValue);

                            const valueCompareOpenRiver = ((yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + firstDayGraftonSpecialGage2NetmissFlowValue) / 1000);
                            // console.log("valueCompareOpenRiver: ", valueCompareOpenRiver);

                            const isOpenRiverUseStageFlowRating = valueCompareOpenRiver > 300;
                            // console.log("isOpenRiverUseStageFlowRating : ", isOpenRiverUseStageFlowRating);

                            const isOpenRiverUseBackWater = valueCompareOpenRiver <= 300;
                            // console.log("isOpenRiverUseBackWater : ", isOpenRiverUseBackWater);

                            if (isOpenRiverUseBackWater) {
                                // console.log("isOpenRiverUseBackWater");

                                const yesterdayGraftonDownstreamStageRevValue2 = ((getLatest6AMValue(data22)).latest6AMValue).value;
                                // console.log("yesterdayGraftonDownstreamStageRevValue2: ", yesterdayGraftonDownstreamStageRevValue2);

                                const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                                // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                                let jsonFileName = "ratingGrafton.json";

                                // Call the function and log the result
                                const stage = yesterdayGraftonDownstreamStageRevValue2;
                                const flowRate = valueCompareOpenRiver;
                                // console.log("stage, flowRate, jsonFileName: ", stage, flowRate, jsonFileName);
                                readJSONTable2(stage, flowRate, jsonFileName).then(value => {
                                    if (value !== null) {
                                        // console.log(`Interpolated reading for flow rate ${flowRate} and stage ${stage} at table ${jsonFileName}: ${value}`);

                                        deltaYesterdayStage = yesterdayGraftonStageRevValue - value;
                                        // console.log("deltaYesterdayStage: ", deltaYesterdayStage);
                                    } else {
                                        // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                                    }
                                });

                                // Call the function and log the result
                                const stage2 = todayGraftonNetmissDownstreamData;
                                const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand;
                                // console.log("stage2, flowRate2, jsonFileName: ", stage2, flowRate2, jsonFileName);
                                readJSONTable2(stage2, flowRate2, jsonFileName).then(value => {
                                    if (value !== null) {
                                        // console.log(`Interpolated reading for flow rate ${flowRate2} and stage ${stage2} at table ${jsonFileName}: ${value}`);

                                        totalGrafton = value + deltaYesterdayStage;
                                        // console.log("totalGrafton: ", totalGrafton);

                                        // push data to GraftonForecast
                                        totalGraftonForecastDay4.push({ "value": totalGrafton }); // ************** change here
                                        GraftonForecast[location_id].push({ "value": totalGrafton });
                                    } else {
                                        // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                                    }
                                });
                            }
                        }

                    }
                }

                // // today
                // let todayGraftonUpstreamNetmissValue = null;
                // let todayGraftonUpstreamNetmissValuePlus001 = null;
                // if (data11 !== null && location_id === "Grafton-Mississippi") {
                //     todayGraftonUpstreamNetmissValue = parseFloat(convertedNetmissForecastingPointUpstreamData.values[3][1]); // ************** change here
                //     todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                //     // console.log("todayGraftonUpstreamNetmissValue: ", todayGraftonUpstreamNetmissValue);
                //     // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);
                // }
                // let todayGraftonDownstreamNetmissStageValue = null;
                // if (data12 !== null && location_id === "Grafton-Mississippi") {
                //     todayGraftonDownstreamNetmissStageValue = data12.values[1][1];
                //     // console.log("todayGraftonDownstreamNetmissStageValue: ", todayGraftonDownstreamNetmissStageValue);
                // }

                // let todayGraftonNetmissDownstreamData = null;
                // let isMelPricePoolOpenRiver = null;
                // if (data4 !== null && location_id === "Grafton-Mississippi") {
                //     todayGraftonNetmissDownstreamData = convertUTCtoCentralTime(data4).values[3][1]; // ************** change here
                //     isMelPricePoolOpenRiver = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 > todayGraftonNetmissDownstreamData;
                //     // console.log("todayGraftonNetmissDownstreamData: ", todayGraftonNetmissDownstreamData);
                //     // console.log("isMelPricePoolOpenRiver: ", isMelPricePoolOpenRiver);
                // }

                // // yesterday
                // let yesterdayGraftonStageRevValue = null;
                // if (data2 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonStageRevValue = latest6AMValue.value;
                //     // console.log("yesterdayGraftonStageRevValue: ", yesterdayGraftonStageRevValue);
                // }
                // let yesterdayGraftonUpstreamStageRevValue = null;
                // let yesterdayGraftonUpstreamStageRevValuePlus0001 = null;
                // if (data7 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonUpstreamStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                //     yesterdayGraftonUpstreamStageRevValuePlus0001 = yesterdayGraftonUpstreamStageRevValue + 0.001;
                //     // console.log("yesterdayGraftonUpstreamStageRevValue: ", yesterdayGraftonUpstreamStageRevValue);
                //     // console.log("yesterdayGraftonUpstreamStageRevValuePlus0001: ", yesterdayGraftonUpstreamStageRevValuePlus0001);
                // }
                // let yesterdayGraftonDownstreamStageRevValue = null;
                // if (data9 !== null && data22 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonDownstreamStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                //     yesterdayGraftonDownstreamStageRevValue2 = ((getLatest6AMValue(data22)).latest6AMValue).value;
                //     // console.log("yesterdayGraftonDownstreamStageRevValue: ", yesterdayGraftonDownstreamStageRevValue);
                //     // console.log("yesterdayGraftonDownstreamStageRevValue2: ", yesterdayGraftonDownstreamStageRevValue2);
                // }

                // // special gage 1
                // let yesterdayGraftonSpecialNetmissFlowValue = null;
                // let todayGraftonSpecialNetmissFlowValue = null;
                // if (data18 !== null && location_id === "Grafton-Mississippi") {
                //     const convertedGraftonSpecialNetmissFlowValuesToCst = convertUTCtoCentralTime(data18);
                //     yesterdayGraftonSpecialNetmissFlowValue = (convertedGraftonSpecialNetmissFlowValuesToCst.values[3][1]); // ************** change here
                //     todayGraftonSpecialNetmissFlowValue = (convertedGraftonSpecialNetmissFlowValuesToCst.values[4][1]); // ************** change here
                //     // console.log("convertedGraftonSpecialNetmissFlowValuesToCst: ", convertedGraftonSpecialNetmissFlowValuesToCst);
                //     // console.log("yesterdayGraftonSpecialNetmissFlowValue: ", yesterdayGraftonSpecialNetmissFlowValue);
                //     // console.log("todayGraftonSpecialNetmissFlowValue: ", todayGraftonSpecialNetmissFlowValue);
                // }

                // // Special gage 2
                // let yesterdayGraftonSpecialGage2NetmissFlowValue = null;
                // let todayGraftonSpecialGage2NetmissFlowValue = null;
                // if (data20 !== null && location_id === "Grafton-Mississippi") {
                //     const convertedGraftonSpecialNetmissGage2FlowValuesToCst = convertUTCtoCentralTime(data20);
                //     yesterdayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[3][1]; // ************** change here
                //     todayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[4][1]; // ************** change here
                //     // console.log("convertedGraftonSpecialNetmissGage2FlowValuesToCst: ", convertedGraftonSpecialNetmissGage2FlowValuesToCst);
                //     // console.log("yesterdayGraftonSpecialGage2NetmissFlowValue: ", yesterdayGraftonSpecialGage2NetmissFlowValue);
                //     // console.log("todayGraftonSpecialGage2NetmissFlowValue: ", todayGraftonSpecialGage2NetmissFlowValue);
                // }

                // // Get rating tables
                // let ratingGraftonTableCoe = null;
                // let ratingGraftonTableCoeUpstream = null;
                // let ratingGraftonTableCoeDownstream = null;
                // let todayGraftonCorrespondingUpstreamNetmissFlowValue = null;
                // let todayGraftonCorrespondingDownstreamNetmissFlowValue = null;
                // let sumGraftonTodayHermannFlowPlusLd25TwFlow = null;
                // let sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = null;
                // if (data16 !== null && data17 !== null && data19 !== null && location_id === "Grafton-Mississippi") {
                //     ratingGraftonTableCoe = data16["simple-rating"]["rating-points"].point; // Grafton-Mississippi
                //     ratingGraftonTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point; // LD 25 TW-Mississippi // [0] because active[0] and inactive[1]
                //     ratingGraftonTableCoeDownstream = data19["simple-rating"]["rating-points"].point; // Mel Price TW-Mississippi

                //     // console.log("data16: ", data16);
                //     // console.log("data17: ", data17);
                //     // console.log("data19: ", data19);
                //     // console.log("ratingGraftonTableCoe: ", ratingGraftonTableCoe);
                //     // console.log("ratingGraftonTableCoeUpstream: ", ratingGraftonTableCoeUpstream);
                //     // console.log("ratingGraftonTableCoeDownstream: ", ratingGraftonTableCoeDownstream);


                //     // get rating tables from ratings.js
                //     // console.log("ratingStageFlowGrafton: ", ratingStageFlowGrafton);
                //     // console.log("ratingStageFlowLouisiana: ", ratingStageFlowLouisiana);
                //     // console.log("ratingStageFlowLd25Tw: ", ratingStageFlowLd25Tw);
                //     // console.log("ratingStageFlowMelPriceTw: ", ratingStageFlowMelPriceTw);

                //     todayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(todayGraftonUpstreamNetmissValuePlus001, ratingGraftonTableCoeUpstream);
                //     todayGraftonCorrespondingDownstreamNetmissFlowValue = findDepByInd(todayGraftonDownstreamNetmissStageValue, ratingGraftonTableCoeDownstream);
                //     // console.log("todayGraftonCorrespondingUpstreamNetmissFlowValue: (database rating is off from excel) ", todayGraftonCorrespondingUpstreamNetmissFlowValue);
                //     // console.log("todayGraftonCorrespondingDownstreamNetmissFlowValue: ", todayGraftonCorrespondingDownstreamNetmissFlowValue);

                //     // sum
                //     sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = (parseFloat(todayGraftonSpecialGage2NetmissFlowValue) + parseFloat(todayGraftonCorrespondingUpstreamNetmissFlowValue)) / 1000;
                //     // console.log("sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand: ", sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand);
                // }

                // let totalGrafton = null;

                // if (location_id === "Grafton-Mississippi") {
                //     const isGraftonForecastBasedUponLd25MPTw = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) > 300;
                //     // console.log("isGraftonForecastBasedUponLd25MPTw: (True if > 300) ", isGraftonForecastBasedUponLd25MPTw);

                //     const isGraftonForecastBasedUponOpenRiver = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) <= 300;
                //     // console.log("isGraftonForecastBasedUponOpenRiver: (True if <= 300) ", isGraftonForecastBasedUponOpenRiver);

                //     const yesterdayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(yesterdayGraftonUpstreamStageRevValuePlus0001, ratingGraftonTableCoeUpstream);
                //     // console.log("yesterdayGraftonCorrespondingUpstreamNetmissFlowValue: ", yesterdayGraftonCorrespondingUpstreamNetmissFlowValue);

                //     const valueCompareOpenRiver = ((yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + yesterdayGraftonSpecialGage2NetmissFlowValue) / 1000);
                //     // console.log("valueCompareOpenRiver: ", valueCompareOpenRiver);

                //     const isOpenRiverUseStageFlowRating = valueCompareOpenRiver > 300;
                //     // console.log("isOpenRiverUseStageFlowRating : ", isOpenRiverUseStageFlowRating);

                //     const isOpenRiverUseBackWater = valueCompareOpenRiver <= 300;
                //     // console.log("isOpenRiverUseBackWater : ", isOpenRiverUseBackWater);

                //     // Determine Grafton Forecast Based on Conditions
                //     if (isGraftonForecastBasedUponOpenRiver) {
                //         if (isMelPricePoolOpenRiver) {
                //             let deltaYesterdayStage = null;

                //             if (isOpenRiverUseStageFlowRating) {
                //                 const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                //                 // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                //                 const flowToSend = (yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + yesterdayGraftonSpecialGage2NetmissFlowValue);
                //                 // console.log("flowToSend: ", flowToSend);

                //                 const t = findIndByDep(flowToSend, ratingTableSpecial1);
                //                 // console.log("t: ", t);

                //                 deltaYesterdayStage = yesterdayGraftonStageRevValue - t;
                //                 // console.log("deltaYesterdayStage: ", deltaYesterdayStage);

                //                 const todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                //                 // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);

                //                 const todayFlowSum = todayGraftonCorrespondingUpstreamNetmissFlowValue + todayGraftonSpecialGage2NetmissFlowValue;
                //                 // console.log("todayFlowSum: ", todayFlowSum);

                //                 const x = todayGraftonDownstreamNetmissStageValue + 395.48 + 0.5;
                //                 // console.log("x: ", x);
                //             } else if (isOpenRiverUseBackWater) {
                //                 const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                //                 // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                //                 let jsonFileName = "ratingGrafton.json"; //"ratingGrafton.json";

                //                 // Call the function and log the result
                //                 const stage = yesterdayGraftonDownstreamStageRevValue2; // yesterdayGraftonDownstreamStageRevValue2
                //                 const flowRate = valueCompareOpenRiver; // valueCompareOpenRiver
                //                 // console.log("stage, flowRate, jsonFileName: ", stage, flowRate, jsonFileName);
                //                 readJSONTable2(stage, flowRate, jsonFileName).then(value => {
                //                     if (value !== null) {
                //                         // console.log(`Interpolated reading for flow rate ${flowRate} and stage ${stage} at table ${jsonFileName}: ${value}`);

                //                         deltaYesterdayStage = yesterdayGraftonStageRevValue - value;
                //                         // console.log("deltaYesterdayStage: ", deltaYesterdayStage);
                //                     } else {
                //                         // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                //                     }
                //                 });

                //                 // Call the function and log the result
                //                 const stage2 = todayGraftonDownstreamNetmissStageValue + 395.48 + 0.5; // yesterdayGraftonDownstreamStageRevValue2
                //                 const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand; // valueCompareOpenRiver
                //                 // console.log("stage2, flowRate2, jsonFileName: ", stage2, flowRate2, jsonFileName);
                //                 readJSONTable2(stage2, flowRate2, jsonFileName).then(value => {
                //                     if (value !== null) {
                //                         // console.log(`Interpolated reading for flow rate ${flowRate2} and stage ${stage2} at table ${jsonFileName}: ${value}`);

                //                         totalGrafton = value + deltaYesterdayStage;
                //                         // console.log("totalGrafton: ", totalGrafton);

                //                         // push data to GraftonForecast
                //                         totalGraftonForecastDay4.push({ "value": totalGrafton });
                //                         GraftonForecast[location_id].push({ "value": totalGrafton });
                //                     } else {
                //                         // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                //                     }
                //                 });
                //             }
                //         } else {
                //             // Regulated Pool
                //             if (isOpenRiverUseStageFlowRating) {

                //             } else if (isOpenRiverUseBackWater) {
                //                 // Grafton Rating Table
                //                 const ratingGrafton = {
                //                     "412": {
                //                         "0": 8.21,
                //                         "10": 8.56,
                //                         "20": 8.91,
                //                         "30": 9.27,
                //                         "40": 9.62,
                //                         "50": 9.98,
                //                         "60": 10.35,
                //                         "70": 10.71,
                //                         "80": 11.08,
                //                         "90": 11.45,
                //                         "100": 11.83,
                //                         "110": 12.20,
                //                         "120": 12.58,
                //                         "130": 12.96,
                //                         "140": 13.35,
                //                         "150": 13.73,
                //                         "160": 14.12,
                //                         "170": 14.52,
                //                         "180": 14.91,
                //                         "190": 15.31,
                //                         "200": 15.71,
                //                         "210": 16.11,
                //                         "220": 16.51,
                //                         "230": 16.91,
                //                         "240": 17.34,
                //                         "250": 17.82,
                //                         "260": 18.41,
                //                         "270": 19.12,
                //                         "280": 19.87,
                //                         "290": 20.80,
                //                         "300": 21.85
                //                     },
                //                     "413": {
                //                         "0": 9.21,
                //                         "10": 9.49,
                //                         "20": 9.78,
                //                         "30": 10.07,
                //                         "40": 10.37,
                //                         "50": 10.68,
                //                         "60": 10.99,
                //                         "70": 11.31,
                //                         "80": 11.64,
                //                         "90": 11.97,
                //                         "100": 12.31,
                //                         "110": 12.65,
                //                         "120": 13.00,
                //                         "130": 13.36,
                //                         "140": 13.72,
                //                         "150": 14.09,
                //                         "160": 14.47,
                //                         "170": 14.85,
                //                         "180": 15.24,
                //                         "190": 15.63,
                //                         "200": 16.03,
                //                         "210": 16.43,
                //                         "220": 16.83,
                //                         "230": 17.23,
                //                         "240": 17.66,
                //                         "250": 18.14,
                //                         "260": 18.73,
                //                         "270": 19.44,
                //                         "280": 20.19,
                //                         "290": 21.00,
                //                         "300": 21.85
                //                     },
                //                     "414": {
                //                         "0": 10.21,
                //                         "10": 10.42,
                //                         "20": 10.65,
                //                         "30": 10.88,
                //                         "40": 11.13,
                //                         "50": 11.38,
                //                         "60": 11.64,
                //                         "70": 11.91,
                //                         "80": 12.20,
                //                         "90": 12.49,
                //                         "100": 12.79,
                //                         "110": 13.10,
                //                         "120": 13.43,
                //                         "130": 13.76,
                //                         "140": 14.10,
                //                         "150": 14.45,
                //                         "160": 14.81,
                //                         "170": 15.18,
                //                         "180": 15.56,
                //                         "190": 15.95,
                //                         "200": 16.35,
                //                         "210": 16.75,
                //                         "220": 17.15,
                //                         "230": 17.55,
                //                         "240": 17.95,
                //                         "250": 18.42,
                //                         "260": 19.00,
                //                         "270": 19.68,
                //                         "280": 20.41,
                //                         "290": 21.13,
                //                         "300": 21.85
                //                     },
                //                     "415": {
                //                         "0": 11.21,
                //                         "10": 11.35,
                //                         "20": 11.51,
                //                         "30": 11.68,
                //                         "40": 11.87,
                //                         "50": 12.06,
                //                         "60": 12.28,
                //                         "70": 12.50,
                //                         "80": 12.74,
                //                         "90": 12.99,
                //                         "100": 13.25,
                //                         "110": 13.53,
                //                         "120": 13.82,
                //                         "130": 14.12,
                //                         "140": 14.44,
                //                         "150": 14.77,
                //                         "160": 15.11,
                //                         "170": 15.47,
                //                         "180": 15.84,
                //                         "190": 16.22,
                //                         "200": 16.60,
                //                         "210": 16.99,
                //                         "220": 17.39,
                //                         "230": 17.82,
                //                         "240": 18.20,
                //                         "250": 18.66,
                //                         "260": 19.21,
                //                         "270": 19.84,
                //                         "280": 20.51,
                //                         "290": 21.18,
                //                         "300": 21.85
                //                     },
                //                     "416": {
                //                         "0": 12.21,
                //                         "10": 12.28,
                //                         "20": 12.37,
                //                         "30": 12.48,
                //                         "40": 12.60,
                //                         "50": 12.74,
                //                         "60": 12.90,
                //                         "70": 13.07,
                //                         "80": 13.26,
                //                         "90": 13.47,
                //                         "100": 13.69,
                //                         "110": 13.94,
                //                         "120": 14.19,
                //                         "130": 14.47,
                //                         "140": 14.76,
                //                         "150": 15.07,
                //                         "160": 15.40,
                //                         "170": 15.74,
                //                         "180": 16.10,
                //                         "190": 16.46,
                //                         "200": 16.82,
                //                         "210": 17.20,
                //                         "220": 17.60,
                //                         "230": 18.00,
                //                         "240": 18.45,
                //                         "250": 18.90,
                //                         "260": 19.42,
                //                         "270": 20.00,
                //                         "280": 20.62,
                //                         "290": 21.23,
                //                         "300": 21.85
                //                     },
                //                     "417": {
                //                         "0": 13.21,
                //                         "10": 13.24,
                //                         "20": 13.28,
                //                         "30": 13.34,
                //                         "40": 13.42,
                //                         "50": 13.51,
                //                         "60": 13.62,
                //                         "70": 13.74,
                //                         "80": 13.88,
                //                         "90": 14.04,
                //                         "100": 14.21,
                //                         "110": 14.40,
                //                         "120": 14.63,
                //                         "130": 14.88,
                //                         "140": 15.16,
                //                         "150": 15.45,
                //                         "160": 15.76,
                //                         "170": 16.09,
                //                         "180": 16.44,
                //                         "190": 16.79,
                //                         "200": 17.16,
                //                         "210": 17.55,
                //                         "220": 17.94,
                //                         "230": 18.34,
                //                         "240": 18.78,
                //                         "250": 19.23,
                //                         "260": 19.73,
                //                         "270": 20.23,
                //                         "280": 20.73,
                //                         "290": 21.25,
                //                         "300": 21.85
                //                     },
                //                     "418": {
                //                         "0": 14.21,
                //                         "10": 14.24,
                //                         "20": 14.27,
                //                         "30": 14.32,
                //                         "40": 14.37,
                //                         "50": 14.44,
                //                         "60": 14.51,
                //                         "70": 14.60,
                //                         "80": 14.69,
                //                         "90": 14.79,
                //                         "100": 14.90,
                //                         "110": 15.02,
                //                         "120": 15.22,
                //                         "130": 15.45,
                //                         "140": 15.72,
                //                         "150": 16.00,
                //                         "160": 16.29,
                //                         "170": 16.60,
                //                         "180": 16.92,
                //                         "190": 17.25,
                //                         "200": 17.59,
                //                         "210": 17.95,
                //                         "220": 18.33,
                //                         "230": 18.72,
                //                         "240": 19.13,
                //                         "250": 19.55,
                //                         "260": 19.98,
                //                         "270": 20.40,
                //                         "280": 20.84,
                //                         "290": 21.29,
                //                         "300": 21.85
                //                     },
                //                     "419": {
                //                         "0": 15.21,
                //                         "10": 15.24,
                //                         "20": 15.27,
                //                         "30": 15.31,
                //                         "40": 15.36,
                //                         "50": 15.41,
                //                         "60": 15.47,
                //                         "70": 15.54,
                //                         "80": 15.62,
                //                         "90": 15.71,
                //                         "100": 15.82,
                //                         "110": 15.93,
                //                         "120": 16.04,
                //                         "130": 16.18,
                //                         "140": 16.36,
                //                         "150": 16.56,
                //                         "160": 16.79,
                //                         "170": 17.05,
                //                         "180": 17.34,
                //                         "190": 17.64,
                //                         "200": 17.95,
                //                         "210": 18.28,
                //                         "220": 18.65,
                //                         "230": 19.03,
                //                         "240": 19.42,
                //                         "250": 19.80,
                //                         "260": 20.19,
                //                         "270": 20.58,
                //                         "280": 20.98,
                //                         "290": 21.38,
                //                         "300": 21.85
                //                     },
                //                     "420": {
                //                         "0": 16.21,
                //                         "10": 16.24,
                //                         "20": 16.28,
                //                         "30": 16.32,
                //                         "40": 16.37,
                //                         "50": 16.42,
                //                         "60": 16.47,
                //                         "70": 16.53,
                //                         "80": 16.61,
                //                         "90": 16.69,
                //                         "100": 16.77,
                //                         "110": 16.83,
                //                         "120": 16.87,
                //                         "130": 16.94,
                //                         "140": 17.07,
                //                         "150": 17.25,
                //                         "160": 17.47,
                //                         "170": 17.71,
                //                         "180": 17.97,
                //                         "190": 18.25,
                //                         "200": 18.50,
                //                         "210": 18.79,
                //                         "220": 19.10,
                //                         "230": 19.43,
                //                         "240": 19.76,
                //                         "250": 20.09,
                //                         "260": 20.42,
                //                         "270": 20.76,
                //                         "280": 21.10,
                //                         "290": 21.45,
                //                         "300": 21.85
                //                     },
                //                     "421": {
                //                         "0": 17.21,
                //                         "10": 17.24,
                //                         "20": 17.27,
                //                         "30": 17.31,
                //                         "40": 17.35,
                //                         "50": 17.40,
                //                         "60": 17.44,
                //                         "70": 17.50,
                //                         "80": 17.56,
                //                         "90": 17.63,
                //                         "100": 17.70,
                //                         "110": 17.75,
                //                         "120": 17.79,
                //                         "130": 17.85,
                //                         "140": 17.96,
                //                         "150": 18.10,
                //                         "160": 18.28,
                //                         "170": 18.48,
                //                         "180": 18.70,
                //                         "190": 18.92,
                //                         "200": 19.13,
                //                         "210": 19.36,
                //                         "220": 19.62,
                //                         "230": 19.88,
                //                         "240": 20.15,
                //                         "250": 20.42,
                //                         "260": 20.69,
                //                         "270": 20.96,
                //                         "280": 21.24,
                //                         "290": 21.52,
                //                         "300": 21.85
                //                     },
                //                     "422": {
                //                         "0": 18.21,
                //                         "10": 18.24,
                //                         "20": 18.27,
                //                         "30": 18.30,
                //                         "40": 18.34,
                //                         "50": 18.38,
                //                         "60": 18.42,
                //                         "70": 18.46,
                //                         "80": 18.52,
                //                         "90": 18.58,
                //                         "100": 18.63,
                //                         "110": 18.68,
                //                         "120": 18.71,
                //                         "130": 18.76,
                //                         "140": 18.85,
                //                         "150": 18.96,
                //                         "160": 19.10,
                //                         "170": 19.25,
                //                         "180": 19.42,
                //                         "190": 19.59,
                //                         "200": 19.76,
                //                         "210": 19.94,
                //                         "220": 20.13,
                //                         "230": 20.34,
                //                         "240": 20.54,
                //                         "250": 20.75,
                //                         "260": 20.96,
                //                         "270": 21.17,
                //                         "280": 21.38,
                //                         "290": 21.60,
                //                         "300": 21.85
                //                     },
                //                     "423": {
                //                         "0": 19.21,
                //                         "10": 19.24,
                //                         "20": 19.26,
                //                         "30": 19.29,
                //                         "40": 19.32,
                //                         "50": 19.36,
                //                         "60": 19.39,
                //                         "70": 19.43,
                //                         "80": 19.47,
                //                         "90": 19.52,
                //                         "100": 19.56,
                //                         "110": 19.60,
                //                         "120": 19.63,
                //                         "130": 19.67,
                //                         "140": 19.73,
                //                         "150": 19.82,
                //                         "160": 19.92,
                //                         "170": 20.03,
                //                         "180": 20.14,
                //                         "190": 20.27,
                //                         "200": 20.38,
                //                         "210": 20.51,
                //                         "220": 20.65,
                //                         "230": 20.79,
                //                         "240": 20.94,
                //                         "250": 21.08,
                //                         "260": 21.23,
                //                         "270": 21.37,
                //                         "280": 21.52,
                //                         "290": 21.68,
                //                         "300": 21.85
                //                     },
                //                     "424": {
                //                         "0": 20.21,
                //                         "10": 20.23,
                //                         "20": 20.26,
                //                         "30": 20.28,
                //                         "40": 20.31,
                //                         "50": 20.34,
                //                         "60": 20.36,
                //                         "70": 20.39,
                //                         "80": 20.43,
                //                         "90": 20.46,
                //                         "100": 20.49,
                //                         "110": 20.52,
                //                         "120": 20.55,
                //                         "130": 20.58,
                //                         "140": 20.62,
                //                         "150": 20.67,
                //                         "160": 20.73,
                //                         "170": 20.80,
                //                         "180": 20.87,
                //                         "190": 20.94,
                //                         "200": 21.01,
                //                         "210": 21.08,
                //                         "220": 21.16,
                //                         "230": 21.25,
                //                         "240": 21.33,
                //                         "250": 21.41,
                //                         "260": 21.49,
                //                         "270": 21.58,
                //                         "280": 21.66,
                //                         "290": 21.75,
                //                         "300": 21.85
                //                     },
                //                     "425": {
                //                         "0": 21.21,
                //                         "10": 21.23,
                //                         "20": 21.25,
                //                         "30": 21.27,
                //                         "40": 21.30,
                //                         "50": 21.32,
                //                         "60": 21.34,
                //                         "70": 21.36,
                //                         "80": 21.38,
                //                         "90": 21.40,
                //                         "100": 21.42,
                //                         "110": 21.44,
                //                         "120": 21.47,
                //                         "130": 21.49,
                //                         "140": 21.51,
                //                         "150": 21.53,
                //                         "160": 21.55,
                //                         "170": 21.57,
                //                         "180": 21.59,
                //                         "190": 21.61,
                //                         "200": 21.64,
                //                         "210": 21.66,
                //                         "220": 21.68,
                //                         "230": 21.70,
                //                         "240": 21.72,
                //                         "250": 21.74,
                //                         "260": 21.76,
                //                         "270": 21.78,
                //                         "280": 21.81,
                //                         "290": 21.83,
                //                         "300": 21.85
                //                     }
                //                 }

                //                 // Interpolating Grafton Rating Table
                //                 function interpolateValue(rating, point) {
                //                     const keys = Object.keys(ratingGrafton).map(Number);

                //                     // Find the two closest keys
                //                     let lowerKey = null, upperKey = null;

                //                     for (let i = 0; i < keys.length; i++) {
                //                         if (keys[i] <= rating) lowerKey = keys[i];
                //                         if (keys[i] > rating && upperKey === null) upperKey = keys[i];
                //                     }

                //                     if (lowerKey === null || upperKey === null) {
                //                         throw new Error('Rating out of bounds.');
                //                     }

                //                     const lowerValues = ratingGrafton[lowerKey];
                //                     const upperValues = ratingGrafton[upperKey];

                //                     // Find the two closest values within these ranges
                //                     const lowerPoints = Object.keys(lowerValues).map(Number);
                //                     const upperPoints = Object.keys(upperValues).map(Number);

                //                     let lowerPoint = null, upperPoint = null;

                //                     for (let i = 0; i < lowerPoints.length; i++) {
                //                         if (lowerPoints[i] <= point) lowerPoint = lowerPoints[i];
                //                         if (lowerPoints[i] > point && upperPoint === null) upperPoint = lowerPoints[i];
                //                     }

                //                     if (lowerPoint === null || upperPoint === null) {
                //                         throw new Error('Point out of bounds.');
                //                     }

                //                     const lowerValue = lowerValues[lowerPoint];
                //                     const upperValue = upperValues[upperPoint];

                //                     // Perform interpolation
                //                     const interpolatedValue = lowerValue + ((point - lowerPoint) / (upperPoint - lowerPoint)) * (upperValue - lowerValue);

                //                     return interpolatedValue;
                //                 }

                //                 // deltaFirst
                //                 const stage = yesterdayGraftonDownstreamStageRevValue2;
                //                 const flowRate = valueCompareOpenRiver;
                //                 const interpolatedValue = interpolateValue(stage, flowRate);

                //                 // console.log(`Interpolated value for stage ${stage} and flowRate ${flowRate}: ${interpolatedValue}`);

                //                 const deltaFirst = yesterdayGraftonStageRevValue - interpolatedValue;
                //                 // console.log("deltaFirst: ", deltaFirst);

                //                 // deltaSecond
                //                 const stage2 = todayGraftonNetmissDownstreamData;
                //                 const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand;
                //                 const interpolatedValue2 = interpolateValue(stage2, flowRate2);

                //                 // console.log(`Interpolated value for stage ${stage2} and flowRate ${flowRate2}: ${interpolatedValue2}`);

                //                 totalGrafton = deltaFirst + interpolatedValue2;
                //                 // console.log("totalGrafton: ", totalGrafton);

                //                 // push data to GraftonForecast
                //                 totalGraftonForecastDay4.push({ "value": totalGrafton });
                //                 GraftonForecast[location_id].push({ "value": totalGrafton });
                //             } else {
                //                 totalGrafton = 999;
                //                 // console.log("totalGrafton: ", totalGrafton);
                //             }
                //             // push data to GraftonForecast
                //             totalGraftonForecastDay4.push({ "value": totalGrafton });
                //             GraftonForecast[location_id].push({ "value": totalGrafton });
                //         }
                //     } else if (isGraftonForecastBasedUponLd25MPTw) {
                //         totalGrafton = yesterdayGraftonStageRevValue + (((todayGraftonUpstreamNetmissValue - yesterdayGraftonUpstreamStageRevValue) + (todayGraftonDownstreamNetmissStageValue - yesterdayGraftonDownstreamStageRevValue)) / 2);
                //         // console.log("totalGrafton: ", totalGrafton);

                //         // push data to GraftonForecast
                //         totalGraftonForecastDay4.push({ "value": totalGrafton });
                //         GraftonForecast[location_id].push({ "value": totalGrafton });
                //     } else {
                //         totalGrafton = 909;
                //         // console.log("totalGrafton: ", totalGrafton);

                //         // push data to GraftonForecast
                //         totalGraftonForecastDay4.push({ "value": totalGrafton });
                //         GraftonForecast[location_id].push({ "value": totalGrafton });
                //     }
                // }
            }

            if (totalGraftonForecastDay5 === totalGraftonForecastDay5) {
                if (location_id === "Grafton-Mississippi") {
                    // Get today grafton upstream netmiss value
                    const todayGraftonUpstreamNetmissValue = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]); // ************** change here
                    // console.log("todayGraftonUpstreamNetmissValue: ", todayGraftonUpstreamNetmissValue);
                    const todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                    // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);

                    // Get upstream grafton rating table and cooresponding today flow value 
                    const ratingGraftonTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point;
                    const todayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(todayGraftonUpstreamNetmissValuePlus001, ratingGraftonTableCoeUpstream);
                    // console.log("todayGraftonCorrespondingUpstreamNetmissFlowValue: (database rating is off from excel) ", todayGraftonCorrespondingUpstreamNetmissFlowValue);

                    // Get special gage 2 flow value
                    const convertedGraftonSpecialNetmissGage2FlowValuesToCst = convertUTCtoCentralTime(data20);
                    // console.log("convertedGraftonSpecialNetmissGage2FlowValuesToCst: ", convertedGraftonSpecialNetmissGage2FlowValuesToCst);
                    const todayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[5][1]; // ************** change here
                    // console.log("todayGraftonSpecialGage2NetmissFlowValue: ", todayGraftonSpecialGage2NetmissFlowValue);
                    const firstDayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[0][1]; // ************** change here (keep the same)
                    // console.log("firstDayGraftonSpecialGage2NetmissFlowValue: ", firstDayGraftonSpecialGage2NetmissFlowValue);

                    // Sum today grafton plus ld25tw
                    const sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = (parseFloat(todayGraftonSpecialGage2NetmissFlowValue) + parseFloat(todayGraftonCorrespondingUpstreamNetmissFlowValue)) / 1000;
                    // console.log("sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand: ", sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand);

                    const isGraftonForecastBasedUponLd25MPTw = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) > 300;
                    // console.log("isGraftonForecastBasedUponLd25MPTw: (True if > 300) ", isGraftonForecastBasedUponLd25MPTw);
                    const isGraftonForecastBasedUponOpenRiver = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) <= 300;
                    // console.log("isGraftonForecastBasedUponOpenRiver: (True if <= 300) ", isGraftonForecastBasedUponOpenRiver);

                    if (isGraftonForecastBasedUponOpenRiver) {
                        // console.log("isGraftonForecastBasedUponOpenRiver");

                        // Get downstream netmiss day1
                        const todayGraftonNetmissDownstreamData = convertUTCtoCentralTime(data4).values[4][1]; // ************** change here
                        // console.log("todayGraftonNetmissDownstreamData: ", todayGraftonNetmissDownstreamData);

                        // Get downstream netmiss stagerev
                        const todayGraftonDownstreamNetmissStageValue = data12.values[4][1]; // ************** change here
                        // console.log("todayGraftonDownstreamNetmissStageValue: ", todayGraftonDownstreamNetmissStageValue);

                        // Check mel price open river
                        const isMelPricePoolOpenRiver = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 > todayGraftonNetmissDownstreamData;
                        // console.log("isMelPricePoolOpenRiver: ", isMelPricePoolOpenRiver);

                        // Check mel price regulated pool
                        const isMelPricePoolRegulatedPool = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 <= todayGraftonNetmissDownstreamData;
                        // console.log("isMelPricePoolRegulatedPool: ", isMelPricePoolRegulatedPool);

                        // Condition 1 - Sub 1 - isMelPricePoolOpenRiver
                        if (isMelPricePoolOpenRiver) {
                            // console.log("isMelPricePoolOpenRiver");
                        }

                        // Condition 1 - Sub 1 - isMelPricePoolRegulatedPool
                        if (isMelPricePoolRegulatedPool) {
                            // console.log("isMelPricePoolRegulatedPool");

                            // Get grafton yesterday stagerev value
                            const yesterdayGraftonStageRevValue = latest6AMValue.value;
                            // console.log("yesterdayGraftonStageRevValue: ", yesterdayGraftonStageRevValue);

                            // Get upstream grafton stage rev
                            const yesterdayGraftonUpstreamStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                            // console.log("yesterdayGraftonUpstreamStageRevValue: ", yesterdayGraftonUpstreamStageRevValue);
                            const yesterdayGraftonUpstreamStageRevValuePlus0001 = yesterdayGraftonUpstreamStageRevValue + 0.001;
                            // console.log("yesterdayGraftonUpstreamStageRevValuePlus0001: ", yesterdayGraftonUpstreamStageRevValuePlus0001);

                            const yesterdayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(yesterdayGraftonUpstreamStageRevValuePlus0001, ratingGraftonTableCoeUpstream);
                            // console.log("yesterdayGraftonCorrespondingUpstreamNetmissFlowValue: ", yesterdayGraftonCorrespondingUpstreamNetmissFlowValue);

                            const valueCompareOpenRiver = ((yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + firstDayGraftonSpecialGage2NetmissFlowValue) / 1000);
                            // console.log("valueCompareOpenRiver: ", valueCompareOpenRiver);

                            const isOpenRiverUseStageFlowRating = valueCompareOpenRiver > 300;
                            // console.log("isOpenRiverUseStageFlowRating : ", isOpenRiverUseStageFlowRating);

                            const isOpenRiverUseBackWater = valueCompareOpenRiver <= 300;
                            // console.log("isOpenRiverUseBackWater : ", isOpenRiverUseBackWater);

                            if (isOpenRiverUseBackWater) {
                                // console.log("isOpenRiverUseBackWater");

                                const yesterdayGraftonDownstreamStageRevValue2 = ((getLatest6AMValue(data22)).latest6AMValue).value;
                                // console.log("yesterdayGraftonDownstreamStageRevValue2: ", yesterdayGraftonDownstreamStageRevValue2);

                                const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                                // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                                let jsonFileName = "ratingGrafton.json";

                                // Call the function and log the result
                                const stage = yesterdayGraftonDownstreamStageRevValue2;
                                const flowRate = valueCompareOpenRiver;
                                // console.log("stage, flowRate, jsonFileName: ", stage, flowRate, jsonFileName);
                                readJSONTable2(stage, flowRate, jsonFileName).then(value => {
                                    if (value !== null) {
                                        // console.log(`Interpolated reading for flow rate ${flowRate} and stage ${stage} at table ${jsonFileName}: ${value}`);

                                        deltaYesterdayStage = yesterdayGraftonStageRevValue - value;
                                        // console.log("deltaYesterdayStage: ", deltaYesterdayStage);
                                    } else {
                                        // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                                    }
                                });

                                // Call the function and log the result
                                const stage2 = todayGraftonNetmissDownstreamData;
                                const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand;
                                // console.log("stage2, flowRate2, jsonFileName: ", stage2, flowRate2, jsonFileName);
                                readJSONTable2(stage2, flowRate2, jsonFileName).then(value => {
                                    if (value !== null) {
                                        // console.log(`Interpolated reading for flow rate ${flowRate2} and stage ${stage2} at table ${jsonFileName}: ${value}`);

                                        totalGrafton = value + deltaYesterdayStage;
                                        // console.log("totalGrafton: ", totalGrafton);

                                        // push data to GraftonForecast
                                        totalGraftonForecastDay5.push({ "value": totalGrafton }); // ************** change here
                                        GraftonForecast[location_id].push({ "value": totalGrafton });
                                    } else {
                                        // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                                    }
                                });
                            }
                        }

                    }
                }

                // // today
                // let todayGraftonUpstreamNetmissValue = null;
                // let todayGraftonUpstreamNetmissValuePlus001 = null;
                // if (data11 !== null && location_id === "Grafton-Mississippi") {
                //     todayGraftonUpstreamNetmissValue = parseFloat(convertedNetmissForecastingPointUpstreamData.values[4][1]); // ************** change here
                //     todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                //     // console.log("todayGraftonUpstreamNetmissValue: ", todayGraftonUpstreamNetmissValue);
                //     // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);
                // }
                // let todayGraftonDownstreamNetmissStageValue = null;
                // if (data12 !== null && location_id === "Grafton-Mississippi") {
                //     todayGraftonDownstreamNetmissStageValue = data12.values[1][1];
                //     // console.log("todayGraftonDownstreamNetmissStageValue: ", todayGraftonDownstreamNetmissStageValue);
                // }
                // let todayGraftonNetmissDownstreamData = null;
                // let isMelPricePoolOpenRiver = null;
                // if (data4 !== null && location_id === "Grafton-Mississippi") {
                //     todayGraftonNetmissDownstreamData = convertUTCtoCentralTime(data4).values[4][1]; // ************** change here
                //     isMelPricePoolOpenRiver = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 > todayGraftonNetmissDownstreamData;
                //     // console.log("todayGraftonNetmissDownstreamData: ", todayGraftonNetmissDownstreamData);
                //     // console.log("isMelPricePoolOpenRiver: ", isMelPricePoolOpenRiver);
                // }
                // // yesterday
                // let yesterdayGraftonStageRevValue = null;
                // if (data2 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonStageRevValue = latest6AMValue.value;
                //     // console.log("yesterdayGraftonStageRevValue: ", yesterdayGraftonStageRevValue);
                // }
                // let yesterdayGraftonUpstreamStageRevValue = null;
                // let yesterdayGraftonUpstreamStageRevValuePlus0001 = null;
                // if (data7 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonUpstreamStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                //     yesterdayGraftonUpstreamStageRevValuePlus0001 = yesterdayGraftonUpstreamStageRevValue + 0.001;
                //     // console.log("yesterdayGraftonUpstreamStageRevValue: ", yesterdayGraftonUpstreamStageRevValue);
                //     // console.log("yesterdayGraftonUpstreamStageRevValuePlus0001: ", yesterdayGraftonUpstreamStageRevValuePlus0001);
                // }
                // let yesterdayGraftonDownstreamStageRevValue = null;
                // if (data9 !== null && data22 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonDownstreamStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                //     yesterdayGraftonDownstreamStageRevValue2 = ((getLatest6AMValue(data22)).latest6AMValue).value;
                //     // console.log("yesterdayGraftonDownstreamStageRevValue: ", yesterdayGraftonDownstreamStageRevValue);
                //     // console.log("yesterdayGraftonDownstreamStageRevValue2: ", yesterdayGraftonDownstreamStageRevValue2);
                // }
                // // special gage 1
                // let yesterdayGraftonSpecialNetmissFlowValue = null;
                // let todayGraftonSpecialNetmissFlowValue = null;
                // if (data18 !== null && location_id === "Grafton-Mississippi") {
                //     const convertedGraftonSpecialNetmissFlowValuesToCst = convertUTCtoCentralTime(data18);
                //     yesterdayGraftonSpecialNetmissFlowValue = (convertedGraftonSpecialNetmissFlowValuesToCst.values[4][1]); // ************** change here
                //     todayGraftonSpecialNetmissFlowValue = (convertedGraftonSpecialNetmissFlowValuesToCst.values[5][1]); // ************** change here
                //     // console.log("convertedGraftonSpecialNetmissFlowValuesToCst: ", convertedGraftonSpecialNetmissFlowValuesToCst);
                //     // console.log("yesterdayGraftonSpecialNetmissFlowValue: ", yesterdayGraftonSpecialNetmissFlowValue);
                //     // console.log("todayGraftonSpecialNetmissFlowValue: ", todayGraftonSpecialNetmissFlowValue);
                // }
                // // Special gage 2
                // let yesterdayGraftonSpecialGage2NetmissFlowValue = null;
                // let todayGraftonSpecialGage2NetmissFlowValue = null;
                // if (data20 !== null && location_id === "Grafton-Mississippi") {
                //     const convertedGraftonSpecialNetmissGage2FlowValuesToCst = convertUTCtoCentralTime(data20);
                //     yesterdayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[4][1]; // ************** change here
                //     todayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[5][1]; // ************** change here
                //     // console.log("convertedGraftonSpecialNetmissGage2FlowValuesToCst: ", convertedGraftonSpecialNetmissGage2FlowValuesToCst);
                //     // console.log("yesterdayGraftonSpecialGage2NetmissFlowValue: ", yesterdayGraftonSpecialGage2NetmissFlowValue);
                //     // console.log("todayGraftonSpecialGage2NetmissFlowValue: ", todayGraftonSpecialGage2NetmissFlowValue);
                // }
                // // Get rating tables
                // let ratingGraftonTableCoe = null;
                // let ratingGraftonTableCoeUpstream = null;
                // let ratingGraftonTableCoeDownstream = null;
                // let todayGraftonCorrespondingUpstreamNetmissFlowValue = null;
                // let todayGraftonCorrespondingDownstreamNetmissFlowValue = null;
                // let sumGraftonTodayHermannFlowPlusLd25TwFlow = null;
                // let sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = null;
                // if (data16 !== null && data17 !== null && data19 !== null && location_id === "Grafton-Mississippi") {
                //     ratingGraftonTableCoe = data16["simple-rating"]["rating-points"].point; // Grafton-Mississippi
                //     ratingGraftonTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point; // LD 25 TW-Mississippi // [0] because active[0] and inactive[1]
                //     ratingGraftonTableCoeDownstream = data19["simple-rating"]["rating-points"].point; // Mel Price TW-Mississippi

                //     // console.log("data16: ", data16);
                //     // console.log("data17: ", data17);
                //     // console.log("data19: ", data19);
                //     // console.log("ratingGraftonTableCoe: ", ratingGraftonTableCoe);
                //     // console.log("ratingGraftonTableCoeUpstream: ", ratingGraftonTableCoeUpstream);
                //     // console.log("ratingGraftonTableCoeDownstream: ", ratingGraftonTableCoeDownstream);


                //     // get rating tables from ratings.js
                //     // console.log("ratingStageFlowGrafton: ", ratingStageFlowGrafton);
                //     // console.log("ratingStageFlowLouisiana: ", ratingStageFlowLouisiana);
                //     // console.log("ratingStageFlowLd25Tw: ", ratingStageFlowLd25Tw);
                //     // console.log("ratingStageFlowMelPriceTw: ", ratingStageFlowMelPriceTw);

                //     todayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(todayGraftonUpstreamNetmissValuePlus001, ratingGraftonTableCoeUpstream);
                //     todayGraftonCorrespondingDownstreamNetmissFlowValue = findDepByInd(todayGraftonDownstreamNetmissStageValue, ratingGraftonTableCoeDownstream);
                //     // console.log("todayGraftonCorrespondingUpstreamNetmissFlowValue: (database rating is off from excel) ", todayGraftonCorrespondingUpstreamNetmissFlowValue);
                //     // console.log("todayGraftonCorrespondingDownstreamNetmissFlowValue: ", todayGraftonCorrespondingDownstreamNetmissFlowValue);

                //     // sum
                //     sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = (parseFloat(todayGraftonSpecialGage2NetmissFlowValue) + parseFloat(todayGraftonCorrespondingUpstreamNetmissFlowValue)) / 1000;
                //     // console.log("sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand: ", sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand);
                // }
                // let totalGrafton = null;
                // if (location_id === "Grafton-Mississippi") {
                //     const isGraftonForecastBasedUponLd25MPTw = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) > 300;
                //     // console.log("isGraftonForecastBasedUponLd25MPTw: (True if > 300) ", isGraftonForecastBasedUponLd25MPTw);

                //     const isGraftonForecastBasedUponOpenRiver = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) <= 300;
                //     // console.log("isGraftonForecastBasedUponOpenRiver: (True if <= 300) ", isGraftonForecastBasedUponOpenRiver);

                //     const yesterdayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(yesterdayGraftonUpstreamStageRevValuePlus0001, ratingGraftonTableCoeUpstream);
                //     // console.log("yesterdayGraftonCorrespondingUpstreamNetmissFlowValue: ", yesterdayGraftonCorrespondingUpstreamNetmissFlowValue);

                //     const valueCompareOpenRiver = ((yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + yesterdayGraftonSpecialGage2NetmissFlowValue) / 1000);
                //     // console.log("valueCompareOpenRiver: ", valueCompareOpenRiver);

                //     const isOpenRiverUseStageFlowRating = valueCompareOpenRiver > 300;
                //     // console.log("isOpenRiverUseStageFlowRating : ", isOpenRiverUseStageFlowRating);

                //     const isOpenRiverUseBackWater = valueCompareOpenRiver <= 300;
                //     // console.log("isOpenRiverUseBackWater : ", isOpenRiverUseBackWater);

                //     // Determine Grafton Forecast Based on Conditions
                //     if (isGraftonForecastBasedUponOpenRiver) {
                //         if (isMelPricePoolOpenRiver) {
                //             let deltaYesterdayStage = null;

                //             if (isOpenRiverUseStageFlowRating) {
                //                 const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                //                 // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                //                 const flowToSend = (yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + yesterdayGraftonSpecialGage2NetmissFlowValue);
                //                 // console.log("flowToSend: ", flowToSend);

                //                 const t = findIndByDep(flowToSend, ratingTableSpecial1);
                //                 // console.log("t: ", t);

                //                 deltaYesterdayStage = yesterdayGraftonStageRevValue - t;
                //                 // console.log("deltaYesterdayStage: ", deltaYesterdayStage);

                //                 const todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                //                 // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);

                //                 const todayFlowSum = todayGraftonCorrespondingUpstreamNetmissFlowValue + todayGraftonSpecialGage2NetmissFlowValue;
                //                 // console.log("todayFlowSum: ", todayFlowSum);

                //                 const x = todayGraftonDownstreamNetmissStageValue + 395.48 + 0.5;
                //                 // console.log("x: ", x);
                //             } else if (isOpenRiverUseBackWater) {
                //                 const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                //                 // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                //                 let jsonFileName = "ratingGrafton.json"; //"ratingGrafton.json";

                //                 // Call the function and log the result
                //                 const stage = yesterdayGraftonDownstreamStageRevValue2; // yesterdayGraftonDownstreamStageRevValue2
                //                 const flowRate = valueCompareOpenRiver; // valueCompareOpenRiver
                //                 // console.log("stage, flowRate, jsonFileName: ", stage, flowRate, jsonFileName);
                //                 readJSONTable2(stage, flowRate, jsonFileName).then(value => {
                //                     if (value !== null) {
                //                         // console.log(`Interpolated reading for flow rate ${flowRate} and stage ${stage} at table ${jsonFileName}: ${value}`);

                //                         deltaYesterdayStage = yesterdayGraftonStageRevValue - value;
                //                         // console.log("deltaYesterdayStage: ", deltaYesterdayStage);
                //                     } else {
                //                         // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                //                     }
                //                 });

                //                 // Call the function and log the result
                //                 const stage2 = todayGraftonDownstreamNetmissStageValue + 395.48 + 0.5; // yesterdayGraftonDownstreamStageRevValue2
                //                 const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand; // valueCompareOpenRiver
                //                 // console.log("stage2, flowRate2, jsonFileName: ", stage2, flowRate2, jsonFileName);
                //                 readJSONTable2(stage2, flowRate2, jsonFileName).then(value => {
                //                     if (value !== null) {
                //                         // console.log(`Interpolated reading for flow rate ${flowRate2} and stage ${stage2} at table ${jsonFileName}: ${value}`);

                //                         totalGrafton = value + deltaYesterdayStage;
                //                         // console.log("totalGrafton: ", totalGrafton);

                //                         // push data to GraftonForecast
                //                         totalGraftonForecastDay5.push({ "value": totalGrafton });
                //                         GraftonForecast[location_id].push({ "value": totalGrafton });
                //                     } else {
                //                         // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                //                     }
                //                 });
                //             }
                //         } else {
                //             // Regulated Pool
                //             if (isOpenRiverUseStageFlowRating) {

                //             } else if (isOpenRiverUseBackWater) {
                //                 // Grafton Rating Table
                //                 const ratingGrafton = {
                //                     "412": {
                //                         "0": 8.21,
                //                         "10": 8.56,
                //                         "20": 8.91,
                //                         "30": 9.27,
                //                         "40": 9.62,
                //                         "50": 9.98,
                //                         "60": 10.35,
                //                         "70": 10.71,
                //                         "80": 11.08,
                //                         "90": 11.45,
                //                         "100": 11.83,
                //                         "110": 12.20,
                //                         "120": 12.58,
                //                         "130": 12.96,
                //                         "140": 13.35,
                //                         "150": 13.73,
                //                         "160": 14.12,
                //                         "170": 14.52,
                //                         "180": 14.91,
                //                         "190": 15.31,
                //                         "200": 15.71,
                //                         "210": 16.11,
                //                         "220": 16.51,
                //                         "230": 16.91,
                //                         "240": 17.34,
                //                         "250": 17.82,
                //                         "260": 18.41,
                //                         "270": 19.12,
                //                         "280": 19.87,
                //                         "290": 20.80,
                //                         "300": 21.85
                //                     },
                //                     "413": {
                //                         "0": 9.21,
                //                         "10": 9.49,
                //                         "20": 9.78,
                //                         "30": 10.07,
                //                         "40": 10.37,
                //                         "50": 10.68,
                //                         "60": 10.99,
                //                         "70": 11.31,
                //                         "80": 11.64,
                //                         "90": 11.97,
                //                         "100": 12.31,
                //                         "110": 12.65,
                //                         "120": 13.00,
                //                         "130": 13.36,
                //                         "140": 13.72,
                //                         "150": 14.09,
                //                         "160": 14.47,
                //                         "170": 14.85,
                //                         "180": 15.24,
                //                         "190": 15.63,
                //                         "200": 16.03,
                //                         "210": 16.43,
                //                         "220": 16.83,
                //                         "230": 17.23,
                //                         "240": 17.66,
                //                         "250": 18.14,
                //                         "260": 18.73,
                //                         "270": 19.44,
                //                         "280": 20.19,
                //                         "290": 21.00,
                //                         "300": 21.85
                //                     },
                //                     "414": {
                //                         "0": 10.21,
                //                         "10": 10.42,
                //                         "20": 10.65,
                //                         "30": 10.88,
                //                         "40": 11.13,
                //                         "50": 11.38,
                //                         "60": 11.64,
                //                         "70": 11.91,
                //                         "80": 12.20,
                //                         "90": 12.49,
                //                         "100": 12.79,
                //                         "110": 13.10,
                //                         "120": 13.43,
                //                         "130": 13.76,
                //                         "140": 14.10,
                //                         "150": 14.45,
                //                         "160": 14.81,
                //                         "170": 15.18,
                //                         "180": 15.56,
                //                         "190": 15.95,
                //                         "200": 16.35,
                //                         "210": 16.75,
                //                         "220": 17.15,
                //                         "230": 17.55,
                //                         "240": 17.95,
                //                         "250": 18.42,
                //                         "260": 19.00,
                //                         "270": 19.68,
                //                         "280": 20.41,
                //                         "290": 21.13,
                //                         "300": 21.85
                //                     },
                //                     "415": {
                //                         "0": 11.21,
                //                         "10": 11.35,
                //                         "20": 11.51,
                //                         "30": 11.68,
                //                         "40": 11.87,
                //                         "50": 12.06,
                //                         "60": 12.28,
                //                         "70": 12.50,
                //                         "80": 12.74,
                //                         "90": 12.99,
                //                         "100": 13.25,
                //                         "110": 13.53,
                //                         "120": 13.82,
                //                         "130": 14.12,
                //                         "140": 14.44,
                //                         "150": 14.77,
                //                         "160": 15.11,
                //                         "170": 15.47,
                //                         "180": 15.84,
                //                         "190": 16.22,
                //                         "200": 16.60,
                //                         "210": 16.99,
                //                         "220": 17.39,
                //                         "230": 17.82,
                //                         "240": 18.20,
                //                         "250": 18.66,
                //                         "260": 19.21,
                //                         "270": 19.84,
                //                         "280": 20.51,
                //                         "290": 21.18,
                //                         "300": 21.85
                //                     },
                //                     "416": {
                //                         "0": 12.21,
                //                         "10": 12.28,
                //                         "20": 12.37,
                //                         "30": 12.48,
                //                         "40": 12.60,
                //                         "50": 12.74,
                //                         "60": 12.90,
                //                         "70": 13.07,
                //                         "80": 13.26,
                //                         "90": 13.47,
                //                         "100": 13.69,
                //                         "110": 13.94,
                //                         "120": 14.19,
                //                         "130": 14.47,
                //                         "140": 14.76,
                //                         "150": 15.07,
                //                         "160": 15.40,
                //                         "170": 15.74,
                //                         "180": 16.10,
                //                         "190": 16.46,
                //                         "200": 16.82,
                //                         "210": 17.20,
                //                         "220": 17.60,
                //                         "230": 18.00,
                //                         "240": 18.45,
                //                         "250": 18.90,
                //                         "260": 19.42,
                //                         "270": 20.00,
                //                         "280": 20.62,
                //                         "290": 21.23,
                //                         "300": 21.85
                //                     },
                //                     "417": {
                //                         "0": 13.21,
                //                         "10": 13.24,
                //                         "20": 13.28,
                //                         "30": 13.34,
                //                         "40": 13.42,
                //                         "50": 13.51,
                //                         "60": 13.62,
                //                         "70": 13.74,
                //                         "80": 13.88,
                //                         "90": 14.04,
                //                         "100": 14.21,
                //                         "110": 14.40,
                //                         "120": 14.63,
                //                         "130": 14.88,
                //                         "140": 15.16,
                //                         "150": 15.45,
                //                         "160": 15.76,
                //                         "170": 16.09,
                //                         "180": 16.44,
                //                         "190": 16.79,
                //                         "200": 17.16,
                //                         "210": 17.55,
                //                         "220": 17.94,
                //                         "230": 18.34,
                //                         "240": 18.78,
                //                         "250": 19.23,
                //                         "260": 19.73,
                //                         "270": 20.23,
                //                         "280": 20.73,
                //                         "290": 21.25,
                //                         "300": 21.85
                //                     },
                //                     "418": {
                //                         "0": 14.21,
                //                         "10": 14.24,
                //                         "20": 14.27,
                //                         "30": 14.32,
                //                         "40": 14.37,
                //                         "50": 14.44,
                //                         "60": 14.51,
                //                         "70": 14.60,
                //                         "80": 14.69,
                //                         "90": 14.79,
                //                         "100": 14.90,
                //                         "110": 15.02,
                //                         "120": 15.22,
                //                         "130": 15.45,
                //                         "140": 15.72,
                //                         "150": 16.00,
                //                         "160": 16.29,
                //                         "170": 16.60,
                //                         "180": 16.92,
                //                         "190": 17.25,
                //                         "200": 17.59,
                //                         "210": 17.95,
                //                         "220": 18.33,
                //                         "230": 18.72,
                //                         "240": 19.13,
                //                         "250": 19.55,
                //                         "260": 19.98,
                //                         "270": 20.40,
                //                         "280": 20.84,
                //                         "290": 21.29,
                //                         "300": 21.85
                //                     },
                //                     "419": {
                //                         "0": 15.21,
                //                         "10": 15.24,
                //                         "20": 15.27,
                //                         "30": 15.31,
                //                         "40": 15.36,
                //                         "50": 15.41,
                //                         "60": 15.47,
                //                         "70": 15.54,
                //                         "80": 15.62,
                //                         "90": 15.71,
                //                         "100": 15.82,
                //                         "110": 15.93,
                //                         "120": 16.04,
                //                         "130": 16.18,
                //                         "140": 16.36,
                //                         "150": 16.56,
                //                         "160": 16.79,
                //                         "170": 17.05,
                //                         "180": 17.34,
                //                         "190": 17.64,
                //                         "200": 17.95,
                //                         "210": 18.28,
                //                         "220": 18.65,
                //                         "230": 19.03,
                //                         "240": 19.42,
                //                         "250": 19.80,
                //                         "260": 20.19,
                //                         "270": 20.58,
                //                         "280": 20.98,
                //                         "290": 21.38,
                //                         "300": 21.85
                //                     },
                //                     "420": {
                //                         "0": 16.21,
                //                         "10": 16.24,
                //                         "20": 16.28,
                //                         "30": 16.32,
                //                         "40": 16.37,
                //                         "50": 16.42,
                //                         "60": 16.47,
                //                         "70": 16.53,
                //                         "80": 16.61,
                //                         "90": 16.69,
                //                         "100": 16.77,
                //                         "110": 16.83,
                //                         "120": 16.87,
                //                         "130": 16.94,
                //                         "140": 17.07,
                //                         "150": 17.25,
                //                         "160": 17.47,
                //                         "170": 17.71,
                //                         "180": 17.97,
                //                         "190": 18.25,
                //                         "200": 18.50,
                //                         "210": 18.79,
                //                         "220": 19.10,
                //                         "230": 19.43,
                //                         "240": 19.76,
                //                         "250": 20.09,
                //                         "260": 20.42,
                //                         "270": 20.76,
                //                         "280": 21.10,
                //                         "290": 21.45,
                //                         "300": 21.85
                //                     },
                //                     "421": {
                //                         "0": 17.21,
                //                         "10": 17.24,
                //                         "20": 17.27,
                //                         "30": 17.31,
                //                         "40": 17.35,
                //                         "50": 17.40,
                //                         "60": 17.44,
                //                         "70": 17.50,
                //                         "80": 17.56,
                //                         "90": 17.63,
                //                         "100": 17.70,
                //                         "110": 17.75,
                //                         "120": 17.79,
                //                         "130": 17.85,
                //                         "140": 17.96,
                //                         "150": 18.10,
                //                         "160": 18.28,
                //                         "170": 18.48,
                //                         "180": 18.70,
                //                         "190": 18.92,
                //                         "200": 19.13,
                //                         "210": 19.36,
                //                         "220": 19.62,
                //                         "230": 19.88,
                //                         "240": 20.15,
                //                         "250": 20.42,
                //                         "260": 20.69,
                //                         "270": 20.96,
                //                         "280": 21.24,
                //                         "290": 21.52,
                //                         "300": 21.85
                //                     },
                //                     "422": {
                //                         "0": 18.21,
                //                         "10": 18.24,
                //                         "20": 18.27,
                //                         "30": 18.30,
                //                         "40": 18.34,
                //                         "50": 18.38,
                //                         "60": 18.42,
                //                         "70": 18.46,
                //                         "80": 18.52,
                //                         "90": 18.58,
                //                         "100": 18.63,
                //                         "110": 18.68,
                //                         "120": 18.71,
                //                         "130": 18.76,
                //                         "140": 18.85,
                //                         "150": 18.96,
                //                         "160": 19.10,
                //                         "170": 19.25,
                //                         "180": 19.42,
                //                         "190": 19.59,
                //                         "200": 19.76,
                //                         "210": 19.94,
                //                         "220": 20.13,
                //                         "230": 20.34,
                //                         "240": 20.54,
                //                         "250": 20.75,
                //                         "260": 20.96,
                //                         "270": 21.17,
                //                         "280": 21.38,
                //                         "290": 21.60,
                //                         "300": 21.85
                //                     },
                //                     "423": {
                //                         "0": 19.21,
                //                         "10": 19.24,
                //                         "20": 19.26,
                //                         "30": 19.29,
                //                         "40": 19.32,
                //                         "50": 19.36,
                //                         "60": 19.39,
                //                         "70": 19.43,
                //                         "80": 19.47,
                //                         "90": 19.52,
                //                         "100": 19.56,
                //                         "110": 19.60,
                //                         "120": 19.63,
                //                         "130": 19.67,
                //                         "140": 19.73,
                //                         "150": 19.82,
                //                         "160": 19.92,
                //                         "170": 20.03,
                //                         "180": 20.14,
                //                         "190": 20.27,
                //                         "200": 20.38,
                //                         "210": 20.51,
                //                         "220": 20.65,
                //                         "230": 20.79,
                //                         "240": 20.94,
                //                         "250": 21.08,
                //                         "260": 21.23,
                //                         "270": 21.37,
                //                         "280": 21.52,
                //                         "290": 21.68,
                //                         "300": 21.85
                //                     },
                //                     "424": {
                //                         "0": 20.21,
                //                         "10": 20.23,
                //                         "20": 20.26,
                //                         "30": 20.28,
                //                         "40": 20.31,
                //                         "50": 20.34,
                //                         "60": 20.36,
                //                         "70": 20.39,
                //                         "80": 20.43,
                //                         "90": 20.46,
                //                         "100": 20.49,
                //                         "110": 20.52,
                //                         "120": 20.55,
                //                         "130": 20.58,
                //                         "140": 20.62,
                //                         "150": 20.67,
                //                         "160": 20.73,
                //                         "170": 20.80,
                //                         "180": 20.87,
                //                         "190": 20.94,
                //                         "200": 21.01,
                //                         "210": 21.08,
                //                         "220": 21.16,
                //                         "230": 21.25,
                //                         "240": 21.33,
                //                         "250": 21.41,
                //                         "260": 21.49,
                //                         "270": 21.58,
                //                         "280": 21.66,
                //                         "290": 21.75,
                //                         "300": 21.85
                //                     },
                //                     "425": {
                //                         "0": 21.21,
                //                         "10": 21.23,
                //                         "20": 21.25,
                //                         "30": 21.27,
                //                         "40": 21.30,
                //                         "50": 21.32,
                //                         "60": 21.34,
                //                         "70": 21.36,
                //                         "80": 21.38,
                //                         "90": 21.40,
                //                         "100": 21.42,
                //                         "110": 21.44,
                //                         "120": 21.47,
                //                         "130": 21.49,
                //                         "140": 21.51,
                //                         "150": 21.53,
                //                         "160": 21.55,
                //                         "170": 21.57,
                //                         "180": 21.59,
                //                         "190": 21.61,
                //                         "200": 21.64,
                //                         "210": 21.66,
                //                         "220": 21.68,
                //                         "230": 21.70,
                //                         "240": 21.72,
                //                         "250": 21.74,
                //                         "260": 21.76,
                //                         "270": 21.78,
                //                         "280": 21.81,
                //                         "290": 21.83,
                //                         "300": 21.85
                //                     }
                //                 }

                //                 // Interpolating Grafton Rating Table
                //                 function interpolateValue(rating, point) {
                //                     const keys = Object.keys(ratingGrafton).map(Number);

                //                     // Find the two closest keys
                //                     let lowerKey = null, upperKey = null;

                //                     for (let i = 0; i < keys.length; i++) {
                //                         if (keys[i] <= rating) lowerKey = keys[i];
                //                         if (keys[i] > rating && upperKey === null) upperKey = keys[i];
                //                     }

                //                     if (lowerKey === null || upperKey === null) {
                //                         throw new Error('Rating out of bounds.');
                //                     }

                //                     const lowerValues = ratingGrafton[lowerKey];
                //                     const upperValues = ratingGrafton[upperKey];

                //                     // Find the two closest values within these ranges
                //                     const lowerPoints = Object.keys(lowerValues).map(Number);
                //                     const upperPoints = Object.keys(upperValues).map(Number);

                //                     let lowerPoint = null, upperPoint = null;

                //                     for (let i = 0; i < lowerPoints.length; i++) {
                //                         if (lowerPoints[i] <= point) lowerPoint = lowerPoints[i];
                //                         if (lowerPoints[i] > point && upperPoint === null) upperPoint = lowerPoints[i];
                //                     }

                //                     if (lowerPoint === null || upperPoint === null) {
                //                         throw new Error('Point out of bounds.');
                //                     }

                //                     const lowerValue = lowerValues[lowerPoint];
                //                     const upperValue = upperValues[upperPoint];

                //                     // Perform interpolation
                //                     const interpolatedValue = lowerValue + ((point - lowerPoint) / (upperPoint - lowerPoint)) * (upperValue - lowerValue);

                //                     return interpolatedValue;
                //                 }

                //                 // deltaFirst
                //                 const stage = yesterdayGraftonDownstreamStageRevValue2;
                //                 const flowRate = valueCompareOpenRiver;
                //                 const interpolatedValue = interpolateValue(stage, flowRate);

                //                 // console.log(`Interpolated value for stage ${stage} and flowRate ${flowRate}: ${interpolatedValue}`);

                //                 const deltaFirst = yesterdayGraftonStageRevValue - interpolatedValue;
                //                 // console.log("deltaFirst: ", deltaFirst);

                //                 // deltaSecond
                //                 const stage2 = todayGraftonNetmissDownstreamData;
                //                 const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand;
                //                 const interpolatedValue2 = interpolateValue(stage2, flowRate2);

                //                 // console.log(`Interpolated value for stage ${stage2} and flowRate ${flowRate2}: ${interpolatedValue2}`);

                //                 totalGrafton = deltaFirst + interpolatedValue2;
                //                 // console.log("totalGrafton: ", totalGrafton);

                //                 // push data to GraftonForecast
                //                 totalGraftonForecastDay5.push({ "value": totalGrafton });
                //                 GraftonForecast[location_id].push({ "value": totalGrafton });
                //             } else {
                //                 totalGrafton = 999;
                //                 // console.log("totalGrafton: ", totalGrafton);
                //             }
                //             // push data to GraftonForecast
                //             totalGraftonForecastDay5.push({ "value": totalGrafton });
                //             GraftonForecast[location_id].push({ "value": totalGrafton });
                //         }
                //     } else if (isGraftonForecastBasedUponLd25MPTw) {
                //         totalGrafton = yesterdayGraftonStageRevValue + (((todayGraftonUpstreamNetmissValue - yesterdayGraftonUpstreamStageRevValue) + (todayGraftonDownstreamNetmissStageValue - yesterdayGraftonDownstreamStageRevValue)) / 2);
                //         // console.log("totalGrafton: ", totalGrafton);

                //         // push data to GraftonForecast
                //         totalGraftonForecastDay5.push({ "value": totalGrafton });
                //         GraftonForecast[location_id].push({ "value": totalGrafton });
                //     } else {
                //         totalGrafton = 909;
                //         // console.log("totalGrafton: ", totalGrafton);

                //         // push data to GraftonForecast
                //         totalGraftonForecastDay5.push({ "value": totalGrafton });
                //         GraftonForecast[location_id].push({ "value": totalGrafton });
                //     }
                // }
            }

            if (totalGraftonForecastDay6 === totalGraftonForecastDay6) {
                if (location_id === "Grafton-Mississippi") {
                    // Get today grafton upstream netmiss value
                    const todayGraftonUpstreamNetmissValue = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]); // ************** change here
                    // console.log("todayGraftonUpstreamNetmissValue: ", todayGraftonUpstreamNetmissValue);
                    const todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                    // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);

                    // Get upstream grafton rating table and cooresponding today flow value 
                    const ratingGraftonTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point;
                    const todayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(todayGraftonUpstreamNetmissValuePlus001, ratingGraftonTableCoeUpstream);
                    // console.log("todayGraftonCorrespondingUpstreamNetmissFlowValue: (database rating is off from excel) ", todayGraftonCorrespondingUpstreamNetmissFlowValue);

                    // Get special gage 2 flow value
                    const convertedGraftonSpecialNetmissGage2FlowValuesToCst = convertUTCtoCentralTime(data20);
                    // console.log("convertedGraftonSpecialNetmissGage2FlowValuesToCst: ", convertedGraftonSpecialNetmissGage2FlowValuesToCst);
                    const todayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[6][1]; // ************** change here
                    // console.log("todayGraftonSpecialGage2NetmissFlowValue: ", todayGraftonSpecialGage2NetmissFlowValue);
                    const firstDayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[0][1]; // ************** change here (keep the same)
                    // console.log("firstDayGraftonSpecialGage2NetmissFlowValue: ", firstDayGraftonSpecialGage2NetmissFlowValue);

                    // Sum today grafton plus ld25tw
                    const sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = (parseFloat(todayGraftonSpecialGage2NetmissFlowValue) + parseFloat(todayGraftonCorrespondingUpstreamNetmissFlowValue)) / 1000;
                    // console.log("sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand: ", sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand);

                    const isGraftonForecastBasedUponLd25MPTw = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) > 300;
                    // console.log("isGraftonForecastBasedUponLd25MPTw: (True if > 300) ", isGraftonForecastBasedUponLd25MPTw);
                    const isGraftonForecastBasedUponOpenRiver = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) <= 300;
                    // console.log("isGraftonForecastBasedUponOpenRiver: (True if <= 300) ", isGraftonForecastBasedUponOpenRiver);

                    if (isGraftonForecastBasedUponOpenRiver) {
                        // console.log("isGraftonForecastBasedUponOpenRiver");

                        // Get downstream netmiss day1
                        const todayGraftonNetmissDownstreamData = convertUTCtoCentralTime(data4).values[5][1]; // ************** change here
                        // console.log("todayGraftonNetmissDownstreamData: ", todayGraftonNetmissDownstreamData);

                        // Get downstream netmiss stagerev
                        const todayGraftonDownstreamNetmissStageValue = data12.values[5][1]; // ************** change here
                        // console.log("todayGraftonDownstreamNetmissStageValue: ", todayGraftonDownstreamNetmissStageValue);

                        // Check mel price open river
                        const isMelPricePoolOpenRiver = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 > todayGraftonNetmissDownstreamData;
                        // console.log("isMelPricePoolOpenRiver: ", isMelPricePoolOpenRiver);

                        // Check mel price regulated pool
                        const isMelPricePoolRegulatedPool = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 <= todayGraftonNetmissDownstreamData;
                        // console.log("isMelPricePoolRegulatedPool: ", isMelPricePoolRegulatedPool);

                        // Condition 1 - Sub 1 - isMelPricePoolOpenRiver
                        if (isMelPricePoolOpenRiver) {
                            // console.log("isMelPricePoolOpenRiver");
                        }

                        // Condition 1 - Sub 1 - isMelPricePoolRegulatedPool
                        if (isMelPricePoolRegulatedPool) {
                            // console.log("isMelPricePoolRegulatedPool");

                            // Get grafton yesterday stagerev value
                            const yesterdayGraftonStageRevValue = latest6AMValue.value;
                            // console.log("yesterdayGraftonStageRevValue: ", yesterdayGraftonStageRevValue);

                            // Get upstream grafton stage rev
                            const yesterdayGraftonUpstreamStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                            // console.log("yesterdayGraftonUpstreamStageRevValue: ", yesterdayGraftonUpstreamStageRevValue);
                            const yesterdayGraftonUpstreamStageRevValuePlus0001 = yesterdayGraftonUpstreamStageRevValue + 0.001;
                            // console.log("yesterdayGraftonUpstreamStageRevValuePlus0001: ", yesterdayGraftonUpstreamStageRevValuePlus0001);

                            const yesterdayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(yesterdayGraftonUpstreamStageRevValuePlus0001, ratingGraftonTableCoeUpstream);
                            // console.log("yesterdayGraftonCorrespondingUpstreamNetmissFlowValue: ", yesterdayGraftonCorrespondingUpstreamNetmissFlowValue);

                            const valueCompareOpenRiver = ((yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + firstDayGraftonSpecialGage2NetmissFlowValue) / 1000);
                            // console.log("valueCompareOpenRiver: ", valueCompareOpenRiver);

                            const isOpenRiverUseStageFlowRating = valueCompareOpenRiver > 300;
                            // console.log("isOpenRiverUseStageFlowRating : ", isOpenRiverUseStageFlowRating);

                            const isOpenRiverUseBackWater = valueCompareOpenRiver <= 300;
                            // console.log("isOpenRiverUseBackWater : ", isOpenRiverUseBackWater);

                            if (isOpenRiverUseBackWater) {
                                // console.log("isOpenRiverUseBackWater");

                                const yesterdayGraftonDownstreamStageRevValue2 = ((getLatest6AMValue(data22)).latest6AMValue).value;
                                // console.log("yesterdayGraftonDownstreamStageRevValue2: ", yesterdayGraftonDownstreamStageRevValue2);

                                const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                                // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                                let jsonFileName = "ratingGrafton.json";

                                // Call the function and log the result
                                const stage = yesterdayGraftonDownstreamStageRevValue2;
                                const flowRate = valueCompareOpenRiver;
                                // console.log("stage, flowRate, jsonFileName: ", stage, flowRate, jsonFileName);
                                readJSONTable2(stage, flowRate, jsonFileName).then(value => {
                                    if (value !== null) {
                                        // console.log(`Interpolated reading for flow rate ${flowRate} and stage ${stage} at table ${jsonFileName}: ${value}`);

                                        deltaYesterdayStage = yesterdayGraftonStageRevValue - value;
                                        // console.log("deltaYesterdayStage: ", deltaYesterdayStage);
                                    } else {
                                        // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                                    }
                                });

                                // Call the function and log the result
                                const stage2 = todayGraftonNetmissDownstreamData;
                                const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand;
                                // console.log("stage2, flowRate2, jsonFileName: ", stage2, flowRate2, jsonFileName);
                                readJSONTable2(stage2, flowRate2, jsonFileName).then(value => {
                                    if (value !== null) {
                                        // console.log(`Interpolated reading for flow rate ${flowRate2} and stage ${stage2} at table ${jsonFileName}: ${value}`);

                                        totalGrafton = value + deltaYesterdayStage;
                                        // console.log("totalGrafton: ", totalGrafton);

                                        // push data to GraftonForecast
                                        totalGraftonForecastDay6.push({ "value": totalGrafton }); // ************** change here
                                        GraftonForecast[location_id].push({ "value": totalGrafton });
                                    } else {
                                        // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                                    }
                                });
                            }
                        }
                    }
                }

                // // today
                // let todayGraftonUpstreamNetmissValue = null;
                // let todayGraftonUpstreamNetmissValuePlus001 = null;
                // if (data11 !== null && location_id === "Grafton-Mississippi") {
                //     todayGraftonUpstreamNetmissValue = parseFloat(convertedNetmissForecastingPointUpstreamData.values[5][1]); // ************** change here
                //     todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                //     // console.log("todayGraftonUpstreamNetmissValue: ", todayGraftonUpstreamNetmissValue);
                //     // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);
                // }
                // let todayGraftonDownstreamNetmissStageValue = null;
                // if (data12 !== null && location_id === "Grafton-Mississippi") {
                //     todayGraftonDownstreamNetmissStageValue = data12.values[1][1];
                //     // console.log("todayGraftonDownstreamNetmissStageValue: ", todayGraftonDownstreamNetmissStageValue);
                // }
                // let todayGraftonNetmissDownstreamData = null;
                // let isMelPricePoolOpenRiver = null;
                // if (data4 !== null && location_id === "Grafton-Mississippi") {
                //     todayGraftonNetmissDownstreamData = convertUTCtoCentralTime(data4).values[5][1]; // ************** change here
                //     isMelPricePoolOpenRiver = parseFloat(todayGraftonDownstreamNetmissStageValue) + 395.48 + 0.5 > todayGraftonNetmissDownstreamData;
                //     // console.log("todayGraftonNetmissDownstreamData: ", todayGraftonNetmissDownstreamData);
                //     // console.log("isMelPricePoolOpenRiver: ", isMelPricePoolOpenRiver);
                // }
                // // yesterday
                // let yesterdayGraftonStageRevValue = null;
                // if (data2 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonStageRevValue = latest6AMValue.value;
                //     // console.log("yesterdayGraftonStageRevValue: ", yesterdayGraftonStageRevValue);
                // }
                // let yesterdayGraftonUpstreamStageRevValue = null;
                // let yesterdayGraftonUpstreamStageRevValuePlus0001 = null;
                // if (data7 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonUpstreamStageRevValue = ((getLatest6AMValue(data7)).latest6AMValue).value;
                //     yesterdayGraftonUpstreamStageRevValuePlus0001 = yesterdayGraftonUpstreamStageRevValue + 0.001;
                //     // console.log("yesterdayGraftonUpstreamStageRevValue: ", yesterdayGraftonUpstreamStageRevValue);
                //     // console.log("yesterdayGraftonUpstreamStageRevValuePlus0001: ", yesterdayGraftonUpstreamStageRevValuePlus0001);
                // }
                // let yesterdayGraftonDownstreamStageRevValue = null;
                // if (data9 !== null && data22 !== null && location_id === "Grafton-Mississippi") {
                //     yesterdayGraftonDownstreamStageRevValue = ((getLatest6AMValue(data9)).latest6AMValue).value;
                //     yesterdayGraftonDownstreamStageRevValue2 = ((getLatest6AMValue(data22)).latest6AMValue).value;
                //     // console.log("yesterdayGraftonDownstreamStageRevValue: ", yesterdayGraftonDownstreamStageRevValue);
                //     // console.log("yesterdayGraftonDownstreamStageRevValue2: ", yesterdayGraftonDownstreamStageRevValue2);
                // }
                // // special gage 1
                // let yesterdayGraftonSpecialNetmissFlowValue = null;
                // let todayGraftonSpecialNetmissFlowValue = null;
                // if (data18 !== null && location_id === "Grafton-Mississippi") {
                //     const convertedGraftonSpecialNetmissFlowValuesToCst = convertUTCtoCentralTime(data18);
                //     yesterdayGraftonSpecialNetmissFlowValue = (convertedGraftonSpecialNetmissFlowValuesToCst.values[5][1]); // ************** change here
                //     todayGraftonSpecialNetmissFlowValue = (convertedGraftonSpecialNetmissFlowValuesToCst.values[6][1]); // ************** change here
                //     // console.log("convertedGraftonSpecialNetmissFlowValuesToCst: ", convertedGraftonSpecialNetmissFlowValuesToCst);
                //     // console.log("yesterdayGraftonSpecialNetmissFlowValue: ", yesterdayGraftonSpecialNetmissFlowValue);
                //     // console.log("todayGraftonSpecialNetmissFlowValue: ", todayGraftonSpecialNetmissFlowValue);
                // }
                // // Special gage 2
                // let yesterdayGraftonSpecialGage2NetmissFlowValue = null;
                // let todayGraftonSpecialGage2NetmissFlowValue = null;
                // if (data20 !== null && location_id === "Grafton-Mississippi") {
                //     const convertedGraftonSpecialNetmissGage2FlowValuesToCst = convertUTCtoCentralTime(data20);
                //     yesterdayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[5][1]; // ************** change here
                //     todayGraftonSpecialGage2NetmissFlowValue = convertedGraftonSpecialNetmissGage2FlowValuesToCst.values[6][1]; // ************** change here
                //     // console.log("convertedGraftonSpecialNetmissGage2FlowValuesToCst: ", convertedGraftonSpecialNetmissGage2FlowValuesToCst);
                //     // console.log("yesterdayGraftonSpecialGage2NetmissFlowValue: ", yesterdayGraftonSpecialGage2NetmissFlowValue);
                //     // console.log("todayGraftonSpecialGage2NetmissFlowValue: ", todayGraftonSpecialGage2NetmissFlowValue);
                // }
                // // Get rating tables
                // let ratingGraftonTableCoe = null;
                // let ratingGraftonTableCoeUpstream = null;
                // let ratingGraftonTableCoeDownstream = null;
                // let todayGraftonCorrespondingUpstreamNetmissFlowValue = null;
                // let todayGraftonCorrespondingDownstreamNetmissFlowValue = null;
                // let sumGraftonTodayHermannFlowPlusLd25TwFlow = null;
                // let sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = null;
                // if (data16 !== null && data17 !== null && data19 !== null && location_id === "Grafton-Mississippi") {
                //     ratingGraftonTableCoe = data16["simple-rating"]["rating-points"].point; // Grafton-Mississippi
                //     ratingGraftonTableCoeUpstream = data17["simple-rating"][0]["rating-points"].point; // LD 25 TW-Mississippi // [0] because active[0] and inactive[1]
                //     ratingGraftonTableCoeDownstream = data19["simple-rating"]["rating-points"].point; // Mel Price TW-Mississippi

                //     // console.log("data16: ", data16);
                //     // console.log("data17: ", data17);
                //     // console.log("data19: ", data19);
                //     // console.log("ratingGraftonTableCoe: ", ratingGraftonTableCoe);
                //     // console.log("ratingGraftonTableCoeUpstream: ", ratingGraftonTableCoeUpstream);
                //     // console.log("ratingGraftonTableCoeDownstream: ", ratingGraftonTableCoeDownstream);


                //     // get rating tables from ratings.js
                //     // console.log("ratingStageFlowGrafton: ", ratingStageFlowGrafton);
                //     // console.log("ratingStageFlowLouisiana: ", ratingStageFlowLouisiana);
                //     // console.log("ratingStageFlowLd25Tw: ", ratingStageFlowLd25Tw);
                //     // console.log("ratingStageFlowMelPriceTw: ", ratingStageFlowMelPriceTw);

                //     todayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(todayGraftonUpstreamNetmissValuePlus001, ratingGraftonTableCoeUpstream);
                //     todayGraftonCorrespondingDownstreamNetmissFlowValue = findDepByInd(todayGraftonDownstreamNetmissStageValue, ratingGraftonTableCoeDownstream);
                //     // console.log("todayGraftonCorrespondingUpstreamNetmissFlowValue: (database rating is off from excel) ", todayGraftonCorrespondingUpstreamNetmissFlowValue);
                //     // console.log("todayGraftonCorrespondingDownstreamNetmissFlowValue: ", todayGraftonCorrespondingDownstreamNetmissFlowValue);

                //     // sum
                //     sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand = (parseFloat(todayGraftonSpecialGage2NetmissFlowValue) + parseFloat(todayGraftonCorrespondingUpstreamNetmissFlowValue)) / 1000;
                //     // console.log("sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand: ", sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand);
                // }
                // let totalGrafton = null;
                // if (location_id === "Grafton-Mississippi") {
                //     const isGraftonForecastBasedUponLd25MPTw = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) > 300;
                //     // console.log("isGraftonForecastBasedUponLd25MPTw: (True if > 300) ", isGraftonForecastBasedUponLd25MPTw);

                //     const isGraftonForecastBasedUponOpenRiver = parseFloat(sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand) <= 300;
                //     // console.log("isGraftonForecastBasedUponOpenRiver: (True if <= 300) ", isGraftonForecastBasedUponOpenRiver);

                //     const yesterdayGraftonCorrespondingUpstreamNetmissFlowValue = findDepByInd(yesterdayGraftonUpstreamStageRevValuePlus0001, ratingGraftonTableCoeUpstream);
                //     // console.log("yesterdayGraftonCorrespondingUpstreamNetmissFlowValue: ", yesterdayGraftonCorrespondingUpstreamNetmissFlowValue);

                //     const valueCompareOpenRiver = ((yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + yesterdayGraftonSpecialGage2NetmissFlowValue) / 1000);
                //     // console.log("valueCompareOpenRiver: ", valueCompareOpenRiver);

                //     const isOpenRiverUseStageFlowRating = valueCompareOpenRiver > 300;
                //     // console.log("isOpenRiverUseStageFlowRating : ", isOpenRiverUseStageFlowRating);

                //     const isOpenRiverUseBackWater = valueCompareOpenRiver <= 300;
                //     // console.log("isOpenRiverUseBackWater : ", isOpenRiverUseBackWater);

                //     // Determine Grafton Forecast Based on Conditions
                //     if (isGraftonForecastBasedUponOpenRiver) {
                //         if (isMelPricePoolOpenRiver) {
                //             let deltaYesterdayStage = null;

                //             if (isOpenRiverUseStageFlowRating) {
                //                 const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                //                 // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                //                 const flowToSend = (yesterdayGraftonCorrespondingUpstreamNetmissFlowValue + yesterdayGraftonSpecialGage2NetmissFlowValue);
                //                 // console.log("flowToSend: ", flowToSend);

                //                 const t = findIndByDep(flowToSend, ratingTableSpecial1);
                //                 // console.log("t: ", t);

                //                 deltaYesterdayStage = yesterdayGraftonStageRevValue - t;
                //                 // console.log("deltaYesterdayStage: ", deltaYesterdayStage);

                //                 const todayGraftonUpstreamNetmissValuePlus001 = todayGraftonUpstreamNetmissValue + 0.001;
                //                 // console.log("todayGraftonUpstreamNetmissValuePlus001: ", todayGraftonUpstreamNetmissValuePlus001);

                //                 const todayFlowSum = todayGraftonCorrespondingUpstreamNetmissFlowValue + todayGraftonSpecialGage2NetmissFlowValue;
                //                 // console.log("todayFlowSum: ", todayFlowSum);

                //                 const x = todayGraftonDownstreamNetmissStageValue + 395.48 + 0.5;
                //                 // console.log("x: ", x);
                //             } else if (isOpenRiverUseBackWater) {
                //                 const ratingTableSpecial1 = data21["simple-rating"][0]["rating-points"].point;
                //                 // console.log("ratingTableSpecial1: ", ratingTableSpecial1);

                //                 let jsonFileName = "ratingGrafton.json"; //"ratingGrafton.json";

                //                 // Call the function and log the result
                //                 const stage = yesterdayGraftonDownstreamStageRevValue2; // yesterdayGraftonDownstreamStageRevValue2
                //                 const flowRate = valueCompareOpenRiver; // valueCompareOpenRiver
                //                 // console.log("stage, flowRate, jsonFileName: ", stage, flowRate, jsonFileName);
                //                 readJSONTable2(stage, flowRate, jsonFileName).then(value => {
                //                     if (value !== null) {
                //                         // console.log(`Interpolated reading for flow rate ${flowRate} and stage ${stage} at table ${jsonFileName}: ${value}`);

                //                         deltaYesterdayStage = yesterdayGraftonStageRevValue - value;
                //                         // console.log("deltaYesterdayStage: ", deltaYesterdayStage);
                //                     } else {
                //                         // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                //                     }
                //                 });

                //                 // Call the function and log the result
                //                 const stage2 = todayGraftonDownstreamNetmissStageValue + 395.48 + 0.5; // yesterdayGraftonDownstreamStageRevValue2
                //                 const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand; // valueCompareOpenRiver
                //                 // console.log("stage2, flowRate2, jsonFileName: ", stage2, flowRate2, jsonFileName);
                //                 readJSONTable2(stage2, flowRate2, jsonFileName).then(value => {
                //                     if (value !== null) {
                //                         // console.log(`Interpolated reading for flow rate ${flowRate2} and stage ${stage2} at table ${jsonFileName}: ${value}`);

                //                         totalGrafton = value + deltaYesterdayStage;
                //                         // console.log("totalGrafton: ", totalGrafton);

                //                         // push data to GraftonForecast
                //                         totalGraftonForecastDay6.push({ "value": totalGrafton });
                //                         GraftonForecast[location_id].push({ "value": totalGrafton });
                //                     } else {
                //                         // console.log(`No data found for flow rate ${flowRate} and stage ${stage}`);
                //                     }
                //                 });
                //             }
                //         } else {
                //             // Regulated Pool
                //             if (isOpenRiverUseStageFlowRating) {

                //             } else if (isOpenRiverUseBackWater) {
                //                 // Grafton Rating Table
                //                 const ratingGrafton = {
                //                     "412": {
                //                         "0": 8.21,
                //                         "10": 8.56,
                //                         "20": 8.91,
                //                         "30": 9.27,
                //                         "40": 9.62,
                //                         "50": 9.98,
                //                         "60": 10.35,
                //                         "70": 10.71,
                //                         "80": 11.08,
                //                         "90": 11.45,
                //                         "100": 11.83,
                //                         "110": 12.20,
                //                         "120": 12.58,
                //                         "130": 12.96,
                //                         "140": 13.35,
                //                         "150": 13.73,
                //                         "160": 14.12,
                //                         "170": 14.52,
                //                         "180": 14.91,
                //                         "190": 15.31,
                //                         "200": 15.71,
                //                         "210": 16.11,
                //                         "220": 16.51,
                //                         "230": 16.91,
                //                         "240": 17.34,
                //                         "250": 17.82,
                //                         "260": 18.41,
                //                         "270": 19.12,
                //                         "280": 19.87,
                //                         "290": 20.80,
                //                         "300": 21.85
                //                     },
                //                     "413": {
                //                         "0": 9.21,
                //                         "10": 9.49,
                //                         "20": 9.78,
                //                         "30": 10.07,
                //                         "40": 10.37,
                //                         "50": 10.68,
                //                         "60": 10.99,
                //                         "70": 11.31,
                //                         "80": 11.64,
                //                         "90": 11.97,
                //                         "100": 12.31,
                //                         "110": 12.65,
                //                         "120": 13.00,
                //                         "130": 13.36,
                //                         "140": 13.72,
                //                         "150": 14.09,
                //                         "160": 14.47,
                //                         "170": 14.85,
                //                         "180": 15.24,
                //                         "190": 15.63,
                //                         "200": 16.03,
                //                         "210": 16.43,
                //                         "220": 16.83,
                //                         "230": 17.23,
                //                         "240": 17.66,
                //                         "250": 18.14,
                //                         "260": 18.73,
                //                         "270": 19.44,
                //                         "280": 20.19,
                //                         "290": 21.00,
                //                         "300": 21.85
                //                     },
                //                     "414": {
                //                         "0": 10.21,
                //                         "10": 10.42,
                //                         "20": 10.65,
                //                         "30": 10.88,
                //                         "40": 11.13,
                //                         "50": 11.38,
                //                         "60": 11.64,
                //                         "70": 11.91,
                //                         "80": 12.20,
                //                         "90": 12.49,
                //                         "100": 12.79,
                //                         "110": 13.10,
                //                         "120": 13.43,
                //                         "130": 13.76,
                //                         "140": 14.10,
                //                         "150": 14.45,
                //                         "160": 14.81,
                //                         "170": 15.18,
                //                         "180": 15.56,
                //                         "190": 15.95,
                //                         "200": 16.35,
                //                         "210": 16.75,
                //                         "220": 17.15,
                //                         "230": 17.55,
                //                         "240": 17.95,
                //                         "250": 18.42,
                //                         "260": 19.00,
                //                         "270": 19.68,
                //                         "280": 20.41,
                //                         "290": 21.13,
                //                         "300": 21.85
                //                     },
                //                     "415": {
                //                         "0": 11.21,
                //                         "10": 11.35,
                //                         "20": 11.51,
                //                         "30": 11.68,
                //                         "40": 11.87,
                //                         "50": 12.06,
                //                         "60": 12.28,
                //                         "70": 12.50,
                //                         "80": 12.74,
                //                         "90": 12.99,
                //                         "100": 13.25,
                //                         "110": 13.53,
                //                         "120": 13.82,
                //                         "130": 14.12,
                //                         "140": 14.44,
                //                         "150": 14.77,
                //                         "160": 15.11,
                //                         "170": 15.47,
                //                         "180": 15.84,
                //                         "190": 16.22,
                //                         "200": 16.60,
                //                         "210": 16.99,
                //                         "220": 17.39,
                //                         "230": 17.82,
                //                         "240": 18.20,
                //                         "250": 18.66,
                //                         "260": 19.21,
                //                         "270": 19.84,
                //                         "280": 20.51,
                //                         "290": 21.18,
                //                         "300": 21.85
                //                     },
                //                     "416": {
                //                         "0": 12.21,
                //                         "10": 12.28,
                //                         "20": 12.37,
                //                         "30": 12.48,
                //                         "40": 12.60,
                //                         "50": 12.74,
                //                         "60": 12.90,
                //                         "70": 13.07,
                //                         "80": 13.26,
                //                         "90": 13.47,
                //                         "100": 13.69,
                //                         "110": 13.94,
                //                         "120": 14.19,
                //                         "130": 14.47,
                //                         "140": 14.76,
                //                         "150": 15.07,
                //                         "160": 15.40,
                //                         "170": 15.74,
                //                         "180": 16.10,
                //                         "190": 16.46,
                //                         "200": 16.82,
                //                         "210": 17.20,
                //                         "220": 17.60,
                //                         "230": 18.00,
                //                         "240": 18.45,
                //                         "250": 18.90,
                //                         "260": 19.42,
                //                         "270": 20.00,
                //                         "280": 20.62,
                //                         "290": 21.23,
                //                         "300": 21.85
                //                     },
                //                     "417": {
                //                         "0": 13.21,
                //                         "10": 13.24,
                //                         "20": 13.28,
                //                         "30": 13.34,
                //                         "40": 13.42,
                //                         "50": 13.51,
                //                         "60": 13.62,
                //                         "70": 13.74,
                //                         "80": 13.88,
                //                         "90": 14.04,
                //                         "100": 14.21,
                //                         "110": 14.40,
                //                         "120": 14.63,
                //                         "130": 14.88,
                //                         "140": 15.16,
                //                         "150": 15.45,
                //                         "160": 15.76,
                //                         "170": 16.09,
                //                         "180": 16.44,
                //                         "190": 16.79,
                //                         "200": 17.16,
                //                         "210": 17.55,
                //                         "220": 17.94,
                //                         "230": 18.34,
                //                         "240": 18.78,
                //                         "250": 19.23,
                //                         "260": 19.73,
                //                         "270": 20.23,
                //                         "280": 20.73,
                //                         "290": 21.25,
                //                         "300": 21.85
                //                     },
                //                     "418": {
                //                         "0": 14.21,
                //                         "10": 14.24,
                //                         "20": 14.27,
                //                         "30": 14.32,
                //                         "40": 14.37,
                //                         "50": 14.44,
                //                         "60": 14.51,
                //                         "70": 14.60,
                //                         "80": 14.69,
                //                         "90": 14.79,
                //                         "100": 14.90,
                //                         "110": 15.02,
                //                         "120": 15.22,
                //                         "130": 15.45,
                //                         "140": 15.72,
                //                         "150": 16.00,
                //                         "160": 16.29,
                //                         "170": 16.60,
                //                         "180": 16.92,
                //                         "190": 17.25,
                //                         "200": 17.59,
                //                         "210": 17.95,
                //                         "220": 18.33,
                //                         "230": 18.72,
                //                         "240": 19.13,
                //                         "250": 19.55,
                //                         "260": 19.98,
                //                         "270": 20.40,
                //                         "280": 20.84,
                //                         "290": 21.29,
                //                         "300": 21.85
                //                     },
                //                     "419": {
                //                         "0": 15.21,
                //                         "10": 15.24,
                //                         "20": 15.27,
                //                         "30": 15.31,
                //                         "40": 15.36,
                //                         "50": 15.41,
                //                         "60": 15.47,
                //                         "70": 15.54,
                //                         "80": 15.62,
                //                         "90": 15.71,
                //                         "100": 15.82,
                //                         "110": 15.93,
                //                         "120": 16.04,
                //                         "130": 16.18,
                //                         "140": 16.36,
                //                         "150": 16.56,
                //                         "160": 16.79,
                //                         "170": 17.05,
                //                         "180": 17.34,
                //                         "190": 17.64,
                //                         "200": 17.95,
                //                         "210": 18.28,
                //                         "220": 18.65,
                //                         "230": 19.03,
                //                         "240": 19.42,
                //                         "250": 19.80,
                //                         "260": 20.19,
                //                         "270": 20.58,
                //                         "280": 20.98,
                //                         "290": 21.38,
                //                         "300": 21.85
                //                     },
                //                     "420": {
                //                         "0": 16.21,
                //                         "10": 16.24,
                //                         "20": 16.28,
                //                         "30": 16.32,
                //                         "40": 16.37,
                //                         "50": 16.42,
                //                         "60": 16.47,
                //                         "70": 16.53,
                //                         "80": 16.61,
                //                         "90": 16.69,
                //                         "100": 16.77,
                //                         "110": 16.83,
                //                         "120": 16.87,
                //                         "130": 16.94,
                //                         "140": 17.07,
                //                         "150": 17.25,
                //                         "160": 17.47,
                //                         "170": 17.71,
                //                         "180": 17.97,
                //                         "190": 18.25,
                //                         "200": 18.50,
                //                         "210": 18.79,
                //                         "220": 19.10,
                //                         "230": 19.43,
                //                         "240": 19.76,
                //                         "250": 20.09,
                //                         "260": 20.42,
                //                         "270": 20.76,
                //                         "280": 21.10,
                //                         "290": 21.45,
                //                         "300": 21.85
                //                     },
                //                     "421": {
                //                         "0": 17.21,
                //                         "10": 17.24,
                //                         "20": 17.27,
                //                         "30": 17.31,
                //                         "40": 17.35,
                //                         "50": 17.40,
                //                         "60": 17.44,
                //                         "70": 17.50,
                //                         "80": 17.56,
                //                         "90": 17.63,
                //                         "100": 17.70,
                //                         "110": 17.75,
                //                         "120": 17.79,
                //                         "130": 17.85,
                //                         "140": 17.96,
                //                         "150": 18.10,
                //                         "160": 18.28,
                //                         "170": 18.48,
                //                         "180": 18.70,
                //                         "190": 18.92,
                //                         "200": 19.13,
                //                         "210": 19.36,
                //                         "220": 19.62,
                //                         "230": 19.88,
                //                         "240": 20.15,
                //                         "250": 20.42,
                //                         "260": 20.69,
                //                         "270": 20.96,
                //                         "280": 21.24,
                //                         "290": 21.52,
                //                         "300": 21.85
                //                     },
                //                     "422": {
                //                         "0": 18.21,
                //                         "10": 18.24,
                //                         "20": 18.27,
                //                         "30": 18.30,
                //                         "40": 18.34,
                //                         "50": 18.38,
                //                         "60": 18.42,
                //                         "70": 18.46,
                //                         "80": 18.52,
                //                         "90": 18.58,
                //                         "100": 18.63,
                //                         "110": 18.68,
                //                         "120": 18.71,
                //                         "130": 18.76,
                //                         "140": 18.85,
                //                         "150": 18.96,
                //                         "160": 19.10,
                //                         "170": 19.25,
                //                         "180": 19.42,
                //                         "190": 19.59,
                //                         "200": 19.76,
                //                         "210": 19.94,
                //                         "220": 20.13,
                //                         "230": 20.34,
                //                         "240": 20.54,
                //                         "250": 20.75,
                //                         "260": 20.96,
                //                         "270": 21.17,
                //                         "280": 21.38,
                //                         "290": 21.60,
                //                         "300": 21.85
                //                     },
                //                     "423": {
                //                         "0": 19.21,
                //                         "10": 19.24,
                //                         "20": 19.26,
                //                         "30": 19.29,
                //                         "40": 19.32,
                //                         "50": 19.36,
                //                         "60": 19.39,
                //                         "70": 19.43,
                //                         "80": 19.47,
                //                         "90": 19.52,
                //                         "100": 19.56,
                //                         "110": 19.60,
                //                         "120": 19.63,
                //                         "130": 19.67,
                //                         "140": 19.73,
                //                         "150": 19.82,
                //                         "160": 19.92,
                //                         "170": 20.03,
                //                         "180": 20.14,
                //                         "190": 20.27,
                //                         "200": 20.38,
                //                         "210": 20.51,
                //                         "220": 20.65,
                //                         "230": 20.79,
                //                         "240": 20.94,
                //                         "250": 21.08,
                //                         "260": 21.23,
                //                         "270": 21.37,
                //                         "280": 21.52,
                //                         "290": 21.68,
                //                         "300": 21.85
                //                     },
                //                     "424": {
                //                         "0": 20.21,
                //                         "10": 20.23,
                //                         "20": 20.26,
                //                         "30": 20.28,
                //                         "40": 20.31,
                //                         "50": 20.34,
                //                         "60": 20.36,
                //                         "70": 20.39,
                //                         "80": 20.43,
                //                         "90": 20.46,
                //                         "100": 20.49,
                //                         "110": 20.52,
                //                         "120": 20.55,
                //                         "130": 20.58,
                //                         "140": 20.62,
                //                         "150": 20.67,
                //                         "160": 20.73,
                //                         "170": 20.80,
                //                         "180": 20.87,
                //                         "190": 20.94,
                //                         "200": 21.01,
                //                         "210": 21.08,
                //                         "220": 21.16,
                //                         "230": 21.25,
                //                         "240": 21.33,
                //                         "250": 21.41,
                //                         "260": 21.49,
                //                         "270": 21.58,
                //                         "280": 21.66,
                //                         "290": 21.75,
                //                         "300": 21.85
                //                     },
                //                     "425": {
                //                         "0": 21.21,
                //                         "10": 21.23,
                //                         "20": 21.25,
                //                         "30": 21.27,
                //                         "40": 21.30,
                //                         "50": 21.32,
                //                         "60": 21.34,
                //                         "70": 21.36,
                //                         "80": 21.38,
                //                         "90": 21.40,
                //                         "100": 21.42,
                //                         "110": 21.44,
                //                         "120": 21.47,
                //                         "130": 21.49,
                //                         "140": 21.51,
                //                         "150": 21.53,
                //                         "160": 21.55,
                //                         "170": 21.57,
                //                         "180": 21.59,
                //                         "190": 21.61,
                //                         "200": 21.64,
                //                         "210": 21.66,
                //                         "220": 21.68,
                //                         "230": 21.70,
                //                         "240": 21.72,
                //                         "250": 21.74,
                //                         "260": 21.76,
                //                         "270": 21.78,
                //                         "280": 21.81,
                //                         "290": 21.83,
                //                         "300": 21.85
                //                     }
                //                 }

                //                 // Interpolating Grafton Rating Table
                //                 function interpolateValue(rating, point) {
                //                     const keys = Object.keys(ratingGrafton).map(Number);

                //                     // Find the two closest keys
                //                     let lowerKey = null, upperKey = null;

                //                     for (let i = 0; i < keys.length; i++) {
                //                         if (keys[i] <= rating) lowerKey = keys[i];
                //                         if (keys[i] > rating && upperKey === null) upperKey = keys[i];
                //                     }

                //                     if (lowerKey === null || upperKey === null) {
                //                         throw new Error('Rating out of bounds.');
                //                     }

                //                     const lowerValues = ratingGrafton[lowerKey];
                //                     const upperValues = ratingGrafton[upperKey];

                //                     // Find the two closest values within these ranges
                //                     const lowerPoints = Object.keys(lowerValues).map(Number);
                //                     const upperPoints = Object.keys(upperValues).map(Number);

                //                     let lowerPoint = null, upperPoint = null;

                //                     for (let i = 0; i < lowerPoints.length; i++) {
                //                         if (lowerPoints[i] <= point) lowerPoint = lowerPoints[i];
                //                         if (lowerPoints[i] > point && upperPoint === null) upperPoint = lowerPoints[i];
                //                     }

                //                     if (lowerPoint === null || upperPoint === null) {
                //                         throw new Error('Point out of bounds.');
                //                     }

                //                     const lowerValue = lowerValues[lowerPoint];
                //                     const upperValue = upperValues[upperPoint];

                //                     // Perform interpolation
                //                     const interpolatedValue = lowerValue + ((point - lowerPoint) / (upperPoint - lowerPoint)) * (upperValue - lowerValue);

                //                     return interpolatedValue;
                //                 }

                //                 // deltaFirst
                //                 const stage = yesterdayGraftonDownstreamStageRevValue2;
                //                 const flowRate = valueCompareOpenRiver;
                //                 const interpolatedValue = interpolateValue(stage, flowRate);

                //                 // console.log(`Interpolated value for stage ${stage} and flowRate ${flowRate}: ${interpolatedValue}`);

                //                 const deltaFirst = yesterdayGraftonStageRevValue - interpolatedValue;
                //                 // console.log("deltaFirst: ", deltaFirst);

                //                 // deltaSecond
                //                 const stage2 = todayGraftonNetmissDownstreamData;
                //                 const flowRate2 = sumGraftonTodayHermannFlowPlusLd25TwFlowDivideOneThousand;
                //                 const interpolatedValue2 = interpolateValue(stage2, flowRate2);

                //                 // console.log(`Interpolated value for stage ${stage2} and flowRate ${flowRate2}: ${interpolatedValue2}`);

                //                 totalGrafton = deltaFirst + interpolatedValue2;
                //                 // console.log("totalGrafton: ", totalGrafton);

                //                 // push data to GraftonForecast
                //                 totalGraftonForecastDay6.push({ "value": totalGrafton });
                //                 GraftonForecast[location_id].push({ "value": totalGrafton });
                //             } else {
                //                 totalGrafton = 999;
                //                 // console.log("totalGrafton: ", totalGrafton);
                //             }
                //             // push data to GraftonForecast
                //             totalGraftonForecastDay6.push({ "value": totalGrafton });
                //             GraftonForecast[location_id].push({ "value": totalGrafton });
                //         }
                //     } else if (isGraftonForecastBasedUponLd25MPTw) {
                //         totalGrafton = yesterdayGraftonStageRevValue + (((todayGraftonUpstreamNetmissValue - yesterdayGraftonUpstreamStageRevValue) + (todayGraftonDownstreamNetmissStageValue - yesterdayGraftonDownstreamStageRevValue)) / 2);
                //         // console.log("totalGrafton: ", totalGrafton);

                //         // push data to GraftonForecast
                //         totalGraftonForecastDay6.push({ "value": totalGrafton });
                //         GraftonForecast[location_id].push({ "value": totalGrafton });
                //     } else {
                //         totalGrafton = 909;
                //         // console.log("totalGrafton: ", totalGrafton);

                //         // push data to GraftonForecast
                //         totalGraftonForecastDay6.push({ "value": totalGrafton });
                //         GraftonForecast[location_id].push({ "value": totalGrafton });
                //     }
                // }
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
                totalGraftonForecastDay6
            }

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

async function fetchAllUrls(url1, url2, url3, url4, url5, url6, url7, url8, url9, url10, url11, url12, url13, url14, url15, url16, url17, url18, url19, url20, url21, url22, url23, url24, url25, url26, url27) {
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
            url16 ? fetch(url16, fetchOptions) : Promise.resolve(null),
            url17 ? fetch(url17, fetchOptions) : Promise.resolve(null),
            url18 ? fetch(url18, fetchOptions) : Promise.resolve(null),
            url19 ? fetch(url19, fetchOptions) : Promise.resolve(null),
            url20 ? fetch(url20, fetchOptions) : Promise.resolve(null),
            url21 ? fetch(url21, fetchOptions) : Promise.resolve(null),
            url22 ? fetch(url22, fetchOptions) : Promise.resolve(null),
            url23 ? fetch(url23, fetchOptions) : Promise.resolve(null),
            url24 ? fetch(url24, fetchOptions) : Promise.resolve(null),
            url25 ? fetch(url25, fetchOptions) : Promise.resolve(null),
            url26 ? fetch(url26, fetchOptions) : Promise.resolve(null),
            url27 ? fetch(url27, fetchOptions) : Promise.resolve(null)
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
            data16: data[15],
            data17: data[16],
            data18: data[17],
            data19: data[18],
            data20: data[19],
            data21: data[20],
            data22: data[21],
            data23: data[22],
            data24: data[23],
            data25: data[24],
            data26: data[25],
            data27: data[26]
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
            data16: null,
            data17: null,
            data18: null,
            data19: null,
            data20: null,
            data21: null,
            data22: null,
            data23: null,
            data24: null,
            data25: null,
            data26: null,
            data27: null
        }; // return null data if any error occurs
    }
}