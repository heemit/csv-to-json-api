const express = require('express');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const parseCsv = require('./parseCsv');
const uploadUsers = require('./uploadService');
const printAgeDistribution = require('./reportService');

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => res.send('CSV to JSON API is running.'));

// Upload via environment CSV path
app.get('/upload', async (req, res) => {
  try {
    const users = await parseCsv(process.env.CSV_FILE_PATH);
    await uploadUsers(users);
    await printAgeDistribution();
    res.send('Upload from file path completed.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong.');
  }
});

// Upload via HTTP form
app.post('/upload-csv', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const users = await parseCsv(filePath);
    await uploadUsers(users);
    await printAgeDistribution();
    res.send('CSV uploaded and processed successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('CSV upload failed.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
