# Food Data Quality Batch Four

本批为 20 条水果、蔬菜、坚果和食用油补充统一份量字段，未修改 API、数据库模型或搜索逻辑。

- source: `backend/app/food_catalog_sources/data_quality_portions_batch_four.json`
- applied catalog: `backend/app/foods.json`
- rule id: `fixed_rule_portion_v1`
- updated fields: `serving_size_g`, `portion_hint`, `source`, `source_updated_at`
- covered groups: 水果、蔬菜、坚果、油脂

## Verification

- source patch records: `20`
- catalog records updated in this batch: `20`
- total foods: `846`
- `serving_size_g` missing: `66 -> 46`
- `portion_hint` missing: `66 -> 46`
- `node scripts/validate_food_target_mode.cjs`: passed, `failures=0`
- `node scripts/build_food_asset_baseline.cjs`: passed, both clients `853/853`, missing files `0`, oversized files `0`
- runtime database verification: pending because Docker Desktop is unavailable
