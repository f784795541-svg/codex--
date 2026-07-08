[CmdletBinding()]
param(
    [string]$ContainerName = "health_database",
    [string]$OutputDir = "",
    [string]$FileName = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($OutputDir)) {
    $OutputDir = Join-Path $PSScriptRoot "..\backups\db"
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker is not available in PATH."
}

$container = docker ps --filter "name=^/$ContainerName$" --format "{{.Names}}"
if ($container -ne $ContainerName) {
    throw "Container '$ContainerName' is not running."
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
if ([string]::IsNullOrWhiteSpace($FileName)) {
    $FileName = "health_db-$stamp.dump"
}

$backupPath = Join-Path $OutputDir $FileName
$tmpPath = "/tmp/$FileName"

try {
    docker exec $ContainerName sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc -f "$1"' _ $tmpPath
    if ($LASTEXITCODE -ne 0) {
        throw "pg_dump failed."
    }

    docker cp "${ContainerName}:$tmpPath" $backupPath
    if ($LASTEXITCODE -ne 0) {
        throw "docker cp failed."
    }
}
finally {
    docker exec $ContainerName rm -f $tmpPath | Out-Null
}

$file = Get-Item -LiteralPath $backupPath
if ($file.Length -le 0) {
    throw "Backup file was created but is empty: $backupPath"
}

Write-Output "Backup created: $($file.FullName)"
Write-Output "Size bytes: $($file.Length)"
