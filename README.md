# 🎬 Video Trimmer

A modern React + TypeScript web app that allows users to interactively trim videos. Built as a professional-level assignment using clean code principles, modern tooling, and best practices.

---

## 🧰 Tech Stack

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [ESLint](https://eslint.org/) with Airbnb + TypeScript rules
- [Prettier](https://prettier.io/)
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
- [CSS Modules / Flexbox/Grid]

---

## 📦 Getting Started

### 1\. Clone the repository
```bash
git clone https://github.com/<your-username>/video-trimmer.git
cd video-trimmer
```

### 2\. Install dependencies

```bash
`yarn`
```

### 3\. Run the development server

```bash
`yarn dev`
```

### 4\. Lint, format, and test

```bash
yarn lint       # run eslint
yarn format     # run prettier
yarn test       # run tests`
```
---

📁 Project Structure
--------------------

```css
`src/
├── components/
│   ├── VideoPlayer.tsx
│   ├── Timeline.tsx
│   └── TrimBar.tsx
├── styles/
│   └── App.css
├── App.tsx
├── main.tsx
vite.config.ts`
```

---

✅ Features Implemented
----------------------

-   Project bootstrapped with Vite + React + TypeScript

-   Basic component structure for `VideoPlayer`, `Timeline`, and `TrimBar`

-   ESLint & Prettier configured using Airbnb TypeScript style guide

-   Vitest + Testing Library setup for unit/component testing

-   Strict TypeScript enabled
-   
---

🧪 Testing Philosophy
---------------------

This project follows the **testing-library** approach:

-   Test from the user's perspective

-   Prefer queries like `getByRole`, `getByLabelText` over implementation details

-   Use Vitest as a fast test runner for fast feedback
-   
---

📜 License
----------

MIT