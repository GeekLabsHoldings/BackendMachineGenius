const axios = require('axios');
require('dotenv').config();

const detectText = async (content) => {
    try {
        console.log('Sending request to GPTZero API...');
        const response = await axios.post('https://api.gptzero.me/v2/predict/text', {
            api_key: process.env.GPTZERO_API_KEY,
            "session_id": 'test session',
            text: content
        });
        
        if (response.data.success) {
            return response.data.result;
        } else {
            console.error('API Error:', response.data.error);
            throw new Error(response.data.error);
        }
    } catch (error) {
        console.error("Error detecting content:", error);
        throw error;
    }
};

const checkAi = async (req, res) => {
    try {
        const document = req.body.document;  // Ensure 'document' is the key in the request body
        if (!document || typeof document !== 'string') {
            return res.status(400).json({ success: false, error: 'Document must be a string' });
        }

        if (document.length < 1 || document.length > 50000) {
            return res.status(400).json({ success: false, error: 'Document length must be between 1 and 50000 characters' });
        }

        const resultList = [];

        try {
            const result = await detectText(document);
            console.log("result-->" , result)
            resultList.push({ result });
        } catch (error) {
            if (error.message.includes('usage threshold')) {
                return res.status(429).json({ success: false, error: 'Rate limit exceeded. Please try again later or upgrade your plan.' });
            }
            console.error('Error checking AI:', error);
            resultList.push({ text: document, errors: 'Error checking AI' });
        }

        res.json({ success: true, result: resultList });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    checkAi
};
