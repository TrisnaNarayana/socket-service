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
            background: message.type === 'success' ? '#ecfdf5' : '#fff1f2',
            border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecdd3'}`,
            color: message.type === 'success' ? '#059669' : '#e11d48',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Top Grid: Forms */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Form 1: Register Client / Tenant */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#0f172a' }}>
            🏢 1. Registrasi Client / Perusahaan Baru
          </h3>
          <form onSubmit={handleCreateClient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: 500 }}>
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
              <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: 500 }}>
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
            <button type="submit" className="btn-primary" style={{ marginTop: '4px' }}>
              Daftarkan Client
            </button>
          </form>
        </div>

        {/* Form 2: Create Application */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#0f172a' }}>
            📱 2. Buat Aplikasi Baru & Generate Static Token
          </h3>
          <form onSubmit={handleCreateApp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: 500 }}>
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
              <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: 500 }}>
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
            <button type="submit" className="btn-primary" disabled={clients.length === 0} style={{ marginTop: '4px' }}>
              Buat Aplikasi & Generate API Token
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Table: List of Applications */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
            🔑 Daftar Aplikasi & Static API Tokens ({applications.length})
          </h3>
          <button
            onClick={fetchData}
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
            Refresh List
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#64748b', textAlign: 'center', padding: '24px' }}>Loading applications...</div>
        ) : applications.length === 0 ? (
          <div style={{ color: '#64748b', textAlign: 'center', padding: '24px' }}>
            Belum ada aplikasi yang terdaftar. Gunakan form di atas untuk mendaftarkan client dan aplikasi baru.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {applications.map((app) => (
              <div
                key={app.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{app.appName}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#0d47a1',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}
                    >
                      {app.client?.name || 'Client'}
                    </span>
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>Static API Token:</span>
                    <code
                      style={{
                        background: '#0f172a',
                        color: '#34d399',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        fontWeight: 600,
                      }}
                    >
                      {app.apiToken}
                    </code>
                    <button
                      onClick={() => handleCopyToken(app.id, app.apiToken)}
                      style={{
                        background: copiedTokenId === app.id ? '#059669' : '#0d47a1',
                        color: 'white',
                        border: 'none',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
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
                      background: '#fff1f2',
                      border: '1px solid #fecdd3',
                      color: '#e11d48',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
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
