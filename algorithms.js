// 1) Peg Ratio and EPS 
// forward annual dividen rate > trailing annual dividen rate = buy
// forward annual dividen rate < trailing annual dividen rate = sell
// % swing = (forward annual dividen rate - trailing annual dividen rate) / trailing annual dividen rate 
// estimated stock price = previous close * ( 1 - % swing )

const dividendRateComparison = (ticker) => {

   
    if ((isNaN(parseFloat(ticker['Trailing Annual Dividend Rate'])) || isNaN(parseFloat(ticker['Forward Annual Dividend Rate'])))) {
        return {
            "Trailing Annual Dividend Rate":  ticker['Trailing Annual Dividend Rate'],
            "Forward Annual Dividend Rate":  ticker['Forward Annual Dividend Rate'],
            currentMarketValue: "N/A",
            description: "Trailing Annual Dividend Rate OR Forward Annual Dividend Rate Equals N/A ",
            estimatedStockPrice: "N/A",
            weight: -1  ,
        }
    }
        let percentSwing = ((parseFloat(ticker['Trailing Annual Dividend Rate']) - parseFloat(ticker['Forward Annual Dividend Rate'])) /parseFloat(ticker['Trailing Annual Dividend Rate']) )
        if ((parseFloat(ticker['Trailing Annual Dividend Rate']) > parseFloat(ticker['Forward Annual Dividend Rate']))) {
            return {
                "Trailing Annual Dividend Rate":  ticker['Trailing Annual Dividend Rate'],
                "Forward Annual Dividend Rate":  ticker['Forward Annual Dividend Rate'],
                currentMarketValue: ticker['Previous Close'],
                description: "Trailing Annual Dividend Rate > Forward Annual Dividend Rate",
                estimatedStockPrice:  (parseFloat(ticker['Previous Close']) * (1 - percentSwing )),
                weight:  1 
            }
        }else if ((parseFloat(ticker['Trailing Annual Dividend Rate']) < parseFloat(ticker['Forward Annual Dividend Rate']))) {
            return {
                "Trailing Annual Dividend Rate":  ticker['Trailing Annual Dividend Rate'],
                "Forward Annual Dividend Rate":  ticker['Forward Annual Dividend Rate'],
                currentMarketValue: ticker['Previous Close'],
                description: "Trailing Annual Dividend Rate < Forward Annual Dividend Rate",
                estimatedStockPrice:   (parseFloat(ticker['Previous Close']) * (1 - percentSwing )),
                weight: -1 
            }
        }



    
}


// 2) Peg Ratio and EPS 

// PEG Ratio = ( EPS (TTM) / Quarterly Revenue Growth (yoy)
// Dividend Payout Ratio =(Forward Dividend / EPS (TTM))

// If PEG Ratio > .5 and Dividend Payout Ratio > .5 = BUY
// If PEG Ratio < .5 and Dividend Payout Ratio < 1 = SELL
const pegRatioAndEPS = (ticker) => {

   
    if ((isNaN(parseFloat(ticker['PE Ratio (TTM)'])) || isNaN(parseFloat(ticker['Quarterly Revenue Growth (yoy)'])))) {
        return {
            "Quarterly Revenue Growth (yoy)":  ticker['Quarterly Revenue Growth (yoy)'],
            "PE Ratio (TTM)": ticker['PE Ratio (TTM)'],
            currentMarketValue: "N/A",
            description: "Quarterly Revenue Growth (yoy) OR PE Ratio (TTM) Equals N/A ",
            estimatedStockPrice: "N/A",
            weight: "N/A",
        }
    }

        let pegRatio = parseFloat(ticker['PE Ratio (TTM)']) / parseFloat(ticker['Quarterly Revenue Growth (yoy)'])
        
        let dividenPayoutRatio = parseFloat(ticker['PE Ratio (TTM)']) / parseFloat(ticker['Quarterly Revenue Growth (yoy)'])
        
        if ((pegRatio > .5) && (dividenPayoutRatio > .5)) {
            return {
                currentMarketValue: ticker['Previous Close'],
                description: "PEG Ratio > .5 and Dividend Payout Ratio > .5",
                estimatedStockPrice:  parseFloat(ticker['Previous Close']),
                weight:  1 
            }
        }else if ((pegRatio < .5) && (dividenPayoutRatio < 1)) {
            return {
                currentMarketValue: ticker['Previous Close'],
                description: "PEG Ratio < .5 and Dividend Payout Ratio < 1",
                estimatedStockPrice:  parseFloat(ticker['Previous Close']),
                weight: -1 
            }
        }else  {
            return {
                "Quarterly Revenue Growth (yoy)":  ticker['Quarterly Revenue Growth (yoy)'],
                "PE Ratio (TTM)": ticker['PE Ratio (TTM)'],
                currentMarketValue: ticker['Previous Close'],
                description: "NOT PEG Ratio > .5 and Dividend Payout Ratio > .5 OR PEG Ratio < .5 and Dividend Payout Ratio < 1 ",
                estimatedStockPrice:  'N/A',
                weight: 0
            }
        }
}


