param(
  [string]$SourceDir = "A:\body-food-images",
  [switch]$CheckOnly
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$FrontendDir = Join-Path $Root "frontend\assets\foods"
$MiniprogramDir = Join-Path $Root "miniprogram\assets\foods"
$MiniprogramUtilsDir = Join-Path $Root "miniprogram\utils"
$FrontendManifest = Join-Path $FrontendDir "food-image-assets.js"
$MiniprogramManifest = Join-Path $MiniprogramUtilsDir "foodImageAssets.js"
$AllowedExtensions = @(".webp", ".jpg", ".jpeg", ".png", ".svg")
$PreferredExtensions = @(".webp", ".jpg", ".jpeg", ".png", ".svg")

function Test-SafeAssetName {
  param([string]$Name)
  return $Name -match '^[a-z0-9][a-z0-9-]*\.(webp|jpg|jpeg|png|svg)$'
}

function Get-AssetMap {
  param([string]$Dir)

  $assets = @{}
  if (!(Test-Path -LiteralPath $Dir)) {
    return $assets
  }

  Get-ChildItem -LiteralPath $Dir -File |
    Where-Object { $_.Name -notlike "._*" -and $AllowedExtensions -contains $_.Extension.ToLowerInvariant() } |
    ForEach-Object {
      if (!(Test-SafeAssetName $_.Name)) {
        return
      }
      $key = [IO.Path]::GetFileNameWithoutExtension($_.Name)
      $ext = $_.Extension.ToLowerInvariant()
      if (!$assets.ContainsKey($key)) {
        $assets[$key] = $_.Name
        return
      }
      $currentExt = [IO.Path]::GetExtension($assets[$key]).ToLowerInvariant()
      if ($PreferredExtensions.IndexOf($ext) -lt $PreferredExtensions.IndexOf($currentExt)) {
        $assets[$key] = $_.Name
      }
    }
  return $assets
}

function Write-Manifest {
  param(
    [hashtable]$Assets,
    [string]$FrontendPath,
    [string]$MiniprogramPath
  )

  $ordered = [ordered]@{}
  $Assets.Keys | Sort-Object | ForEach-Object { $ordered[$_] = $Assets[$_] }
  $json = $ordered | ConvertTo-Json -Depth 2
  $frontendContent = "window.FOOD_IMAGE_ASSET_MAP = $json;`n"
  $miniprogramContent = "module.exports = $json;`n"
  [IO.File]::WriteAllText($FrontendPath, $frontendContent, [Text.UTF8Encoding]::new($false))
  [IO.File]::WriteAllText($MiniprogramPath, $miniprogramContent, [Text.UTF8Encoding]::new($false))
}

if (!(Test-Path -LiteralPath $SourceDir)) {
  New-Item -ItemType Directory -Force -Path $SourceDir | Out-Null
  Write-Host "Created source directory: $SourceDir"
  Write-Host "Put authorized real food/product photos here, named like image_key.jpg, image_key.png, or image_key.webp."
}

New-Item -ItemType Directory -Force -Path $FrontendDir, $MiniprogramDir, $MiniprogramUtilsDir | Out-Null

$sourceFiles = Get-ChildItem -LiteralPath $SourceDir -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -notlike "._*" -and $AllowedExtensions -contains $_.Extension.ToLowerInvariant() }

$copied = 0
$skipped = 0
foreach ($file in $sourceFiles) {
  if (!(Test-SafeAssetName $file.Name)) {
    Write-Warning "Skipped unsafe asset name: $($file.Name)"
    $skipped += 1
    continue
  }
  if (!$CheckOnly) {
    Copy-Item -LiteralPath $file.FullName -Destination (Join-Path $FrontendDir $file.Name) -Force
    Copy-Item -LiteralPath $file.FullName -Destination (Join-Path $MiniprogramDir $file.Name) -Force
  }
  $copied += 1
}

if (!$CheckOnly) {
  $assets = Get-AssetMap $FrontendDir
  Write-Manifest -Assets $assets -FrontendPath $FrontendManifest -MiniprogramPath $MiniprogramManifest
} else {
  $assets = Get-AssetMap $FrontendDir
}

$realCount = ($assets.Values | Where-Object { [IO.Path]::GetExtension($_).ToLowerInvariant() -ne ".svg" }).Count
Write-Host "SourceDir=$SourceDir"
Write-Host "Copied=$copied Skipped=$skipped"
Write-Host "ManifestAssets=$($assets.Count) RealPhotoAssets=$realCount"
Write-Host "FrontendManifest=$FrontendManifest"
Write-Host "MiniprogramManifest=$MiniprogramManifest"
