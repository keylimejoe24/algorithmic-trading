
const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const URL = "https://finance.yahoo.com/quote";
const baseURL = "https://finance.yahoo.com/quote";


async function getData(stock) {
    try {
        let currentTime = `${Date.now()}`
    
        let url = `https://query1.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/${stock}?lang=en-US&region=US&symbol=${stock}&padTimeSeries=true&type=quarterlyCurrentLiabilities%2CquarterlyCurrentAssets%2CquarterlyShareIssued&merge=false&period1=493590046&period2=${currentTime.slice(0, -3)}&corsDomain=finance.yahoo.com`
        const headers = {
           'authority': 'query1.finance.yahoo.com',
           'accept': '*/*',
           'accept-language': 'en-US,en;q=0.9',
           'cookie': `GUC=AQEBBwFjPv1jZUIjXQT4&s=AQAAAK2yme1e&g=Yz2uiw; A1=d=AQABBFKD6GECEFS8eMLgzuKh5b7JPJh7QtgFEgEBBwH9PmNlY9wr0iMA_eMBAAcIUoPoYZh7Qtg&S=AQAAAn_ZMhA9qQ6HeImRtvcMX6M; A3=d=AQABBFKD6GECEFS8eMLgzuKh5b7JPJh7QtgFEgEBBwH9PmNlY9wr0iMA_eMBAAcIUoPoYZh7Qtg&S=AQAAAn_ZMhA9qQ6HeImRtvcMX6M; A1S=d=AQABBFKD6GECEFS8eMLgzuKh5b7JPJh7QtgFEgEBBwH9PmNlY9wr0iMA_eMBAAcIUoPoYZh7Qtg&S=AQAAAn_ZMhA9qQ6HeImRtvcMX6M&j=CCPA; PRF=t%3D${stock}%252BLAND%252BVELA%252BHASI%252BBBBY%252BJPM%252BNFLX%252BCVNA%252BVLN.TO%252BMETA%252BBAC%252BPG%252BAMSC%252BAMZN%252BNEE; cmp=t=1666309653&j=0&u=1YNN`,
           'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
           'sec-ch-ua-mobile': '?0',
           'sec-ch-ua-platform': '"macOS"',
           'sec-fetch-dest': 'empty',
           'sec-fetch-mode': 'cors',
           'sec-fetch-site': 'same-site',
           'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
           'origin': 'https://finance.yahoo.com',
           'referer': `https://finance.yahoo.com/quote/${stock}/balance-sheet?p=${stock}`,
        }
        const res = await axios.get(url, { headers })
        let balanceSheetRes = {
          'Current Assets': null,
          'Current Liabilities': null,
          'Current Issued Shares': null,
          'Previous Issued Shares': null
        }
        res.data.timeseries.result.forEach(function (item, index) {
          
          if(Object.hasOwn(item, 'quarterlyShareIssued')){
            balanceSheetRes['Previous Issued Shares'] = item.quarterlyShareIssued[2].reportedValue.raw
            balanceSheetRes['Current Issued Shares'] = item.quarterlyShareIssued[3].reportedValue.raw
          }
          if(Object.hasOwn(item, 'quarterlyCurrentLiabilities')){
            balanceSheetRes['Current Liabilities'] = item.quarterlyCurrentLiabilities[3].reportedValue.raw 
          }
          if(Object.hasOwn(item, 'quarterlyCurrentAssets')){
            balanceSheetRes['Current Assets'] = item.quarterlyCurrentAssets[3].reportedValue.raw 
          }
          
        });
        return balanceSheetRes
        
    
    } catch (error) {
        console.log(error)
    }
}


exports.getData = getData;