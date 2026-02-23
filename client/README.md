# Product Explorer — Client

The frontend interface for the Product Explorer application. Built with **React 19**, **Vite**, and **Tailwind CSS v4** featuring a beautiful, modern glassmorphism UI.

## Features

- **Modern Premium Design:** Frosted glass aesthetics, soft animations, and dynamic color indicators.
- **Product Discovery Engine:** Real-time debounced searching, dynamic facet filtering (Brand, Category, Size, Color), and multi-select toggles.
- **Saved Products Manager:** Persistent global state syncing for saved items using native hooks and Context.
- **Optimized Rendering:** Smooth transitions, loader skeletons, and responsive grid layouts.

## Prerequisites

- Node.js (v18+)

## Setup Instructions

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Configure Environment:**
   No specific `.env` is required for the frontend out of the box because Vite proxies API requests through the internal config (`vite.config.js`).

3. **Backend Requirement:**
   Ensure the backend Laravel server is running correctly on a valid domain mapping (e.g. `http://server.test` or `http://localhost:8000`). If your local PHP backend runs on a different port, update the proxy property in `vite.config.js`:
    ```javascript
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000', // Update this based on your Laravel server
          changeOrigin: true,
        }
      }
    }
    ```

## Running the Application

1. **Start the development server:**

    ```bash
    npm run dev
    ```

2. Open your browser and navigate to the address shown in your terminal (usually `http://localhost:5173`).

## Build for Production

To build the application for production deployment, run:

```bash
npm run build
```

This generates optimized static files inside the `dist` folder.
