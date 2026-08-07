# 08 — Applications & email

## Dynamic form

`Apply.tsx` loads `get_unlocked_company(id)` and `get_company_requirements(id)`, then merges the requirement rows with `CANONICAL_FIELDS` via `mergeRequirements()`. Companies can mark fields required, optional or hidden, and add extra custom fields; the keys in `DEFAULT_INFO_KEYS` can never be hidden. Info fields are pre-filled from the student's profile using each field's `profileKey`, and previously uploaded documents in `profiles.documents` are reused so students never re-upload the same file.

## Documents

Uploads go to the private `applicant-documents` bucket under `{user_id}/…`, and the resulting paths are saved back onto `profiles.documents` for reuse. Nothing is public: `submit-application` mints 7-day signed URLs at send time.

Standard document set: passport photograph, government-issued ID, SIWES/IT introduction letter, student ID card, WAEC result, birth certificate, CV.

## Submission

`submit-application` runs the duplicate check and the three-gate revalidation (department eligibility, location payment, gated company fetch), then sends two emails through Resend and records the application with a frozen `snapshot` of the submitted info.

### Company email

Subject: `Ched-COCIS Link: Intern Application`. A responsive, table-based HTML layout that renders correctly in Gmail and Outlook: gradient midnight-to-indigo header with the Ched Technology mark and "Ched-COCIS Link" label, a white rounded card, a personalised greeting, then grouped sections — Personal Information, Academic Information, Internship Details, Additional Information — followed by a Supporting Documents block where each document is a tappable card with a document icon and a "View" link, plus a note that links expire in 7 days.

### Student email

A branded confirmation receipt summarising the company applied to, the details submitted and the documents included.

## Tracking

- Students: `/applications` (`MyApplications.tsx`) lists every submission with status and destination address; the dashboard shows the latest ten.
- Admins: `/admin/applications` is a read-only view of all submissions joined with applicant profile details. Admins do not change application status from this screen.
