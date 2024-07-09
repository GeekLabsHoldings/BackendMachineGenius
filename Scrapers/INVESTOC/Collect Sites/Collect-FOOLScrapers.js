const puppeteer = require('puppeteer');
const nvdaScrape = require('../NVDA/NVDA-FOOLScrpers');
const tslaScraper = require('../TSLA/TSLA-FOOLScrpers');
const pltrScraper = require('../PLTR/PLTR-FOOLScrpers');
const amdScraper = require('../AMD/AMD-FOOLScrapers');
const appleScraper = require('../AAPL/APPLE-FOOLScrapers');
const amznScraper = require('../AMZN/AMZN-FOOLScapers');

const scrapeNVDA = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--disable-http2',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-features=NetworkService,NetworkServiceInProcess',
        ]
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    try {
        const URLs = await nvdaScrape.scrapeURLs(page);
        const allContent = [];
        for (let { href, title } of URLs) {
            console.log(`Scraping content from: ${href}`);
            try 
            {
                const content = await nvdaScrape.scrapeContentFromURL(page, href);
                if(title)
                {
                    allContent.push({ url: href, title, content });
                }
            } catch (error) {
                console.error(`Error scraping content from ${href}:`, error);
                allContent.push({ url: href, title, content: 'Error fetching content' });
            }
        }
        return allContent;
    } catch (error) {
        console.error('Error scraping all content:', error);
        throw error;
    } finally {
        await browser.close();
    }
};

const scrapeTSLA = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--disable-http2',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-features=NetworkService,NetworkServiceInProcess',
        ]
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    try {
        const URLs = await tslaScraper.scrapeURLs(page);
        const allContent = [];
        for (let { href, title } of URLs) {
            console.log(`Scraping content from: ${href}`);
            try 
            {
                const content = await tslaScraper.scrapeContentFromURL(page, href);
                if(title)
                {
                    allContent.push({ url: href, title, content });
                }
            } catch (error) {
                console.error(`Error scraping content from ${href}:`, error);
                allContent.push({ url: href, title, content: 'Error fetching content' });
            }
        }
        return allContent;
    } catch (error) {
        console.error('Error scraping all content:', error);
        throw error;
    } finally {
        await browser.close();
    }
};

const scrapePLTR = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--disable-http2',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-features=NetworkService,NetworkServiceInProcess',
        ]
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    try {
        const URLs = await pltrScraper.scrapeURLs(page);
        const allContent = [];
        for (let { href, title } of URLs) {
            console.log(`Scraping content from: ${href}`);
            try 
            {
                const content = await pltrScraper.scrapeContentFromURL(page, href);
                if(title)
                {
                    allContent.push({ url: href, title, content });
                }
            } catch (error) {
                console.error(`Error scraping content from ${href}:`, error);
                allContent.push({ url: href, title, content: 'Error fetching content' });
            }
        }
        return allContent;
    } catch (error) {
        console.error('Error scraping all content:', error);
        throw error;
    } finally {
        await browser.close();
    }
};

const scrapeAMD = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--disable-http2',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-features=NetworkService,NetworkServiceInProcess',
        ]
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    try {
        const URLs = await amdScraper.scrapeURLs(page);
        const allContent = [];
        for (let { href, title } of URLs) {
            console.log(`Scraping content from: ${href}`);
            try 
            {
                const content = await amdScraper.scrapeContentFromURL(page, href);
                if(title)
                {
                    allContent.push({ url: href, title, content });
                }
            } catch (error) {
                console.error(`Error scraping content from ${href}:`, error);
                allContent.push({ url: href, title, content: 'Error fetching content' });
            }
        }
        return allContent;
    } catch (error) {
        console.error('Error scraping all content:', error);
        throw error;
    } finally {
        await browser.close();
    }
};

const scrapeAPPLE = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--disable-http2',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-features=NetworkService,NetworkServiceInProcess',
        ]
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    try {
        const URLs = await appleScraper.scrapeURLs(page);
        const allContent = [];
        for (let { href, title } of URLs) {
            console.log(`Scraping content from: ${href}`);
            try 
            {
                const content = await appleScraper.scrapeContentFromURL(page, href);
                if(title)
                {
                    allContent.push({ url: href, title, content });
                }
            } catch (error) {
                console.error(`Error scraping content from ${href}:`, error);
                allContent.push({ url: href, title, content: 'Error fetching content' });
            }
        }
        return allContent;
    } catch (error) {
        console.error('Error scraping all content:', error);
        throw error;
    } finally {
        await browser.close();
    }
};

const scrapeAMZN = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--disable-http2',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-features=NetworkService,NetworkServiceInProcess',
        ]
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    try {
        const URLs = await amznScraper.scrapeURLs(page);
        const allContent = [];
        for (let { href, title } of URLs) {
            console.log(`Scraping content from: ${href}`);
            try 
            {
                const content = await amznScraper.scrapeContentFromURL(page, href);
                if(title)
                {
                    allContent.push({ url: href, title, content });
                }
            } catch (error) {
                console.error(`Error scraping content from ${href}:`, error);
                allContent.push({ url: href, title, content: 'Error fetching content' });
            }
        }
        return allContent;
    } catch (error) {
        console.error('Error scraping all content:', error);
        throw error;
    } finally {
        await browser.close();
    }
};

module.exports = {
    scrapeNVDA,
    scrapeTSLA,
    scrapePLTR,
    scrapeAMD,
    scrapeAPPLE,
    scrapeAMZN
};