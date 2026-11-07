import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ChevronLeft } from 'lucide-react';
import TechvickLogo from '../components/common/TechvickLogo';
import { STORE_INFO } from '../constants';
import './Login.css';

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';
  const navigate = useNavigate();

  const { login, loading, isStoreStaff, user, logout } = useAuth();

  const [email, setEmail] = useState('techvickcomputers@gmail.com');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(redirectPath);
    } catch {
      // Error toasted in AuthContext
    }
  };

  return (
    <div className="login-page">
      <div className="container login-container">
        {/* Back to Public Site link */}
        <div className="back-to-site-row">
          <Link to="/" className="back-link">
            <ChevronLeft size={16} /> Back to Customer Website
          </Link>
        </div>

        {isStoreStaff ? (
          /* Already Authenticated as Store Staff */
          <div className="login-card already-logged-card">
            <div className="logged-avatar">
              <ShieldCheck size={42} />
            </div>
            <h2>Techvick Store Staff Session Active</h2>
            <p className="logged-email">{user?.email || STORE_INFO.email}</p>
            <div className="logged-role-badge">
              🔐 {user?.name || 'Store Manager'} • Tatabad Store Desk
            </div>

            <p className="staff-session-notice">
              You have access to customer service bookings, quote requests, inventory and market price management.
            </p>

            <div className="logged-actions">
              <Link to="/admin" className="btn btn-primary btn-block">
                Open Store Management Dashboard <ArrowRight size={16} />
              </Link>
              <button onClick={logout} className="btn btn-outline btn-block" style={{ color: '#ef4444' }}>
                Sign Out of Staff Session
              </button>
            </div>
          </div>
        ) : (
          /* Store Staff Authentication Card */
          <div className="login-card">
            <div className="staff-card-header">
              <TechvickLogo size="md" showTagline={false} showLink={false} />
              <h2>Store Staff Portal</h2>
              <p className="staff-portal-desc">
                Restricted access for Techvick Computers counter staff, technicians, and store managers.
              </p>
            </div>

            {/* Credential Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Store Email</label>
                <div className="input-wrap">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="techvickcomputers@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Staff Access Key / Password</label>
                <div className="input-wrap">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter store staff key"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block auth-submit-btn"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign Into Store Portal'}
              </button>
            </form>

            <div className="store-portal-footer-notice">
              <span>ℹ️ Regular customers do not need an account. Customers can browse, book services, and contact store staff freely.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
