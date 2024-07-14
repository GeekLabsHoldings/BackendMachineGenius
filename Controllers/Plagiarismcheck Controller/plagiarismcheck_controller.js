const axios = require('axios');
require('dotenv').config();

const detectText = async (text) => {
    try {
        const apiUrl = 'https://plagiarismcheck.org/api/v1/text';

        const headers = {
            'X-API-TOKEN': process.env.PLAGIARISM_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded'
            // Add any additional headers as required by the API
        };

        const data = new URLSearchParams();
        data.append('text', text);
        // Add other required parameters here if specified by the API

        console.log('Sending request to PlagiarismCheck API...');
        const response = await axios.post(apiUrl, data, { headers });

        console.log('API Response:', response.data);

        return response.data;
    } catch (error) {
        console.error('Error checking plagiarism:', error.response ? error.response.data : error.message);
        throw error;
    }
};


const checkPlagiarism = async (req, res) => {
    try {
        const text = req.body.text; // Adjusted to 'text' field
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ success: false, error: 'Text must be a string' });
        }

        if (text.length < 90 || text.length > 50000) {
            return res.status(400).json({ success: false, error: 'Text length must be between 90 and 50000 characters' });
        }

        try {
            const result = await detectText(text);
            res.json(result); // Returning the API response directly
        } catch (error) {
            console.error('Error checking plagiarism:', error);
            res.status(500).json({ success: false, error: 'Error checking plagiarism' });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    checkPlagiarism
};
