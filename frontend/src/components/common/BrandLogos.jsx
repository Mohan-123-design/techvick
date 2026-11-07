import React from 'react';

/**
 * High-definition vector logos for the 12 brands serviced at Techvick Computers,
 * as listed on the official store business card.
 * Designed to look razor-sharp in both Dark and Light themes.
 */
export function BrandLogoSvg({ slug, className = '' }) {
  switch (slug) {
    case 'apple':
      return (
        <svg viewBox="0 0 170 170" fill="currentColor" className={`brand-svg brand-apple ${className}`} aria-label="Apple">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.9-12.04-14.47-6.08-9.18-10.9-19.67-14.48-31.47-3.57-11.8-5.36-22.9-5.36-33.31 0-14.86 3.73-27.24 11.2-37.13 7.46-9.89 17.07-14.93 28.82-15.11 4.58 0 9.87 1.25 15.86 3.76 5.99 2.5 9.68 3.82 11.07 3.94 1.83-.24 5.76-1.63 11.78-4.17 6.01-2.54 11.13-3.69 15.35-3.46 11.37.58 20.84 4.54 28.4 11.87 7.56 7.33 12.3 16.32 14.22 26.96-10.22 6.16-15.22 14.74-15 25.75.22 8.65 3.55 15.93 9.99 21.84 6.44 5.91 14.28 9.38 23.51 10.42-2.11 6.53-4.81 13.06-8.1 19.59zM119.22 33.15c0-7.39 2.65-14.32 7.94-20.78 5.29-6.46 11.89-10.74 19.8-12.83.22 1.34.33 2.56.33 3.65 0 7.49-2.73 14.61-8.2 21.36-5.46 6.75-12.08 10.97-19.87 12.67-.21-1.35-.33-2.71-.33-4.07z" />
        </svg>
      );

    case 'hp':
      return (
        <svg viewBox="0 0 200 200" fill="none" className={`brand-svg brand-hp ${className}`} aria-label="HP">
          <circle cx="100" cy="100" r="92" fill="#0096d6" />
          {/* Slanted HP letters */}
          <path d="M72 165 L102 35 L118 35 L88 165 Z" fill="#ffffff" />
          <path d="M52 112 L128 112 L124 128 L48 128 Z" fill="#ffffff" />
          <path d="M120 165 L145 55 L161 55 L136 165 Z" fill="#ffffff" />
          <path d="M136 78 C155 78 166 90 160 115 C155 138 138 148 118 148 L126 132 C138 132 146 126 149 113 C152 98 144 92 132 92 Z" fill="#ffffff" />
        </svg>
      );

    case 'dell':
      return (
        <svg viewBox="0 0 240 60" fill="none" className={`brand-svg brand-dell ${className}`} aria-label="Dell">
          {/* D */}
          <path d="M15 10 L38 10 C52 10 60 18 60 30 C60 42 52 50 38 50 L15 50 Z M28 21 L28 39 L37 39 C44 39 48 36 48 30 C48 24 44 21 37 21 Z" fill="#007db8" />
          {/* Slanted E */}
          <g transform="translate(68, 6) rotate(-22)">
            <path d="M0 16 L32 16 L32 24 L10 24 L10 28 L28 28 L28 35 L10 35 L10 40 L34 40 L34 48 L0 48 Z" fill="#007db8" />
          </g>
          {/* First L */}
          <path d="M130 10 L143 10 L143 40 L165 40 L165 50 L130 50 Z" fill="#007db8" />
          {/* Second L */}
          <path d="M175 10 L188 10 L188 40 L210 40 L210 50 L175 50 Z" fill="#007db8" />
        </svg>
      );

    case 'lenovo':
      return (
        <svg viewBox="0 0 160 46" fill="none" className={`brand-svg brand-lenovo ${className}`} aria-label="Lenovo">
          <rect width="160" height="46" rx="4" fill="#e2231a" />
          <text x="80" y="32" fill="#ffffff" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="26" letterSpacing="0.06em" textAnchor="middle">
            lenovo
          </text>
        </svg>
      );

    case 'asus':
      return (
        <svg viewBox="0 0 170 48" fill="currentColor" className={`brand-svg brand-asus ${className}`} aria-label="ASUS">
          <g transform="scale(0.92) translate(5, 4)">
            {/* Split stencil ASUS logo */}
            <path d="M10 42 L25 5 L37 5 L52 42 L40 42 L36 32 L25 32 L21 42 Z M27 24 L34 24 L31 15 Z" />
            <path d="M57 32 C57 39 63 43 73 43 C84 43 90 38 90 31 C90 22 79 21 72 19 C66 17 62 16 62 13 C62 10 66 8 72 8 C79 8 83 11 84 15 L94 13 C92 6 84 2 72 2 C62 2 52 7 52 14 C52 23 63 24 70 26 C77 28 80 29 80 32 C80 35 76 37 71 37 C64 37 59 34 58 29 Z" />
            <path d="M98 5 L108 5 L108 28 C108 34 112 37 118 37 C124 37 128 34 128 28 L128 5 L138 5 L138 28 C138 40 129 44 118 44 C107 44 98 40 98 28 Z" />
            <path d="M145 32 C145 39 151 43 161 43 C172 43 178 38 178 31 C178 22 167 21 160 19 C154 17 150 16 150 13 C150 10 154 8 160 8 C167 8 171 11 172 15 L182 13 C180 6 172 2 160 2 C150 2 140 7 140 14 C140 23 151 24 158 26 C165 28 168 29 168 32 C168 35 164 37 159 37 C152 37 147 34 146 29 Z" />
          </g>
        </svg>
      );

    case 'acer':
      return (
        <svg viewBox="0 0 160 48" fill="none" className={`brand-svg brand-acer ${className}`} aria-label="Acer">
          <text x="80" y="36" fill="#83b81a" fontFamily="'Ubuntu', 'Segoe UI', sans-serif" fontWeight="800" fontSize="38" letterSpacing="-0.02em" textAnchor="middle">
            acer
          </text>
        </svg>
      );

    case 'sony':
      return (
        <svg viewBox="0 0 180 48" fill="currentColor" className={`brand-svg brand-sony ${className}`} aria-label="Sony">
          <text x="90" y="35" fontFamily="'Times New Roman', 'Baskerville', serif" fontWeight="900" fontSize="36" letterSpacing="0.22em" textAnchor="middle">
            SONY
          </text>
        </svg>
      );

    case 'msi':
      return (
        <svg viewBox="0 0 170 48" fill="currentColor" className={`brand-svg brand-msi ${className}`} aria-label="MSI">
          {/* Geometric MSI stencil lettering */}
          <g transform="translate(15, 6)">
            {/* M */}
            <path d="M5 36 L5 4 L14 4 L22 22 L30 4 L39 4 L39 36 L30 36 L30 16 L24 28 L19 28 L14 16 L14 36 Z" fill="#ff0000" />
            {/* S */}
            <path d="M47 36 L47 24 C47 22 49 20 51 20 L68 20 C71 20 73 18 73 15 L73 10 C73 7 71 5 68 5 L47 5 L47 13 L65 13 L65 15 L48 15 C45 15 43 17 43 20 L43 31 C43 34 45 36 48 36 L75 36 L75 28 L55 28 L55 36 Z" fill="currentColor" />
            {/* I */}
            <path d="M83 4 L93 4 L93 36 L83 36 Z" fill="#ff0000" />
          </g>
        </svg>
      );

    case 'intel':
      return (
        <svg viewBox="0 0 170 60" fill="none" className={`brand-svg brand-intel ${className}`} aria-label="Intel">
          <g transform="translate(10, 5)">
            <text x="75" y="40" fill="#0071c5" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="40" letterSpacing="-0.04em" textAnchor="middle">
              intel.
            </text>
          </g>
        </svg>
      );

    case 'amd':
      return (
        <svg viewBox="0 0 170 50" fill="none" className={`brand-svg brand-amd ${className}`} aria-label="AMD">
          {/* Arrow Chevron + AMD */}
          <g transform="translate(10, 6)">
            {/* Left Chevron box */}
            <path d="M0 0 L15 0 L15 15 L0 15 Z" fill="#ed1c24" opacity="0.3" />
            <path d="M18 0 L36 0 L36 18 L18 18 Z" fill="#ed1c24" />
            <path d="M18 20 L36 20 L36 38 L18 38 Z" fill="#ed1c24" />
            <text x="100" y="32" fill="currentColor" fontFamily="Arial Black, Impact, sans-serif" fontWeight="900" fontSize="34" letterSpacing="0.04em" textAnchor="middle">
              AMD
            </text>
          </g>
        </svg>
      );

    case 'nvidia':
      return (
        <svg viewBox="0 0 180 50" fill="none" className={`brand-svg brand-nvidia ${className}`} aria-label="NVIDIA">
          <g transform="translate(8, 5)">
            {/* Nvidia Eye spiral shape */}
            <path d="M16 5 C7 5 0 13 0 22 C0 31 7 39 16 39 C22 39 27 36 30 31 L24 27 C22 30 19 32 16 32 C11 32 6 28 6 22 C6 16 11 12 16 12 C20 12 23 15 25 18 L31 14 C28 9 22 5 16 5 Z" fill="#76b900" />
            <text x="105" y="32" fill="currentColor" fontFamily="'Arial Black', 'Impact', sans-serif" fontWeight="900" fontSize="28" letterSpacing="0.06em" textAnchor="middle">
              NVIDIA
            </text>
          </g>
        </svg>
      );

    case 'samsung':
      return (
        <svg viewBox="0 0 190 48" fill="none" className={`brand-svg brand-samsung ${className}`} aria-label="Samsung">
          <text x="95" y="34" fill="#007db8" fontFamily="'Arial Black', Impact, sans-serif" fontWeight="900" fontSize="28" letterSpacing="0.14em" textAnchor="middle">
            SAMSUNG
          </text>
        </svg>
      );

    default:
      return null;
  }
}

