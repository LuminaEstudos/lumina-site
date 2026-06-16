export const SUPABASE_URL = 'https://lvxvesjefsqtwawiwgxs.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_OP7oviFB_J1kxWXgle-ucQ_nQVu97fu';

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    detectSessionInUrl: true,
    flowType: 'pkce',
    persistSession: true,
    autoRefreshToken: true,
  },
});

export function safeRedirectPath(value, fallback = '/conta/') {
  if (!value) return fallback;
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch (_) {
    return fallback;
  }
}

export function loginUrlFor(redirectPath = '/conta/') {
  const url = new URL('/login/', window.location.origin);
  url.searchParams.set('redirect', safeRedirectPath(redirectPath));
  return `${url.pathname}${url.search}`;
}

export function redirectToLogin(redirectPath = window.location.pathname) {
  window.location.assign(loginUrlFor(redirectPath));
}

export async function currentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function requireSession(redirectPath = window.location.pathname) {
  const session = await currentSession();
  if (!session) {
    redirectToLogin(redirectPath);
    return null;
  }
  return session;
}

export async function signOutAndRedirect() {
  await supabase.auth.signOut();
  window.location.assign('/login/');
}

export async function fetchBillingStatus(session) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/billing-subscription-status`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${session.access_token}`,
      apikey: SUPABASE_PUBLISHABLE_KEY,
      'content-type': 'application/json',
    },
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.code || 'subscription_status_failed');
  return result;
}

export function formatDate(value) {
  if (!value) return 'data não informada';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

export function planLabel(planId) {
  switch (planId) {
    case 'plus_monthly':
      return 'Plus mensal';
    case 'plus_annual':
      return 'Plus anual';
    case 'pro_monthly':
      return 'Pro mensal';
    case 'pro_annual':
      return 'Pro anual';
    case 'plus':
      return 'Plus';
    case 'pro':
      return 'Pro';
    default:
      return 'Free';
  }
}

export function sourceLabel(source) {
  switch (source) {
    case 'mercado_pago':
      return 'Mercado Pago';
    case 'manual_admin':
      return 'liberação manual';
    case 'founder':
      return 'fundador';
    default:
      return 'Lumina';
  }
}
