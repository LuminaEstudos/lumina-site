$ErrorActionPreference = "Stop"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$path = ".\patches\apply_v_site_1_test_landing.ps1"

if (!(Test-Path $path)) {
  throw "Script nao encontrado: $path"
}

$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Garante que o script rode a partir da raiz do repo,
# mesmo se for chamado de outro lugar.
if (!$content.Contains('Set-Location $siteRoot')) {
  $prefix = @(
    '$ErrorActionPreference = "Stop"',
    '$siteRoot = Resolve-Path (Join-Path $PSScriptRoot "..")',
    'Set-Location $siteRoot',
    ''
  ) -join "`r`n"

  $content = $prefix + $content
}

# $home conflita com a variavel reservada $HOME do PowerShell.
$content = $content.Replace('$home = "$BasePrefix/"', '$homeLink = "$BasePrefix/"')
$content = $content.Replace('href=""$home""', 'href=""$homeLink""')

[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)

Write-Host "Script v-site.1 corrigido. Rodando novamente..." -ForegroundColor Cyan

& $path

Write-Host "Script v-site.1 executado com sucesso." -ForegroundColor Green
