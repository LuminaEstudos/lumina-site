param()

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path $PSScriptRoot
Set-Location $repoRoot

$requiredDirectories = @(
  "downloads\windows",
  "downloads\windows\versions"
)

foreach ($directory in $requiredDirectories) {
  if (!(Test-Path $directory)) {
    throw "Missing directory: $directory"
  }
}

$index = Get-Content "index.html" -Raw
$testerPage = Get-Content "testar\index.html" -Raw
$privacyPage = Get-Content "privacidade\index.html" -Raw
$termsPage = Get-Content "termos\index.html" -Raw

if ($index -notmatch 'href="downloads/windows/lumina\.appinstaller"') {
  throw "index.html must link to downloads/windows/lumina.appinstaller."
}

if ($index -notmatch '--primary:\s*#a78bfa' -or $index -notmatch '--primary-strong:\s*#8b5cf6') {
  throw "index.html must use Lumina purple tokens."
}

$publicPages = @($index, $testerPage, $privacyPage, $termsPage)

foreach ($text in $publicPages) {
  foreach ($label in @('>Início<', '>Quero testar<', '>Beta fechado<')) {
    if ($text.Contains($label)) {
      throw "Inconsistent navigation/action label found: $label"
    }
  }
}

foreach ($text in $publicPages) {
  if ($text -notmatch '>Download<') {
    throw "All public pages must use Download as the home navigation label."
  }
}

foreach ($text in $publicPages) {
  if ($text -notmatch '>Teste Windows<') {
    throw "All public pages must use Teste Windows as the beta/test navigation label."
  }
}

if ($index -notmatch '>Baixar Lumina para Windows<' -or $testerPage -notmatch '>Baixar Lumina para Windows<') {
  throw "Both main pages must use the same Windows download CTA."
}

$forbidden = @(
  "https://luminaestudos.github.io/lumina-site/",
  "build/windows_publish",
  "build\windows_publish"
)

$files = @(
  "index.html",
  "README.md"
) + @(Get-ChildItem -Recurse -File docs, downloads -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName })

foreach ($file in $files) {
  $text = Get-Content $file -Raw
  foreach ($value in $forbidden) {
    if ($text.Contains($value)) {
      throw "Forbidden value '$value' found in $file."
    }
  }

  $forbiddenRootInstallerPatterns = @(
    'href="/lumina.appinstaller"',
    "href='/lumina.appinstaller'",
    "a.href = '/lumina.appinstaller'",
    'a.href = "/lumina.appinstaller"'
  )

  foreach ($value in $forbiddenRootInstallerPatterns) {
    if ($text.Contains($value)) {
      throw "Forbidden root installer reference '$value' found in $file."
    }
  }
}

Write-Host "Lumina site Windows download test passed." -ForegroundColor Green
