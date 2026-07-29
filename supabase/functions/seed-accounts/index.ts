import { createClient } from "npm:@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// One-shot bootstrap: creates the fixed admin + demo student accounts.
// Safe to re-run; already-existing users are skipped.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const accounts = [
    { email: "ikoroeric2@gmail.com", password: "Nwabueze1#", role: "admin", full_name: "Eric Ikoro" },
    { email: "ikoro-eric@calebuniversity.edu.ng", password: "Nwabueze1#", role: "student", full_name: "Eric Ikoro" },
  ];

  const results: any[] = [];
  for (const acc of accounts) {
    // create user
    const { data: created, error: cErr } = await admin.auth.admin.createUser({
      email: acc.email,
      password: acc.password,
      email_confirm: true,
      user_metadata: { full_name: acc.full_name },
    });
    let userId = created?.user?.id;
    if (cErr && !userId) {
      // find existing
      const { data: list } = await admin.auth.admin.listUsers();
      userId = list.users.find(u => u.email === acc.email)?.id;
    }
    if (!userId) { results.push({ email: acc.email, error: cErr?.message }); continue; }

    // ensure profile
    await admin.from("profiles").upsert({ id: userId, full_name: acc.full_name });
    // set role
    await admin.from("user_roles").delete().eq("user_id", userId);
    await admin.from("user_roles").insert({ user_id: userId, role: acc.role });
    results.push({ email: acc.email, id: userId, role: acc.role });
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
