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

if ($index -notmatch 'href="downloads/windows/lumina\.appinstaller"') {
  throw "index.html must link to downloads/windows/lumina.appinstaller."
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
