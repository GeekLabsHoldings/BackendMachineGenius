const puppeteer = require('puppeteer');

const scrapeURLs = async (page) => {
  try {
    await page.goto("https://investorplace.com/stock-quotes/amzn-stock-quote/", {
      waitUntil: "domcontentloaded",
      timeout: 120000
    });
    const URLs = await page.evaluate(() => {
      const ScrapeList = document.querySelectorAll(".articleswrap #ipm-related-articles #recent-stories-list-container .subcat-post-row h2 a");
      return Array.from(ScrapeList).map(Scrape => {
        let href = Scrape.getAttribute("href");
        // let title = Scrape.querySelector('h2').innerText;
        let title = Scrape.innerText;
        if (!href.startsWith('http')) {
          href = `https://investorplace.com/${href}`;
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
      timeout: 120000,
    });
        const content = await page.evaluate(() => {
        const ScrapeList = document.querySelectorAll(".entry-content p");      
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