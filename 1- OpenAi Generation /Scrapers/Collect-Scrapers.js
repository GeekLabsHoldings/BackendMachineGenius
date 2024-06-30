const puppeteer = require('puppeteer');
const cbcScrape = require('../Scrapers/CBC-Scraper');
const thestarScraper = require('../Scrapers/TheStar-Scraper');

const scrapeCBC = async () => {
    const URLs = await cbcScrape.scrapeURLs();
    const allContent = [];

    for (let url of URLs) {
        try {
            const content = await cbcScrape.scrapeContentFromURL(url);
            allContent.push({ url, content });
        } catch (error) {
            console.error(`Error scraping content from ${url}:`, error);
            allContent.push({ url, content: 'Error fetching content' });
        }
    }
    return allContent;
};

const scrapeTheStar = async () => {
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
        const URLs = await thestarScraper.scrapeURLs(page);
        const allContent = [];
        for (let { href, text } of URLs) {
            console.log(`Scraping content from: ${href}`);
            try {
                const content = await thestarScraper.scrapeContentFromURL(page, href);
                allContent.push({ url: href, text, content });
            } catch (error) {
                console.error(`Error scraping content from ${href}:`, error);
                allContent.push({ url: href, text, content: 'Error fetching content' });
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
    scrapeCBC,
    scrapeTheStar
};
