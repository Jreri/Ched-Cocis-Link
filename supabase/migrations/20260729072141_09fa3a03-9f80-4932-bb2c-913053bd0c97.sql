ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS internship_type text;

-- Wipe user-linked data (cascades from auth.users too, but we clear our tables explicitly to be safe)
DELETE FROM public.applications;
DELETE FROM public.placement_access;
DELETE FROM public.user_roles;
DELETE FROM public.profiles;
DELETE FROM auth.users;