import { useState } from 'react';
import { MapPin, Phone, MessageSquare, Clock, Navigation, ExternalLink, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '../../constants';
import './StoreShowcase.css';

export default function StoreShowcase() {
  const [selectedImg, setSelectedImg] = useState(null);

  const photos = [
    {
      id: 'card-front',
      src: '/images/card_front.jpg',
      title: 'Store Front Card & Counter',
      subtitle: 'Tatabad Showroom Desk & Laptop Display',
    },
    {
      id: 'card-back',
      src: '/images/card_back.jpg',
      title: 'Verified Store Services & Brand Partners',
      subtitle: 'Multi-Brand Repair & Sales Warranty',
    },
  ];

  return (
    <section className="store-showcase-section">
      <div className="container">
        <div className="store-showcase-header">
          <span className="store-pill">
            <MapPin size={14} /> Coimbatore Local Store Location
          </span>
          <h2>Visit Our Walk-In Showroom & Diagnostic Lab</h2>
          <p>
            Experience hands-on testing of new & refurbished laptops, discuss custom PC builds with certified technicians, or drop off your system for quick chip-level service at Tatabad, Gandhipuram.
          </p>
        </div>

        <div className="store-showcase-grid">
          {/* Left: Real Store Card & Counter Snapshots */}
          <div className="store-photos-col">
            <div className="store-photos-cards">
              {photos.map((item) => (
                <div
                  key={item.id}
                  className="store-photo-card"
                  onClick={() => setSelectedImg(item.src)}
                >
                  <div className="store-photo-wrapper">
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="photo-overlay">
                      <ExternalLink size={20} />
                      <span>Click to enlarge photo</span>
                    </div>
                  </div>
                  <div className="photo-caption">
                    <strong>{item.title}</strong>
                    <span>{item.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="store-highlights-bar">
              <div className="sh-item">
                <ShieldCheck size={18} className="sh-icon" />
                <div>
                  <strong>Direct In-Store Warranty</strong>
                  <p>Walk in anytime for prompt on-the-spot support.</p>
                </div>
              </div>
              <div className="sh-item">
                <Clock size={18} className="sh-icon" />
                <div>
                  <strong>Operating Hours</strong>
                  <p>{STORE_INFO.workingHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Location Map & Quick Connect */}
          <div className="store-location-col">
            <div className="location-card">
              <div className="location-meta">
                <div className="location-title-row">
                  <div>
                    <h3>{STORE_INFO.name}</h3>
                    <p className="loc-address">
                      <MapPin size={15} /> {STORE_INFO.address}, {STORE_INFO.city} - {STORE_INFO.pincode}
                    </p>
                    <span className="loc-landmark">({STORE_INFO.landmark})</span>
                  </div>
                  <a
                    href={STORE_INFO.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm map-directions-btn"
                  >
                    <Navigation size={14} /> Open Maps
                  </a>
                </div>

                <div className="location-action-buttons">
                  <a href={`tel:${STORE_INFO.phone}`} className="btn btn-primary btn-sm loc-btn">
                    <Phone size={15} /> Call Store Desk
                  </a>
                  <a
                    href={STORE_INFO.social.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm loc-btn whatsapp-btn"
                  >
                    <MessageSquare size={15} /> WhatsApp Store Person
                  </a>
                </div>
              </div>

              {/* Embedded Google Maps View */}
              <div className="map-embed-frame">
                <iframe
                  title="Techvick Computers Tatabad Coimbatore Google Maps"
                  src={STORE_INFO.mapEmbedUrl}
                  width="100%"
                  height="260"
                  style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="store-notice-strip">
                <span>🚘 Free two-wheeler & car parking available right outside on 8th Street.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div className="store-lightbox" onClick={() => setSelectedImg(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImg} alt="Enlarged Store Photo" />
            <button className="btn-close-lightbox" onClick={() => setSelectedImg(null)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

