const { sequelize, Script } = require("../../Models/Scripts/scripts_model");
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const recapContent = async (myPrompt) => {
    try {
        const prompt = `${myPrompt}`;
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "user", content: prompt },
            ]
        });

        const result = completion.choices[0].message.content.trim();
        const [title, ...newContent] = result.split('\n');
        return {
            title: title.replace("Title: ", "").trim(),
            content: newContent.join(' ').trim()
        };
    } catch (error) {
        console.error("Error generating recap:", error);
        throw error;
    }
};

const generateContent = async (req, res) => 
{
    try {
        const { movieName } = req.body;
        if (!movieName) {
            return res.status(400).json({ success: false, error: 'No Movie name provided' });
        }

        let prompt = '';
            prompt = `write a movie recap of ${movieName} 
            write it in detail, giving me a scence by scene explation of the movie`;
        const finalArticles = [];
        try {         
            const { title, content } = await recapContent(prompt);
            finalArticles.push({ title, content });
        } catch (error) {
            console.error('Error generating title and content:', error);
            finalArticles.push({ title: 'Error generating title', content: 'Failed to process content' });
        }
        
        res.json({ success: true, recap: finalArticles });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    generateContent
};
