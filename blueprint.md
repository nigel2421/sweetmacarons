
# Macaron Shop Blueprint

## Overview

This document outlines the features and design of the Macaron Shop application. It serves as a single source of truth for the project's capabilities, from its initial version to the current state.

## Core Features (v1)

*   **Product Showcase:** A beautiful, responsive gallery of macaron flavors.
*   **Shopping Cart:** Users can add and remove items from their cart.
*   **Checkout:** A simple checkout process to place orders.
*   **Admin Dashboard:** A private section for the administrator to view and manage orders.
*   **Order Management:** Admins can view order details, including items, totals, and customer information.

## Design & Style

*   **Theme:** Modern, elegant, and visually appealing, with a focus on high-quality product imagery.
*   **Color Palette:** A sophisticated mix of pastels and bold accent colors.
*   **Typography:** Clean and readable fonts (e.g., Avenir).
*   **Layout:** Responsive and mobile-first, ensuring a seamless experience on all devices.

## Current Implementation Plan

### Feature: Enhanced Order Workflow & Customer Management

1.  **Dynamic Order Status Workflow:**
    *   **Goal:** Allow the admin to update the status of an order through a workflow.
    *   **Implementation:**
        *   Add a dropdown menu in the `OrderDetailsModal` component.
        *   The dropdown will contain the following statuses: `New`, `Deposit Paid`, `Confirmed`, `Processed`, `Delivered`.
        *   An `onchange` event handler will trigger a Firestore update to change the `status` field of the order document.

2.  **Revenue Tied to "Delivered" Status:**
    *   **Goal:** Make the revenue metric on the dashboard more accurate by only counting completed sales.
    *   **Implementation:**
        *   In the `Dashboard.jsx` component, the `totalRevenue` calculation will be modified.
        *   It will first filter the `orders` array to include only documents where `status === 'Delivered'`.
        *   The `reduce` function will then sum the `grandTotal` of these filtered orders.

3.  **Customer Name and Phone Number:**
    *   **Goal:** Capture customer contact information to track orders and identify repeat customers.
    *   **Implementation:**
        *   Add two new input fields (`customerName`, `customerPhone`) to the `Checkout.jsx` form.
        *   These fields will be added to the order object when a new order is created in Firestore.
        *   The `OrderDetailsModal.jsx` will be updated to display this new information.

4.  **Data Security:**
    *   **Goal:** Protect customer phone numbers from unauthorized access.
    *   **Implementation:**
        *   `firestore.rules` will be updated to restrict read/write access to order documents to authenticated admins only. This ensures customer data is not publicly exposed.
