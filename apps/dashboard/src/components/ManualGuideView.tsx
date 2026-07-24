import React, { useState } from 'react';

type LanguageTab = 'curl' | 'node' | 'python' | 'php';

export const ManualGuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LanguageTab>('curl');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const codeSnippets: Record<LanguageTab, { title: string; color: string; code: string }> = {
    curl: {
      title: 'cURL (Terminal Test)',
      color: '#34d399',
      code: `curl -X POST http://localhost:4000/api/events/publish \\
  -H "Content-Type: application/json" \\
  -H "x-app-token: app_token_live_YOUR_STATIC_TOKEN" \\
  -d '{
    "projectId": "my-project",
    "eventName": "ORDER_PAID",
    "target": { "type": "ROOM", "room": "room:orders" },
    "data": { "orderId": "ORD-9982", "totalAmount": 150000 }
  }'`,
    },
    node: {
      title: 'Node.js (Fetch API)',
      color: '#60a5fa',
      code: `const publishEvent = async () => {
  const res = await fetch('http://localhost:4000/api/events/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-token': 'app_token_live_YOUR_STATIC_TOKEN',
    },
    body: JSON.stringify({
      projectId: 'my-project',
      eventName: 'ORDER_PAID',
      target: { type: 'ROOM', room: 'room:orders' },
      data: { orderId: 'ORD-9982', totalAmount: 150000 },
    }),
  });

  const data = await res.json();
  console.log('Publish result:', data);
};`,
    },
    python: {
      title: 'Python (requests)',
      color: '#c084fc',
      code: `import requests

url = "http://localhost:4000/api/events/publish"
headers = {
    "Content-Type": "application/json",
    "x-app-token": "app_token_live_YOUR_STATIC_TOKEN"
}
payload = {
    "projectId": "my-project",
    "eventName": "ORDER_PAID",
    "target": {"type": "ROOM", "room": "room:orders"},
    "data": {"orderId": "ORD-9982", "totalAmount": 150000}
}

response = requests.post(url, json=payload, headers=headers)
print(response.status_code, response.json())`,
    },
    php: {
      title: 'PHP (cURL Native)',
      color: '#fb7185',
      code: `<?php
$url = "http://localhost:4000/api/events/publish";
$headers = [
    "Content-Type: application/json",
    "x-app-token: app_token_live_YOUR_STATIC_TOKEN"
];
$payload = json_encode([
    "projectId" => "my-project",
    "eventName" => "ORDER_PAID",
    "target" => ["type" => "ROOM", "room" => "room:orders"],
    "data" => ["orderId" => "ORD-9982", "totalAmount" => 150000]
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`,
    },
  };

  const jsSubscriberCode = `const apiToken = "app_token_live_YOUR_STATIC_TOKEN";
const ws = new WebSocket(\`ws://localhost:4001?token=\${apiToken}\`);

ws.onopen = () => {
  console.log('Connected to WebSocket Gateway');
  
  // Join room:orders
  ws.send(JSON.stringify({
    event: 'subscribe',
    payload: { room: 'room:orders' }
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.event === 'custom_event') {
    console.log('Event Name:', message.payload.eventName);
    console.log('Event Data:', message.payload.data);
  }
};`;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>
          📘 Developer Integration Manual & How To Use
        </h2>
        <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
          Panduan integrasi teknis untuk pengembang. Halaman ini menjelaskan cara mempublikasikan pesan real-time dari backend client via REST API serta cara terhubung dan berlangganan room WebSocket dari aplikasi frontend / mobile.
        </p>
      </div>

      {/* Section 1: REST API Publisher */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
            🚀 1. Cara Publish Message via REST API (Backend Client)
          </h3>
          <span style={{ fontSize: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#0d47a1', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
            POST /api/events/publish
          </span>
        </div>

        <div style={{ fontSize: '14px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <div>
            <strong style={{ color: '#0f172a' }}>1. Autentikasi Header:</strong> Dapatkan Static API Token dari menu <code>Applications & SaaS Setup</code>, lalu kirimkan di header <code>x-app-token</code>.
          </div>
          <div>
            <strong style={{ color: '#0f172a' }}>2. Pilihan Target:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><code style={{ color: '#0d47a1', fontWeight: 600 }}>ROOM</code>: Pesan dikirim ke room tertentu (misal <code>room:orders</code>).</li>
              <li><code style={{ color: '#0d47a1', fontWeight: 600 }}>USER</code>: Pesan dikirim khusus ke <code>recipientId</code> spesifik.</li>
              <li><code style={{ color: '#0d47a1', fontWeight: 600 }}>GLOBAL</code>: Broadcast pesan ke seluruh client terhubung.</li>
            </ul>
          </div>
        </div>

        {/* Tab Controls for Code Snippets */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
          {(['curl', 'node', 'python', 'php'] as LanguageTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#0d47a1' : '#f1f5f9',
                border: activeTab === tab ? '1px solid #0d47a1' : '1px solid #cbd5e1',
                color: activeTab === tab ? '#ffffff' : '#475569',
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Active Tab Content (Solid Dark Terminal for High Readability) */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
              {codeSnippets[activeTab].title}
            </span>
            <button
              onClick={() => handleCopy(activeTab, codeSnippets[activeTab].code)}
              style={{
                background: copiedSection === activeTab ? '#059669' : '#334155',
                border: 'none',
                color: '#ffffff',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {copiedSection === activeTab ? 'Copied! ✓' : 'Copy Code'}
            </button>
          </div>
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '13px', color: codeSnippets[activeTab].color, overflowX: 'auto', lineHeight: 1.5 }}>
            {codeSnippets[activeTab].code}
          </pre>
        </div>
      </div>

      {/* Section 2: WebSocket Subscriber */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
            🎧 2. Cara Subscribe & Menerima Event via WebSocket (Frontend Client)
          </h3>
          <span style={{ fontSize: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
            ws://localhost:4001?token=&lt;STATIC_API_TOKEN&gt;
          </span>
        </div>

        <div style={{ fontSize: '14px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <div>
            <strong style={{ color: '#0f172a' }}>1. Autentikasi Static Token:</strong> Sertakan Static API Token milik aplikasi pada query parameter URL koneksi (<code>ws://localhost:4001?token=app_token_live_...</code>). Tidak memerlukan token JWT user.
          </div>
          <div>
            <strong style={{ color: '#0f172a' }}>2. Join Room (Subscribe):</strong> Setelah koneksi terbuka (<code>onopen</code>), kirim pesan JSON:
            <code style={{ display: 'block', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '6px', marginTop: '6px', color: '#0f172a', fontWeight: 600 }}>
              &#123; "event": "subscribe", "payload": &#123; "room": "room:orders" &#125; &#125;
            </code>
          </div>
          <div>
            <strong style={{ color: '#0f172a' }}>3. Handling Event:</strong> Dengarkan event <code>custom_event</code> pada callback <code>onmessage</code>.
          </div>
        </div>

        {/* JavaScript Subscriber Code (Solid Dark Terminal) */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>Vanilla JavaScript / Browser Native</span>
            <button
              onClick={() => handleCopy('subscriber', jsSubscriberCode)}
              style={{
                background: copiedSection === 'subscriber' ? '#059669' : '#334155',
                border: 'none',
                color: '#ffffff',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {copiedSection === 'subscriber' ? 'Copied! ✓' : 'Copy Code'}
            </button>
          </div>
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '13px', color: '#34d399', overflowX: 'auto', lineHeight: 1.5 }}>{jsSubscriberCode}</pre>
        </div>
      </div>
    </div>
  );
};