// 3) Beta Swings
// Expected % Move = ( Beta (5Y Monthly)) * (S&P500 52-Week Change)
// Possible Correction %= (Expected % Move) - (52-Week Change %)
// Estimated Stock Price = (Possible Correction %+1)* (Previous Close)
const betaSwings = (ticker) => {


    let expectedPercentMove = parseFloat(ticker['Beta (5Y Monthly)']) * parseFloat(ticker['S&P500 52-Week Change'])
    let possibleCorrection = expectedPercentMove - parseFloat(ticker['52-Week Change'])

    if ((isNaN(parseFloat(ticker['Beta (5Y Monthly)'])) || isNaN(parseFloat(ticker['S&P500 52-Week Change']) || parseFloat(ticker['52-Week Change'])))) {
        return {
            "52-Week Change": ticker["52-Week Change"],
            "S&P500 52-Week Change":  ticker['S&P500 52-Week Change'],
            "Beta (5Y Monthly)": ticker['Beta (5Y Monthly)'],
            currentMarketValue: "N/A",
            description: "52-Week Change OR S&P500 52-Week Change OR Beta (5Y Monthly) Equals N/A ",
            estimatedStockPrice: "N/A",
            weight: "N/A",
        }
    }

    
        if (possibleCorrection > 1) {
            return {
                currentMarketValue: ticker['Previous Close'],
                description: "Possible Correction > 1",
                estimatedStockPrice: (possibleCorrection / 100 + 1) * parseFloat(ticker['Previous Close']),
                weight: 1 + (possibleCorrection / 100 + 1)
            }
        } if (possibleCorrection < -1) {
            return {
                currentMarketValue: ticker['Previous Close'],
                description: "Possible Correction < 1",
                estimatedStockPrice: (possibleCorrection / 100 + 1) * parseFloat(ticker['Previous Close']),
                weight: -1 - (possibleCorrection / 100 + 1),
            }
        } else if ((1 > possibleCorrection) && ( possibleCorrection > -1)) {
            return {
                currentMarketValue: ticker['Previous Close'],
                description: "1 > Possible Correction > -1",
                estimatedStockPrice: (possibleCorrection / 100 + 1) * parseFloat(ticker['Previous Close']),
                weight: 0
            }
        }
    

}


/*
4) 52 Week Low and Highs & Volume

% from 52 Week Low = (Previous Close - 52 Week Low) / 52 Week Low 
% from 52 Week High = (Previous Close - 52 Week High) / 52 Week High

Volume Discrepancy = (Volume - Avg. Volume) / (Avg. Volume)

If Previous Close is within 10% from 52 Week Low, AND Volume Discrepancy is > 0 = BUY
If Previous Close is within 10% from 52 Week Low, AND Volume Discrepancy is < 0 = SELL
If Previous Close is within 10% from 52 Week High, AND Volume Discrepancy is > 0 = BUY
If Previous Close is within 10% from 52 Week High, AND Volume Discrepancy is < 0 = SELL

If Previous Close > 50-Day Moving Average > 200-Day Moving Average AND Volume Discrepancy is > 0 = BUY   
Estimated Stock Price = Previous Close + (50-Day Moving Average - 200-Day Moving Average AND Volume Discrepancy)
*/
const isNumberWithinPercentOfNumber = ( firstN,  percent, secondN) =>{
    let decimalPercent = percent / 200.0;
    let highRange = secondN * (1.0 + decimalPercent);
    let lowRange = secondN * (1.0 - decimalPercent);
    return lowRange <= firstN && firstN <= highRange;
}
const fiftyTwoWeekLowsHighsAndVolume = (ticker) => {


      let fromFiftyTwoWeekLow = parseFloat(ticker['Previous Close']) - parseFloat(ticker['52 Week Low']) / parseFloat(ticker['52 Week Low'])
      let fromFiftyTwoWeekHigh = parseFloat(ticker['Previous Close']) - parseFloat(ticker['52 Week High']) / parseFloat(ticker['52 Week High'])
      let volumeDiscrepancy = parseFloat(ticker['Volume']) - parseFloat(ticker['Avg. Volume']) / parseFloat(ticker['Avg. Volume'])

      let expectedPercentMove = parseFloat(ticker['Beta (5Y Monthly)']) * parseFloat(ticker['S&P500 52-Week Change'])

      let possibleCorrection = expectedPercentMove - parseFloat(ticker['52-Week Change'])

      if(isNumberWithinPercentOfNumber(parseFloat(ticker['Previous Close']),fromFiftyTwoWeekHigh) && (volumeDiscrepancy > 0)){
        return {
            currentMarketValue: ticker['Previous Close'],
            description: "Previous Close is within 10% from 52 Week High, AND Volume Discrepancy is > 0",
            estimatedStockPrice: (possibleCorrection / 100 + 1) * parseFloat(ticker['Previous Close']),
            weight: 1 + (possibleCorrection / 100 + 1)
          }
      }else if(isNumberWithinPercentOfNumber(parseFloat(ticker['Previous Close']),fromFiftyTwoWeekHigh) && (volumeDiscrepancy < 0)){
        return {
            currentMarketValue: ticker['Previous Close'],
            description: "Previous Close > 50-Day Moving Average > 200-Day Moving Average AND Volume Discrepancy is < 0",
            estimatedStockPrice: (possibleCorrection / 100 + 1) * parseFloat(ticker['Previous Close']),
            weight: -1 - (possibleCorrection / 100 + 1)
          }
      }else if(isNumberWithinPercentOfNumber(parseFloat(ticker['Previous Close']),fromFiftyTwoWeekLow) && (volumeDiscrepancy > 0)){
        return {
            currentMarketValue: ticker['Previous Close'],
            description: "Previous Close is within 10% from 52 Week Low, AND Volume Discrepancy is > 0",
            estimatedStockPrice: (possibleCorrection / 100 + 1) * parseFloat(ticker['Previous Close']),
            weight: 1 + (possibleCorrection / 100 + 1)
          }
      }else if(isNumberWithinPercentOfNumber(parseFloat(ticker['Previous Close']),fromFiftyTwoWeekLow) && (volumeDiscrepancy < 0)){
        return {
            currentMarketValue: ticker['Previous Close'],
            description: "Previous Close is within 10% from 52 Week Low, AND Volume Discrepancy is < 0",
            estimatedStockPrice: (possibleCorrection / 100 + 1) * parseFloat(ticker['Previous Close']),
            weight: 1 - (possibleCorrection / 100 + 1)
          }
      }

      
    

}


