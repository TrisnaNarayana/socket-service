# Issue: High-Level Implementation Plan – Strict Multi-Tenant Room Isolation

## 1. Ringkasan & Potensi Masalah (Problem Statement)

Dokumen perencanaan ini bertujuan untuk memandu implementasi **Isolasi Room Terikat Tenant (Strict Multi-Tenant Room Isolation)** pada WebSocket Gateway.

### Potensi Masalah (*Cross-Tenant Message Leakage*):
Saat ini, jika dua client yang berbeda (misalnya **Client A** dan **Client B**) secara tidak sengaja membuat atau berlangganan (*subscribe*) ke nama room yang sama (contoh: `users-9001`), pesan yang dipublikasikan oleh Client A ke room `users-9001` akan **bocor** dan diterima oleh Client B yang berada di room dengan nama yang sama.

### Solusi (*Tenant-Scoped Room Namespacing*):
Sistem harus secara otomatis menyisipkan identitas aplikasi (`appId` atau `appSlug`) pada setiap nama room secara internal.
* **Client A** (App Token A) meminta room `users-9001` -> Internal Room: `app:<App_A_ID>:room:users-9001`
* **Client B** (App Token B) meminta room `users-9001` -> Internal Room: `app:<App_B_ID>:room:users-9001`

Dengan cara ini, meskipun nama room yang diminta di tingkat aplikasi sama, secara internal kedua room tersebut **sepenuhnya terpisah dan terisolasi**.

---

## 2. Arsitektur Isolasi Room

```text
+-----------------------------------------------------------------------------------------------+
|                                STRICT MULTI-TENANT ROOM ISOLATION                             |
|                                                                                               |
|   [ CLIENT A ] (App Token A)                           [ CLIENT B ] (App Token B)             |
|   Subscribe: "users-9001"                              Subscribe: "users-9001"                |
|           |                                                    |                              |
|           v                                                    v                              |
|   +-------------------------------------------------------------------------------+           |
|   |                            WEBSOCKET GATEWAY SERVICE                          |           |
|   |                                                                               |           |
|   |   Internal Room Scope A:                          Internal Room Scope B:      |           |
|   |   "app:App_A_ID:room:users-9001"                  "app:App_B_ID:room:users-9001" |          |
|   +-------------------------------------------------------------------------------+           |
|                                                                                               |
|   RESULT: Client A HANYA menerima pesan dari Publisher App A.                                |
|           Client B HANYA menerima pesan dari Publisher App B.                                |
+-----------------------------------------------------------------------------------------------+
```

---

## 3. Tahapan Penyelesaian (High-Level Execution Roadmap)

### 📌 Tahap 1: Ekstraksi App Identity pada Session WebSocket & REST Backend
1. **Identifikasi Token Aplikasi**:
   - Ekstrak `appId` atau `appSlug` saat client melakukan autentikasi koneksi WebSocket menggunakan Static API Token (`app_token_live_...`).
   - Simpan `appId` tersebut pada data sesi socket (*Socket Connection Context*).
2. **REST API Context Attachment**:
   - Di `apps/backend`, pastikan middleware `verifyApiKeyOrAppToken` menyimpan `appId` aplikasi ke `req.appContext` untuk diteruskan saat mempublikasikan event.

---

### 📌 Tahap 2: Helper Centralized Room Namespacing (`@vms/shared`)
1. **Fungsi Formatting Room**:
   - Buat fungsi utilitas terpusat: `buildScopedRoomName(appId: string, roomName: string): string`.
   - Format standar: `app:<appId>:room:<roomName>`.
2. **Kesesuaian Penggunaan**:
   - Pastikan fungsi ini digunakan secara konsisten baik di WebSocket Service maupun di Backend Event Forwarder.

---

### 📌 Tahap 3: Refactoring Manager & Handler WebSocket (`apps/websocket`)
1. **Handler `subscribe` & `unsubscribe`**:
   - Saat WebSocket Client mengirimkan request `subscribe` ke room `users-9001`, sistem secara otomatis mengubahnya menjadi `app:<appId>:room:users-9001` sebelum memasukkannya ke daftar room manager.
2. **Connection Manager (`joinRoom`, `leaveRoom`, `sendToRoom`)**:
   - Perbarui `ConnectionManager` agar seluruh pencarian dan penyiaran pesan (*broadcast/publish*) menggunakan nama room yang sudah ter-scope (*scoped room name*).

---

### 📌 Tahap 4: Refactoring Event Forwarder REST API (`apps/backend` & `apps/websocket`)
1. **Payload Bridge Internal**:
   - Saat `POST /api/events/publish` dipanggil oleh Backend Client A, pastikan payload internal yang dikirim ke `http://localhost:4001/internal/publish` menyertakan `appId` asal.
2. **Dispatcher Broadcast Internal**:
   - WebSocket Gateway membaca `appId` pada request internal tersebut dan mengirimkan event hanya ke room ber-namespace `app:<appId>:room:<targetRoom>`.

---

### 📌 Tahap 5: Testing, Validasi & Quality Assurance
1. **Unit & Integration Test Cases**:
   - Buat test case simulasi dua client dengan token aplikasi yang berbeda (**App A** dan **App B**).
   - Keduanya bergabung ke room `orders`.
   - Kirim pesan dari Publisher App A ke room `orders`.
   - **Verifikasi**: Pesan HANYA diterima oleh Client App A, dan Client App B TIDAK menerima pesan tersebut (*Zero Leakage*).

---

## 4. Checklist Kriteria Penerimaan (Acceptance Criteria)

- [ ] Utilitas `buildScopedRoomName(appId, rawRoomName)` terimplementasi di `@vms/shared`.
- [ ] WebSocket Service menyimpan `appId` pada konteks koneksi socket.
- [ ] Operasi `subscribe` dan `unsubscribe` diisolasi secara otomatis berdasarkan `appId`.
- [ ] REST API `POST /api/events/publish` meneruskan event hanya ke namespace room aplikasi yang sesuai.
- [ ] Teruji melalui integration test: Pengiriman pesan ke room dengan nama sama dari Client A tidak akan bocor ke Client B.
- [ ] Seluruh unit test dan build monorepo berhasil 100% tanpa error.
