const puppeteer = require('puppeteer');

const scrapeURLs = async (page) => {
  try {
    await page.goto("https://www.thestar.com/politics/", {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });
    // await page.goto('https://www.thestar.com/politics/', { waitUntil: 'domcontentloaded' });
    const URLs = await page.evaluate(() => {
      const ScrapeList = document.querySelectorAll(".tnt-has-block-bg a.tnt-asset-link");
      return Array.from(ScrapeList).map(Scrape => {
        let href = Scrape.getAttribute("href");
        const title = Scrape.innerText;
        if (!href.startsWith('http')) {
          href = `https://www.thestar.com${href}`;
        }
        return { href, title };
      });
    });
    return URLs;
  } catch (error) {
    await browser.close();
    console.error('Error during URL scraping:', error);
    throw error;
  }
  };
  

const scrapeContentFromURL = async (page, url) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const content = await page.evaluate(() => {
    const ScrapeList = document.querySelectorAll(".asset-content p:not(.subscriber-offers p)");
      return Array.from(ScrapeList).map(Scrape => Scrape.innerText);
    });
    return content;
};

module.exports = 
{
    scrapeURLs,
    scrapeContentFromURL
}