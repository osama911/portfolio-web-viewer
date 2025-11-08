const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Proxy endpoint for Google Drive images
app.get('/drive-image/:fileId', async (req, res) => {
  const { fileId } = req.params;
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Fetch from Google Drive API
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
    const response = await fetch(driveUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch image: ${response.statusText}`
      });
    }

    // Get the content type from Drive response
    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Pipe the image data to the response
    response.body.pipe(res);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
