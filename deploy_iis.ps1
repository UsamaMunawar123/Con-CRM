Copy-Item -Path "D:\Con-CRM\*.jsx" -Destination "C:\inetpub\wwwroot\Con-CRM\"
Add-WebConfigurationProperty -PSPath "IIS:\" -Filter "system.webServer/staticContent" -Name "." -Value @{fileExtension=".jsx"; mimeType="text/javascript"} -ErrorAction SilentlyContinue
iisreset /noforce
