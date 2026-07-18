import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const PRICE_KOBO = 3000 * 100; // ₦3,000

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) return json({ error: 'Unauthorized' }, 401);

    const userId = claimsData.claims.sub as string;
    const email = (claimsData.claims.email as string) || `${userId}@studentplace.ng`;

    const body = await req.json().catch(() => ({}));
    const state = String(body.state || '').trim();
    const city = String(body.city || '').trim();
    const callbackUrl = String(body.callback_url || '').trim();

    if (!state || !city || !callbackUrl) {
      return json({ error: 'state, city, and callback_url are required' }, 400);
    }

    // Already paid? Short-circuit.
    const { data: existing } = await supabase
      .from('placement_access')
      .select('id')
      .eq('user_id', userId)
      .eq('state', state)
      .eq('city', city)
      .maybeSingle();
    if (existing) return json({ already_paid: true });

    const secret = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!secret) return json({ error: 'Payment provider not configured' }, 500);

    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: PRICE_KOBO,
        currency: 'NGN',
        callback_url: callbackUrl,
        metadata: { user_id: userId, state, city },
      }),
    });

    const initJson = await initRes.json();
    if (!initRes.ok || !initJson.status) {
      console.error('Paystack init failed', initJson);
      return json({ error: initJson.message || 'Failed to initialize payment' }, 502);
    }

    return json({
      authorization_url: initJson.data.authorization_url,
      reference: initJson.data.reference,
    });
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
