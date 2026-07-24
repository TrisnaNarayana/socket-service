# Boilerplate WebSocket & REST API Monorepo Architecture

Boilerplate repositori monorepo terstandarisasi untuk **Service WebSocket Dedicated** dan **Express REST API** berbasis TypeScript, Prisma ORM, PostgreSQL, JWT Authentication, Zod validation, Pino logger, dan Vite + React dashboard.

---

## 📁 Struktur Monorepo

```text
.
├── apps/
│   ├── backend/        # REST API Express (TypeScript) - [Interface -> Validation -> Repository -> Service -> Controller]
│   ├── websocket/      # Dedicated WebSocket Service (TypeScript) - [Auth Handshake, Connection/Room Manager, Zod Dispatcher]
│   └── dashboard/      # Web Dashboard (Vite + React + TypeScript) - [JWT Auth, Auto-Reconnect WS Hook, Real-time Monitor UI]
├── packages/
│   ├── shared/         # Shared Logger (Pino), Zod Schemas, & TS Interfaces
│   └── database/       # Prisma ORM & PostgreSQL Data Models
├── docs/
│   ├── API_SPECIFICATION.md       # Spesifikasi REST Endpoints & WebSocket Events
│   └── CLIENT_INTEGRATION_GUIDE.md# Panduan Integrasi Client (Publish via REST & Subscribe via WS)
├── .env.example
├── issue.md            # Master Plan & Architecture Document
├── package.json        # NPM Workspaces Root
└── tsconfig.base.json  # Shared TypeScript Base Configuration
```

---

## 🚀 Progress & Status Implementasi (Checklist)

### ✅ Tahap 1: Setup Workspace & Shared Packages (Monorepo Foundation)
- [x] Inisialisasi Monorepo Workspace (NPM Workspaces `packages/*`, `apps/*`)
- [x] Setup Base TypeScript Configuration (`tsconfig.base.json`)
- [x] Setup Shared Package (`packages/shared`)
  - [x] Pino Logger utilitas terpusat (`@vms/shared/logger`)
  - [x] Zod Schemas untuk Auth, User, dan WS events (`@vms/shared/schemas`)
  - [x] TypeScript Interfaces & Types (`@vms/shared/interfaces`)
- [x] Setup Database Package (`packages/database`)
  - [x] Prisma ORM configuration dengan PostgreSQL provider
  - [x] Data Model Prisma: `User`, `RefreshToken`, `WSSession`
  - [x] Reusable PrismaClient instance export

---

### ✅ Tahap 2: REST API Backend (`apps/backend`)
- [x] Setup Core Express Server dengan Middleware (CORS, Helmet, Pino HTTP Logger)
- [x] Implementasi Modul Autentikasi JWT (Register, Login, Refresh Token, Logout, RBAC Middleware)
- [x] Penerapan Struktur Layer Modular (`Interface` -> `Validation` -> `Repository` -> `Service` -> `Controller`)
- [x] Unit Test Suite untuk AuthService & Endpoint REST API

---

### ✅ Tahap 3: Dedicated WebSocket Service (`apps/websocket`)
- [x] Setup WebSocket Server berbasis TypeScript (`ws` library)
- [x] Verifikasi Handshake Koneksi dengan Token JWT
- [x] Event Dispatcher & Connection/Room Manager Modular
- [x] Integrasi Logging Pino & Sync Session State ke Database (`WSSession`)
- [x] Test Cases untuk WebSocket (Connection, Handshake Auth, Event Publish/Broadcast, Disconnection)

---

### ✅ Tahap 4: Web Dashboard (`apps/dashboard`)
- [x] Setup Vite + React + TypeScript Project
- [x] Modul Login & Protected Route berbasis JWT Session (`useAuth`)
- [x] WebSocket Client Custom Hook dengan Auto-Reconnect Strategy (`useWebSocket`)
- [x] Real-time Monitoring & Event Testing Dashboard UI

---

### ✅ Tahap 5: Quality Assurance, Logging & Dokumentasi
- [x] Standardisasi Format Log Pino di Seluruh Service
- [x] Verifikasi Test Cases (Unit tests untuk Backend & WebSocket service)
- [x] Setup Dokumentasi Spesifikasi API & Event WebSocket Payload (`docs/API_SPECIFICATION.md`)
- [x] Update README Master Monorepo

---

## 🛠️ Cara Penggunaan & Setup Lokal

1. **Clone repository & Install dependensi**:
   ```bash
   npm install
   ```

2. **Setup Environment Variables**:
   ```bash
   cp .env.example .env
   ```

3. **Generate Prisma Client**:
   ```bash
   npm run db:generate
   ```

4. **Jalankan Express Backend (Dev Mode)**:
   ```bash
   npm run dev --workspace=apps/backend
   ```

5. **Jalankan Dedicated WebSocket Service (Dev Mode)**:
   ```bash
   npm run dev --workspace=apps/websocket
   ```

6. **Jalankan Frontend Web Dashboard (Dev Mode)**:
   ```bash
   npm run dev --workspace=apps/dashboard
   ```

---

## 🐳 Deploy Menggunakan Docker & Docker Compose

Jalankan seluruh stack (PostgreSQL, Backend API, WebSocket Gateway, Nginx Dashboard) dalam satu perintah:

```bash
docker compose up --build -d
```

* **Backend REST API**: `http://localhost:4000`
* **WebSocket Gateway**: `ws://localhost:4001`
* **Web Dashboard**: `http://localhost:5173`
* **PostgreSQL Database**: `localhost:5432`

