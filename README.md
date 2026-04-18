# Retail Portal - Environment Setup

This workspace is prepared for a full-stack Retail Portal:

- Frontend: React + Vite SPA
- Backend: Node.js + Express API
- Database: MongoDB Atlas

## Project Structure

- `frontend/` - React SPA
- `backend/` - Express API
- `docker-compose.yml` - Optional local MongoDB service for development

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas account or a local MongoDB instance

## Environment Variables

### Backend

1. Copy `backend/.env.example` to `backend/.env`.
2. Replace `MONGODB_URI` with your MongoDB Atlas connection string.
3. Update secret values (`JWT_SECRET`, `API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env`.
2. Ensure `VITE_API_BASE_URL` points to backend URL.

## Run Locally

1. Start frontend + backend together:
   - `npm run dev`

If you want a local MongoDB container instead of Atlas, you can still run:

- `docker compose up -d`

## Available Scripts

- Root: `npm run dev`, `npm run dev:frontend`, `npm run dev:backend`
- Frontend: `npm run dev --prefix frontend`
- Backend: `npm run dev --prefix backend`

## Starter Health Check

- Backend health endpoint: `GET http://localhost:5000/api/health`

## Backend API Layout

- `POST /api/admin/login`
- `GET /api/admin/profile`
- `GET /api/categories`
- `GET /api/products`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/:id`
- `DELETE /api/admin/categories/:id`
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
