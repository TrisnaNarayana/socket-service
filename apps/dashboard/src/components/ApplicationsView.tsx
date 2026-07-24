import React, { useState, useEffect } from 'react';
import { ApplicationDTO, ClientDTO } from '@vms/shared';

export const ApplicationsView: React.FC = () => {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [applications, setApplications] = useState<ApplicationDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [appName, setAppName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resClients, resApps] = await Promise.all([
        fetch('http://localhost:4000/api/applications/clients'),
        fetch('http://localhost:4000/api/applications'),
      ]);

      const dataClients = await resClients.json();
      const dataApps = await resApps.json();

      if (dataClients.success) setClients(dataClients.data);
      if (dataApps.success) setApplications(dataApps.data);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Gagal mengambil data dari server API' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch('http://localhost:4000/api/applications/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clientName, email: clientEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: `Client "${data.data.name}" berhasil terdaftar!` });
        setClientName('');
        setClientEmail('');
        fetchData();
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal mendaftarkan client' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal terhubung ke server' });
    }
  };

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!selectedClientId) {
      alert('Pilih Client terlebih dahulu');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: selectedClientId, appName }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: `Aplikasi "${data.data.appName}" berhasil dibuat dengan Static API Token!` });
        setAppName('');
        fetchData();
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal membuat aplikasi' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal terhubung ke server' });
    }
  };

  const handleCopyToken = (appId: string, token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedTokenId(appId);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  const handleRegenerateToken = async (appId: string) => {
    if (!confirm('Apakah Anda yakin ingin mereset Static API Token aplikasi ini?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/applications/${appId}/regenerate-token`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Static API Token berhasil diperbarui!' });
        fetchData();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Gagal mereset token' });
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {message && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${message.type === 'success' ? '#10b981' : '#f43f5e'}`,
            color: message.type === 'success' ? '#34d399' : '#fb7185',
            fontSize: '14px',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Top Grid: Forms */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Form 1: Register Client / Tenant */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            🏢 1. Registrasi Client / Perusahaan Baru
          </h3>
          <form onSubmit={handleCreateClient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                Nama Client / Perusahaan
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. PT Maju Sentosa"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                Email Perusahaan
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="e.g. info@majusentosa.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Daftarkan Client
            </button>
          </form>
        </div>

        {/* Form 2: Create Application */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            📱 2. Buat Aplikasi Baru & Generate Static Token
          </h3>
          <form onSubmit={handleCreateApp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                Pilih Client Induk
              </label>
              <select
                className="input-field"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                required
              >
                <option value="">-- Pilih Client --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                Nama Aplikasi
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. E-Commerce Mobile App"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={clients.length === 0}>
              Buat Aplikasi & Generate API Token
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Table: List of Applications */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
            🔑 Daftar Aplikasi & Static API Tokens ({applications.length})
          </h3>
          <button
            onClick={fetchData}
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
            Refresh List
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#9ca3af', textAlign: 'center', padding: '24px' }}>Loading applications...</div>
        ) : applications.length === 0 ? (
          <div style={{ color: '#6b7280', textAlign: 'center', padding: '24px' }}>
            Belum ada aplikasi yang terdaftar. Gunakan form di atas untuk mendaftarkan client dan aplikasi baru.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {applications.map((app) => (
              <div
                key={app.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700 }}>{app.appName}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {app.client?.name || 'Client'}
                    </span>
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>Static API Token:</span>
                    <code
                      style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: '#10b981',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {app.apiToken}
                    </code>
                    <button
                      onClick={() => handleCopyToken(app.id, app.apiToken)}
                      style={{
                        background: copiedTokenId === app.id ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {copiedTokenId === app.id ? 'Copied! ✓' : 'Copy Token'}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleRegenerateToken(app.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Regenerate Token
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
