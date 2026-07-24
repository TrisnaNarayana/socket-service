import React from 'react';

export interface DashboardLog {
  id: string;
  type: 'in' | 'out' | 'rest_out' | 'system' | 'error';
  message: string;
  timestamp: string;
}

interface LiveFeedPanelProps {
  logs: DashboardLog[];
  onClear: () => void;
}

export const LiveFeedPanel: React.FC<LiveFeedPanelProps> = ({ logs, onClear }) => {
  const getBadgeStyle = (type: DashboardLog['type']) => {
    switch (type) {
      case 'in':
        return { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', label: 'WS INBOUND', color: '#34d399' };
      case 'out':
        return { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', label: 'WS OUTBOUND', color: '#60a5fa' };
      case 'rest_out':
        return { bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', label: 'REST OUTBOUND', color: '#c084fc' };
      case 'error':
        return { bg: 'rgba(244, 63, 94, 0.15)', border: '#f43f5e', label: 'ERROR', color: '#fb7185' };
      case 'system':
      default:
        return { bg: 'rgba(255, 255, 255, 0.08)', border: '#6b7280', label: 'SYSTEM', color: '#9ca3af' };
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>📡 Live Socket & API Feed Stream</h3>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>
            Real-Time Monitor Events ({logs.length} events logged)
          </p>
        </div>
        <button
          onClick={onClear}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#9ca3af',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Clear Logs
        </button>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: '450px',
          maxHeight: '620px',
          overflowY: 'auto',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: '#6b7280', textAlign: 'center', margin: 'auto' }}>
            Waiting for events... (Gunakan API Tester atau WS Consumer untuk memicu event)
          </div>
        ) : (
          logs.map((log) => {
            const style = getBadgeStyle(log.type);
            return (
              <div
                key={log.id}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: style.bg,
                  borderLeft: `3px solid ${style.border}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: style.color, fontWeight: 600, fontSize: '10px' }}>
                    [{style.label}]
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '10px' }}>{log.timestamp}</span>
                </div>
                <div style={{ color: '#f3f4f6', wordBreak: 'break-all' }}>{log.message}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
