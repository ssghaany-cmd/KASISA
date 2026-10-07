
# KASISA app (web + Android + iOS, one codebase)

1. Run the SQL in `../supabase` (see its README).
2. `cp .env.example .env` and fill in your Supabase URL and anon key.
3. `npm install` then `npm run dev` for the web app.
4. Phones: `npx cap add android` / `npx cap add ios`, then `npm run cap:sync` and `npx cap open android|ios`.
   (iOS builds need a Mac with Xcode, or a cloud build service.)

Done: login, role routing, assignments, 20-question inspection with live grade, 4+ GPS-stamped photos,
offline queue with auto-sync, install button, LGA scorecard.
Next: QR scan, map, alerts, certificates, citizen report form, Hausa, 2FA, native SQLite storage for large photo batches.
