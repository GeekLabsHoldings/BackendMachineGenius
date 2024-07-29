const OpenAI = require('openai');
const fs = require('fs');

// OpenAI integration
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const transcribeFile = async (filePath) => 
{
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        response_format: "text",
      });
  
      console.log("Transcription result:", transcription);
      return transcription;
    } catch (error) {
      console.error("Error during transcription:", error);
      throw new Error('An error occurred during transcription.');
    }
}

module.exports = {
    transcribeFile
}