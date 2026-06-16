import { safeRedirectPath, supabase } from '/assets/js/site-auth.js';

const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const passwordLoginButton = document.querySelector('#password-login-button');
const magicLinkButton = document.querySelector('#magic-link-button');
const message = document.querySelector('#login-message');
const redirectTo = safeRedirectPath(new URLSearchParams(window.location.search).get('redirect'));

let redirecting = false;

function setMessage(text, kind = '') {
  message.textContent = text;
  message.className = `login-message ${kind}`.trim();
}

function setBusy(busy) {
  passwordLoginButton.disabled = busy;
  magicLinkButton.disabled = busy;
}

function redirectAfterLogin() {
  if (redirecting) return;
  redirecting = true;
  setBusy(true);
  setMessage('Login confirmado. Redirecionando...', 'success');
  window.setTimeout(() => {
    window.location.assign(redirectTo);
  }, 700);
}

async function signInWithPassword() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email) return setMessage('Informe seu e-mail.', 'error');
  if (!password) return setMessage('Informe sua senha.', 'error');

  setBusy(true);
  setMessage('Verificando credenciais...');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    console.error(error);
    setBusy(false);
    return setMessage('E-mail ou senha inválidos. Se você usa Google ou link mágico, entre por link mágico.', 'error');
  }
  redirectAfterLogin();
}

async function sendMagicLink() {
  const email = emailInput.value.trim();
  if (!email) return setMessage('Informe seu e-mail.', 'error');

  const loginUrl = new URL('/login/', window.location.origin);
  loginUrl.searchParams.set('redirect', redirectTo);
  setBusy(true);
  setMessage('Enviando link de acesso...');
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: loginUrl.toString() },
  });
  setBusy(false);
  setMessage(error ? 'Não foi possível enviar o link de acesso.' : 'Enviamos um link de acesso para seu e-mail.', error ? 'error' : 'success');
}

passwordLoginButton.addEventListener('click', () => {
  signInWithPassword().catch((error) => {
    console.error(error);
    setBusy(false);
    setMessage('Não foi possível entrar agora. Tente novamente.', 'error');
  });
});

magicLinkButton.addEventListener('click', () => {
  sendMagicLink().catch((error) => {
    console.error(error);
    setBusy(false);
    setMessage('Não foi possível enviar o link de acesso.', 'error');
  });
});

passwordInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') passwordLoginButton.click();
});

supabase.auth.onAuthStateChange((_event, session) => {
  if (session) redirectAfterLogin();
});

supabase.auth.getSession().then(({ data }) => {
  if (data.session) redirectAfterLogin();
});
