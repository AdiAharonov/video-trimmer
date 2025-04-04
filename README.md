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

├── hooks/

│   ├── useThumbnails.ts

│   ├── useTrim.ts

│   ├── useVideoControls.ts

│   └── __tests__/

│       ├── useThumbnails.test.ts

│       ├── useTrim.test.ts

│       └── useVideoControls.test.ts

├── App.tsx

├── main.tsx

├── setupTests.ts

└── vite.config.ts
```

---

 ✅ Core Functionality
-----------------
-   **Upload a video** from the local file system

-   **Display video** with HTML5 `<video>` tag

-   **Seekable timeline**: Click to seek to any time

-   **Draggable trim handles** to adjust the start/end points for trimming

-   **Preview trimmed segment**: Play only the selected segment without modifying the original file

-   **Export trimmed segment**: UI functionality (media processing like ffmpeg integration required for export)
-   

---
 ✅ Developer Features
-----------------

-   **ESLint** with Airbnb + TypeScript config to maintain code quality

-   **Prettier** auto-formatting to keep code consistent

-   **Strict typing with TypeScript** to catch errors early

-   **Fully testable React components** with unit and integration tests

-   **`jest-dom` matchers** for semantic assertions in tests

-   **Mocked `URL.createObjectURL`** for testing video uploads

-   **Responsive design**: The app is fully responsive and looks great on all screen sizes, with a clean, modern aesthetic
---

 Hooks & Components
-----------------
 **useThumbnails**: Handles the generation of video thumbnails from a given video file. Thumbnails are used in the trim bar for easier interaction.

 **useVideoControls**: Manages video playback controls, including play/pause, seeking, and tracking the current time and video duration.

 **useTrim**: Contains logic for trimming video segments, including setting start and end points, previewing the trimmed segment, and handling the download functionality.

---

🧪 Tests Included
-----------------

-   **File input renders and accepts files**: Ensures video uploads are handled correctly

    -   **Timeline and trim bar conditionally rendered**: Check if these components appear when a video is loaded

    -   **Play/Pause toggle works as expected**: Ensures video control buttons function as expected

    -   **Preview trim functionality plays the defined segment**: Ensures trimming preview works

    -   **All tests run in a `jsdom`-mocked environment**: Simulates the browser for unit testing with no need for a real DOM
---

📜 License
----------

MIT