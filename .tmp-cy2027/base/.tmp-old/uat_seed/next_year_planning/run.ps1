$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here
python (Join-Path $here "run.py")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Done. Open Planning and generate the 53-week plan from the UI."
