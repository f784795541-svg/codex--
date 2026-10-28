# Food Catalog Data Batch 85

- Date: 2026-09-01
- Scope: P0 snack and ice-cream catalog completion
- Added foods: 8
  - `百事 原味薯片` -> food_id 838, image_key `pepsi-lays-original`
  - `百事 黄瓜味薯片` -> food_id 839, image_key `pepsi-lays-cucumber`
  - `百事 番茄味薯片` -> food_id 840, image_key `pepsi-lays-tomato`
  - `和路雪 可爱多草莓甜筒冰淇淋` -> food_id 835, image_key `walls-cornetto-strawberry-cone`
  - `八喜 巧克力冰淇淋` -> food_id 836, image_key `baxi-chocolate-tub`
  - `八喜 草莓冰淇淋` -> food_id 837, image_key `baxi-strawberry-tub`
  - `品客原味薯片` -> food_id 841, image_key `pringles-original`
  - `妙脆角原味玉米脆片` -> food_id 842, image_key `bugles-corn-snack`

## Data Standard

- Every added row includes brand, nutrition values, serving size, portion hint, aliases, source type, and source update date where applicable.
- New rows are appended after the existing source records so the original catalog IDs remain stable.
- New product-level image keys are exact mappings; each currently uses a dedicated SVG fallback until a verified retail/product photo is accepted.

## Verification

- Catalog: 842 foods; no duplicate names; invalid nutrition checks remain clear.
- P0/P1 data backlog: 4 missing terms remain, all P1 (`茶饮料`, `喜茶`, `奈雪`, `兰州拉面`).
- Image asset validation: frontend/miniprogram `849/849`, missing files `0`, oversized raster files `0`.
- Image standard: 250 real WebP assets, all 750x750 and below 300KB; new product keys are fallback-only.
- Static target validation: `failures=0`.

## Pending

- Replace the eight new fallback keys with semantically verified public product images.
- Continue the remaining 228 real-photo backlog (`P0=3`, `P1=102`, `P2=123`).
- Runtime PostgreSQL/search/miniprogram checks remain blocked until Docker Desktop Linux engine is available.
