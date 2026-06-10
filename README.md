## Quick Start Image Processing Web Application

```bash
git clone <repository-url>

cd image-processing

docker compose up -d

# Backend
cd BE
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
#Folder Uploads, terdapat file-file image, boleh dihapus

# Frontend (terminal baru)
cd FE
npm install
npm run dev
```

Frontend:
http://localhost:3000

Backend:
http://localhost:3001

Swagger:
http://localhost:3001/api


# Image Processing Web Application

A simple web application that accepts an image upload, processes it asynchronously using BullMQ and Redis, and allows users to download the optimized image after processing.

---

# Tech Stack

## Frontend

* Nuxt 4
* Tailwind CSS
* Axios

## Backend

* NestJS
* Prisma ORM
* PostgreSQL

## Async Processing

* Redis
* BullMQ

## Image Processing

* Sharp

## DevOps

* Docker Compose

---

# Project Structure

```
image-processing
│
├── FE
│   ├── components
│   ├── composables
│   ├── types
│   └── app.vue
│
├── BE
│   ├── src
│   ├── prisma
│   └── uploads
│
└── docker-compose.yml
```

---

# Prerequisites

Pastikan sudah menginstall:

* Node.js 20+
* Docker Desktop
* Git

---

# Installation

## 1. Clone Repository

```
git clone <repository-url>

cd image-processing
```

---

# Start Database Services

Jalankan PostgreSQL dan Redis:

```
docker compose up -d
```

Pastikan container berhasil berjalan:

```
docker ps
```

Container yang aktif:

* image-postgres
* image-redis

---

# Backend Setup

Masuk ke folder backend:

```
cd BE
```

Install dependencies:

```
npm install
```

---

## Backend Environment

Buat file:

```
BE/.env
```

Isi dengan:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/image_processing"

REDIS_HOST=localhost
REDIS_PORT=6379

PORT=3001
```

---

## Prisma

Generate Prisma Client:

```
npx prisma generate
```

Jalankan migration:

```
npx prisma migrate dev
```

---

## Start Backend

```
npm run start:dev
```

Backend berjalan di:

```
http://localhost:3001
```

Swagger:

```
http://localhost:3001/api
```

---

# Frontend Setup

Buka terminal baru.

Masuk ke folder frontend:

```
cd FE
```

Install dependencies:

```
npm install
```

---

## Frontend Environment

Buat file:

```
FE/.env
```

Isi dengan:

```
NUXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Start Frontend

```
npm run dev
```

Frontend berjalan di:

```
http://localhost:3000
```

---

# API Endpoints

## Upload Image

```
POST /jobs/upload
```

Response:

```
{
    "jobId": "...",
    "status": "PENDING"
}
```

---

## Get Job Status

```
GET /jobs/:id
```

Response:

```
{
    "id": "...",
    "status": "PROCESSING"
}
```

atau

```
{
    "id": "...",
    "status": "COMPLETED",
    "processedFile": "..."
}
```

---

## Download Processed Image

```
GET /jobs/:id/download
```

---

# Processing Flow

```
Frontend
    │
    ▼
POST /jobs/upload
    │
    ▼
Save File
    │
    ▼
Create Job (PENDING)
    │
    ▼
BullMQ Queue
    │
    ▼
Redis
    │
    ▼
Worker
    │
    ▼
PROCESSING
    │
    ▼
Sharp Resize
    │
    ▼
Convert WebP
    │
    ▼
COMPLETED
    │
    ▼
GET /jobs/:id
    │
    ▼
Frontend Polling
    │
    ▼
Download Image
```

---

# Development Workflow

Jalankan service berikut:

Terminal 1:

```
docker compose up -d
```

Terminal 2:

```
cd BE

npm run start:dev
```

Terminal 3:

```
cd FE

npm run dev
```

---

# Stop Services

Stop Docker:

```
docker compose down
```

Jika ingin menghapus volume database:

```
docker compose down -v
```
