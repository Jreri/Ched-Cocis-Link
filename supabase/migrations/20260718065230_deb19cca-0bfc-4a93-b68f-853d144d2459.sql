
-- 1. Add profile fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS level TEXT,
  ADD COLUMN IF NOT EXISTS institution TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Update handle_new_user to also read level/institution from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _dept_id UUID;
  _admin_exists BOOLEAN;
BEGIN
  _dept_id := NULLIF(NEW.raw_user_meta_data->>'department_id','')::UUID;

  INSERT INTO public.profiles (id, full_name, department_id, level, institution)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    _dept_id,
    NEW.raw_user_meta_data->>'level',
    NEW.raw_user_meta_data->>'institution'
  )
  ON CONFLICT (id) DO NOTHING;

  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role='admin') INTO _admin_exists;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN _admin_exists THEN 'student'::app_role ELSE 'admin'::app_role END)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

-- 3. Attach trigger to auth.users (this was missing — profiles never got created)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Backfill profiles + user_roles for any existing users
INSERT INTO public.profiles (id, full_name, department_id, level, institution)
SELECT
  u.id,
  u.raw_user_meta_data->>'full_name',
  NULLIF(u.raw_user_meta_data->>'department_id','')::UUID,
  u.raw_user_meta_data->>'level',
  u.raw_user_meta_data->>'institution'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id,
  CASE WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE role='admin') THEN 'student'::app_role ELSE 'admin'::app_role END
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE r.user_id IS NULL;
