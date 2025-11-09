# Google Drive Image Proxy Setup

This project uses a proxy to fetch images from Google Drive and bypass CORS restrictions.

## How It Works

Google Drive has strict CORS policies that prevent direct embedding of images in web applications. To solve this, we use a proxy that:

1. **Local Development**: Uses a Node.js Express server running on `localhost:3001`
2. **Production (Netlify)**: Uses Netlify Functions (serverless functions)

## Local Development

### Starting the Development Environment

You need to run TWO servers:

1. **React Dev Server** (port 3000):
   ```bash
   npm start
   ```

2. **Proxy Server** (port 3001):
   ```bash
   npm run proxy
   ```

Or run them in separate terminal windows:
```bash
# Terminal 1
npm start

# Terminal 2
node proxy-server.js
```

## Deployment to Netlify

### Setup Steps

1. **Add Environment Variable**:
   - Go to Netlify Dashboard > Your Site > Site settings > Environment variables
   - Add: `REACT_APP_GOOGLE_API_KEY` with your Google API key

2. **Deploy**:
   - The `netlify.toml` file is already configured
   - The Netlify Function is in `netlify/functions/drive-image.js`
   - Just push to your git repository and Netlify will automatically deploy

### How the Proxy Detects Environment

The code in `src/App.js` automatically detects whether you're running locally or in production:

```javascript
const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

if (isLocalDev) {
  // Use http://localhost:3001/drive-image/:fileId
} else {
  // Use /.netlify/functions/drive-image?id=:fileId
}
```

## Files Involved

- `proxy-server.js` - Local Express proxy server
- `netlify/functions/drive-image.js` - Netlify serverless function
- `netlify.toml` - Netlify configuration
- `src/App.js` - React app with dynamic URL detection

## Troubleshooting

### Images not loading locally?
- Make sure the proxy server is running on port 3001
- Check that `.env` file has the `REACT_APP_GOOGLE_API_KEY`

### Images not loading on Netlify?
- Check that environment variable is set in Netlify Dashboard
- Check the Netlify Functions logs for errors
- Ensure Google Drive files are shared as "Anyone with the link"
