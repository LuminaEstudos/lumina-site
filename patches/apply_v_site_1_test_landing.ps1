$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Read-Utf8File($path) {
  if (!(Test-Path $path)) {
    return ""
  }

  return [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
}

function Write-Utf8File($path, $content) {
  $dir = Split-Path $path
  if ($dir -and !(Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }

  [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
}

function LuminaPage {
  param(
    [string]$Title,
    [string[]]$BodyLines,
    [string]$BasePrefix = "."
  )

  $home = "$BasePrefix/"
  $testar = "$BasePrefix/testar/"
  $privacidade = "$BasePrefix/privacidade/"
  $termos = "$BasePrefix/termos/"

  $lines = @(
'<!doctype html>',
'<html lang="pt-BR">',
'<head>',
'  <meta charset="utf-8">',
'  <meta name="viewport" content="width=device-width, initial-scale=1">',
"  <title>$Title - Lumina</title>",
'  <meta name="description" content="Lumina e um app de estudos com foco, Pomodoro, questoes, revisao e dashboard.">',
'  <meta name="theme-color" content="#7c3aed">',
'  <style>',
'    :root {',
'      color-scheme: dark;',
'      --bg: #080711;',
'      --surface: #12101f;',
'      --surface-strong: #1b1830;',
'      --text: #f5f3ff;',
'      --muted: #b8b3cf;',
'      --faint: #8d86a7;',
'      --primary: #a78bfa;',
'      --primary-strong: #8b5cf6;',
'      --green: #34d399;',
'      --amber: #fbbf24;',
'      --border: rgba(255,255,255,.12);',
'    }',
'    * { box-sizing: border-box; }',
'    body {',
'      margin: 0;',
'      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
'      background:',
'        radial-gradient(circle at top left, rgba(124, 58, 237, .30), transparent 34rem),',
'        radial-gradient(circle at bottom right, rgba(167, 139, 250, .16), transparent 28rem),',
'        var(--bg);',
'      color: var(--text);',
'      line-height: 1.65;',
'    }',
'    a { color: var(--primary); text-decoration: none; }',
'    a:hover { text-decoration: underline; }',
'    .wrap { max-width: 1080px; margin: 0 auto; padding: 28px 18px 56px; }',
'    header {',
'      display: flex;',
'      align-items: center;',
'      justify-content: space-between;',
'      gap: 18px;',
'      margin-bottom: 24px;',
'    }',
'    .brand { display: flex; align-items: center; gap: 12px; color: var(--text); }',
'    .logo {',
'      width: 42px; height: 42px;',
'      border-radius: 14px;',
'      display: grid;',
'      place-items: center;',
'      background: linear-gradient(135deg, rgba(167,139,250,.34), rgba(124,58,237,.18));',
'      border: 1px solid rgba(167,139,250,.42);',
'      box-shadow: 0 0 32px rgba(124,58,237,.22);',
'      font-weight: 900;',
'    }',
'    nav { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }',
'    nav a { color: var(--muted); font-weight: 800; font-size: 14px; }',
'    nav .nav-cta {',
'      color: white;',
'      padding: 8px 12px;',
'      border-radius: 999px;',
'      background: linear-gradient(135deg, var(--primary), var(--primary-strong));',
'      box-shadow: 0 12px 34px rgba(124,58,237,.22);',
'    }',
'    .hero, main, .panel {',
'      background: linear-gradient(180deg, rgba(27,24,48,.88), rgba(18,16,31,.78));',
'      border: 1px solid var(--border);',
'      border-radius: 26px;',
'      padding: clamp(22px, 4vw, 42px);',
'      box-shadow: 0 22px 70px rgba(0,0,0,.28);',
'    }',
'    .hero-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(280px, .75fr); gap: 18px; align-items: stretch; }',
'    h1 { margin: 0 0 12px; font-size: clamp(34px, 6vw, 62px); line-height: .98; letter-spacing: -.045em; }',
'    h2 { margin: 32px 0 10px; font-size: 24px; line-height: 1.2; letter-spacing: -.02em; }',
'    h3 { margin: 0 0 8px; font-size: 17px; }',
'    p, li { color: var(--muted); }',
'    .lead { font-size: 18px; max-width: 760px; }',
'    .pill {',
'      display: inline-flex;',
'      align-items: center;',
'      gap: 8px;',
'      padding: 8px 12px;',
'      border-radius: 999px;',
'      background: rgba(167,139,250,.14);',
'      border: 1px solid rgba(167,139,250,.28);',
'      color: var(--primary);',
'      font-size: 13px;',
'      font-weight: 900;',
'      margin-bottom: 18px;',
'    }',
'    .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }',
'    .button {',
'      display: inline-flex;',
'      align-items: center;',
'      justify-content: center;',
'      min-height: 46px;',
'      padding: 12px 16px;',
'      border-radius: 14px;',
'      font-weight: 900;',
'      border: 1px solid rgba(255,255,255,.12);',
'    }',
'    .button.primary { color: white; background: linear-gradient(135deg, var(--primary), var(--primary-strong)); box-shadow: 0 18px 46px rgba(124,58,237,.28); }',
'    .button.secondary { color: var(--text); background: rgba(255,255,255,.055); }',
'    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-top: 24px; }',
'    .card { padding: 18px; border-radius: 18px; background: rgba(255,255,255,.045); border: 1px solid var(--border); }',
'    .card strong { color: var(--text); display: block; margin-bottom: 6px; }',
'    .phone {',
'      min-height: 100%;',
'      border-radius: 28px;',
'      border: 1px solid rgba(167,139,250,.28);',
'      background:',
'        radial-gradient(circle at top, rgba(167,139,250,.18), transparent 18rem),',
'        rgba(8,7,17,.62);',
'      padding: 18px;',
'      display: grid;',
'      align-content: center;',
'      gap: 12px;',
'    }',
'    .mock-row { height: 12px; border-radius: 999px; background: rgba(255,255,255,.10); }',
'    .mock-card { border-radius: 18px; padding: 16px; background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.10); }',
'    .status { color: var(--green); font-weight: 900; }',
'    .warning { color: var(--amber); font-weight: 900; }',
'    .steps { counter-reset: step; display: grid; gap: 12px; margin-top: 18px; }',
'    .step { display: grid; grid-template-columns: 34px 1fr; gap: 12px; align-items: start; padding: 16px; border-radius: 18px; background: rgba(255,255,255,.045); border: 1px solid var(--border); }',
'    .step:before { counter-increment: step; content: counter(step); width: 34px; height: 34px; border-radius: 999px; display: grid; place-items: center; background: rgba(167,139,250,.16); color: var(--primary); font-weight: 900; }',
'    footer { margin-top: 28px; color: var(--faint); font-size: 13px; text-align: center; }',
'    @media (max-width: 800px) { .hero-grid { grid-template-columns: 1fr; } }',
'    @media (max-width: 640px) { header { align-items: flex-start; flex-direction: column; } nav { gap: 10px; } .actions { flex-direction: column; } .button { width: 100%; } }',
'  </style>',
'</head>',
'<body>',
'  <div class="wrap">',
'    <header>',
"      <a class=""brand"" href=""$home"">",
'        <span class="logo">L</span>',
'        <span>',
'          <strong style="display:block;color:var(--text)">Lumina</strong>',
'          <span style="color:var(--muted);font-size:13px">App de estudos</span>',
'        </span>',
'      </a>',
'      <nav>',
"        <a href=""$home"">Download</a>",
"        <a class=""nav-cta"" href=""$testar"">Teste Windows</a>",
"        <a href=""$privacidade"">Privacidade</a>",
"        <a href=""$termos"">Termos</a>",
'        <a href="mailto:luminaestudos.app@gmail.com">Suporte</a>',
'      </nav>',
'    </header>'
  )

  $lines += $BodyLines

  $lines += @(
'    <footer>',
'      Lumina Estudos - luminaestudos.app@gmail.com',
'    </footer>',
'  </div>',
'</body>',
'</html>'
  )

  return ($lines -join "`r`n")
}

$homeBody = @(
'    <section class="hero">',
'      <div class="hero-grid">',
'        <div>',
'          <span class="pill">Acesso beta</span>',
'          <h1>Estude com mais foco, clareza e ritmo.</h1>',
'          <p class="lead">Lumina e um app de estudos com materias, aulas, questoes, revisoes, Pomodoro, dashboard e uma experiencia escura pensada para longos periodos de estudo.</p>',
'          <div class="actions">',
'            <a class="button primary" href="downloads/windows/lumina.appinstaller">Baixar Lumina para Windows</a>',
'            <a class="button secondary" href="mailto:luminaestudos.app@gmail.com?subject=Quero%20testar%20o%20Lumina&body=Ola!%20Quero%20testar%20o%20Lumina.%0A%0AMeu%20email%20para%20convite%20Firebase%20e:%0A%0AMeu%20celular%20e:%20Android">Pedir convite por email</a>',
'          </div>',
'        </div>',
'        <aside class="phone" aria-label="Resumo visual do Lumina">',
'          <div class="mock-card">',
'            <strong>Dashboard de estudos</strong>',
'            <p>Veja progresso, foco e desempenho em uma interface limpa.</p>',
'            <div class="mock-row" style="width:88%"></div>',
'            <div class="mock-row" style="width:62%;margin-top:10px"></div>',
'          </div>',
'          <div class="mock-card">',
'            <strong>Pomodoro integrado</strong>',
'            <p>Inicie, pause e mantenha seu ritmo de estudo.</p>',
'          </div>',
'          <div class="mock-card">',
'            <strong class="status">Premium sem cobranca real</strong>',
'            <p>Nesta fase, a tela Premium serve apenas para validar interesse.</p>',
'          </div>',
'        </aside>',
'      </div>',
'      <div class="cards">',
'        <div class="card"><strong>Organizacao</strong><p>Estruture materias, aulas e questoes em um fluxo simples.</p></div>',
'        <div class="card"><strong>Foco</strong><p>Use Pomodoro e sessoes de estudo para manter constancia.</p></div>',
'        <div class="card"><strong>Evolucao</strong><p>Acompanhe dashboard, revisoes e desempenho ao longo do tempo.</p></div>',
'      </div>',
'    </section>'
)

$testBody = @(
'    <main>',
'      <span class="pill">Acesso beta</span>',
'      <h1>Teste Windows do Lumina</h1>',
'      <p class="lead">Testers convidados podem instalar a versao Windows pelo site oficial. O Android continua por convite separado enquanto o beta e validado.</p>',
'',
'      <div class="actions">',
'        <a class="button primary" href="../">Baixar Lumina para Windows</a>',
'        <a class="button secondary" href="mailto:luminaestudos.app@gmail.com?subject=Solicitar%20acesso%20Android%20Lumina&body=Ola!%20Quero%20testar%20o%20Lumina%20no%20Android.%0A%0AMeu%20email%20para%20convite%20Firebase%20e:%0A%0AObservacao:">Solicitar acesso Android</a>',
'        <a class="button secondary" href="../privacidade/">Privacidade</a>',
'      </div>',
'',
'      <h2>Como funciona</h2>',
'      <div class="steps">',
'        <div class="step"><div><h3>Peça o convite</h3><p>Envie um email informando que quer testar o Lumina e qual email deve receber o convite.</p></div></div>',
'        <div class="step"><div><h3>Receba pelo Firebase</h3><p>Voce recebe um convite do Firebase App Distribution para instalar a versao de teste.</p></div></div>',
'        <div class="step"><div><h3>Teste os fluxos principais</h3><p>Abra dashboard, Pomodoro, materias, aulas, questoes, revisao, configuracoes e Premium.</p></div></div>',
'        <div class="step"><div><h3>Envie feedback</h3><p>Use Configuracoes > Feedback de teste dentro do app ou responda por email com prints e observacoes.</p></div></div>',
'      </div>',
'',
'      <h2>Importante</h2>',
'      <div class="cards">',
'        <div class="card"><strong class="warning">Premium nao cobra nada</strong><p>A tela Premium existe para validar interesse. Nenhum pagamento real esta ativo nesta versao.</p></div>',
'        <div class="card"><strong>Android primeiro</strong><p>Neste momento, o teste e focado em Android. Versoes Windows ou web podem vir depois.</p></div>',
'        <div class="card"><strong>Alternativa manual</strong><p>Se o Firebase nao funcionar, posso enviar um APK de teste por link privado.</p></div>',
'      </div>',
'',
'      <h2>O que testar</h2>',
'      <ul>',
'        <li>O app abre normalmente?</li>',
'        <li>O login funciona?</li>',
'        <li>Dashboard e menu ficam bons no celular?</li>',
'        <li>Pomodoro inicia, pausa e reseta?</li>',
'        <li>Materias, aulas e questoes funcionam?</li>',
'        <li>Revisao e configuracoes abrem corretamente?</li>',
'        <li>A tela Premium esta clara e sem parecer cobranca ativa?</li>',
'      </ul>',
'    </main>'
)

Write-Utf8File "index.html" (LuminaPage -Title "Download" -BodyLines $homeBody -BasePrefix ".")
Write-Utf8File "testar\index.html" (LuminaPage -Title "Teste Windows" -BodyLines $testBody -BasePrefix "..")

# Atualiza nav nas paginas legais existentes de forma simples.
$internalFiles = @("privacidade\index.html", "termos\index.html")
foreach ($file in $internalFiles) {
  $content = Read-Utf8File $file

  if (!$content.Contains('href="../testar/"')) {
    $content = $content.Replace(
      '<a href="../">Download</a>',
      '<a href="../">Download</a>' + "`r`n" + '        <a href="../testar/">Teste Windows</a>'
    )
  }

  Write-Utf8File $file $content
}

$readme = @(
'# Lumina Site',
'',
'Site institucional e legal do Lumina.',
'',
'## Paginas',
'',
'- Download',
'- Teste Windows',
'- Privacidade',
'- Termos',
'',
'## URL',
'',
'https://www.luminaestudos.com.br/'
)

Write-Utf8File "README.md" ($readme -join "`r`n")

Write-Host "Patch v-site.1 aplicado com sucesso."
