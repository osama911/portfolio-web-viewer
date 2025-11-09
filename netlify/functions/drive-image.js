const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Get the file ID from the query string
  const fileId = event.queryStringParameters.id;
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  if (!fileId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing file ID' })
    };
  }

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  try {
    // Fetch from Google Drive API
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
    const response = await fetch(driveUrl);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Failed to fetch image: ${response.statusText}` })
      };
    }

    // Get the image as a buffer
    const imageBuffer = await response.buffer();
    const contentType = response.headers.get('content-type');

    // Return the image with proper headers
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      },
      body: imageBuffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error fetching image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch image' })
    };
  }
};
