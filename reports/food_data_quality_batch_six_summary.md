# Food Data Quality Batch Six

本批为最后 26 条基础食材补充统一份量字段，未修改 API、数据库模型或搜索逻辑。

- source: `backend/app/food_catalog_sources/data_quality_portions_batch_six.json`
- applied catalog: `backend/app/foods.json`
- rule id: `fixed_rule_portion_v1`
- updated fields: `serving_size_g`, `portion_hint`, `source`, `source_updated_at`
- covered groups: 油脂、主食、轻食、蛋类、豆制品、肉类

## Verification

- source patch records: `26`
- catalog records updated in this batch: `26`
- total foods: `846`
- `serving_size_g` missing: `26 -> 0`
- `portion_hint` missing: `26 -> 0`
- `node scripts/validate_food_target_mode.cjs`: passed, `failures=0`
- `node scripts/build_food_asset_baseline.cjs`: passed, both clients `853/853`, missing files `0`, oversized files `0`
- runtime database verification: pending because Docker Desktop is unavailable
