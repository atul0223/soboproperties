# Run in a terminal with access to npm and GitHub.
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)
function Invoke-Checked {
  param([string]$Executable, [string[]]$Arguments)
  & $Executable @Arguments
  if ($LASTEXITCODE -ne 0) { throw "$Executable failed with exit code $LASTEXITCODE" }
}
Invoke-Checked 'npx.cmd' @('--yes', 'skills', 'add', 'https://github.com/vercel-labs/agent-skills', '--skill', 'web-design-guidelines', '--agent', 'codex', '--yes')
# Leonxlnx/taste returns 404; the author's public repo is taste-skill.
Invoke-Checked 'npx.cmd' @('--yes', 'skills', 'add', 'Leonxlnx/taste-skill', '--skill', 'design-taste-frontend', '--agent', 'codex', '--yes')
Invoke-Checked 'npm.cmd' @('install', '-g', 'ui-ux-pro-max-cli', '--prefix', "$PWD/.tools")
Invoke-Checked 'npx.cmd' @('--yes', 'getdesign@latest', 'add', 'clau')
