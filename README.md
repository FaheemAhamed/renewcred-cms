# RenewCred - Production Headless CMS & Dynamic Web Application

RenewCred is an enterprise-grade, block-based Headless Content Management System (CMS) integrated with an authenticated Admin Management Dashboard and a dynamic Public Consumer Website.

---

## 🌟 Key Features

1. **Headless CMS Engine**: Block-based content model supporting Headers, Rich Paragraphs, Bullet/Numbered Lists, Hierarchical Nested Lists, Multi-column Data Tables, LaTeX Actuarial Math Formulas (`react-katex`), and API Documentation Cards.
2. **Authenticated Admin CMS Panel (`/admin`)**: Next.js 14 App Router, TypeScript, Redux Toolkit, Tailwind CSS, Zod Validation, React Hook Form, and Sonner notifications.
3. **Dynamic Public Consumer Website (`/website`)**: Next.js 14 App Router with zero hardcoded content — all pages and books are fetched dynamically via Express REST APIs.
4. **Media & Asset Management**: Cloudinary media streaming integration for inline images and PDF publications.
5. **Role-Based Access Control & JWT**: Token-based authentication with automatic refresh guards.
6. **Containerization**: Full Docker & Docker Compose setup (`docker-compose.yml`).

---

## 🏗️ Architecture Overview

```
renewcred-cms/
├── backend/            # Express.js REST API + Mongoose + JWT + Cloudinary (Port 5000)
├── admin/              # Admin CMS Dashboard (Port 3000)
├── website/            # Public Website Frontend (Port 3001)
└── docker-compose.yml  # Docker Container Orchestration
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18.x` or `v20.x`
- MongoDB Instance (or MongoDB Atlas connection string)
- Docker Desktop (Optional for container deployment)

---

### Step 1: Clone & Setup Environment

Copy `.env.example` in `backend/` and configure your credentials:

```bash
cd backend
cp .env.example .env
```

Default `.env` configuration:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=f3e7ec4831885fb99a27432e96cc19229d7160d558bf865bb0db99eff1904a8e
JWT_EXPIRES_IN=1d

ADMIN_EMAIL=admin@renewcred.com
ADMIN_PASSWORD=Admin123
ADMIN_USERNAME=Super Admin
```

---

### Step 2: Seed Database

Seed initial Super Admin account and rich content pages (LaTeX equations, tables, nested lists):

```bash
cd backend
npm install
npm run seed
```

---

### Step 3: Run Local Development Servers

Open 3 terminal windows to run all services concurrently:

#### 1. Backend Server (Port 5000)
```bash
cd backend
npm run dev
```

#### 2. Admin CMS Dashboard (Port 3000)
```bash
cd admin
npm run dev
```

#### 3. Public Consumer Website (Port 3001)
```bash
cd website
npm run dev
```

---

## 🐳 Docker Deployment

To spin up all services (MongoDB, Backend, Admin, Website) via Docker Compose:

```bash
docker-compose up --build -d
```

Access services at:
- **Public Website**: `http://localhost:3001`
- **Admin CMS Panel**: `http://localhost:3000`
- **Backend Express API**: `http://localhost:5000`

---

## 🔐 Evaluator Demo Credentials

- **Admin Login URL**: `http://localhost:3000/login`
- **Email**: `admin@renewcred.com`
- **Password**: `Admin123`