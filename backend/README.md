# Chefly Sync Worker

Minimal engagement vault (following + saved posts) for multi-device sync.

## Setup

```bash
cd backend
npm install
npx wrangler kv namespace create chefly-vault
# put the id into wrangler.toml under [[kv_namespaces]].id
npx wrangler deploy
```

Then set in the app:

```bash
EXPO_PUBLIC_API_URL=https://chefly-sync.<your-subdomain>.workers.dev
```

Without this URL the app uses a local AsyncStorage vault (same API surface).
