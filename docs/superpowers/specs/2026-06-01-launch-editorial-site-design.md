# Preparacao Editorial Para Lojas

Data: 2026-06-01

## Objetivo

Recompor o site Lumina para ficar pronto para lancamento em lojas oficiais, mantendo o estado atual de beta fechado para amigos e testers. A pagina inicial deve apresentar o produto, seus recursos e modelo de planos, com download beta ainda visivel. As paginas legais devem usar linguagem clara, adequada ao Brasil e alinhada a LGPD, CDC e politicas usuais de lojas oficiais.

## Escopo

Paginas alteradas:

- `index.html`
- `preview/index.html`
- `tutoriais/index.html`
- `beta/index.html`
- `teste/index.html`
- `testar/index.html`
- `privacidade/index.html`
- `termos/index.html`
- `cancelamento-reembolso/index.html`

Arquivos auxiliares:

- `style.css`
- `README.md`
- `tools/check-launch-site.mjs`

## Direcao Editorial

A home deve posicionar o Lumina como app de estudos para organizacao de materias, aulas, questoes, revisoes, foco, Pomodoro, progresso e comunidade. A comunicacao deve deixar claro que o app esta em beta fechado, mas que a arquitetura comercial prevista inclui planos Free, Plus e Pro com cobranca direta no app quando o lancamento em loja estiver ativo.

A pagina `beta/` substitui a ideia de `teste/` ou `testar/`. Ela deve orientar amigos e testers sobre instalacao, feedback, cuidados com instaladores/APK e limites de uma versao beta.

`teste/` e `testar/` devem virar redirecionamentos para `beta/`, preservando links antigos.

`privacidade/` deve cobrir dados locais, Supabase, login Google, comunidade, pagamentos, suporte, direitos do titular, exportacao e exclusao de conta.

`termos/` deve cobrir uso do app, elegibilidade, conteudo do usuario, planos, cobranca, lojas oficiais, uso aceitavel, suporte, limitacao de responsabilidade e jurisdicao brasileira.

`cancelamento-reembolso/` deve reunir politicas de cancelamento e reembolso para assinaturas mensais/anuais, compras por loja oficial, compras diretas quando existirem, direito de arrependimento aplicavel, falhas tecnicas, cobrancas indevidas e prazos de analise.

## Requisitos

- Preservar tema visual, cores, animacoes e estrutura geral.
- Trocar a navegacao principal para `Inicio`, `Preview`, `Tutoriais`, `Beta`, `Suporte`.
- Incluir links legais para Privacidade, Termos e Cancelamento/Reembolso.
- Nao afirmar que a Play Store ou App Store ja estao publicas.
- Nao afirmar que a cobranca real esta ativa no beta atual, mas escrever politicas preparadas para o modelo de lancamento.
- Remover referencias a `/testar/` como pagina principal.
- Remover afirmacao de Firebase como unico canal de Android no site publico.
- Manter downloads beta existentes para Windows e Android.
- Sugerir commit: `0.2.4 - preparacao editorial para lojas`.

## Verificacao

- `node --check animation.js`
- `node tools/check-responsive-site.mjs`
- `node tools/check-launch-site.mjs`
- `git diff --check`
- Servir o site localmente e abrir:
  - `/`
  - `/preview/`
  - `/tutoriais/`
  - `/beta/`
  - `/teste/`
  - `/testar/`
  - `/privacidade/`
  - `/termos/`
  - `/cancelamento-reembolso/`

