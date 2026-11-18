[CmdletBinding()]
param(
    [string]$TaskName = "HealthManagerDailyBackup",
    [string]$DailyAt = "03:00",
    [switch]$Remove
)

$ErrorActionPreference = "Stop"

if ($Remove) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Output "Removed scheduled task: $TaskName"
    exit 0
}

if ($DailyAt -notmatch '^([01]\d|2[0-3]):[0-5]\d$') {
    throw "DailyAt must use 24-hour HH:mm format."
}

$backupScript = Join-Path $PSScriptRoot "backup_db.ps1"
$logDir = Join-Path $PSScriptRoot "..\backups\logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$logFile = Join-Path $logDir "daily-backup.log"
$command = "& '$backupScript' *>> '$logFile'"
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -Command `"$command`""
$trigger = New-ScheduledTaskTrigger -Daily -At $DailyAt
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Force | Out-Null
Write-Output "Scheduled daily backup task '$TaskName' at $DailyAt for the current signed-in Windows user."
Write-Output "Backups: $(Join-Path $PSScriptRoot '..\backups\db')"
Write-Output "Log: $(Join-Path $logDir 'daily-backup.log')"
