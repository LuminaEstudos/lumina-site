param()

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path $PSScriptRoot
Set-Location $repoRoot

$requiredDirectories = @(
  "downloads\windows",
  "downloads\windows\releases"
)

foreach ($directory in $requiredDirectories) {
  if (!(Test-Path $directory)) {
    throw "Missing directory: $directory"
  }
}

$index = Get-Content "index.html" -Raw
$style = Get-Content "style.css" -Raw
$testerPage = Get-Content "testar\index.html" -Raw
$previewPage = Get-Content "preview\index.html" -Raw
$tutorialsPage = Get-Content "tutoriais\index.html" -Raw
$privacyPage = Get-Content "privacidade\index.html" -Raw
$termsPage = Get-Content "termos\index.html" -Raw

if ($index -notmatch 'href="downloads/windows/LuminaSetup\.exe"') {
  throw "index.html must link to downloads/windows/LuminaSetup.exe."
}

$designText = "$index`n$style"
if ($designText -notmatch '--primary:\s*#a78bfa') {
  throw "Site styles must define the Lumina primary purple token."
}

if ($designText -notmatch '--primary-strong:\s*#(8b5cf6|7c3aed)') {
  throw "Site styles must define a Lumina strong purple token."
}

$publicPages = @($index, $testerPage, $previewPage, $tutorialsPage, $privacyPage, $termsPage)

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
  ("https://luminaestudos.github.io/" + "lumina-site/"),
  ("build/windows_" + "publish"),
  ("build\windows_" + "publish"),
  ("lumina." + "app" + "installer"),
  (".m" + "six")
)

$files = @(
  "index.html",
  "README.md",
  "style.css",
  "animation.js"
) + @(Get-ChildItem -Recurse -File docs, downloads, preview, privacidade, termos, testar, tutoriais -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName })

foreach ($file in $files) {
  $text = Get-Content $file -Raw
  foreach ($value in $forbidden) {
    if ($text.Contains($value)) {
      throw "Forbidden value '$value' found in $file."
    }
  }
}

Write-Host "Lumina site Windows download test passed." -ForegroundColor Green
