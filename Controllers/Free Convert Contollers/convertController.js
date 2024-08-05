const dotenv = require('dotenv');
const processFile = require('../../uploadToconvert/uploadFile');
const movie_dataBase = require("../../Models/Movies/movie_model");
const fs = require('fs');
const path = require('path');
dotenv.config();

const convertor = async (req, res) => {
  // console.log('File:', req.file); // Log the file object
    // console.log('Body:', req.body); // Log the body

  if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).send('No file uploaded.');
  }
  try {
    const videoDuration = parseInt(req.body.duration, 10);

    if (isNaN(videoDuration) || videoDuration <= 0) {
      return res.status(400).send('Invalid video duration provided.');
    }

    const filePath = path.join(__dirname, '../../uploads/movie.mp4');

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('FilePath not found.');
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const new_movie = new movie_dataBase({
      movie: fileName,
    });

    await new_movie.save();

    const segmentDuration = Math.ceil(videoDuration / 5);
    const totalSegments = Math.ceil(videoDuration / segmentDuration);

    const promises = [];
    const transcriptionResults = [];

    for (let i = 0; i < totalSegments; i++) {
      const cutStart = i * segmentDuration;
      const cutEnd = Math.min((i + 1) * segmentDuration, videoDuration);

      const cutStartFormatted = formatTime(cutStart);
      const cutEndFormatted = formatTime(cutEnd);

      const inputBody = {
        tasks: {
          "import-1": {
            operation: "import/upload",
          },
          "convert-1": {
            operation: "convert",
            input: "import-1",
            input_format: "mp4",
            output_format: "mp3",
            options: {
              video_audio_remove: false,
              cut_start: cutStartFormatted,
              cut_end: cutEndFormatted,
            },
          },
          "export-1": {
            operation: "export/url",
            input: ["convert-1"],
          },
        },
      };

      promises.push(
        processFile.prosessOnFile(
          inputBody,
          { buffer: fileBuffer, originalname: fileName },
          i + 1,
          cutStart,
          cutEnd,
          transcriptionResults
        )
      );
    }

    Promise.all(promises)
      .then(() => {
        res.status(200).send({
          message: 'Files uploaded, converted, and saved successfully',
          movie_url: 'https://backendmachinegenius.onrender.com/uploads/movie.mp4',
          transcriptionResults,
        });
      })
      .catch((error) => {
        console.error('Error during file conversion:', error);
        res.status(500).send('An error occurred during file conversion.');
      });
  } catch (error) {
    console.log(`${error}`);
    res.status(400).json({ message: 'There was an error: ' + error });
  }
};

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

module.exports = {
  convertor,
};
