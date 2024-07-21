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
            var prompt = `Write a stock-market-centered article that is at least 1700 words, using a tone that is human, engaging, professional, and direct. The article needs to be written from a third point of view. Maintain a professional, direct tone. it needs to be divided into three parts.
            1. Intro:
                - Needs to begin with a hooking statement about attention-grabbing news. It needs to be something unique and viral in the stock market.
                - Don’t reveal all the details of the news in this section. Give a vague introduction of the topic with a word limit of a maximum of 200 words.
                - Be straight to the point, start talking about the news right away.
                - Make sure to mention the leading companies/figures mentioned in the article in the intro.
            2. Body:
                - Keep it in third person point of view.
                - Keep it engaging by throwing in one or two sarcastic jokes about the stock market and the stock that article talking about .
                - Weave in conspiracy theories related to the topic being discussed.
                - Maintain a conversational style, as if entertaining another human with the latest news while keeping a serious undertone.
                - Back all the statements you give with proven data to elaborate more on the news.
                - Analyze the tweets provided and use them to back up the statements you include.
            3. Outro:
                - Wrap up the article with a persuasive statement to convince the reader to invest in the stock that article talking about .
                - Talk about the current state of the stock that article talking about , and include forecasts predicting its growth.
                - Highlight the current position of the stock that article talking about stock.
                - End the article with an engaging statement to ask about the reader’s opinions about the topic.
                - Maintain a professional, yet conversational manner.`
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
