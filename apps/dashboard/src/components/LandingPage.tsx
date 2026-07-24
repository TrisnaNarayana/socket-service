import React from 'react';

interface LandingPageProps {
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* Top Navbar */}
      <header
        style={{
          height: '76px',
          padding: '0 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0d47a1, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '18px',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(13, 71, 161, 0.2)',
            }}
          >
            ⚡
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>
              NARSYS <span style={{ color: '#d97706' }}>PULSEFLOW</span>
            </h1>
            <span style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>
              by Narayana System
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#475569', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Features
          </a>
          <a href="#architecture" style={{ color: '#475569', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Architecture
          </a>
          <a href="#security" style={{ color: '#475569', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Tenant Isolation
          </a>
          <button onClick={onOpenLogin} className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
            Masuk / Login ➔
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '90px 20px 70px 20px',
          maxWidth: '1100px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '30px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#0d47a1',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '24px',
          }}
        >
          <span>✨</span> NARSYS PULSEFLOW – Real-Time Multi-Tenant Gateway
        </div>

        <h1
          style={{
            fontSize: '52px',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            maxWidth: '900px',
            marginBottom: '24px',
            color: '#0f172a',
          }}
        >
          Infrastruktur Event Real-Time Minimalis & Berperforma Tinggi
        </h1>

        <p
          style={{
            fontSize: '18px',
            color: '#475569',
            maxWidth: '750px',
            lineHeight: 1.6,
            marginBottom: '40px',
          }}
        >
          Kelola komunikasi WebSocket antar project dengan aman dan elegan. Dilengkapi <strong>Static API Token per Client</strong>, <strong>Isolasi Room Multi-Tenant</strong>, dan <strong>Event Bridge REST API</strong> berkecepatan tinggi oleh Narayana System.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={onOpenLogin} className="btn-primary" style={{ padding: '16px 36px', fontSize: '16px' }}>
            Buka Dashboard Platform 🚀
          </button>
          <a
            href="#features"
            className="btn-gold"
            style={{
              padding: '16px 32px',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Pelajari Fitur 📘
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '40px 20px 90px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>
            Mengapa Menggunakan <span style={{ color: '#0d47a1' }}>NARSYS PULSEFLOW</span>?
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginTop: '8px' }}>
            Arsitektur bersih Apple-style untuk Microservices dan Multi-Tenant SaaS Platform.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Feature 1 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div
              style={{
                fontSize: '24px',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: '#0d47a1',
              }}
            >
              🏢
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>
              Multi-Tenant Application Management
            </h3>
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
              Daftarkan berbagai client dan aplikasi di dalam dashboard. Setiap aplikasi secara otomatis mendapatkan <strong>Static API Token</strong> unik (<code>app_token_live_...</code>) untuk otorisasi middleware.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div
              style={{
                fontSize: '24px',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: '#fffbeb',
                border: '1px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: '#d97706',
              }}
            >
              🔒
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>
              Strict Tenant Room Isolation
            </h3>
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
              Menjamin <strong>Zero Message Leakage</strong>. Room antar client diisolasi secara internal dengan format namespace <code>app:&lt;appId&gt;:room:&lt;namaRoom&gt;</code>, mencegah kebocoran data antar client.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div
              style={{
                fontSize: '24px',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: '#059669',
              }}
            >
              ⚡
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>
              REST-to-WebSocket Event Bridge
            </h3>
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
              Publish pesan real-time dari backend service apapun menggunakan HTTP POST (<code>/api/events/publish</code>), dan WebSocket Gateway akan secara langsung memancarkannya ke client terhubung.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff',
          padding: '28px 40px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#64748b',
        }}
      >
        <p>© 2026 NARSYS PULSEFLOW Real-Time Infrastructure Platform by <strong>Narayana System (Narsys)</strong>. All rights reserved.</p>
      </footer>
    </div>
  );
};
