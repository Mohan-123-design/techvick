import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Wrench, Home, MapPin, Calendar, Clock, CheckCircle2,
  AlertCircle, Shield, Phone, ArrowRight, User, Mail, FileText
} from 'lucide-react';
import { servicesApi } from '../utils/api';
import toast from 'react-hot-toast';
import './BookService.css';

export default function BookService() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';

  const [formData, setFormData] = useState({
    serviceMode: 'site_visit', // 'site_visit' or 'in_store'
    deviceType: 'laptop',
    brand: '',
    model: '',
    issueCategory: 'general_repair',
    issueDescription: '',
    urgency: 'standard', // 'standard' or 'urgent'
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    landmark: '',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferredTimeSlot: '10:00 AM - 01:00 PM',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  const deviceTypes = [
    { id: 'laptop', name: 'Laptop', icon: '💻', baseCost: 299 },
    { id: 'desktop', name: 'Desktop PC / All-in-One', icon: '🖥️', baseCost: 299 },
    { id: 'printer', name: 'Printer / Scanner', icon: '🖨️', baseCost: 249 },
    { id: 'cctv', name: 'CCTV / Security Camera', icon: '📷', baseCost: 399 },
    { id: 'server', name: 'Server / Storage', icon: '🗄️', baseCost: 899 },
    { id: 'networking', name: 'Network Router / Switch', icon: '🌐', baseCost: 349 },
  ];

  const issueCategories = [
    { id: 'general_repair', name: 'Not Turning On / Power Fault' },
    { id: 'screen_display', name: 'Screen Broken / Display Blank / Lines' },
    { id: 'slow_upgrade', name: 'Slow Performance / SSD & RAM Upgrade' },
    { id: 'os_software', name: 'OS Corrupted / Virus / Blue Screen' },
    { id: 'overheating', name: 'Overheating / Fan Noise / Shutdown' },
    { id: 'printer_jam', name: 'Printer Paper Jam / Blank Print / Cartridge Refill' },
    { id: 'cctv_offline', name: 'CCTV Offline / No Video / Storage Error' },
    { id: 'data_recovery', name: 'Data Recovery from Damaged Disk' },
  ];

  // Dynamic cost calculation
  const calculateEstimate = () => {
    const selectedDev = deviceTypes.find((d) => d.id === formData.deviceType) || deviceTypes[0];
    let total = selectedDev.baseCost;

    if (formData.serviceMode === 'site_visit') {
      total += 199; // Doorstep technician travel & diagnostic fee
    }

    if (formData.urgency === 'urgent') {
      total += 250; // Priority express 2-hour dispatch
    }

    return total;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName.trim() || !formData.customerPhone.trim()) {
      toast.error('Please enter your Name and Phone Number');
      return;
    }

    if (formData.serviceMode === 'site_visit' && !formData.address.trim()) {
      toast.error('Please enter your Doorstep Address for the technician visit');
      return;
    }

    setIsSubmitting(true);
    try {
      const estimated = calculateEstimate();
      const payload = {
        ...formData,
        estimated_cost: estimated,
        notes: preselectedService ? `Requested: ${preselectedService}` : '',
      };

      const result = await servicesApi.createRequest(payload);
      setBookingConfirmed({
        ticketNumber: result.ticket_number || 'SRV-' + Math.floor(100000 + Math.random() * 900000),
        estimatedCost: estimated,
        ...formData,
      });
      toast.success('Service Request Booked Successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit service request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="book-service-page">
      <div className="container">
        {/* Header */}
        <div className="book-header">
          <span className="book-badge">
            <Shield size={14} /> 90-Day Repair Guarantee on All Work
          </span>
          <h1>Book a Service or Site Visit</h1>
          <p>
            Choose between dropping off at our offline store or having a certified technician visit your home or office.
            <span className="no-mobiles-alert">Strictly Computers, Printers, Cameras & IT Gear (No mobile phones)</span>
          </p>
        </div>

        {bookingConfirmed ? (
          /* Confirmation Success Card */
          <div className="confirmation-card animate-fadeIn">
            <div className="confirm-icon-wrap">
              <CheckCircle2 size={48} className="confirm-check" />
            </div>
            <h2>Service Appointment Confirmed!</h2>
            <p className="confirm-sub">
              Your service ticket has been created and logged in our system. A technician has been allocated.
            </p>

            <div className="ticket-box">
              <span className="ticket-label">Tracking Ticket Number</span>
              <span className="ticket-code">{bookingConfirmed.ticketNumber}</span>
              <p className="ticket-note">Please save this ticket code for tracking and warranty records.</p>
            </div>

            <div className="confirm-details-grid">
              <div className="confirm-detail">
                <span className="cd-label">Service Type:</span>
                <span className="cd-val">
                  {bookingConfirmed.serviceMode === 'site_visit'
                    ? '🏠 Doorstep Site Visit'
                    : '🏪 In-Store Drop-off'}
                </span>
              </div>
              <div className="confirm-detail">
                <span className="cd-label">Device:</span>
                <span className="cd-val">
                  {bookingConfirmed.deviceType.toUpperCase()} - {bookingConfirmed.brand} {bookingConfirmed.model}
                </span>
              </div>
              <div className="confirm-detail">
                <span className="cd-label">Scheduled Date:</span>
                <span className="cd-val">{bookingConfirmed.preferredDate}</span>
              </div>
              <div className="confirm-detail">
                <span className="cd-label">Time Slot:</span>
                <span className="cd-val">{bookingConfirmed.preferredTimeSlot}</span>
              </div>
              <div className="confirm-detail">
                <span className="cd-label">Estimated Diagnostic Cost:</span>
                <span className="cd-val highlight">₹{bookingConfirmed.estimatedCost}</span>
              </div>
              <div className="confirm-detail">
                <span className="cd-label">Contact:</span>
                <span className="cd-val">{bookingConfirmed.customerName} ({bookingConfirmed.customerPhone})</span>
              </div>
            </div>

            <div className="confirm-actions">
              <Link to="/warranty" className="btn btn-secondary">
                <Shield size={16} /> Check Existing Warranty
              </Link>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setBookingConfirmed(null);
                  setFormData((prev) => ({
                    ...prev,
                    brand: '',
                    model: '',
                    issueDescription: '',
                  }));
                }}
              >
                Book Another Device
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form & Live Summary */
          <div className="book-grid">
            <form className="book-form" onSubmit={handleSubmit}>
              {/* Step 1: Mode Selection */}
              <div className="form-section">
                <h3>1. Select How You Want the Service</h3>
                <div className="mode-toggle-grid">
                  <label
                    className={`mode-card ${formData.serviceMode === 'site_visit' ? 'active' : ''}`}
                    onClick={() => setFormData((prev) => ({ ...prev, serviceMode: 'site_visit' }))}
                  >
                    <input
                      type="radio"
                      name="serviceMode"
                      value="site_visit"
                      checked={formData.serviceMode === 'site_visit'}
                      onChange={handleChange}
                    />
                    <div className="mode-icon-box">
                      <Home size={24} />
                    </div>
                    <div className="mode-content">
                      <div className="mode-title-row">
                        <h4>Doorstep Site Visit</h4>
                        <span className="mode-tag green">Recommended</span>
                      </div>
                      <p>Technician comes to your home or office with diagnostic toolkit.</p>
                      <span className="mode-price-note">+ ₹199 doorstep convenience fee</span>
                    </div>
                  </label>

                  <label
                    className={`mode-card ${formData.serviceMode === 'in_store' ? 'active' : ''}`}
                    onClick={() => setFormData((prev) => ({ ...prev, serviceMode: 'in_store' }))}
                  >
                    <input
                      type="radio"
                      name="serviceMode"
                      value="in_store"
                      checked={formData.serviceMode === 'in_store'}
                      onChange={handleChange}
                    />
                    <div className="mode-icon-box">
                      <MapPin size={24} />
                    </div>
                    <div className="mode-content">
                      <div className="mode-title-row">
                        <h4>Offline Store Drop-off</h4>
                        <span className="mode-tag blue">Zero Travel Fee</span>
                      </div>
                      <p>Bring your device directly to our service counter at Main Road showroom.</p>
                      <span className="mode-price-note">Free counter diagnostic</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 2: Device Type */}
              <div className="form-section">
                <h3>2. Select Device Type</h3>
                <div className="device-selection-grid">
                  {deviceTypes.map((dev) => (
                    <button
                      type="button"
                      key={dev.id}
                      className={`device-btn ${formData.deviceType === dev.id ? 'active' : ''}`}
                      onClick={() => setFormData((prev) => ({ ...prev, deviceType: dev.id }))}
                    >
                      <span className="dev-icon">{dev.icon}</span>
                      <span className="dev-name">{dev.name}</span>
                      <span className="dev-cost">Base ₹{dev.baseCost}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Brand & Model */}
              <div className="form-section">
                <h3>3. Device Details & Problem</h3>
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Brand / Make *</label>
                    <input
                      type="text"
                      name="brand"
                      placeholder="e.g. HP, Dell, Lenovo, Epson, CP Plus"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Model Number / Serial (if known)</label>
                    <input
                      type="text"
                      name="model"
                      placeholder="e.g. Inspiron 15, EcoTank L3250"
                      value={formData.model}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Primary Issue Category</label>
                  <select
                    name="issueCategory"
                    value={formData.issueCategory}
                    onChange={handleChange}
                  >
                    {issueCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Describe the Problem / Symptoms</label>
                  <textarea
                    rows={3}
                    name="issueDescription"
                    placeholder="Provide details (e.g. blue screen error, strange fan noise, toner leaking, no display after restart)..."
                    value={formData.issueDescription}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="urgency-selector">
                  <label className="urgency-label">Service Speed</label>
                  <div className="urgency-options">
                    <label className={`urgency-opt ${formData.urgency === 'standard' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="urgency"
                        value="standard"
                        checked={formData.urgency === 'standard'}
                        onChange={handleChange}
                      />
                      <span>Standard Schedule (Same Day or Next Day)</span>
                    </label>
                    <label className={`urgency-opt ${formData.urgency === 'urgent' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="urgency"
                        value="urgent"
                        checked={formData.urgency === 'urgent'}
                        onChange={handleChange}
                      />
                      <span>Urgent / Emergency Dispatch (+₹250 within 2 hours)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 4: Contact & Appointment */}
              <div className="form-section">
                <h3>4. Your Contact & Appointment Slot</h3>
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Enter your name"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      placeholder="+91 98765 43210"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Email Address (For ticket updates)</label>
                  <input
                    type="email"
                    name="customerEmail"
                    placeholder="name@example.com"
                    value={formData.customerEmail}
                    onChange={handleChange}
                  />
                </div>

                {formData.serviceMode === 'site_visit' && (
                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Doorstep Address / House No. / Street *</label>
                      <input
                        type="text"
                        name="address"
                        placeholder="Complete house/office address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Nearby Landmark & Pincode</label>
                      <input
                        type="text"
                        name="landmark"
                        placeholder="e.g. Near Apollo Hospital, 600001"
                        value={formData.landmark}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Preferred Date</label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-field">
                    <label>Preferred Time Window</label>
                    <select
                      name="preferredTimeSlot"
                      value={formData.preferredTimeSlot}
                      onChange={handleChange}
                    >
                      <option value="10:00 AM - 01:00 PM">Morning (10:00 AM - 01:00 PM)</option>
                      <option value="01:00 PM - 04:00 PM">Afternoon (01:00 PM - 04:00 PM)</option>
                      <option value="04:00 PM - 07:30 PM">Evening (04:00 PM - 07:30 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg submit-book-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Confirming Appointment...' : 'Confirm Service Appointment'}
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Live Cost Estimate & Transparency Summary */}
            <aside className="estimate-sidebar">
              <div className="estimate-card">
                <h3>Live Estimate Summary</h3>
                <p className="estimate-sub">Transparent pricing with zero hidden costs</p>

                <div className="estimate-breakdown">
                  <div className="est-line">
                    <span>Base Diagnostic & Labor:</span>
                    <span>₹{deviceTypes.find((d) => d.id === formData.deviceType)?.baseCost || 299}</span>
                  </div>

                  {formData.serviceMode === 'site_visit' ? (
                    <div className="est-line">
                      <span>Doorstep Travel & Toolkit:</span>
                      <span className="green">+ ₹199</span>
                    </div>
                  ) : (
                    <div className="est-line">
                      <span>Store Drop-off:</span>
                      <span className="green">FREE</span>
                    </div>
                  )}

                  {formData.urgency === 'urgent' && (
                    <div className="est-line">
                      <span>2-Hour Priority Dispatch:</span>
                      <span className="accent">+ ₹250</span>
                    </div>
                  )}

                  <div className="est-total-line">
                    <span>Estimated Total:</span>
                    <span className="total-amount">₹{calculateEstimate()}</span>
                  </div>
                </div>

                <div className="guarantee-points">
                  <div className="gp-item">
                    <CheckCircle2 size={16} />
                    <span>No charge if device is deemed unrepairable</span>
                  </div>
                  <div className="gp-item">
                    <Shield size={16} />
                    <span>90-Day TechMart Repair Warranty</span>
                  </div>
                  <div className="gp-item">
                    <CheckCircle2 size={16} />
                    <span>Exact quote given before replacing any spare parts</span>
                  </div>
                </div>

                <div className="store-hotline-box">
                  <Phone size={18} />
                  <div>
                    <span className="hl-label">Direct Service Desk</span>
                    <span className="hl-num">+91 98765 43210</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
