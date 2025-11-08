# Media Troubleshooting Guide - Images & Videos

## Common Issues & Solutions

### 🎬 Videos Not Playing

#### Issue 1: Video shows "Video unavailable"
**Cause:** Google Drive file not set to public

**Solution:**
1. Open the video file in Google Drive
2. Right-click → Share → Change to "Anyone with the link"
3. Set permission to "Viewer"
4. Copy the file ID from the share link
5. Verify the URL format in console logs

**Correct URL format:**
```
https://drive.google.com/file/d/{FILE_ID}/preview
```

#### Issue 2: Video iframe shows blank/black screen
**Cause:** Video file type not supported by Google Drive preview

**Supported formats:**
- ✅ MP4 (H.264)
- ✅ MOV
- ✅ AVI
- ❌ MKV (not supported)
- ❌ FLV (not supported)

**Solution:**
Convert your video to MP4 format using:
- HandBrake (free)
- FFmpeg: `ffmpeg -i input.mkv -c:v libx264 -c:a aac output.mp4`

#### Issue 3: Video loads but won't play
**Cause:** File size too large for Google Drive preview

**Solution:**
- Compress video to under 100MB
- Use lower resolution (720p instead of 4K)
- Reduce bitrate

**FFmpeg compression:**
```bash
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 1M output.mp4
```

---

### 🖼️ Images Not Loading

#### Issue 1: Images show error overlay
**Cause:** Drive file permissions or invalid file ID

**Check the browser console:**
```javascript
Image failed to load: 1ABC123xyz
Trying thumbnail fallback for: 1ABC123xyz
Thumbnail fallback also failed for: 1ABC123xyz
```

**Solutions:**
1. **Verify file ID is correct**
   - The file ID should be 20-40 characters long
   - Example: `1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456`

2. **Check file permissions**
   - Open file in Drive
   - Share → Anyone with the link → Viewer
   - Copy the file ID (not the full URL)

3. **Test the URL manually**
   ```
   https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
   ```
   Open this in a new tab - if it downloads or shows the image, the ID is correct

#### Issue 2: Images load slowly or timeout
**Cause:** Large file sizes

**Solution:**
- Resize images to max 2000px width
- Compress using tools like:
  - TinyPNG (online)
  - ImageOptim (Mac)
  - RIOT (Windows)

**Optimal sizes:**
- Profile avatar: 500x500px
- Cover image: 1920x1080px
- Category icons: 512x512px
- Project images: 1920px width max

#### Issue 3: Images show Google Drive login page
**Cause:** File is not publicly accessible

**Solution:**
1. Go to Google Drive
2. Right-click the file → Share
3. Change "Restricted" to "Anyone with the link"
4. Set role to "Viewer"
5. Click "Copy link"
6. Extract file ID from the link

**Example link:**
```
https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing
                              ^^^^^^^^^^
                              This is your file ID
```

---

## Debugging Tools

### 1. Check Console Logs

Open browser DevTools (F12) and look for:

**✅ Success messages:**
```
Image loaded: 1ABC123xyz
```

**❌ Error messages:**
```
Image failed to load: 1ABC123xyz
Trying thumbnail fallback for: 1ABC123xyz
Thumbnail fallback also failed for: 1ABC123xyz
```

**🎥 Video errors:**
```
Video failed to load: 1ABC123xyz
```

### 2. Network Tab

1. Open DevTools (F12) → Network tab
2. Filter by "Img" or "Media"
3. Refresh the page
4. Look for failed requests (red)
5. Click on a failed request to see details

**Common error codes:**
- `403 Forbidden`: File permissions issue
- `404 Not Found`: Invalid file ID
- `429 Too Many Requests`: Rate limited (wait a moment)

### 3. Test URLs Manually

**For Images:**
```
https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
```

**For Videos:**
```
https://drive.google.com/file/d/YOUR_FILE_ID/preview
```

**Thumbnail fallback:**
```
https://drive.google.com/thumbnail?id=YOUR_FILE_ID&sz=w2000
```

Open each URL in a new browser tab:
- ✅ If it works → File ID is correct, check app code
- ❌ If it fails → File ID is wrong or permissions issue

---

## Portfolio JSON Setup

### Correct Format

```json
{
  "categories": [
    {
      "id": "cat-001",
      "title": "My Projects",
      "projects": [
        {
          "id": "proj-001",
          "title": "Cool App",
          "description": "An amazing application",
          "imageDriveIds": [
            "1ABC123firstImage",
            "1DEF456secondImage",
            "1GHI789thirdImage"
          ],
          "videoDriveIds": [
            "1JKL012firstVideo",
            "1MNO345secondVideo"
          ]
        }
      ]
    }
  ]
}
```

### Common Mistakes

❌ **Wrong - Full URL instead of ID:**
```json
"imageDriveIds": [
  "https://drive.google.com/file/d/1ABC123/view"
]
```

✅ **Correct - Just the file ID:**
```json
"imageDriveIds": [
  "1ABC123"
]
```

❌ **Wrong - Empty strings:**
```json
"imageDriveIds": ["", null, "  "]
```

✅ **Correct - Only valid IDs:**
```json
"imageDriveIds": ["1ABC123", "1DEF456"]
```

---

## Step-by-Step Upload Guide

### For Images:

1. **Upload to Google Drive**
   - Go to drive.google.com
   - Create a folder for your portfolio media
   - Upload your images

2. **Set Permissions**
   - Right-click each image
   - Click "Share"
   - Change to "Anyone with the link"
   - Set to "Viewer"
   - Click "Copy link"

