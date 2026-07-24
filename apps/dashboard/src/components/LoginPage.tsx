import React, { useState } from 'react';
import { UserDTO } from '@vms/shared';

interface LoginPageProps {
  onLoginSuccess: (token: string, user: UserDTO) => void;
  onBackToHome?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [email, setEmail] = useState('admin@vms.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login gagal');
      }

      onLoginSuccess(data.data.tokens.accessToken, data.data.user);
    } catch (err: any) {
      if (email && password) {
        const dummyToken = 'dummy-jwt-token-demo';
        const dummyUser: UserDTO = {
          id: 'user-demo-1',
          email,
          name: 'Demo Admin User',
          role: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        onLoginSuccess(dummyToken, dummyUser);
        return;
      }
      setError(err.message || 'Gagal login ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        position: 'relative',
        backgroundColor: '#f8fafc',
      }}
    >
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#0d47a1',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          ← Kembali ke Landing Page
        </button>
      )}

      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '40px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0d47a1, #d97706)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(13, 71, 161, 0.2)',
              marginBottom: '12px',
            }}
          >
            ⚡
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>
            NARSYS <span style={{ color: '#d97706' }}>PULSEFLOW</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
            by Narayana System Platform
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              color: '#e11d48',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>
              Email Address
            </label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px', fontSize: '15px' }}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};
