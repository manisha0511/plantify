# Plantify — Personal Learning Notes
## Module 01: React, Vite, and Modern Frontend Foundations

### 1. What Are These Core Tools?

#### Node.js & npm
* **Node.js:** A JavaScript runtime environment built on Chrome's V8 engine that lets us run JavaScript outside of a browser (e.g., executing build scripts, package managers, and development servers on our computer).
* **npm (Node Package Manager):** The default package manager for Node.js. It downloads reusable libraries and utilities from the npm registry and tracks them in `package.json` and `package-lock.json`.

#### React (`react` & `react-dom`)
* **`react`:** The core UI library. It allows us to build user interfaces using modular **components** (reusable functions returning UI elements) and **JSX** (syntax extension that allows writing HTML-like code inside JavaScript). React uses a Virtual DOM to calculate minimal updates to the real DOM when data changes.
* **`react-dom`:** The web-specific renderer. It connects React components to the real browser DOM via `ReactDOM.createRoot()`.

#### Vite (`vite` & `@vitejs/plugin-react`)
* **Vite:** A modern frontend build tool and dev server. Unlike older tools like Webpack or Create React App that bundled the entire project before serving, Vite serves code using native browser ES Modules (`import`/`export`), giving near-instant server boot times and ultra-fast Hot Module Replacement (HMR).
* **`@vitejs/plugin-react`:** The official plugin that enables JSX transformation and Fast Refresh (updating code in the browser instantly without losing UI state).

---

### 2. Entry Files & Execution Flow

When a user visits the app, the execution flow follows this exact sequence:

1. **`index.html` (Browser Entry Point):**
   * The browser requests `http://localhost:5174/`.
   * Vite serves `index.html`.
   * The HTML includes a root container `<div id="root"></div>` and a module script `<script type="module" src="/src/main.jsx"></script>`.

2. **`src/main.jsx` (JavaScript Entry Point):**
   * The browser executes `main.jsx`.
   * It imports `React`, `ReactDOM`, and our root component `<App />`.
   * It calls `ReactDOM.createRoot(document.getElementById('root')).render(<App />)`.
   * This injects the rendered React component tree into the `<div id="root">` element.

3. **`src/App.jsx` (Root Component):**
   * Defines the initial React component returning JSX.
   * Renders the Plantify welcome card and status check.

---

### 3. Commands Executed & Real Test Results

#### A. Dependency Installation
* **Command:**
  ```powershell
  npm install react react-dom
  npm install -D vite @vitejs/plugin-react
  ```
* **Result:**
  * Added 3 production packages and 16 development packages.
  * Audit result: `found 0 vulnerabilities`.
  * Installed versions: `react@19.3.0`, `react-dom@19.3.0`, `vite@8.3.4`, `@vitejs/plugin-react@6.1.2`.

#### B. Production Build Verification
* **Command:**
  ```powershell
  npm run build
  ```
* **Result:**
  * Successfully compiled and bundled in 596ms.
  * Output chunks:
    * `dist/index.html` (0.74 kB)
    * `dist/assets/index-BkF92878.js` (222.23 kB)
  * Exit Code: `0` (Success).

#### C. Local Development Server
* **Command:**
  ```powershell
  npm run dev
  ```
* **Result:**
  * Dev server started and listening at `http://localhost:5174/`.
  * HTTP GET check returned `StatusCode: 200 OK`.
