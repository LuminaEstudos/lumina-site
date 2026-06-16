import {
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
  fetchBillingStatus,
  formatDate,
  planLabel,
  redirectToLogin,
  sourceLabel,
  supabase,
} from '/assets/js/site-auth.js';

const message = document.querySelector('#account-message');
const sessionPanel = document.querySelector('#session-panel');
const accountPanel = document.querySelector('#account-panel');
const cancelButton = document.querySelector('#cancel-button');
const planText = document.querySelector('#subscription-plan');
const statusLabel = document.querySelector('#subscription-status-label');
const periodText = document.querySelector('#subscription-period');
const pill = document.querySelector('#subscription-pill');
const title = document.querySelector('#subscription-title');
const copy = document.querySelector('#subscription-copy');

function setMessage(text, kind = '') {
  message.textContent = text;
  message.className = `account-message ${kind}`.trim();
}

async function sessionOrNull() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.setTimeout(() => redirectToLogin('/conta/assinatura/'), 350);
    return null;
  }
  sessionPanel.hidden = true;
  accountPanel.hidden = false;
  return data.session;
}

function fromCheckout() {
  return new URLSearchParams(window.location.search).get('from') === 'checkout';
}

function canCancel(subscription) {
  return Boolean(subscription && !subscription.cancel_at_period_end && ['authorized', 'pending', 'payment_failed'].includes(subscription.status));
}

function renderSubscription({ entitlement, subscription }, fromCheckoutFlag) {
  const active = Boolean(entitlement?.active);
  const plan = subscription?.plan_id || entitlement?.plan_id || 'free';
  const periodEnd = subscription?.current_period_end || entitlement?.current_period_end || entitlement?.expires_at;

  planText.textContent = planLabel(plan);
  statusLabel.textContent = active ? 'Ativo' : 'Free';
  periodText.textContent = formatDate(periodEnd);
  cancelButton.hidden = !canCancel(subscription);

  if (fromCheckoutFlag && !subscription && !active) {
    pill.className = 'account-status-pill warn';
    pill.textContent = 'Confirmando pagamento';
    statusLabel.textContent = 'Aguarde';
    title.textContent = 'Recebemos sua autorização';
    copy.textContent = 'Estamos confirmando com o Mercado Pago. Isso pode levar alguns segundos — mantenha esta página aberta.';
    return;
  }

  if (subscription?.cancel_at_period_end) {
    pill.className = 'account-status-pill warn';
    pill.textContent = 'Renovação cancelada';
    statusLabel.textContent = 'Cancelamento programado';
    title.textContent = 'Acesso mantido até o fim do período';
    copy.textContent = `Você não terá novas cobranças. O acesso continua até ${formatDate(periodEnd)}.`;
    return;
  }

  if (subscription) {
    pill.className = 'account-status-pill';
    pill.textContent = 'Mercado Pago ativo';
    title.textContent = planLabel(plan);
    copy.textContent = `Assinatura ${subscription.status}. Próxima referência de acesso: ${formatDate(periodEnd)}.`;
    return;
  }

  if (active) {
    pill.className = 'account-status-pill';
    pill.textContent = 'Acesso ativo';
    title.textContent = `${planLabel(plan)} ativo`;
    copy.textContent = `Este acesso veio por ${sourceLabel(entitlement?.source)}. Não há renovação Mercado Pago para cancelar nesta página.`;
    return;
  }

  pill.className = 'account-status-pill muted';
  pill.textContent = 'Plano Free';
  title.textContent = 'Nenhuma assinatura ativa';
  copy.textContent = 'Você está no plano Free. Assine Plus ou Pro para liberar mais recursos.';
}

async function loadStatus() {
  const session = await sessionOrNull();
  if (!session) return;
  const checkoutFlag = fromCheckout();
  const result = await fetchBillingStatus(session);
  renderSubscription(result, checkoutFlag);
}

cancelButton.addEventListener('click', async () => {
  const session = await sessionOrNull();
  if (!session) return setMessage('Entre na sua conta antes de cancelar.', 'error');
  const confirmed = window.confirm('Cancelar a renovação da assinatura Lumina? O acesso continua até o fim do período pago.');
  if (!confirmed) return;

  const response = await fetch(`${SUPABASE_URL}/functions/v1/billing-cancel-subscription`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${session.access_token}`,
      apikey: SUPABASE_PUBLISHABLE_KEY,
      'content-type': 'application/json',
    },
  });
  const result = await response.json();
  setMessage(response.ok && result.ok ? 'Renovação cancelada.' : 'Não foi possível cancelar agora.', response.ok && result.ok ? 'success' : 'error');
  await loadStatus();
});

loadStatus().catch((error) => {
  console.error(error);
  setMessage('Não foi possível carregar a assinatura.', 'error');
});
