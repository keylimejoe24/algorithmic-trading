//https://github.com/yonahd/stock-info
//https://github.com/sidpagariya/yfinance-live
//https://github.com/LolaSun/Yahoo-Finance-History-Downloader/blob/main/YahooFinanceHistoryDownloader.py


const Algorithms = require('./algorithms.js');
const axios = require('axios');
const stats = require('./scripts/stat');
const treasuryStats = require('./scripts/treasuryStats');
const keyStats = require('./scripts/keyStats');
const stock = require('./scripts/stock');
const history = require('./scripts/history');
const balanceSheet = require('./scripts/balanceSheet');
const logger = require('./logger')('APPLICATION'); // Defining logger for this device controller




async function run() {
  let tickers = {
    "AMZN": {},
    // "BAC": {},
    // "TSLA": {},
    // "MSFT": {},
    // "META": {},
    // "NFLX": {},
    // "JPM": {},
    // "BAC": {},
    // "GS": {},
    // "NDAQ": {},
    // "ALLY": {},
    // "PG": {},
    // "QCOM": {},
    // "NVDA": {},
    // "JNJ": {},
    // "TSM": {},
    // "BEEM": {},
    // "MCD": {},
    // "SBUX": {},
    // "AMD": {},
    // "HASI": {},
    // "O": {},
    // "KIM": {},
    // "LAND": {},
    // "STAG": {},
    // "MAIN": {},
    // "INTU": {},
    // "WM": {},
    // "AWK": {},
    // "ECL": {},
    // "NEE": {},
    // "AM": {},
    // "XOM": {},
    // "F": {},
    // "GM": {},
    // "T": {},
    // "VZ": {},
    // "SQ": {},
    // "PYPL": {},
    // "AI": {},
    // "PATH": {},
    // "CHPT": {},
    // "PLUG": {},
    // "GOLD": {},
    // "MARA": {},
    // "MSTR": {},
    // "GEO": {},
    // "CVNA": {},
    // "AMSC": {},
  }
  startTime = Date.now();
  try {


    
    for (const [key, value] of Object.entries(tickers)) {
      logger.print(`Ticker: (${key})`)
      let stockData = null
      let balanceSheetRes = null
      let historyRes = null
      let keyStatsRes = null
      let treasuryStatsRes = null
     
      try {
        stockData = await stock.fetchData(key);
      } catch (e) {
        logger.print(e)
      }
      try {
        balanceSheetRes = await balanceSheet.getData(key);
      } catch (e) {
        logger.print(e)
      }
      try {
        historyRes = await history.getData(key);
      } catch (e) {
        logger.print(e)
      }
      try {
        keyStatsRes = await keyStats.getData(key);
      } catch (e) {
        logger.print(e)
      }
      try {
        treasuryStatsRes = await treasuryStats.getData();
      } catch (e) {
        logger.print(e)
      }
     







      // {
      //   "summaryDetail": {
      //     "maxAge": 1,
      //     "priceHint": 2,
      //     "previousClose": 313.06,
      //     "open": 315.5,
      //     "dayLow": 310.2,
      //     "dayHigh": 316.5,
      //     "regularMarketPreviousClose": 313.06,
      //     "regularMarketOpen": 315.5,
      //     "regularMarketDayLow": 310.2,
      //     "regularMarketDayHigh": 316.5,
      //     "dividendRate": 1.56,
      //     "dividendYield": 0.023,
      //     "exDividendDate": 2017-02-09T00:00:00.000Z,
      //     "payoutRatio": 0.66080004,
      //     "fiveYearAvgDividendYield": 2.59,
      //     "beta": 1.15078,
      //     "trailingPE": -65.177185,
      //     "forwardPE": -330.6702,
      //     "volume": 4628544,
      //     "regularMarketVolume": 4628544,
      //     "averageVolume": 6076252,
      //     "averageVolume10days": 5380128,
      //     "averageDailyVolume10Day": 5380128,
      //     "bid": 310.3,
      //     "ask": 310.72,
      //     "bidSize": 400,
      //     "askSize": 200,
      //     "marketCap": 51056934912,
      //     "fiftyTwoWeekLow": 178.19,
      //     "fiftyTwoWeekHigh": 327.66,
      //     "priceToSalesTrailing12Months": 5.972023,
      //     "fiftyDayAverage": 309.1597,
      //     "twoHundredDayAverage": 249.92029,
      //     "trailingAnnualDividendRate": 1.53,
      //     "trailingAnnualDividendYield": 0.022603042
      //   }
      // } 
      // "financialData": {
      //   "maxAge": 86400,
      //   "currentPrice": 310.83,
      //   "targetHighPrice": 380.0,
      //   "targetLowPrice": 155.0,
      //   "targetMeanPrice": 275.2,
      //   "targetMedianPrice": 305.0,
      //   "recommendationMean": 2.9,
      //   "recommendationKey": "hold",
      //   "numberOfAnalystOpinions": 15,
      //   "totalCash": 4006593024,
      //   "totalCashPerShare": 24.392,
      //   "ebitda": 530736032,
      //   "totalDebt": 9667725312,
      //   "quickRatio": 0.711,
      //   "currentRatio": 1.124,
      //   "totalRevenue": 8549353472,
      //   "debtToEquity": 156.916,
      //   "revenuePerShare": 56.403,
      //   "returnOnAssets": -0.02317,
      //   "returnOnEquity": -0.24903,
      //   "grossProfits": 1599257000,
      //   "freeCashflow": 673406976,
      //   "operatingCashflow": 55965000,
      //   "revenueGrowth": 1.351,
      //   "grossMargins": 0.23566,
      //   "ebitdaMargins": 0.062080003,
      //   "operatingMargins": -0.074250005,
      //   "profitMargins": -0.08456001
      // }

      // "defaultKeyStatistics": {
      //   "maxAge": 1,
      //   "priceHint": 2,
      //   "enterpriseValue": 3790343424,
      //   "forwardPE": -1.1651982,
      //   "profitMargins": -0.16975,
      //   "floatShares": 77408658,
      //   "sharesOutstanding": 80253000,
      //   "sharesShort": 30478801,
      //   "sharesShortPriorMonth": 30617290,
      //   "sharesShortPreviousMonthDate": 1661904000,
      //   "dateShortInterest": 1664496000,
      //   "sharesPercentSharesOut": 0.3793,
      //   "heldPercentInsiders": 0.026300002,
      //   "heldPercentInstitutions": 0.82045,
      //   "shortRatio": 1.27,
      //   "shortPercentOfFloat": 1.0633999,
      //   "beta": 1.737656,
      //   "impliedSharesOutstanding": 0,
      //   "category": null,
      //   "bookValue": -7.243,
      //   "fundFamily": null,
      //   "legalType": null,
      //   "lastFiscalYearEnd": "2022-02-26T00:00:00.000Z",
      //   "nextFiscalYearEnd": "2024-02-26T00:00:00.000Z",
      //   "mostRecentQuarter": "2022-08-27T00:00:00.000Z",
      //   "netIncomeToCommon": -1159358976,
      //   "trailingEps": -5.64,
      //   "forwardEps": -4.54,
      //   "pegRatio": -0.01,
      //   "lastSplitFactor": "2:1",
      //   "lastSplitDate": "2000-08-14T00:00:00.000Z",
      //   "enterpriseToRevenue": 0.555,
      //   "enterpriseToEbitda": -10.91,
      //   "52WeekChange": -0.6985138,
      //   "SandP52WeekChange": -0.1699422,
      //   "lastDividendValue": 0.17,
      //   "lastDividendDate": 1583971200
      // },
      /*
        "Forward P/E": "9.53",
        "Trailing P/E": "10.31",
        "Diluted EPS (ttm)": null,
        "Quarterly Revenue Growth (yoy)": null,
        "Previous Close": null,
        "Short % of Shares Outstanding": null,
        "Quarterly Earnings Growth (yoy)": null
            'Beta (5Y Monthly)']) * parseFloat(ticker['S&P500 52-Week Change'
        */
     
      let algorithmsInput = {
        "Operating Cash Flow (ttm)": keyStatsRes.financialData.operatingCashflow,
        'Dividend Yield':keyStatsRes.summaryDetail.dividendYield, 
        'Trailing Annual Dividend Rate': keyStatsRes.summaryDetail.trailingAnnualDividendRate,
        'Forward Annual Dividend Rate': keyStatsRes.summaryDetail.dividendRate,
        'Quarterly Revenue Growth (yoy)': keyStatsRes["Quarterly Revenue Growth"],
        'Previous Close': keyStatsRes.summaryDetail.previousClose,
        '52-Week Change': keyStatsRes.defaultKeyStatistics["52WeekChange"],
        "S&P500 52-Week Change": keyStatsRes.defaultKeyStatistics.SandP52WeekChanges,
        'Beta (5Y Monthly)': keyStatsRes.defaultKeyStatistics.beta,
        '50-Day Moving Average': keyStatsRes['50-Day Moving Average'],
        '200-Day Moving Average': keyStatsRes['200-Day Moving Average'],
        'Short % of Shares Outstanding': keyStatsRes["Shares Outstanding"],
        'Trailing P/E': keyStatsRes["Trailing P\/E"],
        'Forward P/E': keyStatsRes["Forward P\/E"],
        'Diluted EPS (ttm)': keyStatsRes["Diluted EPS"],
        'Quarterly Earnings Growth (yoy)': keyStatsRes["Quarterly Earnings Growth"],
        'Volume': stockData.volume,
        'Avg. Volume': stockData.avgVolume,
        'PE Ratio (TTM)': stockData["PE"],
        'closingHistories': historyRes,
        ...balanceSheetRes,
        ...treasuryStatsRes  
      }
      // logger.print(treasuryStats)  
      logger.print(JSON.stringify(algorithmsInput,null,2)) 
      // logger.print(JSON.stringify( keyStatsRes.summaryDetail  ,null,2)) 
     
      // // Peg Ratio and EPS
      // // Beta Swings -> 'S&P500 52-Week Change'
      // // 52 Week Low and Highs & Volume
      // // Moving Average Mean Reversions
      // // Stock Movement Seven Days
      // // % of Shares Short
      // // Revenue Growth
      // // Earnings Growth
      // // Trailing P/E vs.Forward P/E
      // // Ability to Pay Current Liabilities
      // // Stock Buy-Backs
      let dividendRateComparisonRes = Algorithms.dividendRateComparison(algorithmsInput)
      let pegRatioAndEPSRes = Algorithms.pegRatioAndEPS(algorithmsInput)
      let betaSwingsRes = Algorithms.betaSwings(algorithmsInput)
      let movingAverageMeanReversionsRes = Algorithms.movingAverageMeanReversions(algorithmsInput)
      let shortPercentOfSharesOutstandingRes = Algorithms.shortPercentOfSharesOutstanding(algorithmsInput)
      let stockMovementSevenDaysRes = Algorithms.stockMovementSevenDays(algorithmsInput)
      let fiftyTwoWeekLowsHighsAndVolumeRes = Algorithms.fiftyTwoWeekLowsHighsAndVolume(algorithmsInput)
      let revenueGrowthRes = Algorithms.revenueGrowth(algorithmsInput)
      let earningsGrowthRes = Algorithms.earningsGrowth(algorithmsInput)
      let abilityToPayCurrentLiabilitiesRes = Algorithms.abilityToPayCurrentLiabilities(algorithmsInput)
      let trailingPEvsForwardRes = Algorithms.trailingPEvsForward(algorithmsInput)
      let stockBuyBackRes = Algorithms.stockBuyBacks(algorithmsInput)
      let freeCashFlowYieldPerStockRes = Algorithms.freeCashFlowYieldPerStock(algorithmsInput)
      let marketEquilibriumRes = Algorithms.marketEquilibrium(algorithmsInput)
      let yieldCurveInOrderRes = Algorithms.yieldCurveInOrder(algorithmsInput)
      

      let allResults = {
        "1.) Dividend Rate Comparison": dividendRateComparisonRes,
        "2.) Peg Ratio and EPS": pegRatioAndEPSRes,
        "3.) Beta Swings": betaSwingsRes,
        "4.) 52 Week Low and Highs & Volume": fiftyTwoWeekLowsHighsAndVolumeRes,
        "5.) Moving Average Mean Reversions": movingAverageMeanReversionsRes,
        "6.) Stock Movement Seven Days": stockMovementSevenDaysRes,
        "7.) % of Shares Short": shortPercentOfSharesOutstandingRes,
        "8.) Revenue Growth": revenueGrowthRes,
        "9.) Earnings Growth": earningsGrowthRes,
        "10.) Trailing P/E vs.Forward P/E": trailingPEvsForwardRes,
        "11.) Ability to Pay Current Liabilities": abilityToPayCurrentLiabilitiesRes,
        "12.) Stock Buy Backs": stockBuyBackRes,
        "13.) Market Equilibrium": marketEquilibriumRes,
        "14.) Yield Curve In Order": yieldCurveInOrderRes,
        "21.) Free CashFlow Yield PerStock": freeCashFlowYieldPerStockRes
      } 
      logger.print(JSON.stringify(allResults, null, 2))


    }




    // }
    //console.log("52 Week Low and Highs & Volume")
    // console.log("Moving Average Mean Reversions")
    // for (const [key, value] of Object.entries(tickers)) {
    //   console.log(`Ticker: (${key})`)
    //   // let movingAverageMeanReversionsRes = movingAverageMeanReversions(value)
    //   // console.log(movingAverageMeanReversionsRes)

    //   let valuationMeasurementMovementRes = valuationMeasurementMovement(value)
    //   console.log(valuationMeasurementMovementRes)


    //   let financeSummaryResponse = await yahooFinanceSummary(key)
    //   console.log(`\n`)
    //   let keyStatisticsResponse = await yahooKeyStatistics(key)
    //   console.log(`\n`)

    //   tickers[key] = { 
    //     ...financeSummaryResponse,
    //     ...keyStatisticsResponse
    //   };
    // }

    // console.log("Moving Average Mean Revision")
    // for (const [key, value] of Object.entries(tickers)) {
    //   console.log(`Ticker: (${key})`)
    //   let movingAverageMeanReversionsRes = movingAverageMeanReversions(value)
    //   console.log(movingAverageMeanReversionsRes)

    //   // let valuationMeasurementMovementRes = valuationMeasurementMovement(value)
    //   // console.log(valuationMeasurementMovementRes)


    //   // let financeSummaryResponse = await yahooFinanceSummary(key)
    //   // console.log(`\n`)
    //   // let keyStatisticsResponse = await yahooKeyStatistics(key)
    //   // console.log(`\n`)

    //   // tickers[key] = {
    //   //   ...financeSummaryResponse,
    //   //   ...keyStatisticsResponse
    //   // };
    // }

    // console.log("Stock Movement 7 days")
    // for (const [key, value] of Object.entries(tickers)) {
    //   console.log(`Ticker: (${key})`)
    //   let stockMovementSevenDaysRes = stockMovementSevenDays(value)
    //   console.log(stockMovementSevenDaysRes)

    //   // let valuationMeasurementMovementRes = valuationMeasurementMovement(value)
    //   // console.log(valuationMeasurementMovementRes)


    //   // let financeSummaryResponse = await yahooFinanceSummary(key)
    //   // console.log(`\n`)
    //   // let keyStatisticsResponse = await yahooKeyStatistics(key)
    //   // console.log(`\n`)

    //   // tickers[key] = {
    //   //   ...financeSummaryResponse,
    //   //   ...keyStatisticsResponse
    //   // };
    // }

    // console.log("Short Percent Of Shares Outstanding")
    // for (const [key, value] of Object.entries(tickers)) {
    //   console.log(`Ticker: (${key})`)
    //   let shortPercentOfSharesOutstandingRes = shortPercentOfSharesOutstanding(value)
    //   console.log(shortPercentOfSharesOutstandingRes)
    // }

    // console.log("Revenue Growth")
    // for (const [key, value] of Object.entries(tickers)) {
    //   console.log(`Ticker: (${key})`)
    //   let revenueGrowthRes = revenueGrowth(value)
    //   console.log(revenueGrowthRes)
    // }

    // console.log("Earnings Growth")
    // for (const [key, value] of Object.entries(tickers)) {
    //   console.log(`Ticker: (${key})`)
    //   let earningsGrowthRes = earningsGrowth(value)
    //   console.log(earningsGrowthRes)

    // }

    // console.log("Tailing PE vs Forward PE")
    // for (const [key, value] of Object.entries(tickers)) {
    //   console.log(`Ticker: (${key})`)
    //   let tailingPEvsForwardPERes = trailingPEvsForward(value)
    //   console.log(tailingPEvsForwardPERes)

    // }

    // console.log("Ability to Pay Current Liabilities")
    // for (const [key, value] of Object.entries(tickers)) {
    //   console.log(`Ticker: (${key})`)
    //   let abilityToPayCurrentLiabilitiesRes = abilityToPayCurrentLiabilities(value)
    //   console.log(abilityToPayCurrentLiabilitiesRes)
    // }

    // console.log("Stock Buy Backs")
    // for (const [key, value] of Object.entries(tickers)) {
    //   console.log(`Ticker: (${key})`)
    //   let stockBuyBackRes = Algorithms.stockBuyBacks(value)
    //   console.log(stockBuyBackRes)
    // }



    let executionTime = ((Date.now() - startTime) / 1000) / 60
    logger.print(`Ran in ${executionTime} minutes`);


  } catch (e) {
    logger.print(e)
  }
}
run()
module.exports = {
  run
};


