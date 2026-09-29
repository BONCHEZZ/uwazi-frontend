# UWAZI Frontend API Integration

The frontend now uses the live UWAZI backend contract instead of `src/data/mockData.ts` for runtime project/authentication data.

## Backend

```text
https://uwazi-backend-eight.vercel.app/api/v1
```

The URL can be overridden with:

```text
VITE_API_BASE_URL
```

See `.env.example`.

## Main adapter

`src/services/api.ts` is the compatibility adapter. It keeps the existing UI methods (`getProjects`, `getProject`, `getDashboardStats`, etc.) while translating them to the documented canonical API.

### Implemented backend integrations

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `GET/POST/DELETE /bookmarks*`
- `GET/POST /search`
- `GET /entities/{entityType}/{entityId}/timeline`
- `GET /entities/{entityType}/{entityId}/relationships`
- `GET/POST /evidence*` and evidence links
- `POST /observations`
- `GET /intelligence/signals`
- `POST /query/answer`
- `GET /public/sources/{sourceId}/records` for county budget implementation records

## Important backend-contract limitation

The OpenAPI document does not expose a public `/register` endpoint. The registration form therefore no longer pretends to create an account; it tells the user that an account must be provisioned by the platform administrator.

The API also does not document dedicated endpoints for every legacy mock-dashboard dataset (for example inspection schedules and generated reports). Those adapter methods return empty typed collections until the backend exposes a matching resource.

## Production setup

For Vercel, add:

```text
VITE_API_BASE_URL=https://uwazi-backend-eight.vercel.app/api/v1
```

Then build with:

```bash
npm install
npm run build
```

The browser must also be allowed by the backend CORS configuration.
