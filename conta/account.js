import {
  fetchBillingStatus,
  formatDate,
  planLabel,
  requireSession,
  signOutAndRedirect,
  sourceLabel,
} from '/assets/js/site-auth.js';

const loading = document.querySelector('#account-loading');
const dashboard = document.querySelector('#account-dashboard');
const avatar = document.querySelector('#account-avatar');
const emailText = document.querySelector('#account-email');
const planText = document.querySelector('#account-plan');
const statusText = document.querySelector('#account-status');
const statusPill = document.querySelector('#account-status-pill');
const summaryTitle = document.querySelector('#account-summary-title');
const summaryCopy = document.querySelector('#account-summary-copy');
const message = document.querySelector('#account-message');
const signOutButton = document.querySelector('#sign-out-button');

function setMessage(text, kind = '') {
  message.textContent = text;
  message.className = `account-message ${kind}`.trim();
}

function avatarInitialForEmail(email) {
  const firstCharacter = (email || 'L').trim().charAt(0);
  return firstCharacter ? firstCharacter.toLocaleUpperCase('pt-BR') : 'L';
}

function renderStatus({ entitlement, subscription }) {
  const active = Boolean(entitlement?.active);
  const plan = subscription?.plan_id || entitlement?.plan_id || 'free';
  const source = sourceLabel(entitlement?.source);
  const periodEnd = subscription?.current_period_end || entitlement?.current_period_end || entitlement?.expires_at;

  planText.textContent = planLabel(plan);
  statusText.textContent = active ? 'Ativo' : 'Free';
  statusPill.className = `account-status-pill${active ? '' : ' muted'}`;
  statusPill.textContent = active ? 'Acesso ativo' : 'Plano gratuito';

  if (subscription?.cancel_at_period_end) {
    statusText.textContent = 'Cancelamento programado';
    statusPill.className = 'account-status-pill warn';
    statusPill.textContent = 'Renovação cancelada';
    summaryTitle.textContent = 'Acesso mantido até o fim do período';
    summaryCopy.textContent = `Sua renovação foi cancelada e o acesso fica disponível até ${formatDate(periodEnd)}.`;
    return;
  }

  if (subscription) {
    summaryTitle.textContent = `${planLabel(plan)} via Mercado Pago`;
    summaryCopy.textContent = `Status ${subscription.status}. Próxima referência de acesso: ${formatDate(periodEnd)}.`;
    return;
  }

  if (active) {
    summaryTitle.textContent = `${planLabel(plan)} ativo`;
    summaryCopy.textContent = `Seu acesso está ativo por ${source}. Validade: ${formatDate(periodEnd)}.`;
    return;
  }

  summaryTitle.textContent = 'Nenhuma assinatura ativa';
  summaryCopy.textContent = 'Você está no plano Free. Escolha Plus ou Pro para liberar limites maiores e sincronização.';
}

async function loadAccount() {
  const session = await requireSession('/conta/');
  if (!session) return;

  const email = session.user.email || 'e-mail não informado';
  emailText.textContent = email;
  avatar.textContent = avatarInitialForEmail(email);
  loading.hidden = true;
  dashboard.hidden = false;

  try {
    const result = await fetchBillingStatus(session);
    renderStatus(result);
  } catch (error) {
    console.error(error);
    setMessage('Não foi possível carregar os dados da conta.', 'error');
    planText.textContent = 'Indisponível';
    statusText.textContent = 'Erro';
    statusPill.className = 'account-status-pill warn';
    statusPill.textContent = 'Tente novamente';
  }
}

signOutButton.addEventListener('click', () => {
  signOutAndRedirect().catch((error) => {
    console.error(error);
    setMessage('Não foi possível sair agora.', 'error');
  });
});

loadAccount().catch((error) => {
  console.error(error);
  setMessage('Não foi possível abrir sua conta.', 'error');
});
