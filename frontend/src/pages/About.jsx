import { Link } from 'react-router-dom';
import {
  Shield, Award, Users, CheckCircle2, MapPin, Phone,
  Wrench, Monitor, Cpu, HeartHandshake, Zap, ArrowRight
} from 'lucide-react';
import { STORE_INFO } from '../constants';
import './About.css';

export default function About() {
  const milestones = [
    { number: '10,000+', label: 'Satisfied Customers' },
    { number: '12,500+', label: 'Laptops & PCs Repaired' },
    { number: '850+', label: 'CCTV Systems Installed' },
    { number: '90 Days', label: 'Unconditional Repair Guarantee' },
  ];

  const coreValues = [
    {
      title: 'Dedicated IT Specialists (No Mobile Phones)',
      desc: 'Unlike generic phone recharge booths, we are 100% focused on computing architecture: laptops, desktops, enterprise servers, laser printers, surveillance, and structured networking.',
      icon: <Monitor size={26} />,
    },
    {
      title: 'Affordable & Honest Pricing',
      desc: 'We believe premium technology care should not burn a hole in your pocket. Component-level repair allows us to fix your existing motherboard instead of charging you for an expensive replacement.',
      icon: <HeartHandshake size={26} />,
    },
    {
      title: 'Both Offline Store & Doorstep Site Visits',
      desc: 'Visit our modern physical showroom to test products hands-on, or book our mobile technician van for doorstep service right at your residence or commercial office.',
      icon: <MapPin size={26} />,
    },
    {
      title: 'Uncompromised Quality & Warranty',
      desc: 'We stock only 100% genuine spares from certified vendors. Every product and repair service comes with written warranty documentation and cloud backup.',
      icon: <Shield size={26} />,
    },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <span className="about-pill">
              <Award size={14} /> Since 2014 — Over a Decade of IT Excellence
            </span>
            <h1>Your Trusted Computer, Printer & Surveillance Specialist</h1>
            <p>
              Empowering homes, offices, schools, and enterprises with reliable hardware sales,
              transparent low-cost chip-level repairs, and prompt doorstep site visit support.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="stats-ribbon">
        <div className="container">
          <div className="stats-grid">
            {milestones.map((m, i) => (
              <div key={i} className="stat-card">
                <span className="stat-num">{m.number}</span>
                <span className="stat-lbl">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="section story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-text">
              <div className="section-header left">
                <span className="sub-tag">Who We Are</span>
                <h2>Built on Integrity, Tech Passion & Genuine Service</h2>
              </div>
              <p>
                Founded with a straightforward mission: to provide honest, cost-effective computing
                and electronics sales & service without confusing technical jargon or inflated markups.
              </p>
              <p>
                While mobile phone retailers are everywhere, serious computer users, designers,
                businesses, and institutions need genuine specialists who understand thermal dissipation,
                RAM timings, BGA rework, RAID configurations, and structured network topology.
              </p>
              <div className="highlight-quote">
                “We never ask you to replace a whole computer when a ₹499 chip repair or an SSD upgrade can make it fly like new again.”
              </div>
              <div className="story-checks">
                <div className="sc-item"><CheckCircle2 size={16} /> Certified Chip-level Hardware Engineers</div>
                <div className="sc-item"><CheckCircle2 size={16} /> Clean Room Diagnostic Lab with Anti-static ESD Protection</div>
                <div className="sc-item"><CheckCircle2 size={16} /> Direct Authorized Partner for HP, Dell, Lenovo, Epson, CP PLUS</div>
              </div>
            </div>

            <div className="story-visual">
              <div className="story-card-stack">
                <div className="stack-card card-1">
                  <Cpu size={32} />
                  <h4>Precision Lab</h4>
                  <p>BGA reworking station, ultrasonic cleaner & oscilloscope diagnostics.</p>
                </div>
                <div className="stack-card card-2">
                  <MapPin size={32} />
                  <h4>Walk-In Store</h4>
                  <p>{STORE_INFO.address}, {STORE_INFO.city}</p>
                </div>
                <div className="stack-card card-3">
                  <Wrench size={32} />
                  <h4>Mobile Site Fleet</h4>
                  <p>Dedicated field engineers dispatched across city pin codes within hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section values-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Customers Rely On TechMart</h2>
            <p>Our core commitments to every client who walks through our door or calls our helpline</p>
          </div>

          <div className="values-grid">
            {coreValues.map((val, idx) => (
              <div key={idx} className="value-box">
                <div className="val-icon-bubble">{val.icon}</div>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offline Store & Site Visit Highlights */}
      <section className="section visit-section">
        <div className="container">
          <div className="visit-box">
            <div className="visit-left">
              <h2>Experience TechMart Today</h2>
              <p>
                Visit our showroom counter to explore new and certified refurbished laptops,
                or book a technician to resolve your IT troubles at your doorstep.
              </p>
              <div className="visit-contact-pills">
                <div className="v-pill">
                  <MapPin size={16} />
                  <span>{STORE_INFO.address}</span>
                </div>
                <div className="v-pill">
                  <Phone size={16} />
                  <span>{STORE_INFO.phone}</span>
                </div>
              </div>
            </div>
            <div className="visit-right">
              <Link to="/products" className="btn btn-secondary btn-lg">
                Browse Products
              </Link>
              <Link to="/book-service" className="btn btn-primary btn-lg">
                Book a Site Visit <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
