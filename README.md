# Inventory Management System

A secure, internal-only **Inventory Management System**. This application provides a streamlined workflow to manage tools, products, and electronic components with real-time tracking, storage hierarchy, and an automated audit trail.

---

## 🔗 Project Links

- **Live Link:**  https://inventory-ms-x34d.onrender.com

---

## 🛠 Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js

**Database**
- PostgreSQL 

**Authentication**
- JWT (JSON Web Tokens)
- Role-Based Access Control (RBAC)

**Media Storage**
- Cloudinary 

**Security**
- Bcrypt (Password hashing)
- SQL Transactions (Concurrency control)

---

# 🏗 System Architecture

The project follows a **Client–Server Architecture** designed for high security and scalability.

---

## 1️⃣ Role-Based Access Control (RBAC)

The system uses a **granular permission model stored as a JSON array** in the database.

**Admin**
- Full system control
- User Management
- Audit Logs
- Storage Structure (Cupboards / Storage Places)
- Full Inventory CRUD

**Staff**
- Inventory browsing
- Borrowing items
- Returning items

---

## 2️⃣ Backend Design

Built using a **Controller-Service Pattern**.

**Transactions**
- All Borrow / Return operations use **SQL Transactions**
- (`BEGIN`, `COMMIT`)
- Ensures stock levels remain accurate during concurrent requests

---

## 3️⃣ Frontend Flow

**Protected Routes**
- Unauthorized users are automatically redirected to the login page

**Permission Gates**
- UI elements are conditionally rendered based on permissions
- If a user lacks `item.delete`, the delete button is **removed from the DOM**, not just disabled

---


Hierarchy of items:

```
Cupboards
   └── Storage Places
         └── Items
```

Additional tables:

**Borrowing Records**
- Borrower name
- Contact details
- Borrow date
- Expected return date
- Quantity borrowed

**Audit Logs**
- User
- Action
- Timestamp
- Data changes (Previous vs New values)

---

# 🚀 Getting Started

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL Database
- Cloudinary Account (for image uploads)

---

## Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/thurunuym/inventory-management.git
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```env
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloudName
CLOUDINARY_API_KEY=your_cloudinary_apikey
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

## Frontend Setup

```bash
cd ../frontend
npm install
```

---

## Initialize Database

Run the seed script to create the **initial Admin user and system roles**.

```bash
node db/seed.js
```

---




