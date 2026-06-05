# ShopHub eCommerce Application

A fully functional Full-Stack MERN (MongoDB, Express, React, Node) eCommerce application built with a responsive frontend (Tailwind CSS, Zustand) and a secure backend API (JWT, Mongoose).

## Features

- **Storefront Catalog**: Responsive product grid with search and category filtering.
- **Product Details**: Individual product pages detailing specifications, rating, and stock controls.
- **Stateful Shopping Cart**: Persists guest additions locally and synchronizes cart selections to user database rows on sign-in.
- **Secure Sandbox Checkout**: Form validations for shipping addresses and realistic total fee calculations.
- **Role-based Authentication**: Secure password hashing with bcrypt, JWT token authentication, and route guards.
- **Administrative Product Dashboard**: Full CRUD management interface for catalog items with stock indicators and summary analytics.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (running locally or a remote MongoDB Atlas URI)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd "Full-Stack eCommerce Application"
   ```

2. Install dependencies for the backend server:
   ```bash
   cd server
   npm install
   ```

3. Install dependencies for the frontend client:
   ```bash
   cd ../frontend
   npm install
   ```

### Database Setup & Seeding

1. Configure environment variables. By default, the app looks for MongoDB at `mongodb://localhost:27017/Ecommerce`. To customize this, create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/Ecommerce
   JWT_SECRET=yoursecretkeyhere
   ```

2. Seed the database with sample products and testing user credentials:
   ```bash
   cd server
   node seed.js
   ```
   *Seeder output will confirm creation of 2 test user accounts and 6 product catalog items.*

---

## Running the Application

### 1. Start the Backend Server
From the `server` directory, run:
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

### 2. Start the Frontend Client
Open a separate terminal window, navigate to the `frontend` directory, and run:
```bash
npm start
```
The application will open in your browser at `http://localhost:3000`.

---

## Testing Credentials

You can test the application features using the pre-seeded accounts:

### Administrator Account
- **Email**: `admin@shophub.com`
- **Password**: `admin123`
- **Permissions**: Access to the Product Catalog, Cart, Checkout, and the **Admin Panel** (dashboard CRUD controls).

### Customer Account
- **Email**: `user@shophub.com`
- **Password**: `user123`
- **Permissions**: Access to the Product Catalog, Cart, and Checkout.
