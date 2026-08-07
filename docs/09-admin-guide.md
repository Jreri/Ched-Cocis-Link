# 09 — Admin guide

Reach the console with `Ctrl + Shift + A` or the hidden five-click footer trigger. Both land on `/admin`, which is role-gated.

## Companies

Full CRUD from a searchable, filterable table. Editable fields: name, address, state, city, LGA, business district, description, contact email/phone, logo URL, internship email, internship position, instructions, slots, applications enabled, active.

Duplicate protection: company names are unique, so re-adding an existing name is skipped rather than duplicated.

## Departments per company

Each row has a quick-edit dialog with a searchable department list. Saving rewrites that company's `company_departments` rows, which immediately changes which students can see the company — no CSV re-import required.

## Requirements

Per-company overrides are written to `company_requirements`: set any canonical field to required, optional or hidden, and add extra custom fields. Reusable named requirements live in `requirement_library` and are used to resolve free-text tokens during import.

## CSV bulk import

Parsed with PapaParse, with a column-mapping step. Recognised columns include **Name, Address, City, State, Email, Department, Requirements**.

- Departments are matched by name and created automatically when new.
- The Requirements column is resolved by `resolveDocumentKeys()`, which understands canonical keys (`doc_cv`), labels (`Curriculum Vitae`) and aliases (`CV`, `resume`, `passport`, `NIN`, `SIWES`, `WAEC`, `birth certificate`, …). Unmatched tokens are reported so they can be added to the library.
- Rows whose company name already exists are skipped.

## Applications

`/admin/applications` lists every submission with applicant details, target company and destination email. It is intentionally read-only.
