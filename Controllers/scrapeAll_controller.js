const puppeteer = require('puppeteer');
const cbcScrape = require('../Scrapers/CBC-Scraper')
const thestarScraper = require('../Scrapers/TheStar-Scraper')
const collectScrapers = require('../Scrapers/Collect-Scrapers')


const cbcScrapeAll = async (req, res) => {
    try {
      const URLs = await cbcScrape.scrapeURLs();
      const allContent = [];
  
      for (let { href, title } of URLs) {
        try {
          const content = await cbcScrape.scrapeContentFromURL(href);
          allContent.push({ url: href, title, content });
        } catch (error) {
          console.error(Error `scraping content from ${url}:`, error);
          allContent.push({ href, content: 'Error fetching content' });
        }
      }
  
      res.json({ success: true, allContent });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
}

const thestarScrapeAll = async (req, res) => {
    const browser = await puppeteer.launch({
    });
    const page = await browser.newPage();
    try {
      const URLs = await thestarScraper.scrapeURLs(page);
      const allContent = [];
      for (let { href, title } of URLs) {
        console.log(`Scraping content from: ${href}`);
        try 
            {
                const content = await thestarScraper.scrapeContentFromURL(page, href);
                if(title)
                {
                    allContent.push({ url: href, title, content });
                }
            } catch (error) {
                console.error(`Error scraping content from ${href}:`, error);
                allContent.push({ url: href, title, content: 'Error fetching content' });
            }
      }
      res.json({ success: true, allContent });
    } catch (error) {
      console.error('Error scraping all content:', error);
      res.status(500).json({ success: false, error: error.message });
    } finally {
      await browser.close();
    }
}

const Collect = async (req, res) => {
    try {
        const [cbcContent, theStarContent] = await Promise.all([collectScrapers.scrapeCBC(), collectScrapers.scrapeTheStar()]);
        const allContent_from_sites = [...cbcContent, ...theStarContent];
        res.json({ success: true, allArticles: allContent_from_sites });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    cbcScrapeAll,
    thestarScrapeAll,
    Collect
}
