const puppeteer = require('puppeteer');
const nvdaScraper = require('../../Scrapers/INVESTOC/The Fool/NVDA-FOOLScrpers')
const tslaScraper = require('../../Scrapers/INVESTOC/The Fool/TSLA-FOOLScrpers')
const collectScrapers = require('../../Scrapers/INVESTOC/Collect-FOOLScrapers')
const collectScrapers2 = require('../../Scrapers/INVESTOC/Collect-YahooScrapers')


const Collect = async (req, res) => {
    try {
        const [nvdaContent, tslaContent, pltrContent, amdContent, appleContent, amznContent] = await Promise.all([
            collectScrapers.scrapeNVDA(),
            collectScrapers.scrapeTSLA(),
            collectScrapers.scrapePLTR(),
            collectScrapers.scrapeAMD(),
            collectScrapers.scrapeAPPLE(),
            collectScrapers.scrapeAMZN(),
        ]);
        // console.log("nvdaContent-->" + nvdaContent)
        const allContent_from_sites = [].concat(nvdaContent ,tslaContent, pltrContent, amdContent, appleContent, amznContent);
        res.json({ success: true, allArticles: allContent_from_sites });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const Collect2 = async (req, res) => {
    try {
        const [pltrContent] = await Promise.all([
            collectScrapers2.scrapePLTR()
        ]);
        // console.log("nvdaContent-->" + nvdaContent)
        const allContent_from_sites = [...pltrContent];
        res.json({ success: true, allArticles: allContent_from_sites });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    Collect,
    Collect2
}
