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

O script tambem copia automaticamente `downloads/windows/` para este repo em
`C:\Dev\lumina-site`.

## Caminhos Esperados

Depois de uma release, confirme estes caminhos no site repo:

```text
downloads/windows/LuminaSetup.exe
downloads/windows/manifest.json
downloads/windows/releases/
```

## URLs Publicas Esperadas

Depois do deploy, estas URLs devem responder sem 404:

```text
https://www.luminaestudos.com.br/downloads/windows/LuminaSetup.exe
https://www.luminaestudos.com.br/downloads/windows/manifest.json
https://www.luminaestudos.com.br/downloads/windows/releases/releases.win.json
```

## Regras

- O botao principal do site deve apontar para
  `downloads/windows/LuminaSetup.exe`.
- Nao use GitHub Pages como URL publica final.
- Nao publique certificados privados, senhas, tokens ou secrets.
- Nao dependa de backend para servir os arquivos.
