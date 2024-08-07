const OpenAI = require('openai');
require('dotenv').config();
const axios = require('axios');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateTitleAndArticles = async (articles) => {
    try {
        const articlesTitles = articles.map((article, index) => `Title: ${article.title}`).join('\n\n');
        // Create a detailed prompt explaining the task
        const prompt = `
            You are given a list of article titles. Your task is to group these titles that talk about same news or event under general and suitable headings and provide a title for each group. Also, return any titles that do not fit into any group separately.
            
            Here are the article titles:
            
            ${articlesTitles}
            
            Please group the articles under suitable general titles and identify articles that do not fit into any group.
            
            Return the result in the following format:
            
            1. General Title: [General title here]
                - Title: [Article title here]
                - Title: [Article title here]
            
            2. General Title: [General title here]
                - Title: [Article title here]
                - Title: [Article title here]
            
            3. General Title: Not Related to Each Other:
                - Title: [Article title here]
                - Title: [Article title here]
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
        const sections = result.split(/\d+\.\s*General Title:\s*/).map(section => section.trim()).filter(section => section);

       
        const structuredResults = sections.map(section => {
            const articleJson = []
            const lines = section.split('\n').map(line => line.trim()).filter(line => line);
            const generalTitle = lines[0].replace('General Title: ', '').trim();
            const articleTitles = lines.slice(1).map(line => line.replace('- Title: ', '').trim());

            for (let i = 0; i < articleTitles.length; i++) {
                
                for (let j = 0; j < articles.length; j++) {
                    
                    if (articleTitles[i] == articles[j].title) {
                        articleJson.push(articles[j])
                    }   
                }
            }

            return {
                generalTitle,
                articleJson
            };
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
        const brandName = req.body.brandName;
        const stockName = req.body.stockName;

        if (!brandName) {
            return res.status(400).json({ success: false, error: 'No brand Name provided' });
        }

        let scrapeResponse;

        if (stockName) {
            scrapeResponse = await axios.get(`http://localhost:${process.env.PORT}/collect/${brandName}/${stockName}`);
        } else {
            scrapeResponse = await axios.get(`http://localhost:${process.env.PORT}/collect/${brandName}`);
        }

        const scrapeData = scrapeResponse.data;

        if (!scrapeData.success) {
            return res.status(500).json({ success: false, error: 'Error fetching scraped content' });
        }

        const allArticles = scrapeData.allArticles;
        const organizedArticles = await generateTitleAndArticles(allArticles);

        res.json({ success: true, organizedArticles });
    } catch (error) {
        console.error("Error in generateContent:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    generateContent
}