const express = require('express');
const bodyParser = require('body-parser');


const scrapeConrollers = require('./conrollers/scrape-all')
const generateConrollers = require('./conrollers/generate-content')

const app = express();
app.use(bodyParser.json());


app.get('/cbc/scrape-all', scrapeConrollers.cbcScrapeAll);

app.get('/thestar/scrape-all', scrapeConrollers.thestarScrapeAll);

app.get('/collect', scrapeConrollers.Collect);

app.get('/generate-content', generateConrollers.generateContent);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port http://localhost:" + process.env.PORT);
});
