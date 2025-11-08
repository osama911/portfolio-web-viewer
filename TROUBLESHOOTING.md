# Troubleshooting Guide - Portfolio Web Viewer

## Images and Videos Not Displaying

### Issue: Profile avatar, cover images, or project media not showing

**Root Cause:** Google Drive files must be publicly accessible for the web viewer to display them.

**Solution:**

1. **Make ALL files public** (not just the portfolio JSON):
   ```
   - Portfolio JSON file
   - Avatar image
   - Cover image
   - Background image
   - All category icons and covers
   - All project images
   - All project videos
   ```

2. **How to make a file public in Google Drive:**
   - Right-click the file → "Share"
   - Click "Change to anyone with the link"
   - Set permission to "Viewer"
   - Click "Done"

3. **Verify the file is public:**
   - Open an incognito/private browser window
   - Paste this URL: `https://drive.google.com/uc?export=view&id=YOUR_FILE_ID`
   - If you can see the image, it's public
   - If you get a permission error, repeat step 2

### Issue: Videos show "Video unavailable" or won't play

**Causes & Solutions:**

1. **File not public** - Follow steps above to make video file public

2. **Video format not supported:**
   - ✅ Supported: MP4 (H.264 codec), WebM
   - ❌ Not supported: MOV, AVI (must convert to MP4)
   - Use a tool like HandBrake or FFmpeg to convert

3. **Video file too large:**
   - Google Drive has bandwidth limits
   - Recommended: Keep videos under 50MB
   - Compress videos using online tools or video editors

4. **CORS issues:**
   - The viewer uses Google Drive's iframe preview for videos
   - If videos still don't play, the file might be restricted
   - Try re-uploading the video and making it public immediately

## Color Display Issues

### Issue: Colors not showing correctly or appearing as black/white

**Solution:**

The app expects colors in ARGB format (32-bit integer). Here's how to convert:

```javascript
// From hex color to ARGB integer
function hexToArgb(hex) {
  // Remove # if present
  hex = hex.replace('#', '');

  // Add full opacity if not present
  if (hex.length === 6) {
    hex = 'FF' + hex;
  }

  return parseInt(hex, 16);
}

// Examples:
hexToArgb('#6200ea')    // Returns: 4283215696
hexToArgb('#FF6200ea')  // Returns: 4283215696
hexToArgb('#FFFFFF')    // Returns: 4294967295 (white)
hexToArgb('#000000')    // Returns: 4278190080 (black)
```

**Common color values:**
- White: `4294967295`
- Black: `4278190080`
- Material Blue (#2196F3): `4283215696`
- Material Green (#4CAF50): `4285887861`
- Material Red (#F44336): `4294198070`

## Data Structure Issues

### Issue: Categories or projects not showing

**Check these fields:**

1. **Required fields must be present:**
   ```json
   {
     "name": "Required",
     "title": "Required",
     "bio": "Required",
     "email": "Required",
     "phone": "Required",
     "linkedInUrl": "Required",
     "categories": []  // Required (can be empty)
   }
   ```

2. **Category structure:**
   ```json
   {
     "id": "unique-id",        // Required
     "title": "Category Name",  // Required (note: "title" not "name")
     "projects": []             // Required (can be empty)
   }
   ```

3. **Project structure:**
   ```json
   {
     "id": "unique-id",           // Required
     "title": "Project Name",      // Required
     "description": "Description", // Required
     "imageDriveIds": [],          // Required (can be empty)
     "videoDriveIds": [],          // Required (can be empty)
     "createdAt": "ISO date",      // Required
     "updatedAt": "ISO date"       // Required
   }
   ```

### Issue: Images showing as broken or with placeholder

**Debugging steps:**

1. **Check the browser console** (F12):
   - Look for 403 errors (permission denied) → File not public
   - Look for 404 errors (not found) → Wrong file ID
   - Look for CORS errors → Try different browser

2. **Verify file IDs are correct:**
   - File IDs should be alphanumeric strings (e.g., `1ABC123xyz`)
   - Not URLs or file paths
   - Get the ID from the shareable link

3. **Test individual file URLs:**
   ```
   For images:
   https://drive.google.com/thumbnail?id=YOUR_FILE_ID&sz=w1000

   For videos:
   https://drive.google.com/file/d/YOUR_FILE_ID/preview
   ```

## Performance Issues

### Issue: Slow loading or timeouts

**Solutions:**

1. **Optimize image sizes:**
   - Recommended max dimensions: 1920x1080 for images
   - Compress images before uploading
   - Use JPEG for photos, PNG for graphics

2. **Reduce number of media files:**
   - Limit to 3-5 images per project
   - Keep total portfolio under 100 images

3. **Use CDN or alternative hosting for large files:**
   - For very large portfolios, consider hosting images on:
     - Imgur (free, public images)
     - Cloudinary (free tier available)
     - GitHub repository (for smaller images)

## Deployment Issues

### Issue: App works locally but not on Netlify/GitHub Pages

**Common causes:**

1. **Missing `_redirects` file:**
   - Ensure `public/_redirects` exists with content: `/*    /index.html    200`

2. **Wrong homepage URL:**
   - Check `package.json` → `"homepage"` field
   - For Netlify: `"homepage": "."`
   - For GitHub Pages: `"homepage": "https://username.github.io/repo-name"`

3. **Build errors:**
   - Run `npm run build` locally first
   - Check for errors in the build output
   - Ensure all dependencies are in `package.json`

### Issue: 404 error when accessing with query parameters

**Solution:**

This is a Single Page Application routing issue. Ensure:

1. **For Netlify:**
   - `public/_redirects` file exists with: `/*    /index.html    200`

2. **For GitHub Pages:**
   - Create `public/404.html` as a copy of `public/index.html`
   - Or use hash routing (change URL format to `/#/?id=FILE_ID`)

## Testing Checklist

Before deploying, verify:

- [ ] Portfolio JSON file is public on Google Drive
- [ ] All image file IDs are public
- [ ] All video file IDs are public
- [ ] JSON is valid (use JSONLint.com to verify)
- [ ] All required fields are present
- [ ] Color values are in ARGB integer format
- [ ] Date values are in ISO 8601 format
- [ ] File IDs are correct (test individual URLs)
- [ ] App builds without errors (`npm run build`)
- [ ] `_redirects` file is in `public` folder

## Still Having Issues?

1. **Check browser console** (F12) for error messages
2. **Test with sample data** using `http://localhost:3000/?id=sample-portfolio.json`
3. **Verify Google Drive API quota** hasn't been exceeded
4. **Try different browser** to rule out caching issues
5. **Clear browser cache** and reload

## Contact & Support

For additional help:
- Check the main README.md file
- Review the WEB_VIEWER_PORTFOLIO_SPEC.md specification
- Open an issue on GitHub with:
  - Browser and version
  - Error messages from console
  - Sample portfolio JSON (with sensitive data removed)
  - Steps to reproduce the issue
