const puppeteer = require('puppeteer');
const collect_FOOLScrapers = require('../../Scrapers/INVESTOC/Collect-FOOLScrapers')
const collect_InvestingScrapers = require('../../Scrapers/INVESTOC/Collect-InvestingScraper')


const CollectFool = async (req, res) => {
    try {
        const [nvdaContent, tslaContent, pltrContent, amdContent, appleContent, amznContent] = await Promise.all([
            collect_FOOLScrapers.scrapeNVDA(),
            collect_FOOLScrapers.scrapeTSLA(),
            collect_FOOLScrapers.scrapePLTR(),
            collect_FOOLScrapers.scrapeAMD(),
            collect_FOOLScrapers.scrapeAPPLE(),
            collect_FOOLScrapers.scrapeAMZN(),
        ]);
        // console.log("nvdaContent-->" + nvdaContent)
        const allContent_from_sites = [].concat(nvdaContent ,tslaContent, pltrContent, amdContent, appleContent, amznContent);
        res.json({ success: true, allArticles: allContent_from_sites });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const CollectInvesting = async (req, res) => {
    try {
        const [nvdaContent] = await Promise.all([
            collect_InvestingScrapers.scrapeNVDA(),
    
        ]);
        // console.log("nvdaContent-->" + nvdaContent)
        const allContent_from_sites = [].concat(nvdaContent);
        res.json({ success: true, allArticles: allContent_from_sites });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    CollectFool,
    CollectInvesting
}
