# Food Real Photo Batch 133

- image key: `hema-616`
- food: 盒马 三文鱼寿司
- source: [Public product-style sushi image](https://cbu01.alicdn.com/img/ibank/O1CN01yFkK081KbrdYS0LcK_!!2220769711183-0-cib.310x310.jpg)
- source cache: `reports/candidate_images/hema-616/candidate-2`
- semantic check: the image clearly shows a boxed sushi assortment with multiple salmon nigiri pieces
- classification: `near_product_photo` (generic product-style image; no visible Hema branding and not an official Hema packshot)
- normalized output: `750x750 WebP`, `30,412 bytes`
- frontend/miniprogram SHA-256 (both): `cdd08bb128904a349ed58109ea3ad143dcb992c1aee9ceaa62a6356f4062ea96`
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `178` to `177` total real-photo items (`P1=54`, `P2=123`)

## Verification

- visual semantic spot-check: passed for boxed sushi and salmon nigiri visibility
- brand qualification: explicitly recorded as near-product photo because Hema branding is not visible
- frontend, miniprogram and `A:\body-food-images` files are byte-identical and within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
