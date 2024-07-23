const puppeteer = require('puppeteer');
const Scrape = require('./TwitterScrapers');

const accounts = [
  // "https://x.com/Beth_Kindig",
  // "https://x.com/Teslaconomics",
  // "https://x.com/SawyerMerritt",
  // "https://x.com/ChaseMacTrades",
  // "https://x.com/jdmarkman",
  // "https://x.com/stocktalkweekly",
  // "https://x.com/TheLongInvest",
  "https://x.com/amitisinvesting",
  // "https://x.com/StockMKTNewz",
  // "https://x.com/FunOfInvesting",
  // "https://x.com/WholeMarsBlog",
  // "https://x.com/_JoseNajarro",
  // "https://x.com/TashaARK",
  // "https://x.com/ChartWaveTrade",
  // "https://x.com/EventuallyWLTHY",
  // "https://x.com/burrytracker",
  // "https://x.com/TheSonOfWalkley",
  // "https://x.com/Investingcom",
  // "https://x.com/DividendTalks",
  "https://x.com/DailyPalantir",
  // "https://x.com/KobeissiLetter",
  // "https://x.com/nvidiaxupdates",
  // "https://x.com/Mr_Derivatives"
];

const TwitterCollector = async (accountUrl) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://x.com/i/flow/login', { 
      waitUntil: "domcontentloaded",
      timeout: 240000
     });

    await page.waitForSelector('input[name="text"]', { visible: true });
    await page.type('input[name="text"]', 'mohamedmamdouhgeeklab@gmail.com');
    await page.keyboard.press('Enter');

    await page.waitForSelector('input[name="text"]', { visible: true });
    await page.type('input[name="text"]', 'Mohamed80492371');
    await page.keyboard.press('Enter');

    await page.waitForSelector('input[name="password"]', { visible: true });
    await page.type('input[name="password"]', 'Polo_1991');
    await page.keyboard.press('Enter');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    console.log("Account URL:", accountUrl);
    const tweetURLs = await Scrape.scrapeURLs(page, accountUrl);
    console.log("Tweet Links:", tweetURLs);

    const tweetContents = await Scrape.scrapeContentFromURL(browser, tweetURLs);
    console.log("Tweet Contents:", tweetContents);

    return tweetContents;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

const collectAllAccounts = async () => {
  const allTweetContents = [];

  for (const account of accounts) {
    const tweetContents = await TwitterCollector(account);
    allTweetContents.push({ account, tweets: tweetContents });
  }

  console.log("All Tweet Contents:", allTweetContents);
  return allTweetContents;
};

module.exports = {
  collectAllAccounts
};
