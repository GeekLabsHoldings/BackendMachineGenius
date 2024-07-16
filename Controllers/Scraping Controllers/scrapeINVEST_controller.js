const puppeteer = require('puppeteer');
const collect_FOOLScrapers = require('../../Scrapers/INVESTOC/Collect Sites/Collect-FOOLScrapers')
const collect_InvestingScrapers = require('../../Scrapers/INVESTOC/Collect Sites/Collect-Investor-Scraper')
const collect_NVDA = require('../../Scrapers/INVESTOC/NVDA/NVDA-Collector')
const collect_APPLE = require('../../Scrapers/INVESTOC/AAPL/APPLE-Collector')
const collect_AMD = require('../../Scrapers/INVESTOC/AMD/AMD-Collector')
const collect_AMZN = require('../../Scrapers/INVESTOC/AMZN/AMZN-Collector')
const collect_PLTR = require('../../Scrapers/INVESTOC/PLTR/PLTR-Collector')
const collect_TSLA = require('../../Scrapers/INVESTOC/TSLA/TSLA-Collector')

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

/////////////------------///////////////////
const CollectNvda = async (req, res) => {
    try {
        const [FoolContent , InvestorContent , TweaktownContent] = await Promise.all([
            collect_NVDA.scrape_Fool(),
            collect_NVDA.scrape_Investor(),
            collect_NVDA.scrape_Tweaktown()
        ]);
        const allContent_from_sites = [].concat(FoolContent , InvestorContent , TweaktownContent);
        res.json({ success: true, allArticles: allContent_from_sites });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const CollectApple = async (req, res) => {
    try {
        const [FoolContent , InvestorContent] = await Promise.all([
            collect_APPLE.scrape_Fool(),
            collect_APPLE.scrape_Investor(),
        ]);
        // console.log("nvdaContent-->" + nvdaContent)
        const allContent_from_sites = [].concat(FoolContent , InvestorContent);
        res.json({ success: true, allArticles: allContent_from_sites });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const CollectAmd = async (req, res) => {
    try {
        const [FoolContent , InvestorContent] = await Promise.all([
            collect_AMD.scrape_Fool(),
            collect_AMD.scrape_Investor(),
        ]);
        // console.log("nvdaContent-->" + nvdaContent)
        const allContent_from_sites = [].concat(FoolContent , InvestorContent);
        res.json({ success: true, allArticles: allContent_from_sites });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const CollectAmzn = async (req, res) => {
    try {
        const [FoolContent , InvestorContent] = await Promise.all([
            collect_AMZN.scrape_Fool(),
            collect_AMZN.scrape_Investor(),
        ]);
        // console.log("nvdaContent-->" + nvdaContent)
        const allContent_from_sites = [].concat(FoolContent , InvestorContent);
        res.json({ success: true, allArticles: allContent_from_sites });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const CollectPltr = async (req, res) => {
    try {
        const [FoolContent , InvestorContent] = await Promise.all([
            collect_PLTR.scrape_Fool(),
            collect_PLTR.scrape_Investor(),
        ]);
        // console.log("nvdaContent-->" + nvdaContent)
        const allContent_from_sites = [].concat(FoolContent , InvestorContent);
        res.json({ success: true, allArticles: allContent_from_sites });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const CollectTsla = async (req, res) => {
    try {
        const [FoolContent , InvestorContent] = await Promise.all([
            collect_TSLA.scrape_Fool(),
            collect_TSLA.scrape_Investor(),
        ]);
        // console.log("nvdaContent-->" + nvdaContent)
        const allContent_from_sites = [].concat(FoolContent , InvestorContent);
        res.json({ success: true, allArticles: allContent_from_sites });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    CollectFool,
    CollectInvesting,
    //////
    CollectNvda,
    CollectApple,
    CollectAmd,
    CollectAmzn,
    CollectPltr,
    CollectTsla
}
