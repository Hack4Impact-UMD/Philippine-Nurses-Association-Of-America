# Repository Guidelines

## Project Structure & Module Organization
- `pnaa/` holds the React web app.
  - `pnaa/src/` app code: `pages/` for route-level screens, `components/` for shared UI, `auth/` for auth flows, and `backend/` for Firestore helpers.
  - `pnaa/src/assets/` and `pnaa/public/` contain images and static assets.
  - `pnaa/src/config/firebase.ts` defines the Firebase client config.
- `cloud-functions/` contains Firebase Cloud Functions.
  - `cloud-functions/functions/` is the Node.js codebase with `index.js` entrypoint and helpers.
  - `cloud-functions/firebase.json` configures Functions deployment.

## Build, Test, and Development Commands
- `cd pnaa && npm install` install frontend dependencies.
- `cd pnaa && npm start` run the React dev server.
- `cd pnaa && npm run build` create the production build in `pnaa/build`.
- `cd pnaa && npm test` run Jest in watch mode via CRA.
- `cd cloud-functions/functions && npm install` install Functions dependencies.
- `cd cloud-functions/functions && npm run serve` start Firebase emulators for Functions.
- `cd cloud-functions/functions && npm run lint` run ESLint on Functions.
- `cd cloud-functions/functions && npm run deploy` deploy Functions to Firebase.

## Coding Style & Naming Conventions
- Favor functional React components and hooks; keep component files in PascalCase (e.g., `SignOutButton.jsx`).
- Use CSS Modules (`*.module.css`) alongside the component/page they style.
- Match existing formatting: 2-space indentation, double quotes, and semicolons.
- Linting: CRA ESLint rules in `pnaa/package.json`; Google-style ESLint in `cloud-functions/functions/package.json`.

## Testing Guidelines
- Frontend testing uses Jest + React Testing Library through `react-scripts`.
- No tests are currently committed; when adding tests, use `*.test.jsx`/`*.test.tsx` near the component or in `pnaa/src/__tests__/`.
- Prioritize auth, events/fundraising CRUD, and admin-only flows.

## Commit & Pull Request Guidelines
- Commit history favors short, descriptive messages (e.g., “Use mui buttons”). Keep commits focused and readable.
- PRs should include: a concise summary, testing performed, and screenshots for UI changes; link related issues when available.

## Security & Configuration Tips
- Keep secrets out of the repo; store sensitive values in local env vars.
- Functions support `dotenv` for local runs; add a `.env` file in `cloud-functions/functions/` if needed.
