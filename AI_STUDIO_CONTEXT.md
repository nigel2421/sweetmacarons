# Project Context for Google AI Studio

This context document is designed to be provided to an AI (like Gemini) in Google AI Studio or other LLMs to give them a complete understanding of the "Sweet Macarons" project environment and code structure.

---

## 🏗️ Core Context

### Environment
- **Platform**: Project IDX (Cloud-based development)
- **Operating System Integration**: Nix-based environment (`dev.nix`)
- **IDE**: Code OSS

### Project Identity
- **Name**: Sweet Macarons (myapp)
- **Primary Goal**: A premium e-commerce platform for macarons with a focus on ease of use and automated order management.

## 🗂️ Codebase Architecture

### Entry Point
The main entry point is `src/main.jsx`, which renders the `<App />` component wrapped in `<BrowserRouter>`.

### Global State (App.jsx)
The `App` component manages:
- **User Authentication State**: Handled via `onAuthStateChanged`.
- **Cart State**: Local state with item counting/summarizing logic.
- **Admin Status**: Determined via `checkIsAdmin` utility.
- **Orders Snapshot**: Real-time listener to Firestore for active/user orders.

### Navigation / Routing
Routes are defined in `App.jsx` using `react-router-dom` v7. Lazy loading (`Suspense`) is used for all page components to optimize performance.

### Data Model (Firestore)
- **orders**: `{ id, userId, items, status, createdAt, ... }`
- **products/items**: `{ id, name, price, boxOptions, images, ... }`
- **users**: `{ id, email, role, ... }`

### Automation Logic
The status-based automation (e.g., 2h, 72h, 96h intervals) is centralized in `src/automation.js` and triggered by the `OrderDetailsModal.jsx`.

## 🎨 UI Guidelines (Gemini Guidelines)
The app adheres to a "Premium & Vibrant" look:
- **Colors**: Pink/Pastel palette (Sweet theme)
- **Typography**: Expressive through modern fonts.
- **Effects**: Subtle noise texture backgrounds, multi-layered shadows.
- **Interactivity**: Framed with `framer-motion`.

## 🧪 Testing State
Tests are located alongside components or in `src/__tests__`. `vitest` is the runner, using `jsdom` for browser simulation.

---

### Use Case: Building New Features
**Prompt for AI Studio**:
"I am working on the 'Sweet Macarons' project (React + Firebase). Based on the project context above, please help me implement [FEATURE_NAME]. Follow the project's coding patterns: functional components, lazy loading for routes, and Firebase integration."
