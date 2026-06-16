const SUPABASE_URL = 'https://lvxvesjefsqtwawiwgxs.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_OP7oviFB_J1kxWXgle-ucQ_nQVu97fu';
const SUPABASE_JS_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

function loadSupabaseSdk() {
  if (window.supabase?.createClient) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${SUPABASE_JS_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = SUPABASE_JS_URL;
    script.async = true;
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });
}

function createClient() {
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      detectSessionInUrl: true,
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

function initialForEmail(email) {
  const firstCharacter = (email || '').trim().charAt(0);
  return firstCharacter ? firstCharacter.toLocaleUpperCase('pt-BR') : '';
}

function updateAccountButtons(session) {
  const accountLinks = [...document.querySelectorAll('.nav-account')];
  const email = session?.user?.email || '';
  const initial = initialForEmail(email);

  for (const link of accountLinks) {
    if (!link.dataset.defaultAccountHtml) {
      link.dataset.defaultAccountHtml = link.innerHTML;
    }

    if (!initial) {
      link.classList.remove('is-signed-in');
      link.innerHTML = link.dataset.defaultAccountHtml;
      link.setAttribute('aria-label', 'Minha conta');
      link.setAttribute('title', 'Minha conta');
      continue;
    }

    link.classList.add('is-signed-in');
    link.textContent = '';
    const initialNode = document.createElement('span');
    initialNode.className = 'nav-account-initial';
    initialNode.textContent = initial;
    link.appendChild(initialNode);
    link.setAttribute('aria-label', `Minha conta (${email})`);
    link.setAttribute('title', email);
  }
}

loadSupabaseSdk()
  .then(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => updateAccountButtons(data.session));
    supabase.auth.onAuthStateChange((_event, session) => updateAccountButtons(session));
  })
  .catch((error) => console.error('Não foi possível atualizar o estado do header.', error));
