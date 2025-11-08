# Quick Media Fix Guide 🚀

## Videos & Images Not Working? Follow These Steps!

### Step 1: Check File Permissions (90% of issues!)

For **EVERY** file (images AND videos):

1. Open Google Drive
2. Find your file
3. Right-click → **Share**
4. Change from "Restricted" to **"Anyone with the link"**
5. Set to **"Viewer"**
6. Click "Done"

**Do this for ALL files:**
- Profile avatar
- Profile cover
- Background image
- Category icons
- Category covers
- Project images
- Project videos

---

### Step 2: Get the File ID Correctly

**WRONG ❌:**
```
https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing
```

**RIGHT ✅:**
```
1ABC123xyz
```

**How to extract:**
From the share link, grab only the middle part between `/d/` and `/view`

---

### Step 3: Update Your JSON

**For Images:**
```json
"imageDriveIds": [
  "1ABC123firstImage",
  "1DEF456secondImage"
]
```

**For Videos:**
```json
"videoDriveIds": [
  "1GHI789firstVideo"
]
```

**IMPORTANT:**
- Only the file ID, no URLs
- No empty strings ("")
- No null values mixed in valid IDs

---

### Step 4: Test One File First

Before adding all your media:

1. Add ONE image to ONE project
2. Load your portfolio
3. Check if it shows
4. If YES → continue adding more
5. If NO → check console (F12)

---

### Step 5: Check Browser Console

1. Press **F12** to open DevTools
2. Click **Console** tab
3. Refresh the page
4. Look for messages:

**✅ Good:**
```
Image loaded: 1ABC123xyz
```

**❌ Bad:**
```
Image failed to load: 1ABC123xyz
Trying thumbnail fallback for: 1ABC123xyz
Thumbnail fallback also failed for: 1ABC123xyz
```

---

## Common Issues & Quick Fixes

### Issue: "Unable to load image" error overlay

**Fix:**
1. File not public → Make it public (Step 1)
2. Wrong file ID → Copy it again carefully
3. File deleted → Re-upload and get new ID

### Issue: Video shows "Video unavailable"

**Fix:**
1. File not public → Make it public
2. Wrong format → Convert to MP4
3. File too large → Compress to under 100MB

### Issue: Images load but very slowly

**Fix:**
- Compress images before upload
- Use TinyPNG.com or ImageOptim
- Target under 500KB per image

---

## Test URLs Manually

**For Images:**
```
https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
```

**For Videos:**
```
https://drive.google.com/file/d/YOUR_FILE_ID/preview
```

Open these in a new browser tab:
- If it works there → Check your JSON
- If it fails there → File permissions or wrong ID

---

## Video Requirements

✅ **Supported Formats:**
- MP4 (recommended)
- MOV
- AVI

❌ **Not Supported:**
- MKV
- FLV
- WEBM

**Specs:**
- Max size: 100MB (recommended)
- Resolution: 1080p or lower
- Codec: H.264

---

## Quick Checklist

Before asking for help, verify:

- [ ] All files are set to "Anyone with the link"
- [ ] All files have "Viewer" permission
- [ ] File IDs are copied correctly (20-40 characters)
- [ ] No extra characters in IDs (no spaces, slashes, etc.)
- [ ] Videos are MP4 format
- [ ] Images are under 5MB each
- [ ] JSON is valid (test at jsonlint.com)
- [ ] Tested URLs manually in browser

---

## Still Not Working?

### Check this in order:

1. **Browser Console** (F12)
   - Any errors in red?
   - What file IDs are failing?

2. **Test one file manually**
   - Use the test URLs above
   - Does it work in the browser?

3. **Check file permissions AGAIN**
   - This is the #1 issue!
   - Every file must be public

4. **Verify file IDs**
   - No typos?
   - No extra characters?
   - Correct length (20-40 chars)?

5. **Read MEDIA_TROUBLESHOOTING.md**
   - Detailed guide with all solutions

---

## Example Working Setup

**Portfolio JSON:**
```json
{
  "categories": [
    {
      "id": "cat-1",
      "title": "My Work",
      "projects": [
        {
          "id": "proj-1",
          "title": "Cool Project",
          "description": "Check this out!",
          "imageDriveIds": [
            "1ABC123validImageId1",
            "1DEF456validImageId2"
          ],
          "videoDriveIds": [
            "1GHI789validVideoId"
          ]
        }
      ]
    }
  ]
}
```

**Each file must:**
- Exist in Google Drive
- Be set to "Anyone with link" + "Viewer"
- Have ID extracted correctly

---

## Success Indicators

You'll know it's working when:

✅ Images load without error overlays
✅ Videos play when clicked
✅ Carousel navigation works smoothly
✅ Console shows "Image loaded" messages
✅ No red errors in console

---

## Pro Tips

1. **Upload files to one Drive folder**
   - Easier to manage permissions
   - Set folder to public, then all files inherit

2. **Test as you go**
   - Don't add 50 files at once
   - Add 1-2 files, test, then continue

3. **Use consistent naming**
   - `project1-screenshot1.jpg`
   - `project1-screenshot2.jpg`
   - `project1-demo.mp4`

4. **Keep a backup**
   - Save file IDs in a text file
   - Note which file is which
   - Makes troubleshooting easier

---

## Need the Full Guide?

For detailed troubleshooting: **MEDIA_TROUBLESHOOTING.md**

For complete documentation: **WEB_VIEWER_IMAGE_DISPLAY_FIX.md**

---

**Remember: 90% of issues are file permissions!** Make EVERY file public! 🔓
