import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, loginUrlFor, supabase } from '/assets/js/site-auth.js';

let mercadoPago;
let cardPaymentBrickController;
let currentPlanId = new URLSearchParams(window.location.search).get('plan') || 'plus_monthly';

const message = document.querySelector('#billing-message');
const plansPanel = document.querySelector('#plans-panel');
const paymentPanel = document.querySelector('#payment-panel');
const selectedPlan = document.querySelector('#selected-plan');
const planButtons = [...document.querySelectorAll('[data-plan]')];
const loginLink = document.querySelector('#login-link');

const planAmounts = {
  plus_monthly: 19.90,
  plus_annual: 197.90,
  pro_monthly: 39.90,
  pro_annual: 397.90,
};

function setMessage(text, kind = '') {
  message.textContent = text;
  message.className = `billing-message ${kind}`.trim();
}

function subscriptionRedirectPath() {
  return `/assinatura/?plan=${encodeURIComponent(currentPlanId)}`;
}

function updateLoginLink() {
  loginLink.href = loginUrlFor(subscriptionRedirectPath());
}

function selectedPlanButton() {
  return planButtons.find((button) => button.dataset.plan === currentPlanId) || planButtons[0];
}

function updateSelectedPlan() {
  const selectedButton = selectedPlanButton();
  currentPlanId = selectedButton.dataset.plan;
  planButtons.forEach((button) => button.classList.toggle('active', button === selectedButton));
  selectedPlan.textContent = `Plano selecionado: ${selectedButton.querySelector('strong').textContent}`;
  updateLoginLink();
}

async function loadBillingConfig() {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/billing-public-config`, {
    method: 'GET',
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
  });
  const result = await response.json();
  if (!response.ok || !result.ok || !result.mercadoPagoPublicKey) {
    throw new Error('billing_public_config_unavailable');
  }
  mercadoPago = new MercadoPago(result.mercadoPagoPublicKey, { locale: 'pt-BR' });
}

async function refreshSession() {
  const { data } = await supabase.auth.getSession();
  const signedIn = Boolean(data.session);
  document.querySelector('#auth-panel').hidden = signedIn;
  plansPanel.hidden = false;
  if (!signedIn) {
    paymentPanel.hidden = true;
    updateLoginLink();
  }
  return data.session;
}

async function mountCardBrick() {
  updateSelectedPlan();
  paymentPanel.hidden = false;

  if (!mercadoPago) await loadBillingConfig();
  if (cardPaymentBrickController) await cardPaymentBrickController.unmount();

  const bricksBuilder = mercadoPago.bricks();
  cardPaymentBrickController = await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', {
    initialization: { amount: planAmounts[currentPlanId] || planAmounts.plus_monthly },
    style: { theme: 'dark' },
    callbacks: {
      onReady: () => setMessage('Preencha os dados no ambiente seguro do Mercado Pago.'),
      onSubmit: (formData) => startSubscription(formData?.token),
      onError: (error) => {
        console.error(error);
        setMessage('Não foi possível carregar o pagamento seguro.', 'error');
      },
    },
  });
}

async function startSubscription(cardTokenId) {
  const session = await refreshSession();
  if (!session) {
    setMessage('Entre na sua conta antes de assinar.', 'error');
    return Promise.reject(new Error('missing_session'));
  }
  if (!cardTokenId) {
    setMessage('Não foi possível tokenizar o pagamento.', 'error');
    return Promise.reject(new Error('missing_card_token'));
  }

  setMessage('Enviando assinatura para confirmação segura...');
  const response = await fetch(`${SUPABASE_URL}/functions/v1/billing-start-subscription`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${session.access_token}`,
      apikey: SUPABASE_PUBLISHABLE_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ plan_id: currentPlanId, card_token_id: cardTokenId }),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    setMessage('Não foi possível iniciar a assinatura. Tente novamente ou fale com suporte.', 'error');
    return Promise.reject(new Error(result.code || 'subscription_start_failed'));
  }

  setMessage('Assinatura enviada para confirmação. Abra o Lumina e sincronize sua conta.', 'success');
  window.location.href = '/conta/assinatura/?from=checkout';
  return Promise.resolve();
}

for (const button of planButtons) {
  button.addEventListener('click', async () => {
    currentPlanId = button.dataset.plan;
    updateSelectedPlan();
    try {
      const session = await refreshSession();
      if (!session) {
        setMessage('Entre na sua conta para continuar com este plano.');
        return;
      }
      await mountCardBrick();
    } catch (error) {
      console.error(error);
      setMessage('Não foi possível preparar a assinatura.', 'error');
    }
  });
}

updateSelectedPlan();
refreshSession().then((session) => {
  if (session) mountCardBrick().catch((error) => {
    console.error(error);
    setMessage(`Não foi possível preparar a assinatura (${error?.message || 'erro desconhecido'}).`, 'error');
  });
});
