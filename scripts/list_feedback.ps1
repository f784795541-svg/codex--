[CmdletBinding()]
param(
    [int]$Limit = 50
)

$ErrorActionPreference = "Stop"

if ($Limit -lt 1 -or $Limit -gt 200) {
    throw "Limit must be between 1 and 200."
}

$envPath = Join-Path $PSScriptRoot "..\.env"
if (-not (Test-Path -LiteralPath $envPath)) {
    throw "Project .env file was not found."
}

$settings = @{}
Get-Content -LiteralPath $envPath | ForEach-Object {
    if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$') {
        $settings[$matches[1]] = $matches[2].Trim()
    }
}

$token = $settings["MAINTENANCE_TOKEN"]
if ([string]::IsNullOrWhiteSpace($token)) {
    throw "MAINTENANCE_TOKEN is required to view feedback."
}

$port = if ($settings["BACKEND_PORT"]) { $settings["BACKEND_PORT"] } else { "8000" }
$headers = @{ "X-Maintenance-Token" = $token }
Invoke-RestMethod "http://localhost:$port/maintenance/feedback?limit=$Limit" -Headers $headers | Format-Table id, user_id, client_platform, app_version, created_at, content -Wrap
