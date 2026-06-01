# Responsividade mobile do site Lumina

Data: 2026-06-01

## Objetivo

Criar uma versão otimizada para mobile em todas as páginas do site Lumina, mantendo a mesma identidade visual da versão desktop. A mudança deve preservar cores, tema, tipografia geral, animações e composição visual existente, ajustando apenas o comportamento responsivo para cada tamanho de tela.

## Escopo

Páginas cobertas:

- `index.html`
- `preview/index.html`
- `tutoriais/index.html`
- `testar/index.html`
- `privacidade/index.html`
- `termos/index.html`

Arquivos principais:

- `style.css`, por ser a folha compartilhada entre as páginas.
- `animation.js`, somente para corrigir a sintaxe atual que impede a execução do script externo.
- HTML apenas se algum ajuste mínimo for necessário para responsividade ou acessibilidade, sem reescrever conteúdo.

## Requisitos

- O site deve manter o mesmo visual em desktop e mobile.
- Cores, tema e animações existentes não devem ser redesenhados.
- A versão mobile deve evitar overflow horizontal indesejado.
- Navegação, botões, cards, textos longos, blocos de terminal, imagens e páginas legais devem se adaptar a telas estreitas.
- O menu principal deve continuar acessível em telas pequenas, preferencialmente como navegação horizontal rolável.
- O sumário da página de tutoriais deve continuar utilizável em tablet/mobile.
- A página Preview deve preservar screenshots, abas e lightbox.
- A versão desktop não deve perder espaçamento, hierarquia ou layout atual.

## Abordagem escolhida

Usar responsividade global em `style.css`, com breakpoints já alinhados ao projeto:

- Desktop: preservar layout atual.
- Até `960px`: empilhar áreas de hero e layouts amplos, manter grids em até duas colunas e adaptar o sumário de tutoriais.
- Até `680px`: usar uma coluna, botões em largura total, menu horizontal rolável, paddings menores e quebras seguras para conteúdo longo.
- Tamanhos muito estreitos: garantir leitura e toque confortável sem alterar identidade visual.

Essa abordagem reduz mudanças por página e mantém consistência porque o CSS é compartilhado.

## Componentes afetados

### Header e navegação

No mobile, o header deve empilhar marca e navegação. A navegação deve permanecer horizontal e rolável quando não couber, mantendo os estilos atuais dos links.

### Hero e seções

Os blocos hero devem passar de grid em duas colunas para coluna única quando a largura for pequena. O alinhamento pode ser centralizado nos pontos em que o CSS já faz isso, mantendo a mesma ordem visual.

### Cards, passos e grids

Grids de três colunas devem passar para duas colunas em tablet e uma coluna no mobile. Cards devem reduzir padding em telas pequenas sem mudar cores, bordas, sombras ou hover.

### Conteúdo técnico e legal

Textos longos, `code`, release lines, e-mails e URLs devem quebrar linha de forma segura. As páginas legais devem manter o card principal, mas com padding e largura adequados para leitura mobile.

### Preview e tutoriais

Screenshots e containers devem limitar largura ao viewport. Abas do dashboard devem permitir rolagem horizontal se necessário. O sumário de tutoriais deve continuar horizontal em tablet/mobile e não deve causar pulos verticais durante atualização de item ativo.

### JavaScript

`animation.js` está com erro de sintaxe (`Unexpected end of input`). A correção deve apenas fechar os blocos abertos do observador do sumário e do alternador de tabs, preservando comportamento, animações e tempos atuais. O ajuste no scroll ativo do sumário pode usar `scrollTo` no próprio container para evitar deslocamento vertical inesperado, sem alterar animações.

## Testes e verificação

Verificações mínimas:

- `node --check animation.js`
- Servir o site localmente e abrir:
  - `/`
  - `/preview/`
  - `/tutoriais/`
  - `/testar/`
  - `/privacidade/`
  - `/termos/`
- Verificar desktop e mobile com viewport real/simulada.
- Confirmar que não há scroll horizontal indesejado no body.
- Confirmar que menu, tabs, botões, lightbox, copiar prompt e scroll reveal continuam funcionais.

## Versão de commit sugerida

`0.2.3 - responsividade mobile do site`
