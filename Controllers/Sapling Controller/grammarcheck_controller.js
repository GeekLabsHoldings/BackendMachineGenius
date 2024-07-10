require('dotenv').config();
const axios = require('axios');

const checkGrammar = async (text) => {
    try {
        const response = await axios.post('https://api.sapling.ai/api/v1/edits', {
            key: process.env.SAPLING_API_KEY,
            "session_id": 'test session',
            text: text
        });

        if (response.data && response.data.edits) {
            return response.data.edits;
        } else {
            console.error('API Error:', response.data.error);
            throw new Error(response.data.error);
        }
    } catch (error) {
        console.error('Error checking grammar:', error);
        throw error;
    }
};

const checkTextGrammar = async (req, res) => {
    try {
        const document = req.body.document;  // Ensure 'document' is the key in the request body
        if (!document) {
            return res.status(400).json({ success: false, error: 'No content provided' });
        }

        const grammarIssues = await checkGrammar(document);

        res.json({ success: true, grammarIssues });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    checkTextGrammar
};
