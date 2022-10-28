
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

const Algorithms = require('../algorithms.js');






describe('Algorithm Tests', function () {

    const possibleCorrectionPositive = {
        'Previous Close': '3',
        'Beta (5Y Monthly)': '2',
        'S&P500 52-Week Change': '1',
        'Volume': '2',
        'Avg. Volume': '1',
    }
    const possibleCorrectionNegative = {
        'Previous Close': '3',
        'Beta (5Y Monthly)': '2',
        'S&P500 52-Week Change': '1',
        'Volume': '2',
        'Avg. Volume': '1',
    }
    const possibleCorrectionBetweenOneAndNegOne = {
        'Previous Close': '3',
        'Beta (5Y Monthly)': '2',
        'S&P500 52-Week Change': '1',
        'Volume': '2',
        'Avg. Volume': '1',
    }

    describe('betaSwings', function () {

        it("Possible Correction > 1", function () {
            var response = Algorithms.betaSwings(possibleCorrectionPositive)
            expect({
                description: "Possible Correction > 1",
                estimatedStockPrice: 4,
                weight: 1
            }).to.deep.equal(response);

        });
        it("Possible Correction < 1", function () {
            var response = Algorithms.betaSwings(possibleCorrectionNegative)
            expect({
                description: "Possible Correction < 1",
                estimatedStockPrice: 4,
                weight: 1
            }).to.deep.equal(response);

        });
        it("1 > Possible Correction > -1", function () {
            var response = Algorithms.betaSwings(possibleCorrectionBetweenOneAndNegOne)
            expect({
                description: "1 > Possible Correction > -1",
                estimatedStockPrice: 4,
                weight: 1
            }).to.deep.equal(response);

        });
    });



    const tickersTestOne = {
        'Previous Close': '3',
        '50-Day Moving Average': '2',
        '200-Day Moving Average': '1',
        'Volume': '2',
        'Avg. Volume': '1',
    }
    const tickersTestTwo = {
        'Previous Close': '3',
        '50-Day Moving Average': '2',
        '200-Day Moving Average': '1',
        'Volume': '.5',
        'Avg. Volume': '1',
    }
    const tickersTestThree = {
        'Previous Close': '2',
        '50-Day Moving Average': '3',
        '200-Day Moving Average': '1',
        'Volume': '2',
        'Avg. Volume': '1',
    }
    const tickersTestFour = {
        'Previous Close': '2',
        '50-Day Moving Average': '3',
        '200-Day Moving Average': '1',
        'Volume': '.5',
        'Avg. Volume': '1',
    }
    const tickersTestFive = {
        'Previous Close': '1',
        '50-Day Moving Average': '2',
        '200-Day Moving Average': '3',
        'Volume': '2',
        'Avg. Volume': '1',
    }

    const tickersTestSix = {
        'Previous Close': '1',
        '50-Day Moving Average': '2',
        '200-Day Moving Average': '3',
        'Volume': '.5',
        'Avg. Volume': '1',
    }
    const tickersTestSeven = {
        'Previous Close': '2',
        '50-Day Moving Average': '3',
        '200-Day Moving Average': '1',
        'Volume': '.5',
        'Avg. Volume': '1',
    }
    const tickersTestEight = {
        'Previous Close': '2',
        '50-Day Moving Average': '3',
        '200-Day Moving Average': '1',
        'Volume': '2',
        'Avg. Volume': '1',
    }
    const tickersTestNine = {
        'Previous Close': '2',
        '50-Day Moving Average': '1',
        '200-Day Moving Average': '3',
        'Volume': '2',
        'Avg. Volume': '1',
    }
    const tickersTestTen = {
        'Previous Close': '2',
        '50-Day Moving Average': '1',
        '200-Day Moving Average': '3',
        'Volume': '.5',
        'Avg. Volume': '1',
    }
    const tickersTestEleven = {
        'Previous Close': '3',
        '50-Day Moving Average': '1',
        '200-Day Moving Average': '2',
        'Volume': '2',
        'Avg. Volume': '1',
    }
    const tickersTestTwelve = {
        'Previous Close': '3',
        '50-Day Moving Average': '1',
        '200-Day Moving Average': '2',
        'Volume': '.5',
        'Avg. Volume': '1',
    }
    const tickersTestThirteen = {
        'Previous Close': '1',
        '50-Day Moving Average': '3',
        '200-Day Moving Average': '2',
        'Volume': '2',
        'Avg. Volume': '1',
    }
    const tickersTestFourteen = {
        'Previous Close': '1',
        '50-Day Moving Average': '3',
        '200-Day Moving Average': '2',
        'Volume': '.5',
        'Avg. Volume': '1',
    }

    describe('movingAverageMeanReversions', function () {

        it("Previous Close > 50-Day Moving Average > 200-Day Moving Average AND Volume Discrepancy is > 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestOne)
            expect({
                currentMarketValue: "3",
                description: 'Previous Close > 50-Day Moving Average > 200-Day Moving Average AND Volume Discrepancy is > 0',
                estimatedStockPrice: 4,
                weight: 1
            }).to.deep.equal(response);

        });

        it("Previous Close > 50-Day Moving Average > 200-Day Moving Average AND Volume Discrepancy is < 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestTwo)
            expect({
                currentMarketValue: "3",
                description: 'Previous Close > 50-Day Moving Average > 200-Day Moving Average AND Volume Discrepancy is < 0',
                estimatedStockPrice: 2,
                weight: -1
            }).to.deep.equal(response);

        });

        it("50-Day Moving Average > Previous Close > 200-Day Moving Average AND Volume Discrepancy is > 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestThree)
            expect({
                currentMarketValue: "2",
                description: '50-Day Moving Average > Previous Close > 200-Day Moving Average AND Volume Discrepancy is > 0',
                estimatedStockPrice: 3,
                weight: 1
            }).to.deep.equal(response);
        });

        it("50-Day Moving Average > Previous Close > 200-Day Moving Average AND Volume Discrepancy is < 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestFour)
            expect({
                currentMarketValue: "2",
                description: '50-Day Moving Average > Previous Close > 200-Day Moving Average AND Volume Discrepancy is < 0',
                estimatedStockPrice: 1,
                weight: -1
            }).to.deep.equal(response);
        });

        it("200-Day Moving Average > 50-Day Moving Average > Previous Close AND Volume Discrepancy is > 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestFive)
            expect({
                currentMarketValue: "1",
                description: '200-Day Moving Average > 50-Day Moving Average > Previous Close AND Volume Discrepancy is > 0',
                estimatedStockPrice: 2,
                weight: 1
            }).to.deep.equal(response);
        });

        it("200-Day Moving Average > 50-Day Moving Average > Previous Close AND Volume Discrepancy is < 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestSix)
            expect({
                currentMarketValue: "1",
                description: "200-Day Moving Average > 50-Day Moving Average > Previous Close AND Volume Discrepancy is < 0",
                estimatedStockPrice: 0,
                weight: -1
            }).to.deep.equal(response);
        });


        it("50-Day Moving Average > Previous Close > 200-Day Moving Average AND Volume Discrepancy is < 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestSeven)
            expect({
                currentMarketValue: "2",
                description: "50-Day Moving Average > Previous Close > 200-Day Moving Average AND Volume Discrepancy is < 0",
                estimatedStockPrice: 1,
                weight: -1
            }).to.deep.equal(response);
        });

        it("50-Day Moving Average > Previous Close > 200-Day Moving Average AND Volume Discrepancy is > 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestEight)
            expect({
                currentMarketValue: "2",
                description: "50-Day Moving Average > Previous Close > 200-Day Moving Average AND Volume Discrepancy is > 0",
                estimatedStockPrice: 3,
                weight: 1
            }).to.deep.equal(response);
        });

        it("200-Day Moving Average > Previous Close > 50-Day Moving Average AND Volume Discrepancy is > 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestNine)
            expect({
                currentMarketValue: "2",
                description: '200-Day Moving Average > Previous Close > 50-Day Moving Average AND Volume Discrepancy is > 0',
                estimatedStockPrice: 3,
                weight: 1
            }).to.deep.equal(response);
        });
        it("200-Day Moving Average > Previous Close > 50-Day Moving Average AND Volume Discrepancy is < 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestTen)
            expect({
                currentMarketValue: "2",
                description: '200-Day Moving Average > Previous Close > 50-Day Moving Average AND Volume Discrepancy is < 0',
                estimatedStockPrice: 1,
                weight: -1
            }).to.deep.equal(response);
        });
        it("Previous Close > 200-Day Moving Average > 50-Day Moving Average AND Volume Discrepancy is > 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestEleven)

            expect({
                currentMarketValue: "3",
                description: "Previous Close > 200-Day Moving Average > 50-Day Moving Average AND Volume Discrepancy is > 0",
                estimatedStockPrice: 4,
                weight: 1
            }).to.deep.equal(response);
        });
        it("Previous Close > 200-Day Moving Average > 50-Day Moving Average AND Volume Discrepancy is < 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestTwelve)

            expect({
                currentMarketValue: "3",
                description: "Previous Close > 200-Day Moving Average > 50-Day Moving Average AND Volume Discrepancy is < 0",
                estimatedStockPrice: 1,
                weight: -1
            }).to.deep.equal(response);
        });

        it("50-Day Moving Average > 200-Day Moving Average > Previous Close AND Volume Discrepancy is > 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestThirteen)

            expect({
                currentMarketValue: "1",
                description: "50-Day Moving Average > 200-Day Moving Average > Previous Close AND Volume Discrepancy is > 0",
                estimatedStockPrice: 2,
                weight: 1
            }).to.deep.equal(response);
        });

        it("50-Day Moving Average > 200-Day Moving Average > Previous Close AND Volume Discrepancy is < 0", function () {
            var response = Algorithms.movingAverageMeanReversions(tickersTestFourteen)
            expect({
                currentMarketValue: "1",
                description: "50-Day Moving Average > 200-Day Moving Average > Previous Close AND Volume Discrepancy is < 0",
                estimatedStockPrice: 2,
                weight: -1
            }).to.deep.equal(response);
        });





    });

    const stockMovementGoingDown = {
        'Previous Close': "3.0",
        closingHistory: {
            'Oct 18, 2022': '1',
            'Oct 17, 2022': '2',
            'Oct 14, 2022': '3',
            'Oct 13, 2022': '4',
            'Oct 12, 2022': '5'
        }
    }
    const stockMovementGoingUp = {
        'Previous Close': "3.0",
        closingHistory: {
            'Oct 18, 2022': '5',
            'Oct 17, 2022': '4',
            'Oct 14, 2022': '3',
            'Oct 13, 2022': '2',
            'Oct 12, 2022': '1'
        }
    }
    const stockMovementNA = {
        'Previous Close': "3.0",
        closingHistory: {
            'Oct 18, 2022': '1',
            'Oct 17, 2022': '1',
            'Oct 14, 2022': '1',
            'Oct 13, 2022': '1',
            'Oct 12, 2022': '1'
        }
    }

    describe('Stock Movement Past Seven Days', function () {
        it("(Close* of Yesterday) > (Close* of 3rd line date) > (Close* of 4th line date) > (Close* of 5th line date) > (Close* of 6th line date)", function () {
            var response = Algorithms.stockMovementSevenDays(stockMovementGoingUp)
            expect({
                currentMarketValue: "3.0",
                description: "(Close* of Yesterday) > (Close* of 3rd line date) > (Close* of 4th line date) > (Close* of 5th line date) > (Close* of 6th line date)",
                estimatedStockPrice: 2.5,
                weight: -1
            }).to.deep.equal(response);
        });

        it("(Close* of Yesterday) < (Close* of 3rd line date) < (Close* of 4th line date) < (Close* of 5th line date) < (Close* of 6th line date)", function () {
            var response = Algorithms.stockMovementSevenDays(stockMovementGoingDown)
            expect({
                currentMarketValue: "3.0",
                description: '(Close* of Yesterday) < (Close* of 3rd line date) < (Close* of 4th line date) < (Close* of 5th line date) < (Close* of 6th line date)',
                estimatedStockPrice: 3.5,
                weight: 1
            }).to.deep.equal(response);
        });

        it("No Trend In Stock Movement", function () {
            var response = Algorithms.stockMovementSevenDays(stockMovementNA)
            expect({
                currentMarketValue: "3.0",
                description: 'No Trend In Stock Movement',
                estimatedStockPrice: 'N/A',
                weight: 0
            }).to.deep.equal(response);
        });
    });

    const shortPercentLessThanFivePercent = {
        'Previous Close': "3.0",
        'Short % of Shares Outstanding': "0.93"
    }
    const shortPercentGreaterThanThirtyPercent = {
        'Previous Close': "3.0",
        'Short % of Shares Outstanding': "38"
    }
    const shortPercentGreaterLessThanFivePercent = {
        'Previous Close': "3.0",
        'Short % of Shares Outstanding': "29"
    }

    describe('Short Percent Of Shares Outstanding', function () {
        it("(Short % of Shares Outstanding) < 5% ", function () {
            var response = Algorithms.shortPercentOfSharesOutstanding(shortPercentLessThanFivePercent)
            expect({
                currentMarketValue: "3.0",
                description: "(Short % of Shares Outstanding) < 5% ",
                estimatedStockPrice: 3.0279000000000003,
                weight: 1.0093
            }).to.deep.equal(response);
        });

        it("(Short % of Shares Outstanding) > 30% ", function () {
            var response = Algorithms.shortPercentOfSharesOutstanding(shortPercentGreaterThanThirtyPercent)
            expect({
                currentMarketValue: "3.0",
                description: "(Short % of Shares Outstanding) > 30% ",
                estimatedStockPrice: 4.14,
                weight: 1.38
            }).to.deep.equal(response);
        });

        it("(Short % of Shares Outstanding) < 30% || (Short % of Shares Outstanding) > 5% )", function () {
            var response = Algorithms.shortPercentOfSharesOutstanding(shortPercentGreaterLessThanFivePercent)
            expect({
                currentMarketValue: "3.0",
                description: "(Short % of Shares Outstanding) < 30% || (Short % of Shares Outstanding) > 5% )",
                estimatedStockPrice: "N/A",
                weight: 0
            }).to.deep.equal(response);
        });
    });

    const revenueGrowthPositive = {
        'Previous Close': "3.0",
        'Quarterly Revenue Growth (yoy)': "1"
    }
    const revenueGrowthNegative = {
        'Previous Close': "3.0",
        'Quarterly Revenue Growth (yoy)': "-1"
    }
    const revenueGrowthZero = {
        'Previous Close': "3.0",
        'Quarterly Revenue Growth (yoy)': "0.0"
    }

    describe('Revenue Growth', function () {
        it("(Quarterly Revenue Growth (yoy) > 0", function () {
            var response = Algorithms.revenueGrowth(revenueGrowthPositive)
            expect({
                currentMarketValue: "3.0",
                description: "(Quarterly Revenue Growth (yoy) > 0",
                estimatedStockPrice: 3.0300000000000002,
                weight: 1.01
            }).to.deep.equal(response);
        });

        it("(Quarterly Revenue Growth (yoy) < 0", function () {
            var response = Algorithms.revenueGrowth(revenueGrowthNegative)
            expect({
                currentMarketValue: "3.0",
                description: "(Quarterly Revenue Growth (yoy) < 0",
                estimatedStockPrice: 2.9699999999999998,
                weight: -1.01
            }).to.deep.equal(response);
        });

        it("(Quarterly Revenue Growth (yoy) = 0", function () {
            var response = Algorithms.revenueGrowth(revenueGrowthZero)
            expect({
                currentMarketValue: "3.0",
                description: "(Quarterly Revenue Growth (yoy) == 0",
                estimatedStockPrice: 'N/A',
                weight: 0
            }).to.deep.equal(response);
        });
    });

    const earningsGrowthPositive = {
        'Previous Close': "3.0",
        'Quarterly Earnings Growth (yoy)': "1"
    }
    const earningsGrowthNegative = {
        'Previous Close': "3.0",
        'Quarterly Earnings Growth (yoy)': "-1"
    }
    const earningsGrowthZero = {
        'Previous Close': "3.0",
        'Quarterly Earnings Growth (yoy)': "0.0"
    }

    describe('Earnings Growth', function () {
        it("(Quarterly Earnings Growth (yoy) > 0", function () {
            var response = Algorithms.earningsGrowth(earningsGrowthPositive)
            expect({
                currentMarketValue: "3.0",
                description: "(Quarterly Earnings Growth (yoy) > 0",
                estimatedStockPrice: 3.0300000000000002,
                weight: 1.01
            }).to.deep.equal(response);
        });

        it("(Quarterly Earnings Growth (yoy) < 0", function () {
            var response = Algorithms.earningsGrowth(earningsGrowthNegative)
            expect({
                currentMarketValue: "3.0",
                description: "(Quarterly Earnings Growth (yoy) < 0",
                estimatedStockPrice: 2.9699999999999998,
                weight: -1.01
            }).to.deep.equal(response);
        });

        it("(Quarterly Earnings Growth (yoy) = NA", function () {
            var response = Algorithms.earningsGrowth(earningsGrowthZero)
            expect({
                currentMarketValue: "3.0",
                description: "(Quarterly Earnings Growth (yoy) = NA",
                estimatedStockPrice: 'N/A',
                weight: 0
            }).to.deep.equal(response);
        });
    });

    const trailingPEvsForwardGreaterThanZero = {
        "valuationMeasurementTable": {
            'Trailing P/E': {
                'Current': "1.0"
            },
            'Forward P/E': {
                'Current': "2.0"
            }
        },
        'Previous Close': "3.0",
        'Diluted EPS (ttm)': ".5"
    }
    const trailingPEvsForwardLessThanZero = {
        "valuationMeasurementTable": {
            'Trailing P/E': {
                'Current': "2.0"
            },
            'Forward P/E': {
                'Current': "1.0"
            }
        },
        'Previous Close': "3.0",
        'Diluted EPS (ttm)': ".5"
    }

    const expectedNA = {
        "valuationMeasurementTable": {
            'Trailing P/E': {
                'Current': "N/A"
            },
            'Forward P/E': {
                'Current': "1.0"
            }
        },
        'Previous Close': "3.0",
        'Diluted EPS (ttm)': ".5"
    }

    describe('Trailing P/E vs. Forward P/E', function () {
        it("Expected Stock Price Move > 0", function () {
            var response = Algorithms.trailingPEvsForward(trailingPEvsForwardGreaterThanZero)
            expect({
                "Forward P/E": 2,
                "Trailing P/E": 1,
                currentMarketValue: "3.0",
                description: "Expected Stock Price Move > 0",
                estimatedStockPrice: 3.5,
                weight: 1
            }).to.deep.equal(response);
        });

        it("Expected Stock Price Move < 0", function () {
            var response = Algorithms.trailingPEvsForward(trailingPEvsForwardLessThanZero)
            expect({
                "Forward P/E": 1,
                "Trailing P/E": 2,
                currentMarketValue: "3.0",
                description: "Expected Stock Price Move < 0",
                "estimatedStockPrice": 2.5,
                weight: -1
            }).to.deep.equal(response);
        });
        it("Expected N/A", function () {
            var response = Algorithms.trailingPEvsForward(expectedNA)
            expect({
                "Forward P/E": 1,
                "Trailing P/E": NaN,
                "currentMarketValue": "N/A",
                "description": "Trailing P/E OR Forward P/E Equals N/A ",
                "estimatedStockPrice": "N/A",
                "weight": "N/A"
            }).to.deep.equal(response);
        });
    });

    const assetsGreaterThanLiabilities = {
        'Previous Close': "3.0",
        'Current Assets': "2.0",
        'Current Liabilities': "1.0",
    }
    const liabilitiesGreaterThanAssets = {
        'Previous Close': "3.0",
        'Current Assets': "1.0",
        'Current Liabilities': "2.0",
    }
    const abilityToPayNA = {
        'Previous Close': "3.0",
        'Current Assets': "N/A",
        'Current Liabilities': "2.0",
    }

    describe('Ability to Pay Current Liabilities', function () {

        it("Current Assets > Current Liabilities", function () {
            var response = Algorithms.abilityToPayCurrentLiabilities(assetsGreaterThanLiabilities)
            expect({
                "Current Assets": 2,
                "Current Liabilities": 1,
                currentMarketValue: "3.0",
                description: "Current Assets > Current Liabilities",
                "estimatedStockPrice": "3.0",
                weight: 1
            }).to.deep.equal(response);
        });

        it("Current Assets < Current Liabilities", function () {
            var response = Algorithms.abilityToPayCurrentLiabilities(liabilitiesGreaterThanAssets)
            expect({
                "Current Assets": 1,
                "Current Liabilities": 2,
                currentMarketValue: "3.0",
                "description": "Current Assets < Current Liabilities ",
                "estimatedStockPrice": "3.0",
                weight: -1
            }).to.deep.equal(response);
        });
        it("Expected N/A", function () {
            var response = Algorithms.abilityToPayCurrentLiabilities(abilityToPayNA)
            expect({
                "Current Assets": NaN,
                "Current Liabilities": 2,
                "currentMarketValue": "N/A",
                "description": "Current Assets OR Current Liabilities Equals N/A ",
                "estimatedStockPrice": "3.0",
                "weight": "N/A"
            }).to.deep.equal(response);
        });
    });

    const previousGreaterThanCurrent = {
        'Previous Close': "2.0",
        'Current Issued Shares': "3,000,000",
        'Previous Issued Shares': "4,000,000",
    }
    const currentGreaterThanPrevious = {
        'Previous Close': "3.0",
        'Current Issued Shares': "4,000,000",
        'Previous Issued Shares': "3,000,000",
    }
    const previousNA = {
        'Previous Close': "3.0",
        'Current Issued Shares': "N/A",
        'Previous Issued Shares': "2.0",
    }
    describe('Stock Buy-Backs', function () {

        it("Current Assets > Current Liabilities", function () {
            var response = Algorithms.stockBuyBacks(previousGreaterThanCurrent)
            expect({
                "Current Assets": 2,
                "Current Liabilities": 1,
                currentMarketValue: "3.0",
                description: "Current Assets > Current Liabilities",
                "estimatedStockPrice": "3.0",
                weight: 1
            }).to.deep.equal(response);
        });

        it("Current Assets < Current Liabilities", function () {
            var response = Algorithms.stockBuyBacks(currentGreaterThanPrevious)
            expect({
                "Current Assets": 1,
                "Current Liabilities": 2,
                currentMarketValue: "3.0",
                "description": "Current Assets < Current Liabilities ",
                "estimatedStockPrice": "3.0",
                weight: -1
            }).to.deep.equal(response);
        });
        it("Expected N/A", function () {
            var response = Algorithms.stockBuyBacks(previousNA)
            expect({
                "Current Assets": NaN,
                "Current Liabilities": 2,
                "currentMarketValue": "N/A",
                "description": "Current Issued Shares OR Previous Issued Shares Equals N/A ",
                "estimatedStockPrice": "3.0",
                "weight": "N/A"
            }).to.deep.equal(response);
        });
    });
});

