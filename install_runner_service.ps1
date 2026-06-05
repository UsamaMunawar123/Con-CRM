$serviceName = "actions.runner.UsamaMunawar123-Con-CRM.local-iis"
$exePath = "C:\actions-runner\bin\RunnerService.exe"

# Create the service
New-Service -Name $serviceName -DisplayName "GitHub Actions Runner (local-iis)" -BinaryPathName $exePath -StartupType Automatic -ErrorAction Stop

# Set working directory via registry
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\$serviceName" -Name "AppDirectory" -Value "C:\actions-runner"

# Start the service
Start-Service -Name $serviceName

Write-Host "Service status: $((Get-Service -Name $serviceName).Status)"
