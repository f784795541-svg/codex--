[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$BackupPath,
    [string]$ContainerName = "health_database",
    [switch]$ConfirmRestore,
    [string]$ConfirmText = ""
)

$ErrorActionPreference = "Stop"
$requiredText = "RESTORE health_database"

if (-not $ConfirmRestore -or $ConfirmText -ne $requiredText) {
    throw "Restore is destructive for the project database. Re-run with -ConfirmRestore -ConfirmText '$requiredText' only after taking a fresh backup and confirming the target."
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker is not available in PATH."
}

if (-not (Test-Path -LiteralPath $BackupPath)) {
    throw "Backup file not found: $BackupPath"
}

$container = docker ps --filter "name=^/$ContainerName$" --format "{{.Names}}"
if ($container -ne $ContainerName) {
    throw "Container '$ContainerName' is not running."
}

$source = Get-Item -LiteralPath $BackupPath
$tmpPath = "/tmp/restore-$($source.Name)"

try {
    docker cp $source.FullName "${ContainerName}:$tmpPath"
    if ($LASTEXITCODE -ne 0) {
        throw "docker cp failed."
    }

    docker exec $ContainerName sh -c 'pg_restore --list "$1" >/dev/null' _ $tmpPath
    if ($LASTEXITCODE -ne 0) {
        throw "Backup file is not a valid pg_restore custom dump."
    }

    docker exec $ContainerName sh -c @'
set -eu
db="$POSTGRES_DB"
user="$POSTGRES_USER"
psql -U "$user" -d postgres -v ON_ERROR_STOP=1 -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$db' AND pid <> pg_backend_pid();"
dropdb -U "$user" --if-exists "$db"
createdb -U "$user" -O "$user" "$db"
pg_restore -U "$user" -d "$db" --no-owner --role="$user" "$1"
'@ _ $tmpPath

    if ($LASTEXITCODE -ne 0) {
        throw "Restore failed."
    }
}
finally {
    docker exec $ContainerName rm -f $tmpPath | Out-Null
}

Write-Output "Restore completed from: $($source.FullName)"
