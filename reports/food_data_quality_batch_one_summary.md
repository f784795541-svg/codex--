# Food Data Quality Batch One

本批为 21 条基础食材补充统一的常见份量字段，未改变 API、数据库模型或搜索逻辑。

- source: `backend/app/food_catalog_sources/data_quality_portions_batch_one.json`
- applied catalog: `backend/app/foods.json`
- rule id: `fixed_rule_portion_v1`
- updated fields: `serving_size_g`, `portion_hint`, `source`, `source_updated_at`
- covered foods: 面条、全麦面包、白面包、燕麦片、红薯、土豆、南瓜、山药、饺子、鸡蛋、鸭蛋、鸡腿肉、鸡翅、牛里脊、牛腱、瘦牛肉、猪里脊、瘦猪肉、羊腿肉、金枪鱼、三文鱼

## Verification

- source patch records: `21`
- catalog records updated: `21`
- source/catalog mismatches: `0`
- total foods: `846`
- `serving_size_g` missing: `125 -> 104`
- `portion_hint` missing: `125 -> 104`
- `node scripts/validate_food_target_mode.cjs`: passed, `failures=0`
- `node scripts/build_food_asset_baseline.cjs`: passed, both clients `853/853`, missing files `0`, oversized files `0`
- runtime database verification: pending because Docker Desktop is unavailable
