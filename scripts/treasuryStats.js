// 
const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const yahooFinance = require("yahoo-finance");
const URL = "https://finance.yahoo.com/quote";
const baseURL = "https://finance.yahoo.com/quote";
const logger = require('../logger')('TREASURY_STATS'); // Defining logger for this device controller


async function getDailyTreasuryRates() {

    let cpiDataRes = await axios.get("https://www.bls.gov/cpi/latest-numbers.htm").then((response) => {
        if (response.status === 200) {
            return response.data;
        }
    }, (error) => logger.print(error));
    const dom = new JSDOM(cpiDataRes);
    const yoyCPI = dom.window.document.querySelector("#latest-numbers > div:nth-child(4) > p:nth-child(4) > span.data-text > span.data.positive").textContent;
    return yoyCPI

}
async function getTreasuryData() {

    let treasuryDataRes = await axios.get(`https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/2022/all?type=daily_treasury_yield_curve&field_tdr_date_value=2022&page&_format=csv`).then((response) => {
        if (response.status === 200) {
            return response.data;
        }
    }, (error) => logger.print(error));

    let splitTreasuryData = treasuryDataRes.split(",")
    let tenYearGovtTreasuryYtm = splitTreasuryData[24]
    return tenYearGovtTreasuryYtm

}
async function getDailyTreasuryYieldCurve() {

    let treasuryYieldCurveRes = await axios.get(`https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/2022/all?type=daily_treasury_yield_curve&field_tdr_date_value=2022&page&_format=csv`).then((response) => {
        if (response.status === 200) {
            return response.data;
        }
    }, (error) => logger.print(error));

    let splitTreasuryData = treasuryYieldCurveRes.split("\n")
    let treasuryYieldCurve = {}
    let splitTreasureValues = splitTreasuryData[1].split(",")

    splitTreasuryData[0].split(",").forEach((d, i) => {
        if ((i > 0) || (i != 1)) {
            d = d.replace('\"', '');
            d = d.replace('\"', '');
            treasuryYieldCurve[d] = parseFloat(splitTreasureValues[i])
        }
    })
    return treasuryYieldCurve

}
async function getData() {

    let yoyCPI = await getDailyTreasuryRates()
    let tenYearGovtTreasuryYtm = await getTreasuryData()
    let tresYieldCurveRes = await getDailyTreasuryYieldCurve()


    return {
        "10 Year Govt Treasury (YTM)": tenYearGovtTreasuryYtm,
        "Yoy CPI": yoyCPI,
        "Treasury Yield Curve": tresYieldCurveRes
    }

}


exports.getData = getData;