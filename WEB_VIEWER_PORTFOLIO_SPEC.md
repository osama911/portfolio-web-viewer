# Portfolio Web Viewer - Data Specification

## Overview

This document describes the complete data structure that the web viewer will receive when accessing a portfolio from Google Drive. The portfolio is stored as a JSON file (`portfolio.json`) with all media files referenced by their Google Drive file IDs.

---

## Access Method

**URL Format:**
```
https://portfolio-web-viewer.netlify.app/view?id={fileId}
```

**Where:**
- `fileId` = Google Drive file ID of the `portfolio.json` file
- File is publicly readable (permission: `anyone` with `reader` role)

---

## JSON Structure

### Root Object (Portfolio)

```typescript
interface Portfolio {
  // Personal Information
  name: string;                    // Full name (e.g., "John Doe")
  title: string;                   // Job title (e.g., "Senior Developer")
  bio: string;                     // Biography/description
  email: string;                   // Email address
  phone: string;                   // Phone number
  linkedInUrl: string;             // LinkedIn profile URL

  // Extra Custom Links
  extraLinks: Record<string, string>;  // Key-value pairs of custom links
                                        // Key = link label, Value = URL
                                        // Example: { "GitHub": "https://github.com/user", "Website": "https://example.com" }

  // Media Files (Google Drive File IDs)
  avatarDriveId: string | null;           // Profile avatar image
  coverDriveId: string | null;            // Cover/header image
  backgroundImageDriveId: string | null;  // Background image

  // Styling/Colors (32-bit ARGB integers)
  colorValue: number | null;               // Primary color for profile
  backgroundColorValue: number | null;     // Background color

  // Content
  categories: Category[];           // Array of project categories
}
```

---

### Category Object

```typescript
interface Category {
  // Identity
  id: string;                      // Unique identifier (UUID)
  title: string;                   // Category name (e.g., "Mobile Apps", "Web Projects")
  description: string | null;      // Optional description

  // Media Files (Google Drive File IDs)
  coverDriveId: string | null;     // Category cover image
  iconDriveId: string | null;      // Category icon

  // Styling
  colorValue: number | null;       // Category theme color (32-bit ARGB)

  // Content
  projects: Project[];             // Array of projects in this category
}
```

---

### Project Object

```typescript
interface Project {
  // Identity
  id: string;                      // Unique identifier (UUID)
  title: string;                   // Project name
  description: string;             // Project description (can be long, supports line breaks)

  // Media Files (Arrays of Google Drive File IDs)
  imageDriveIds: string[];         // Array of image file IDs
  videoDriveIds: string[];         // Array of video file IDs

  // Metadata
  createdAt: string;               // ISO 8601 timestamp (e.g., "2024-01-15T10:30:00.000Z")
  updatedAt: string;               // ISO 8601 timestamp

  // Styling
  backgroundColorValue: number | null;  // Project background color (32-bit ARGB)
}
```

---

## Complete JSON Example

