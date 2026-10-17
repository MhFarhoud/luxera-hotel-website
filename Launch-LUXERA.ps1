$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$nodeDir = Join-Path $PSScriptRoot '.runtime\node-v22.13.0-win-x64'
if (-not (Test-Path (Join-Path $nodeDir 'node.exe'))) {
  New-Item -ItemType Directory -Force '.runtime' | Out-Null
  $zip = Join-Path $PSScriptRoot '.runtime\node.zip'
  Invoke-WebRequest 'https://nodejs.org/dist/v22.13.0/node-v22.13.0-win-x64.zip' -OutFile $zip
  Expand-Archive $zip -DestinationPath '.runtime' -Force
  Remove-Item $zip
}
$env:Path = "$nodeDir;$env:Path"
if (-not (Test-Path '.env.vps')) {
  $alphabet = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  $password = -join (1..28 | ForEach-Object { $alphabet[(Get-Random -Maximum $alphabet.Length)] })
  $salt = New-Object byte[] 16; [Security.Cryptography.RandomNumberGenerator]::Fill($salt)
  $secret = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Fill($secret)
  $derived = [Security.Cryptography.Rfc2898DeriveBytes]::Pbkdf2($password, $salt, 210000, [Security.Cryptography.HashAlgorithmName]::SHA256, 32)
  "ADMIN_USERNAME=luxera-admin`nADMIN_PASSWORD_HASH=$([Convert]::ToHexString($salt).ToLowerInvariant()):$([Convert]::ToHexString($derived).ToLowerInvariant())`nADMIN_SESSION_SECRET=$([Convert]::ToHexString($secret).ToLowerInvariant())" | Set-Content -Encoding ascii '.env.vps'
  Write-Host "Admin username: luxera-admin"
  Write-Host "Admin password: $password"
  Write-Host 'رمز را اکنون ذخیره کنید؛ فقط همین بار نمایش داده می‌شود.'
}
if (-not (Test-Path 'node_modules')) { & (Join-Path $nodeDir 'npm.cmd') ci; if ($LASTEXITCODE -ne 0) { throw 'نصب بسته‌ها ناموفق بود.' } }
& (Join-Path $nodeDir 'npm.cmd') run build
if ($LASTEXITCODE -ne 0) { throw 'ساخت سایت ناموفق بود.' }
Copy-Item '.env.vps' 'dist/server/.dev.vars' -Force
New-Item -ItemType Directory -Force '.data' | Out-Null
if (-not (Test-Path '.data/.migrated')) {
  Get-ChildItem 'drizzle/*.sql' | Sort-Object Name | ForEach-Object {
    & (Join-Path $nodeDir 'node.exe') 'node_modules/wrangler/bin/wrangler.js' d1 execute DB --local --config 'dist/server/wrangler.json' --persist-to '.data' --file $_.FullName
    if ($LASTEXITCODE -ne 0) { throw 'راه‌اندازی پایگاه داده ناموفق بود.' }
  }
  New-Item '.data/.migrated' -ItemType File | Out-Null
}
Start-Process 'http://localhost:8080'
Write-Host 'LUXERA: http://localhost:8080   Admin: http://localhost:8080/admin'
& (Join-Path $nodeDir 'node.exe') 'node_modules/wrangler/bin/wrangler.js' dev --config 'dist/server/wrangler.json' --local --persist-to '.data' --ip 0.0.0.0 --port 8080 --inspector-port 0
