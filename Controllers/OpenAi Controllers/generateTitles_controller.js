const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateTitles = async (articles) => {
    try {
        const prompt = `
            You are given a content. Your task is generate at least 5 suitable General titles.
            
            Here are the Content:
            
            ${articles}
            
            Return the result in the following format:
            
            1. Title: [General title here]
            
            2. Title: [General title here]
        `;

        // Send the prompt to OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "user", content: prompt.trim() },
            ],
        });

        // Extract the response and format it
        const result = completion.choices[0].message.content.trim();

        console.log("Results-->"+result)
        const sections = result.split(/\d+\.\s* Title:\s*/).map(section => section.trim()).filter(section => section);

       
        const structuredResults = sections.map(section => {
            const lines = section.split('\n').map(line => line.trim()).filter(line => line);
            const generalTitle = lines[0].replace('General Title: ', '').trim();

            return generalTitle
        });

        // Return general titles as an array
        return structuredResults;
    } catch (error) {
        console.error("Error generating title and articles:", error);
        throw error;
    }
};

const generateContent = async (req, res) => {
    try {
        const myContent = req.body.content;
        if (!myContent) {
            return res.status(400).json({ success: false, error: 'No content provided' });
        }

        const generatedTitles = await generateTitles(myContent);

        res.json({ success: true, generatedTitles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    generateContent
}