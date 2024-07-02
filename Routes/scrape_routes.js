const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of scrapping"

// Require modules
const scrapeConrollers = require('../Controllers/scrapeAll_controller')


router.get('/cbc/scrapeall', scrapeConrollers.cbcScrapeAll);

router.get('/thestar/scrapeall', scrapeConrollers.thestarScrapeAll);

router.get('/collect', scrapeConrollers.Collect);


module.exports = router;
module.exports.msg = msg