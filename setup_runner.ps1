$runnerDir = "C:\actions-runner"
New-Item -ItemType Directory -Force -Path $runnerDir | Out-Null

# Download runner
$runnerVersion = "2.325.0"
$url = "https://github.com/actions/runner/releases/download/v$runnerVersion/actions-runner-win-x64-$runnerVersion.zip"
$zip = "$runnerDir\runner.zip"
Write-Host "Downloading runner..."
Invoke-WebRequest -Uri $url -OutFile $zip
Expand-Archive -Path $zip -DestinationPath $runnerDir -Force
Remove-Item $zip

# Configure runner
Set-Location $runnerDir
.\config.cmd --url https://github.com/UsamaMunawar123/Con-CRM --token CEDHAB6CZBV24G3I7BHY5CDKEKEIM --name "local-iis" --labels "local-iis" --work "_work" --unattended --replace

# Install as Windows service
.\svc.cmd install
.\svc.cmd start

Write-Host "Runner installed and started!"
