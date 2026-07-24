# RenewCred - Enterprise Headless CMS & Dynamic Web Application

RenewCred is an enterprise-grade, block-based Headless Content Management System (CMS) integrated with an authenticated Admin Management Dashboard and a dynamic Public Consumer Website.

All content displayed across the public-facing application is dynamically served via backend REST APIs without any static data fallback.

---

## 🌟 Key Functional Features

1. **Block-Based Content Engine**: Supports modular rich content blocks including:
   - Headers (`h1`, `h2`, `h3` with subtitles)
   - Rich Paragraphs
   - Bullet & Numbered Lists
   - Hierarchical Nested Lists with sub-bullet items
   - Multi-Column Data Tables
   - LaTeX Actuarial Math Formulas (`react-katex` rendering)
   - Structured API Documentation Cards
   - Inline Media Images
2. **Authenticated Admin CMS Panel (`/admin`)**:
   - Next.js 14 App Router, TypeScript, Redux Toolkit, Tailwind CSS, Zod Validation, React Hook Form, and Sonner notifications.
   - Entry point into the CMS with metric overview, content block editor, book catalog management, media asset library, and system settings.
3. **Dynamic Public Consumer Website (`/website`)**:
   - Next.js 14 App Router on Port 3001 with zero hardcoded content — all pages, books, and blocks are fetched dynamically via Express REST endpoints.
   - Formatted in Indian Rupee (`₹ INR`) currency.
4. **Media Asset Management**:
   - Cloudinary integration for streaming inline images and downloadable PDF publications.
5. **Authentication & RBAC**:
   - JWT token-based authentication guard with auto-logout interceptors and role-based access control (`super-admin` / `admin`).
6. **Containerization**:
   - Full Docker & Docker Compose setup (`docker-compose.yml`) orchestrating MongoDB, Backend API, Admin Dashboard, and Public Website.

---

## 🏗️ Architecture & Technology Choices

### 1. Architectural Decisions
- **Block-Based Content Schema**: Instead of storing unstructured HTML strings, page content is stored as an ordered sequence of typed JSON block objects (`header`, `paragraph`, `list`, `nested_list`, `table`, `equation`, `documentation`, `image`). This decouples content structure from presentation, allowing web, mobile, and third-party consumers to render native UI components safely.
- **State Management Strategy (Redux Toolkit vs Local State)**:
  - **Redux Toolkit**: Used for global cross-cutting application state (authenticated user credentials, token lifecycle, cached book catalog array, and dynamic page lists).
  - **Local Component State**: Used for transient UI state (form draft inputs, drag-and-drop file selection, active tabs, modal visibility, and search/filter queries). This keeps the Redux store predictable and uncluttered.

### 2. Stack Summary
- **Frontend**: Next.js 14 (App Router), TypeScript, Redux Toolkit, Tailwind CSS, Lucide Icons, KaTeX (`react-katex`), Zod, React Hook Form, Sonner.
- **Backend**: Express.js REST API (v5), Mongoose (v9), JWT (`jsonwebtoken`), Bcrypt, Multer, Cloudinary SDK.
- **Database**: MongoDB (Local or MongoDB Atlas).
- **Containerization**: Docker & Docker Compose.

---

## 📋 Assumptions Made

1. **Authentication Scope**: Administrators authenticate via JWT bearer tokens stored securely in client storage with header interceptors.
2. **Cloudinary Asset Storage**: Uploads default to Cloudinary when API keys are present, with graceful fallback to image/PDF payload URLs.
3. **Currency & Localization**: Indian Rupee (`₹ INR`) is configured as the default currency format (`en-IN`) across the consumer website and administrative catalog.

---

## 📁 Repository Structure

```
renewcred-cms/
├── backend/            # Express.js REST API + Mongoose + JWT + Cloudinary (Port 5000)
├── admin/              # Admin CMS Dashboard (Port 3000)
├── website/            # Public Consumer Website Frontend (Port 3001)
├── docker-compose.yml  # Docker Container Orchestration
└── README.md           # Documentation & Setup Guide
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18.x` or `v20.x`
- MongoDB Instance (or MongoDB Atlas connection string)
- Docker Desktop (Optional)

---

### Step 1: Clone & Configure Environment Files

1. **Backend Environment** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/renewcred-cms?retryWrites=true&w=majority
JWT_SECRET=f3e7ec4831885fb99a27432e96cc19229d7160d558bf865bb0db99eff1904a8e
JWT_EXPIRES_IN=1d
ADMIN_EMAIL=admin@renewcred.com
ADMIN_PASSWORD=Admin123
ADMIN_USERNAME=Super Admin
```

2. **Admin Environment** (`admin/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

3. **Website Environment** (`website/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

### Step 2: Install Dependencies & Seed Database

```bash
# Navigate to backend and run seeder
cd backend
npm install
npm run seed
```

This seeds:
- Super Admin account (`admin@renewcred.com` / `Admin123`).
- Rich dynamic content pages (`/home`, `/math-specifications`, `/documentation`).

---

### Step 3: Run Local Development Servers

Launch the 3 services in separate terminal windows:

#### Terminal 1 — Backend Express REST API (Port 5000)
```bash
cd backend
npm run dev
```

#### Terminal 2 — Admin CMS Dashboard (Port 3000)
```bash
cd admin
npm run dev
```

#### Terminal 3 — Public Consumer Website (Port 3001)
```bash
cd website
npm run dev
```

---

## 🐳 Docker Deployment

To build and run all services (MongoDB, Backend, Admin, Website) via Docker Compose:

```bash
docker-compose up --build
```

Access URLs:
- **Public Website**: `http://localhost:3001`
- **Admin Management Panel**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

---

## 🔐 Evaluator Demo Credentials

- **Admin Login URL**: `http://localhost:3000/login`
- **Email**: `admin@renewcred.com`
- **Password**: `Admin123`