/*
5) Moving Average Mean Reversions

If Previous Close > 50-Day Moving Average > 200-Day Moving Average AND Volume Discrepancy is > 0 = BUY   
Estimated Stock Price = Previous Close + (50-Day Moving Average - 200-Day Moving Average AND Volume Discrepancy)

If Previous Close > 50-Day Moving Average > 200-Day Moving Average AND Volume Discrepancy is < 0 = SELL  
Estimated Stock Price = 50-Day Moving Average

If 50-Day Moving Average > Previous Close > 200-Day Moving Average AND Volume Discrepancy is > 0 = BUY   
Estimated Stock Price = 50-Day Moving Average

If 50-Day Moving Average > Previous Close > 200-Day Moving Average AND Volume Discrepancy is < 0 = SELL   
Estimated Stock Price = 200-Day Moving Average

If 50-Day Moving Average > 200-Day Moving Average > Previous Close AND Volume Discrepancy is > 0 = BUY
Estimated Stock Price = 200-Day Moving Average

If 50-Day Moving Average > 200-Day Moving Average > Previous Close AND Volume Discrepancy is < 0 = SELL
Estimated Stock Price = Previous Close - (50-Day Moving Average - 200-Day Moving Average)

If 200-Day Moving Average > 50-Day Moving Average > Previous Close AND Volume Discrepancy is > 0 = BUY
Estimated Stock Price = 50-Day Moving Average

If 200-Day Moving Average > 50-Day Moving Average > Previous Close AND Volume Discrepancy is < 0 = SELL
Estimated Stock Price = Previous Close - (200-Day Moving Average - 50-Day Moving Average)
*/
const movingAverageMeanReversions = (ticker) => {

    let volumeDiscrepancy = (parseFloat(ticker['Volume']) - parseFloat(ticker['Avg. Volume'])) / parseFloat(ticker['Avg. Volume'])

    

    if (ticker['Previous Close'] && ticker['50-Day Moving Average'] && ticker['200-Day Moving Average']) {


        let prevClose50Day200DayComp = ((parseFloat(ticker['Previous Close']) > parseFloat(ticker['50-Day Moving Average'])) && (parseFloat(ticker['50-Day Moving Average']) > parseFloat(ticker['200-Day Moving Average'])))
        let fiftyPreviousCloseTwoHundred = ((parseFloat(ticker['50-Day Moving Average']) > parseFloat(ticker['Previous Close'])) && (parseFloat(ticker['Previous Close']) > parseFloat(ticker['200-Day Moving Average'])))

        let twoHundredDayMovingAvgGrtr500Avrg = ((parseFloat(ticker['200-Day Moving Average']) > parseFloat(ticker['50-Day Moving Average'])) && (parseFloat(ticker['50-Day Moving Average']) > parseFloat(ticker['Previous Close'])))
        let twoHundredPrevious50 = ((parseFloat(ticker['200-Day Moving Average']) > parseFloat(ticker['Previous Close'])) && (parseFloat(ticker['Previous Close']) > parseFloat(ticker['50-Day Moving Average'])))
        let fiftyTwoHundredPrevious = ((parseFloat(ticker['50-Day Moving Average']) > parseFloat(ticker['200-Day Moving Average'])) && (parseFloat(ticker['200-Day Moving Average']) > parseFloat(ticker['Previous Close'])))
        let previousTwoHundredFifty = ((parseFloat(ticker['Previous Close']) > parseFloat(ticker['200-Day Moving Average'])) && parseFloat(ticker['200-Day Moving Average']) > parseFloat(ticker['50-Day Moving Average']))

        let fiftyto200MovingAvgDif = parseFloat(ticker['50-Day Moving Average']) - parseFloat(ticker['200-Day Moving Average'])



        let percentSwing = (((parseFloat(ticker['Previous Close']) + fiftyto200MovingAvgDif) - ticker['Previous Close'])/ticker['Previous Close'])
        if ((prevClose50Day200DayComp && (volumeDiscrepancy > 0))) {            

            if (fiftyto200MovingAvgDif < 1) {
                fiftyto200MovingAvgDif = fiftyto200MovingAvgDif * -1
            }
            return {
                volumeDiscrepancy: volumeDiscrepancy,
                percentSwing: percentSwing,
                currentMarketValue: ticker['Previous Close'],
                description: "Previous Close > 50-Day Moving Average > 200-Day Moving Average AND Volume Discrepancy is > 0",
                estimatedStockPrice:  parseFloat(ticker['50-Day Moving Average']),
                weight: 1 + (parseFloat(ticker['50-Day Moving Average']) - parseFloat(ticker['Previous Close']))/parseFloat(ticker['Previous Close'])
            }
        } else if ((prevClose50Day200DayComp && (volumeDiscrepancy < 0))) {
            return {
                volumeDiscrepancy: volumeDiscrepancy,
                percentSwing: percentSwing,
                currentMarketValue: ticker['Previous Close'],
                description: "Previous Close > 50-Day Moving Average > 200-Day Moving Average AND Volume Discrepancy is < 0",
                estimatedStockPrice: parseFloat(ticker['Previous Close']) + fiftyto200MovingAvgDif,
                weight: -1 - percentSwing
            }
        }
        else if ((fiftyPreviousCloseTwoHundred && (volumeDiscrepancy > 0))) {

            return {
                volumeDiscrepancy: volumeDiscrepancy,
                percentSwing: percentSwing,
                currentMarketValue: ticker['Previous Close'],
                description: "50-Day Moving Average > Previous Close > 200-Day Moving Average AND Volume Discrepancy is > 0",
                estimatedStockPrice: parseFloat(ticker['50-Day Moving Average']),
                weight: 1 + (parseFloat(ticker['50-Day Moving Average']) - parseFloat(ticker['Previous Close']))/parseFloat(ticker['Previous Close'])
            }
        }
        else if ((fiftyPreviousCloseTwoHundred && (volumeDiscrepancy < 0))) {
            let fiftyto200MovingAvgDif = parseFloat(ticker['50-Day Moving Average']) - parseFloat(ticker['200-Day Moving Average'])
            if (fiftyto200MovingAvgDif < 1) {
                fiftyto200MovingAvgDif = fiftyto200MovingAvgDif * -1
            }

            return {
                volumeDiscrepancy: volumeDiscrepancy,
                percentSwing: percentSwing,
                currentMarketValue: ticker['Previous Close'],
                description: "50-Day Moving Average > Previous Close > 200-Day Moving Average AND Volume Discrepancy is < 0",
                estimatedStockPrice: parseFloat(ticker['200-Day Moving Average']),
                weight: -1 + (parseFloat(ticker['50-Day Moving Average']) - parseFloat(ticker['Previous Close']))/parseFloat(ticker['Previous Close'])
            }
        }
        else if ((twoHundredDayMovingAvgGrtr500Avrg && (volumeDiscrepancy > 0))) {
            return {
                volumeDiscrepancy: volumeDiscrepancy,
                percentSwing: percentSwing,
                currentMarketValue: ticker['Previous Close'],
                description: "200-Day Moving Average > 50-Day Moving Average > Previous Close AND Volume Discrepancy is > 0",
                estimatedStockPrice: parseFloat(ticker['50-Day Moving Average']),
                weight: 1 + (parseFloat(ticker['50-Day Moving Average']) - parseFloat(ticker['Previous Close']))/parseFloat(ticker['Previous Close'])
            }
        } else if ((twoHundredDayMovingAvgGrtr500Avrg && (volumeDiscrepancy < 0))) {
            let fiftyto200MovingAvgDif = parseFloat(ticker['50-Day Moving Average']) - parseFloat(ticker['200-Day Moving Average'])
            if (fiftyto200MovingAvgDif < 1) {
                fiftyto200MovingAvgDif = fiftyto200MovingAvgDif * -1
            }
            return {
                volumeDiscrepancy: volumeDiscrepancy,
                percentSwing: percentSwing,
                currentMarketValue: ticker['Previous Close'],
                description: "200-Day Moving Average > 50-Day Moving Average > Previous Close AND Volume Discrepancy is < 0",
                estimatedStockPrice: parseFloat(ticker['Previous Close']) - (parseFloat(ticker['50-Day Moving Average']) - parseFloat(ticker['200-Day Moving Average']) ),
                weight: -1 + (parseFloat(ticker['50-Day Moving Average']) - parseFloat(ticker['Previous Close']))/parseFloat(ticker['Previous Close'])
            }
        } else if ((twoHundredPrevious50 && (volumeDiscrepancy > 0))) {
            return {
                volumeDiscrepancy: volumeDiscrepancy,
                percentSwing: percentSwing,
                currentMarketValue: ticker['Previous Close'],
                description: "200-Day Moving Average > Previous Close > 50-Day Moving Average AND Volume Discrepancy is > 0",
                estimatedStockPrice: parseFloat(ticker['200-Day Moving Average']),
                weight: 1 + (parseFloat(ticker['200-Day Moving Average']) - parseFloat(ticker['Previous Close']))/parseFloat(ticker['Previous Close'])
            }
        } else if ((twoHundredPrevious50 && (volumeDiscrepancy < 0))) {
            return {
                volumeDiscrepancy: volumeDiscrepancy,
                percentSwing: percentSwing,
                currentMarketValue: ticker['Previous Close'],
                description: "200-Day Moving Average > Previous Close > 50-Day Moving Average AND Volume Discrepancy is < 0",
                estimatedStockPrice: parseFloat(ticker['50-Day Moving Average']),
                weight: -1 + (parseFloat(ticker['50-Day Moving Average']) - parseFloat(ticker['Previous Close']))/parseFloat(ticker['Previous Close']) 
            }
        } else if ((previousTwoHundredFifty && (volumeDiscrepancy > 0))) {
            let fiftyto200MovingAvgDif = (parseFloat(ticker['200-Day Moving Average']) - parseFloat(ticker['50-Day Moving Average']))
            if (fiftyto200MovingAvgDif < 1) {
                fiftyto200MovingAvgDif = fiftyto200MovingAvgDif * -1
            }
            return {
                volumeDiscrepancy: volumeDiscrepancy,
                percentSwing: percentSwing,
                currentMarketValue: ticker['Previous Close'],
                description: "Previous Close > 200-Day Moving Average > 50-Day Moving Average AND Volume Discrepancy is > 0",
                estimatedStockPrice: parseFloat(ticker['Previous Close']) + fiftyto200MovingAvgDif,
                weight: 1 + (fiftyto200MovingAvgDif /parseFloat(ticker['Previous Close']))
            }
        } else if ((previousTwoHundredFifty && (volumeDiscrepancy < 0))) {
            return {
                volumeDiscrepancy: volumeDiscrepancy,
                percentSwing: percentSwing,
                currentMarketValue: ticker['Previous Close'],
                description: "Previous Close > 200-Day Moving Average > 50-Day Moving Average AND Volume Discrepancy is < 0",
                estimatedStockPrice: parseFloat(ticker['200-Day Moving Average']),
                weight:  -1 + (parseFloat(ticker['200-Day Moving Average']) - parseFloat(ticker['Previous Close']))/parseFloat(ticker['Previous Close'])
            }
        } else if ((fiftyTwoHundredPrevious && (volumeDiscrepancy > 0))) {
            return {
                volumeDiscrepancy: volumeDiscrepancy,
                percentSwing: percentSwing,
                currentMarketValue: ticker['Previous Close'],
                description: "50-Day Moving Average > 200-Day Moving Average > Previous Close AND Volume Discrepancy is > 0",
                estimatedStockPrice: parseFloat(ticker['200-Day Moving Average']),
                weight: 1 + (parseFloat(ticker['200-Day Moving Average']) - parseFloat(ticker['Previous Close']))/parseFloat(ticker['Previous Close'])
            }
        } else if ((fiftyTwoHundredPrevious && (volumeDiscrepancy < 0))) {
            let fiftyto200MovingAvgDif = parseFloat(ticker['50-Day Moving Average']) - parseFloat(ticker['200-Day Moving Average'])
            if (fiftyto200MovingAvgDif < 1) {
                fiftyto200MovingAvgDif = fiftyto200MovingAvgDif * -1
            }
            return {
                volumeDiscrepancy: volumeDiscrepancy,
                percentSwing: percentSwing,
                currentMarketValue: ticker['Previous Close'],
                description: "50-Day Moving Average > 200-Day Moving Average > Previous Close AND Volume Discrepancy is < 0",
                estimatedStockPrice: parseFloat(ticker['Previous Close']) - (parseFloat(ticker['50-Day Moving Average']) - parseFloat(ticker['200-Day Moving Average'])),
                weight: -1 - ((parseFloat(ticker['Previous Close']) - (parseFloat(ticker['50-Day Moving Average']) - parseFloat(ticker['200-Day Moving Average']))) - parseFloat(ticker['Previous Close']))/parseFloat(ticker['Previous Close']) 
            }
        }
    }
}




