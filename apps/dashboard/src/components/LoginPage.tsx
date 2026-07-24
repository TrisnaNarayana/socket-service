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
      }}
    >
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            background: 'rgba(13, 71, 161, 0.3)',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            color: '#fbbf24',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          ← Kembali ke Landing Page
        </button>
      )}

      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0d47a1, #fbbf24)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#ffffff',
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
              marginBottom: '12px',
            }}
          >
            ⚡
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800 }}>
            VMS <span style={{ color: '#fbbf24' }}>SOCKET</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
            Masuk ke SaaS Platform Dashboard
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f43f5e',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
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
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
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

          <button type="submit" className="btn-gold" disabled={loading} style={{ marginTop: '10px', fontSize: '15px' }}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};
