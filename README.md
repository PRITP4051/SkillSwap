# SkillSwap

A peer-to-peer skill exchange platform.

## Prerequisites
- Node.js 18+
- MongoDB (running locally or remote URI)
- Cloudinary Account (for profile photo uploads)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```

4. Fill in the required `.env` values (MongoDB, Cloudinary keys, JWT secret).

5. Seed the database with sample data:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Default Test Accounts

After running the database seed, you can log in with:

- **Admin Account 1:** `admin@skillswap.com`
- **Admin Account 2:** `arjun@skillswap.com`
- **Password for all seeded accounts:** `Password@123`

## Application Configuration

- **API Base URL:** `http://localhost:5000/api`
- **Socket.IO URL:** `ws://localhost:5000`
