const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

const scrapeURLs = async () => {
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
  
  // Set a different user-agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  // Increase timeout to 60 seconds
  await page.setDefaultNavigationTimeout(60000);

  try {
    await page.goto("https://www.cbc.ca/news/politics", {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    const URLs = await page.evaluate(() => {
      const ScrapeList = document.querySelectorAll(".contentListCards a");
      return Array.from(ScrapeList).map((Scrape) => {
        let href = Scrape.getAttribute("href");
        if (!href.startsWith('http')) {
          href = `https://www.cbc.ca${href}`;
        }
        return href;
      });
    });

    await browser.close();
    return URLs;
  } catch (error) {
    await browser.close();
    console.error('Error during URL scraping:', error);
    throw error;
  }
};

const scrapeContentFromURL = async (url) => {
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

  // Set a different user-agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

  // Increase timeout to 60 seconds
  await page.setDefaultNavigationTimeout(60000);

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    const content = await page.evaluate(() => {
      const ScrapeList = document.querySelectorAll(".story p");
      return Array.from(ScrapeList).map((Scrape) => Scrape.innerText);
    });

    await browser.close();
    return content;
  } catch (error) {
    await browser.close();
    console.error(`Error during content scraping from ${url}:`, error);
    throw error;
  }
};

// Endpoint to scrape URLs
app.get('/scrape-urls', async (req, res) => {
  try {
    const URLs = await scrapeURLs();
    res.json({ success: true, URLs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to scrape content from a given URL
app.post('/scrape-content', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  try {
    const content = await scrapeContentFromURL(url);
    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to scrape URLs and then their content
app.get('/scrape-all', async (req, res) => {
  try {
    const URLs = await scrapeURLs();
    const allContent = [];

    for (let url of URLs) {
      try {
        const content = await scrapeContentFromURL(url);
        allContent.push({ url, content });
      } catch (error) {
        console.error(`Error scraping content from ${url}:`, error);
        allContent.push({ url, content: 'Error fetching content' });
      }
    }

    res.json({ success: true, allContent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
