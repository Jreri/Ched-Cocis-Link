import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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

    const vRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const vJson = await vRes.json();
    if (!vRes.ok || !vJson.status) {
      return json({ error: vJson.message || 'Verification failed' }, 502);
    }

    const data = vJson.data;
    if (data.status !== 'success') {
      return json({ success: false, status: data.status });
    }

    const meta = data.metadata || {};
    if (meta.user_id && meta.user_id !== userId) {
      return json({ error: 'Reference does not belong to this user' }, 403);
    }
    const state = meta.state as string;
    const city = meta.city as string;
    if (!state || !city) return json({ error: 'Missing location metadata' }, 400);

    const amountNaira = Math.floor((data.amount ?? 0) / 100);

    // Idempotent insert via service role (placement_access has no insert policy).
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

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
        console.error('insert placement_access failed', insertErr);
        return json({ error: 'Could not record access' }, 500);
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
