const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = 3000;
app.use(express.json());
// Function to scrape URLs and text from the main page
const scrapeURLs = async (page) => {
  await page.goto('https://www.thestar.com/politics/', { waitUntil: 'domcontentloaded' });
  const URLs = await page.evaluate(() => {
    const ScrapeList = document.querySelectorAll(".tnt-has-block-bg a.tnt-asset-link");
    return Array.from(ScrapeList).map(Scrape => {
      let href = Scrape.getAttribute("href");
      const text = Scrape.innerText;
      if (!href.startsWith('http')) {
        href = `https://www.thestar.com${href}`;
      }
      return { href, text };
    });
  });
  return URLs;
};

// Function to scrape content from a given URL
const scrapeContentFromURL = async (page, url) => {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const content = await page.evaluate(() => {
    const ScrapeList = document.querySelectorAll(".asset-content p");
    return Array.from(ScrapeList).map(Scrape => Scrape.innerText);
  });
  return content;
};

// API endpoint to scrape URLs and text
app.get('/scrape-urls', async (req, res) => {
  const browser = await puppeteer.launch({
  });
  const page = await browser.newPage();
  try {
    const URLs = await scrapeURLs(page);
    res.json({ success: true, URLs });
  } catch (error) {
    console.error('Error scraping URLs:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await browser.close();
  }
});

// API endpoint to scrape URLs and then their content
app.get('/scrape-all', async (req, res) => {
  const browser = await puppeteer.launch({
  });
  const page = await browser.newPage();
  try {
    const URLs = await scrapeURLs(page);
    const allContent = [];
    for (let { href, text } of URLs) {
      console.log(`Scraping content from: ${href}`);
      try {
        const content = await scrapeContentFromURL(page, href);
        allContent.push({ url: href, text, content });
      } catch (error) {
        console.error(`Error scraping content from ${href}:`, error);
      }
    }
    res.json({ success: true, allContent });
  } catch (error) {
    console.error('Error scraping all content:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await browser.close();
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})