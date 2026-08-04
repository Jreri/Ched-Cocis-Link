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

    // Verify user can apply (RLS-guarded RPC)
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

    // Compose email HTML
    const rows = Object.entries(info || {})
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.05em">${escape(k)}</td><td style="padding:6px 12px;font-size:14px">${escape(String(v))}</td></tr>`)
      .join("");
    const docs = docLinks.length
      ? `<h3 style="font-family:Georgia,serif;margin-top:24px">Attached documents</h3><ul>${docLinks
          .map(d => `<li><a href="${d.url}">${escape(d.label)}</a></li>`)
          .join("")}</ul>`
      : "<p><em>No documents attached.</em></p>";
    const html = `
      <div style="font-family:Arial,sans-serif;color:#111;max-width:640px;margin:0 auto">
        <div style="border-left:3px solid #4f46e5;padding:8px 16px;margin-bottom:16px">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:#4f46e5">ChedLink · CCL</div>
          <h1 style="font-family:Georgia,serif;margin:4px 0 0">Intern Application</h1>
          <div style="font-size:12px;color:#666">Sent via Ched Dev × COCIS</div>
        </div>
        <p>Dear ${escape(company.name)},</p>
        <p>Please find below an internship application submitted through ChedLink.</p>
        <table style="border-collapse:collapse;border:1px solid #eee;width:100%">${rows}</table>
        ${docs}
        <p style="margin-top:24px;font-size:12px;color:#666">This message was routed by ChedLink on behalf of the applicant. Reply directly to reach them.</p>
      </div>`;

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
