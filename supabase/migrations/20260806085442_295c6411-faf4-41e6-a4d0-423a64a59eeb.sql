-- 1. Strict department matching
CREATE OR REPLACE FUNCTION public.company_visible(_company_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_departments cd
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE cd.company_id = _company_id
      AND p.department_id IS NOT NULL
      AND cd.department_id = p.department_id
  );
$$;

CREATE OR REPLACE FUNCTION public.browse_companies()
RETURNS TABLE(id uuid, name text, state text, city text, business_district text, description text, internship_position text, applications_enabled boolean, is_unlocked boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT DISTINCT c.id, c.name, c.state, COALESCE(c.city,'Other')::text, c.business_district,
         c.description, c.internship_position, c.applications_enabled,
         public.has_paid_for(c.state, COALESCE(c.city,'Other')) AS is_unlocked
  FROM public.companies c
  WHERE c.is_active = true AND public.company_visible(c.id)
  ORDER BY c.name;
$$;

-- 2. One-time profile edit lock
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS profile_locked boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.enforce_profile_lock()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  IF OLD.profile_locked THEN
    IF NEW.full_name IS DISTINCT FROM OLD.full_name
       OR NEW.phone IS DISTINCT FROM OLD.phone
       OR NEW.date_of_birth IS DISTINCT FROM OLD.date_of_birth
       OR NEW.address IS DISTINCT FROM OLD.address
       OR NEW.university IS DISTINCT FROM OLD.university
       OR NEW.institution IS DISTINCT FROM OLD.institution
       OR NEW.department_id IS DISTINCT FROM OLD.department_id
       OR NEW.level IS DISTINCT FROM OLD.level
       OR NEW.matric_number IS DISTINCT FROM OLD.matric_number THEN
      RAISE EXCEPTION 'Your personal and academic details are locked. Contact an administrator to make changes.';
    END IF;
    NEW.profile_locked := true;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_lock ON public.profiles;
CREATE TRIGGER trg_profiles_lock BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.enforce_profile_lock();

-- 3. Admins can manage student profiles
DROP POLICY IF EXISTS profiles_admin_update ON public.profiles;
CREATE POLICY profiles_admin_update ON public.profiles
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));