# 🎴 TapCard — Full-Stack NFC Smart Business Card Platform

> **A high-performance, single-repo full-stack platform built with Next.js 15, Prisma ORM, and PostgreSQL.**  
> Includes public customer-facing store, interactive 3D card customizer, full REST API backend, and an administrative telemetry suite.

---

## 📑 Table of Contents
1. [Tech Stack & Architecture](#-tech-stack--architecture)
2. [Default Credentials](#-default-credentials)
3. [Environment Variables](#-environment-variables)
4. [Option 1: Run Locally (Without Docker)](#-option-1-run-locally-without-docker)
5. [Option 2: Run Locally (With Docker)](#-option-2-run-locally-with-docker)
6. [Option 3: Production Server Deployment (Without Docker - PM2 & Nginx)](#-option-3-production-server-deployment-without-docker)
7. [Option 4: Production Server Deployment (With Docker & Docker Compose)](#-option-4-production-server-deployment-with-docker)
8. [Option 5: 1-Click Cloud Deployment (Vercel + Supabase)](#-option-5-1-click-cloud-deployment-vercel--supabase)
9. [Database Management & Prisma Studio](#-database-management--prisma-studio)
10. [API Endpoints Overview](#-api-endpoints-overview)

---

## ⚡ Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router, Server Route Handlers)
- **Frontend UI**: React 19, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons, Canvas-Confetti
- **ORM & Database**: Prisma Client v6 & PostgreSQL
- **Authentication**: JWT (Access & Refresh tokens) + dual PBKDF2/Bcrypt password hashing
- **Repository Structure**: Single repository (monorepo) combining:
  - Public Storefront (`/`)
  - Admin SaaS Portal (`/admin/*`)
  - Full REST API Backend (`/api/*`)

---

## 🔑 Default Credentials

- **Admin Login URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@tapcard.com`
- **Password**: `admin123`

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# PostgreSQL Database URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nfc_card_db?schema=public"

# JWT Authentication Secret (Use a long random string in production)
JWT_SECRET="tapcard-super-secret-jwt-key-change-this-in-production-2026"

# Public Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Optional: Port configuration
PORT=3000
```

---

## 💻 Option 1: Run Locally (Without Docker)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18+, v20+, or v22+)
- [PostgreSQL](https://www.postgresql.org/) running locally (port `5432`)

### Step-by-Step Instructions

1. **Clone the repository and switch to the full-stack branch**:
   ```bash
   git clone <repo-url>
   cd nfc_branding_page
   git checkout feature/nextjs-fullstack
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Verify your PostgreSQL connection string in .env
   ```

4. **Prepare the database & seed initial data**:
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Sync database schema with PostgreSQL
   npx prisma db push

   # Seed default admin user & catalog items
   node prisma/seed.js
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

   - **Public Store**: [http://localhost:3000](http://localhost:3000)
   - **Admin Console**: [http://localhost:3000/admin](http://localhost:3000/admin)

6. **Build and run for production (Local test)**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🐳 Option 2: Run Locally (With Docker)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1-Command Startup

Run the following command in the project root:

```bash
docker compose up --build
```

Docker Compose will automatically:
1. Spin up a PostgreSQL 16 container (`db`).
2. Build the Next.js multi-stage container (`web`).
3. Apply database migrations and seed default credentials.
4. Expose the web application on port `3000`.

- Access the app: [http://localhost:3000](http://localhost:3000)
- Admin Login: `admin@tapcard.com` / `admin123`

### Stop Docker Containers
```bash
docker compose down
# To also delete database volume data:
docker compose down -v
```

---

## 🚀 Option 3: Production Server Deployment (Without Docker)

Use this setup on any Ubuntu/Debian Linux VPS (DigitalOcean, AWS EC2, Linode, Hetzner, etc.) using **PM2** and **Nginx**.

### 1. Install Node.js, PostgreSQL & PM2 on Server
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx postgresql postgresql-contrib

# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

### 2. Configure PostgreSQL Database
```bash
sudo -u postgres psql
```
Inside the PostgreSQL shell:
```sql
CREATE DATABASE nfc_card_db;
CREATE USER tapcard_user WITH ENCRYPTED PASSWORD 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON DATABASE nfc_card_db TO tapcard_user;
\q
```

### 3. Clone Repository & Setup App
```bash
cd /var/www
git clone <repo-url> tapcard
cd tapcard
git checkout feature/nextjs-fullstack

npm install
```

Create production `.env`:
```bash
nano .env
```
Paste your production configuration:
```env
DATABASE_URL="postgresql://tapcard_user:YourStrongPassword123!@localhost:5432/nfc_card_db?schema=public"
JWT_SECRET="generate-a-random-64-character-hex-string-for-security"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NODE_ENV="production"
PORT=3000
```

### 4. Push Schema & Build
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run build
```

### 5. Start with PM2
```bash
pm2 start npm --name "tapcard" -- start
pm2 save
pm2 startup
```

### 6. Configure Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/tapcard
```
Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site & reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/tapcard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Enable Free SSL (HTTPS) with Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🚢 Option 4: Production Server Deployment (With Docker)

### 1. Install Docker & Compose on Ubuntu Server
```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable --now docker
```

### 2. Clone Repository & Configure `.env`
```bash
cd /opt
git clone <repo-url> tapcard
cd tapcard
git checkout feature/nextjs-fullstack

# Configure your production environment variables
nano .env
```

### 3. Launch with Docker Compose in Detached Mode
```bash
docker compose up -d --build
```

### 4. Check Container Logs & Status
```bash
docker compose ps
docker compose logs -f web
```

---

## ☁️ Option 5: 1-Click Cloud Deployment (Vercel + Supabase)

1. **Database (Supabase / Neon / Render Postgres)**:
   - Create a free PostgreSQL database on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
   - Copy the Connection String (URI format).

2. **Deploy to Vercel**:
   - Push your branch `feature/nextjs-fullstack` to GitHub.
   - Go to [Vercel Dashboard](https://vercel.com) -> **Add New Project**.
   - Import this repository.
   - Set Root Directory to `./` (root).
   - Under **Environment Variables**, add:
     - `DATABASE_URL`: Your Supabase/Neon PostgreSQL URI.
     - `JWT_SECRET`: Random 32+ character string.
     - `NEXT_PUBLIC_SITE_URL`: Your Vercel production URL.
   - Click **Deploy**!

3. **Run Initial Migration**:
   From your local terminal pointing to the Supabase database:
   ```bash
   DATABASE_URL="<your-supabase-url>" npx prisma db push
   DATABASE_URL="<your-supabase-url>" node prisma/seed.js
   ```

---

## 🛠️ Database Management & Prisma Studio

Prisma Studio is a visual browser GUI for your database tables.

```bash
# Launch Prisma Studio GUI
npx prisma studio
```
Access GUI at `http://localhost:5555` to view, search, edit, or delete any record visually.

Useful CLI helpers:
```bash
# Regenerate Prisma Client
npm run prisma:generate

# Push schema changes to database
npm run prisma:push

# Re-seed default admin credentials
npm run prisma:seed
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates admin, returns JWT access & refresh tokens |
| `POST` | `/api/auth/refresh` | Public | Refreshes expired access tokens |
| `GET` | `/api/auth/me` | Protected | Returns current authenticated user profile |
| `POST` | `/api/auth/change-password` | Protected | Updates admin account password |
| `GET` | `/api/products` | Public / Admin | List card catalog items (supports `?search=`) |
| `POST` | `/api/products` | Admin | Create product with auto-slug & VIP tier pricing |
| `PATCH/DEL` | `/api/products/[id]` | Admin | Update or delete product |
| `GET/POST` | `/api/orders` | Public / Admin | Create customer order or retrieve list |
| `PATCH/DEL` | `/api/orders/[id]` | Admin | Update order status or delete order |
| `GET` | `/api/admin/dashboard` | Admin | Analytics, revenue trends, status distribution |
| `GET/DEL` | `/api/admin/customers` | Admin | Customer directory with total orders & spent |
| `GET/POST` | `/api/testimonials` | Public / Admin | Customer review submissions & moderation |
| `GET/POST` | `/api/faqs` | Public / Admin | Frequently asked questions |
| `GET/POST` | `/api/contact` | Public / Admin | Contact inquiries & read receipts |
| `GET/POST` | `/api/settings` | Public / Admin | Global settings (YouTube showcase video, etc.) |

---

## 📄 License
This project is proprietary software for TapCard. All rights reserved.