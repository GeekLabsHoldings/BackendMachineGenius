const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateTitleAndArticles = async (articles) => {
    try {
        // Combining all articles into a single prompt
        const articlesContent = articles.map((article, index) => `Article ${index + 1}:\n\nURL: ${article.url}\n\nTitle: ${article.title}\n\nContent: ${article.content}`).join('\n\n');

        // Prompt to OpenAI for generating a main title and grouping articles by topic
        const prompt = `You are given multiple articles. Identify the articles that talk about the same topic and create a main title for each group. Format the response with a main title for each group followed by the list of articles. Each article should include its URL, title, and content. Here is the content:\n\n${articlesContent}`;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: prompt },
            ]
        });

        // The result will include titles and grouped articles
        const result = completion.choices[0].message.content.trim();
        return result;
    } catch (error) {
        console.error("Error generating title and articles:", error);
        throw error;
    }
};

const generateContent = async (req, res) => {
    try {
        const scrapeResponse = await fetch(`http://localhost:${process.env.PORT}/collect`);
        const scrapeData = await scrapeResponse.json();

        if (!scrapeData.success) {
            return res.status(500).json({ success: false, error: 'Error fetching scraped content' });
        }

        const allArticles = scrapeData.allArticles;
        const organizedArticles = await generateTitleAndArticles(allArticles);

        res.json({ success: true, organizedArticles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    generateContent
}
