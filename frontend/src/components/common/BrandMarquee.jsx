import { SERVICED_BRANDS } from '../../constants';
import { BrandLogoSvg } from './BrandLogos';
import './BrandMarquee.css';

export default function BrandMarquee({
  title = 'Multi-Brand Sales, Genuine Spares & Chip-Level Repairs in Coimbatore'
}) {
  return (
    <section className="brand-marquee-section">
      <div className="container">
        {title && (
          <div className="brand-marquee-header">
            <span className="brand-marquee-pill">Multi-Brand Service Center</span>
            <h2 className="brand-marquee-title">{title}</h2>
          </div>
        )}

        <div className="brand-grid">
          {SERVICED_BRANDS.map((b) => (
            <div
              key={b.slug}
              className="brand-badge-card"
              title={`${b.name} - ${b.category}`}
              style={{ '--brand-accent': b.color }}
            >
              <div className="brand-badge-inner">
                <div className="brand-logo-frame">
                  <BrandLogoSvg slug={b.slug} />
                </div>
                <div className="brand-details">
                  <span className="brand-name-subtext">{b.name}</span>
                  <span className="brand-badge-category">{b.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="brand-marquee-footer">
          <span>✓ Genuine Spare Parts</span>
          <span className="dot">•</span>
          <span>✓ Direct Vendor Warranty</span>
          <span className="dot">•</span>
          <span>✓ In-Store & Doorstep Support Across Coimbatore</span>
        </div>
      </div>
    </section>
  );
}
