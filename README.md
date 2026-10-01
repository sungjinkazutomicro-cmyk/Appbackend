# PayCST backend

Node + Express + MySQL. Start with `npm install` then `npm start`.

## Set up a new copy
1. Create an empty MySQL database (Railway: **+ New > Database > MySQL**).
2. Set `AUTO_SETUP_DB=true` on the service for the first deploy: the server then creates all tables itself from `schema.sql`. (Or run `npm run setup-db`.)
3. Copy `env.example` to `.env` (local) or add the same names as variables on your host:
   `DB_HOST DB_PORT DB_USER DB_PASSWORD DB_NAME JWT_SECRET FACEPP_API_KEY FACEPP_API_SECRET`
   - `JWT_SECRET` must be 32+ random characters and kept private:
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Optional: `CORS_ORIGIN`, `DB_SSL=true` (if the DB is on another network), `KEEP_ID_PHOTOS=true`.
4. Create the first admin: `node create-admin.js <username> <password> <4-digit-pin>`
5. Point the Flutter app's `apiBase` (and the admin panel) at `https://<your-domain>/api`.

Never commit `.env`.
