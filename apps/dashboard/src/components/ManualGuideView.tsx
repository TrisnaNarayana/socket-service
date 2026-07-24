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
      color: '#f43f5e',
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
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
          📘 Developer Integration Manual & How To Use
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.5 }}>
          Panduan integrasi teknis untuk pengembang. Halaman ini menjelaskan cara mempublikasikan pesan real-time dari backend client via REST API serta cara terhubung dan berlangganan room WebSocket dari aplikasi frontend / mobile.
        </p>
      </div>

      {/* Section 1: REST API Publisher */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
            🚀 1. Cara Publish Message via REST API (Backend Client)
          </h3>
          <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px' }}>
            POST /api/events/publish
          </span>
        </div>

        <div style={{ fontSize: '13px', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <div>
            <strong>1. Autentikasi Header:</strong> Dapatkan Static API Token dari menu <code>Applications & SaaS Setup</code>, lalu kirimkan di header <code>x-app-token</code>.
          </div>
          <div>
            <strong>2. Pilihan Target:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><code>ROOM</code>: Pesan dikirim ke room tertentu (misal <code>room:orders</code>).</li>
              <li><code>USER</code>: Pesan dikirim khusus ke <code>recipientId</code> spesifik.</li>
              <li><code>GLOBAL</code>: Broadcast pesan ke seluruh client terhubung.</li>
            </ul>
          </div>
        </div>

        {/* Tab Controls for Code Snippets */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px' }}>
          {(['curl', 'node', 'python', 'php'] as LanguageTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                border: activeTab === tab ? '1px solid #3b82f6' : '1px solid transparent',
                color: activeTab === tab ? '#60a5fa' : '#9ca3af',
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#f3f4f6' }}>
              {codeSnippets[activeTab].title}
            </span>
            <button
              onClick={() => handleCopy(activeTab, codeSnippets[activeTab].code)}
              style={{
                background: copiedSection === activeTab ? '#10b981' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              {copiedSection === activeTab ? 'Copied! ✓' : 'Copy Code'}
            </button>
          </div>
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '13px', color: codeSnippets[activeTab].color, overflowX: 'auto', lineHeight: 1.4 }}>
            {codeSnippets[activeTab].code}
          </pre>
        </div>
      </div>

      {/* Section 2: WebSocket Subscriber */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
            🎧 2. Cara Subscribe & Menerima Event via WebSocket (Frontend Client)
          </h3>
          <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '4px' }}>
            ws://localhost:4001?token=&lt;STATIC_API_TOKEN&gt;
          </span>
        </div>

        <div style={{ fontSize: '13px', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <div>
            <strong>1. Autentikasi Static Token:</strong> Sertakan Static API Token milik aplikasi pada query parameter URL koneksi (<code>ws://localhost:4001?token=app_token_live_...</code>). Tidak memerlukan token JWT user.
          </div>
          <div>
            <strong>2. Join Room (Subscribe):</strong> Setelah koneksi terbuka (<code>onopen</code>), kirim pesan JSON:
            <code style={{ display: 'block', background: 'rgba(0,0,0,0.5)', padding: '6px 10px', borderRadius: '6px', marginTop: '4px', color: '#f3f4f6' }}>
              &#123; "event": "subscribe", "payload": &#123; "room": "room:orders" &#125; &#125;
            </code>
          </div>
          <div>
            <strong>3. Handling Event:</strong> Dengarkan event <code>custom_event</code> pada callback <code>onmessage</code>.
          </div>
        </div>

        {/* JavaScript Subscriber Code */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#f3f4f6' }}>Vanilla JavaScript / Browser Native</span>
            <button
              onClick={() => handleCopy('subscriber', jsSubscriberCode)}
              style={{ background: copiedSection === 'subscriber' ? '#10b981' : 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
            >
              {copiedSection === 'subscriber' ? 'Copied! ✓' : 'Copy Code'}
            </button>
          </div>
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '13px', color: '#34d399', overflowX: 'auto', lineHeight: 1.4 }}>{jsSubscriberCode}</pre>
        </div>
      </div>
    </div>
  );
};
