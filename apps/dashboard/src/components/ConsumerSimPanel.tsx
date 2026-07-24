import React, { useState } from 'react';

interface ConsumerSimPanelProps {
  status: string;
  activeRooms: string[];
  onSubscribe: (room: string) => void;
  onUnsubscribe: (room: string) => void;
  onReconnect: () => void;
}

export const ConsumerSimPanel: React.FC<ConsumerSimPanelProps> = ({
  status,
  activeRooms,
  onSubscribe,
  onUnsubscribe,
  onReconnect,
}) => {
  const [roomInput, setRoomInput] = useState('room:orders');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomInput.trim()) return;
    onSubscribe(roomInput.trim());
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
          🎧 WebSocket Consumer Room Simulator
        </h3>
        <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '4px' }}>
          Simulasi Client Subscriber
        </span>
      </div>

      <form onSubmit={handleJoin} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. room:orders"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-primary" disabled={status !== 'CONNECTED'}>
          Join Room
        </button>
      </form>

      <div>
        <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
          Active Subscriptions ({activeRooms.length})
        </label>
        {activeRooms.length === 0 ? (
          <div style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>
            Belum bergabung ke room mana pun. Masukkan nama room di atas lalu klik Join.
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {activeRooms.map((room) => (
              <div
                key={room}
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#60a5fa',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>🏷️ {room}</span>
                <button
                  onClick={() => onUnsubscribe(room)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f43f5e',
                    cursor: 'pointer',
                    fontSize: '14px',
                    lineHeight: 1,
                  }}
                  title="Leave Room"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {status === 'DISCONNECTED' && (
        <div style={{ marginTop: '16px' }}>
          <button
            type="button"
            onClick={onReconnect}
            style={{
              width: '100%',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            WebSocket Terputus – Klik untuk Reconnect
          </button>
        </div>
      )}
    </div>
  );
};
