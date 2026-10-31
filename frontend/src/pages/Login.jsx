import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Lock, Mail, Phone, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const navigate = useNavigate();

  const { login, register, loginAsDemoAdmin, loginAsDemoCustomer, loading, user, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      navigate(redirectPath);
    } catch {
      // Error is toasted in AuthContext
    }
  };

  const handleDemoAdmin = async () => {
    await loginAsDemoAdmin();
    navigate(redirectPath === '/' ? '/admin' : redirectPath);
  };

  const handleDemoCustomer = async () => {
    await loginAsDemoCustomer();
    navigate(redirectPath);
  };

  return (
    <div className="login-page">
      <div className="container login-container">
        {user ? (
          /* Already Logged In Card */
          <div className="login-card already-logged-card">
            <div className="logged-avatar">
              {user.role === 'admin' ? <ShieldCheck size={40} /> : <User size={40} />}
            </div>
            <h2>Signed in as {user.name}</h2>
            <p className="logged-email">{user.email}</p>
            <div className="logged-role-badge">
              {user.role === 'admin' ? '👑 Store Administrator' : '👤 Customer / End User'}
            </div>

            <div className="logged-actions">
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-primary btn-block">
                  Go to Admin Dashboard <ArrowRight size={16} />
                </Link>
              )}
              <Link to="/products" className="btn btn-secondary btn-block">
                Browse Hardware Store
              </Link>
              <button onClick={logout} className="btn btn-outline btn-block" style={{ color: '#ef4444' }}>
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Authentication Card */
          <div className="login-card">
            {/* Quick Demo Access Bar */}
            <div className="demo-access-banner">
              <div className="demo-banner-title">
                <Sparkles size={16} />
                <span>Instant Demo Role Switcher</span>
              </div>
              <p className="demo-banner-sub">Test Role-Based Access Control in one click:</p>
              <div className="demo-buttons-grid">
                <button type="button" onClick={handleDemoAdmin} className="demo-btn admin-demo-btn">
                  <ShieldCheck size={16} />
                  <div>
                    <strong>Login as Admin</strong>
                    <span>Full CRUD & Store Control</span>
                  </div>
                </button>
                <button type="button" onClick={handleDemoCustomer} className="demo-btn customer-demo-btn">
                  <User size={16} />
                  <div>
                    <strong>Login as Customer</strong>
                    <span>Shop, Book Visits & Orders</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${!isRegister ? 'active' : ''}`}
                onClick={() => setIsRegister(false)}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab ${isRegister ? 'active' : ''}`}
                onClick={() => setIsRegister(true)}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {isRegister && (
                <div className="form-field">
                  <label>Full Name</label>
                  <div className="input-wrap">
                    <User size={18} className="field-icon" />
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-field">
                <label>Email Address</label>
                <div className="input-wrap">
                  <Mail size={18} className="field-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {isRegister && (
                <div className="form-field">
                  <label>Phone Number</label>
                  <div className="input-wrap">
                    <Phone size={18} className="field-icon" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <div className="form-field">
                <label>Password</label>
                <div className="input-wrap">
                  <Lock size={18} className="field-icon" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                {loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="role-explainer">
              <div className="re-col">
                <span className="re-title">👤 End User Permissions:</span>
                <ul>
                  <li><CheckCircle2 size={13} /> View hardware catalog & specs</li>
                  <li><CheckCircle2 size={13} /> Add products to cart & checkout</li>
                  <li><CheckCircle2 size={13} /> Book doorstep site visits & repairs</li>
                  <li><CheckCircle2 size={13} /> Check warranty & submit claims</li>
                </ul>
              </div>
              <div className="re-col">
                <span className="re-title">👑 Admin Permissions:</span>
                <ul>
                  <li><CheckCircle2 size={13} /> Add, edit & delete products (CRUD)</li>
                  <li><CheckCircle2 size={13} /> Manage customer orders & fulfillment</li>
                  <li><CheckCircle2 size={13} /> Assign technicians & update repair visits</li>
                  <li><CheckCircle2 size={13} /> Review & respond to contact inquiries</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
