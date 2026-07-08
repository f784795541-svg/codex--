[CmdletBinding()]
param(
    [int]$UserId = 0,
    [string]$BackendUrl = "http://localhost:8000",
    [string]$FrontendUrl = "http://localhost:8080"
)

$ErrorActionPreference = "Stop"

function Invoke-Check {
    param(
        [string]$Name,
        [scriptblock]$Action
    )
    try {
        $result = & $Action
        [pscustomobject]@{ name = $Name; ok = $true; result = $result }
    } catch {
        [pscustomobject]@{ name = $Name; ok = $false; result = $_.Exception.Message }
    }
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker is not available in PATH."
}

$checks = @()

$checks += Invoke-Check "docker containers" {
    docker ps --filter "name=health_" --format "{{.Names}} {{.Status}}" | Out-String
}

$checks += Invoke-Check "backend /health" {
    curl.exe -s "$BackendUrl/health"
}

$checks += Invoke-Check "frontend /" {
    $status = curl.exe -s -o NUL -w "%{http_code}" "$FrontendUrl/"
    if ($status -ne "200") {
        throw "frontend returned HTTP $status"
    }
    "HTTP 200"
}

$checks += Invoke-Check "food search" {
    $status = curl.exe -s -o NUL -w "%{http_code}" "$BackendUrl/food/search?q=%E7%B1%B3%E9%A5%AD&limit=1"
    if ($status -ne "200") {
        throw "food search returned HTTP $status"
    }
    "HTTP 200"
}

if ($UserId -le 0) {
    $postgresUser = (docker exec health_database printenv POSTGRES_USER).Trim()
    $postgresDb = (docker exec health_database printenv POSTGRES_DB).Trim()
    $candidateUserId = docker exec health_database psql -U $postgresUser -d $postgresDb -tAc "SELECT id FROM users ORDER BY id LIMIT 1;"
    $candidateUserId = if ($null -eq $candidateUserId) { "" } else { $candidateUserId.Trim() }
    if ($LASTEXITCODE -eq 0 -and $candidateUserId) {
        $UserId = [int]$candidateUserId
    }
}

if ($UserId -gt 0) {
    $checks += Invoke-Check "dashboard summary" {
        $status = curl.exe -s -o NUL -w "%{http_code}" "$BackendUrl/dashboard/summary?user_id=$UserId"
        if ($status -ne "200") {
            throw "dashboard summary returned HTTP $status"
        }
        "HTTP 200 user_id=$UserId"
    }
} else {
    $checks += [pscustomobject]@{ name = "dashboard summary"; ok = $false; result = "No user found for dashboard check." }
}

$checks += Invoke-Check "backend recent 500 logs" {
    $logs = cmd.exe /c "docker logs --tail 200 health_backend 2>&1" | ForEach-Object { "$_" }
    $matches = $logs | Where-Object { $_ -match " 500 |Traceback|ERROR" }
    if ($matches) {
        throw (($matches | Select-Object -First 5) -join "`n")
    }
    "No recent 500/Traceback/ERROR in last 200 lines"
}

$checks | Format-Table -AutoSize

if ($checks | Where-Object { -not $_.ok }) {
    exit 1
}
