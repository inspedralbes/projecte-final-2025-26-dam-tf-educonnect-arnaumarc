## 1. Fix Backend Connection

- [x] 1.1 Update `main/frontend/config.ts` to use port 3006 instead of 3005 for the API URL in development mode.
- [x] 1.2 Add `/api` prefix to the login fetch call in `main/frontend/components/Login.tsx`.
- [x] 1.3 Add `/api` prefix to the register fetch call in `main/frontend/components/Register.tsx`.

## 2. Fix CSS Loading Errors

- [x] 2.1 Remove the `<link rel="stylesheet" href="/index.css">` line from `main/frontend/index.html`.

## 3. Verification

- [x] 3.1 Verify that the frontend can now log in using the provided credentials.
- [x] 3.2 Verify that the browser console no longer shows the MIME type error for `index.css`.
