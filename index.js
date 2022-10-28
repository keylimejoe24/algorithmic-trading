const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const express = require('express');
const stock = require('./scripts/stock');
const profile = require('./scripts/profile');
const trending = require('./scripts/trending');
const mostActive = require('./scripts/mostActive');
const gainers = require('./scripts/gainers');
const losers = require('./scripts/losers');
const etfs = require('./scripts/etfs');
const futures = require('./scripts/futures');
const indFutures = require('./scripts/indFutures');
const worldIndices = require('./scripts/worldIndices');
const indWorldIndices = require('./scripts/indWorldIndices');
const currencies = require('./scripts/currencies');
const indCurrencies = require('./scripts/indCurrencies');
const stats = require('./scripts/stat');
const incomeStatement = require('./scripts/incomeStatement');
const scrape = require('./application');
const cron = require("node-cron");
const app = express();
const PORT = process.env.PORT || 3000;
const logger = require('./logger')('SERVER'); // Defining logger for this device controller

app.use(express.json());


const scrapeFunc = () => {
    logger.print("scrape started")
    scrape.run()
 }
const scheduler = cron.schedule('*/10 * * * * *', scrapeFunc, { scheduled: false });


app.get('/start', (req, res) => {
    logger.print("start")
    scheduler.start()
    res.send('started node chron');
});
app.get('/stop', (req, res) => {
    logger.print("stop")
    scheduler.stop()
    res.send('stopped node chron');
});

//GET home page
app.get('/', (req, res) => {
    res.send('Welcome to Stockers API');
});

//GET ticker details
app.get('/ticker/:ticker', async (req, res) => {
    const { ticker } = req.params;
    try {
        const data = await stock.fetchData(ticker);
        res.json(data);

    } catch (error) {
        res.json(error);
    }
});

//GET profile details
app.get('/ticker/:ticker/profile', async (req, res) => {
    const { ticker } = req.params;

    try {
        const data = await profile.getData(ticker);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

//GET trending tickers 
app.get('/trending', async (req, res) => {
    try {
        const data = await trending.getData();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

//GET most active stocks
/* showing results for united states, mid/large/mega cap, vol greater than 5 mil*/
app.get('/most-active', async (req, res) => {
    try {
        const data = await mostActive.getData();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
} );

//GET top 250 gainers
/* showing results for united states, mid/large/mega cap, vol greater than 15k, pctChange > 3*/
app.get('/gainers', async (req, res) => {
    try {
        const data = await gainers.getData();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

//GET top losers
/* showing results for united states, mid/large/mega cap, vol greater than 15k, pctChange > 3*/
app.get('/losers', async (req, res) => {
    try {
        const data = await losers.getData();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

//GET top 250 ETFs
/* showing results for united states, price>10*/
app.get('/etfs', async (req, res) => {
    try {
        const data = await etfs.getData();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

//GET futures
app.get('/futures', async (req, res) => {
    try {
        const data = await futures.getData();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

//GET individual future details
app.get('/futures/:ticker', async (req, res) => {
    const { ticker } = req.params;

    try {
        const data = await indFutures.getData(ticker);
        res.json(data);
    } catch (err) {
        res.json(err);
    }
});

//GET world indices
app.get('/world-indices', async (req, res) => {
    try {
        const data = await worldIndices.getData();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

//GET individual world index details
app.get('/world-indices/:ticker', async (req, res) => {
    const { ticker } = req.params;

    try {
        const data = await indWorldIndices.getData(ticker);
        res.json(data);
    } catch (err) {
        res.json(err);
    }
});

//GET currencies
app.get('/currencies', async (req, res) => {
    try {
        const data = await currencies.getData();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

//GET individual currency details
app.get('/currencies/:ticker', async (req, res) => {
    const { ticker } = req.params;

    try {
        const data = await indCurrencies.getData(ticker);
        res.json(data);
    } catch (err) {
        res.json(err);
    }
});

//GET statistical information for a ticker
app.get('/ticker/:ticker/stats', async (req, res) => {
    const { ticker } = req.params;

    try {
        const data = await stats.getData(ticker);
        res.json(data);
    } catch (err) {
        res.json(err);
    }
});

//GET income statement for a ticker

app.get('/ticker/:ticker/income-statement', async (req, res) => {
    const { ticker } = req.params;

    try {
        const data = await incomeStatement.getData(ticker);
        res.json(data);
    } catch (err) {
        res.json(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});





