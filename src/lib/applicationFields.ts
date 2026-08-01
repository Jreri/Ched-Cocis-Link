// Canonical fields shared across Apply/Profile/Admin.
// Admins can override per-company via company_requirements table.

export type FieldKind = "info" | "document" | "custom"
export type FieldReq = "required" | "optional" | "hidden"

export type CanonicalField = {
  key: string
  label: string
  kind: FieldKind
  // default requirement when a company has no override for this field
  default: FieldReq
  // info fields only
  input?: "text" | "email" | "tel" | "date" | "textarea"
  // profile column to auto-fill from
  profileKey?: string
}

export const CANONICAL_FIELDS: CanonicalField[] = [
  // Personal
  { key: "full_name", label: "Full Name", kind: "info", default: "required", input: "text", profileKey: "full_name" },
  { key: "phone", label: "Phone Number", kind: "info", default: "required", input: "tel", profileKey: "phone" },
  { key: "email", label: "Email Address", kind: "info", default: "required", input: "email" },
  { key: "address", label: "Residential Address", kind: "info", default: "required", input: "textarea", profileKey: "address" },
  { key: "date_of_birth", label: "Date of Birth", kind: "info", default: "required", input: "date", profileKey: "date_of_birth" },
  // Academic
  { key: "university", label: "University", kind: "info", default: "required", input: "text", profileKey: "university" },
  { key: "department", label: "Department", kind: "info", default: "required", input: "text", profileKey: "department_name" },
  { key: "level", label: "Level", kind: "info", default: "required", input: "text", profileKey: "level" },
  { key: "matric_number", label: "Matriculation Number", kind: "info", default: "required", input: "text", profileKey: "matric_number" },
  // Internship
  { key: "internship_type", label: "Internship Type", kind: "info", default: "required", input: "text", profileKey: "internship_type" },
  { key: "internship_duration", label: "Expected Internship Duration", kind: "info", default: "required", input: "text", profileKey: "internship_duration" },
  { key: "preferred_start_date", label: "Preferred Start Date", kind: "info", default: "required", input: "date", profileKey: "preferred_start_date" },
  { key: "expected_end_date", label: "Expected End Date", kind: "info", default: "required", input: "date", profileKey: "expected_end_date" },
  // Documents
  { key: "doc_passport", label: "Passport Photograph", kind: "document", default: "required" },
  { key: "doc_gov_id", label: "Government-issued ID (NIN / Voter's / Driver's / Int'l Passport)", kind: "document", default: "optional" },
  { key: "doc_siwes_letter", label: "SIWES / Industrial Training Introduction Letter", kind: "document", default: "required" },
  { key: "doc_student_id", label: "Student ID Card", kind: "document", default: "required" },
  { key: "doc_waec", label: "WAEC Result", kind: "document", default: "optional" },
  { key: "doc_birth_cert", label: "Birth Certificate", kind: "document", default: "optional" },
  { key: "doc_cv", label: "Curriculum Vitae (CV, include date of birth)", kind: "document", default: "required" },
]

export const DOCUMENT_FIELDS = CANONICAL_FIELDS.filter(f => f.kind === "document")

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()

/**
 * Resolve a free-text requirements string (from CSV) into canonical document field keys.
 * Accepts field keys ("doc_cv"), labels ("Curriculum Vitae"), or common aliases ("CV", "passport").
 */
export function resolveDocumentKeys(input: string): { keys: string[]; unmatched: string[] } {
  const aliases: Record<string, string> = {
    cv: "doc_cv",
    resume: "doc_cv",
    "curriculum vitae": "doc_cv",
    passport: "doc_passport",
    "passport photo": "doc_passport",
    id: "doc_gov_id",
    "id card": "doc_student_id",
    "school id": "doc_student_id",
    nin: "doc_gov_id",
    siwes: "doc_siwes_letter",
    "introduction letter": "doc_siwes_letter",
    "school letter": "doc_siwes_letter",
    waec: "doc_waec",
    "birth certificate": "doc_birth_cert",
  }

  const tokens = input.split(/[,;|\n]/).map(t => t.trim()).filter(Boolean)
  const keys: string[] = []
  const unmatched: string[] = []
  tokens.forEach(t => {
    const n = norm(t)
    const byKey = DOCUMENT_FIELDS.find(f => norm(f.key) === n || f.key.toLowerCase() === t.toLowerCase())
    const byLabel = DOCUMENT_FIELDS.find(f => norm(f.label) === n)
    const byPartial = DOCUMENT_FIELDS.find(f => norm(f.label).includes(n) || n.includes(norm(f.key).replace(/^doc /, "")))
    const alias = aliases[n]
    const match = byKey || byLabel || byPartial || (alias ? DOCUMENT_FIELDS.find(f => f.key === alias) : undefined)
    if (match) { if (!keys.includes(match.key)) keys.push(match.key) }
    else unmatched.push(t)
  })
  return { keys, unmatched }
}


export type CompanyRequirementRow = {
  field_key: string
  kind: FieldKind
  label: string
  requirement: FieldReq
  sort_order: number
}

/** Merge canonical defaults with company overrides. Overrides can hide fields or add custom ones. */
export function mergeRequirements(overrides: CompanyRequirementRow[]) {
  const overrideMap = new Map(overrides.map(o => [o.field_key, o]))
  const merged: (CanonicalField & { requirement: FieldReq; sort_order: number })[] = []
  CANONICAL_FIELDS.forEach((f, i) => {
    const o = overrideMap.get(f.key)
    if (o?.requirement === "hidden") return
    merged.push({
      ...f,
      requirement: o?.requirement ?? f.default,
      sort_order: o?.sort_order ?? i,
    })
  })
  // Custom fields (only from overrides)
  overrides
    .filter(o => o.kind === "custom" && o.requirement !== "hidden")
    .forEach(o => {
      merged.push({
        key: o.field_key,
        label: o.label,
        kind: "custom",
        default: o.requirement,
        input: "text",
        requirement: o.requirement,
        sort_order: o.sort_order ?? 999,
      })
    })
  return merged.sort((a, b) => a.sort_order - b.sort_order)
}
