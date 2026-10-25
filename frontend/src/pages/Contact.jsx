import { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock, MessageSquare, Send,
  CheckCircle2, AlertCircle, Shield, Globe, Navigation
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
    'Central Business District (CBD)',
    'North IT Corridor & Tech Parks',
    'South Suburbs & Residential Enclaves',
    'East Industrial Zone',
    'West University & Medical Hub',
    'All Pincodes within 35 km radius',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error('Please enter your Name, Phone and Message');
      return;
    }

    setIsSubmitting(true);
    try {
      await usersApi.submitContact(formData);
      setSubmitted(true);
      toast.success('Your inquiry has been delivered! Our team will call you shortly.');
    } catch (err) {
      toast.error(err.message || 'Failed to send inquiry. Please try again.');
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
              <MapPin size={14} /> Offline Store + On-Site Technician Vans
            </span>
            <h1>Get In Touch With TechMart</h1>
            <p>
              Have a hardware question, need an urgent site visit, or want a customized corporate workstation quotation?
              Our sales & engineering team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      <div className="container contact-main-layout">
        {/* Left Column: Store Details & Map */}
        <div className="contact-info-col">
          <div className="info-card">
            <h3>Offline Store Showroom</h3>
            <p className="info-desc">
              Visit our air-conditioned showroom with demo laptops, custom desktop rigs, printers, and live CCTV display walls.
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
                </div>
              </div>

              <div className="contact-item">
                <div className="ci-icon">
                  <Phone size={20} />
                </div>
                <div>
                  <strong>Phone / WhatsApp</strong>
                  <p>
                    <a href={`tel:${STORE_INFO.phone}`}>{STORE_INFO.phone}</a> (Store Sales)
                  </p>
                  <p>
                    <a href={`tel:${STORE_INFO.altPhone}`}>{STORE_INFO.altPhone}</a> (Service Desk)
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="ci-icon">
                  <Mail size={20} />
                </div>
                <div>
                  <strong>Email Inquiries</strong>
                  <p><a href={`mailto:${STORE_INFO.email}`}>{STORE_INFO.email}</a></p>
                  <p><a href={`mailto:${STORE_INFO.supportEmail}`}>{STORE_INFO.supportEmail}</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="ci-icon">
                  <Clock size={20} />
                </div>
                <div>
                  <strong>Showroom Timings</strong>
                  <p>{STORE_INFO.workingHours}</p>
                  <p>{STORE_INFO.sundayHours}</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct Action */}
            <a
              href={STORE_INFO.social.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-cta-btn"
            >
              <MessageSquare size={18} /> Chat Directly on WhatsApp
            </a>
          </div>

          {/* Site Visit Coverage Card */}
          <div className="coverage-card">
            <div className="coverage-header">
              <Navigation size={20} className="nav-icon" />
              <div>
                <h4>Site Visit Coverage Area</h4>
                <p>Our mobile field service engineers cover:</p>
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
                <h3>Message Sent Successfully!</h3>
                <p>
                  Thank you for reaching out, <strong>{formData.name}</strong>. A dedicated
                  TechMart consultant will contact you at <strong>{formData.phone}</strong> within 2 hours.
                </p>
                <button
                  className="btn btn-primary"
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
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3>Send Us an Inquiry / Request a Quote</h3>
                <p className="form-subtext">
                  Fill in your details below and our hardware technical team will respond promptly.
                </p>

                <div className="form-group-grid">
                  <div className="form-field">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label>Purpose of Inquiry</label>
                  <select name="subject" value={formData.subject} onChange={handleChange}>
                    <option value="general">General Inquiry</option>
                    <option value="laptop_pc_buy">Buying Laptops / Desktops</option>
                    <option value="bulk_order">Corporate / Bulk School Hardware Order</option>
                    <option value="repair_quote">Repair Estimate / Diagnostics</option>
                    <option value="cctv_quote">CCTV Installation Quotation</option>
                    <option value="amc">Annual Maintenance Contract (AMC)</option>
                    <option value="site_visit">Urgent Site Visit Request</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Your Requirements / Message *</label>
                  <textarea
                    rows={4}
                    name="message"
                    placeholder="Tell us what you are looking for (specs, quantity, issue symptoms, delivery requirements)..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg submit-contact-btn"
                  disabled={isSubmitting}
                >
                  <Send size={18} />
                  {isSubmitting ? 'Sending Inquiry...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
