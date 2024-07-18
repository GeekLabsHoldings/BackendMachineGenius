const puppeteer = require('puppeteer');

const scrapeURLs = async (page , url) => {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 280000
  });

  await page.waitForSelector('article');

  async function autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 70);
      });
    });
  }

  await autoScroll(page);

  const URLs = await page.evaluate(() => {
    const ScrapeList = document.querySelectorAll('article a[href*="/status/"]');
    return Array.from(ScrapeList).slice(0, 40).map(Scrape => {
      let href = Scrape.getAttribute("href");
      let title = Scrape.innerText;
      if (!href.startsWith('http')) {
        href = `https://x.com${href}`;
      }
      return { href, title };
    });
  });

  return URLs;
};

const scrapeContentFromURL = async (browser, urls) => {
  const page = await browser.newPage();
  const tweetContents = [];

  for (const { href } of urls) {
    await page.goto(href, {
      waitUntil: "domcontentloaded",
      timeout: 280000 
    });
    await page.waitForSelector('article');

    const content = await page.evaluate(() => {
      const tweetElement = document.querySelector('article');
      return tweetElement ? tweetElement.innerText : null;
    });

    if (content && content.includes("$NVDA")) {
      tweetContents.push({ href, content });
    }
  }
  return tweetContents;
};

module.exports = {
  scrapeURLs,
  scrapeContentFromURL
};
