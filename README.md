# Portfolio Web Viewer

A standalone web application for displaying portfolio profiles in read-only mode. This viewer fetches portfolio data from Google Drive and displays it with a beautiful, responsive layout.

## Features

- Fetches portfolio data from Google Drive using a file ID
- Displays profile information: name, title, bio, avatar, and header background
- Shows contact links with icons
- Organizes projects into categories
- Supports both images and videos for project media
- Fully responsive design for desktop and mobile
- Read-only mode (no editing capabilities)
- Clean, modern UI matching mobile app design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd portfolio-web-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Usage

The application reads portfolio data from a Google Drive file. The URL format is:

```
https://yourdomain.com/?id=DRIVE_FILE_ID
```

### Preparing Your Portfolio Data

1. Create a JSON file with your portfolio data following this structure:

```json
{
  "name": "Your Name",
  "title": "Your Title",
  "bio": "Your bio text",
  "avatarUrl": "URL to your avatar image",
  "headerBackgroundImage": "URL to header background (optional)",
  "headerBackgroundColor": "#6200ea (optional, used if no image)",
  "contactLinks": [
    {
      "label": "Link Label",
      "url": "https://...",
      "icon": "emoji or text"
    }
  ],
  "categories": [
    {
      "name": "Category Name",
      "description": "Category description",
      "projects": [
        {
          "title": "Project Title",
          "description": "Project description",
          "mediaUrl": "URL to image or video",
          "mediaType": "image or video",
          "thumbnailUrl": "URL to thumbnail (for videos)",
          "links": [
            {
              "label": "Link Label",
              "url": "https://..."
            }
          ]
        }
      ]
    }
  ]
}
```

2. Upload this JSON file to Google Drive
3. Make the file publicly accessible:
   - Right-click the file → Share → Change to "Anyone with the link"
   - Set permission to "Viewer"
4. Copy the file ID from the shareable link
   - The link looks like: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
   - Copy the `FILE_ID` portion

### Testing Locally

A sample portfolio JSON file is included at `public/sample-portfolio.json`. To test locally:

```
http://localhost:3000/?id=sample-portfolio.json
```

Note: For local testing, use the filename. For production, use the Google Drive file ID.

## Deployment to GitHub Pages

### Step 1: Update package.json

Edit the `homepage` field in `package.json` to match your GitHub repository:

```json
{
  "homepage": "https://your-username.github.io/your-repo-name"
}
```

If you want to use a custom domain later, you can set:

```json
{
  "homepage": "https://myportfolio-web.com"
}
```

### Step 2: Install gh-pages

```bash
npm install
```

The `gh-pages` package is already included in devDependencies.

### Step 3: Deploy

```bash
npm run deploy
```

This command will:
1. Build your app for production
2. Create a `gh-pages` branch (if it doesn't exist)
3. Push the built files to the `gh-pages` branch

### Step 4: Enable GitHub Pages

1. Go to your GitHub repository
2. Click on "Settings"
3. Scroll down to "Pages" section
4. Under "Source", select the `gh-pages` branch
5. Click "Save"

Your site will be live at: `https://your-username.github.io/your-repo-name/`

### Step 5: Share Your Portfolio

Share your portfolio using this URL format:

```
https://your-username.github.io/your-repo-name/?id=DRIVE_FILE_ID
```

Replace `DRIVE_FILE_ID` with the actual Google Drive file ID.

## Custom Domain Setup

To use a custom domain (e.g., myportfolio-web.com):

1. Create a file named `CNAME` in the `public` folder
2. Add your custom domain to the file:
```
myportfolio-web.com
```

3. Update the `homepage` in `package.json`:
```json
{
  "homepage": "https://myportfolio-web.com"
}
```

4. Configure your domain's DNS settings:
   - Add a CNAME record pointing to `your-username.github.io`
   - Or add A records pointing to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

5. In your GitHub repository settings under "Pages", add your custom domain

6. Redeploy:
```bash
npm run deploy
```

After DNS propagation (can take up to 24 hours), your portfolio will be accessible at:

```
https://myportfolio-web.com/?id=DRIVE_FILE_ID
```

## Portfolio Data Structure Reference

### Required Fields
- `name`: User's full name
- `categories`: Array of project categories

### Optional Fields
- `title`: Professional title or tagline
- `bio`: Biography or description
- `avatarUrl`: URL to profile picture
- `headerBackgroundImage`: URL to header background image
- `headerBackgroundColor`: Hex color code (fallback if no image)
- `contactLinks`: Array of contact/social links

### Project Fields
- `title`: Project name
- `description`: Project description
- `mediaUrl`: URL to project image or video
- `mediaType`: "image" or "video"
- `thumbnailUrl`: Video thumbnail (optional, for video projects)
- `links`: Array of external links (GitHub, live demo, etc.)

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm run deploy`
Builds and deploys the app to GitHub Pages

### `npm test`
Launches the test runner

## Technology Stack

- React 19
- Create React App
- CSS3 with responsive design
- Google Drive API for data fetching

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Portfolio not loading
- Verify the Google Drive file is publicly accessible
- Check that the file ID in the URL is correct
- Ensure the JSON file is properly formatted

### Videos not playing
- Make sure the video URL is a direct link to the video file
- Ensure the video format is supported by browsers (MP4, WebM)
- Check that the video file is publicly accessible

### Deployment issues
- Ensure you've committed all changes before deploying
- Verify the `homepage` field in package.json is correct
- Check that the `gh-pages` branch was created successfully

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.
