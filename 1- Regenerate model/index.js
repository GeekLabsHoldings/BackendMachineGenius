const axios = require('axios');
require('dotenv').config();

const runPrompt = async () => {
  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = `
    write me a joke about a cat and a bowl of pasta. Return response in the following parsable JSON format:

    {
      "Q": "question",
      "A": "answer"
    }
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const parsableJSONresponse = response.data.choices[0].message.content.trim();

    // Ensure the response is valid JSON
    const parsedResponse = JSON.parse(parsableJSONresponse);

    console.log("Question: ", parsedResponse.Q);
    console.log("Answer: ", parsedResponse.A);
  } catch (error) {
    console.error("Error during OpenAI API call:", error.response ? error.response.data : error.message);
  }
};

runPrompt();
