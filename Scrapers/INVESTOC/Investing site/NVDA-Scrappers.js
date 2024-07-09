const puppeteer = require('puppeteer');

const scrapeURLs = async (page) => {
  try {
    await page.goto("https://www.investing.com/equities/nvidia-corp", {
      waitUntil: "domcontentloaded",
      // timeout: 120000
    });
    const URLs = await page.evaluate(() => {
      const ScrapeList = document.querySelectorAll("ul[data-test='new-and-analysis-list'] a[data-test='article-title-link']");
      return Array.from(ScrapeList).map(Scrape => {
        let href = Scrape.getAttribute("href");
        let title = Scrape.innerText;
        if (!href.startsWith('http')) {
          href = `https://www.investing.com/analysis${href}`;
        }
        console.log(href , title);
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
  console.log("URLs--------------->" + url)
  
  try {
    console.log("OKKKKKKKKKKKKKKKKKKKKKKKKKKK----->1");
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 40000,
    });
    console.log("OKKKKKKKKKKKKKKKKKKKKKKKKKKK------->2");
    try{
      console.log("OKKKKKKKKKKKKKKKKKKKKKKKKKKK------->3");
        const content = await page.evaluate(() => {
        const ScrapeList = document.querySelectorAll(".article_container .article_WYSIWYG__O0uhw p");      
          return Array.from(ScrapeList).map(Scrape => Scrape.innerText);
        });
        return content.join(' ');
    }
    catch{
      console.error(`fe mo4kila fi  ${content}:`, error);
      throw error;
    }


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