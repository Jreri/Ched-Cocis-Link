-- Extend companies with application settings
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS internship_email text,
  ADD COLUMN IF NOT EXISTS internship_position text,
  ADD COLUMN IF NOT EXISTS instructions text,
  ADD COLUMN IF NOT EXISTS slots integer,
  ADD COLUMN IF NOT EXISTS applications_enabled boolean NOT NULL DEFAULT true;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS matric_number text,
  ADD COLUMN IF NOT EXISTS university text,
  ADD COLUMN IF NOT EXISTS internship_duration text,
  ADD COLUMN IF NOT EXISTS preferred_start_date date,
  ADD COLUMN IF NOT EXISTS expected_end_date date,
  ADD COLUMN IF NOT EXISTS documents jsonb NOT NULL DEFAULT '{}'::jsonb;

GRANT SELECT ON public.companies TO authenticated;
GRANT SELECT ON public.company_departments TO authenticated;

DO $$ BEGIN CREATE TYPE public.field_requirement AS ENUM ('required','optional','hidden'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.field_kind AS ENUM ('document','info','custom'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.company_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  field_key text NOT NULL,
  kind public.field_kind NOT NULL,
  label text NOT NULL,
  requirement public.field_requirement NOT NULL DEFAULT 'optional',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, field_key)
);
GRANT SELECT ON public.company_requirements TO authenticated;
GRANT ALL ON public.company_requirements TO service_role;
ALTER TABLE public.company_requirements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS req_read_authed ON public.company_requirements;
CREATE POLICY req_read_authed ON public.company_requirements FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS req_admin_all ON public.company_requirements;
CREATE POLICY req_admin_all ON public.company_requirements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  snapshot jsonb NOT NULL,
  documents jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'sent',
  sent_to_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS app_own_select ON public.applications;
CREATE POLICY app_own_select ON public.applications FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS app_own_insert ON public.applications;
CREATE POLICY app_own_insert ON public.applications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Storage RLS
DROP POLICY IF EXISTS "docs_own_read" ON storage.objects;
CREATE POLICY "docs_own_read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'applicant-documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(),'admin')));
DROP POLICY IF EXISTS "docs_own_insert" ON storage.objects;
CREATE POLICY "docs_own_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'applicant-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "docs_own_update" ON storage.objects;
CREATE POLICY "docs_own_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'applicant-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
DROP POLICY IF EXISTS "docs_own_delete" ON storage.objects;
CREATE POLICY "docs_own_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'applicant-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE OR REPLACE FUNCTION public.get_company_requirements(_company_id uuid)
RETURNS TABLE (field_key text, kind public.field_kind, label text, requirement public.field_requirement, sort_order integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT field_key, kind, label, requirement, sort_order
  FROM public.company_requirements
  WHERE company_id = _company_id AND requirement <> 'hidden'
  ORDER BY sort_order, label;
$$;

CREATE OR REPLACE FUNCTION public.get_unlocked_company(_company_id uuid)
RETURNS TABLE (id uuid, name text, address text, state text, city text, lga text, business_district text, description text, contact_email text, contact_phone text, logo_url text, internship_email text, internship_position text, instructions text, applications_enabled boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT c.id, c.name, c.address, c.state, c.city, c.lga, c.business_district,
         c.description, c.contact_email, c.contact_phone, c.logo_url,
         c.internship_email, c.internship_position, c.instructions, c.applications_enabled
  FROM public.companies c
  JOIN public.company_departments cd ON cd.company_id = c.id
  JOIN public.profiles p ON p.id = auth.uid()
  WHERE c.id = _company_id
    AND c.is_active = true
    AND cd.department_id = p.department_id
    AND public.has_paid_for(c.state, COALESCE(c.city,'Other'));
$$;