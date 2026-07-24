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
        return { bg: 'rgba(5, 150, 105, 0.15)', border: '#10b981', label: 'WS INBOUND', color: '#34d399', text: '#ecfdf5' };
      case 'out':
        return { bg: 'rgba(13, 71, 161, 0.25)', border: '#3b82f6', label: 'WS OUTBOUND', color: '#60a5fa', text: '#eff6ff' };
      case 'rest_out':
        return { bg: 'rgba(217, 119, 6, 0.2)', border: '#f59e0b', label: 'REST OUTBOUND', color: '#fbbf24', text: '#fffbeb' };
      case 'error':
        return { bg: 'rgba(225, 29, 72, 0.2)', border: '#f43f5e', label: 'ERROR', color: '#fb7185', text: '#fff1f2' };
      case 'system':
      default:
        return { bg: 'rgba(255, 255, 255, 0.08)', border: '#64748b', label: 'SYSTEM', color: '#94a3b8', text: '#f8fafc' };
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>📡 Live Socket & API Feed Stream</h3>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>
            Real-Time Monitor Events ({logs.length} events logged)
          </p>
        </div>
        <button
          onClick={onClear}
          style={{
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            color: '#475569',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          Clear Logs
        </button>
      </div>

      {/* Terminal View Container */}
      <div
        style={{
          flex: 1,
          minHeight: '480px',
          maxHeight: '620px',
          overflowY: 'auto',
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '10px',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '12.5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: '#64748b', textAlign: 'center', margin: 'auto' }}>
            Waiting for real-time events... (Gunakan API Publisher atau Consumer Simulator untuk memicu event)
          </div>
        ) : (
          logs.map((log) => {
            const style = getBadgeStyle(log.type);
            return (
              <div
                key={log.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: style.bg,
                  borderLeft: `4px solid ${style.border}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: style.color, fontWeight: 700, fontSize: '11px', letterSpacing: '0.5px' }}>
                    [{style.label}]
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>{log.timestamp}</span>
                </div>
                <div style={{ color: style.text, wordBreak: 'break-all', lineHeight: 1.4 }}>{log.message}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