// Test 6: Stocks can't go up 7 days in a row/go down 7 days in a row
// If (Close* of Yesterday) > (Close* of 3rd line date) > (Close* of 4th line date) > (Close* of 5th line date) > (Close* of 6th line date) = SELL  
// Expected Price = ((Close* of Today) + (Close* of 6th line date))/2

// If (Close* of Yesterday) < (Close* of 3rd line date) < (Close* of 4th line date) < (Close* of 5th line date) < (Close* of 6th line date) = BUY
// Expected Price = ((Close* of Yesterday) + (Close* of 6th line date))/2
const stockMovementSevenDays = (ticker) => {

    let closingHistories = ticker["closingHistories"]
    if (((parseFloat(closingHistories[0]) > parseFloat(closingHistories[1])) &&
        (parseFloat(closingHistories[1]) > parseFloat(closingHistories[2])) &&
        (parseFloat(closingHistories[2]) > parseFloat(closingHistories[3])))) {
        return {
            currentMarketValue: ticker['Previous Close'],
            description: '(Close* of Yesterday) > (Close* of 3rd line date) > (Close* of 4th line date) > (Close* of 5th line date) > (Close* of 6th line date)',
            estimatedStockPrice: (parseFloat(closingHistories[1]) + parseFloat(closingHistories[4])) / 2,
            weight: -1 - ((parseFloat(closingHistories[1]) + parseFloat(closingHistories[4])) / 2)
        }
    } else if (
        ((parseFloat(closingHistories[0]) < parseFloat(closingHistories[1])) &&
            (parseFloat(closingHistories[1]) < parseFloat(closingHistories[2])) &&
            (parseFloat(closingHistories[2]) < parseFloat(closingHistories[3])))) {
        return {
            currentMarketValue: ticker['Previous Close'],
            description: '(Close* of Yesterday) < (Close* of 3rd line date) < (Close* of 4th line date) < (Close* of 5th line date) < (Close* of 6th line date)',
            estimatedStockPrice: (parseFloat(closingHistories[0]) + parseFloat(closingHistories[3])) / 2,
            weight: 1 + ((parseFloat(closingHistories[0]) + parseFloat(closingHistories[3])) / 2)
        }
    } else {
        return {
            closingHistories: ticker["closingHistories"],
            currentMarketValue: ticker['Previous Close'],
            description: 'No Trend In Stock Movement',
            estimatedStockPrice: 'N/A',
            weight: 0
        }
    }

}

