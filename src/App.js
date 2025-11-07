import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the 'id' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const driveFileId = urlParams.get('id');

    if (!driveFileId) {
      setError('No portfolio ID provided. Please use: ?id=DRIVE_FILE_ID');
      setLoading(false);
      return;
    }

    // Fetch the JSON from Google Drive
    const driveUrl = `https://drive.google.com/uc?export=download&id=${driveFileId}`;

    fetch(driveUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        return response.json();
      })
      .then(data => {
        setPortfolio(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
    <div className="portfolio-viewer">
      <PortfolioHeader portfolio={portfolio} />
      <PortfolioProfile portfolio={portfolio} />
      <ContactLinks links={portfolio.contactLinks} />
      <Categories categories={portfolio.categories} />
    </div>
  );
}

function PortfolioHeader({ portfolio }) {
  const headerStyle = portfolio.headerBackgroundImage
    ? { backgroundImage: `url(${portfolio.headerBackgroundImage})` }
    : { backgroundColor: portfolio.headerBackgroundColor || '#6200ea' };

  return (
    <div className="portfolio-header" style={headerStyle}>
      {portfolio.avatarUrl && (
        <img src={portfolio.avatarUrl} alt={portfolio.name} className="avatar" />
      )}
    </div>
  );
}

function PortfolioProfile({ portfolio }) {
  return (
    <div className="portfolio-profile">
      <h1 className="profile-name">{portfolio.name}</h1>
      {portfolio.title && <h2 className="profile-title">{portfolio.title}</h2>}
      {portfolio.bio && <p className="profile-bio">{portfolio.bio}</p>}
    </div>
  );
}

function ContactLinks({ links }) {
  if (!links || links.length === 0) return null;

  return (
    <div className="contact-links">
      <h3>Contact</h3>
      <div className="links-grid">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            {link.icon && <span className="link-icon">{link.icon}</span>}
            <span className="link-label">{link.label}</span>
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
      {categories.map((category, index) => (
        <Category key={index} category={category} />
      ))}
    </div>
  );
}

function Category({ category }) {
  return (
    <div className="category">
      <h3 className="category-title">{category.name}</h3>
      {category.description && (
        <p className="category-description">{category.description}</p>
      )}
      <div className="projects-grid">
        {category.projects && category.projects.map((project, index) => (
          <Project key={index} project={project} />
        ))}
      </div>
    </div>
  );
}

function Project({ project }) {
  return (
    <div className="project-card">
      {project.mediaType === 'video' ? (
        <video
          src={project.mediaUrl}
          controls
          className="project-media"
          poster={project.thumbnailUrl}
        />
      ) : (
        <img
          src={project.mediaUrl || project.imageUrl}
          alt={project.title}
          className="project-media"
        />
      )}
      <div className="project-info">
        <h4 className="project-title">{project.title}</h4>
        {project.description && (
          <p className="project-description">{project.description}</p>
        )}
        {project.links && project.links.length > 0 && (
          <div className="project-links">
            {project.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                {link.label || 'View'}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
