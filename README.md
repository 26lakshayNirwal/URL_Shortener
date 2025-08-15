# URL Shortener (React + Vite + Supabase)

A modern URL shortener with custom aliases, QR code generation, and click analytics (device and geolocation). Built with React, Vite, Tailwind CSS, Radix UI, and Supabase.

## Features

- **Authentication**: Email/password via Supabase Auth
- **Create short links**: Generate random short IDs or set a custom alias
- **QR code**: Auto-generate and store a QR for each link
- **Redirects**: Visit `/:id` to resolve and redirect to the long URL
- **Analytics**: Track clicks with device type and geo (city, country)
- **Dashboard**: View and manage your links, stats, and details

## Tech Stack

- **Frontend**: React 19, Vite 7, React Router, Tailwind CSS v4
- **Data/Backend**: Supabase (Auth, Postgres, Storage)
- **Charts/UX**: Recharts, react-spinners, lucide-react
- **Utilities**: react-qrcode-logo, ua-parser-js, yup, clsx, tailwind-merge

## Project Structure

```
client/
  ├─ src/
  │  ├─ components/
  │  │  ├─ CreateLink.jsx            # Modal to create a short link + QR
  │  │  ├─ LinkCard.jsx              # Link item display
  │  │  ├─ DeviceStats.jsx           # Device-based stats
  │  │  ├─ LocationStats.jsx         # Geo-based stats
  │  │  ├─ require-auth.jsx          # Route guard
  │  │  └─ ui/*                      # Radix/shadcn-style UI primitives
  │  ├─ pages/
  │  │  ├─ Landing.jsx               # Landing page
  │  │  ├─ Auth.jsx                  # Login/Signup
  │  │  ├─ Dashboard.jsx             # Overview + list of links
  │  │  ├─ Link.jsx                  # Single link details & stats
  │  │  └─ Redirect-link.jsx         # Handles `/:id` redirects + click logging
  │  ├─ db/
  │  │  ├─ supabase.js               # Supabase client (reads env)
  │  │  ├─ apiAuth.js                # Auth APIs (login/signup/logout)
  │  │  ├─ apiUrls.js                # CRUD for URLs + QR storage
  │  │  └─ apiClicks.js              # Click logging & queries
  │  ├─ hooks/UseFetch.js            # Generic async/data hook
  │  ├─ Context.jsx                  # App context (user/auth state)
  │  ├─ App.jsx                      # Router + providers
  │  └─ main.jsx                     # App bootstrap
  ├─ index.html
  ├─ package.json
  └─ vite.config.js
```

## Environment Variables

Create `client/.env` with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

- Keep keys safe. Do not commit secrets in production.

## Supabase Setup

1. **Create a Supabase project** and get the project URL and anon key.
2. **Storage buckets** (public):
   - `qrs` for generated QR image files
   - `profile_pic` for user avatars
3. **Tables** (example fields used by the app):
   - `urls`
     - id (uuid, pk, default uuid_generate_v4)
     - user_id (uuid, references auth.users.id)
     - title (text)
     - original_url (text)
     - short_url (text, unique)
     - custom_url (text, unique, nullable)
     - qr (text) — public URL to QR in the `qrs` bucket
     - created_at (timestamp, default now())
   - `clicks`
     - id (uuid, pk, default uuid_generate_v4)
     - url_id (uuid, references urls.id)
     - city (text)
     - country (text)
     - device (text) — e.g., Desktop/Mobile/Tablet
     - created_at (timestamp, default now())
4. **RLS policies** (suggested):
   - `urls`: users can `select/insert/delete` their own rows (match `user_id` to auth.uid()).
   - `clicks`: allow `insert` for all (or authenticated) to record redirects; allow `select` where `url_id` belongs to the requesting user’s URLs.
   - Storage: public read for `qrs` and `profile_pic`; authenticated users can upload to their respective folders.

## Routing

- `/` — Landing
- `/auth` — Login/Signup
- `/dashboard` — Auth-required dashboard
- `/link/:id` — Auth-required single link details
- `/:id` — Public redirect route (records click + redirects)

## Development

1. Install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Configure env in `client/.env` (see above).
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Preview production build:
   ```bash
   npm run preview
   ```

## How It Works (High-level)

- **Create link**: User submits title + long URL (+ optional custom alias). App generates a `short_url` and uploads a QR image to the `qrs` bucket, then stores row in `urls`.
- **Redirect**: Visiting `/:id` resolves by matching `short_url` or `custom_url`. A click record is inserted into `clicks` (device via `ua-parser-js`; city/country via `ipapi.co`), then the user is redirected.
- **Dashboard**: Fetches user’s URLs and related click stats to render charts/tables.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview build locally
- `npm run lint` — lint with ESLint

## Notes

- The example domain label in UI (`trimrr.in`) is a placeholder; configure your own domain as needed.
- If deploying behind a custom domain, ensure the redirect route `/:id` is not shadowed by other routes/server rules.
- External service used for geo lookup: `https://ipapi.co/json`. Replace with your preferred service if needed.

## License

Add your preferred license (e.g., MIT) here.
