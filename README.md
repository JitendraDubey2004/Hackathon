# Fashion Tech Riders

Production-style full-stack fashion commerce platform built for hackathon evaluation.

This project demonstrates:
- A complete customer journey from browse to order placement.
- A separate admin workflow for catalog and inventory management.
- Live MongoDB-backed content and transactions.

## Problem Statement

Modern retail applications require:
- Fast product discovery.
- Secure role-based access for customers and admins.
- Reliable order flow and inventory control.
- A clean and responsive user experience suitable for real users.

Fashion Tech Riders addresses these needs through a modular full-stack architecture.

## Key Highlights

- Customer and admin flows are separated by routes and role-based guards.
- Products, categories, and homepage content are fetched from backend APIs.
- Cart, order placement, reorder, and order history are implemented.
- Admin dashboard supports category creation, product management, and stock updates.
- INR pricing is consistently displayed across customer pages.
- MongoDB Atlas is integrated for persistent data storage.

## Technology Stack

Frontend:
- React (Vite)
- React Router
- TanStack Query
- Axios

Backend:
- Node.js
- Express
- Mongoose
- JWT auth + API key middleware

Database:
- MongoDB Atlas

## Architecture Overview

- frontend/: customer + admin web UI
- backend/: REST APIs, controllers, models, middleware
- backend/src/models/: Category, Product, Order, User, Admin, StockHistory
- backend/src/controllers/: auth, catalog, inventory, orders, content

## Feature Coverage

### Customer
- Signup and login
- Browse products by category and search
- Add to cart and buy now flow
- Place order
- View orders and reorder

### Admin
- Admin login
- Create categories
- Create products
- Update stock with reason tracking
- View stock history
- View order list

## Demo URLs

Frontend:
- Home: http://localhost:5173/
- Shop: http://localhost:5173/shop
- Admin portal: http://localhost:5173/admin-portal
- Admin dashboard: http://localhost:5173/admin/dashboard

Backend:
- API base: http://localhost:5000/api
- Health: http://localhost:5000/api/health

## Demo Credentials (Local Hackathon Use)

Admin:
- Email: admin@example.com
- Password: ChangeMe123!

Note: These are development credentials from environment configuration. Replace before any public deployment.

## Setup Instructions

Prerequisites:
- Node.js 20+
- npm 10+
- MongoDB Atlas connection string

1. Install dependencies

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

2. Configure environment files

Backend:
- Copy backend/.env.example to backend/.env
- Set MONGODB_URI, JWT_SECRET, API_KEY, ADMIN_EMAIL, ADMIN_PASSWORD

Frontend:
- Copy frontend/.env.example to frontend/.env
- Set VITE_API_BASE_URL to http://localhost:5000/api

3. Run the project

```bash
npm run dev
```

4. Build frontend for final check

```bash
npm run build --prefix frontend
```

## API Surface (Core)

Auth:
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/admin/login

Catalog:
- GET /api/content/home
- GET /api/categories
- GET /api/products

Admin Catalog:
- POST /api/admin/categories
- PUT /api/admin/categories/:id
- DELETE /api/admin/categories/:id
- POST /api/admin/products
- PUT /api/admin/products/:id
- PATCH /api/admin/products/:id/stock
- DELETE /api/admin/products/:id

Orders:
- POST /api/orders
- GET /api/orders
- POST /api/orders/:id/reorder
- GET /api/orders/admin/all

## Security and Quality Notes

- API key and JWT checks are applied on protected endpoints.
- Role-based route protection is enforced in frontend and backend.
- Centralized error handling and validation middleware are included.
- Project is organized in reusable modules for maintainability.

## Team

Brand: Fashion Tech Riders

