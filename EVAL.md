# Evaluation Checklist

| Feature/Test | Implemented | File/Path |
|--------------|-------------|-----------|
| JWT Auth (signup/login) | ✅ | /backend/src/routes/auth.routes.ts |
| Image upload preview | ✅ | /frontend/src/components/ImageUpload.tsx |
| Abort in-flight request | ✅ | /frontend/src/hooks/useGenerate.ts |
| Exponential retry logic | ✅ | /frontend/src/hooks/useGenerate.ts |
| 20% simulated overload | ✅ | /backend/src/services/generation.service.ts |
| GET last 5 generations | ✅ | /backend/src/controllers/generation.controller.ts |
| Unit tests backend | ✅ | /backend/tests/auth.test.ts, /backend/tests/generations.test.ts |
| Unit tests frontend | ✅ | /frontend/src/components/__tests__/ImageUpload.test.tsx, /frontend/src/hooks/__tests__/useGenerate.test.ts |
| E2E flow | ✅ | /tests/e2e.spec.ts |
| ESLint + Prettier configured | ✅ | .eslintrc.js, .prettierrc (backend and frontend) |
| CI + Coverage report | ✅ | .github/workflows/ci.yml |

## Additional Features

- TypeScript strict mode enabled
- Input validation with Zod
- Responsive design
- Accessibility features (keyboard navigation, ARIA)
- Error handling with user-friendly messages
- Clean folder structure
- OpenAPI specification

