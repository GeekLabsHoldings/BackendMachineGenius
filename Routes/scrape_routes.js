const express = require('express')
const router = express.Router()
const msg = "This module to handle the request and response of scrapping"

// Require modules
const scrapeConrollersSTP = require('../Controllers/Scraping Controllers/scrapeStreetPolitics_controller')
const scrapeConrollersINV = require('../Controllers/Scraping Controllers/scrapeINVEST_controller')


router.get('/cbc/scrapeall', scrapeConrollersSTP.cbcScrapeAll);
router.get('/thestar/scrapeall', scrapeConrollersSTP.thestarScrapeAll);
router.get('/collect/STP', scrapeConrollersSTP.Collect);

//////////////

router.get('/collect/INV', scrapeConrollersINV.Collect);

module.exports = router;
module.exports.msg = msg