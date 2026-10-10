# Supabase migration

The UI reads through `lib/data.ts` and currently uses JSON. Replace `repository` with a Supabase implementation after reviewing `supabase/schema.sql`. Keep `imageUrl` as the single image path boundary. TODO: add RLS policies, admin auth, and Storage rules.
