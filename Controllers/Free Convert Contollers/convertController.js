const multer = require('multer');
const axios = require('axios');
const dotenv = require('dotenv');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const transcribtController = require('../OpenAi Controllers/transcriptContent_controller');
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');  // Ensure the field name is 'file'

const convertor = async (req, res) => {
    const videoDuration = parseInt(req.body.duration);  // Get video duration from user input
  
    if (isNaN(videoDuration) || videoDuration <= 0) {
      return res.status(400).send('Invalid video duration provided.');
    }
  
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).send('No file uploaded.');
    }
  
    const segmentDuration = 10; // Segment duration in seconds 
    const totalSegments = Math.ceil(videoDuration / segmentDuration);
  
    const promises = [];
    const transcriptionResults = [];
  
    for (let i = 0; i < totalSegments; i++) {
      const cutStart = i * segmentDuration;
      const cutEnd = Math.min((i + 1) * segmentDuration, videoDuration);
  
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
              "cut_start": `00:00:${cutStart.toString().padStart(2, '0')}`,
              "cut_end": `00:00:${cutEnd.toString().padStart(2, '0')}`
            }
          },
          "export-1": {
            "operation": "export/url",
            "input": [
              "convert-1"
            ]
          }
        }
      };
  
      promises.push(processFile(inputBody, req.file, i + 1, cutStart, cutEnd, transcriptionResults));
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

async function processFile(inputBody, file, index, cutStart, cutEnd, transcriptionResults) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.FREECONVERT_API_KEY}`
    };
  
    try {
      // Step 1: Create a job
      const createJobResponse = await axios.post('https://api.freeconvert.com/v1/process/jobs', inputBody, { headers });
      const jobId = createJobResponse.data.id;
  
      console.log('Create Job Response:', createJobResponse.data);
  
      const importTask = createJobResponse.data.tasks.find(task => task.name === 'import-1');
      if (!importTask || !importTask.result) {
        console.error('Missing import-1 result:', createJobResponse.data);
        throw new Error('An error occurred: Missing import-1 result.');
      }
  
      const uploadUrl = importTask.result.form.url;
      const uploadParams = importTask.result.form.parameters;
  
      // Step 2: Upload the file
      const formData = new FormData();
      for (const key in uploadParams) {
        formData.append(key, uploadParams[key]);
      }
      formData.append('file', file.buffer, file.originalname);
  
      await axios.post(uploadUrl, formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
  
      let jobStatus = 'processing';
      let downloadUrl;
      while (jobStatus === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
        const statusResponse = await axios.get(`https://api.freeconvert.com/v1/process/jobs/${jobId}`, { headers });
        jobStatus = statusResponse.data.status;
        console.log(`Job status: ${jobStatus}`);
        if (jobStatus === 'completed') {
          const exportTask = statusResponse.data.tasks.find(task => task.name === 'export-1');
          if (exportTask && exportTask.result && exportTask.result.url) {
            downloadUrl = exportTask.result.url;
          } else {
            console.error('Missing export-1 result:', statusResponse.data);
            throw new Error('An error occurred: Missing export-1 result.');
          }
        }
      }
  
      if (jobStatus === 'completed' && downloadUrl) {
        const fileResponse = await axios.get(downloadUrl, { responseType: 'stream' });
        const filePath = path.join('/tmp', `converted_part${index}.mp3`);

        // Ensure the directory exists
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        const writer = fs.createWriteStream(filePath);
        fileResponse.data.pipe(writer);
  
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
  
        // Transcribe the file
        const transcription = await transcribtController.transcribeFile(filePath);
        transcriptionResults.push({ part: index, "time duration": `${cutStart}:${cutEnd}`, transcription });
  
        return { message: `File part ${index} saved successfully`, filePath };
  
      } else {
        throw new Error('An error occurred during file conversion.');
      }
  
    } catch (error) {
      console.error('Error during file conversion:', error.response ? error.response.data : error.message, error.stack);
      throw new Error('An error occurred during file conversion.');
    }
}

module.exports = {
    convertor
}
