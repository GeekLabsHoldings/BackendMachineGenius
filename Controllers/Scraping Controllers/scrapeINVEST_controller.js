const puppeteer = require('puppeteer');
const nvdaScraper = require('../../Scrapers/INVESTOC/NVDA-Scrpers')
const tslaScraper = require('../../Scrapers/INVESTOC/TSLA-Scraper')
const collectScrapers = require('../../Scrapers/INVESTOC/Collect-INVScrapers')


const Collect = async (req, res) => {
    try {
        const [nvdaContent, tslaContent, pltrContent] = await Promise.all([collectScrapers.scrapeNVDA(), collectScrapers.scrapeTSLA() , collectScrapers.scrapePLTR()]);
        const allContent_from_sites = [...nvdaContent, ...tslaContent, ...pltrContent];
        res.json({ success: true, allArticles: allContent_from_sites });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    Collect,
}
