$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodePath = Join-Path $projectRoot "tools\node\node-v20.19.2-win-x64"
$pythonPath = Join-Path $projectRoot "tools\python"

$env:Path = "$nodePath;$pythonPath;$env:Path"

Write-Host "Local tools activated for this session."
Write-Host "node:   $(& (Join-Path $nodePath 'node.exe') --version)"
Write-Host "python: $(& (Join-Path $pythonPath 'python.exe') --version)"
