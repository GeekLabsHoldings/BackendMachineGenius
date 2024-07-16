const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateTitleAndContent = async (content , myPrompt) => {
    try {
      console.log("------->"+content)
        const prompt = `${myPrompt} Here's the articles: \n\n${content}`;
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
        console.error("Error generating title and content:", error);
        throw error;
    }
};

const generateContent = async (req, res) => {
    try {
        const {selectedContent , brandName} = req.body;
        if (!selectedContent || !brandName) {
            return res.status(400).json({ success: false, error: 'No content or brand name provided' });
        }
        if(brandName == "StreetPolitics")
        {
            var prompt = `Write a youtube video script in third person that is at least 1700-word script that reads like it was written by a human,keep in your mind that we stand with
                        Donald Trump against Joe Biden, following these detailed guidelines:
                        1. Introduction:
                            - Start with a shocking and attention-grabbing piece of news.
                            - Make the intro engaging and impactful to draw in the viewer, but avoid revealing all the details immediately.
                            - write it in at least 200 words
                            - Keep it starting with the shock value news directly
                            - make it mentioning the breaking news but not giving away all the info
                        2. Body of the Script:
                            - make it in third person.
                            - Include several sarcastic jokes about liberals.
                            - Weave in conspiracy theories related to the topic being discussed.
                            - Maintain a conversational style, as if entertaining another human with the latest news while keeping a serious undertone.
                        3. Tone:
                            - Adopt a right-leaning perspective, especially when discussing criticism of Pierre Poilievre or the conservatives.
                            - Defend Poilievre and make fun of Justin Trudeau and the liberals.`
        }
        if(brandName == "Investocracy")
        {
            var prompt = `Write a video script that is at least 1700-word script that reads like it was written by a human, following these detailed guidelines:
                        1. Introduction:
                            - Start with a shocking and attention-grabbing piece of news.
                            - Make the intro engaging and impactful to draw in the viewer, but avoid revealing all the details immediately.
                            - write it in at least 200 words
                            - Keep it starting with the shock value news directly
                            - make it mentioning the breaking news but not giving away all the info
                        2. Body of the Script:
                            -  make it in third person.
                            - Use an engaging tone throughout, but don't make a lot of jokes.
                            - Maintain a conversational style, as if entertaining another human with the latest news while keeping a serious undertone.
                        3. Tone:
                            - Adopt a perspective that's bullish on the stock.
                            - Encourage investors to buy the stock`
        }
        const finalArticles = [];
        try {         
            const { title, content } = await generateTitleAndContent(selectedContent , prompt);
            finalArticles.push({ title, content });
        } catch (error) {
            console.error('Error generating title and content:', error);
            finalArticles.push({ title: 'Error generating title', content: 'Failed to process content' });
        }

        res.json({ success: true, articles: finalArticles });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    generateContent
};
