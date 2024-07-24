const collectScrapers = require('../../Scrapers/Movie Myth/Collect-MythScrapers')

const Collect = async (req, res) => {
    try {
        const [scriptContent] = await Promise.all([
          collectScrapers.scrapeScript(),
        ]);
        const allContent_from_sites = [...scriptContent];
        res.json({ success: true, allArticles: allContent_from_sites });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    Collect
}
