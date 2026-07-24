import React from 'react';

export type DashboardView = 'overview' | 'socket_gateway' | 'applications' | 'guide';

interface SidebarProps {
  activeView: DashboardView;
  onSelectView: (view: DashboardView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onSelectView }) => {
  return (
    <aside className="sidebar">
      {/* Brand Logo */}
      <div style={{ padding: '0 8px', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          VMS <span style={{ color: '#3b82f6' }}>Socket</span>
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '2px' }}>
          Real-Time Monorepo Platform
        </p>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
          onClick={() => onSelectView('overview')}
        >
          <span>🌐</span>
          <span>Overview & Global Tester</span>
        </button>

        <button
          className={`nav-item ${activeView === 'socket_gateway' ? 'active' : ''}`}
          onClick={() => onSelectView('socket_gateway')}
        >
          <span>⚡</span>
          <span>Multi-Project Gateway</span>
        </button>

        <button
          className={`nav-item ${activeView === 'applications' ? 'active' : ''}`}
          onClick={() => onSelectView('applications')}
        >
          <span>🔑</span>
          <span>Applications & SaaS Setup</span>
        </button>

        <button
          className={`nav-item ${activeView === 'guide' ? 'active' : ''}`}
          onClick={() => onSelectView('guide')}
        >
          <span>📘</span>
          <span>Manual Guide & How To Use</span>
        </button>
      </nav>

      {/* Footer Info */}
      <div style={{ marginTop: 'auto', padding: '16px 8px 0 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '11px', color: '#6b7280' }}>Environment: NodeNext / Vite</div>
        <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>● System Operational</div>
      </div>
    </aside>
  );
};
