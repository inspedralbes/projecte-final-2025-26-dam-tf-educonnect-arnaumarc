## Why

The frontend is currently unable to communicate with the backend because it attempts to connect to port 3005, while the backend is exposed on port 3006 in the Docker environment. Additionally, a missing `index.css` file is causing MIME type errors in the browser, cluttering the console and potentially causing confusion.

## What Changes

- Update the API base URL in the frontend configuration to use the correct external port (3006).
- Add the missing `/api` prefix to login and register requests in the frontend.
- Remove the reference to the non-existent `index.css` file in `index.html`.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- None (This is an implementation fix, not a change in system requirements).

## Impact

- **Frontend**: `main/frontend/config.ts` will be modified to use port 3006.
- **Frontend**: `main/frontend/index.html` will be modified to remove the `index.css` link.
- **User Experience**: Login and other API-dependent features will become functional. Console errors will be reduced.
