
# Application Blueprint

## 1. Overview

**Purpose:** A modern, responsive e-commerce web application for a macaron business named "Los Tres Macarons." The application allows users to browse products, place orders, and manage their accounts. Administrators have access to a dashboard for managing users, orders, and viewing analytics.

**Key Features:**
- User authentication (Google & Email)
- Product catalog with details
- Shopping cart and checkout
- Order history and reordering
- Admin dashboard with user and order management
- Real-time data updates with Firestore

## 2. Architecture & Design Choices

- **Frontend:** React (Vite)
- **Backend:** Firebase (Authentication, Firestore, Cloud Functions)
- **Styling:** CSS with a focus on modern, responsive design
- **Routing:** `react-router-dom` for client-side navigation
- **Real-time Data:** Firestore `onSnapshot` for live updates to orders.

## 3. Implemented Features & Styles

- **Header:** A sticky header with the logo, site title, navigation links, cart icon, and user profile icon.
- **Footer:** A simple footer with navigation links and social media icons.
- **Home Page:** Displays a hero section and a grid of macaron products.
- **Product Cards:** Each card shows the macaron's name, image, and price, with a button to add it to the cart.
- **Cart:** A modal that displays the items in the cart, with options to remove items or clear the cart.
- **User Authentication:** A login page with options for Google Sign-In and email/password authentication.
- **User & Admin Roles:** The application distinguishes between regular users and administrators, with administrators having access to a protected dashboard.
- **Orders Page:** Displays a table of the user's past orders, with real-time status updates.
- **User Management Page:** An admin-only page that currently displays a list of users who have placed orders.
- **Code Splitting:** `React.lazy` is used to lazy-load page components, improving initial load times.

## 4. Current Task: Fix User Management & Ensure Real-time Updates

**Problem:** The User Management page (`/users`) does not display all registered users; it only shows users who have placed at least one order. Additionally, the user wants to ensure that all data, including orders, is refreshed in real-time.

**Plan:**

1.  **Confirm Real-time Order Updates:** The application already uses Firestore's `onSnapshot` for real-time updates on the `Orders` page, so this functionality is already implemented.

2.  **Create a Firebase Cloud Function:**
    - A new HTTP-callable Cloud Function named `listUsers` will be created.
    - This function will use the Firebase Admin SDK to fetch the complete list of users from Firebase Authentication.
    - The function will be secured to ensure that only authenticated admin users can call it.

3.  **Update the User Management Page (`Users.jsx`):**
    - The `Users.jsx` component will be modified to call the new `listUsers` Cloud Function.
    - The component will then merge the complete user list from the function with the existing order data from Firestore to provide a comprehensive view of all users and their order history.
