
# Project Blueprint

## Overview

This document outlines the plan for implementing an Order Management UI and backend logic with a specific status dropdown and automated workflow. The goal is to create a system that automates the order fulfillment process and provides a clear and organized view of active and completed orders.

## Plan

### 1. Update Status Dropdown

- Modify the status dropdown in `src/pages/OrderDetailsModal.jsx` to include the following options in this exact order:
  - Pending
  - Deposit Paid
  - In Progress
  - Shipped
  - Delivered
  - Order Closed
  - Cancelled

### 2. Implement Automation Logic

- Create a new file, `src/automation.js`, to house the automation logic for the 4-day workflow.
- Define the time intervals for status changes as variables in `src/automation.js`:
  - `IN_PROGRESS_TIMEOUT`: 2 hours
  - `SHIPPED_TIMEOUT`: 72 hours
  - `DELIVERED_TIMEOUT`: 96 hours
- Create a function in `src/automation.js` that will be triggered when an order status is changed to `Deposit Paid`.
- This function will use `setTimeout` to automatically update the order status based on the defined time intervals.
- The automation will be triggered from the `handleStatusChange` function in `src/pages/OrderDetailsModal.jsx`.

### 3. Implement Manual Actions & State Management

- The `handleStatusChange` function in `src/pages/OrderDetailsModal.jsx` will be updated to handle manual status changes.
- The `Order Closed` status will be a manual action that can only be set by an admin.

### 4. Implement Dashboard Filtering

- Create a new file, `src/pages/Orders.jsx`, to implement the dashboard filtering with two distinct views:
  - **Active Orders**: Displays any order with the status: Pending, Deposit Paid, In Progress, Shipped, or Delivered.
  - **Completed/Historical Orders**: Displays only orders marked as Order Closed or Cancelled.
- The `Orders` page will fetch all orders from Firestore and filter them based on the selected view.

### 5. Update Routing

- Update the routing in `src/App.jsx` to include the new `Orders` page.

### 6. Testing

- Run all tests to ensure that the new features are working correctly and that no existing functionality has been broken.
