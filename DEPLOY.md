# Deploy to Cloudflare Pages with D1

## Prerequisites
- Cloudflare Account
- Node.js / NPM installed
- Wrangler CLI installed (`npm install -g wrangler`)

## 1. Setup D1 Database

Run the following commands in your terminal to create the database locally and remotely:

```bash
# Login to Cloudflare
npx wrangler login

# Create D1 Database
npx wrangler d1 create signatures-db
```

Copy the output `database_id` and update your `wrangler.toml` (create it if it doesn't exist in root):

```toml
name = "mr-engagement-room"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "signatures-db"
database_id = "PASTE_YOUR_ID_HERE"
```

## 2. Initialize Schema

Apply the schema to your D1 database:

```bash
# Local (for testing with `wrangler pages dev`)
npx wrangler d1 execute signatures-db --file=./schema.sql --local

# Remote (Production)
npx wrangler d1 execute signatures-db --file=./schema.sql --remote
```

## 3. Deploy

Deploy your `static` folder (frontend) and `functions` (backend):

```bash
npx wrangler pages deploy . --project-name=mr-engagement-room
```

(Note: You might need to adjust the build output directory if you are using a bundler. If deploying the raw static files + functions, point it to the root or a dist folder containing both).

Since this project has a mix of `static` files and source code, for a pure production build you usually build your assets to `dist/` and copy `functions/` into it, or configure Pages to point to root if using pure static HTML.

**Recommended for this specific setup:**
Ensure `static/` contains your `index.html`, `saliste.html`, etc.
Cloudflare Pages functions live in `/functions`.

If you just want to deploy the static folder + functions:
1. Ensure `functions` folder is at root.
2. Run `npx wrangler pages deploy .` and set the build output directory to `static` (but this might miss the functions if they aren't in the output path or if wrangler doesn't detect them from root. Cloudflare Pages usually looks for `/functions` at the root of the repo).

**Better approach for mixed content:**
Keep `/functions` at root.
Configure Build Output directory to `static`.

## 4. Environment Variables
If you implemented the Export Token logic, set it in the Cloudflare Dashboard > Pages > Settings > Environment Variables.
`ENV_EXPORT_TOKEN = "your-secret-token"`
