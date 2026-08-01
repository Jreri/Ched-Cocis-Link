-- 1. Remove existing duplicate companies (keep oldest per lowercased name)
WITH ranked AS (
  SELECT id, row_number() OVER (PARTITION BY lower(btrim(name)) ORDER BY created_at, id) AS rn
  FROM public.companies
), dupes AS (
  SELECT id FROM ranked WHERE rn > 1
)
DELETE FROM public.company_departments WHERE company_id IN (SELECT id FROM dupes);

WITH ranked AS (
  SELECT id, row_number() OVER (PARTITION BY lower(btrim(name)) ORDER BY created_at, id) AS rn
  FROM public.companies
), dupes AS (
  SELECT id FROM ranked WHERE rn > 1
)
DELETE FROM public.company_requirements WHERE company_id IN (SELECT id FROM dupes);

WITH ranked AS (
  SELECT id, row_number() OVER (PARTITION BY lower(btrim(name)) ORDER BY created_at, id) AS rn
  FROM public.companies
), dupes AS (
  SELECT id FROM ranked WHERE rn > 1
)
DELETE FROM public.applications WHERE company_id IN (SELECT id FROM dupes);

WITH ranked AS (
  SELECT id, row_number() OVER (PARTITION BY lower(btrim(name)) ORDER BY created_at, id) AS rn
  FROM public.companies
)
DELETE FROM public.companies WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- 2. Enforce unique company names (case/whitespace insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS companies_unique_name_idx
  ON public.companies (lower(btrim(name)));

-- 3. Public-ish browse list for signed-in students: names/locations visible, details gated
CREATE OR REPLACE FUNCTION public.browse_companies()
RETURNS TABLE(
  id uuid,
  name text,
  state text,
  city text,
  business_district text,
  description text,
  internship_position text,
  applications_enabled boolean,
  is_unlocked boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT DISTINCT c.id, c.name, c.state, COALESCE(c.city, 'Other')::text, c.business_district,
         c.description, c.internship_position, c.applications_enabled,
         public.has_paid_for(c.state, COALESCE(c.city, 'Other')) AS is_unlocked
  FROM public.companies c
  JOIN public.company_departments cd ON cd.company_id = c.id
  JOIN public.profiles p ON p.id = auth.uid()
  WHERE c.is_active = true
    AND cd.department_id = p.department_id
  ORDER BY c.name;
$$;