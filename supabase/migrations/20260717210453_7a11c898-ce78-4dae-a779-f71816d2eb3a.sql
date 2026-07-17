
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- ============ TABLES ============
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT,
  lga TEXT,
  business_district TEXT,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_companies_state ON public.companies(state);
CREATE INDEX idx_companies_city ON public.companies(city);

CREATE TABLE public.company_departments (
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, department_id)
);
CREATE INDEX idx_cd_department ON public.company_departments(department_id);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE public.placement_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  amount_naira INTEGER NOT NULL,
  paystack_reference TEXT NOT NULL UNIQUE,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, state, city)
);
CREATE INDEX idx_pa_user ON public.placement_access(user_id);

-- ============ GRANTS ============
GRANT SELECT ON public.departments TO anon, authenticated;
GRANT ALL ON public.departments TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_departments TO authenticated;
GRANT ALL ON public.company_departments TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT ON public.placement_access TO authenticated;
GRANT ALL ON public.placement_access TO service_role;

-- ============ RLS ============
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_access ENABLE ROW LEVEL SECURITY;

-- has_role security definer (no recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Departments: anyone can read active
CREATE POLICY "departments_read_all" ON public.departments FOR SELECT USING (true);
CREATE POLICY "departments_admin_write" ON public.departments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Companies: only admins directly. Students go through RPCs (SECURITY DEFINER).
CREATE POLICY "companies_admin_all" ON public.companies FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "company_departments_admin_all" ON public.company_departments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Profiles: users manage own; admins read all
CREATE POLICY "profiles_own_select" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_own_insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- User roles: user reads own, admins manage all
CREATE POLICY "user_roles_own_select" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Placement access: user reads own
CREATE POLICY "placement_access_own_select" ON public.placement_access FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- ============ RPCs (security definer, respect caller's department) ============
CREATE OR REPLACE FUNCTION public.get_available_states()
RETURNS TABLE(state TEXT, placement_count BIGINT)
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT c.state, COUNT(*)::BIGINT
  FROM public.companies c
  JOIN public.company_departments cd ON cd.company_id = c.id
  JOIN public.profiles p ON p.id = auth.uid()
  WHERE c.is_active = true
    AND cd.department_id = p.department_id
  GROUP BY c.state
  ORDER BY c.state;
$$;

CREATE OR REPLACE FUNCTION public.get_available_cities(_state TEXT)
RETURNS TABLE(city TEXT, placement_count BIGINT)
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE(c.city, 'Other')::TEXT AS city, COUNT(*)::BIGINT
  FROM public.companies c
  JOIN public.company_departments cd ON cd.company_id = c.id
  JOIN public.profiles p ON p.id = auth.uid()
  WHERE c.is_active = true
    AND c.state = _state
    AND cd.department_id = p.department_id
  GROUP BY COALESCE(c.city, 'Other')
  ORDER BY 1;
$$;

CREATE OR REPLACE FUNCTION public.get_location_count(_state TEXT, _city TEXT)
RETURNS BIGINT
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT COUNT(*)::BIGINT
  FROM public.companies c
  JOIN public.company_departments cd ON cd.company_id = c.id
  JOIN public.profiles p ON p.id = auth.uid()
  WHERE c.is_active = true
    AND c.state = _state
    AND COALESCE(c.city, 'Other') = _city
    AND cd.department_id = p.department_id;
$$;

CREATE OR REPLACE FUNCTION public.has_paid_for(_state TEXT, _city TEXT)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.placement_access
    WHERE user_id = auth.uid() AND state = _state AND city = _city
  );
$$;

CREATE OR REPLACE FUNCTION public.get_unlocked_companies(_state TEXT, _city TEXT)
RETURNS TABLE(
  id UUID, name TEXT, address TEXT, state TEXT, city TEXT,
  lga TEXT, business_district TEXT, description TEXT,
  contact_email TEXT, contact_phone TEXT, logo_url TEXT
)
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT c.id, c.name, c.address, c.state, c.city, c.lga, c.business_district,
         c.description, c.contact_email, c.contact_phone, c.logo_url
  FROM public.companies c
  JOIN public.company_departments cd ON cd.company_id = c.id
  JOIN public.profiles p ON p.id = auth.uid()
  WHERE c.is_active = true
    AND c.state = _state
    AND COALESCE(c.city, 'Other') = _city
    AND cd.department_id = p.department_id
    AND public.has_paid_for(_state, _city);
$$;

CREATE OR REPLACE FUNCTION public.get_my_unlocked_locations()
RETURNS TABLE(state TEXT, city TEXT, paid_at TIMESTAMPTZ, company_count BIGINT)
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT pa.state, pa.city, pa.paid_at,
    (SELECT COUNT(*) FROM public.companies c
     JOIN public.company_departments cd ON cd.company_id = c.id
     JOIN public.profiles p ON p.id = auth.uid()
     WHERE c.state = pa.state AND COALESCE(c.city,'Other') = pa.city
       AND cd.department_id = p.department_id AND c.is_active = true)::BIGINT
  FROM public.placement_access pa
  WHERE pa.user_id = auth.uid()
  ORDER BY pa.paid_at DESC;
$$;

-- ============ Signup trigger ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _dept_id UUID;
  _admin_exists BOOLEAN;
BEGIN
  _dept_id := NULLIF(NEW.raw_user_meta_data->>'department_id','')::UUID;

  INSERT INTO public.profiles (id, full_name, department_id)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', _dept_id);

  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role='admin') INTO _admin_exists;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN _admin_exists THEN 'student'::app_role ELSE 'admin'::app_role END);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER trg_companies_updated BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ Seed departments ============
INSERT INTO public.departments (name, slug) VALUES
  ('Computer Science','computer-science'),
  ('Cyber Security','cyber-security')
ON CONFLICT DO NOTHING;
