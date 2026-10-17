$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { throw 'Docker Desktop را نصب و اجرا کنید، سپس دوباره این فایل را باز کنید.' }
docker info | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Docker Desktop در حال اجرا نیست.' }
if (-not (Test-Path '.env.vps')) {
  $pass = -join ((1..28) | ForEach-Object { 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#'[Get-Random -Maximum 62] })
  $salt = -join ((1..32) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })
  $secret = -join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })
  $hash = $pass | node -e "const c=require('crypto');let s='';process.stdin.on('data',x=>s+=x);process.stdin.on('end',()=>console.log(c.pbkdf2Sync(s.trim(),Buffer.from('$salt','hex'),210000,32,'sha256').toString('hex')))"
  "ADMIN_USERNAME=luxera-admin`nADMIN_PASSWORD_HASH=${salt}:${hash}`nADMIN_SESSION_SECRET=${secret}" | Set-Content -Encoding ascii '.env.vps'
  Write-Host "Admin username: luxera-admin"
  Write-Host "Admin password: $pass"
  Write-Host 'رمز را اکنون ذخیره کنید؛ فقط همین بار نمایش داده می‌شود.'
}
docker compose up --build -d
if ($LASTEXITCODE -ne 0) { throw 'راه‌اندازی انجام نشد. خروجی Docker را بررسی کنید.' }
Start-Process 'http://localhost:8080'
Write-Host 'LUXERA: http://localhost:8080   Admin: http://localhost:8080/admin'
Read-Host 'برای بستن این پنجره Enter بزنید'
