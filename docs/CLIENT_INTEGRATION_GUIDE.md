# Client Integration Guide – NARSYS PULSEFLOW Gateway & REST API

Panduan ini berisi instruksi lengkap bagi pengembang (*developers*) yang ingin mengintegrasikan aplikasi backend maupun frontend/mobile mereka dengan **NARSYS PULSEFLOW Real-Time Infrastructure Platform** (by Narayana System).

---

## Endpoint Server (Produksi vs Development)

| Lingkungan (*Environment*) | Base REST API Endpoint | WebSocket Connection URL |
| :--- | :--- | :--- |
| **Produksi (Deployed)** | `https://pulseflow.narayana.web.id/api/events` | `wss://pulseflow.narayana.web.id/ws` |
| **Lokal (Development)** | `http://localhost:4000/api/events` | `ws://localhost:4001` |

---

## Daftar Isi
1. [Bagian 1: Cara Publish Message via REST API (Backend Client)](#bagian-1-cara-publish-message-via-rest-api-backend-client)
   - [Overview & Autentikasi Static Token](#11-overview--autentikasi-static-token)
   - [Spesifikasi Request Payload](#12-spesifikasi-request-payload)
   - [Tipe Target Pengiriman (ROOM, USER, GLOBAL)](#13-tipe-target-pengiriman-room-user-global)
   - [Contoh Kode Pengiriman (cURL, Node.js, Python, PHP)](#14-contoh-kode-pengiriman)
   - [Response & Handling Error](#15-response--handling-error)
2. [Bagian 2: Cara Subscribe & Menerima Message via WebSocket (Frontend/Mobile Client)](#bagian-2-cara-subscribe--menerima-message-via-websocket-frontendmobile-client)
   - [Koneksi WebSocket & Handshake JWT](#21-koneksi-websocket--handshake-jwt)
   - [Prosedur Join & Leave Room (Subscribe / Unsubscribe)](#22-prosedur-join--leave-room)
   - [Menerima Custom Event Payload](#23-menerima-custom-event-payload)
   - [Contoh Kode Client (JavaScript, React Hook, Flutter)](#24-contoh-kode-client)
   - [Strategi Auto-Reconnect & Error Handling](#25-strategi-auto-reconnect--error-handling)

---

## Bagian 1: Cara Publish Message via REST API (Backend Client)

### 1.1 Overview & Autentikasi Static Token
Service backend dari project lain mempublikasikan event/pesan real-time dengan mengirimkan HTTP POST request ke server REST Backend. Setiap request wajib membawa **Static API Token** milik aplikasi yang telah dibuat dari **Dashboard SaaS**.

* **Base URL Produksi**: `https://pulseflow.narayana.web.id/api/events/publish`
* **Base URL Dev**: `http://localhost:4000/api/events/publish`
* **Endpoint**: `POST /publish`
* **Headers Wajib**:
  ```http
  Content-Type: application/json
  x-app-token: app_token_live_YOUR_STATIC_API_TOKEN
  ```

---

### 1.2 Spesifikasi Request Payload
Body request dikirimkan dalam format JSON dengan struktur sebagai berikut:

```json
{
  "projectId": "project-ecommerce",
  "eventName": "ORDER_PAID",
  "target": {
    "type": "ROOM",
    "room": "room:orders"
  },
  "data": {
    "orderId": "ORD-9982",
    "totalAmount": 150000,
    "status": "PAID"
  }
}
```

---

### 1.3 Tipe Target Pengiriman (ROOM, USER, GLOBAL)

| Target Type | Properti Tambahan | Deskripsi Pengiriman |
| :--- | :--- | :--- |
| `ROOM` | `"room": "nama_room"` | Pesan hanya dikirim ke socket client yang telah mendaftar (*subscribe*) ke room tersebut. |
| `USER` | `"recipientId": "user_id"` | Pesan hanya dikirim khusus ke client dengan `userId` yang sesuai. |
| `GLOBAL` | *(Tidak ada)* | Pesan dibroadcast ke seluruh client terhubung di WebSocket Gateway. |

---

### 1.4 Contoh Kode Pengiriman

#### A. cURL (Terminal Test - Produksi)
```bash
curl -X POST https://pulseflow.narayana.web.id/api/events/publish \
  -H "Content-Type: application/json" \
  -H "x-app-token: app_token_live_abc123456789" \
  -d '{
    "projectId": "project-ecommerce",
    "eventName": "ORDER_PAID",
    "target": { "type": "ROOM", "room": "room:orders" },
    "data": { "orderId": "ORD-9982", "status": "PAID" }
  }'
```

#### B. Node.js (Fetch API)
```javascript
const publishEvent = async () => {
  try {
    const res = await fetch('https://pulseflow.narayana.web.id/api/events/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-token': 'app_token_live_abc123456789',
      },
      body: JSON.stringify({
        projectId: 'project-ecommerce',
        eventName: 'ORDER_PAID',
        target: { type: 'ROOM', room: 'room:orders' },
        data: { orderId: 'ORD-9982', status: 'PAID' },
      }),
    });

    const data = await res.json();
    console.log('Publish status:', data);
  } catch (err) {
    console.error('Failed to publish event:', err);
  }
};
```

#### C. Python (`requests`)
```python
import requests

url = "https://pulseflow.narayana.web.id/api/events/publish"
headers = {
    "Content-Type": "application/json",
    "x-app-token": "app_token_live_abc123456789"
}
payload = {
    "projectId": "project-ecommerce",
    "eventName": "ORDER_PAID",
    "target": {"type": "ROOM", "room": "room:orders"},
    "data": {"orderId": "ORD-9982", "status": "PAID"}
}

response = requests.post(url, json=payload, headers=headers)
print(response.status_code, response.json())
```

---

### 1.5 Response & Handling Error

* **Response Sukses (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Event published successfully",
    "data": {
      "projectId": "project-ecommerce",
      "eventName": "ORDER_PAID",
      "target": { "type": "ROOM", "room": "room:orders" },
      "timestamp": "2026-07-24T07:10:00.000Z"
    }
  }
  ```
* **Response Gagal (`401 Unauthorized`)**: Token salah atau tidak disediakan.
  ```json
  {
    "success": false,
    "error": "Unauthorized: Invalid Static App Token (x-app-token) or Service API Key"
  }
  ```

---

## Bagian 2: Cara Subscribe & Menerima Message via WebSocket (Frontend/Mobile Client)

### 2.1 Koneksi WebSocket & Autentikasi Static Token
Aplikasi frontend (React, Vue, Web) atau mobile client (Flutter, iOS, Android) terhubung langsung ke **NARSYS PULSEFLOW Gateway** menggunakan **Static API Token** yang sama dengan backend publisher (atau JWT Token):

* **WebSocket Server URL Produksi**: `wss://pulseflow.narayana.web.id/ws`
* **WebSocket Server URL Dev**: `ws://localhost:4001`
* **Parameter Wajib**: `?token=<STATIC_API_TOKEN>`

Contoh URL Koneksi Produksi:
```text
wss://pulseflow.narayana.web.id/ws?token=app_token_live_abc123456789
```

---

### 2.2 Prosedur Join & Leave Room

#### A. Bergabung ke Room (`subscribe`)
Kirimkan pesan JSON saat koneksi telah terhubung:
```json
{
  "event": "subscribe",
  "payload": {
    "projectId": "project-ecommerce",
    "room": "room:orders"
  }
}
```
Server akan merespons dengan konfirmasi:
```json
{
  "event": "subscribe_ack",
  "payload": { "room": "room:orders", "status": "subscribed" },
  "timestamp": "2026-07-24T07:10:00.000Z"
}
```

#### B. Keluar dari Room (`unsubscribe`)
```json
{
  "event": "unsubscribe",
  "payload": {
    "projectId": "project-ecommerce",
    "room": "room:orders"
  }
}
```

---

### 2.3 Menerima Custom Event Payload
Saat server WebSocket menerima pesan yang ditargetkan ke room atau user Anda, server akan mengirimkan pesan `custom_event` ke client:

```json
{
  "event": "custom_event",
  "payload": {
    "projectId": "project-ecommerce",
    "eventName": "ORDER_PAID",
    "data": {
      "orderId": "ORD-9982",
      "totalAmount": 150000,
      "status": "PAID"
    }
  },
  "timestamp": "2026-07-24T07:10:00.000Z"
}
```

---

### 2.4 Contoh Kode Client

#### A. Vanilla JavaScript (Browser Native - Produksi)
```javascript
const apiToken = 'app_token_live_abc123456789';
const ws = new WebSocket(`wss://pulseflow.narayana.web.id/ws?token=${apiToken}`);

ws.onopen = () => {
  console.log('Connected to NARSYS PULSEFLOW Gateway');
  
  // Join room:orders
  ws.send(JSON.stringify({
    event: 'subscribe',
    payload: { room: 'room:orders' }
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.event === 'custom_event') {
    console.log('Event received:', data.payload.eventName);
    console.log('Data:', data.payload.data);
  }
};

ws.onclose = () => console.log('Disconnected from WebSocket');
```

---

### 2.5 Strategi Auto-Reconnect & Error Handling
- **Penanganan Koneksi Putus**: Selalu gunakan `setTimeout` pada callback `ws.onclose` untuk melakukan *reconnect* otomatis (misalnya interval 3 detik).
- **Penanganan JWT Expired**: Jika server membalas dengan status penghentian `close(4002, 'Unauthorized: Invalid token')`, minta client memperbarui token via `POST /api/auth/refresh` lalu lakukan reconnect dengan token baru.