// Test 7: % of Shares Short
// NextEra Energy, Inc. (NEE) Valuation Measures & Financial Statistics (yahoo.com)
// If (Short % of Shares Outstanding) || (Short % of Shares Outstanding) < 5% = BUY OR
// If not BUY, HOLD
const shortPercentOfSharesOutstanding = (ticker) => {

    
    let percentOfSharesOutStanding = (parseFloat(ticker['Short % of Shares Outstanding']) / 100)
    let lessThanFivePercent = (percentOfSharesOutStanding < 0.05)
    let greaterThanThirtyPercent = (percentOfSharesOutStanding > .3)

    if (greaterThanThirtyPercent) {
        return {
            currentMarketValue: ticker['Previous Close'],
            description: "(Short % of Shares Outstanding) > 30% ",
            estimatedStockPrice: ((1 + percentOfSharesOutStanding) * parseFloat(ticker['Previous Close'])),
            weight: 1 + percentOfSharesOutStanding
        }
    } else if (lessThanFivePercent) {
        return {
            currentMarketValue: ticker['Previous Close'],
            description: "(Short % of Shares Outstanding) < 5% ",
            estimatedStockPrice: ((1 + percentOfSharesOutStanding) * parseFloat(ticker['Previous Close'])),
            weight: 1 + percentOfSharesOutStanding
        }
    } else {
        return {
            currentMarketValue: ticker['Previous Close'],
            description: "(Short % of Shares Outstanding) < 30% || (Short % of Shares Outstanding) > 5% )",
            estimatedStockPrice: "N/A",
            weight: 0
        }
    }
}

// Test 8:  Revenue Growth
// Amazon.com, Inc. (AMZN) Valuation Measures & Financial Statistics (yahoo.com)
// Estimated Stock Move % = (Quarterly Revenue Growth (yoy))
// Estimated Stock Price $ = (1+ (Quarterly Revenue Growth (yoy)) * Previous Close
// If Estimated Stock Move % is positive = BUY
// If Estimated Stock Move % is Negative = SELL

const revenueGrowth = (ticker) => {
    if (parseFloat(ticker['Quarterly Revenue Growth (yoy)']) > 0) {
        let percentMovement = (parseFloat(ticker['Quarterly Revenue Growth (yoy)']) / 100)
        return {
            currentMarketValue: ticker['Previous Close'],
            description: "(Quarterly Revenue Growth (yoy) > 0",
            estimatedStockPrice: ((1 + percentMovement) * parseFloat(ticker['Previous Close'])),
            weight: 1 + percentMovement
        }
    } else if (parseFloat(ticker['Quarterly Revenue Growth (yoy)']) < 0) {
        let percentMovement = (parseFloat(ticker['Quarterly Revenue Growth (yoy)']) / 100)
        return {
            currentMarketValue: ticker['Previous Close'],
            description: "(Quarterly Revenue Growth (yoy) < 0",
            estimatedStockPrice: ((1 + percentMovement) * parseFloat(ticker['Previous Close'])),
            weight: -1 + percentMovement
        }
    } else {
        return {
            currentMarketValue: ticker['Previous Close'],
            description: "(Quarterly Revenue Growth (yoy) == 0",
            estimatedStockPrice: "N/A",
            weight: 0
        }
    }

}

