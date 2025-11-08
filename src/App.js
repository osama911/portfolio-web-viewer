import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import './App.css';

// Helper function to convert ARGB integer to CSS color (rgba)
function argbToRgba(argb) {
  if (argb === null || argb === undefined) return null;

  const a = ((argb >> 24) & 0xFF) / 255;
  const r = (argb >> 16) & 0xFF;
  const g = (argb >> 8) & 0xFF;
  const b = argb & 0xFF;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Helper function to convert ARGB integer to hex color
function argbToHex(argb) {
  if (argb === null || argb === undefined) return null;

  const r = (argb >> 16) & 0xFF;
  const g = (argb >> 8) & 0xFF;
  const b = argb & 0xFF;

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Helper function to get user initials
function getInitials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Helper function to get image URL from Google Drive file ID
// Primary strategy: Use uc endpoint which works best for public files
function getImageUrl(driveFileId) {
  if (!driveFileId) return null;
  // Use the direct download/view URL - this is the most reliable for public files
  return `https://drive.google.com/uc?export=view&id=${driveFileId}`;
}

// Alternative thumbnail URL (used as fallback)
function getThumbnailUrl(driveFileId) {
  if (!driveFileId) return null;
  return `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w2000`;
}

// Helper function to get video URL from Google Drive file ID
function getVideoUrl(driveFileId) {
  if (!driveFileId) return null;
  // For videos, use the preview endpoint which works better for embedding
  return `https://drive.google.com/file/d/${driveFileId}/preview`;
}

// Helper to check if a URL is valid
function isValidDriveId(id) {
  return id && typeof id === 'string' && id.trim().length > 0;
}

function App() {
  return (
    <Router>
      <PortfolioApp />
    </Router>
  );
}

function PortfolioApp() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the 'id' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const driveFileId = urlParams.get('id');

    if (!driveFileId) {
      setError('No portfolio ID provided. Please use: /view?id=DRIVE_FILE_ID');
      setLoading(false);
      return;
    }

    // Read API key from environment variable
    const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

    if (!GOOGLE_API_KEY) {
      setError('Google API key not configured. Please check your .env file.');
      setLoading(false);
      return;
    }

    // Use Google Drive API v3 endpoint (better CORS support)
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media&key=${GOOGLE_API_KEY}`;

    fetch(driveUrl)
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Portfolio not found');
          } else if (response.status === 403) {
            throw new Error('This portfolio is private. Please make sure the file is publicly accessible.');
          }
          throw new Error(`Failed to fetch portfolio data: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Portfolio data loaded:', data);
        setPortfolio(data);
        setLoading(false);

        // Apply global background to body element
        applyGlobalBackground(data);
      })
      .catch(err => {
        console.error('Error loading portfolio:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Apply global background to body
  const applyGlobalBackground = (portfolio) => {
    const body = document.body;

    // Priority 1: Background image with overlay
    if (portfolio.backgroundImageDriveId) {
      const bgUrl = getImageUrl(portfolio.backgroundImageDriveId);
      // Apply background image with dark overlay for readability
      body.style.backgroundImage = `
        linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.7)),
        url('${bgUrl}')
      `;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundAttachment = 'fixed';
      body.style.backgroundRepeat = 'no-repeat';
    }

    // Priority 2: Background color (applies even if image exists, as fallback)
    if (portfolio.backgroundColorValue) {
      body.style.backgroundColor = argbToHex(portfolio.backgroundColorValue);
    } else {
      body.style.backgroundColor = '#0a0a0a'; // Default dark background matching mobile app
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage portfolio={portfolio} />} />
      <Route path="/category/:categoryId" element={<CategoryPage portfolio={portfolio} />} />
    </Routes>
  );
}

function HomePage({ portfolio }) {
  return (
    <div className="portfolio-viewer">
      <PortfolioHeader portfolio={portfolio} />
      <ContactInfo portfolio={portfolio} />
      <Categories categories={portfolio.categories} />
    </div>
  );
}

function CategoryPage({ portfolio }) {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const category = portfolio.categories.find(cat => cat.id === categoryId);

  if (!category) {
    return (
      <div className="error-container">
        <h2>Category not found</h2>
        <button onClick={() => navigate('/')}>Go back</button>
      </div>
    );
  }

  return (
    <div className="portfolio-viewer">
      <div className="category-page-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Portfolio
        </button>
        <h1 className="category-page-title">{category.title}</h1>
        {category.description && (
          <p className="category-page-description">{category.description}</p>
        )}
      </div>
      <div className="projects-grid">
        {category.projects && category.projects.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function PortfolioHeader({ portfolio }) {
  const [imageError, setImageError] = useState({});
  const [showInitials, setShowInitials] = useState(!portfolio.avatarDriveId);

  // Use cover image or fall back to color
  const coverUrl = getImageUrl(portfolio.coverDriveId);
  const backgroundColor = argbToHex(portfolio.colorValue) || '#101321';

  // Determine header style based on available resources
  let headerStyle = { backgroundColor };

  if (coverUrl && !imageError.cover) {
    headerStyle = {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${coverUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor // Fallback while loading
    };
  }

  const avatarUrl = getImageUrl(portfolio.avatarDriveId);
  const initials = getInitials(portfolio.name);
  const initialsColor = argbToHex(portfolio.colorValue) || '#667eea';

  return (
    <div className="portfolio-header" style={headerStyle}>
      {/* Hidden image to preload and handle errors */}
      {coverUrl && (
        <img
          src={coverUrl}
          alt=""
          style={{ display: 'none' }}
          onError={() => setImageError(prev => ({ ...prev, cover: true }))}
        />
      )}

      <div className="portfolio-header-content">
        {/* Avatar - show image or initials */}
        {avatarUrl && !showInitials ? (
          <img
            src={avatarUrl}
            alt={portfolio.name}
            className="avatar"
            onError={(e) => {
              // Try thumbnail fallback
              if (!e.target.dataset.fallbackAttempted) {
                e.target.dataset.fallbackAttempted = 'true';
                const driveId = portfolio.avatarDriveId;
                if (driveId) {
                  e.target.src = getThumbnailUrl(driveId);
                }
              } else {
                // Show initials if image fails
                setShowInitials(true);
              }
            }}
          />
        ) : (
          <div
            className="avatar avatar-initials"
            style={{
              background: `linear-gradient(135deg, ${initialsColor} 0%, ${initialsColor}dd 100%)`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}
          >
            {initials}
          </div>
        )}

        {/* Profile info next to avatar */}
        <div className="portfolio-profile">
          <h1 className="profile-name">{portfolio.name}</h1>
          {portfolio.title && <h2 className="profile-title">{portfolio.title}</h2>}
          {portfolio.bio && <p className="profile-bio">{portfolio.bio}</p>}
        </div>
      </div>
    </div>
  );
}

function ContactInfo({ portfolio }) {
  const hasContact = portfolio.email || portfolio.phone || portfolio.linkedInUrl ||
    (portfolio.extraLinks && Object.keys(portfolio.extraLinks).length > 0);

  if (!hasContact) return null;

  return (
    <div className="contact-links">
      <h3>Contact</h3>
      <div className="links-grid">
        {portfolio.email && (
          <a
            href={`mailto:${portfolio.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="link-icon">📧</span>
            <span className="link-label">Email</span>
          </a>
        )}

        {portfolio.phone && (
          <a
            href={`tel:${portfolio.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="link-icon">📱</span>
            <span className="link-label">Phone</span>
          </a>
        )}

        {portfolio.linkedInUrl && (
          <a
            href={portfolio.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="link-icon">💼</span>
            <span className="link-label">LinkedIn</span>
          </a>
        )}

        {portfolio.extraLinks && Object.entries(portfolio.extraLinks).map(([label, url]) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="link-icon">🔗</span>
            <span className="link-label">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Categories({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="categories">
      {categories.map((category) => (
        <Category key={category.id} category={category} />
      ))}
    </div>
  );
}

function Category({ category }) {
  const navigate = useNavigate();
  const [showIcon, setShowIcon] = useState(true);
  const [coverUrl, setCoverUrl] = useState(null);

  const categoryColor = argbToHex(category.colorValue);

  // Set cover URL when component mounts or when coverDriveId changes
  useEffect(() => {
    if (category.coverDriveId) {
      setCoverUrl(getImageUrl(category.coverDriveId));
    }
  }, [category.coverDriveId]);

  const handleCoverError = () => {
    // Try thumbnail fallback
    if (category.coverDriveId && coverUrl && !coverUrl.includes('thumbnail')) {
      setCoverUrl(getThumbnailUrl(category.coverDriveId));
    } else {
      // If thumbnail also fails, clear the URL
      setCoverUrl(null);
    }
  };

  const handleCategoryClick = () => {
    navigate(`/category/${category.id}`);
  };

  // Category header style with background image
  const categoryHeaderStyle = coverUrl
    ? {
        backgroundImage: `url(${coverUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        background: categoryColor
          ? `linear-gradient(135deg, ${categoryColor}40 0%, ${categoryColor}20 100%)`
          : 'linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.15) 100%)',
      };

  return (
    <div className="category" onClick={handleCategoryClick}>
      {/* Category Header with Background Image */}
      <div className="category-header-banner" style={categoryHeaderStyle}>
        {/* Hidden image for preloading and error handling */}
        {coverUrl && (
          <img
            src={coverUrl}
            alt=""
            style={{ display: 'none' }}
            onError={handleCoverError}
          />
        )}

        {/* Blur overlay */}
        <div className="category-header-overlay"></div>

        {/* Content overlay */}
        <div className="category-header-content">
          {category.iconDriveId && showIcon && (
            <img
              src={getImageUrl(category.iconDriveId)}
              alt={category.title}
              className="category-icon"
              onError={(e) => {
                if (!e.target.dataset.fallbackAttempted) {
                  e.target.dataset.fallbackAttempted = 'true';
                  e.target.src = getThumbnailUrl(category.iconDriveId);
                } else {
                  setShowIcon(false);
                }
              }}
            />
          )}
          <div className="category-text">
            <h3 className="category-title" style={categoryColor ? { borderLeftColor: categoryColor } : {}}>
              {category.title}
            </h3>
            {category.description && (
              <p className="category-description">{category.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Project({ project }) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [imageLoadError, setImageLoadError] = useState({});

  // Filter and combine images and videos into a single media array
  const images = (project.imageDriveIds || [])
    .filter(id => isValidDriveId(id))
    .map((id, index) => ({
      type: 'image',
      url: getImageUrl(id),
      id: id,
      index: `img-${index}`
    }));

  const videos = (project.videoDriveIds || [])
    .filter(id => isValidDriveId(id))
    .map((id, index) => ({
      type: 'video',
      url: getVideoUrl(id),
      id: id,
      index: `vid-${index}`
    }));

  const allMedia = [...images, ...videos];
  const hasMedia = allMedia.length > 0;
  const currentMedia = hasMedia ? allMedia[currentMediaIndex] : null;

  const backgroundColor = argbToRgba(project.backgroundColorValue);

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) => (prev > 0 ? prev - 1 : allMedia.length - 1));
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) => (prev < allMedia.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="project-card" style={backgroundColor ? { backgroundColor } : {}}>
      {hasMedia && currentMedia && (
        <div className="project-media-container">
          {currentMedia.type === 'video' ? (
            <iframe
              key={currentMedia.index}
              src={currentMedia.url}
              className="project-media project-video"
              title={`${project.title} - Video ${currentMediaIndex + 1}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
              onError={() => {
                console.error('Video failed to load:', currentMedia.id);
              }}
            />
          ) : (
            <img
              key={currentMedia.index}
              src={currentMedia.url}
              alt={`${project.title} - Image ${currentMediaIndex + 1}`}
              className="project-media"
              loading="lazy"
              onLoad={() => {
                // Successfully loaded
                console.log('Image loaded:', currentMedia.id);
              }}
              onError={(e) => {
                console.error('Image failed to load:', currentMedia.id);
                // Fallback to thumbnail if uc fails
                if (!e.target.dataset.fallbackAttempted) {
                  e.target.dataset.fallbackAttempted = 'true';
                  const driveId = currentMedia.id;
                  if (driveId) {
                    console.log('Trying thumbnail fallback for:', driveId);
                    e.target.src = getThumbnailUrl(driveId);
                  }
                } else {
                  // Mark as error in state
                  setImageLoadError(prev => ({ ...prev, [currentMedia.index]: true }));
                  console.error('Thumbnail fallback also failed for:', currentMedia.id);
                }
              }}
            />
          )}

          {/* Show error message if image failed to load */}
          {currentMedia.type === 'image' && imageLoadError[currentMedia.index] && (
            <div className="media-error-overlay">
              <div className="media-error-message">
                <span>⚠️</span>
                <p>Unable to load image</p>
                <small>Check Drive file permissions</small>
              </div>
            </div>
          )}

          {allMedia.length > 1 && (
            <div className="media-controls">
              <button
                onClick={handlePrevMedia}
                className="media-nav-btn"
                aria-label="Previous media"
                type="button"
              >
                ‹
              </button>
              <span className="media-counter">
                {currentMediaIndex + 1} / {allMedia.length}
              </span>
              <button
                onClick={handleNextMedia}
                className="media-nav-btn"
                aria-label="Next media"
                type="button"
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}

      <div className="project-info">
        <h4 className="project-title">{project.title}</h4>

        {project.description && (
          <p className="project-description">{project.description}</p>
        )}

        {hasMedia && (
          <p className="project-media-info">
            {images.length > 0 && `${images.length} image${images.length !== 1 ? 's' : ''}`}
            {images.length > 0 && videos.length > 0 && ' • '}
            {videos.length > 0 && `${videos.length} video${videos.length !== 1 ? 's' : ''}`}
          </p>
        )}

        {project.createdAt && (
          <p className="project-date">
            {new Date(project.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
