import React, { useState } from 'react';

interface ApiTesterPanelProps {
  onLog: (type: 'rest_out' | 'system' | 'error', message: string) => void;
}

export const ApiTesterPanel: React.FC<ApiTesterPanelProps> = ({ onLog }) => {
  const [projectId, setProjectId] = useState('project-ecommerce');
  const [apiKey, setApiKey] = useState('default-service-api-key');
  const [eventName, setEventName] = useState('ORDER_PAID');
  const [targetType, setTargetType] = useState<'GLOBAL' | 'ROOM' | 'USER'>('ROOM');
  const [targetValue, setTargetValue] = useState('room:orders');
  const [payload, setPayload] = useState('{\n  "orderId": "ORD-9982",\n  "totalAmount": 150000,\n  "status": "PAID"\n}');
  const [loading, setLoading] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const parsedData = JSON.parse(payload);

      const requestBody = {
        projectId,
        eventName,
        target: {
          type: targetType,
          ...(targetType === 'ROOM' ? { room: targetValue } : {}),
          ...(targetType === 'USER' ? { recipientId: targetValue } : {}),
        },
        data: parsedData,
      };

      onLog('rest_out', `Sending POST /api/events/publish (${targetType})`);

      const res = await fetch('http://localhost:4000/api/events/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-service-api-key': apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        onLog('system', `REST Publish SUCCESS [${res.status}]: ${resData.message}`);
      } else {
        onLog('error', `REST Publish FAILED [${res.status}]: ${resData.message || resData.error || 'Unauthorized/Error'}`);
      }
    } catch (err: any) {
      onLog('error', `REST Publish ERROR: ${err.message || 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
          🚀 REST API Event Publisher Tester
        </h3>
        <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px' }}>
          Simulasi External Backend
        </span>
      </div>

      <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
              Project ID
            </label>
            <input
              type="text"
              className="input-field"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
              Service API Key
            </label>
            <input
              type="text"
              className="input-field"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
              Event Name
            </label>
            <input
              type="text"
              className="input-field"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
              Target Type
            </label>
            <select
              className="input-field"
              value={targetType}
              onChange={(e: any) => setTargetType(e.target.value)}
            >
              <option value="ROOM">ROOM (Spesifik Room)</option>
              <option value="USER">USER (Spesifik User ID)</option>
              <option value="GLOBAL">GLOBAL (Semua Client)</option>
            </select>
          </div>
        </div>

        {targetType !== 'GLOBAL' && (
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
              {targetType === 'ROOM' ? 'Nama Room Target' : 'Target User ID'}
            </label>
            <input
              type="text"
              className="input-field"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder={targetType === 'ROOM' ? 'e.g. room:orders' : 'e.g. user-uuid-123'}
              required
            />
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
            Data Payload (JSON)
          </label>
          <textarea
            className="input-field"
            rows={3}
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Publishing Event...' : '📡 Publish via REST API'}
        </button>
      </form>
    </div>
  );
};