3. **Extract File ID**
   From this link:
   ```
   https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing
   ```

   Extract:
   ```
   1ABC123xyz
   ```

4. **Add to Portfolio JSON**
   ```json
   "imageDriveIds": ["1ABC123xyz"]
   ```

### For Videos:

Same process as images, but ensure:
- Video is MP4 format (H.264 codec)
- File size under 100MB
- Resolution 1080p or lower for best compatibility

---

## Quick Checks

### ✅ Pre-Flight Checklist

Before testing your portfolio:

- [ ] All Drive files are uploaded
- [ ] All files are set to "Anyone with the link" + "Viewer"
- [ ] File IDs are copied correctly (no extra characters)
- [ ] Videos are in MP4 format
- [ ] Images are under 5MB each
- [ ] No empty strings in imageDriveIds/videoDriveIds arrays
- [ ] JSON is valid (use jsonlint.com to verify)

### 🔍 Verification Steps

1. **Test one image first**
   - Add one image to a project
   - Load the portfolio
   - Check if it displays
   - Check console for errors

2. **Test one video**
   - Add one video to a project
   - Load the portfolio
   - Check if it plays
   - Check console for errors

3. **Scale up gradually**
   - Add more media one at a time
   - Verify each addition works
   - This helps isolate problem files

---

## Common Error Messages

### "Unable to load image"

**What you see:**
- Red error overlay on project card
- Warning icon (⚠️)
- Message: "Unable to load image"
- Subtext: "Check Drive file permissions"

**What it means:**
Both the primary URL and thumbnail fallback failed

**Solutions:**
1. Check file permissions (most common)
2. Verify file ID is correct
3. Ensure file hasn't been deleted
4. Check if file is in your Drive trash

### Console: "Image failed to load"

**Solutions:**
1. Open the failing URL in new tab
2. If it redirects to Drive login → permissions issue
3. If it shows 404 → wrong file ID
4. If it downloads → might be wrong format

### Console: "Video failed to load"

**Solutions:**
1. Check video format (must be MP4, MOV, or AVI)
2. Verify file size (under 100MB recommended)
3. Check Drive permissions
4. Try re-uploading the video

---

## Advanced Debugging

### Enable Detailed Logging

The app already logs media loading. Check console for:

```javascript
// Successful image load
Image loaded: 1ABC123xyz

// Failed image load (trying fallback)
Image failed to load: 1ABC123xyz
Trying thumbnail fallback for: 1ABC123xyz

// Complete failure
Thumbnail fallback also failed for: 1ABC123xyz

// Video error
Video failed to load: 1ABC123xyz
```

### Test Drive API Directly

Use these URLs in your browser:

**Check if image exists:**
```
https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
```

**Check if video exists:**
```
https://drive.google.com/file/d/YOUR_FILE_ID/preview
```

**Results:**
- ✅ File loads/downloads → ID is correct
- ❌ Login page → Not public
- ❌ 404 error → Wrong ID or deleted file

---

## Performance Tips

### Optimize Loading Speed

1. **Compress images before upload**
   - Use TinyPNG, ImageOptim, or similar
   - Target: Under 500KB per image

2. **Limit media per project**
   - Max 10 images per project recommended
   - Max 3 videos per project recommended

3. **Use appropriate resolutions**
   - Don't upload 4K images for web display
   - 1920px width is sufficient

4. **Lazy loading is enabled**
   - Images load as you scroll
   - No need to worry about initial page load

---

## Still Having Issues?

### Check These:

1. **Browser Console** (F12 → Console tab)
   - Any red errors?
   - What are the failing URLs?

2. **Network Tab** (F12 → Network tab)
   - What's the HTTP status code?
   - Is the request going to the right URL?

3. **Test Individual Files**
   - Open each Drive URL manually
   - Verify they work in the browser

4. **Verify JSON Structure**
   - Use jsonlint.com to validate
   - Check for syntax errors

5. **File Permissions**
   - Every single file must be public
   - "Anyone with the link" + "Viewer" role

---

## Example Working Configuration

Here's a complete working example:

```json
{
  "name": "John Doe",
  "title": "Developer",
  "bio": "Building amazing things",
  "avatarDriveId": "1ABC123validAvatarId",
  "coverDriveId": "1DEF456validCoverId",
  "backgroundImageDriveId": "1GHI789validBgId",
  "colorValue": 4283215696,
  "categories": [
    {
      "id": "cat-001",
      "title": "Mobile Apps",
      "iconDriveId": "1JKL012validIconId",
      "coverDriveId": "1MNO345validCatCoverId",
      "projects": [
        {
          "id": "proj-001",
          "title": "Amazing App",
          "description": "This app is amazing!",
          "imageDriveIds": [
            "1PQR678validImage1",
            "1STU901validImage2"
          ],
          "videoDriveIds": [
            "1VWX234validVideo1"
          ],
          "createdAt": "2024-01-15T10:30:00.000Z"
        }
      ]
    }
  ]
}
```

**Remember:** Every file ID must:
- Be from a file in your Google Drive
- Have public permissions set
- Be just the ID (not the full URL)

---

## Success! 🎉

If you see:
- ✅ Images loading correctly
- ✅ Videos playing in iframe
- ✅ No error overlays
- ✅ Smooth carousel navigation
- ✅ Console shows "Image loaded" messages

**You're all set!** Your portfolio media is working perfectly.

---

## Need More Help?

1. Check browser console for specific errors
2. Test Drive URLs manually in new tab
3. Verify file permissions for each file
4. Ensure JSON structure is correct
5. Try with one file first, then add more

**Most issues are due to file permissions or incorrect file IDs!**
