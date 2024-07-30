const multer = require('multer');
const dotenv = require('dotenv');
const processFile = require('../../uploadToconvert/uploadFile')
dotenv.config();

const convertor = async (req, res) => {
  const videoDuration = parseInt(req.body.duration);  // Get video duration from user input to make operation on it 

  if (isNaN(videoDuration) || videoDuration <= 0) {
    return res.status(400).send('Invalid video duration provided.');
  }

  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).send('No file uploaded.');
  }

  const segmentDuration = 30; // Segment duration in seconds lazem belswanay 
  const totalSegments = Math.ceil(videoDuration / segmentDuration);

  const promises = [];
  const transcriptionResults = [];

  for (let i = 0; i < totalSegments; i++) {
    const cutStart = i * segmentDuration;
    const cutEnd = Math.min((i + 1) * segmentDuration, videoDuration);

    const cutStartFormatted = formatTime(cutStart);
    const cutEndFormatted = formatTime(cutEnd);

    const inputBody = {
        "tasks": {
            "import-1": {
                "operation": "import/upload"
            },
            "convert-1": {
                "operation": "convert",
                "input": "import-1",
                "input_format": "mp4",
                "output_format": "mp3",
                "options": {
                    "video_audio_remove": false,
                    "cut_start": cutStartFormatted,
                    "cut_end": cutEndFormatted
                }
            },
            "export-1": {
                "operation": "export/url",
                "input": ["convert-1"]
            }
        }
    };

    promises.push(processFile.prosessOnFile(inputBody, req.file, i + 1, cutStart, cutEnd, transcriptionResults));
}

  Promise.all(promises)
    .then(() => {
      res.status(200).send({ message: 'Files uploaded, converted, and saved successfully', transcriptionResults });
    })
    .catch(error => {
      console.error('Error during file conversion:', error);
      res.status(500).send('An error occurred during file conversion.');
    });
};

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

module.exports = {
    convertor
}
