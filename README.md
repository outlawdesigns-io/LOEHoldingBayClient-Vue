# LOEHoldingBayClient-Vue

A Vue 3 + Vite web application for LOE intake, containerized with Docker for runtime configuration injection.

---

## 🚀 Features

- Vue 3 + Vite + Vuex/Router
- Production build served via Docker
- Docker-ready runtime environment injection (`window.ENV`)
- Simple Express static file server (`server.js`)
- Hot-reload for local development (`npm run dev`)

---

## 🧩 Project Structure

```
.
├── src/                 # Vue source files
├── public/              # Public assets
├── dist/                # Build output (auto-generated)
├── server.js            # Express static file server
├── entrypoint.sh        # Injects runtime env vars into env.js
├── Dockerfile           # Multi-stage build
├── docker-compose.yml   # Container config
└── README.md
```

---

## 🧠 Environment Configuration

### Local Development

Vite exposes variables prefixed with `VITE_` from `.env` files.

Example `.env.development`:

```
VITE_API_URL=http://localhost:8080/api
VITE_AUTH_CLIENT_ID=cronsuite-local
```

Reference them in code using:

```js
const apiUrl = import.meta.env.VITE_API_URL;
```

Run locally with:

```bash
npm install
npm run dev
```

---

### Docker / Production Runtime Environment

When deployed via Docker, environment variables are injected dynamically by `entrypoint.sh` at container startup.  
This means you can change configuration values **without rebuilding** the image.

Example `docker-compose.yml`:

```yaml
services:
  frontend:
    image: cronclient-vuejs
    build:
      context: ./
      dockerfile: ./Dockerfile
    environment:
      ENV: 'production',
      TZ: 'America/Chicago',
      API_URL: 'https://loe-service.outlawdesigns.io',
      AUTH_DISCOVERY_URI: 'https://auth.outlawdesigns.io/.well-known/openid-configuration',
      AUTH_CLIENT_ID: 'loesuite-holdingbay-vuepwa',
      AUTH_REDIRECT_URL: 'https://loe-holdingbay-app.outlawdesigns.io/token/',
      AUTH_LOGOUT_URL: 'https://loe-holdingbay-app.outlawdesigns.io/logout/',
      AUTH_SCOPE: 'offline_access offline openid',
      AUTH_DISABLED: false,
      LOE_BASE_URL: 'https://loe.outlawdesigns.io/'
    ports:
      - '3000:8080'
```

The `entrypoint.sh` script generates a `dist/env.js` file:

```js
window.ENV = {
  ENV: "production",
  TZ: "America/Chicago",
  AUTH_CLIENT_ID: "loesuite-holdingbay-vuepwa"
};
```

Access these values anywhere in your app from the `runtime-config`:

```js
import { getConfig } from './runtime-config';
console.log(getConfig().AUTH_DISCOVERY_URI);
```

---

## 🧱 Build and Run with Docker

```bash
docker compose up --build
```

Then visit [http://localhost:8080](http://localhost:3000)

---

## 🧰 Useful Commands

| Command | Description |
|----------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `docker compose up --build` | Build and run containerized app |

---

## 🧪 Testing (Optional)

Add your testing setup here if applicable:

```bash
npm run test
```

---

## 🧩 Deployment Notes

- The built image is portable and can be deployed on any container host.  
- Modify environment variables to change runtime config without rebuilding.  
- Promote the same Docker image between environments (dev → staging → prod).

---

## 🧾 License

MIT © 2025 Outlaw Designs inc.

---

## 💡 Tips for Developers

- Keep `entrypoint.sh` minimal — it only needs to write `env.js`.
- Do **not** commit the generated `dist/env.js` file.
- When adding new env vars:
  - Add them to `entrypoint.sh`
  - Reference them as `window.ENV.<key>` in your Vue app
- Use `import.meta.env` only for compile-time config (local dev).
