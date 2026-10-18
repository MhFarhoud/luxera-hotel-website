$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$nodeDir = Join-Path $PSScriptRoot '.runtime\node-v22.13.0-win-x64'
if (-not (Test-Path (Join-Path $nodeDir 'node.exe'))) {
  New-Item -ItemType Directory -Force '.runtime' | Out-Null
  $zip = Join-Path $PSScriptRoot '.runtime\node.zip'
  Invoke-WebRequest 'https://nodejs.org/dist/v22.13.0/node-v22.13.0-win-x64.zip' -OutFile $zip -UseBasicParsing
  Expand-Archive $zip -DestinationPath '.runtime' -Force
  Remove-Item $zip
}
$vcInstalled = (Test-Path 'HKLM:\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64') -or (Test-Path 'HKLM:\SOFTWARE\WOW6432Node\Microsoft\VisualStudio\14.0\VC\Runtimes\x64')
if (-not $vcInstalled) {
  Write-Host 'Installing Microsoft Visual C++ Redistributable (required by Cloudflare Workers runtime)...'
  $vcFile = Join-Path $PSScriptRoot '.runtime\vc_redist.x64.exe'
  New-Item -ItemType Directory -Force '.runtime' | Out-Null
  Invoke-WebRequest 'https://aka.ms/vs/17/release/vc_redist.x64.exe' -OutFile $vcFile -UseBasicParsing
  Start-Process $vcFile -ArgumentList '/install', '/quiet', '/norestart' -Wait
  Remove-Item $vcFile -ErrorAction SilentlyContinue
}
$env:Path = "$nodeDir;$env:Path"
if (-not (Test-Path '.env.vps')) {
  $creds = & (Join-Path $nodeDir 'node.exe') -e "const c=require('crypto');const p=c.randomBytes(24).toString('base64url');const s=c.randomBytes(16);console.log(JSON.stringify({password:p,hash:s.toString('hex')+':'+c.pbkdf2Sync(p,s,210000,32,'sha256').toString('hex'),secret:c.randomBytes(32).toString('hex')}))" | ConvertFrom-Json
  $password = $creds.password
  "ADMIN_USERNAME=luxera-admin`nADMIN_PASSWORD_HASH=$($creds.hash)`nADMIN_SESSION_SECRET=$($creds.secret)" | Set-Content -Encoding ascii '.env.vps'
  Write-Host "Admin username: luxera-admin"
  Write-Host "Admin password: $password"
  Write-Host 'Save the password now; it will only be shown once.'
}
if (-not (Test-Path 'node_modules')) { & (Join-Path $nodeDir 'npm.cmd') ci; if ($LASTEXITCODE -ne 0) { throw 'Package installation failed.' } }
& (Join-Path $nodeDir 'npm.cmd') run build
if ($LASTEXITCODE -ne 0) { throw 'Site build failed.' }
Copy-Item '.env.vps' 'dist/server/.dev.vars' -Force
New-Item -ItemType Directory -Force '.data' | Out-Null
if (-not (Test-Path '.data/.migrated')) {
  Get-ChildItem 'drizzle/*.sql' | Sort-Object Name | ForEach-Object {
    & (Join-Path $nodeDir 'node.exe') 'node_modules/wrangler/bin/wrangler.js' d1 execute DB --local --config 'dist/server/wrangler.json' --persist-to '.data' --file $_.FullName
    if ($LASTEXITCODE -ne 0) { throw 'Database setup failed.' }
  }
  New-Item '.data/.migrated' -ItemType File | Out-Null
}
Start-Process 'http://localhost:8080'
Write-Host 'LUXERA: http://localhost:8080   Admin: http://localhost:8080/admin'
& (Join-Path $nodeDir 'node.exe') 'node_modules/wrangler/bin/wrangler.js' dev --config 'dist/server/wrangler.json' --local --persist-to '.data' --ip 0.0.0.0 --port 8080 --inspector-port 0
