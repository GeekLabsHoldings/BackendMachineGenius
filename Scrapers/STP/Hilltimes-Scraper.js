const puppeteer = require('puppeteer');

const scrapeURLs = async (page) => {
  try {
    await page.goto("https://www.ctvnews.ca/politics", {
      waitUntil: "domcontentloaded",
      timeout: 120000
    });
    // await page.goto('https://www.thestar.com/politics/', { waitUntil: 'domcontentloaded' });
    const URLs = await page.evaluate(() => {
      const ScrapeList = document.querySelectorAll(".elementor-container.elementor-column-gap-default article .elementor-widget-container  h3 a");
      return Array.from(ScrapeList).map(Scrape => {
        let href = Scrape.getAttribute("href");
        // let title = Scrape.querySelector('.c-posts__headline span').innerText;
        const title = Scrape.innerText;
        if (!href.startsWith('http')) {
          href = `https://www.ctvnews.ca${href}`;
        }
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
    const ScrapeList = document.querySelectorAll("#entry-content p");
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