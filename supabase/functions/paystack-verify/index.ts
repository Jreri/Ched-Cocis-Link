import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/** Paystack occasionally answers with an HTML error page (bad key, 5xx, WAF).
 *  Never blindly .json() — read text and parse defensively. */
async function paystackGet(url: string, secret: string) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${secret}`, Accept: 'application/json' },
  });
  const text = await res.text();
  let body: any = null;
  try {
    body = JSON.parse(text);
  } catch {
    console.error('Paystack non-JSON response', res.status, text.slice(0, 300));
    return { ok: false, status: res.status, body: null as any };
  }
  return { ok: res.ok, status: res.status, body };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401);

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) return json({ error: 'Unauthorized' }, 401);
    const userId = claimsData.claims.sub as string;

    const body = await req.json().catch(() => ({}));
    const reference = String(body.reference || '').trim();
    if (!reference) return json({ error: 'reference required' }, 400);

    const secret = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!secret) return json({ error: 'Payment provider not configured' }, 500);

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Already recorded for this reference? Idempotent success — never charge twice.
    const { data: byRef } = await admin
      .from('placement_access')
      .select('state, city')
      .eq('user_id', userId)
      .eq('paystack_reference', reference)
      .maybeSingle();
    if (byRef) {
      return json({ success: true, state: byRef.state, city: byRef.city, already_recorded: true });
    }

    // Verify with Paystack, retrying transient/non-JSON failures.
    const url = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
    let attempt = 0;
    let result = await paystackGet(url, secret);
    while (!result.body && attempt < 2) {
      attempt++;
      await new Promise((r) => setTimeout(r, 600 * attempt));
      result = await paystackGet(url, secret);
    }

    if (!result.body) {
      return json({ error: 'Could not reach the payment provider. Please try again in a moment.' }, 502);
    }
    if (!result.ok || !result.body.status) {
      return json({ error: result.body.message || 'Verification failed' }, 502);
    }

    const data = result.body.data;
    if (data?.status !== 'success') {
      return json({ success: false, status: data?.status ?? 'unknown' });
    }

    const meta = data.metadata || {};
    if (meta.user_id && meta.user_id !== userId) {
      return json({ error: 'Reference does not belong to this user' }, 403);
    }
    const state = meta.state as string;
    const city = meta.city as string;
    if (!state || !city) return json({ error: 'Missing location metadata' }, 400);

    const amountNaira = Math.floor((data.amount ?? 0) / 100);

    // Idempotent upsert via service role (placement_access has no insert policy).
    const { data: existing } = await admin
      .from('placement_access')
      .select('id')
      .eq('user_id', userId)
      .eq('state', state)
      .eq('city', city)
      .maybeSingle();

    if (!existing) {
      const { error: insertErr } = await admin.from('placement_access').insert({
        user_id: userId,
        state,
        city,
        amount_naira: amountNaira,
        paystack_reference: reference,
      });
      if (insertErr) {
        // A concurrent verify may have won the race — treat an existing row as success.
        const { data: recheck } = await admin
          .from('placement_access')
          .select('id')
          .eq('user_id', userId)
          .eq('state', state)
          .eq('city', city)
          .maybeSingle();
        if (!recheck) {
          console.error('insert placement_access failed', insertErr);
          return json({ error: 'Could not record access' }, 500);
        }
      }
    }

    return json({ success: true, state, city });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
