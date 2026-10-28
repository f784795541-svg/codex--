# Food data field audit

The catalog currently contains 846 active food records. All records have the fields required by the target mode for serving and search:

- `serving_size_g`: 846/846
- `portion_hint`: 846/846
- `aliases_text`: 846/846
- `search_text`: 846/846
- nutrition values: no invalid values reported by the catalog baseline
- duplicate names: none reported

`brand` is empty on 464 records after correcting eight deterministic omissions: `百事可乐`、`百事无糖可乐`、美年达两种口味、雪碧、芬达两种口味和北冰洋橙汽水 now carry the brand stated in their names. The remaining empty-brand records are concentrated in generic ingredients and dishes (for example vegetables, staple foods, and home-style dishes), where assigning a commercial brand would be incorrect. Branded retail and chain-restaurant records retain a brand value. Therefore the remaining empty-brand count is tracked as a classification item, not bulk-filled with guesses.

The remaining data backlog contains 66 priority query groups (P0 21, P1 33, P2 12). These are review/coverage tasks for commonly searched brands, dishes, drinks, and staples; they are not evidence that required nutrition or serving fields are missing.

Audit source: `reports/food_catalog_baseline.json`, generated from `backend/app/foods.json` with the catalog baseline script.

## Follow-up consistency check

The set of 84 brand values already present in the catalog was matched against every record with an empty `brand`. No additional record contained a known brand string in its name. This confirms that the eight recent brand repairs are the only deterministic omissions found by the current catalog-internal rule; remaining empty values require external evidence and are intentionally left unchanged.

## Search-text normalization note

An initial literal comparison found 382 names that were not byte-for-byte substrings of `search_text`. This is expected: `build_food_search_text` deliberately removes spaces and punctuation, and `food_matches_query` applies the same `compact_search_text` normalization to the name, brand, category, and aliases before matching. The apparent mismatch is therefore not a search defect and no bulk rewrite of `search_text` was made.
