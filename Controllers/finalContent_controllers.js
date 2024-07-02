const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateTitleAndContent = async (content) => {
    try {
      const prompt = `Read and regenerate this content in 30 lines and create a main title for this, please keep in your mind the politics and the latest news in this content:\n\n${content}`;
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
      const selectedContent = req.body;
  
      const finalArticles = []
      if (!selectedContent) {
        return res.status(500).json({ success: false, error: 'Error get selected content' });
      }

      try 
      {
        const { title, content } = await generateTitleAndContent(finalArticles.join(' '));
        finalArticles.push({ title, content });
      }
      catch (error)
      {
        console.error(`Error generating title and content for content `, error);
        finalArticles.push( 'Error generating title' );
      }
  
      res.json({ success: true, articles: finalArticles });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
}


module.exports = {
    generateContent
}

