import { Link } from 'react-router-dom';
import {
  Shield, Award, CheckCircle2, MapPin, Phone,
  Monitor, Cpu, ArrowRight, MessageSquare, Navigation
} from 'lucide-react';
import { STORE_INFO } from '../constants';
import BrandMarquee from '../components/common/BrandMarquee';
import StoreShowcase from '../components/common/StoreShowcase';
import AnimatedCounter from '../components/common/AnimatedCounter';
import './About.css';

export default function About() {
  const milestones = [
    {
      display: <AnimatedCounter end={10} suffix="+ Years" duration={1400} />,
      label: 'Computing & IT Hardware Expertise',
    },
    {
      display: <AnimatedCounter end={15000} suffix="+" separator duration={2000} />,
      label: 'Computers Serviced & Built in Coimbatore',
    },
    {
      display: <AnimatedCounter end={12} suffix=" Brands" duration={1200} />,
      label: 'Official Multi-Brand Spares & Service',
    },
    {
      display: <AnimatedCounter end={100} suffix="%" duration={1600} />,
      label: 'Written Store Warranty on Repairs',
    },
  ];

  const coreValues = [
    {
      title: 'Dedicated PC & IT Architecture Specialists',
      desc: 'We are 100% focused on computing architecture: laptops, desktops, Apple iMacs, enterprise workstations, laser printers, surveillance CCTV, and structured networking.',
      icon: <Monitor size={24} />,
    },
    {
      title: 'Component & Chip-Level Repair',
      desc: 'Instead of forcing you to purchase costly new motherboards, our trained technicians perform precision capacitor, MOSFET, and BGA rework at honest low costs.',
      icon: <Cpu size={24} />,
    },
    {
      title: 'Both Walk-in Counter & Doorstep Support',
      desc: 'Visit our walk-in store at 46, 8th Street, Tatabad, Gandhipuram, Coimbatore, or book our mobile technician for prompt doorstep repair at your home or workplace.',
      icon: <MapPin size={24} />,
    },
    {
      title: 'Taking Care of Your PC — Guaranteed Spares',
      desc: 'We stock only genuine spares from certified suppliers. Every replacement part and repair job is backed by official store warranty documentation.',
      icon: <Shield size={24} />,
    },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <span className="about-pill">
              <Award size={14} /> Coimbatore's PC Specialists
            </span>
            <h1>TECHVICK COMPUTERS</h1>
            <p className="about-tagline">"Taking Care of Your PC — Sales & Service"</p>
            <p className="about-subtext">
              Located at 46, 8th Street, Tatabad, Gandhipuram. Empowering students, professionals,
              gamers, and businesses across Coimbatore with honest hardware sales, certified used laptops,
              and low-cost chip-level repairs.
            </p>
            <div className="about-hero-actions">
              <a
                href={STORE_INFO.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-md"
              >
                <Navigation size={16} /> Open Store on Google Maps
              </a>
              <a
                href={STORE_INFO.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-md about-whatsapp-btn"
              >
                <MessageSquare size={16} /> WhatsApp Store Desk
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="stats-ribbon">
        <div className="container">
          <div className="stats-grid">
            {milestones.map((m, i) => (
              <div key={i} className="stat-card">
                <span className="stat-num">{m.display}</span>
                <span className="stat-lbl">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Location Showcase Component */}
      <StoreShowcase />

      {/* Story & Philosophy */}
      <section className="section story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-text">
              <div className="section-header left">
                <span className="sub-tag">Who We Are</span>
                <h2>Honest Technical Workmanship in Gandhipuram</h2>
              </div>
              <p>
                At Techvick Computers, our motto is simple: <strong>Taking Care of Your PC</strong>. We believe you should never have to discard a machine or overspend when an affordable component fix, a high-speed SSD upgrade, or fresh thermal cooling can make it run better than new.
              </p>
              <p>
                From certified refurbished corporate ThinkPads and Dell Latitudes to custom liquid-cooled gaming rigs and Apple iMacs, we treat every system with precision care and complete transparency.
              </p>
              <div className="highlight-quote">
                “No confusing technical jargon, no inflated bills. Just genuine diagnostics, fair prices, and prompt turnaround.”
              </div>
              <div className="story-checks">
                <div className="sc-item"><CheckCircle2 size={16} className="sc-icon" /> Multi-Brand Chip-level Hardware Technicians</div>
                <div className="sc-item"><CheckCircle2 size={16} className="sc-icon" /> Service for Sony, ASUS, MSI, HP, Apple, NVIDIA, AMD, Intel, Samsung, Dell, Acer, Lenovo</div>
                <div className="sc-item"><CheckCircle2 size={16} className="sc-icon" /> Convenient location on 8th Street, Tatabad with free parking</div>
              </div>
            </div>

            <div className="story-card-box">
              <div className="story-visual-card">
                <h3>Our Core Commitments</h3>
                <ul className="commitments-list">
                  <li>
                    <strong>Transparent Diagnosis:</strong> We open and inspect devices in front of you whenever possible, detailing the exact fault before starting work.
                  </li>
                  <li>
                    <strong>Online Market Price Match:</strong> Transparent prices benchmarked against real online rates like Amazon, plus included counter warranty and initial configuration.
                  </li>
                  <li>
                    <strong>Prompt Doorstep Visits:</strong> Mobile technician visits across RS Puram, Peelamedu, Gandhipuram, Saravanampatti, Saibaba Colony, and all Coimbatore localities.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partners */}
      <BrandMarquee title="12 Global Hardware Brands We Sell & Service in Store" />

      {/* Core Values */}
      <section className="section values-section">
        <div className="container">
          <div className="section-header">
            <span className="sub-tag">The Techvick Difference</span>
            <h2>Why Coimbatore Chooses Techvick Computers</h2>
          </div>
          <div className="values-grid">
            {coreValues.map((v, i) => (
              <div key={i} className="value-card">
                <div className="vc-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Contact CTA */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-card">
            <h2>Need Hardware Assistance or a Fast Repair Quote?</h2>
            <p>Our store person is ready to help you on WhatsApp or call.</p>
            <div className="about-cta-buttons">
              <a href={`tel:${STORE_INFO.phone}`} className="btn btn-outline btn-lg">
                <Phone size={18} /> Call {STORE_INFO.phone}
              </a>
              <Link to="/book-service" className="btn btn-primary btn-lg">
                Book a Service Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
