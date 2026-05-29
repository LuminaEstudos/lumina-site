# Windows Downloads

Este repo hospeda os arquivos publicos do Lumina Windows beta pelo dominio:

```text
https://www.luminaestudos.com.br/
```

## Origem Dos Arquivos

Gere os artefatos no app repo `LuminaEstudos/lumina`:

```powershell
.\tools\lumina_prepare_windows_site_release.ps1 -Force
```

A pasta de staging criada no app repo e:

```text
build/lumina_site_windows_release/
```

## Onde Copiar

Copie a pasta `downloads` gerada no app repo para a raiz deste repo:

```powershell
Copy-Item -Recurse -Force `
  <app-repo>\build\lumina_site_windows_release\downloads `
  <site-repo>\
```

Depois confirme estes caminhos no site repo:

```text
downloads/windows/lumina.appinstaller
downloads/windows/manifest.json
downloads/windows/versions/lumina_<msixVersion>.msix
```

## URLs Publicas Esperadas

Depois do deploy, estas URLs devem responder sem 404:

```text
https://www.luminaestudos.com.br/downloads/windows/lumina.appinstaller
https://www.luminaestudos.com.br/downloads/windows/manifest.json
https://www.luminaestudos.com.br/downloads/windows/versions/lumina_<msixVersion>.msix
```

## Regras

- O botao principal do site deve apontar para
  `downloads/windows/lumina.appinstaller`.
- Nao use link raiz para `lumina.appinstaller`.
- Nao use GitHub Pages como URL publica final.
- Nao publique certificados privados, senhas, tokens ou secrets.
- Nao dependa de backend para servir os arquivos.