// Test 9:  Earnings Growth:
// Amazon.com, Inc. (AMZN) Valuation Measures & Financial Statistics (yahoo.com)

// Estimated Stock Move % = (Quarterly Earnings Growth (yoy))
// Estimated Stock Price $ = (1+ (Quarterly Earnings Growth Growth (yoy)) * Previous Close
// If Estimated Stock Move % is positive = BUY
// If Estimated Stock Move % is Negative = SELL

const earningsGrowth = (ticker) => {
    

    if (parseFloat(ticker['Quarterly Earnings Growth (yoy)']) > 0) {
        let percentMovement = (parseFloat(ticker['Quarterly Earnings Growth (yoy)']) / 100);
        return {
            currentMarketValue: ticker['Previous Close'],
            description: "(Quarterly Earnings Growth (yoy) > 0",
            estimatedStockPrice: ((1 + percentMovement) * parseFloat(ticker['Previous Close'])),
            weight: 1 + percentMovement
        }
    } else if (parseFloat(ticker['Quarterly Earnings Growth (yoy)']) < 0) {
        let percentMovement = (parseFloat(ticker['Quarterly Earnings Growth (yoy)']) / 100);
        return {
            currentMarketValue: ticker['Previous Close'],
            description: "(Quarterly Earnings Growth (yoy) < 0",
            estimatedStockPrice: ((1 + percentMovement) * parseFloat(ticker['Previous Close'])),
            weight: -1 - percentMovement
        }
    } else {
        return {
            currentMarketValue: ticker['Previous Close'],
            description: "(Quarterly Earnings Growth (yoy) = NA",
            estimatedStockPrice: "N/A",
            weight: 0
        }
    }

}
 
// Test 10: Trailing P/E vs.Forward P/E PART 2
// Amazon.com, Inc. (AMZN) Valuation Measures & Financial Statistics (yahoo.com)
// Expected Stock Price Move $ = (Forward P/E - Trailing P/E)  * Diluted EPS (ttm)
// If (Expected Stock Price Move $) is positive, = BUY
// If (Expected Stock Price Move $) is negative, = SELL
// Expected Stock Price $ = (Expected Stock Price Move $) + Previous Close


const trailingPEvsForward = (ticker) => {

    let currentTrailingPE = parseFloat(ticker['Trailing P/E'])
    let currentForwardPE = parseFloat(ticker['Forward P/E'])

    if ((isNaN(currentTrailingPE) || isNaN(currentForwardPE))) {
        return {
            "Trailing P/E": currentTrailingPE,
            "Forward P/E": currentForwardPE,
            currentMarketValue: "N/A",
            description: "Trailing P/E OR Forward P/E Equals N/A ",
            estimatedStockPrice: "N/A",
            weight: "N/A",
        }
    }

    let expectedStockPriceMove = ((currentForwardPE - currentTrailingPE) * parseFloat(ticker['Diluted EPS (ttm)']))

    if (expectedStockPriceMove > 0) {
        return {
            "Trailing P/E": currentTrailingPE,
            "Forward P/E": currentForwardPE,
            currentMarketValue: ticker['Previous Close'],
            description: "Expected Stock Price Move > 0",
            estimatedStockPrice: expectedStockPriceMove + parseFloat(ticker['Previous Close']),
            weight: 1 + expectedStockPriceMove
        }
    } else if (expectedStockPriceMove < 0) {
        return {
            "Trailing P/E": currentTrailingPE,
            "Forward P/E": currentForwardPE,
            currentMarketValue: ticker['Previous Close'],
            description: "Expected Stock Price Move < 0",
            estimatedStockPrice: expectedStockPriceMove + parseFloat(ticker['Previous Close']),
            weight: -1 - expectedStockPriceMove
        }
    }
}



// Test 11: Ability to Pay Current Liabilities.
// Meta Platforms, Inc. (META) Balance Sheet - Yahoo Finance

// If Current Assets > Current Liabilities = BUY
// If Current Assets < Current Liabilities = SELL


const abilityToPayCurrentLiabilities = (ticker) => {

    let currentAssets = parseFloat(ticker['Current Assets'])
    let currentLiabilities = parseFloat(ticker['Current Liabilities'])

    if ((isNaN(currentAssets) || isNaN(currentLiabilities))) {
        return {
            'Current Assets': currentAssets,
            'Current Liabilities': currentLiabilities,
            currentMarketValue: "N/A",
            description: "Current Assets OR Current Liabilities Equals N/A ",
            estimatedStockPrice: "N/A",
            weight: "N/A",
        }
    }

    if ((parseFloat(ticker['Current Assets']) > parseFloat(ticker['Current Liabilities']))) {
        return {
            'Current Assets': currentAssets,
            'Current Liabilities': currentLiabilities,
            currentMarketValue: ticker['Previous Close'],
            description: "Current Assets > Current Liabilities",
            estimatedStockPrice: ticker['Previous Close'],
            weight: 1
        }
    } else if ((parseFloat(ticker['Current Assets']) < parseFloat(ticker['Current Liabilities']))) {
        return {
            'Current Assets': currentAssets,
            'Current Liabilities': currentLiabilities,
            currentMarketValue: ticker['Previous Close'],
            description: "Current Assets < Current Liabilities ",
            estimatedStockPrice: ticker['Previous Close'],
            weight: -1
        }
    }
}


// Test 12: Stock Buy-Backs
// Meta Platforms, Inc. (META) Balance Sheet - Yahoo Finance
// 
// If (Share Issued **Column 2) - (Share Issued **Column 1) > 0, = BUY
// If (Share Issued **Column 2) - (Share Issued **Column 1) < 0, = SELL
// Estimated Swing % = ((Share Issued **Column 2) - (Share Issued **Column 1)) / (Share Issued ** Column 2)
// Estimated Stock Price = (1 + (Estimated Swing %) * Previous Close



