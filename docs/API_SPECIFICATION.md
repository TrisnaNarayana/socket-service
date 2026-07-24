# Spesifikasi API & WebSocket Event Specification

Dokumen ini berisi spesifikasi teknis REST API Endpoints dan WebSocket Events pada boilerplate **VMS WebSocket Monorepo**.

---

## 1. REST API Endpoints (`apps/backend`)

Base URL: `http://localhost:4000/api`

### A. Authentication Module (`/auth`)

#### 1. `POST /auth/register`
* **Deskripsi**: Pendaftaran akun pengguna baru.
* **Request Body**:
  ```json
  {
    "email": "user@vms.com",
    "password": "password123",
    "name": "User Name",
    "role": "USER"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registrasi berhasil",
    "data": {
      "user": { "id": "uuid", "email": "user@vms.com", "name": "User Name", "role": "USER" },
      "tokens": { "accessToken": "jwt...", "refreshToken": "jwt..." }
    }
  }
  ```

#### 2. `POST /auth/login`
* **Deskripsi**: Autentikasi pengguna dan pembuat token JWT.
* **Request Body**:
  ```json
  {
    "email": "user@vms.com",
    "password": "password123"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login berhasil",
    "data": {
      "user": { "id": "uuid", "email": "user@vms.com", "name": "User Name", "role": "USER" },
      "tokens": { "accessToken": "jwt...", "refreshToken": "jwt..." }
    }
  }
  ```

#### 3. `POST /auth/refresh`
* **Deskripsi**: Memperbarui `accessToken` yang telah kadaluarsa menggunakan `refreshToken`.

#### 4. `GET /auth/me`
* **Headers**: `Authorization: Bearer <accessToken>`
* **Deskripsi**: Mengambil profil pengguna yang terautentikasi.

---

### B. User Management Module (`/users`)

#### 1. `GET /users`
* **Headers**: `Authorization: Bearer <accessToken>` (Role: ADMIN)
* **Deskripsi**: Mengambil daftar seluruh pengguna.

### C. Event Gateway & SaaS Application Module (`/events`, `/applications`)

> 📘 **Panduan Pengembang Lengkap**: Untuk contoh kode praktis dalam berbagai bahasa (cURL, Node.js, Python, PHP, JS, React), silakan baca [Panduan Integrasi Client](file:///Users/zara/trisna/mohuprima/vms_socket/docs/CLIENT_INTEGRATION_GUIDE.md).

#### 1. `POST /events/publish`
* **Headers**: `Content-Type: application/json`, `x-app-token: <app_token_live_...>` (atau `x-service-api-key`)
* **Deskripsi**: Mempublikasikan event real-time dari backend external ke WebSocket Gateway.
* **Request Body**:
  ```json
  {
    "projectId": "project-ecommerce",
    "eventName": "ORDER_PAID",
    "target": { "type": "ROOM", "room": "room:orders" },
    "data": { "orderId": "ORD-9982", "status": "PAID" }
  }
  ```

#### 2. `POST /applications/clients`
* **Deskripsi**: Registrasi Client/Tenant baru.

#### 3. `POST /applications`
* **Deskripsi**: Membuat Aplikasi baru untuk Client & meng-generate Static API Token.

---

## 2. Dedicated WebSocket Service (`apps/websocket`)

Server URL: `ws://localhost:4001`
Koneksi Wajib Membawa Query Parameter: `?token=<accessToken>`

### Event Specification

| Event Name | Direction | Deskripsi |
| :--- | :--- | :--- |
| `connection` | Server -> Client | Notifikasi handshake berhasil & ID Socket |
| `ping` | Client -> Server | Heartbeat ping client |
| `pong` | Server -> Client | Respon heartbeat dari server |
| `subscribe` | Client -> Server | Bergabung ke room/channel tertentu (`{ "room": "room:orders" }`) |
| `unsubscribe` | Client -> Server | Keluar dari room/channel tertentu |
| `custom_event` | Server -> Client | Pesan/event real-time yang diterima dari publisher REST API |
| `broadcast` | Client -> Server | Mengirim pesan broadcast ke semua client terhubung |
| `notification` | Server -> Client | Notifikasi broadcast yang diterima client |
| `error` | Server -> Client | Notifikasi kesalahan sintaks/validasi payload |

---

## 3. Pino Logging Standard

Seluruh komponen backend & websocket menggunakan logger Pino terpusat dari `@vms/shared` dengan format log terstruktur JSON (production) atau colorized pretty log (development).

