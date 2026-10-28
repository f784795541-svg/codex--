# Food Real Photo Batch 66

- Date: 2026-09-01
- Scope: P0 McDonald's chicken asset
- Completed key: `mcd-685`
- Source quality: `near_product_photo`

## Selected Source

| image_key | catalog item | candidate | reason |
|---|---|---|---|
| `mcd-685` | 麦当劳 麦麦脆汁鸡 鸡翅 | `reports/candidate_images/p0-mcd685/mcd-685-c2.jpg` | The public promotional image explicitly shows `McCrispy Chicken / 麦麦脆汁鸡` and branded product presentation; it contains multiple chicken cuts rather than an isolated wing, so it is recorded as near-product photo and is not reused for the separate leg key. |

## Asset Checks

- Generated `frontend/assets/foods/mcd-685.webp`: 750x750, 162,300 bytes.
- Copied the same WebP to the miniprogram asset directory.
- Frontend and miniprogram manifests remain `841/841`.
- Missing assets: `0`.
- Raster assets over 300KB: `0`.
- Food image audit: `high=0`.
- Target mode validation: `failures=0`.
- Refreshed backlog after audit: `263` rows (`P0=7`, `P1=133`, `P2=123`).

## Visual Spot Check

The normalized frontend and miniprogram files were opened side by side. They are identical, square, legible, and preserve the McCrispy Chicken label and fried-chicken subject.

## Runtime Verification

Not completed because Docker Desktop's Linux engine remains unavailable. Backend API, database write, and in-app search verification remain pending until the container engine is running.
