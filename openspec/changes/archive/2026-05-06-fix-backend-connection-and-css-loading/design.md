## Context

The project uses a Docker-compose environment for the backend and database. The `docker-compose.yml` maps the backend port 3005 to 3006 on the host. However, the frontend (running on the host) is hardcoded to connect to port 3005.

Additionally, the `index.html` file includes a `<link>` to `index.css`, which is missing from the file system.

## Goals / Non-Goals

**Goals:**
- Restore connectivity between the frontend and backend.
- Eliminate unnecessary browser console errors.
- Maintain the current development workflow (`npm start`).

**Non-Goals:**
- Refactoring the entire API configuration system.
- Adding a production-ready CSS build process (staying with Tailwind CDN for now as it's the current setup).

## Decisions

1. **Port Update**: Change `main/frontend/config.ts` to use port 3006 instead of 3005 for the API URL in development mode.
2. **API Prefixing**: Add `/api` to the fetch calls in `Login.tsx` and `Register.tsx` to match the backend routing.
3. **CSS Link Removal**: Remove the `<link rel="stylesheet" href="/index.css">` from `main/frontend/index.html`.

## Risks / Trade-offs

- **Risk**: If the user changes the port mapping in `docker-compose.yml`, the frontend will break again.
- **Trade-off**: Using a hardcoded port in `config.ts` is simple for development but less flexible than environment variables. However, the current project structure already uses a `config.ts` helper, so we'll stick to that pattern.
