# AI Studio - Full Stack Assignment

A mini AI Studio web application that simulates fashion image generation, built with React, TypeScript, Express, and SQLite.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Image Generation Studio**: Upload images, add prompts, select styles
- **Error Handling**: Simulated 20% model overload errors with retry mechanism (up to 3 attempts)
- **Generation History**: View and restore last 5 generations
- **Abort Functionality**: Cancel in-flight generation requests
- **Responsive Design**: Works on desktop and mobile
- **Accessibility**: Keyboard navigation, ARIA roles, focus states

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- React Router
- Axios
- Vitest + React Testing Library

### Backend
- Node.js + TypeScript
- Express
- SQLite
- JWT authentication
- Zod validation
- Jest + Supertest

### Testing
- Unit tests (Jest/Vitest)
- E2E tests (Playwright)
- CI/CD (GitHub Actions)

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository
2. Install all dependencies:

```bash
npm run install:all
```

### Development

Start both backend and frontend in development mode:

```bash
npm run dev
```

Or start them separately:

```bash
# Backend only (port 3001)
npm run dev:backend

# Frontend only (port 3000)
npm run dev:frontend
```

### Building

```bash
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend

# E2E tests
npx playwright test
```

## API Documentation

See `OPENAPI.yaml` for complete API specification.

### Endpoints

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/generations` - Create new generation (requires auth)
- `GET /api/generations?limit=5` - Get recent generations (requires auth)

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # TypeScript interfaces
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── validators/    # Zod schemas
│   ├── tests/             # Backend tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   └── services/      # API client
│   └── package.json
├── tests/                 # E2E tests
└── README.md
```

## Notes

- The application simulates AI generation (no real AI is used)
- 20% of generation requests will randomly fail with "Model overloaded" error
- Retry mechanism automatically retries failed requests (up to 3 times with exponential backoff)
- Database is SQLite (stored in `backend/data/database.sqlite`)
- Uploaded images are stored in `backend/uploads/`

## TODO

- [ ] Add image resizing before upload (max width 1920px)
- [ ] Implement code splitting and lazy loading
- [ ] Add dark mode toggle
- [ ] Add UI animations (Framer Motion)
- [ ] Add Docker compose setup

## License

ISC

