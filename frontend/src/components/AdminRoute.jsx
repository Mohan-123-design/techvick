import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { user, isAdmin, isAuthenticated, loginAsDemoAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="section container" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            maxWidth: '560px',
            background: 'var(--bg-card)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-2xl)',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <ShieldAlert size={40} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Admin Access Restricted
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            You are currently signed in as <strong>{user?.name || user?.email}</strong> with standard{' '}
            <span style={{ color: '#60a5fa', fontWeight: 600 }}>End User / Customer</span> privileges.
            The Admin Portal is reserved for store managers to edit products, manage orders, and control service requests.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '340px', margin: '0 auto' }}>
            <button
              onClick={() => loginAsDemoAdmin()}
              className="btn btn-primary btn-block"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <KeyRound size={16} /> Switch to Demo Admin Account
            </button>
            <Link to="/" className="btn btn-secondary btn-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={16} /> Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
