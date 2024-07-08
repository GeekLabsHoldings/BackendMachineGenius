const puppeteer = require('puppeteer');

const scrapeURLs = async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-http2',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--enable-features=NetworkService,NetworkServiceInProcess',
      ]
    });
  
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setDefaultNavigationTimeout(60000);
  
    try {
      await page.goto("https://www.cbc.ca/news/politics", {
        waitUntil: "domcontentloaded",
        timeout: 60000
      });
  
      const URLs = await page.evaluate(() => {
        const ScrapeList = document.querySelectorAll("a.card.cardDefault , a.card.cardText , a.card.cardListing.rightImage:not(a.flag-live) ");
        return Array.from(ScrapeList).map((Scrape) => {
          let href = Scrape.getAttribute("href");
          let title = Scrape.querySelector('.headline').innerText;
          if (!href.startsWith('http')) {
            href = `https://www.cbc.ca${href}`;
          }
          return { href, title };
        });
      });
  
      await browser.close();
      return URLs;
    } catch (error) {
      await browser.close();
      console.error('Error during URL scraping:', error);
      throw error;
    }
};

const scrapeContentFromURL = async (url) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-http2',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--enable-features=NetworkService,NetworkServiceInProcess',
      ]
    });
  
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setDefaultNavigationTimeout(60000);
  
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 60000
      });
  
      const content = await page.evaluate(() => {
        const ScrapeList = document.querySelectorAll(".story p");
        return Array.from(ScrapeList).map((Scrape) => Scrape.innerText);
      });
  
      await browser.close();
      return content.join(' ');
    } catch (error) {
      await browser.close();
      console.error(`Error during content scraping from ${url}:`, error);
      throw error;
    }
};

module.exports = 
{
    scrapeURLs,
    scrapeContentFromURL
}