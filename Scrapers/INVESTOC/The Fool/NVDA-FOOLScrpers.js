const puppeteer = require('puppeteer');

const scrapeURLs = async (page) => {
  try {
    await page.goto("https://www.fool.com/quote/nasdaq/nvda/", {
      waitUntil: "domcontentloaded",
      timeout: 120000
    });
    const URLs = await page.evaluate(() => {
      const ScrapeList = document.querySelectorAll("#quote-news-analysis a");
      return Array.from(ScrapeList).map(Scrape => {
        let href = Scrape.getAttribute("href");
        let title = Scrape.querySelector('h3').innerText;
        if (!href.startsWith('http')) {
          href = `https://www.fool.com${href}`;
        }
        console.log(href , title);
        return { href, title };
      });
    });
    return URLs;
  } catch (error) {
    // await browser.close();
    console.error('Error during URL scraping:', error);
    throw error;
  }
};


const scrapeContentFromURL = async (page, url) => {
  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 120000
    });
    const content = await page.evaluate(() => {
    const ScrapeList = document.querySelectorAll(".article-body p");
      return Array.from(ScrapeList).map(Scrape => Scrape.innerText);
    });
    return content.join(' ');
  }
    catch (error) {
      // await browser.close();
      console.error(`Error during content scraping from ${url}:`, error);
      throw error;
    }
};

module.exports = 
{
    scrapeURLs,
    scrapeContentFromURL
}