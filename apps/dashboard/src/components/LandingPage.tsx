import React from 'react';

interface LandingPageProps {
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header
        style={{
          height: '80px',
          padding: '0 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(251, 191, 36, 0.2)',
          background: 'rgba(6, 11, 24, 0.8)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0d47a1, #fbbf24)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '20px',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)',
            }}
          >
            ⚡
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>
              VMS <span style={{ color: '#fbbf24' }}>SOCKET</span>
            </h1>
            <span style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Real-Time SaaS Platform
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Features
          </a>
          <a href="#architecture" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Architecture
          </a>
          <a href="#security" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Tenant Isolation
          </a>
          <button onClick={onOpenLogin} className="btn-gold" style={{ padding: '10px 24px', fontSize: '14px' }}>
            Masuk / Login ➔
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: '100px 20px 80px 20px',
          maxWidth: '1200px',
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
            background: 'rgba(13, 71, 161, 0.3)',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            color: '#fbbf24',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '24px',
          }}
        >
          <span>✨</span> Platform WebSocket Gateway Terpusat Multi-Tenant
        </div>

        <h1
          style={{
            fontSize: '52px',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            maxWidth: '900px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #ffffff 40%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Infrastruktur Event Real-Time Berperforma Tinggi Untuk Berbagai Aplikasi
        </h1>

        <p
          style={{
            fontSize: '18px',
            color: '#94a3b8',
            maxWidth: '750px',
            lineHeight: 1.6,
            marginBottom: '40px',
          }}
        >
          Kelola komunikasi WebSocket antar project dengan aman. Dilengkapi <strong>Static API Token per Client</strong>, <strong>Isolasi Room Multi-Tenant</strong>, dan <strong>Event Bridge REST API</strong> berkecepatan tinggi.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={onOpenLogin} className="btn-gold" style={{ padding: '16px 36px', fontSize: '16px' }}>
            Buka Dashboard Platform 🚀
          </button>
          <a
            href="#features"
            className="btn-primary"
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
      <section id="features" style={{ padding: '60px 20px 100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#f8fafc' }}>
            Mengapa Menggunakan <span style={{ color: '#fbbf24' }}>VMS Socket</span>?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '8px' }}>
            Dirancang khusus untuk arsitektur Microservices dan Multi-Tenant SaaS Platform.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* Feature 1 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div
              style={{
                fontSize: '28px',
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'rgba(13, 71, 161, 0.4)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              🏢
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
              Multi-Tenant Application Management
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
              Daftarkan berbagai client dan aplikasi di dalam dashboard. Setiap aplikasi secara otomatis mendapatkan <strong>Static API Token</strong> unik (<code>app_token_live_...</code>) untuk otorisasi middleware.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div
              style={{
                fontSize: '28px',
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'rgba(217, 119, 6, 0.3)',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              🔒
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
              Strict Tenant Room Isolation
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
              Menjamin <strong>Zero Message Leakage</strong>. Room antar client diisolasi secara internal dengan format namespace <code>app:&lt;appId&gt;:room:&lt;namaRoom&gt;</code>, mencegah kebocoran data antar client.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div
              style={{
                fontSize: '28px',
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.3)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              ⚡
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
              REST-to-WebSocket Event Bridge
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
              Publish pesan real-time dari backend service apapun menggunakan HTTP POST (`/api/events/publish`), dan WebSocket Gateway akan secara langsung memancarkannya ke client terhubung.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          borderTop: '1px solid rgba(251, 191, 36, 0.2)',
          background: 'rgba(6, 11, 24, 0.9)',
          padding: '32px 40px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#64748b',
        }}
      >
        <p>© 2026 VMS Socket Real-Time Platform. Powered by Express, WebSocket Gateway, Prisma & React.</p>
      </footer>
    </div>
  );
};
