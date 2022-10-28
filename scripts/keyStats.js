const axios = require('axios');
const cheerio = require("cheerio");
const baseURL = "https://finance.yahoo.com/quote";
const logger = require('../logger')('KEY_STATS'); // Defining logger for this device controller
const yahooFinance = require("yahoo-finance");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Retry with max attempt
async function retry(attempt) {
  const maxRetry = 3;
  if (attempt > maxRetry) {
    return false;
  }
  // Backoff
  await sleep(2000);

  return true;
}


const YahooNumModifiers = {
  k: 1000,
  M: 1000000,
  B: 1000000000,
}


function parseYahooHtml(html, fieldName) {

  



  let fields = {
    "Diluted EPS": null,
    "Quarterly Earnings Growth": null,
    "Quarterly Revenue Growth": null,
    "50-Day Moving Average": null,
    "200-Day Moving Average": null,
    "Shares Outstanding":null,
    "Trailing P\/E": null,
    "Forward P\/E":null
    
  };
  Object.entries(fields).forEach(([key, value]) => {
    var tableRegex = new RegExp(`${key}<\/span>.*?<td.*?>(-?[0-9]*\.?[0-9]+|N\/A)([kbm])?(?:<\/span>)?<\/td>`, "gi");
    var match = tableRegex.exec(html);

    if (match != null) {
      fields[key] = match[1]
    }

  })

  return fields

}

async function getYahooHtmlData(ticker) {
  let res = await axios.get(`https://finance.yahoo.com/quote/${ticker}/key-statistics?p=${ticker}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;

      }
    }, (error) => logger.print(error));

  return res;
}
async function yahooFinanceSDK(ticker) {



  try {

    return await yahooFinance.quote({
      symbol: ticker,  
      modules: ['defaultKeyStatistics','summaryDetail','financialData']   
    }, function (err, quotes) {

      return quotes
    });


  } catch (error) {
    throw error;
  }

}
async function getData(ticker) {
  let defaultStats = await yahooFinanceSDK(ticker);
  var html = await getYahooHtmlData(ticker);
  try {
    value = await parseYahooHtml(html, "");
    return {
      ...defaultStats,...value
    }
  } catch (e) {
    logger.print(e);
  }

}

exports.getData = getData;

/*
Abbreviation Guide:
mrq = Most Recent Quarter
ttm = Trailing Twelve Months
yoy = Year Over Year
lfy = Last Fiscal Year
fye = Fiscal Year Ending

Footnotes:
1 Data provided by Refinitiv.
2 Data provided by EDGAR Online.
3 Data derived from multiple sources or calculated by Yahoo Finance.
4 Data provided by Morningstar, Inc.
5 Shares outstanding is taken from the most recently filed quarterly or annual report and Market Cap is calculated using shares outstanding.
6 Implied Shares Outstanding of common equity, assuming the conversion of all convertible subsidiary equity into common.
7 EBITDA is calculated by S&P Global Market Intelligence using methodology that may differ from that used by a company in its reporting.
8 A company's float is a measure of the number of shares available for trading by the public. It's calculated by taking the number of issued and outstanding shares minus any restricted stock, which may not be publicly traded. 
*/