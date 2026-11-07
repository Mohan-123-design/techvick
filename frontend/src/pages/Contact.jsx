import { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock, MessageSquare, Send,
  CheckCircle2, Navigation
} from 'lucide-react';
import { STORE_INFO } from '../constants';
import { usersApi } from '../utils/api';
import toast from 'react-hot-toast';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const coverageAreas = [
    'Tatabad & Gandhipuram',
    'RS Puram & Ram Nagar',
    'Saibaba Colony & R.S. Puram',
    'Peelamedu & Hopes College',
    'Saravanampatti & IT SEZ',
    'Singanallur & Ramanathapuram',
    'Ganapathy & Avarampalayam',
    'All Coimbatore Localities within 25 km',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error('Please enter your Name, Phone Number, and Message');
      return;
    }

    setIsSubmitting(true);
    try {
      await usersApi.submitContact(formData);
      setSubmitted(true);
      toast.success('Your message has been sent to our Tatabad store desk! We will contact you shortly.');
    } catch (err) {
      toast.error(err.message || 'Failed to send inquiry. Please call our store directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <span className="contact-pill">
              <MapPin size={14} /> 46, 8th Street, Tatabad, Coimbatore
            </span>
            <h1>Contact Techvick Computers</h1>
            <p>
              Looking for a refurbished laptop, custom PC build quotation, printer repair, or CCTV surveillance setup?
              Speak directly with our store staff or visit our walk-in service center.
            </p>
          </div>
        </div>
      </section>

      <div className="container contact-main-layout">
        {/* Left Column: Store Details & Map */}
        <div className="contact-info-col">
          <div className="info-card">
            <h3>Tatabad Walk-In Service Center</h3>
            <p className="info-desc">
              Bring your laptop, desktop, or printer for free initial inspection and component diagnosis.
            </p>

            <div className="contact-items-list">
              <div className="contact-item">
                <div className="ci-icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <strong>Store Address</strong>
                  <p>{STORE_INFO.address}</p>
                  <p>{STORE_INFO.city}, {STORE_INFO.state} - {STORE_INFO.pincode}</p>
                  <span className="ci-landmark">({STORE_INFO.landmark})</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="ci-icon">
                  <Phone size={20} />
                </div>
                <div>
                  <strong>Store Counter & WhatsApp</strong>
                  <p><a href={`tel:${STORE_INFO.phone}`}>{STORE_INFO.phone}</a></p>
                  <p><a href={`tel:${STORE_INFO.altPhone}`}>{STORE_INFO.altPhone}</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="ci-icon">
                  <Mail size={20} />
                </div>
                <div>
                  <strong>Store Email</strong>
                  <p><a href={`mailto:${STORE_INFO.email}`}>{STORE_INFO.email}</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="ci-icon">
                  <Clock size={20} />
                </div>
                <div>
                  <strong>Operating Hours</strong>
                  <p>{STORE_INFO.workingHours}</p>
                  <p>{STORE_INFO.sundayHours}</p>
                </div>
              </div>
            </div>

            {/* Direct Map & WhatsApp Actions */}
            <div className="contact-quick-actions">
              <a
                href={STORE_INFO.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-block map-btn"
              >
                <Navigation size={16} /> Open in Google Maps ↗
              </a>
              <a
                href={STORE_INFO.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-block whatsapp-cta-btn"
              >
                <MessageSquare size={16} /> WhatsApp Store Person Directly
              </a>
            </div>
          </div>

          {/* Doorstep Service Coverage Card */}
          <div className="coverage-card">
            <div className="coverage-header">
              <Navigation size={20} className="nav-icon" />
              <div>
                <h4>Coimbatore Doorstep Technician Service</h4>
                <p>Unable to visit Tatabad? Our mobile service technician visits:</p>
              </div>
            </div>
            <div className="coverage-pills">
              {coverageAreas.map((area, idx) => (
                <span key={idx} className="cov-pill">
                  <CheckCircle2 size={13} /> {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Quote Form */}
        <div className="contact-form-col">
          <div className="form-container-card">
            {submitted ? (
              <div className="contact-success-state animate-fadeIn">
                <div className="success-icon-box">
                  <CheckCircle2 size={48} />
                </div>
                <h3>Inquiry Received at Store Desk!</h3>
                <p>
                  Thank you, <strong>{formData.name}</strong>. Your inquiry has been routed directly to our Tatabad counter.
                  A store technician will contact you at <strong>{formData.phone}</strong> shortly.
                </p>
                <div className="success-actions">
                  <a
                    href={`${STORE_INFO.social.whatsapp}?text=Hi%20Techvick,%20I%20just%20submitted%20an%20inquiry%20regarding%20${encodeURIComponent(formData.message)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary whatsapp-cta-btn"
                  >
                    <MessageSquare size={16} /> Chat on WhatsApp Now
                  </a>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'general',
                        message: '',
                      });
                    }}
                  >
                    Send Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3>Send Us a Request / Inquire About Stock</h3>
                <p className="form-subtext">
                  No login required. Enter your contact details and our technicians will assist you.
                </p>

                <div className="form-group-grid">
                  <div className="form-field">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Kumar"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Mobile Number (For Call / WhatsApp) *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98422 12345"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-grid">
                  <div className="form-field">
                    <label>Email Address (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                    />
                  </div>

                  <div className="form-field">
                    <label>Inquiry Purpose</label>
                    <select name="subject" value={formData.subject} onChange={handleChange}>
                      <option value="laptop_inquiry">New / Used Laptop Purchase</option>
                      <option value="repair_quote">Hardware / Chip-Level Repair Quote</option>
                      <option value="ssd_upgrade">SSD / RAM Speed Upgrade</option>
                      <option value="pc_build">Custom PC Rig Assembly</option>
                      <option value="cctv_printer">CCTV Surveillance / Printer Service</option>
                      <option value="data_recovery">Hard Drive Data Recovery</option>
                      <option value="general">Other Technical Support</option>
                    </select>
                  </div>
                </div>

                <div className="form-field full-width">
                  <label>Describe Your Device Model & Requirement *</label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="e.g., Looking for a Dell Core i5 refurbished laptop under ₹20,000 OR My HP laptop screen is flickering..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg submit-btn"
                  disabled={isSubmitting}
                >
                  <Send size={18} />
                  {isSubmitting ? 'Submitting to Store Desk...' : 'Send Inquiry to Store Desk'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
