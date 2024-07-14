const axios = require('axios');
require('dotenv').config();

const detectText = async (content) => {
    try {
        console.log('Sending request to GPTZero API...');
        const response = await axios.post(
            'https://api.gptzero.me/v2/predict/text',
            {
                document: content,
                version: '2024-01-09',
                multilingual: false
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.GPTZERO_API_KEY
                }
            }
        );

        console.log('API Response:', response.data);

        if (response.data.documents && response.data.documents.length > 0) {
            return response.data;
        } else {
            throw new Error('No documents found in API response');
        }
    } catch (error) {
        console.error("Error detecting content:", error.response ? error.response.data : error.message);
        throw error;
    }
};

const checkAi = async (req, res) => {
    try {
        const document = req.body.document;
        if (!document || typeof document !== 'string') {
            return res.status(400).json({ success: false, error: 'Document must be a string' });
        }

        if (document.length < 1 || document.length > 50000) {
            return res.status(400).json({ success: false, error: 'Document length must be between 1 and 50000 characters' });
        }

        try {
            const result = await detectText(document);
            res.json(result); // Returning the API response directly
        } catch (error) {
            console.error('Error checking AI:', error);
            res.status(500).json({ success: false, error: 'Error checking AI' });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    checkAi
};
