import React from 'react';
import { UserDTO } from '@vms/shared';
import { DashboardView } from './Sidebar';

interface HeaderProps {
  user: UserDTO;
  status: string;
  activeView: DashboardView;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, status, activeView, onLogout }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'overview':
        return 'Overview & Global WebSocket Tester';
      case 'socket_gateway':
        return 'Multi-Project REST & Socket Event Gateway';
      case 'applications':
        return 'SaaS Client Applications & Static API Token Setup';
      case 'guide':
        return 'Developer Integration Manual & How To Use';
      default:
        return 'VMS Service Monitor';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'CONNECTED':
        return (
          <span className="badge badge-success">
            <span className="status-dot"></span> CONNECTED (WS LIVE)
          </span>
        );
      case 'CONNECTING':
        return (
          <span className="badge badge-warning">
            <span className="status-dot"></span> CONNECTING...
          </span>
        );
      case 'DISCONNECTED':
      default:
        return (
          <span className="badge badge-danger">
            <span className="status-dot"></span> DISCONNECTED
          </span>
        );
    }
  };

  return (
    <header className="header-bar">
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{getTitle()}</h2>
        <span style={{ color: '#9ca3af', fontSize: '12px' }}>
          Logged in as: <strong style={{ color: '#f3f4f6' }}>{user.name}</strong> ({user.role})
        </span>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {getStatusBadge()}
        <button
          onClick={onLogout}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f3f4f6',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};
