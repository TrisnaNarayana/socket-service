import React, { useState } from 'react';
import { LiveFeedPanel, DashboardLog } from './LiveFeedPanel';

interface GlobalMonitorViewProps {
  status: string;
  logs: DashboardLog[];
  onSendMessage: (event: string, payload: any) => void;
  onClearLogs: () => void;
  onReconnect: () => void;
}

export const GlobalMonitorView: React.FC<GlobalMonitorViewProps> = ({
  status,
  logs,
  onSendMessage,
  onClearLogs,
  onReconnect,
}) => {
  const [customEvent, setCustomEvent] = useState('ping');
  const [customPayload, setCustomPayload] = useState('{"message": "Hello WebSocket"}');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedPayload = JSON.parse(customPayload);
      onSendMessage(customEvent, parsedPayload);
    } catch {
      alert('Invalid JSON payload');
    }
  };

  return (
    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
      {/* Left Column: Global Controls & System Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            ⚡ Global Real-Time Event Dispatcher
          </h3>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>
                Event Type
              </label>
              <select
                className="input-field"
                value={customEvent}
                onChange={(e) => setCustomEvent(e.target.value)}
              >
                <option value="ping">ping (Heartbeat)</option>
                <option value="broadcast">broadcast (Global Broadcast)</option>
                <option value="custom_event">custom_event</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>
                JSON Payload
              </label>
              <textarea
                className="input-field"
                rows={4}
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary" disabled={status !== 'CONNECTED'} style={{ flex: 1 }}>
                Emit Direct Event
              </button>
              {status === 'DISCONNECTED' && (
                <button
                  type="button"
                  onClick={onReconnect}
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid #3b82f6',
                    color: '#3b82f6',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Reconnect
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
            📌 System Information & Health
          </h3>
          <div style={{ fontSize: '13px', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>REST API Server:</span>
              <code style={{ color: '#10b981' }}>http://localhost:4000</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>WebSocket Gateway:</span>
              <code style={{ color: '#10b981' }}>ws://localhost:4001</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Auth Session Status:</span>
              <span style={{ color: '#10b981' }}>Active (JWT Valid)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Live Event Terminal */}
      <div>
        <LiveFeedPanel logs={logs} onClear={onClearLogs} />
      </div>
    </div>
  );
};
