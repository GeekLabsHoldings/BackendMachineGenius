const puppeteer = require('puppeteer');
const scriptScrape = require('./Scripts-Scraper');

const scrapeScript = async () => {
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
        // const URLs = await globalnewsScraper.scrapeURLs(page);
        const allContent = [];
        const href = "https://www.scripts.com/script/justice_league:_doom_11518"
        // for (let { href, title } of URLs) 
        {
            console.log(`Scraping content from: ${href}`);
            try 
            {
                const content = await scriptScrape.scrapeContentFromURL(page, href);
                // if(title && content)
                {
                        console.log({url:href})
                        allContent.push({ url: href , content });
                        var filteredAllContent = allContent.filter((url) => url != null);
                }
            } catch (error) {
                console.error(`Error scraping content from ${href}:`, error);
                filteredAllContent.push({ url: href, title, content: 'Error fetching content' });
            }
        }
        return filteredAllContent;
    } catch (error) {
        console.error('Error scraping all content:', error);
        throw error;
    } finally {
        await browser.close();
    }
};


module.exports = {
    scrapeScript
};