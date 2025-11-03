# Quick Start Guide - Running & Testing

## 🚀 Running the Application

### Step 1: Install Dependencies

From the root directory, run:

```bash
npm run install:all
```

This will install dependencies for:
- Root package (concurrently)
- Backend (Node.js/Express)
- Frontend (React/Vite)

### Step 2: Start Both Services

**Option A: Run Both Together (Recommended)**
```bash
npm run dev
```

This starts:
- Backend on `http://localhost:3001`
- Frontend on `http://localhost:3000`

**Option B: Run Separately**

Terminal 1 - Backend:
```bash
npm run dev:backend
# or
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
# or
cd frontend
npm run dev
```

### Step 3: Access the Application

1. Open your browser to: `http://localhost:3000`
2. You'll be redirected to the login page
3. Create a new account or login
4. Start using the AI Studio!

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Backend Tests Only
```bash
npm run test:backend
# or
cd backend
npm test
```

**Backend Test Commands:**
```bash
# Run tests with coverage
cd backend
npm run test:coverage

# Watch mode (for development)
npm run test:watch
```

### Frontend Tests Only
```bash
npm run test:frontend
# or
cd frontend
npm test
```

**Frontend Test Commands:**
```bash
# Run tests with coverage
cd frontend
npm run test:coverage

# Watch mode
cd frontend
npm test -- --watch

# UI mode (visual test runner)
cd frontend
npm run test:ui
```

### E2E Tests (Playwright)
```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npx playwright test

# Run with UI (visual test runner)
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e.spec.ts
```

**Note:** E2E tests require both backend and frontend to be running!

## 📋 Testing Checklist

### Manual Testing Checklist

#### Authentication
- [ ] Sign up with new email
- [ ] Login with credentials
- [ ] Logout works
- [ ] Protected routes redirect to login

#### Image Generation
- [ ] Upload image (JPEG/PNG, max 10MB)
- [ ] See image preview
- [ ] Enter prompt text
- [ ] Select style from dropdown
- [ ] Click Generate button
- [ ] See loading spinner
- [ ] Success: See generated result
- [ ] Error: See "Model overloaded" message (20% chance)
- [ ] Retry works (automatic, up to 3 times)
- [ ] Abort button cancels generation

#### Generation History
- [ ] View last 5 generations in sidebar
- [ ] See thumbnails and timestamps
- [ ] Click generation to restore (fills prompt/style)
- [ ] History updates after new generation

#### UI/UX
- [ ] Responsive on mobile (resize browser)
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Error messages are clear
- [ ] Buttons disabled during loading

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3001 is in use
# On Windows:
netstat -ano | findstr :3001

# Kill the process or change PORT in backend/.env
cd backend
# Check logs for errors
npm run dev
```

### Frontend won't start
```bash
# Check if port 3000 is in use
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database issues
```bash
# Delete database and restart (fresh start)
cd backend
rm -rf data/database.sqlite
npm run dev
# Database will be recreated automatically
```

### Tests failing
```bash
# Backend tests - ensure database is fresh
cd backend
rm -rf data/database.sqlite
npm test

# Frontend tests - clear cache
cd frontend
rm -rf node_modules/.vite
npm test

# E2E tests - ensure servers are running
# In one terminal: npm run dev
# In another: npx playwright test
```

### Port conflicts
If ports 3000 or 3001 are in use:

**Backend:**
```bash
cd backend
PORT=3002 npm run dev  # Change to any available port
```

**Frontend:**
Update `frontend/vite.config.ts`:
```typescript
server: {
  port: 3003,  // Change from 3000
  // ...
}
```

And update `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:3002/api'  // Match backend port
```

## 🔍 Verify Everything Works

1. **Backend Health Check:**
   ```bash
   curl http://localhost:3001/health
   # Should return: {"status":"ok"}
   ```

2. **Frontend Loads:**
   - Open `http://localhost:3000`
   - Should see login page

3. **API Works:**
   - Sign up creates user
   - Login returns JWT token
   - Generate creates generation record

4. **Tests Pass:**
   ```bash
   npm test
   # All tests should pass ✅
   ```

## 📊 Check Test Coverage

```bash
# Backend coverage
cd backend
npm run test:coverage
# Open: backend/coverage/lcov-report/index.html

# Frontend coverage
cd frontend
npm run test:coverage
# Open: frontend/coverage/index.html
```

## 🐳 Using Docker (Alternative)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run in background
docker-compose up -d

# Stop containers
docker-compose down
```

## ✅ Ready for Submission Checklist

Before submitting, verify:
- [ ] Application runs without errors
- [ ] All tests pass: `npm test`
- [ ] E2E tests pass: `npx playwright test`
- [ ] No console errors in browser
- [ ] Authentication works
- [ ] Image generation works
- [ ] History works
- [ ] Error handling works (try multiple generations to trigger 20% error)

---

**Happy Testing! 🎉**

