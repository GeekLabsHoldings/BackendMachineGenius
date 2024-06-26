const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

app.use(express.json());

// Function to scrape URLs and text from the main page
const scrapeURLs = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
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

  await browser.close();
  return URLs;
};

// Function to scrape content from a given URL
const scrapeContentFromURL = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const content = await page.evaluate(() => {
    const ScrapeList = document.querySelectorAll(".asset-content p");
    return Array.from(ScrapeList).map(Scrape => Scrape.innerText);
  });

  await browser.close();
  return content;
};

// API endpoint to scrape URLs and text
app.get('/scrape-urls', async (req, res) => {
  try {
    const URLs = await scrapeURLs();
    res.json({ success: true, URLs });
  } catch (error) {
    console.error('Error scraping URLs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to scrape URLs and then their content
app.get('/scrape-all', async (req, res) => {
  try {
    const URLs = await scrapeURLs();
    const allContent = [];

    for (let { href, text } of URLs) {
      console.log(`Scraping content from: ${href}`);

      const content = await scrapeContentFromURL(href);
      allContent.push({ url: href, text, content });
    }

    res.json({ success: true, allContent });
  } catch (error) {
    console.error('Error scraping all content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
