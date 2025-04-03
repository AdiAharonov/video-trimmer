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
git clone https://github.com/AdiAharonov/video-trimmer.git
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

│   ├── VideoPlayer.tsx

│   ├── Timeline.tsx

│   ├── TrimBar.tsx

│   └── __tests__/

│       └── VideoPlayer.test.tsx

├── styles/

│   ├── App.css

│   └── VideoPlayer.module.css

├── App.tsx

├── main.tsx

├── setupTests.ts

vite.config.ts`
```

---

### ✅ Core Functionality

-   Upload a video from local file system

-   Display video with HTML5 `<video>` tag

-   Clickable timeline to seek to any time

-   Draggable trim handles for start/end points

-   Preview only the selected trimmed segment without modifying the original file
-   Export trimmed segment (UI only — requires media processing like ffmpeg)
-   

---

### ✅ Developer Features

-   ESLint with Airbnb + TypeScript config

-   Prettier auto-formatting

-   Strict typing with TypeScript

-   Fully testable React components

-   `jest-dom` matchers for semantic assertions

-   Mocked `URL.createObjectURL` for testing video uploads
-   
---

🧪 Tests Included
-----------------

-   File input renders and accepts files

-   Timeline and trim bar conditionally rendered

-   Play/Pause toggle works as expected

-   Preview trim functionality plays the defined segment

-   All tests run in a `jsdom`-mocked environment 
---

📜 License
----------

MIT