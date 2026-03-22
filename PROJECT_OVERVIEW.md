# Sweet Macarons - Project Overview

This document provides a comprehensive overview of the **Sweet Macarons** e-commerce application, designed to be built and managed with Project IDX and Firebase.

## 🚀 Tech Stack

- **Framework**: React 19 (Functional Components, Hooks, Suspense)
- **Build Tool**: Vite 7
- **Routing**: React Router 7 (`react-router-dom`)
- **Backend/Database**: Firebase (Firestore, Auth, Data Connect)
- **Styling**: Vanilla CSS (Modern, mobile-responsive)
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Testing**: Vitest + React Testing Library

## 📁 Project Structure

- `src/`: Core application source code
  - `pages/`: Page components (Home, About, Dashboard, Orders, etc.)
  - `components/`: Reusable UI components (Modals, Header, Footer)
  - `firebase.js`: Firebase SDK initialization and configuration
  - `App.jsx`: Main routing and global state management
- `.idx/`: Project IDX configuration (`dev.nix`)
- `functions/`: Firebase Cloud Functions (if applicable)
- `dataconnect/`: Firebase Data Connect schemas and connectors
- `firestore.rules`: Security rules for Firestore
- `package.json`: Dependency and script management

## 💡 Key Features

- **Storefront**: Vibrant, modern UI for browsing macaron products.
- **Cart & Checkout**: Smooth, interactive cart with quantity management.
- **Authentication**: User and Admin login via Firebase Auth.
- **Admin Dashboard**: Comprehensive order management, user list, and analytics.
- **Order Automation**: Automated status updates based on time intervals (Pending -> Deposit Paid -> In Progress -> Shipped/Delivered).
- **Review System**: User reviews with admin moderation capabilities.

## 🛠️ Development & Build

### Commands
- `npm run dev`: Start Vite development server (port 9005 in IDX environment).
- `npm run build`: Build the production application.
- `npm test`: Run unit tests using Vitest.
- `npm run lint`: Run ESLint for code quality checks.

### Firebase Integration
The project uses Firebase for all backend services. 
- **Firestore**: Collections for `products`, `orders`, `users`, and `reviews`.
- **Auth**: Email/Password and social login providers.
- **Rules**: Security rules are defined in `firestore.rules`.

## 📦 Core Dependencies
- `firebase`, `framer-motion`, `react-router-dom`, `react-toastify`, `recharts`, `jspdf`.
