# Área De Conta, Login E Assinatura Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar login, conta e assinatura em um fluxo profissional com página de login única, painel `/conta/` e páginas protegidas sem formulários inline.

**Architecture:** O site continua estático, usando Supabase Auth no navegador e Edge Functions para assinatura/status. A autenticação fica centralizada em `/login/`; páginas protegidas começam verificando sessão e redirecionam quando necessário. O estado de assinatura vem de `billing-subscription-status` e o checkout Mercado Pago continua em `/assinatura/`.

**Tech Stack:** HTML estático, CSS compartilhado em `style.css`, JavaScript modules, Supabase JS v2, Mercado Pago.js/Bricks.

---

### Task 1: Criar utilitário compartilhado de autenticação

**Files:**
- Create: `assets/js/site-auth.js`
- Modify: `login/login.js`
- Modify: `assinatura/billing.js`
- Modify: `conta/assinatura/account.js`

- [ ] **Step 1:** Criar cliente Supabase compartilhado com `createLuminaSupabaseClient()`.
- [ ] **Step 2:** Criar `safeRedirectPath()` para aceitar apenas URLs internas.
- [ ] **Step 3:** Criar `redirectToLogin(redirectPath)` e `signOutAndRedirect()`.
- [ ] **Step 4:** Trocar duplicação de URL/key nas páginas por imports do utilitário.
- [ ] **Step 5:** Rodar `node --check` nos scripts alterados.

### Task 2: Criar painel `/conta/`

**Files:**
- Create: `conta/index.html`
- Create: `conta/account.js`
- Modify: `style.css`

- [ ] **Step 1:** Criar layout de painel com resumo da conta, plano atual, ações e suporte.
- [ ] **Step 2:** Se não houver sessão, mostrar “Verificando sessão...” e redirecionar para `/login/?redirect=/conta/`.
- [ ] **Step 3:** Se houver sessão, chamar `billing-subscription-status` e renderizar plano/status.
- [ ] **Step 4:** Implementar botão `Sair` com `supabase.auth.signOut()`.
- [ ] **Step 5:** Validar `/conta/` no servidor local.

### Task 3: Profissionalizar `/login/`

**Files:**
- Modify: `login/index.html`
- Modify: `login/login.js`
- Modify: `style.css`

- [ ] **Step 1:** Manter apenas login dedicado com email/senha e link mágico.
- [ ] **Step 2:** Após login, mostrar confirmação clara e redirecionar para `redirect`.
- [ ] **Step 3:** Se já houver sessão, redirecionar para `redirect` ou `/conta/`.
- [ ] **Step 4:** Validar `/login/` localmente.

### Task 4: Ajustar assinatura e gerenciamento

**Files:**
- Modify: `assinatura/index.html`
- Modify: `assinatura/billing.js`
- Modify: `conta/assinatura/index.html`
- Modify: `conta/assinatura/account.js`

- [ ] **Step 1:** `/assinatura/` sem formulário inline; se não logado, mostrar planos e CTA `Entrar para assinar`.
- [ ] **Step 2:** `/assinatura/` logado mostra planos e Brick Mercado Pago.
- [ ] **Step 3:** `/conta/assinatura/` sem sessão redireciona para login sem botão inline.
- [ ] **Step 4:** `/conta/assinatura/` logado mostra plano/status e botão de cancelar só quando aplicável.
- [ ] **Step 5:** Validar HTML servido localmente.

### Task 5: Header e verificação final

**Files:**
- Modify: todos os headers com `nav-account`

- [ ] **Step 1:** Alterar ícone de perfil para `/conta/`.
- [ ] **Step 2:** Rodar `node --check login/login.js assinatura/billing.js conta/account.js conta/assinatura/account.js`.
- [ ] **Step 3:** Verificar `curl` de `/login/`, `/conta/`, `/assinatura/` e `/conta/assinatura/`.
- [ ] **Step 4:** Testar preflight CORS das Edge Functions usadas por localhost.

## Self-review

- Cobertura: login dedicado, conta principal, assinatura, gerenciamento, header e estados de sessão estão cobertos.
- Placeholders: nenhum campo aberto; os caminhos e comandos estão explícitos.
- Consistência: os nomes propostos usam `site-auth.js`, `/conta/`, `/login/`, `/assinatura/` e `/conta/assinatura/` em todos os passos.
