
# Blueprint: Macaron Shop E-Commerce Application

## Overview

This document outlines the project structure, features, and recent changes implemented in the Macaron Shop e-commerce application. The application is a modern, responsive React web app designed to provide a seamless and visually appealing user experience for purchasing macarons.

## Project Outline

### Styling & Design
*   **Component Library**: The application uses a custom-built component library, ensuring a unique and branded look and feel. Key components from `shadcn/ui` like `Card` and `Button` were used as a base and customized.
*   **CSS Structure**: A combination of global styles (`index.css`), component-specific styles (`App.css`), and utility classes from Tailwind CSS is used for a modular and maintainable styling architecture.
*   **Design**: The application features a visually balanced layout with clean spacing, a custom color palette (featuring `--primary-color: #e75480`), and a strong focus on creating an intuitive and delightful user experience. Interactive elements are designed to be engaging, and the overall aesthetic is modern and polished.

### Features Implemented
*   **Routing**: Client-side routing is managed by `react-router-dom`, providing seamless navigation between different pages.
*   **Core Components**:
    *   `App.jsx`: The main application component that orchestrates routing and global state.
    *   `Header.jsx`, `Footer.jsx`: Reusable layout components that provide consistent branding and navigation.
    *   `Home.jsx`: The primary landing page, featuring product displays and interactive elements.
    *   `About.jsx`, `Contact.jsx`: Static pages providing additional information about the shop.
    *   `LegalInfo.jsx`: A component that displays the privacy policy and other legal information.
    *   A comprehensive set of components for the shopping cart, product modals, user accounts, and an admin dashboard.
*   **Backend & Authentication**: Firebase is used for backend services, including user authentication (Firebase Auth) and database management (Firestore).
*   **Checkout Flow**: The application features a unique checkout process that redirects users to WhatsApp with a pre-formatted order message.

## Recent Change: Bug Fix

### Problem: Blank Screen due to Ad Blocker
The application was failing to render and instead showed a blank screen for users who had ad-blocking browser extensions enabled. An investigation of the browser's developer console revealed a `net::ERR_BLOCKED_BY_CLIENT` error. This error indicated that the resource at `src/pages/PrivacyPolicy.jsx` was being blocked. Ad blockers commonly flag files containing keywords like "Privacy" or "Policy" in their names, as they are often associated with tracking scripts.

### Solution: Renaming the Component and Associated Files
To circumvent the ad blocker and ensure the application renders correctly for all users, the following steps were taken:

1.  **File Renaming**:
    *   The component file `src/pages/PrivacyPolicy.jsx` was renamed to `src/pages/LegalInfo.jsx`.
    *   The corresponding stylesheet `src/pages/PrivacyPolicy.css` was renamed to `src/pages/LegalInfo.css`.

2.  **Component Renaming**: The `PrivacyPolicy` React component was refactored and renamed to `LegalInfo`.

3.  **Code Updates**: All references, including imports and route definitions in `App.jsx`, were updated to use the new `LegalInfo` component and its associated CSS file.

This solution effectively resolves the issue by removing the keyword that triggered the ad blocker, allowing the component to be loaded and the application to function as intended.
