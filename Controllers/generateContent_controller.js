const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateTitleAndArticles = async (articles) => {
    try {
        const articlesTitles = articles.map((article, index) => `Title: ${article.title}`).join('\n\n');
        console.log(articles)
        // Create a detailed prompt explaining the task
        const prompt = `
            You are given a list of article titles. Your task is to group these titles under general and suitable headings and provide a title for each group. Also, return any titles that do not fit into any group separately.
            
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
            
            3. Titles Not Related to Each Other:
                - Title: [Article title here]
                - Title: [Article title here]
        `;

        // Send the prompt to OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: prompt.trim() },
            ],
        });

        // Extract the response and format it
        const result = completion.choices[0].message.content.trim();

        
        const sections = result.split(/\d+\.\s*General Title:\s*/).map(section => section.trim()).filter(section => section);

       
        const structuredResults = sections.map(section => {
            const articleOpj = []
            const lines = section.split('\n').map(line => line.trim()).filter(line => line);
            const generalTitle = lines[0].replace('General Title: ', '').trim();
            const articleTitles = lines.slice(1).map(line => line.replace('- Title: ', '').trim());

            for (let i = 0; i < articleTitles.length; i++) {
                
                for (let j = 0; j < articles.length; j++) {
                    
                    if (articleTitles[i] == articles[j].title) {
                        articleOpj.push(articles[j])
                    }   
                }
            }

            

            console.log(articleTitles.length)
            return {
                generalTitle,
                articleOpj
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
