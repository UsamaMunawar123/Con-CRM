Set-Location "C:\actions-runner"
.\svc.cmd install
.\svc.cmd start
Write-Host "Service status:"
.\svc.cmd status
