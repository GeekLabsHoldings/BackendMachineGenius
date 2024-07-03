const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateTitleAndContent = async (content) => {
    try {
      const prompt = `remove duplicated and create suitable title for articles. content:\n\n${content}`;
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
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
      console.error("Error generating title and content:", error);
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
  
      const allContent = scrapeData.allContent;
      const articlesWithTitlesAndContent = [];
  
      for (const article of allContent) {
        try {
          const { title, content } = await generateTitleAndContent(article.article.join(' '));
          articlesWithTitlesAndContent.push({ title, content });
        } catch (error) {
          console.error(`Error generating title and content for content from ${article.url}:`, error);
          articlesWithTitlesAndContent.push({ url: article.url, title: 'Error generating title', content: 'Error generating content' });
        }
      }
  
      res.json({ success: true, articles: articlesWithTitlesAndContent });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    generateContent
}

