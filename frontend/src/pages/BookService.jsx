import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Home, MapPin, CheckCircle2,
  Shield, Phone, ArrowRight
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
    { id: 'laptop', name: 'Laptop (New / Used)', icon: '💻' },
    { id: 'desktop', name: 'Desktop PC / Custom Rig', icon: '🖥️' },
    { id: 'imac', name: 'Apple iMac / Mac Mini', icon: '🍏' },
    { id: 'printer', name: 'Printer / Cartridge', icon: '🖨️' },
    { id: 'cctv', name: 'CCTV & Security System', icon: '📷' },
    { id: 'networking', name: 'Network / Data Recovery', icon: '💾' },
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
      const payload = {
        service_mode: formData.serviceMode,
        service_type: formData.serviceMode,
        device_type: formData.deviceType,
        device_brand: formData.brand.trim(),
        device_model: formData.model.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        issue_category: formData.issueCategory,
        issue_description: formData.issueDescription?.trim() || `${formData.brand} ${formData.model} diagnostic inspection requested.`,
        customer_name: formData.customerName.trim(),
        customer_phone: formData.customerPhone.trim(),
        customer_email: formData.customerEmail?.trim() || '',
        address: formData.address.trim(),
        landmark: formData.landmark.trim(),
        preferred_date: formData.preferredDate,
        preferred_time_slot: formData.preferredTimeSlot,
        urgency: formData.urgency,
        estimated_cost: 0,
        notes: preselectedService ? [`Requested: ${preselectedService}`] : [],
      };

      const result = await servicesApi.createRequest(payload);
      setBookingConfirmed({
        ticketNumber: result.ticket_number || 'SRV-' + Math.floor(100000 + Math.random() * 900000),
        estimatedCost: 'Free Assessment (Quote on Diagnosis)',
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
                <span className="cd-val highlight">{bookingConfirmed.estimatedCost}</span>
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
                      <span className="mode-price-note">Coimbatore Doorstep Inspection • Free Assessment</span>
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
                        <h4>Tatabad Store Drop-off</h4>
                        <span className="mode-tag blue">Zero Visit Charge</span>
                      </div>
                      <p>Bring your device to Techvick Computers at 46, 8th Street, Tatabad, Gandhipuram, Coimbatore.</p>
                      <span className="mode-price-note">Free initial inspection & component check</span>
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
                <h3>Assessment & Warranty</h3>
                <p className="estimate-sub">Zero advance fees • Free counter diagnosis</p>

                <div className="estimate-breakdown">
                  <div className="est-line">
                    <span>Counter / Initial Inspection:</span>
                    <span className="green">FREE (₹0)</span>
                  </div>

                  {formData.serviceMode === 'site_visit' ? (
                    <div className="est-line">
                      <span>Doorstep Site Visit:</span>
                      <span className="green">Free Counter Assessment</span>
                    </div>
                  ) : (
                    <div className="est-line">
                      <span>Store Drop-off:</span>
                      <span className="green">FREE (₹0)</span>
                    </div>
                  )}

                  <div className="est-total-line">
                    <span>Initial Amount:</span>
                    <span className="total-amount" style={{ fontSize: '1.05rem', color: '#10b981' }}>₹0 (No Advance)</span>
                  </div>
                </div>

                <div className="guarantee-points">
                  <div className="gp-item">
                    <CheckCircle2 size={16} />
                    <span>No charge if device is deemed unrepairable</span>
                  </div>
                  <div className="gp-item">
                    <Shield size={16} />
                    <span>90-Day Techvick Repair Warranty</span>
                  </div>
                  <div className="gp-item">
                    <CheckCircle2 size={16} />
                    <span>Exact quote given after physical inspection</span>
                  </div>
                </div>

                <div className="store-hotline-box">
                  <Phone size={18} />
                  <div>
                    <span className="hl-label">Tatabad Service Desk</span>
                    <span className="hl-num">8807023322 / 8807015780</span>
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
