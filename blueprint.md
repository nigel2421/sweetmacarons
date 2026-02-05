
# Blueprint: Macaron Shop E-Commerce Application

## Overview

This document outlines the plan for fixing order visibility issues, implementing a custom order ID format, and refining the WhatsApp checkout flow for the Macaron Shop e-commerce application.

## Current Implementation

The application is a React-based e-commerce store for a macaron shop. It uses Firebase for backend services, including Firestore for the database. Users can browse products, add them to a cart, and "check out" by sending a pre-formatted WhatsApp message.

### Key Components:
- **`src/CartModal.jsx`**: Manages the shopping cart and the checkout process.
- **`src/pages/Orders.jsx`**: Displays a list of orders for both admins and regular users.
- **`src/firebase.js`**: Firebase configuration.
- **`dataconnect/example/queries.gql`**: Contains GraphQL mutations and queries for interacting with the backend.

### The Problem
1.  **Order Visibility**: New orders are not showing up in the admin dashboard or the user's "My Orders" page. This is likely due to an issue in how the order data is being written to Firestore, or with the status being assigned to new orders.
2.  **Generic Order ID**: The current order IDs are generic and don't provide much context.
3.  **Subpar Checkout UX**: The checkout process is abrupt and doesn't give the user clear confirmation or instructions before redirecting to WhatsApp.

## Plan for Enhancement

### 1. Fix Order Visibility and Implement Custom Order ID

- **Generate Custom Order ID**:
    - Create a new utility function `generateOrderId(user)` in a new file `src/utils.js`.
    - This function will generate an order ID with the format `[AccountName]-[DDMMYY]-[HHMM]-[4 Unique Digits]`.
    - It will use the user's display name or "GUEST" if the user is not logged in.
- **Update Order Creation Logic**:
    - In `src/CartModal.jsx`, modify the `handleCheckout` function.
    - Use the new `generateOrderId` function to create a custom ID for each new order.
    - Ensure that the order object saved to Firestore includes the custom order ID, a `status` of `"pending"`, and the `userId`.

### 2. Refine WhatsApp Checkout Flow

- **Create a Confirmation Modal**:
    - I will use the existing `ConfirmationModal.jsx` and adapt it to display the "Order Successful" message.
- **Update Checkout Process in `src/CartModal.jsx`**:
    - On clicking "Place Order", the new confirmation modal will be displayed.
    - The modal will show the formatted WhatsApp message, including the new custom order ID.
    - A 3-4 second delay will be implemented using `setTimeout`.
    - After the delay, the user will be redirected to the `whatsapp://` API link.
- **Cart Management**:
    - The shopping cart will be cleared *after* the order is successfully submitted and the confirmation modal is shown, but before the redirect.

By implementing these changes, I will resolve the order visibility issue, improve the checkout experience, and provide more meaningful order IDs.