const stockBuyBacks = (ticker) => {
    let currentlyIssuedShares = parseFloat(ticker['Current Issued Shares'])
    let previouslyIssuedShares = parseFloat(ticker['Previous Issued Shares'])
    if ((isNaN(currentlyIssuedShares) || isNaN(previouslyIssuedShares))) {
        return {
            'Current Issued Shares': ticker['Current Issued Shares'],
            'Previous Issued Shares': ticker['Previous Issued Shares'],
            currentMarketValue: "N/A",
            description: "Current Issued Shares OR Previous Issued Shares Equals N/A ",
            estimatedStockPrice: ticker['Previous Close'],
            weight: "N/A",
        }
    }

    let previousMinusCurrent = (previouslyIssuedShares - currentlyIssuedShares)
    let estimatedSwing = (previousMinusCurrent / previouslyIssuedShares)
    let estimatedStockValue = ((1 + estimatedSwing) * parseFloat(ticker['Previous Close']))

    if (((previousMinusCurrent) > 0)) {
        return {
            'Current Issued Shares': ticker['Current Issued Shares'],
            'Previous Issued Shares': ticker['Previous Issued Shares'],
            currentMarketValue: ticker['Previous Close'],
            description: "((Previous Issued Shares) - (Current Issued Shares)) > 0",
            estimatedStockPrice: estimatedStockValue,
            weight: 1 + estimatedSwing
        }
    } else if (((previousMinusCurrent) < 0)) {
        return {
            'Current Issued Shares': ticker['Current Issued Shares'],
            'Previous Issued Shares': ticker['Previous Issued Shares'],
            currentMarketValue: ticker['Previous Close'],
            description: "((Previous Issued Shares) - (Current Issued Shares)) < 0",
            estimatedStockPrice: estimatedStockValue,
            weight: -1 - estimatedSwing
        }
    }
}

