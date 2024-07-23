const puppeteer = require('puppeteer');

const scrapeURLs = async (page) => {
  try {
    await page.goto("https://globalnews.ca/politics/", {
      waitUntil: "domcontentloaded",
      timeout: 120000
    });
    // await page.goto('https://www.thestar.com/politics/', { waitUntil: 'domcontentloaded' });
    const URLs = await page.evaluate(() => {
      const ScrapeList = document.querySelectorAll(".l-section__widget ul li a");
      return Array.from(ScrapeList).map(Scrape => {
        console.log("-------------------.>>>>>",Scrape);

        let href = Scrape.getAttribute("href");
        // let title = Scrape.querySelector('.c-posts__headlineText');
        // console.log(title);
        const title = Scrape.innerText;
        // if (!href.startsWith('http')) {
        //   href = `https://globalnews.ca/${href}`;
        // }

        console.log("-------------------.>>>>>",title);

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
    const ScrapeList = document.querySelectorAll(".l-article__text.js-story-text p");
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