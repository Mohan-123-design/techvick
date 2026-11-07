import React from 'react';
import { Link } from 'react-router-dom';

export default function TechvickLogo({
  size = 'md',
  showTagline = true,
  showLink = true,
  className = '',
}) {
  const logoDimensions = {
    sm: { imgWidth: 34, imgHeight: 18, titleSize: '0.98rem', subSize: '0.58rem' },
    md: { imgWidth: 42, imgHeight: 22, titleSize: '1.16rem', subSize: '0.62rem' },
    lg: { imgWidth: 52, imgHeight: 28, titleSize: '1.38rem', subSize: '0.68rem' },
    xl: { imgWidth: 64, imgHeight: 34, titleSize: '1.65rem', subSize: '0.74rem' },
  };

  const dim = logoDimensions[size] || logoDimensions.md;

  const content = (
    <div className={`techvick-brand-logo ${size} ${className}`}>
      {/* Real logo extracted directly from Techvick Business Card */}
      <div className="techvick-logo-mark-wrap">
        <img
          src="/images/techvick_logo_real.png"
          alt="Techvick Computers Logo"
          className="techvick-real-logo-img"
          style={{ width: `${dim.imgWidth}px`, height: 'auto' }}
          onError={(e) => {
            // Fallback SVG mark if image fails to load
            e.target.style.display = 'none';
            if (e.target.nextElementSibling) {
              e.target.nextElementSibling.style.display = 'block';
            }
          }}
        />
        {/* Precise SVG vector fallback matching exact card geometry */}
        <svg
          viewBox="0 0 135 66"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="techvick-svg-fallback"
          style={{ width: `${dim.imgWidth}px`, height: 'auto', display: 'none' }}
        >
          <defs>
            <linearGradient id="tvcCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          {/* Top T/V diagonal bar */}
          <path
            d="M5 8 L54 8 L72 38 L60 38 L48 18 L16 18 L16 8 Z"
            fill="url(#tvcCardGrad)"
          />
          {/* Right C bracket */}
          <path
            d="M72 10 L125 10 L125 20 L86 20 L76 36 L118 36 L118 46 L82 46 L94 62 L64 62 L72 10 Z"
            fill="url(#tvcCardGrad)"
          />
        </svg>
      </div>

      <div className="brand-text-block">
        <div className="brand-name-row">
          <span className="brand-name" style={{ fontSize: dim.titleSize, whiteSpace: 'nowrap' }}>
            TECHVICK <span className="brand-highlight">COMPUTERS</span>
          </span>
        </div>
        {showTagline && (
          <div className="brand-slogan-wrap">
            <span className="brand-card-slogan" style={{ fontSize: dim.subSize }}>
              TAKING CARE OF YOUR PC
            </span>
            <span className="brand-slogan-dot">•</span>
            <span className="brand-service-badge" style={{ fontSize: dim.subSize }}>
              SALES & SERVICE
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (showLink) {
    return (
      <Link to="/" className="techvick-logo-link" title="Techvick Computers - Home">
        {content}
      </Link>
    );
  }

  return content;
}
