import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Search, CheckCircle2, AlertTriangle, Clock,
  FileText, MapPin, Phone, HelpCircle, ArrowRight, X, Sparkles
} from 'lucide-react';
import { servicesApi } from '../utils/api';
import toast from 'react-hot-toast';
import './Warranty.css';

export default function Warranty() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [claimOpen, setClaimOpen] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  const [claimForm, setClaimForm] = useState({
    faultDescription: '',
    claimType: 'doorstep_pickup', // or 'store_dropoff'
    contactPhone: '',
    pickupAddress: '',
  });

  const sampleSerials = [
    { label: 'HP Laptop (Active)', code: 'TM-LAP-2024-001' },
    { label: 'Epson Printer (Active)', code: 'TM-PRN-2024-089' },
    { label: 'CCTV Setup (3-Yr Active)', code: 'TM-CAM-2024-112' },
    { label: 'Dell Laptop (Expired)', code: 'TM-EXP-2022-999' },
  ];

  const handleSearch = async (searchQuery) => {
    const q = (searchQuery || query).trim();
    if (!q) {
      toast.error('Please enter a Serial Number or Invoice Number');
      return;
    }

    setLoading(true);
    try {
      const data = await servicesApi.checkWarranty(q);
      setResult(data);
      if (!data.found) {
        toast.error(data.message || 'No record found.');
      } else {
        toast.success('Warranty Record Found!');
      }
    } catch (err) {
      toast.error(err.message || 'Error checking warranty status');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimForm.faultDescription.trim() || !claimForm.contactPhone.trim()) {
      toast.error('Please fill in fault description and contact number');
      return;
    }
    setClaimSubmitted(true);
    toast.success('Warranty claim registered! Ticket: WCL-' + Math.floor(100000 + Math.random() * 900000));
  };

  return (
    <div className="warranty-page">
      {/* Header */}
      <section className="warranty-header">
        <div className="container">
          <div className="warranty-header-inner">
            <span className="warranty-pill">
              <Shield size={14} /> Official Store Warranty Portal
            </span>
            <h1>Check Product Warranty & Claim Coverage</h1>
            <p>
              Instantly verify your device warranty status using your TechMart serial number,
              invoice number, or registered phone number.
            </p>

            {/* Search Box */}
            <div className="warranty-search-card">
              <form
                className="warranty-search-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                <Search size={22} className="search-icon" />
                <input
                  type="text"
                  placeholder="Enter Serial Number (e.g. TM-LAP-2024-001) or Invoice Number..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-lg search-submit-btn" disabled={loading}>
                  {loading ? 'Checking...' : 'Check Warranty'}
                </button>
              </form>

              <div className="sample-queries">
                <span className="sample-label">
                  <Sparkles size={14} /> Try demo serial numbers:
                </span>
                <div className="sample-chips">
                  {sampleSerials.map((s) => (
                    <button
                      key={s.code}
                      type="button"
                      className="sample-chip"
                      onClick={() => {
                        setQuery(s.code);
                        handleSearch(s.code);
                      }}
                    >
                      {s.label} ({s.code})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Result Card */}
      {result && (
        <section className="warranty-result-section">
          <div className="container">
            {result.found ? (
              <div className="result-card active-card animate-fadeIn">
                <div className="result-top">
                  <div className="result-status-badge">
                    {result.status === 'Active' ? (
                      <span className="status-badge green">
                        <CheckCircle2 size={16} /> Warranty Active
                      </span>
                    ) : (
                      <span className="status-badge red">
                        <AlertTriangle size={16} /> Warranty Expired
                      </span>
                    )}
                  </div>
                  <span className="serial-display">Serial: {result.serialNumber}</span>
                </div>

                <div className="result-main-grid">
                  <div className="result-col">
                    <span className="col-sub">Product Name</span>
                    <h3>{result.productName}</h3>
                    <p className="product-category-sub">{result.category} Hardware</p>
                  </div>

                  <div className="result-col">
                    <span className="col-sub">Customer / Org</span>
                    <h4>{result.customerName}</h4>
                    <p className="phone-sub">{result.customerPhone}</p>
                  </div>

                  <div className="result-col">
                    <span className="col-sub">Invoice Number</span>
                    <h4>{result.invoiceNumber}</h4>
                    <p className="store-sub">{result.storeLocation}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="warranty-timeline">
                  <div className="timeline-dates">
                    <span>Purchased: {result.purchaseDate}</span>
                    <span className="days-left-highlight">
                      {result.status === 'Active'
                        ? `${result.remainingDays} Days Remaining`
                        : 'Expired — Renewal Available'}
                    </span>
                    <span>Valid Till: {result.expiryDate}</span>
                  </div>
                  <div className="timeline-bar-track">
                    <div
                      className={`timeline-bar-fill ${result.status === 'Active' ? 'green' : 'red'}`}
                      style={{
                        width: result.status === 'Active' ? '65%' : '100%',
                      }}
                    ></div>
                  </div>
                </div>

                <div className="coverage-scope-box">
                  <Shield size={18} className="scope-icon" />
                  <div>
                    <strong>Coverage Details:</strong> {result.coverage}
                  </div>
                </div>

                <div className="result-actions">
                  {result.status === 'Active' ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => setClaimOpen(true)}
                    >
                      Register Warranty Claim
                    </button>
                  ) : (
                    <Link to="/book-service" className="btn btn-primary">
                      Book Low-Cost Repair / AMC Renewal
                    </Link>
                  )}
                  <Link to="/contact" className="btn btn-secondary">
                    Contact Store Support
                  </Link>
                </div>
              </div>
            ) : (
              <div className="result-card not-found-card animate-fadeIn">
                <AlertTriangle size={48} className="not-found-icon" />
                <h3>No Matching Warranty Record</h3>
                <p>{result.message}</p>
                <div className="not-found-actions">
                  <Link to="/contact" className="btn btn-secondary">
                    Contact Store with Invoice Copy
                  </Link>
                  <Link to="/book-service" className="btn btn-primary">
                    Book Service Without Warranty
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Claim Modal */}
      {claimOpen && (
        <div className="modal-overlay" onClick={() => setClaimOpen(false)}>
          <div className="modal-container claim-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setClaimOpen(false)}>
              <X size={20} />
            </button>

            {claimSubmitted ? (
              <div className="claim-success-view">
                <CheckCircle2 size={56} className="claim-ok-icon" />
                <h2>Warranty Claim Submitted!</h2>
                <p>
                  Claim request for <strong>{result?.productName}</strong> has been assigned to our
                  warranty department. A service representative will contact you within 2 working hours.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setClaimOpen(false);
                    setClaimSubmitted(false);
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit}>
                <h3>Submit Warranty Claim</h3>
                <p className="claim-product-note">
                  Claim for: <strong>{result?.productName}</strong> (Serial: {result?.serialNumber})
                </p>

                <div className="form-field">
                  <label>Claim Mode</label>
                  <select
                    value={claimForm.claimType}
                    onChange={(e) => setClaimForm({ ...claimForm, claimType: e.target.value })}
                  >
                    <option value="doorstep_pickup">Doorstep Pickup by Technician (Site Visit)</option>
                    <option value="store_dropoff">Drop-off at Offline Store Counter</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Describe the Hardware Defect *</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what stopped working or symptoms..."
                    value={claimForm.faultDescription}
                    onChange={(e) => setClaimForm({ ...claimForm, faultDescription: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="form-field">
                  <label>Contact Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={claimForm.contactPhone}
                    onChange={(e) => setClaimForm({ ...claimForm, contactPhone: e.target.value })}
                    required
                  />
                </div>

                {claimForm.claimType === 'doorstep_pickup' && (
                  <div className="form-field">
                    <label>Pickup Address</label>
                    <input
                      type="text"
                      placeholder="Enter address for technician visit"
                      value={claimForm.pickupAddress}
                      onChange={(e) => setClaimForm({ ...claimForm, pickupAddress: e.target.value })}
                    />
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setClaimOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Claim
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Warranty Policy Guidelines */}
      <section className="section warranty-policies">
        <div className="container">
          <div className="section-header">
            <h2>TechMart Warranty & Guarantee Standards</h2>
            <p>We pride ourselves on transparent, hassle-free warranty backing</p>
          </div>

          <div className="policy-cards-grid">
            <div className="policy-card">
              <div className="policy-icon blue">
                <Shield size={24} />
              </div>
              <h4>Brand Warranty Coverage</h4>
              <p>
                All brand-new laptops, desktops, printers, and CCTV equipment carry 1 to 3 years of
                official manufacturer and store on-site warranty.
              </p>
            </div>

            <div className="policy-card">
              <div className="policy-icon green">
                <Clock size={24} />
              </div>
              <h4>90-Day Post-Repair Guarantee</h4>
              <p>
                Every chip-level repair, motherboard fix, and component replacement completed by TechMart
                is protected with our unconditional 90-day service warranty.
              </p>
            </div>

            <div className="policy-card">
              <div className="policy-icon amber">
                <MapPin size={24} />
              </div>
              <h4>Doorstep Warranty Pickup</h4>
              <p>
                For desktops, heavy laser printers, and CCTV DVRs under active warranty, our technician
                visits your premises so you don’t have to lug heavy equipment.
              </p>
            </div>

            <div className="policy-card">
              <div className="policy-icon purple">
                <FileText size={24} />
              </div>
              <h4>Paperless Cloud Record</h4>
              <p>
                Lost your printed bill? No problem! Every purchase is digitally cataloged in our cloud
                database linked to your mobile number and device serial number.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
