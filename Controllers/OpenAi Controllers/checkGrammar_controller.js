const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const checkGrammarErrors = async (content) => {
    try {
        // console.log("------->" + content.userContent);
        const prompt = `Check the following text for grammar errors and provide the corrected version. Indicate the errors found and show the corrected text after that. Format your response as follows:\n\nErrors:\n<list of errors>\n\nCorrected Text:\n<corrected text>\n\nText:\n\n${content.userContent}`;
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: prompt },
            ]
        });

        const result = completion.choices[0].message.content.trim();
        const [errorsPart, correctedPart] = result.split('Corrected Text:');
        const errors = errorsPart.replace('Errors:', '').trim();
        const correctedText = correctedPart.trim();

        return {
            errors,
            correctedText
        };
    } catch (error) {
        console.error("Error generating title and content:", error);
        throw error;
    }
};

const check = async (req, res) => {
    // console.log("Received request data:", req.body);
    try {
        const userContent = req.body;  // Ensure 'content' is the key in the request body
        if (!userContent) {
            return res.status(400).json({ success: false, error: 'No content provided' });
        }

        const errorList = [];

        try {
            const { errors, correctedText } = await checkGrammarErrors(userContent);
            errorList.push({ originalText: userContent.userContent, errors, correctedText });
        } catch (error) {
            console.error('Error checking grammar:', error);
            errorList.push({ originalText: userContent.userContent, errors: 'Error checking grammar', correctedText: '' });
        }

        res.json({ success: true, result: errorList });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    check
};
