const puppeteer = require('puppeteer');

const scrapeURLs = async (page) => {
  try {
    await page.goto("https://www.investing.com/equities/nvidia-corp", {
      waitUntil: "domcontentloaded",
      timeout: 120000
    });
    const URLs = await page.evaluate(() => {
      const ScrapeList = document.querySelectorAll(".mb-12 ul li a");
      return Array.from(ScrapeList).map(Scrape => {
        let href = Scrape.getAttribute("href");
        let title = Scrape.innerText;
        if (!href.startsWith('http')) {
          href = `https://www.investing.com/equities/nvidia-corp${href}`;
        }
        return { href, title };
      });
    });
    console.log("URLs-->" + URLs);
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
    const ScrapeList = document.querySelectorAll(".w-full .article_container p");
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