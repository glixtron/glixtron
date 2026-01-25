# Cursor Handoff: Glixtron Pilot (Jan 25)

## 1) What you’re seeing now (the `npm WARN deprecated whatwg-encoding@...` message)
- This is a **warning**, not a runtime error.
- The project already uses `@exodus/bytes` to replace `whatwg-encoding` / `encoding-sniffer`.
- Verification we ran:
  - `npm ls whatwg-encoding encoding-sniffer @exodus/bytes cheerio`
  - Result: `encoding-sniffer` is **overridden to** `npm:@exodus/bytes@1.9.0` and there is **no `whatwg-encoding` in the tree**.

### Why the warning may still appear
- Some packages print a deprecation warning during install even if the dependency is later overridden/deduped.
- It can also come from a transient dependency during resolution before `overrides` take effect.

### Recommended next checks (safe)
Run:
- `npm ls whatwg-encoding --all`
- `npm explain whatwg-encoding`

Expected outcome: Either **no dependency path**, or it points to a transitive dep that gets overridden.

### If it still appears and you want to fully eliminate it
- Ensure `package.json` keeps these overrides/resolutions (already present):
  - `"whatwg-encoding": "npm:@exodus/bytes@^1.9.0"`
  - `"encoding-sniffer": "npm:@exodus/bytes@^1.9.0"`
- Optional cleanup approach (only if you accept lockfile churn):
  - remove `package-lock.json`, then `npm install` (will re-resolve the tree)

## 2) What changes were made in this repo

### A) ESLint was broken due to ESLint v9 flat-config
- ESLint v9 requires `eslint.config.*` (flat config) and `.eslintrc.json` is not the default.
- The repo had `.eslintrc.json`, but the toolchain drifted to ESLint v9.

### B) ESLint was fixed (stable config)
Changes made:
- **Pinned ESLint to v8** in `package.json` devDependencies:
  - `eslint`: `^8.57.0`
  - `eslint-config-next`: `15.5.9` (aligned to installed Next)
- Updated `package.json` scripts to force legacy config:
  - `lint`: `eslint --config .eslintrc.json ...`
  - `lint:fix`: `eslint --config .eslintrc.json ...`
- Updated `.eslintrc.json`:
  - `ignorePatterns`: `next-env.d.ts`, `.next/**/*`
  - `overrides` to allow CommonJS `require()` in `scripts/**/*.js`

### C) Fixed actual lint errors in pages
Fixed `react/no-unescaped-entities` errors by replacing apostrophes with `&apos;`:
- `app/login/page.tsx`
- `app/page.tsx`
- `app/verify-email/page.tsx`
- `app/welcome/page.tsx`

### D) Current lint status
- `npm run lint` now returns **exit code 0**.

## 3) What is working now
- Next.js app builds successfully: `npm run build` was successful earlier.
- Lint passes: `npm run lint` passes.
- Dev server can run with `npm run dev`.

## 4) What is still pending / recommended fixes

### A) Upgrade local Node.js to v20
- Current machine is still on Node **18.20.8** (`/usr/local/opt/node@18/bin/node`).
- Supabase prints warnings because Node 18 is deprecated for future supabase-js releases.

If using Homebrew:
- `brew install node@20`
- `brew unlink node@18`
- `brew link --force --overwrite node@20`
- restart terminal, then verify: `node -v` should show `v20.x`

After upgrading:
- `npm install`
- `npm run build`

### B) Remove the accidental `eslint.config.mjs`
- There is currently an `eslint.config.mjs` in repo root.
- It is **not used anymore** because scripts force `.eslintrc.json`, but it can confuse future tooling.
- Safe cleanup:
  - delete `eslint.config.mjs`

## 5) How to validate everything quickly
Run these commands:
- `node -v`
- `npm run lint`
- `npm run build`
- `npm run dev`

## 6) Notes on “multiple URLs / no server failure”
This repo is a Next.js app (best hosted on Vercel).
- For real multi-URL failover you typically need:
  - a reverse proxy / load balancer (Cloudflare, Nginx, etc.)
  - health checks
  - multiple deployments (Vercel + backup)

There is already a `scripts/test-api.js` that tests multiple servers.
If you want true automatic failover in production, implement at the DNS/proxy layer (not inside Next.js).
