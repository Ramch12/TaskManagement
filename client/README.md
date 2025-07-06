# Task Management App

A web application for managing projects and tasks, built with React and TypeScript.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Guide](#setup-guide)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication (login/signup)
- Project management (create, update, list projects)
- Task management (create, update, list tasks)
- Responsive UI with sidebar navigation
- Pagination and search for lists
- Custom modals and form components

## Project Structure

```
src/
  API/           # API clients for user, project, and task
  components/    # Reusable UI components
    common/      # Common form and UI elements
    forms/       # Login, signup, project, and task forms
    lists/       # List and table components
    sidebar/     # Sidebar navigation
  Hooks/         # Custom React hooks
  icons/         # SVG and image assets
  pages/         # Main pages (Dashboard, ProjectDetails, Task)
  reducers/      # Redux reducers for app state
  service/       # Service layer
  store.ts       # Redux store setup
  Router.tsx     # App routing
```

## Setup Guide

> **Note:** The `node_modules` directory is not included. You must install dependencies before running the app.

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <project-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   npm install --force
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm start 
   # or
   yarn start
   ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables (Optional)
If your app requires environment variables (e.g., API endpoints), create a `.env` file in the root directory. Example:
```
REACT_APP_API_URL=https://your-api-url.com
```

## Available Scripts

- `npm start` — Runs the app in development mode.
- `npm test` — Launches the test runner.
- `npm run build` — Builds the app for production.
- `npm run eject` — Ejects the app (not reversible).

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
