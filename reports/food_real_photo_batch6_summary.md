# Batch 6: FamilyMart Runtime Real Photos (Partial)

## Scope

- Goal: start the live runtime FamilyMart batch without forcing mismatched images into the remaining unresolved keys.
- Runtime-visible targets checked first:
  - `familymart-693` `全家 韩式泡菜饭团`
  - `familymart-227` `全家 烤鸡胸饭团`
  - `familymart-418` `全家 溏心蛋饭团`
  - `familymart-519` `全家 金枪鱼三明治`

## Completed in this batch

1. `familymart-227`
   - Replaced with official FamilyMart TW fresh-food product image.
   - Source product name: `柚香雞胸五穀飯糰`
2. `familymart-693`
   - Replaced with official FamilyMart TW fresh-food product image.
   - Source product name: `大飯糰泡菜鮪魚`

## Deliberately left unresolved in this batch

1. `familymart-418` `全家 溏心蛋饭团`
2. `familymart-519` `全家 金枪鱼三明治`

Reason:

- Exact or strongly corresponding official-public images were not yet locked in a stable downloadable form.
- Closest currently accessible official sandwich image was `五彩鲜蔬三明治`, which is visually cleaner but not specific enough for `金枪鱼三明治`.
- To avoid shipping obvious semantic mismatch, both keys remain on their existing fallback images for now.

## Source decisions

- `familymart-227`: `official_public`
  - `https://www.family.com.tw/Manager/MarketingBS/Content/Pic/food_0624_02.jpg`
- `familymart-693`: `official_public`
  - `https://www.family.com.tw/Manager/MarketingBS/Content/Pic/food_0624_03.jpg`

## Verification plan

After asset generation and sync:

1. Run manifest and script syntax checks.
2. Run `test_food_image_keys.py`.
3. Run `scripts/check_runtime.ps1`.
4. Run visual runtime checks for:
   - `全家 饭团`
   - `全家 三明治`
   - regression keywords already covered in the image verification script
