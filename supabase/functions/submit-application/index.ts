import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ error: "unauthorized" }, 401);

    const body = await req.json();
    const { company_id, info, document_paths } = body as {
      company_id: string;
      info: Record<string, string>;
      document_paths: Record<string, string>;
    };
    if (!company_id) return json({ error: "company_id required" }, 400);

    // Prevent duplicate submissions to the same company
    const { data: existing } = await admin
      .from("applications")
      .select("id")
      .eq("user_id", user.id)
      .eq("company_id", company_id)
      .limit(1);
    if (existing && existing.length > 0) {
      return json({ error: "You have already applied to this company." }, 409);
    }

    // ---- Backend eligibility validation (never trust the client) ----
    // 1. Department must be assigned to this company (RLS-safe, runs as the caller).
    const { data: visible, error: vErr } = await supabase.rpc("company_visible", { _company_id: company_id });
    if (vErr) return json({ error: vErr.message }, 400);
    if (!visible) {
      return json({ error: "This placement is not open to your department." }, 403);
    }

    // 2. The company's state/city must be unlocked by this user.
    const { data: companyLoc } = await admin
      .from("companies")
      .select("state, city, is_active")
      .eq("id", company_id)
      .maybeSingle();
    if (!companyLoc || companyLoc.is_active === false) return json({ error: "Company not available" }, 404);
    const { data: paid, error: pErr } = await supabase.rpc("has_paid_for", {
      _state: companyLoc.state,
      _city: companyLoc.city || "Other",
    });
    if (pErr) return json({ error: pErr.message }, 400);
    if (!paid) {
      return json({ error: "Unlock this location before applying." }, 402);
    }

    // 3. Final gated fetch (also enforces both rules at the database level).
    const { data: companies, error: cErr } = await supabase.rpc("get_unlocked_company", { _company_id: company_id });
    if (cErr) return json({ error: cErr.message }, 400);
    const company = companies?.[0];
    if (!company) return json({ error: "Company not accessible" }, 403);
    if (company.applications_enabled === false) return json({ error: "Applications closed" }, 400);
    if (!company.internship_email) return json({ error: "This company has no application email configured" }, 400);


    // Build signed URLs for documents (7 days)
    const docLinks: { label: string; url: string }[] = [];
    for (const [label, path] of Object.entries(document_paths || {})) {
      if (!path) continue;
      const { data: signed } = await admin.storage.from("applicant-documents").createSignedUrl(path, 60 * 60 * 24 * 7);
      if (signed?.signedUrl) docLinks.push({ label, url: signed.signedUrl });
    }

    // ---- Compose email HTML (modern, client-safe table layout) ----
    const LABELS: Record<string, string> = {
      full_name: "Full Name", email: "Email", phone: "Phone Number",
      date_of_birth: "Date of Birth", address: "Residential Address",
      university: "University", department: "Department", level: "Level",
      matric_number: "Matric Number", internship_type: "Internship Type",
      internship_duration: "Expected Duration", preferred_start_date: "Preferred Start Date",
      expected_end_date: "Expected End Date",
    };
    const prettify = (k: string) => LABELS[k] || k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    const infoEntries = Object.entries(info || {}).filter(([, v]) => v);
    const used = new Set<string>();
    const pick = (keys: string[]) => {
      const out = keys
        .map(k => infoEntries.find(([ek]) => ek === k))
        .filter(Boolean) as [string, string][];
      out.forEach(([k]) => used.add(k));
      return out;
    };
    const groups: { title: string; rows: [string, string][] }[] = [
      { title: "Personal Information", rows: pick(["full_name", "email", "phone", "date_of_birth", "address"]) },
      { title: "Academic Information", rows: pick(["university", "department", "level", "matric_number"]) },
      { title: "Internship Details", rows: pick(["internship_type", "internship_duration", "preferred_start_date", "expected_end_date"]) },
    ];
    const otherRows = infoEntries.filter(([k]) => !used.has(k)) as [string, string][];
    if (otherRows.length) groups.push({ title: "Additional Information", rows: otherRows });

    const rowHtml = (k: string, v: string) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f4;font-size:12px;color:#6b6b80;letter-spacing:.04em;text-transform:uppercase;width:44%;vertical-align:top;font-family:Arial,Helvetica,sans-serif">${escape(prettify(k))}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f4;font-size:15px;color:#16163a;line-height:1.5;vertical-align:top;font-family:Arial,Helvetica,sans-serif">${escape(String(v))}</td>
      </tr>`;

    const sectionsHtml = groups
      .filter(g => g.rows.length)
      .map(g => `
        <tr><td style="padding:28px 32px 0 32px">
          <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#4f46e5;font-weight:bold;font-family:Arial,Helvetica,sans-serif">${escape(g.title)}</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:8px">
            ${g.rows.map(([k, v]) => rowHtml(k, v)).join("")}
          </table>
        </td></tr>`)
      .join("");

    const docsHtml = docLinks.length
      ? `<tr><td style="padding:28px 32px 0 32px">
          <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#4f46e5;font-weight:bold;font-family:Arial,Helvetica,sans-serif">Supporting Documents</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;margin-top:12px">
            ${docLinks.map(d => `
              <tr><td style="padding:6px 0">
                <a href="${d.url}" style="display:block;text-decoration:none;border:1px solid #e6e6ef;border-radius:10px;padding:14px 16px;background:#fbfbfd;color:#16163a;font-size:15px;font-family:Arial,Helvetica,sans-serif">
                  <span style="font-size:16px">&#128196;</span>&nbsp;&nbsp;<span style="color:#16163a">${escape(d.label)}</span>
                  <span style="color:#4f46e5;font-size:13px">&nbsp;&nbsp;View &rsaquo;</span>
                </a>
              </td></tr>`).join("")}
          </table>
          <div style="margin-top:10px;font-size:12px;color:#8a8a9e;font-family:Arial,Helvetica,sans-serif">Document links remain valid for 7 days.</div>
        </td></tr>`
      : `<tr><td style="padding:28px 32px 0 32px"><div style="font-size:14px;color:#8a8a9e;font-family:Arial,Helvetica,sans-serif">No documents were attached to this application.</div></td></tr>`;

    const applicantName = (info?.full_name as string) || "The applicant";
    const contactName = (company as { contact_name?: string }).contact_name;
    const greetingName = contactName || company.name;
    const applicantEmailForFooter = (info?.email as string) || user.email || "";

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Internship Application</title></head>
<body style="margin:0;padding:0;background:#f4f4f8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:24px 12px">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6e6ef">

    <!-- Header -->
    <tr><td style="background:#16163a;background-image:linear-gradient(135deg,#16163a 0%,#2a2a70 55%,#4f46e5 100%);padding:32px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle">
          <div style="display:inline-block;background:#ffffff;color:#4f46e5;font-weight:bold;font-size:16px;letter-spacing:.06em;padding:8px 14px;border-radius:10px;font-family:Arial,Helvetica,sans-serif">CT</div>
        </td>
        <td align="right" style="vertical-align:middle">
          <div style="color:#c9c9ee;font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif">Ched&#8209;COCIS Link</div>
        </td>
      </tr></table>
      <div style="color:#ffffff;font-size:26px;line-height:1.25;margin-top:20px;font-family:Georgia,'Times New Roman',serif">Internship Application</div>
      <div style="color:#b9b9e6;font-size:14px;margin-top:6px;font-family:Arial,Helvetica,sans-serif">Official submission via Ched Technology &times; COCIS</div>
    </td></tr>

    <!-- Intro -->
    <tr><td style="padding:32px 32px 0 32px;font-family:Arial,Helvetica,sans-serif">
      <div style="font-size:17px;color:#16163a;font-weight:bold">Dear ${escape(greetingName)},</div>
      <p style="font-size:15px;line-height:1.65;color:#42425c;margin:12px 0 0">
        ${escape(applicantName)} has submitted an internship application through Ched Technology&rsquo;s
        <strong style="color:#16163a">Ched&#8209;COCIS Link</strong> platform. The applicant&rsquo;s information and
        supporting documents are provided below for your review.
      </p>
    </td></tr>

    ${sectionsHtml}
    ${docsHtml}

    <!-- Reply CTA -->
    <tr><td style="padding:28px 32px 0 32px">
      <div style="border-top:1px solid #eeeef4;padding-top:20px;font-size:14px;color:#42425c;line-height:1.6;font-family:Arial,Helvetica,sans-serif">
        To contact the applicant directly, simply reply to this email${applicantEmailForFooter ? ` or write to <a href="mailto:${escape(applicantEmailForFooter)}" style="color:#4f46e5;text-decoration:none">${escape(applicantEmailForFooter)}</a>` : ""}.
      </div>
    </td></tr>

    <!-- Footer -->
    <tr><td style="padding:28px 32px 32px 32px">
      <div style="background:#fafafd;border:1px solid #eeeef4;border-radius:12px;padding:20px;font-family:Arial,Helvetica,sans-serif">
        <div style="font-size:13px;color:#16163a;font-weight:bold">Sent securely via Ched Technology</div>
        <div style="font-size:12px;color:#6b6b80;line-height:1.7;margin-top:6px">
          Ched&#8209;COCIS Link Platform &middot; Internship Placement Management System<br>
          Ched Technology facilitates this application and is not the employer or applicant.
        </div>
      </div>
      <div style="text-align:center;font-size:11px;color:#9a9ab0;margin-top:16px;font-family:Arial,Helvetica,sans-serif">Powered by Ched Technology</div>
    </td></tr>

  </table>
</td></tr></table>
</body></html>`;


    const applicantEmail = (info?.email as string) || user.email || undefined;

    const resend = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ChedLink <onboarding@resend.dev>",
        to: [company.internship_email],
        reply_to: applicantEmail,
        subject: "Ched-COCIS Link: Intern Application",
        html,
      }),
    });
    const resendBody = await resend.text();
    if (!resend.ok) {
      console.error("resend failed", resend.status, resendBody);
      return json({ error: "Email send failed", details: resendBody }, 502);
    }

    // Log application
    await admin.from("applications").insert({
      user_id: user.id,
      company_id,
      snapshot: { info, company_name: company.name },
      documents: document_paths || {},
      sent_to_email: company.internship_email,
    });

    // ---- Confirmation copy to the student ----
    if (applicantEmail) {
      const submittedAt = new Date().toLocaleString("en-GB", { timeZone: "Africa/Lagos" });
      const confirmationHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Application received</title></head>
<body style="margin:0;padding:0;background:#f4f4f8">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:24px 12px"><tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6e6ef">
    <tr><td style="background:#16163a;background-image:linear-gradient(135deg,#16163a 0%,#2a2a70 55%,#4f46e5 100%);padding:28px 32px">
      <div style="display:inline-block;background:#ffffff;color:#4f46e5;font-weight:bold;font-size:15px;letter-spacing:.06em;padding:7px 13px;border-radius:10px;font-family:Arial,Helvetica,sans-serif">CT</div>
      <div style="color:#ffffff;font-size:24px;line-height:1.25;margin-top:18px;font-family:Georgia,'Times New Roman',serif">Application submitted</div>
      <div style="color:#b9b9e6;font-size:13px;margin-top:6px;font-family:Arial,Helvetica,sans-serif">Ched&#8209;COCIS Link &middot; Ched Technology</div>
    </td></tr>
    <tr><td style="padding:30px 32px 0 32px;font-family:Arial,Helvetica,sans-serif">
      <div style="font-size:17px;color:#16163a;font-weight:bold">Hi ${escape(applicantName)},</div>
      <p style="font-size:15px;line-height:1.65;color:#42425c;margin:12px 0 0">
        We have sent your internship application to <strong style="color:#16163a">${escape(company.name)}</strong>.
        Their team will contact you directly if they would like to move forward.
      </p>
    </td></tr>
    <tr><td style="padding:22px 32px 0 32px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f4;font-size:12px;color:#6b6b80;text-transform:uppercase;letter-spacing:.04em;width:44%;font-family:Arial,Helvetica,sans-serif">Company</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f4;font-size:15px;color:#16163a;font-family:Arial,Helvetica,sans-serif">${escape(company.name)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f4;font-size:12px;color:#6b6b80;text-transform:uppercase;letter-spacing:.04em;font-family:Arial,Helvetica,sans-serif">Location</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f4;font-size:15px;color:#16163a;font-family:Arial,Helvetica,sans-serif">${escape(`${company.city || ""}${company.city ? ", " : ""}${company.state || ""}`)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f4;font-size:12px;color:#6b6b80;text-transform:uppercase;letter-spacing:.04em;font-family:Arial,Helvetica,sans-serif">Documents sent</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f4;font-size:15px;color:#16163a;font-family:Arial,Helvetica,sans-serif">${docLinks.length}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:12px;color:#6b6b80;text-transform:uppercase;letter-spacing:.04em;font-family:Arial,Helvetica,sans-serif">Submitted</td>
          <td style="padding:10px 0;font-size:15px;color:#16163a;font-family:Arial,Helvetica,sans-serif">${escape(submittedAt)}</td>
        </tr>
      </table>
    </td></tr>
    <tr><td style="padding:26px 32px 32px 32px">
      <div style="background:#fafafd;border:1px solid #eeeef4;border-radius:12px;padding:18px;font-family:Arial,Helvetica,sans-serif">
        <div style="font-size:13px;color:#16163a;font-weight:bold">Keep an eye on your inbox</div>
        <div style="font-size:12px;color:#6b6b80;line-height:1.7;margin-top:6px">
          You can track every submission from the “My applications” page on Ched&#8209;COCIS Link.
          This is a confirmation only — no action is needed from you right now.
        </div>
      </div>
      <div style="text-align:center;font-size:11px;color:#9a9ab0;margin-top:16px;font-family:Arial,Helvetica,sans-serif">Powered by Ched Technology</div>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;

      const confirm = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ChedLink <onboarding@resend.dev>",
          to: [applicantEmail],
          subject: `Ched-COCIS Link: Application sent to ${company.name}`,
          html: confirmationHtml,
        }),
      });
      if (!confirm.ok) {
        // The application already went through — never fail the request on the receipt.
        console.error("student confirmation failed", confirm.status, await confirm.text());
      }
    }

    return json({ success: true });

  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
function escape(s: string) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