```json
{
  "name": "John Doe",
  "title": "Full Stack Developer",
  "bio": "Passionate developer with 5+ years of experience in mobile and web applications. Specialized in Flutter, React, and Node.js.",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "linkedInUrl": "https://linkedin.com/in/johndoe",
  "extraLinks": {
    "GitHub": "https://github.com/johndoe",
    "Portfolio": "https://johndoe.dev",
    "Twitter": "https://twitter.com/johndoe"
  },
  "avatarDriveId": "1ABC123xyz",
  "coverDriveId": "1DEF456abc",
  "backgroundImageDriveId": null,
  "colorValue": 4283215696,
  "backgroundColorValue": 4278190080,
  "categories": [
    {
      "id": "cat-001",
      "title": "Mobile Applications",
      "description": "Cross-platform mobile apps built with Flutter",
      "coverDriveId": "1GHI789def",
      "iconDriveId": "1JKL012ghi",
      "colorValue": 4285887861,
      "projects": [
        {
          "id": "proj-001",
          "title": "E-Commerce App",
          "description": "Full-featured shopping app with cart, payments, and order tracking.\n\nFeatures:\n• Product catalog\n• Secure checkout\n• Order history\n• Push notifications",
          "imageDriveIds": [
            "1MNO345jkl",
            "1PQR678mno",
            "1STU901pqr"
          ],
          "videoDriveIds": [
            "1VWX234stu"
          ],
          "createdAt": "2024-01-15T10:30:00.000Z",
          "updatedAt": "2024-02-20T14:45:00.000Z",
          "backgroundColorValue": 4294967295
        },
        {
          "id": "proj-002",
          "title": "Fitness Tracker",
          "description": "Track workouts, calories, and progress with AI recommendations.",
          "imageDriveIds": [
            "1YZA567vwx",
            "1BCD890yza"
          ],
          "videoDriveIds": [],
          "createdAt": "2024-03-01T09:00:00.000Z",
          "updatedAt": "2024-03-15T16:20:00.000Z",
          "backgroundColorValue": null
        }
      ]
    },
    {
      "id": "cat-002",
      "title": "Web Development",
      "description": "Modern web applications and websites",
      "coverDriveId": null,
      "iconDriveId": null,
      "colorValue": null,
      "projects": [
        {
          "id": "proj-003",
          "title": "Portfolio Website",
          "description": "Responsive portfolio website with dark mode and animations.",
          "imageDriveIds": [
            "1EFG123bcd"
          ],
          "videoDriveIds": [],
          "createdAt": "2024-02-10T11:15:00.000Z",
          "updatedAt": "2024-02-10T11:15:00.000Z",
          "backgroundColorValue": 4278190080
        }
      ]
    }
  ]
}
```

---

## Data Type Details

### Color Values (32-bit ARGB Integer)

Colors are stored as 32-bit integers in ARGB format:

**Format:** `0xAARRGGBB`
- `AA` = Alpha (transparency): 00-FF
- `RR` = Red: 00-FF
- `GG` = Green: 00-FF
- `BB` = Blue: 00-FF

**Examples:**
- `4294967295` = `0xFFFFFFFF` = White (fully opaque)
- `4278190080` = `0xFF000000` = Black (fully opaque)
- `4283215696` = `0xFF2196F3` = Material Blue
- `4285887861` = `0xFF4CAF50` = Material Green

**Conversion (JavaScript):**
```javascript
function argbToRgba(argb) {
  if (argb === null || argb === undefined) return null;

  const a = ((argb >> 24) & 0xFF) / 255;  // Alpha (0-1)
  const r = (argb >> 16) & 0xFF;          // Red (0-255)
  const g = (argb >> 8) & 0xFF;           // Green (0-255)
  const b = argb & 0xFF;                  // Blue (0-255)

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Example usage:
argbToRgba(4283215696); // Returns: "rgba(33, 150, 243, 1)"
```

**Conversion to Hex Color:**
```javascript
function argbToHex(argb) {
  if (argb === null || argb === undefined) return null;

  const r = (argb >> 16) & 0xFF;
  const g = (argb >> 8) & 0xFF;
  const b = argb & 0xFF;

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Example usage:
argbToHex(4283215696); // Returns: "#2196f3"
```

---

### Date/Time Format

All dates use **ISO 8601** format:
```
YYYY-MM-DDTHH:mm:ss.sssZ
```

**Examples:**
- `"2024-01-15T10:30:00.000Z"` = January 15, 2024, 10:30 AM UTC
- `"2024-12-31T23:59:59.999Z"` = December 31, 2024, 11:59:59 PM UTC

**Parsing (JavaScript):**
```javascript
const date = new Date("2024-01-15T10:30:00.000Z");
console.log(date.toLocaleDateString()); // "1/15/2024" (locale-dependent)
```

---

## Media File Access

All media files are stored on Google Drive and referenced by their file IDs.

### Image Files
**File Types:** JPG, PNG, WEBP, GIF
**Access URL:**
```
https://drive.google.com/uc?export=view&id={driveFileId}
```

**Example:**
```html
<img src="https://drive.google.com/uc?export=view&id=1ABC123xyz" alt="Avatar">
```