/*

Test 14: Market Equilibrium:
In a Market Equilibrium: $SPY Dividend % = 10 Year GOVT Treasury Rate YTM % = YOY CPI %

Data Point for SPY Dividend Yeild % is called "yeild" on the link below: 
SPDR S&P 500 ETF Trust (SPY) Stock Price, News, Quote & History - Yahoo Finance

Data Point for 10 year govt treasury ytm % (USE 10 YR and most recent Date):
Resource Center | U.S. Department of the Treasury

Data Point for YOY CPI : Looking for the 8.2%, under the heading "CPI-U, US CITY AVERAGE, ALL ITEMS" AND 3RD DATA POINT DOWN"
Latest Numbers : U.S. Bureau of Labor Statistics (bls.gov)

RIGHT NOW:
CPI = 8.2%
SPY DIV % = 1.73%
10 YEAR TREASURY YTM = 4.25%

^^ THIS MEANS THAT INFLATION NEEDS TO COME DOWN, TO DO THAT, INTEREST RATES NEED TO COME UP, AND SPY DIVIDEND NEEDS TO COME UP (AKA STOCKS GO DOWN)"

IF CPI % > 10 Year Treasury % > Dividend Yield % = SELL
IF CPI % > Dividend Yield % > 10 Year Treasury % = SELL
IF Dividend Yield % > CPI % > 10 Year Treasury % = BUY
IF Dividend Yield %  > 10 Year Treasury % > CPI % = BUY
IF 10 Year Treasury % > CPI % > Dividend Yield % = BUY
IF 10 Year Treasury % > Dividend Yield % > CPI % = BUY

*/
const marketEquilibrium = (ticker) => {
  
    let tenYearGovTreasury = parseFloat(ticker["10 Year Govt Treasury (YTM)"])
    let yoyCPI = parseFloat(ticker["Yoy CPI"])
    let dividenYield = parseFloat(ticker["Dividend Yield"])

    if ((isNaN(tenYearGovTreasury) || isNaN(yoyCPI) || isNaN(dividenYield) )) {
        return {
            '10 Year Govt Treasury (YTM)': ticker['10 Year Govt Treasury (YTM)'],
            'Yoy CPI': ticker['Yoy CPI'],
            'Dividend Yield': ticker['Dividend Yield'],
            currentMarketValue: "N/A",
            description: "10 Year Govt Treasury (YTM) OR Yoy CPI OR Dividend Yield is N/A ",
            estimatedStockPrice: ticker['Previous Close'],
            weight: "N/A",
        }
    }

    if((yoyCPI > tenYearGovTreasury) && (tenYearGovTreasury > dividenYield )){
        return {
            '10 Year Govt Treasury (YTM)': ticker['10 Year Govt Treasury (YTM)'],
            'Yoy CPI': ticker['Yoy CPI'],
            'Dividend Yield': ticker['Dividend Yield'],
            currentMarketValue: "N/A",
            description: "CPI % > Dividend Yield % > 10 Year Treasury",
            weight: -1,
        }

    }else if((yoyCPI > dividenYield) && (dividenYield > tenYearGovTreasury )){
        return {
            '10 Year Govt Treasury (YTM)': ticker['10 Year Govt Treasury (YTM)'],
            'Yoy CPI': ticker['Yoy CPI'],
            'Dividend Yield': ticker['Dividend Yield'],
            currentMarketValue: "N/A",
            description: "Dividend Yield % > CPI % > 10 Year Treasury",
            weight: 1,
        }

    }else if((dividenYield > yoyCPI) && (yoyCPI > tenYearGovTreasury )){
        return {
            '10 Year Govt Treasury (YTM)': ticker['10 Year Govt Treasury (YTM)'],
            'Yoy CPI': ticker['Yoy CPI'],
            'Dividend Yield': ticker['Dividend Yield'],
            currentMarketValue: "N/A",
            description: "SPY DIV % > CPI % > 10 YEAR TREASURY",
            estimatedStockPrice: ticker['Previous Close'],
            weight: 1,
        }

    }else if((dividenYield > tenYearGovTreasury) && (tenYearGovTreasury > yoyCPI )){
        return {
            '10 Year Govt Treasury (YTM)': ticker['10 Year Govt Treasury (YTM)'],
            'Yoy CPI': ticker['Yoy CPI'],
            'Dividend Yield': ticker['Dividend Yield'],
            currentMarketValue: "N/A",
            description: "Dividend Yield %  > 10 Year Treasury % > CPI",
            estimatedStockPrice: ticker['Previous Close'],
            weight: 1,
        }
        
    }else if((tenYearGovTreasury > yoyCPI) && (yoyCPI > dividenYield )){
        return {
            '10 Year Govt Treasury (YTM)': ticker['10 Year Govt Treasury (YTM)'],
            'Yoy CPI': ticker['Yoy CPI'],
            'Dividend Yield': ticker['Dividend Yield'],
            currentMarketValue: "N/A",
            description: "10 Year Treasury % > CPI % > Dividend Yield",
            estimatedStockPrice: ticker['Previous Close'],
            weight: 1,
        }
        
    }else if((tenYearGovTreasury > dividenYield) && (dividenYield > yoyCPI )){
        return {
            '10 Year Govt Treasury (YTM)': ticker['10 Year Govt Treasury (YTM)'],
            'Yoy CPI': ticker['Yoy CPI'],
            'Dividend Yield': ticker['Dividend Yield'],
            currentMarketValue: "N/A",
            description: "10 Year Treasury % > Dividend Yield % > CPI",
            estimatedStockPrice: ticker['Previous Close'],
            weight: 1,
        }
    }

    
}
/*
TEST 15: YIELD CURVE IN ORDER
IDEALLY TREASURY DATES SHOULD HAVE HIGHER INTEREST RATES AS MATURITY DATE GETS FURTHER IN THE FUTURE:
Resource Center | U.S. Department of the Treasury
Use the Most Recent Date, and these headings: Skipping 2month & 4month
1 Mo	
3 Mo	
6 Mo	1 Yr	2 Yr	3 Yr	5 Yr	7 Yr	10 Yr	20 Yr	30 Yr

BUY = 1Mo < 3Mo < 6M < 1 Yr < 2Yr < 3 Yr < 5 Yr < 7Yr <10 Yr < 20 Yr < 30 Yr
SELL = if any of these are out of order.  I want to know the data point out of order as well. That is the time period when to predict recession.

Today's 1year treasury rate is the peak, and the 2 year is lower than the 1 year. The time period that is out of order is the predict of when a recession will hit in a year.

*/
const yieldCurveInOrder = (ticker) => {
    
    /* 
    "1 Mo": 3.76,
    "2 Mo": 3.95,
    "3 Mo": 4.13,
    "4 Mo": 4.27,
    "6 Mo": 4.44,
    "1 Yr": 4.5,
    "2 Yr": 4.3,
    "3 Yr": 4.29,
    "5 Yr": 4.09,
    "7 Yr": 4.01,
    "10 Yr": 3.96,
    "20 Yr": 4.32,
    "30 Yr": 4.12
    
    */
    if ((isNaN(ticker["Treasury Yield Curve"]))) {
        return {
            currentMarketValue: "N/A",
            description: "Treasury Yield Curve Equals N/A ",
            estimatedStockPrice: "N/A",
            weight: "N/A",
        }
    }
    let months = Object.keys(tickers)
    let vals = Object.values(tickers)
    let recessionValues = {}

    vals.forEach((v,i => {
        if(i != vals.length){
            if(vals[i] < vals[i+1]){
                recessionValues[Object.keys(recessionValues).length] = `${months[i]}:${vals[i]} > ${months[i + 1]}:${vals[i + 1]}`
            }
        }
    }))

    return {
        description: "Yield Curve In Order Recession Values ",
        recessionValues: recessionValues,
    }

    // if (ticker["Operating Cash Flow (ttm)"] > 1) {
    //     return {
    //         "Yield Curve In Order": ticker["Yield Curve In Order"],
    //         description: "1Mo < 3Mo < 6M < 1 Yr < 2Yr < 3 Yr < 5 Yr < 7Yr <10 Yr < 20 Yr < 30 Yr",
    //         estimatedStockPrice: "N/A",
    //         weight: 1
    //     }
    // } else {
    //     return {
           
    //         currentMarketValue: ticker['Previous Close'],
    //         description: "Operating Cash Flow (ttm) < 0",
    //         estimatedStockPrice: "N/A",
    //         weight: -1
    //     }
    // }
}

/*
Test 21: Free Cash Flow Yield per Stock:
Apple Inc. (AAPL) Valuation Measures & Financial Statistics (yahoo.com)

If a stock has a positive number for "Operating Cash Flow (ttm)" = BUY
If a stock has a negative number for "Operating Cash Flow (ttm)" = SELL
*/
const freeCashFlowYieldPerStock = (ticker) => {
    
    if ((isNaN(ticker["Operating Cash Flow (ttm)"]))) {
        return {
            currentMarketValue: "N/A",
            description: "Operating Cash Flow (ttm) Equals N/A ",
            estimatedStockPrice: ticker['Previous Close'],
            weight: "N/A",
        }
    }

    if (ticker["Operating Cash Flow (ttm)"] > 1) {
        return {
           
            currentMarketValue: ticker['Previous Close'],
            description: "Operating Cash Flow (ttm) > 0",
            estimatedStockPrice: "N/A",
            weight: 1
        }
    } else {
        return {
           
            currentMarketValue: ticker['Previous Close'],
            description: "Operating Cash Flow (ttm) < 0",
            estimatedStockPrice: "N/A",
            weight: -1
        }
    }
}


module.exports = {
    marketEquilibrium,
    dividendRateComparison,
    pegRatioAndEPS,
    betaSwings,
    fiftyTwoWeekLowsHighsAndVolume,
    movingAverageMeanReversions,
    shortPercentOfSharesOutstanding,
    stockMovementSevenDays,
    revenueGrowth,
    earningsGrowth,
    abilityToPayCurrentLiabilities,
    trailingPEvsForward,
    stockBuyBacks,
    freeCashFlowYieldPerStock,
    yieldCurveInOrder
};