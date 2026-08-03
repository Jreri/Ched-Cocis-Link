CREATE TABLE public.requirement_library (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  field_key text not null unique,
  kind field_kind not null default 'document',
  created_at timestamptz not null default now()
);
CREATE UNIQUE INDEX requirement_library_name_idx ON public.requirement_library (lower(btrim(name)));
GRANT SELECT ON public.requirement_library TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.requirement_library TO authenticated;
GRANT ALL ON public.requirement_library TO service_role;
ALTER TABLE public.requirement_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY reqlib_read_authed ON public.requirement_library FOR SELECT TO authenticated USING (true);
CREATE POLICY reqlib_admin_write ON public.requirement_library FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.requirement_library (name, field_key, kind) VALUES
  ('Passport Photograph','doc_passport','document'),
  ('Government-issued ID','doc_gov_id','document'),
  ('SIWES / Industrial Training Introduction Letter','doc_siwes_letter','document'),
  ('Student ID Card','doc_student_id','document'),
  ('WAEC Result','doc_waec','document'),
  ('Birth Certificate','doc_birth_cert','document'),
  ('Curriculum Vitae (CV)','doc_cv','document')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.browse_companies()
RETURNS TABLE(id uuid, name text, state text, city text, business_district text, description text, internship_position text, applications_enabled boolean, is_unlocked boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT DISTINCT c.id, c.name, c.state, COALESCE(c.city,'Other')::text, c.business_district,
         c.description, c.internship_position, c.applications_enabled,
         public.has_paid_for(c.state, COALESCE(c.city,'Other')) AS is_unlocked
  FROM public.companies c
  WHERE c.is_active = true
    AND (
      NOT EXISTS (SELECT 1 FROM public.company_departments cd WHERE cd.company_id = c.id)
      OR EXISTS (
        SELECT 1 FROM public.company_departments cd
        JOIN public.profiles p ON p.id = auth.uid()
        WHERE cd.company_id = c.id AND (p.department_id IS NULL OR cd.department_id = p.department_id)
      )
    )
  ORDER BY c.name;
$$;

CREATE OR REPLACE FUNCTION public.company_visible(_company_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.company_departments cd WHERE cd.company_id = _company_id)
      OR EXISTS (
        SELECT 1 FROM public.company_departments cd
        JOIN public.profiles p ON p.id = auth.uid()
        WHERE cd.company_id = _company_id AND (p.department_id IS NULL OR cd.department_id = p.department_id)
      );
$$;

CREATE OR REPLACE FUNCTION public.get_available_states()
RETURNS TABLE(state text, placement_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT c.state, COUNT(*)::BIGINT FROM public.companies c
  WHERE c.is_active = true AND public.company_visible(c.id)
  GROUP BY c.state ORDER BY c.state;
$$;

CREATE OR REPLACE FUNCTION public.get_available_cities(_state text)
RETURNS TABLE(city text, placement_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT COALESCE(c.city,'Other')::TEXT, COUNT(*)::BIGINT FROM public.companies c
  WHERE c.is_active = true AND c.state = _state AND public.company_visible(c.id)
  GROUP BY COALESCE(c.city,'Other') ORDER BY 1;
$$;

CREATE OR REPLACE FUNCTION public.get_location_count(_state text, _city text)
RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT COUNT(*)::BIGINT FROM public.companies c
  WHERE c.is_active = true AND c.state = _state AND COALESCE(c.city,'Other') = _city
    AND public.company_visible(c.id);
$$;

CREATE OR REPLACE FUNCTION public.get_unlocked_companies(_state text, _city text)
RETURNS TABLE(id uuid, name text, address text, state text, city text, lga text, business_district text, description text, contact_email text, contact_phone text, logo_url text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT c.id, c.name, c.address, c.state, c.city, c.lga, c.business_district,
         c.description, c.contact_email, c.contact_phone, c.logo_url
  FROM public.companies c
  WHERE c.is_active = true AND c.state = _state AND COALESCE(c.city,'Other') = _city
    AND public.company_visible(c.id) AND public.has_paid_for(_state, _city);
$$;

CREATE OR REPLACE FUNCTION public.get_unlocked_company(_company_id uuid)
RETURNS TABLE(id uuid, name text, address text, state text, city text, lga text, business_district text, description text, contact_email text, contact_phone text, logo_url text, internship_email text, internship_position text, instructions text, applications_enabled boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT c.id, c.name, c.address, c.state, c.city, c.lga, c.business_district,
         c.description, c.contact_email, c.contact_phone, c.logo_url,
         c.internship_email, c.internship_position, c.instructions, c.applications_enabled
  FROM public.companies c
  WHERE c.id = _company_id AND c.is_active = true
    AND public.company_visible(c.id)
    AND public.has_paid_for(c.state, COALESCE(c.city,'Other'));
$$;

CREATE OR REPLACE FUNCTION public.get_my_unlocked_locations()
RETURNS TABLE(state text, city text, paid_at timestamptz, company_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT pa.state, pa.city, pa.paid_at,
    (SELECT COUNT(*) FROM public.companies c
      WHERE c.state = pa.state AND COALESCE(c.city,'Other') = pa.city
        AND c.is_active = true AND public.company_visible(c.id))::BIGINT
  FROM public.placement_access pa
  WHERE pa.user_id = auth.uid()
  ORDER BY pa.paid_at DESC;
$$;