### Video Files
**File Types:** MP4, MOV, AVI
**Access URL:**
```
https://drive.google.com/uc?export=view&id={driveFileId}
```

**Example:**
```html
<video controls>
  <source src="https://drive.google.com/uc?export=view&id=1VWX234stu" type="video/mp4">
</video>
```

**Note:** Google Drive may have size/bandwidth limits. For very large files, consider embedding using:
```
https://drive.google.com/file/d/{driveFileId}/preview
```

---

## Null/Optional Fields

### Fields That Can Be Null:

**Portfolio Level:**
- `avatarDriveId` - User might not upload avatar
- `coverDriveId` - User might not upload cover
- `backgroundImageDriveId` - User might not set background image
- `colorValue` - Defaults to app theme
- `backgroundColorValue` - Defaults to app theme

**Category Level:**
- `description` - Category might not have description
- `coverDriveId` - Category might not have cover image
- `iconDriveId` - Category might not have icon
- `colorValue` - Defaults to app theme

**Project Level:**
- `backgroundColorValue` - Defaults to category or app theme
- `imageDriveIds` - Array can be empty `[]`
- `videoDriveIds` - Array can be empty `[]`

### Always Present (Never Null):

**Portfolio:**
- `name`, `title`, `bio`, `email`, `phone`, `linkedInUrl`
- `extraLinks` (can be empty object `{}`)
- `categories` (can be empty array `[]`)

**Category:**
- `id`, `title`
- `projects` (can be empty array `[]`)

**Project:**
- `id`, `title`, `description`
- `createdAt`, `updatedAt`
- `imageDriveIds`, `videoDriveIds` (arrays, can be empty)

---

## Extra Links (Custom Links)

The `extraLinks` field allows unlimited custom social/professional links:

**Structure:**
```typescript
extraLinks: {
  [label: string]: string  // label -> URL mapping
}
```

**Common Examples:**
```json
{
  "GitHub": "https://github.com/username",
  "Website": "https://example.com",
  "Twitter": "https://twitter.com/username",
  "Behance": "https://behance.net/username",
  "Dribbble": "https://dribbble.com/username",
  "Medium": "https://medium.com/@username",
  "YouTube": "https://youtube.com/@username"
}
```

**Usage in Web Viewer:**
- Display each link with its label
- Render appropriate icons based on URL domain
- Open links in new tab (`target="_blank"`)

---

## Data Fetching (Web Viewer Implementation)

### Step 1: Get Portfolio JSON

```javascript
async function fetchPortfolio(fileId) {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=YOUR_API_KEY`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const portfolio = await response.json();
    return portfolio;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
}
```

**Alternative (No API Key Required - Public Files):**
```javascript
async function fetchPortfolio(fileId) {
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;

  const response = await fetch(url);
  const portfolio = await response.json();
  return portfolio;
}
```

### Step 2: Display Media Files

```javascript
function getImageUrl(driveFileId) {
  if (!driveFileId) return null;
  return `https://drive.google.com/uc?export=view&id=${driveFileId}`;
}

function getVideoUrl(driveFileId) {
  if (!driveFileId) return null;
  return `https://drive.google.com/uc?export=view&id=${driveFileId}`;
}

// Usage:
const avatarUrl = getImageUrl(portfolio.avatarDriveId);
if (avatarUrl) {
  document.getElementById('avatar').src = avatarUrl;
}
```

---

## Error Handling

### Possible Errors:

1. **File Not Found (404)**
   - File ID doesn't exist
   - File was deleted
   - **Solution:** Show "Portfolio not found" message

2. **Permission Denied (403)**
   - File is not publicly accessible
   - **Solution:** Show "Portfolio is private" message

3. **Invalid JSON**
   - Corrupted file
   - **Solution:** Show "Unable to load portfolio" message

4. **Missing Media Files**
   - Referenced image/video IDs don't exist
   - **Solution:** Show placeholder image or skip the item

### Example Error Handler:

```javascript
async function loadPortfolio(fileId) {
  try {
    const portfolio = await fetchPortfolio(fileId);
    renderPortfolio(portfolio);
  } catch (error) {
    if (error.message.includes('404')) {
      showError('Portfolio not found');
    } else if (error.message.includes('403')) {
      showError('This portfolio is private');
    } else {
      showError('Unable to load portfolio');
    }
  }
}
```

---

## UI/UX Recommendations

### Layout Suggestions:

1. **Profile Header:**
   - Cover image (if `coverDriveId` exists) or solid color (`colorValue`)
   - Avatar image overlaying cover
   - Name, title, bio
   - Contact buttons (email, phone, LinkedIn)
   - Custom links from `extraLinks`

2. **Categories Section:**
   - Grid or list of categories
   - Show category title, description
   - Category icon/cover if available
   - Use `colorValue` for theming

3. **Projects Display:**
   - For each category, show its projects
   - Project card with:
     - Title and description
     - Image gallery (from `imageDriveIds`)
     - Video player (from `videoDriveIds`)
     - Created/updated dates
   - Use `backgroundColorValue` for card styling

### Feature Ideas:

- **Search/Filter:** Allow filtering projects by keyword
- **Dark Mode:** Use background colors intelligently
- **Responsive Design:** Mobile-first approach
- **Lazy Loading:** Load images as needed
- **Image Lightbox:** Click to view full-size
- **Video Thumbnails:** Generate/show first frame
- **Share:** Allow sharing individual projects
- **Print/PDF:** Export portfolio as PDF

---

## Performance Optimization

### Best Practices:

1. **Image Optimization:**
   - Use `loading="lazy"` for images
   - Show thumbnails, load full-size on click
   - Use CSS to set max dimensions

2. **Caching:**
   - Cache portfolio JSON for 5-10 minutes
   - Use browser cache for images

3. **Pagination:**
   - If many projects, paginate or use infinite scroll
   - Load projects category by category

4. **Progressive Loading:**
   - Load profile info first
   - Then categories
   - Finally media files

---

## Validation

### Required Validations:

```javascript
function validatePortfolio(portfolio) {
  const errors = [];

  // Required fields
  if (!portfolio.name) errors.push('Name is required');
  if (!portfolio.title) errors.push('Title is required');
  if (!portfolio.email) errors.push('Email is required');

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (portfolio.email && !emailRegex.test(portfolio.email)) {
    errors.push('Invalid email format');
  }

  // Categories
  if (!Array.isArray(portfolio.categories)) {
    errors.push('Categories must be an array');
  }

  // Each category has required fields
  portfolio.categories?.forEach((cat, i) => {
    if (!cat.id) errors.push(`Category ${i}: ID required`);
    if (!cat.title) errors.push(`Category ${i}: Title required`);
    if (!Array.isArray(cat.projects)) {
      errors.push(`Category ${i}: Projects must be an array`);
    }
  });

  return errors;
}
```

---

## Summary Checklist

When building the web viewer, ensure you handle:

- [ ] Fetch portfolio JSON from Google Drive
- [ ] Parse all profile information (name, title, bio, etc.)
- [ ] Display contact information (email, phone, LinkedIn)
- [ ] Render custom links from `extraLinks`
- [ ] Load avatar, cover, and background images
- [ ] Convert ARGB color values to CSS colors
- [ ] Display all categories with their metadata
- [ ] Render all projects within categories
- [ ] Show project images in gallery format
- [ ] Embed project videos with player controls
- [ ] Format dates from ISO 8601 to readable format
- [ ] Handle null/missing fields gracefully
- [ ] Show placeholder for missing images
- [ ] Implement error handling for 404/403/network errors
- [ ] Optimize performance with lazy loading
- [ ] Make responsive for mobile/tablet/desktop
- [ ] Support dark mode if background colors are dark
- [ ] Test with empty categories/projects

---

**Happy Building! 🎉**

For questions or issues with the data structure, refer to the Flutter app source code:
- `lib/models/portfolio_data.dart`
- `lib/models/category.dart`
- `lib/models/project.dart`
- `lib/services/drive_service.dart`
